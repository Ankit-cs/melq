"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  ShieldAlert,
  Zap,
  ArrowRight,
  Plus,
  RefreshCw,
  Bot,
  ExternalLink,
  Flame,
} from "lucide-react";
import {
  fetchLeaderboard,
  registerBenchmarkAgent,
  LeaderboardEntry,
} from "@/lib/benchmark-api";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Registration Form
  const [name, setName] = useState("");
  const [framework, setFramework] = useState("LangChain");
  const [modelName, setModelName] = useState("gemini-2.0-flash");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await fetchLeaderboard();
      setEntries(data);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !framework) return;

    try {
      setSubmitting(true);
      await registerBenchmarkAgent({
        name,
        framework,
        modelName,
        endpointUrl: endpointUrl || undefined,
        description,
      });
      setIsRegisterOpen(false);
      setName("");
      setEndpointUrl("");
      setDescription("");
      loadLeaderboard();
    } catch (err: any) {
      alert(`Failed to register agent: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D9541E] text-white">
              <Trophy className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9541E]">
              Global Agent Rankings
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            AI Agent Resilience Leaderboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Ranked objectively on task completion, chaos failure survival, cost efficiency, and reasoning speed across repeated trials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={loadLeaderboard}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-xs font-semibold text-[#F3EEE3] shadow-md hover:bg-[#D9541E] transition-all"
          >
            <Plus className="h-4 w-4" />
            Register External Agent
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-[#F0E9DC]/60 text-[11px] font-bold uppercase tracking-wider text-[#6B6358]">
              <tr>
                <th className="py-4 px-5">Rank</th>
                <th className="py-4 px-5">Agent & Framework</th>
                <th className="py-4 px-5 text-center">Score / 100</th>
                <th className="py-4 px-5 text-center">Task Success</th>
                <th className="py-4 px-5 text-center">Chaos Resilience</th>
                <th className="py-4 px-5 text-center">Avg Latency</th>
                <th className="py-4 px-5 text-center">Avg Cost</th>
                <th className="py-4 px-5 text-center">Total Runs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {entries.map((agent) => (
                <tr key={agent.id} className="transition-colors hover:bg-[#FAF7F2]">
                  {/* Rank */}
                  <td className="py-4 px-5 font-bold">
                    {agent.rank === 1 ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-sm">
                        🥇
                      </span>
                    ) : agent.rank === 2 ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-zinc-800 text-sm">
                        🥈
                      </span>
                    ) : agent.rank === 3 ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-900 text-sm">
                        🥉
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-mono">#{agent.rank}</span>
                    )}
                  </td>

                  {/* Agent & Framework */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EBE3D4] text-[#D9541E]">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{agent.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {agent.framework} • <span className="font-mono">{agent.modelName}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Overall Score */}
                  <td className="py-4 px-5 text-center">
                    <span className="inline-block rounded-lg bg-secondary px-2.5 py-1 text-sm font-extrabold text-foreground">
                      {agent.avgScore}
                    </span>
                  </td>

                  {/* Task Success */}
                  <td className="py-4 px-5 text-center">
                    <span className="font-bold text-emerald-700 text-xs">
                      {agent.successRate}%
                    </span>
                  </td>

                  {/* Chaos Resilience */}
                  <td className="py-4 px-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        agent.resilienceScore >= 80
                          ? "bg-emerald-100 text-emerald-800"
                          : agent.resilienceScore >= 50
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      <ShieldAlert className="h-3 w-3" />
                      {agent.resilienceScore}%
                    </span>
                  </td>

                  {/* Avg Latency */}
                  <td className="py-4 px-5 text-center font-medium text-foreground">
                    {agent.avgLatencySec}s
                  </td>

                  {/* Avg Cost */}
                  <td className="py-4 px-5 text-center font-mono text-muted-foreground">
                    ${agent.avgCostUsd}
                  </td>

                  {/* Total Runs */}
                  <td className="py-4 px-5 text-center font-medium text-muted-foreground">
                    {agent.totalRuns}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal for External Agents */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-[#FAF7F2] p-6 text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold">Register External Agent (Webhook)</h3>
                <p className="text-xs text-muted-foreground">
                  Connect LangChain, CrewAI, AutoGen, or custom agents via HTTP
                </p>
              </div>

              <button
                onClick={() => setIsRegisterOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBE3D4] hover:bg-[#DED4C3]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterAgent} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My LangChain Researcher"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card p-2.5 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Framework</label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card p-2.5 text-foreground"
                >
                  <option value="LangChain">LangChain</option>
                  <option value="CrewAI">CrewAI</option>
                  <option value="AutoGen">AutoGen</option>
                  <option value="LlamaIndex">LlamaIndex</option>
                  <option value="CustomHTTP">Custom HTTP / Node / Python</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Underlying LLM</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. gemini-2.0-flash, gpt-4o"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card p-2.5 text-foreground"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Webhook Endpoint URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="http://localhost:5000/agent/run"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card p-2.5 text-foreground placeholder:text-muted-foreground font-mono"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Melq Bench will POST {`{ taskId, prompt, availableTools }`} to this URL and record live traces.
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="rounded-xl px-4 py-2 font-medium text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#D9541E] px-5 py-2 font-bold text-white shadow-md hover:bg-[#C24716] disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Add to Benchmarks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
