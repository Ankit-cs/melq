import { prisma } from "../../config/prisma.config";
import { logger } from "../../config/logger.config";
import { ChaosConfig, ChaosEngine } from "../chaos/chaos.engine";
import { IBenchmarkAgent } from "./agents/agent.interface";
import { ResilientReactAgent } from "./agents/react.agent";
import { NaiveDirectAgent } from "./agents/naive.agent";
import { DecomposedPipelineAgent } from "./agents/pipeline.agent";
import { ExternalWebhookAgent } from "./agents/webhook.agent";
import { AgentEvaluator } from "../evaluator/evaluator";

export interface RunBenchmarkParams {
  suiteId: string;
  agentIds: string[];
  iterations: number; // e.g. 3
  chaosConfig: ChaosConfig;
}

export class BenchmarkRunner {
  static getAgentInstance(profile: {
    id: string;
    name: string;
    framework: string;
    modelName: string;
    type: string;
    endpointUrl?: string | null;
  }): IBenchmarkAgent {
    switch (profile.type) {
      case "INTERNAL_REACT":
        return new ResilientReactAgent();
      case "INTERNAL_NAIVE":
        return new NaiveDirectAgent();
      case "INTERNAL_PIPELINE":
        return new DecomposedPipelineAgent();
      case "EXTERNAL_WEBHOOK":
        return new ExternalWebhookAgent(
          profile.name,
          profile.framework,
          profile.modelName,
          profile.endpointUrl || "http://localhost:8000/api/mock-agent",
        );
      default:
        return new ResilientReactAgent();
    }
  }

