import aiClient from "../../../config/groq.config";
import { AgentExecutionContext, AgentExecutionOutput, IBenchmarkAgent } from "./agent.interface";

export class NaiveDirectAgent implements IBenchmarkAgent {
  public name = "Naive Single-Shot Agent";
  public framework = "Custom / Unhardened ReAct";
  public model = "gemini-1.5-flash";

  async run(ctx: AgentExecutionContext): Promise<AgentExecutionOutput> {
    let promptTokens = 200;
    let completionTokens = 150;
    let stepsCount = 1;
    let toolCallsCount = 0;
    let chaosHandled = false;

    // Naively picks first available tool and makes one call without retry
    const toolName = ctx.availableTools[0] || "web_search";
    toolCallsCount++;

    const toolStart = Date.now();
    const { result, chaos } = await ctx.chaosEngine.executeWithChaos(toolName, { query: ctx.prompt });
    const toolDuration = Date.now() - toolStart;

    if (chaos.isInjected) {
      ctx.onTraceStep({
        type: "CHAOS_INJECTED",
        name: chaos.chaosType || "CHAOS_EVENT",
        input: { query: ctx.prompt },
        output: chaos.details,
        durationMs: toolDuration,
        isChaos: true,
        chaosDetails: chaos.details,
      });
    }

    ctx.onTraceStep({
      type: "TOOL_CALL",
      name: toolName,
      input: { query: ctx.prompt },
      output: result.result,
      durationMs: toolDuration,
      isChaos: chaos.isInjected,
    });

    stepsCount++;
    const startLLM = Date.now();

    // If tool errored, naive agent does not retry, it just passes error to LLM
    const res = await aiClient.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Task: ${ctx.prompt}\n\nTool Result: ${JSON.stringify(result.result)}\nAnswer the task directly based on this tool result:`,
        },
      ],
      temperature: 0.5,
    });

    const latencyLLM = Date.now() - startLLM;
    const finalAnswer = res.choices[0]?.message?.content || "Unable to complete request due to upstream tool status.";

    ctx.onTraceStep({
      type: "FINAL_ANSWER",
      name: "naive_output",
      output: finalAnswer,
      durationMs: latencyLLM,
    });

    // If chaos occurred and result was an error, naive agent failed to recover
    if (chaos.isInjected && result.isError) {
      chaosHandled = false;
    }

    return {
      finalAnswer,
      totalTokens: promptTokens + completionTokens,
      promptTokens,
      completionTokens,
      stepsCount,
      toolCallsCount,
      chaosHandled,
    };
  }
}
