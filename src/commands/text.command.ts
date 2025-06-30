import { LanguageModel, extractReasoningMiddleware, generateText, wrapLanguageModel } from "ai";

export const textCommand = async (params: {
  system?: string,
  prompt: string,
}, options: {
  model: LanguageModel, abortSignal?: AbortSignal,
}): Promise<string> => {
  const { system, prompt } = params;
  const { model, abortSignal } = options;

  const wrapModel = wrapLanguageModel({
    model,
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  })

  const result = await generateText({ model: wrapModel, system, prompt, abortSignal })
  return result.text
}