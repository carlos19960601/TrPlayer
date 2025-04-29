// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("__TRPLAYER_APP__", {
  app: {
    getPlatformInfo: () => {
      return ipcRenderer.invoke("app-platform-info")
    }
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
  model: {
    getModels: () => ipcRenderer.invoke("model-list"),
    download: (model: ModelType) => ipcRenderer.invoke("model-download-start", model),
    cancel: (model: ModelType) => ipcRenderer.invoke("model-download-cancel", model),
  },
  shell: {
    openPath: (path: string) => ipcRenderer.invoke("shell-open-path", path),
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
    create: (uri: string) => {
      return ipcRenderer.invoke("videos-create", uri)
    }
  }
})