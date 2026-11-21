import { AgentExecutionContext, AgentExecutionOutput, IBenchmarkAgent } from "./agent.interface";

export class ExternalWebhookAgent implements IBenchmarkAgent {
  constructor(
    public name: string,
    public framework: string,
    public model: string,
    private endpointUrl: string,
  ) {}

  async run(ctx: AgentExecutionContext): Promise<AgentExecutionOutput> {
    const startTime = Date.now();
    ctx.onTraceStep({
      type: "THOUGHT",
      name: "webhook_dispatch",
      input: `Dispatching task payload to external agent at ${this.endpointUrl}`,
      durationMs: 40,
    });

    try {
      const response = await fetch(this.endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: ctx.taskId,
          prompt: ctx.prompt,
          availableTools: ctx.availableTools,
        }),
      });

      if (!response.ok) {
        throw new Error(`External agent responded with HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      ctx.onTraceStep({
        type: "FINAL_ANSWER",
        name: "external_agent_response",
        output: data.finalAnswer || JSON.stringify(data),
        durationMs: duration,
      });

      return {
        finalAnswer: data.finalAnswer || JSON.stringify(data),
        totalTokens: data.totalTokens || 1200,
        promptTokens: data.promptTokens || 800,
        completionTokens: data.completionTokens || 400,
        stepsCount: data.stepsCount || 3,
        toolCallsCount: data.toolCallsCount || 1,
        chaosHandled: data.chaosHandled ?? true,
      };
    } catch (err: any) {
      ctx.onTraceStep({
        type: "FINAL_ANSWER",
        name: "external_agent_error",
        output: err.message,
        durationMs: Date.now() - startTime,
      });

      return {
        finalAnswer: `Error reaching external agent: ${err.message}`,
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        stepsCount: 1,
        toolCallsCount: 0,
        chaosHandled: false,
        error: err.message,
      };
    }
  }
}
