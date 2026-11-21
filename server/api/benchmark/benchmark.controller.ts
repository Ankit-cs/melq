import { Request, Response } from "express";
import { prisma } from "../../config/prisma.config";
import { BenchmarkRunner } from "../../engine/benchmark/benchmark.runner";
import { seedBenchmarkSuites } from "../../engine/benchmark/suites.seed";

export class BenchmarkController {
  /**
   * Get all available benchmark suites with tasks
   */
  static async getSuites(req: Request, res: Response): Promise<void> {
    try {
      await seedBenchmarkSuites();
      const suites = await prisma.benchmarkSuite.findMany({
        include: {
          tasks: true,
        },
        orderBy: { createdAt: "asc" },
      });
      res.json({ success: true, data: suites });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Get all registered agent profiles
   */
  static async getAgents(req: Request, res: Response): Promise<void> {
    try {
      await seedBenchmarkSuites();
      const agents = await prisma.benchmarkAgentProfile.findMany({
        orderBy: { createdAt: "asc" },
      });
      res.json({ success: true, data: agents });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Register a new external agent profile (LangChain, CrewAI, AutoGen, Custom Webhook)
   */
  static async registerAgent(req: Request, res: Response): Promise<void> {
    try {
      const { name, framework, modelName, description, endpointUrl } = req.body;
      if (!name || !framework) {
        res.status(400).json({ success: false, error: "Name and framework are required" });
        return;
      }

      const agent = await prisma.benchmarkAgentProfile.create({
        data: {
          name,
          framework,
          modelName: modelName || "gemini-2.0-flash",
          description,
          endpointUrl,
          type: endpointUrl ? "EXTERNAL_WEBHOOK" : "INTERNAL_REACT",
        },
      });

      res.status(201).json({ success: true, data: agent });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Launch a new benchmark run
   */
  static async createRun(req: Request, res: Response): Promise<void> {
    try {
      const { suiteId, agentIds, name, iterations, chaosConfig } = req.body;

      if (!suiteId || !agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
        res.status(400).json({ success: false, error: "suiteId and at least one agentId required" });
        return;
      }

      const suite = await prisma.benchmarkSuite.findUnique({
        where: { id: suiteId },
      });

      if (!suite) {
        res.status(404).json({ success: false, error: "Benchmark suite not found" });
        return;
      }

      // Create run in database
      const run = await prisma.benchmarkRun.create({
        data: {
          suiteId,
          name: name || `${suite.name} - Comparative Benchmark`,
          iterations: Number(iterations) || 3,
          chaosConfig: chaosConfig || {
            enableFailingTools: true,
            failureRate: 0.4,
            enableRateLimits: true,
            enableMisleadingContext: true,
          },
          status: "PENDING",
        },
      });

      // Pre-link selected agent executions placeholder so runner knows which agents to run
      for (const agentId of agentIds) {
        await prisma.benchmarkExecution.create({
          data: {
            runId: run.id,
            taskId: (await prisma.benchmarkTask.findFirst({ where: { suiteId } }))?.id || "",
            agentId,
            status: "PENDING",
          },
        });
      }

      // Execute asynchronously in background
      BenchmarkRunner.runBenchmark(run.id).catch((err) => {
        console.error("Async benchmark runner error:", err);
      });

      res.status(201).json({
        success: true,
        message: "Benchmark run initiated",
        data: { runId: run.id },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Get all benchmark runs history
   */
  static async getRuns(req: Request, res: Response): Promise<void> {
    try {
      const runs = await prisma.benchmarkRun.findMany({
        include: {
          suite: true,
          executions: {
            include: { agent: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      res.json({ success: true, data: runs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Get detailed run comparison matrix and execution traces
   */
  static async getRunById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const run = await prisma.benchmarkRun.findUnique({
        where: { id },
        include: {
          suite: {
            include: { tasks: true },
          },
          executions: {
            include: {
              agent: true,
              task: true,
              traces: {
                orderBy: { stepIndex: "asc" },
              },
            },
            orderBy: [{ taskId: "asc" }, { agentId: "asc" }, { iteration: "asc" }],
          },
        },
      });

      if (!run) {
        res.status(404).json({ success: false, error: "Benchmark run not found" });
        return;
      }

      res.json({ success: true, data: run });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Get global Agent Leaderboard ranked by performance metrics
   */
  static async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const agents = await prisma.benchmarkAgentProfile.findMany({
        include: {
          executions: {
            where: {
              status: { in: ["SUCCESS", "FAILED"] },
            },
          },
        },
      });

      const leaderboard = agents.map((agent: any) => {
        const total = agent.executions.length;
        if (total === 0) {
          return {
            id: agent.id,
            name: agent.name,
            framework: agent.framework,
            modelName: agent.modelName,
            totalRuns: 0,
            successRate: 0,
            resilienceScore: 0,
            avgScore: 0,
            avgLatencySec: 0,
            avgCostUsd: 0,
            avgTokens: 0,
            rank: 99,
          };
        }

        const successCount = agent.executions.filter((e: any) => e.success).length;
        const chaosExecs = agent.executions.filter((e: any) => e.chaosInjected);
        const chaosHandledCount = chaosExecs.filter((e: any) => e.chaosHandled && e.success).length;

        const avgScore = agent.executions.reduce((sum: number, e: any) => sum + e.score, 0) / total;
        const avgLatencyMs = agent.executions.reduce((sum: number, e: any) => sum + e.latencyMs, 0) / total;
        const avgCost = agent.executions.reduce((sum: number, e: any) => sum + e.totalCostUsd, 0) / total;
        const avgTokens =
          agent.executions.reduce((sum: number, e: any) => sum + e.promptTokens + e.completionTokens, 0) / total;

        return {
          id: agent.id,
          name: agent.name,
          framework: agent.framework,
          modelName: agent.modelName,
          totalRuns: total,
          successRate: Math.round((successCount / total) * 100),
          resilienceScore: chaosExecs.length > 0 ? Math.round((chaosHandledCount / chaosExecs.length) * 100) : 100,
          avgScore: Math.round(avgScore * 10) / 10,
          avgLatencySec: Math.round((avgLatencyMs / 1000) * 10) / 10,
          avgCostUsd: Math.round(avgCost * 100000) / 100000,
          avgTokens: Math.round(avgTokens),
        };
      });

      // Sort by overall score descending, then resilience descending
      leaderboard.sort((a: any, b: any) => b.avgScore - a.avgScore || b.resilienceScore - a.resilienceScore);

      const ranked = leaderboard.map((item: any, idx: number) => ({ ...item, rank: idx + 1 }));

      res.json({ success: true, data: ranked });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
