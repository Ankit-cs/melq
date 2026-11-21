"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gauge,
  Play,
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Sparkles,
  Bot,
  Activity,
} from "lucide-react";
import {
  fetchBenchmarkSuites,
  fetchBenchmarkAgents,
  createBenchmarkRun,
  fetchBenchmarkRuns,
  BenchmarkSuite,
  BenchmarkAgentProfile,
  BenchmarkRun,
} from "@/lib/benchmark-api";

export default function BenchmarkDashboardPage() {
  const router = useRouter();
  const [suites, setSuites] = useState<BenchmarkSuite[]>([]);
  const [agents, setAgents] = useState<BenchmarkAgentProfile[]>([]);
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [iterations, setIterations] = useState<number>(3);
  const [enableFailingTools, setEnableFailingTools] = useState(true);
  const [enableRateLimits, setEnableRateLimits] = useState(true);
  const [enableMisleadingContext, setEnableMisleadingContext] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [suitesData, agentsData, runsData] = await Promise.all([
        fetchBenchmarkSuites(),
        fetchBenchmarkAgents(),
        fetchBenchmarkRuns(),
      ]);
      setSuites(suitesData);
      setAgents(agentsData);
      setRuns(runsData);

      if (suitesData.length > 0 && !selectedSuiteId) {
        setSelectedSuiteId(suitesData[0].id);
      }
      if (agentsData.length > 0 && selectedAgentIds.length === 0) {
        // Default select top 2-3 agents for comparison
        setSelectedAgentIds(agentsData.slice(0, 3).map((a) => a.id));
      }
    } catch (err) {
      console.error("Error loading benchmark data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAgent = (agentId: string) => {
    setSelectedAgentIds((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId],
    );
  };

  const handleLaunchBenchmark = async () => {
    if (!selectedSuiteId || selectedAgentIds.length === 0) {
      alert("Please select a benchmark suite and at least one agent.");
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedSuite = suites.find((s) => s.id === selectedSuiteId);
      const result = await createBenchmarkRun({
        suiteId: selectedSuiteId,
        agentIds: selectedAgentIds,
        name: `${selectedSuite?.name || "Benchmark"} - ${selectedAgentIds.length} Agents Comparative`,
        iterations,
        chaosConfig: {
          enableFailingTools,
          failureRate: 0.4,
          enableRateLimits,
          enableMisleadingContext,
        },
      });

      setIsModalOpen(false);
      router.push(`/benchmark/${result.runId}`);
    } catch (err: any) {
      alert(`Failed to launch benchmark: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D9541E] text-white">
              <Gauge className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9541E]">
              Autonomous Agent Benchmarking
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            AI Agent Benchmark & Chaos Arena
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Framework-independent evaluations across identical tasks, measuring success, step count, tool efficiency, cost, and chaos resilience.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D9541E] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#D9541E]/25 hover:bg-[#C24716] active:scale-[0.98] transition-all"
          >
            <Play className="h-4 w-4 fill-white" />
            Launch Benchmark
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Registered Agents</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBE3D4] text-[#D9541E]">
              <Bot className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">{agents.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">LangChain, CrewAI, Quelm, Webhooks</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Test Suites Available</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBE3D4] text-[#111111]">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">{suites.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Research, Customer Ops, Data Pipeline</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Chaos Scenarios</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <ShieldAlert className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">3 Injections</p>
          <p className="mt-1 text-xs text-muted-foreground">500 Tool Errors, 429 Rate Limits, Traps</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Benchmarks Run</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBE3D4] text-[#D9541E]">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">{runs.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Multi-iteration comparative sessions</p>
        </div>
      </div>

      {/* Available Suites Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Standard Benchmark Suites
          </h2>
          <span className="text-xs font-medium text-muted-foreground">
            Deterministic Ground-Truth Evaluations
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {suites.map((suite) => (
            <div
              key={suite.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-[#D9541E]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#EBE3D4] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D9541E]">
                    {suite.category}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {suite.tasks.length} Tasks
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-foreground">{suite.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {suite.description}
                </p>
              </div>

              <div className="mt-6 border-t border-border/60 pt-4">
                <button
                  onClick={() => {
                    setSelectedSuiteId(suite.id);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary py-2 text-xs font-semibold text-foreground hover:bg-[#D9541E] hover:text-white transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  Run Suite Benchmark
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark Runs History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Comparative Benchmark Runs
          </h2>
          <Link
            href="/leaderboard"
            className="text-xs font-semibold text-[#D9541E] hover:underline flex items-center gap-1"
          >
            View Global Leaderboard <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {runs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
            <Gauge className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h3 className="mt-4 text-base font-semibold text-foreground">No benchmark runs yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Launch your first head-to-head comparison to evaluate agent resilience, latency and token costs.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D9541E] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#C24716]"
            >
              <Play className="h-4 w-4 fill-white" />
              Launch First Benchmark
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <div
                key={run.id}
                className="group rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-[#D9541E]/40 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-foreground">{run.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          run.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : run.status === "RUNNING"
                              ? "bg-amber-100 text-amber-800 animate-pulse"
                              : "bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        {run.status}
                      </span>
                      <span className="rounded-full bg-[#EBE3D4] px-2 py-0.5 text-[10px] font-medium text-[#111111]">
                        {run.iterations}x Repeatability
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Suite: <span className="font-semibold text-foreground">{run.suite?.name}</span> • Created:{" "}
                      {new Date(run.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/benchmark/${run.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2 text-xs font-semibold text-[#F3EEE3] hover:bg-[#D9541E] transition-colors"
                  >
                    Inspect Traces & Matrix
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Agent Comparison Mini Cards */}
                {run.summary && (
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.values(run.summary).map((agentSummary: any) => (
                      <div
                        key={agentSummary.agentId}
                        className="rounded-xl border border-border/70 bg-[#F0E9DC]/40 p-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            {agentSummary.agentName}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {agentSummary.framework}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-lg bg-card p-1.5 border border-border/50">
                            <span className="text-[10px] text-muted-foreground block">Success</span>
                            <span className="text-xs font-bold text-emerald-700">
                              {agentSummary.successRate}%
                            </span>
                          </div>
                          <div className="rounded-lg bg-card p-1.5 border border-border/50">
                            <span className="text-[10px] text-muted-foreground block">Resilience</span>
                            <span className="text-xs font-bold text-[#D9541E]">
                              {agentSummary.resilienceScore}%
                            </span>
                          </div>
                          <div className="rounded-lg bg-card p-1.5 border border-border/50">
                            <span className="text-[10px] text-muted-foreground block">Avg Latency</span>
                            <span className="text-xs font-bold text-foreground">
                              {agentSummary.avgLatencySec}s
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Launch Benchmark Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-[#FAF7F2] p-6 text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9541E] text-white">
                  <Flame className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">Configure Benchmark Arena</h3>
                  <p className="text-xs text-muted-foreground">
                    Evaluate agents under identical conditions with chaos stress-testing
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBE3D4] hover:bg-[#DED4C3] text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
              {/* Suite Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  1. Select Benchmark Test Suite
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {suites.map((suite) => (
                    <div
                      key={suite.id}
                      onClick={() => setSelectedSuiteId(suite.id)}
                      className={`cursor-pointer rounded-xl border p-3 text-left transition-all ${
                        selectedSuiteId === suite.id
                          ? "border-[#D9541E] bg-[#D9541E]/10 ring-2 ring-[#D9541E]/20"
                          : "border-border bg-card hover:bg-accent"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-[#D9541E] uppercase block">
                        {suite.category}
                      </span>
                      <p className="text-xs font-bold mt-1 text-foreground">{suite.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Multi-Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  2. Select Agents to Compare (Head-to-Head)
                </label>
                <div className="space-y-2">
                  {agents.map((agent) => {
                    const isChecked = selectedAgentIds.includes(agent.id);
                    return (
                      <div
                        key={agent.id}
                        onClick={() => handleToggleAgent(agent.id)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                          isChecked
                            ? "border-[#D9541E] bg-[#D9541E]/10"
                            : "border-border bg-card hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="h-4 w-4 rounded accent-[#D9541E]"
                          />
                          <div>
                            <p className="text-xs font-bold text-foreground">{agent.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              Framework: {agent.framework} • Model: {agent.modelName}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-mono text-foreground">
                          {agent.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chaos Testing Injections */}
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                    3. Failure & Chaos Testing (Mandatory Criteria)
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-foreground">
                      ⚡ Failing Tools (Intermittent HTTP 500 error on tool calls)
                    </span>
                    <input
                      type="checkbox"
                      checked={enableFailingTools}
                      onChange={(e) => setEnableFailingTools(e.target.checked)}
                      className="h-4 w-4 accent-[#D9541E]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-foreground">
                      🚦 Model Rate Limits (Simulate HTTP 429 quota backpressure)
                    </span>
                    <input
                      type="checkbox"
                      checked={enableRateLimits}
                      onChange={(e) => setEnableRateLimits(e.target.checked)}
                      className="h-4 w-4 accent-[#D9541E]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-foreground">
                      🎭 Misleading Context (Inject adversarial distractor into tool outputs)
                    </span>
                    <input
                      type="checkbox"
                      checked={enableMisleadingContext}
                      onChange={(e) => setEnableMisleadingContext(e.target.checked)}
                      className="h-4 w-4 accent-[#D9541E]"
                    />
                  </label>
                </div>
              </div>

              {/* Repeatability Test */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    4. Repeatability (Measure Variance & Reliability)
                  </label>
                  <span className="text-xs font-bold text-[#D9541E]">{iterations}x Repeated Runs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full accent-[#D9541E]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>1x (Smoke Test)</span>
                  <span>3x (Recommended)</span>
                  <span>5x (High Confidence)</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting || selectedAgentIds.length === 0}
                onClick={handleLaunchBenchmark}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D9541E] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#C24716] disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>Launching Run...</>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-white" />
                    Execute Benchmark Arena
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
