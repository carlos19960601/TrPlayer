import { Ollama, OpenAI, OpenRouter, SiliconCloud } from '@lobehub/icons';

export const DefaultLlmProviders: LlmProviderType[] = [
  {
    providerId: "ollama",
    name: "Ollama",
    baseUrl: "",
    baseUrlPlaceholder: "http://localhost:11434/api",
    icon: Ollama,
    available: false,
    models: [],
  },
  {
    providerId: "openrouter",
    name: "OpenRouter",
    baseUrl: "",
    baseUrlPlaceholder: "https://openrouter.ai/api/v1",
    icon: OpenRouter,
    available: true,
    models: [
      {
        id: "deepseek/deepseek-r1:free",
        name: "DeepSeek R1",
        providerId: "openrouter",
      },
      {
        id: "deepseek/deepseek-r1-0528:free",
        name: "DeepSeek: R1 0528 (free)",
        providerId: "openrouter",
      },
      {
        id: "deepseek/deepseek-chat-v3-0324:free",
        name: "DeepSeek V3 0324 (free)",
        providerId: "openrouter",
      },
      {
        id: "deepseek/deepseek-chat:free",
        name: "DeepSeek V3 (free)",
        providerId: "openrouter",
      },
    ]
  },
  {
    providerId: "siliconflow",
    name: "SiliconFlow",
    baseUrl: "",
    baseUrlPlaceholder: "https://api.siliconflow.cn/v1",
    icon: SiliconCloud,
    available: true,
    models: [
      {
        id: "THUDM/GLM-4-9B-0414",
        name: "GLM-4-9B-0414",
        providerId: "siliconflow",
      },
      {
        id: "THUDM/GLM-Z1-9B-0414",
        name: "GLM-Z1-9B-0414",
        providerId: "siliconflow",
      },
      {
        id: "Qwen/Qwen3-8B",
        name: "Qwen3-8B",
        providerId: "siliconflow",
      },
      {
        id: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
        name: "DeepSeek-R1-0528-Qwen3-8B (Free)",
        providerId: "siliconflow",
      }
    ]
  },
  {
    providerId: "openai",
    name: "OpenAI",
    baseUrl: "",
    baseUrlPlaceholder: "https://api.openai.com/v1",
    icon: OpenAI,
    available: true,
    models: [
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        providerId: "openai",
      }
    ],
  },
]
