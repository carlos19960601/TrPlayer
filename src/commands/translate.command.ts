import { LanguageModel } from "ai";
import { textCommand } from "./text.command";

const SYSTEM_PROMPT =
  "You are a professional, authentic translation engine, only returns translations.";


export const translateCommand = async (params: {
  text: string,
  targetLanguage: string,
  model: LanguageModel,
}, options?: {
  abortSignal?: AbortSignal,
}): Promise<string> => {
  if (!params.text) throw new Error("Text is required");

  const TRANSLATION_PROMPT = `Translate the text to ${params.targetLanguage} Language, please do not explain my original text.:

  ${params.text}
  `;

  return textCommand({
    system: SYSTEM_PROMPT,
    prompt: TRANSLATION_PROMPT,
  }, {
    model: params.model,
    ...options,
  })
}