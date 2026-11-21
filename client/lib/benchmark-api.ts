const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BenchmarkTask {
  id: string;
  suiteId: string;
  title: string;
  description: string;
  prompt: string;
  expectedOutput: string;
  availableTools: string[];
}

export interface BenchmarkSuite {
  id: string;
  name: string;
  category: "RESEARCH" | "CODING" | "CUSTOMER_SUPPORT" | "TOOL_USE";
  description: string;
  tasks: BenchmarkTask[];
}

export interface BenchmarkAgentProfile {
  id: string;
  name: string;
  framework: string;
  modelName: string;
  type: string;
  description?: string;
  endpointUrl?: string;
}

export interface ExecutionTraceStep {
  id: string;
  stepIndex: number;
  type: "THOUGHT" | "TOOL_CALL" | "TOOL_RESULT" | "CHAOS_INJECTED" | "FINAL_ANSWER";
  name: string;
  input?: any;
  output?: any;
  durationMs: number;
  tokens?: number;
  isChaos: boolean;
  chaosDetails?: string;
}

export interface BenchmarkExecution {
  id: string;
  runId: string;
  taskId: string;
  agentId: string;
  iteration: number;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "TIMEOUT" | "ERROR";
  success: boolean;
  score: number;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalCostUsd: number;
  stepsCount: number;
  toolCallsCount: number;
  chaosInjected: boolean;
  chaosType?: string;
  chaosHandled: boolean;
  finalAnswer?: string;
  evalNotes?: string;
  error?: string;
  agent: BenchmarkAgentProfile;
  task: BenchmarkTask;
  traces: ExecutionTraceStep[];
}

export interface AgentBenchmarkSummary {
  agentId: string;
  agentName: string;
  framework: string;
  modelName: string;
  successRate: number; // 0-100%
  resilienceScore: number; // 0-100%
  avgScore: number;
  avgLatencySec: number;
  totalCostUsd: number;
  avgTokens: number;
  avgSteps: number;
  avgToolCalls: number;
  runsCount: number;
}

export interface BenchmarkRun {
  id: string;
  suiteId: string;
  name: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  iterations: number;
  chaosConfig: {
    enableFailingTools?: boolean;
    failureRate?: number;
    enableRateLimits?: boolean;
    enableMisleadingContext?: boolean;
  };
  summary?: Record<string, AgentBenchmarkSummary>;
  createdAt: string;
  completedAt?: string;
  suite: BenchmarkSuite;
  executions: BenchmarkExecution[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  framework: string;
  modelName: string;
  totalRuns: number;
  successRate: number;
  resilienceScore: number;
  avgScore: number;
  avgLatencySec: number;
  avgCostUsd: number;
  avgTokens: number;
  rank: number;
}

export async function fetchBenchmarkSuites(): Promise<BenchmarkSuite[]> {
  const res = await fetch(`${API_URL}/api/benchmark/suites`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch benchmark suites");
  const json = await res.json();
  return json.data || [];
}

export async function fetchBenchmarkAgents(): Promise<BenchmarkAgentProfile[]> {
  const res = await fetch(`${API_URL}/api/benchmark/agents`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch benchmark agents");
  const json = await res.json();
  return json.data || [];
}

export async function registerBenchmarkAgent(data: {
  name: string;
  framework: string;
  modelName: string;
  description?: string;
  endpointUrl?: string;
}): Promise<BenchmarkAgentProfile> {
  const res = await fetch(`${API_URL}/api/benchmark/agents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to register agent");
  const json = await res.json();
  return json.data;
}

export async function createBenchmarkRun(params: {
  suiteId: string;
  agentIds: string[];
  name?: string;
  iterations?: number;
  chaosConfig?: {
    enableFailingTools?: boolean;
    failureRate?: number;
    enableRateLimits?: boolean;
    enableMisleadingContext?: boolean;
  };
}): Promise<{ runId: string }> {
  const res = await fetch(`${API_URL}/api/benchmark/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to create benchmark run");
  const json = await res.json();
  return json.data;
}

export async function fetchBenchmarkRuns(): Promise<BenchmarkRun[]> {
  const res = await fetch(`${API_URL}/api/benchmark/runs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch benchmark runs");
  const json = await res.json();
  return json.data || [];
}

export async function fetchBenchmarkRun(id: string): Promise<BenchmarkRun> {
  const res = await fetch(`${API_URL}/api/benchmark/runs/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch benchmark run details");
  const json = await res.json();
  return json.data;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_URL}/api/benchmark/leaderboard`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  const json = await res.json();
  return json.data || [];
}