  static async runBenchmark(runId: string): Promise<void> {
    const run = await prisma.benchmarkRun.findUnique({
      where: { id: runId },
      include: {
        suite: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!run) {
      throw new Error(`BenchmarkRun ${runId} not found`);
    }

    // Set to RUNNING
    await prisma.benchmarkRun.update({
      where: { id: runId },
      data: { status: "RUNNING" },
    });

    try {
      const chaosConfig = run.chaosConfig as unknown as ChaosConfig;
      const iterations = run.iterations || 3;

      // Fetch all agent profiles to test
      const executionsExisting = await prisma.benchmarkExecution.findMany({
        where: { runId },
        select: { agentId: true },
        distinct: ["agentId"],
      });

      const agentProfiles = await prisma.benchmarkAgentProfile.findMany({
        where: {
          id: { in: executionsExisting.map((e: any) => e.agentId) },
        },
      });

      logger.info(
        `Starting Benchmark Run "${run.name}" [${agentProfiles.length} agents, ${run.suite.tasks.length} tasks, ${iterations}x iterations]`,
      );

      // Iterate through each agent, each task, and each repeat iteration
      for (const profile of agentProfiles) {
        const agent = this.getAgentInstance(profile);

        for (const task of run.suite.tasks) {
          for (let iter = 1; iter <= iterations; iter++) {
            logger.info(
              `Evaluating Agent "${agent.name}" on Task "${task.title}" (Iteration ${iter}/${iterations})...`,
            );

            // Create execution record
            const execution = await prisma.benchmarkExecution.create({
              data: {
                runId: run.id,
                taskId: task.id,
                agentId: profile.id,
                iteration: iter,
                status: "RUNNING",
              },
            });

            const traceSteps: Array<{
              stepIndex: number;
              type: any;
              name: string;
              input?: any;
              output?: any;
              durationMs: number;
              tokens?: number;
              isChaos?: boolean;
              chaosDetails?: string | null;
            }> = [];

            let stepCounter = 1;
            const chaosEngine = new ChaosEngine(chaosConfig);
            let chaosTriggeredInRun = false;
            let lastChaosType: string | undefined;

            const startTime = Date.now();
            let agentOutput;

            try {
              agentOutput = await agent.run({
                taskId: task.id,
                taskTitle: task.title,
                prompt: task.prompt,
                availableTools: task.availableTools as string[],
                chaosEngine,
                onTraceStep: (step) => {
                  if (step.isChaos) {
                    chaosTriggeredInRun = true;
                    lastChaosType = step.name;
                  }
                  traceSteps.push({
                    stepIndex: stepCounter++,
                    type: step.type,
                    name: step.name,
                    input: (step.input as any) || null,
                    output: (step.output as any) || null,
                    durationMs: step.durationMs || 0,
                    tokens: step.tokens || 0,
                    isChaos: !!step.isChaos,
                    chaosDetails: step.chaosDetails || null,
                  });
                },
              });
            } catch (err: any) {
              agentOutput = {
                finalAnswer: `Agent failed with exception: ${err.message}`,
                totalTokens: 50,
                promptTokens: 50,
                completionTokens: 0,
                stepsCount: stepCounter,
                toolCallsCount: 0,
                chaosHandled: false,
                error: err.message,
              };
            }

            const totalLatency = Date.now() - startTime;

            // Evaluate output using our Gemini evaluator
            const evalResult = await AgentEvaluator.evaluate({
              taskPrompt: task.prompt,
              expectedCriteria: task.expectedOutput,
              evalRules: (task.evalCriteria as any) || {},
              agentOutput: agentOutput.finalAnswer,
              chaosInjected: chaosTriggeredInRun,
            });

            const costUsd = AgentEvaluator.computeCost(
              profile.modelName,
              agentOutput.promptTokens,
              agentOutput.completionTokens,
            );

            // Update execution record
            await prisma.benchmarkExecution.update({
              where: { id: execution.id },
              data: {
                status: evalResult.success ? "SUCCESS" : "FAILED",
                success: evalResult.success,
                score: evalResult.score,
                latencyMs: totalLatency,
                promptTokens: agentOutput.promptTokens,
                completionTokens: agentOutput.completionTokens,
                totalCostUsd: costUsd,
                stepsCount: agentOutput.stepsCount,
                toolCallsCount: agentOutput.toolCallsCount,
                chaosInjected: chaosTriggeredInRun,
                chaosType: lastChaosType || null,
                chaosHandled: agentOutput.chaosHandled,
                finalAnswer: agentOutput.finalAnswer,
                evalNotes: evalResult.notes,
                error: agentOutput.error || null,
              },
            });

            // Persist all granular execution trace steps
            if (traceSteps.length > 0) {
              await prisma.executionTraceStep.createMany({
                data: traceSteps.map((s) => ({
                  executionId: execution.id,
                  stepIndex: s.stepIndex,
                  type: s.type,
                  name: s.name,
                  input: s.input,
                  output: s.output,
                  durationMs: s.durationMs,
                  tokens: s.tokens,
                  isChaos: s.isChaos || false,
                  chaosDetails: s.chaosDetails,
                })),
              });
            }
          }
        }
      }

      // Generate Comparative Summary
      const allExecutions = await prisma.benchmarkExecution.findMany({
        where: { runId },
        include: { agent: true },
      });

      const summaryByAgent: Record<string, any> = {};

      for (const profile of agentProfiles) {
        const agentExecs = allExecutions.filter((e: any) => e.agentId === profile.id);
        const total = agentExecs.length || 1;
        const successCount = agentExecs.filter((e: any) => e.success).length;
        const chaosExecs = agentExecs.filter((e: any) => e.chaosInjected);
        const chaosHandledCount = chaosExecs.filter((e: any) => e.chaosHandled && e.success).length;

        const avgScore = agentExecs.reduce((sum: number, e: any) => sum + e.score, 0) / total;
        const avgLatencyMs = agentExecs.reduce((sum: number, e: any) => sum + e.latencyMs, 0) / total;
        const totalCostUsd = agentExecs.reduce((sum: number, e: any) => sum + e.totalCostUsd, 0);
        const avgTokens = agentExecs.reduce((sum: number, e: any) => sum + e.promptTokens + e.completionTokens, 0) / total;
        const avgSteps = agentExecs.reduce((sum: number, e: any) => sum + e.stepsCount, 0) / total;
        const avgToolCalls = agentExecs.reduce((sum: number, e: any) => sum + e.toolCallsCount, 0) / total;

        summaryByAgent[profile.id] = {
          agentId: profile.id,
          agentName: profile.name,
          framework: profile.framework,
          modelName: profile.modelName,
          successRate: Math.round((successCount / total) * 100),
          resilienceScore: chaosExecs.length > 0 ? Math.round((chaosHandledCount / chaosExecs.length) * 100) : 100,
          avgScore: Math.round(avgScore * 10) / 10,
          avgLatencySec: Math.round((avgLatencyMs / 1000) * 10) / 10,
          totalCostUsd: Math.round(totalCostUsd * 10000) / 10000,
          avgTokens: Math.round(avgTokens),
          avgSteps: Math.round(avgSteps * 10) / 10,
          avgToolCalls: Math.round(avgToolCalls * 10) / 10,
          runsCount: total,
        };
      }

      await prisma.benchmarkRun.update({
        where: { id: runId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          summary: summaryByAgent,
        },
      });

      logger.info(`Benchmark Run "${run.name}" completed successfully.`);
    } catch (err: any) {
      logger.error(`Benchmark Run ${runId} failed: ${err.message}`);
      await prisma.benchmarkRun.update({
        where: { id: runId },
        data: { status: "FAILED" },
      });
    }
  }
}
