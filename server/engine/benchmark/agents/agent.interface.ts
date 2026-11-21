import { ChaosEngine } from "../../chaos/chaos.engine";

export interface AgentExecutionContext {
  taskId: string;
  taskTitle: string;
  prompt: string;
  availableTools: string[];
  chaosEngine: ChaosEngine;
  onTraceStep: (step: {
    type: "THOUGHT" | "TOOL_CALL" | "TOOL_RESULT" | "CHAOS_INJECTED" | "FINAL_ANSWER";
    name: string;
    input?: unknown;
    output?: unknown;
    durationMs: number;
    tokens?: number;
    isChaos?: boolean;
    chaosDetails?: string;
  }) => void;
}

export interface AgentExecutionOutput {
  finalAnswer: string;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  stepsCount: number;
  toolCallsCount: number;
  chaosHandled: boolean;
  error?: string;
}

export interface IBenchmarkAgent {
  name: string;
  framework: string;
  model: string;
  run(context: AgentExecutionContext): Promise<AgentExecutionOutput>;
}
