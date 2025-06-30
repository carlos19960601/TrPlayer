import log from "@/main/logger";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import { t } from "i18next";
import { LlmProvider } from "../models/llm-provider";

const logger = log.scope("db/handlers/llm-providers-handler");

class LLMProvidersHandler {
  private async findAll(_event: IpcMainInvokeEvent) {
    const llmProviders = await LlmProvider.findAll()
    if (!llmProviders) {
      return [];
    }

    return llmProviders.map((llmProvider) => llmProvider.toJSON())
  }

  private async create(event: IpcMainInvokeEvent, provider: Partial<LlmProvider>) {
    const llmProvider = await LlmProvider.create(provider)
    return llmProvider.toJSON()
  }

  private async update(event: IpcMainInvokeEvent, id: string, provider: Partial<LlmProvider>) {
    const llmProvider = await LlmProvider.findByPk(id)
    if (!llmProvider) {
      throw new Error(t("models.llmProvider.notFound"));
    }

    await llmProvider.update({
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl,
    })
  }

  private async getOllamaModels(_event: IpcMainInvokeEvent) {
    const llmProvider = await LlmProvider.findOne({
      where: {
        providerId: "ollama"
      }
    })
    if (!llmProvider) {
      return [];
    }

    const response = await fetch(`${llmProvider.baseUrl}/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Ollama not available at ${llmProvider.baseUrl} or no models found`)
      return []
    }

    const data: OllamaListResponse = await response.json()

    return data.models.map((model) => {
      return {
        id: model.name,
        name: model.name,
        providerId: llmProvider.providerId,
      }
    })
  }

  register() {
    ipcMain.handle("llm-providers-find-all", this.findAll)
    ipcMain.handle("llm-providers-create", this.create)
    ipcMain.handle("llm-providers-update", this.update)
    ipcMain.handle("llm-providers-ollama-models", this.getOllamaModels)
  }

  unregister() {
    ipcMain.removeHandler("llm-providers-find-all")
    ipcMain.removeHandler("llm-providers-create")
    ipcMain.removeHandler("llm-providers-update")
    ipcMain.removeHandler("llm-providers-ollama-models")
  }
}

export const llmProvidersHandler = new LLMProvidersHandler();