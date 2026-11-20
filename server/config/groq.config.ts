import Groq from "groq-sdk";
import config from ".";
import { logger } from "./logger.config";

interface ChatCompletionCreateParams {
  model?: string;
  messages: Array<{ role: string; content: string }>;
  max_tokens?: number;
  temperature?: number;
  [key: string]: unknown;
}

interface ChatCompletionResponse {
  id?: string;
  choices: Array<{
    index?: number;
    message: {
      role?: string;
      content: string | null;
    };
    finish_reason?: string;
  }>;
}

export interface AIClient {
  chat: {
    completions: {
      create(params: ChatCompletionCreateParams): Promise<ChatCompletionResponse>;
    };
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let aiClient: AIClient;

if (config.GEMINI_API_KEY) {
  logger.info("Using Google Gemini API for AI agents");

  async function callGemini(
    model: string,
    params: ChatCompletionCreateParams,
    attempt: number = 0,
  ): Promise<ChatCompletionResponse> {
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

    const requestBody = {
      model,
      messages: params.messages,
      max_tokens: params.max_tokens,
      temperature: params.temperature,
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.GEMINI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (res.status === 429) {
      if (attempt < 3) {
        const delay = Math.min(1500 * Math.pow(2, attempt), 8000);
        logger.warn(
          `Gemini Rate limit (429) hit for model ${model}. Retrying in ${delay}ms (attempt ${attempt + 1}/3)...`,
        );
        await sleep(delay);
        return callGemini(model, params, attempt + 1);
      }

      // If primary model exhausted quota, fallback to high-quota sibling model
      const fallbackModel =
        model === "gemini-2.0-flash" ? "gemini-1.5-flash" : "gemini-2.0-flash";
      logger.warn(
        `Gemini Rate limit reached on ${model}. Falling back to ${fallbackModel}...`,
      );
      return callGemini(fallbackModel, params, 0);
    }

    if (!res.ok) {
      const errText = await res.text();
      logger.error(`Gemini API error [${res.status}]: ${errText}`);
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    return (await res.json()) as ChatCompletionResponse;
  }

  aiClient = {
    chat: {
      completions: {
        async create(params: ChatCompletionCreateParams): Promise<ChatCompletionResponse> {
          let targetModel = params.model || config.GEMINI_MODEL || "gemini-2.0-flash";
          if (
            targetModel.toLowerCase().includes("llama") ||
            targetModel.toLowerCase().includes("mixtral") ||
            targetModel.toLowerCase().includes("gemma")
          ) {
            targetModel = config.GEMINI_MODEL || "gemini-2.0-flash";
          }

          return callGemini(targetModel, params);
        },
      },
    },
  };
} else {
  // Fall back to Groq SDK
  const groq = new Groq({
    apiKey: config.GROQ_API_KEY || "dummy_key",
  });

  aiClient = {
    chat: {
      completions: {
        async create(params: ChatCompletionCreateParams): Promise<ChatCompletionResponse> {
          if (!config.GROQ_API_KEY) {
            throw new Error(
              "No AI API key found! Please configure GEMINI_API_KEY or GROQ_API_KEY in server/.env",
            );
          }
          return (await groq.chat.completions.create({
            model: params.model ?? config.GROQ_MODEL,
            messages: params.messages as any,
            max_tokens: params.max_tokens,
            temperature: params.temperature,
          })) as ChatCompletionResponse;
        },
      },
    },
  };
}

export default aiClient;
