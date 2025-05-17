// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("__TRPLAYER_APP__", {
  app: {
    getPlatformInfo: () => {
      return ipcRenderer.invoke("app-platform-info")
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
  },
  dialog: {
    showOpenDialog: (options: Electron.OpenDialogOptions) => ipcRenderer.invoke("dialog-show-open-dialog", options)
  },
  download: {
    onState: (
      callback: (event: IpcRendererEvent, state: DownloadStateType) => void
    ) => ipcRenderer.on("download-on-state", callback),
    start: (params: {
      url: string,
      savePath?: string,
      type: string,
    }) =>
      ipcRenderer.invoke("download-start", params),
    removeAllListeners: () =>
      ipcRenderer.removeAllListeners("download-on-state"),
  },
  ffmpeg: {
    transcode: (input: string) => {
      return ipcRenderer.invoke("ffmpeg-transcode", input);
    },
  },
  model: {
    getModels: () => ipcRenderer.invoke("model-list"),
    download: (model: ModelType) => ipcRenderer.invoke("model-download-start", model),
    cancel: (model: ModelType) => ipcRenderer.invoke("model-download-cancel", model),
  },
  shell: {
    openPath: (path: string) => ipcRenderer.invoke("shell-open-path", path),
  },
  transcriptions: {
    findOrCreate: (params: any) => {
      return ipcRenderer.invoke("transcriptions-find-or-create", params)
    },
    findAll: (params: any) => {
      return ipcRenderer.invoke("transcriptions-find-all", params);
    },
    update: (id: string, params: any) => {
      return ipcRenderer.invoke("transcriptions-update", id, params)
    },
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
      return ipcRenderer.invoke("videos-find-one", params)
    },
    create: (uri: string) => {
      return ipcRenderer.invoke("videos-create", uri)
    }
  },
  whisper: {
    recognize: (params: {
      url: string,
      language: string,
      model: string,
    }) => {
      return ipcRenderer.invoke("whisper-recognize", params)
    }
  }
})