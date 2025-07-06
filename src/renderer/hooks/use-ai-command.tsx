import { translateCommand } from "@/commands/translate.command";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
	AppSettingsProviderContext,
	DbProviderContext,
} from "@renderer/context";
import { DefaultLlmProviders } from "@renderer/lib/provider";
import { llmProvidersReducer } from "@renderer/reducers";
import { LanguageModel } from "ai";
import { createOllama } from "ollama-ai-provider";
import { useContext, useEffect, useReducer } from "react";

export const useAiCommand = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const { addDblistener, removeDbListener } = useContext(DbProviderContext);

	const [llmProviders, dispatchLlmProviders] = useReducer(
		llmProvidersReducer,
		[],
	);

	const onLlmProviderChange = (event: CustomEvent) => {
		const { model, action, record } = event.detail || {};
		if (model !== "LlmProvider") return;
		switch (action) {
			case "create": {
				dispatchLlmProviders({ type: "create", record });
				break;
			}
			case "update": {
				dispatchLlmProviders({ type: "update", record });
				break;
			}
		}
	};

	// llm providers
	const fetchLlmProviders = async () => {
		const providers = await TrPlayerApp.llmProviders.findAll();
		const mergedProviders = DefaultLlmProviders.map((provider) => {
			const existingProvider = providers.find(
				(p) => p.providerId === provider.providerId,
			);

			if (existingProvider)
				return {
					...provider,
					id: existingProvider.id,
					baseUrl: existingProvider.baseUrl,
					apiKey: existingProvider.apiKey,
				};
			return provider;
		});

		// const ollamaProvider = mergedProviders.find(
		// 	(provider) => provider.providerId === "ollama",
		// );
		// if (ollamaProvider) {
		// 	const ollamaModels = await TrPlayerApp.llmProviders.getOllamaModels();
		// 	ollamaProvider.models = ollamaModels;
		// 	if (ollamaModels.length === 0) {
		// 		ollamaProvider.available = false;
		// 	}
		// }
		dispatchLlmProviders({ type: "set", records: mergedProviders });
	};

	const fetchOllamaModels = async () => {
		const providers = await TrPlayerApp.llmProviders.findAll();
		const existingProvider = providers.find(
			(provider) => provider.providerId === "ollama",
		);
		const ollamaModels = await TrPlayerApp.llmProviders.getOllamaModels();
		const defaultOllamaProvider = DefaultLlmProviders.find(
			(provider) => provider.providerId === "ollama",
		);
		const available = ollamaModels.length > 0;

		const mergedProvider = {
			...defaultOllamaProvider,
			id: existingProvider.id,
			baseUrl: existingProvider.baseUrl,
			apiKey: existingProvider.apiKey,
			models: ollamaModels,
			available,
		};

		dispatchLlmProviders({ type: "update", record: mergedProvider });
	};

	const getLanguageModel = (
		providerId: string,
		modelId: string,
	): LanguageModel => {
		const llmProvider = llmProviders.find((p) => p.providerId === providerId);
		if (!llmProvider) return null;
		switch (providerId) {
			case "openrouter":
				return createOpenRouter({
					apiKey: llmProvider.apiKey,
				}).chat(modelId);
			case "ollama":
				return createOllama({
					baseURL: llmProvider.baseUrl,
				}).languageModel(modelId);
			case "siliconflow":
				return createOpenAI({
					baseURL: llmProvider.baseUrl,
					apiKey: llmProvider.apiKey,
				}).chat(modelId);
			default:
				throw new Error(`Unsupported provider ${providerId}`);
		}
	};

	const translate = (
		text: string,
		targetLanguage: string,
		option: TranslateOptionType,
	): Promise<string> => {
		const languageModel = getLanguageModel(option.providerId, option.modelId);
		const translatedContent = translateCommand({
			text,
			targetLanguage,
			model: languageModel,
		});
		return translatedContent;
	};

	useEffect(() => {
		fetchLlmProviders();
		addDblistener(onLlmProviderChange);

		return () => {
			removeDbListener(onLlmProviderChange);
		};
	}, []);

	return {
		llmProviders,
		translate,
	};
};
