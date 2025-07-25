// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent, OpenDialogOptions, SaveDialogOptions, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("__TRPLAYER_APP__", {
	app: {
		getPlatformInfo: () => {
			return ipcRenderer.invoke("app-platform-info");
		},
		openDevTools: () => {
			ipcRenderer.invoke("app-open-dev-tools");
		},
		onCmdOutput: (
			callback: (event: IpcRendererEvent, data: string) => void
		) => {
			ipcRenderer.on("app-on-cmd-output", callback);
		},
		removeCmdOutputListeners: () => {
			ipcRenderer.removeAllListeners("app-on-cmd-output");
		},
	},
	appSettings: {
		getModelPath: () => {
			return ipcRenderer.invoke("app-settings-get-model-path");
		},
		setModelPath: (path: string) => {
			return ipcRenderer.invoke("app-settings-set-model-path", path);
		},
	},
	db: {
		connect: () => ipcRenderer.invoke("db-connect"),
		onTransaction: (
			callback: (event: IpcRendererEvent, state: TransactionStateType) => void
		) => ipcRenderer.on("db-on-transaction", callback),
		removeListeners: () => {
			ipcRenderer.removeAllListeners("db-on-transaction");
		},
	},
	dialog: {
		showOpenDialog: (options: OpenDialogOptions) =>
			ipcRenderer.invoke("dialog-show-open-dialog", options),
		showSaveDialog: (options: SaveDialogOptions) =>
			ipcRenderer.invoke("dialog-show-save-dialog", options),
	},
	download: {
		onState: (
			callback: (event: IpcRendererEvent, state: DownloadStateType) => void
		) => ipcRenderer.on("download-on-state", callback),
		start: (params: { url: string; savePath?: string; type: string }) =>
			ipcRenderer.invoke("download-start", params),
		removeAllListeners: () =>
			ipcRenderer.removeAllListeners("download-on-state"),
	},
	ffmpeg: {
		transcode: (input: string) => {
			return ipcRenderer.invoke("ffmpeg-transcode", input);
		},
	},
	llmProviders: {
		create: (params: LlmProviderType) => {
			return ipcRenderer.invoke("llm-providers-create", params);
		},
		update: (id: string, params: Partial<Omit<LlmProviderType, "id">>) => {
			return ipcRenderer.invoke("llm-providers-update", id, params);
		},
		findAll: () => {
			return ipcRenderer.invoke("llm-providers-find-all");
		},
		getOllamaModels: () => {
			return ipcRenderer.invoke("llm-providers-ollama-models");
		},
	},
	model: {
		getModels: () => ipcRenderer.invoke("model-list"),
		download: (model: ModelType) =>
			ipcRenderer.invoke("model-download-start", model),
		cancel: (model: ModelType) =>
			ipcRenderer.invoke("model-download-cancel", model),
	},
	shell: {
		openPath: (path: string) => ipcRenderer.invoke("shell-open-path", path),
	},
	transcriptions: {
		findOrCreate: (params: any) => {
			return ipcRenderer.invoke("transcriptions-find-or-create", params);
		},
		findAll: (params: any) => {
			return ipcRenderer.invoke("transcriptions-find-all", params);
		},
		update: (id: string, params: any) => {
			return ipcRenderer.invoke("transcriptions-update", id, params);
		},
		destroy: (id: string) => {
			return ipcRenderer.invoke("transcriptions-destroy", id);
		},
		export: (id: string, savePath: string) => {
			return ipcRenderer.invoke("transcriptions-export", id, savePath);
		}
	},
	userSettings: {
		get: (key: string) => {
			return ipcRenderer.invoke("user-settings-get", key);
		},
		set: (key: string, value: any) => {
			return ipcRenderer.invoke("user-settings-set", key, value);
		},
	},
	videos: {
		findOne: (params: any) => {
			return ipcRenderer.invoke("videos-find-one", params);
		},
		create: (uri: string) => {
			return ipcRenderer.invoke("videos-create", uri);
		},
		export: (id: string, params: any) => {
			return ipcRenderer.invoke("videos-export", id, params);
		}
	},
	whisper: {
		recognize: (params: { url: string; language: string; model: string }) => {
			return ipcRenderer.invoke("whisper-recognize", params);
		},
	},
});
