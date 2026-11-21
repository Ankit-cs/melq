"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Zap,
  ShieldAlert,
  Flame,
  Bot,
  Layers,
  Terminal,
  Activity,
  Award,
  RefreshCw,
} from "lucide-react";
import { fetchBenchmarkRun, BenchmarkRun, BenchmarkExecution } from "@/lib/benchmark-api";

export default function BenchmarkRunDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const runId = params.id as string;

  const [run, setRun] = useState<BenchmarkRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [selectedIteration, setSelectedIteration] = useState<number>(1);

  const loadRun = async () => {
    try {
      setLoading(true);
      const data = await fetchBenchmarkRun(runId);
      setRun(data);
      if (data.suite?.tasks?.length > 0 && !selectedTaskId) {
        setSelectedTaskId(data.suite.tasks[0].id);
      }
      if (data.executions?.length > 0 && !selectedAgentId) {
        setSelectedAgentId(data.executions[0].agentId);
      }
    } catch (err) {
      console.error("Error fetching benchmark run:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRun();
    const interval = setInterval(() => {
      if (run?.status === "RUNNING" || run?.status === "PENDING") {
        loadRun();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [runId, run?.status]);

  if (loading && !run) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#D9541E] border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading benchmark comparison matrix...</p>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-semibold text-foreground">Benchmark Run not found</p>
        <Link href="/benchmark" className="mt-4 inline-block text-sm text-[#D9541E] hover:underline">
          ← Return to Benchmarks
        </Link>
      </div>
    );
  }

  // Get distinct agents tested
  const agentMap = new Map();
  run.executions.forEach((e) => {
    if (e.agent) {
      agentMap.set(e.agentId, e.agent);
    }
  });
  const testedAgents = Array.from(agentMap.values());

  // Filter current active execution for inspection
  const activeExecution = run.executions.find(
    (e) =>
      e.taskId === selectedTaskId &&
      e.agentId === selectedAgentId &&
      e.iteration === selectedIteration,
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <Link
            href="/benchmark"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Benchmarks
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{run.name}</h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                run.status === "COMPLETED"
                  ? "bg-emerald-100 text-emerald-800"
                  : run.status === "RUNNING"
                    ? "bg-amber-100 text-amber-800 animate-pulse"
                    : "bg-zinc-100 text-zinc-800"
              }`}
            >
              {run.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Suite: <span className="font-semibold text-foreground">{run.suite?.name}</span> •{" "}
            {run.iterations}x Repeatability • {run.executions.length} Executions Recorded
          </p>
        </div>

        <button
          onClick={loadRun}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Status
        </button>
      </div>

      {/* Head-to-Head Comparative Summary Cards */}
      {run.summary && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#D9541E]" />
            <h2 className="text-base font-bold text-foreground">
              Head-to-Head Performance & Resilience Matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {Object.values(run.summary).map((summary: any, idx) => (
              <div
                key={summary.agentId}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-[#D9541E]/40"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-[#EBE3D4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D9541E]">
                      {summary.framework}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-foreground">{summary.agentName}</h3>
                    <p className="text-xs font-mono text-muted-foreground">{summary.modelName}</p>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-extrabold text-foreground">{summary.avgScore}</span>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Score / 100</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Task Success</span>
                    <span className="font-bold text-emerald-700 text-sm">{summary.successRate}%</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">Chaos Resilience</span>
                    <span className="font-bold text-[#D9541E] text-sm">{summary.resilienceScore}%</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">Avg Latency</span>
                    <span className="font-semibold text-foreground text-sm">{summary.avgLatencySec}s</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">Total Cost</span>
                    <span className="font-mono font-semibold text-foreground text-sm">
                      ${summary.totalCostUsd}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">Avg Steps</span>
                    <span className="font-semibold text-foreground">{summary.avgSteps} steps</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px]">Avg Tool Calls</span>
                    <span className="font-semibold text-foreground">{summary.avgToolCalls} calls</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task & Agent Selectors for Trace Inspection */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Step-by-Step Execution Trace & Failure Analysis
            </h2>
            <p className="text-xs text-muted-foreground">
              Inspect granular thoughts, tool invocations, chaos injections, and model reasoning loops
            </p>
          </div>

          {/* Iteration Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Iteration:</span>
            <div className="flex gap-1">
              {Array.from({ length: run.iterations }, (_, i) => i + 1).map((iter) => (
                <button
                  key={iter}
                  onClick={() => setSelectedIteration(iter)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold transition-colors ${
                    selectedIteration === iter
                      ? "bg-[#D9541E] text-white"
                      : "bg-secondary text-foreground hover:bg-accent"
                  }`}
                >
                  {iter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Tabs */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            Task Under Evaluation:
          </span>
          <div className="flex flex-wrap gap-2">
            {run.suite?.tasks?.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedTaskId === task.id
                    ? "bg-[#111111] text-[#F3EEE3] shadow-xs"
                    : "border border-border bg-[#F0E9DC]/40 text-foreground hover:bg-accent"
                }`}
              >
                {task.title}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Selector Tabs */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            Compare Agent Trace:
          </span>
          <div className="flex flex-wrap gap-2">
            {testedAgents.map((agent: any) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedAgentId === agent.id
                    ? "bg-[#D9541E] text-white shadow-xs"
                    : "border border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                {agent.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Execution View */}
        {activeExecution ? (
          <div className="space-y-6 pt-2">
            {/* Execution Scorecard */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-border/80 bg-[#F0E9DC]/50 p-4">
              <div>
                <span className="text-[11px] text-muted-foreground block">Result</span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold ${
                    activeExecution.success ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {activeExecution.success ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {activeExecution.status} ({activeExecution.score}/100)
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Latency</span>
                <span className="text-xs font-semibold text-foreground">
                  {(activeExecution.latencyMs / 1000).toFixed(2)}s
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Tokens / Cost</span>
                <span className="text-xs font-mono font-semibold text-foreground">
                  {activeExecution.promptTokens + activeExecution.completionTokens} tok (${activeExecution.totalCostUsd})
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Chaos Injected</span>
                <span className="text-xs font-bold text-foreground">
                  {activeExecution.chaosInjected ? (
                    <span className="text-[#D9541E] flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5" /> {activeExecution.chaosType || "Active"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </span>
              </div>
            </div>

            {/* Judge Evaluation Notes */}
            {activeExecution.evalNotes && (
              <div className="rounded-xl border border-[#D9541E]/20 bg-[#D9541E]/5 p-4">
                <span className="text-xs font-bold text-[#D9541E] uppercase tracking-wider block mb-1">
                  Gemini LLM-as-a-Judge Critique:
                </span>
                <p className="text-xs text-foreground leading-relaxed">{activeExecution.evalNotes}</p>
              </div>
            )}

            {/* Final Answer */}
            {activeExecution.finalAnswer && (
              <div className="rounded-xl border border-border bg-card p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Agent Final Output:
                </span>
                <div className="rounded-lg bg-secondary/50 p-3 text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                  {activeExecution.finalAnswer}
                </div>
              </div>
            )}

            {/* Trace Steps Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4 text-[#D9541E]" />
                <h3 className="text-sm font-bold text-foreground">
                  Execution Trace Steps ({activeExecution.traces?.length || 0} Events)
                </h3>
              </div>

              <div className="space-y-3">
                {activeExecution.traces?.map((step) => (
                  <div
                    key={step.id}
                    className={`rounded-xl border p-4 transition-all text-xs ${
                      step.isChaos
                        ? "border-red-300 bg-red-50/60 shadow-xs"
                        : step.type === "TOOL_CALL"
                          ? "border-[#D9541E]/30 bg-card"
                          : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#111111] text-[10px] font-bold text-white">
                          #{step.stepIndex}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            step.isChaos
                              ? "bg-red-200 text-red-900"
                              : step.type === "TOOL_CALL"
                                ? "bg-[#D9541E]/15 text-[#D9541E]"
                                : step.type === "FINAL_ANSWER"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-secondary text-foreground"
                          }`}
                        >
                          {step.type}
                        </span>
                        <span className="font-bold text-foreground">{step.name}</span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                        <span>{step.durationMs}ms</span>
                        {step.tokens ? <span>{step.tokens} tokens</span> : null}
                      </div>
                    </div>

                    {/* Step Content */}
                    {step.chaosDetails && (
                      <div className="mt-2 rounded-lg bg-red-100/80 p-2.5 text-red-900 text-xs font-medium">
                        ⚠️ <strong>Chaos Injected:</strong> {step.chaosDetails}
                      </div>
                    )}

                    {step.input && (
                      <div className="mt-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                          Input / Reasoning:
                        </span>
                        <div className="rounded-md bg-secondary/40 p-2 font-mono text-[11px] text-foreground whitespace-pre-wrap">
                          {typeof step.input === "object"
                            ? JSON.stringify(step.input, null, 2)
                            : String(step.input)}
                        </div>
                      </div>
                    )}

                    {step.output && (
                      <div className="mt-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                          Output / Observation:
                        </span>
                        <div className="rounded-md bg-secondary/60 p-2 font-mono text-[11px] text-foreground whitespace-pre-wrap">
                          {typeof step.output === "object"
                            ? JSON.stringify(step.output, null, 2)
                            : String(step.output)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No execution trace recorded for this agent and iteration combination.
          </div>
        )}
      </div>
    </div>
  );
}
