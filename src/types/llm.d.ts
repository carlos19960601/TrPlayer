type LlmProviderType = {
  id?: string;
  providerId: string;
  name: string;
  baseUrl: string;
  baseUrlPlaceholder?: string;
  apiKey?: string;
  apiKeyPlaceholder?: string;
  icon?: IconType;
  models: LlmModelType[];
}

type LlmModelType = {
  id: string // "gpt-4.1-nano" // same from AI SDKs
  name: string // "GPT-4.1 Nano"
  providerId: string // "openai", "mistral", etc.
}

type TranslateOptionType = {
  providerId: string;
  modelId: string;
  abortSignal?: AbortSignal,
}

type LlmOptionType = {
  providerId: string;
  modelId: string;
}

// Interface for Ollama API response
interface OllamaModel {
  name: string
  model: string
  modified_at: string
  size: number
  digest: string
  details: {
    parent_model?: string
    format?: string
    family?: string
    families?: string[]
    parameter_size?: string
    quantization_level?: string
  }
}


interface OllamaListResponse {
  models: OllamaModel[]
}
