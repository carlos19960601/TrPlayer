import { MODELS } from "@/constants/models";
import log from "@main/logger";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import fs from "fs-extra";
import path from "node:path";
import downloader from "./downloader";
import settings from "./settings";

const logger = log.scope("model");

const modelURL = "https://hf-mirror.com/ggerganov/whisper.cpp/resolve/main"

export class ModelHandler {
  get modelPath() {
    const _path = path.join(settings.libraryPath(), "models")
    fs.ensureDirSync(_path)

    return _path;
  }

  getModels() {
    const models = MODELS.map((model) => {
      return {
        ...model,
        state: this.isInstalled(model) ? "installed" : "uninstall",
      }
    })

    return models
  }

  download(model: ModelType) {
    return downloader.download({ url: `${modelURL}/${model.value}.bin`, savePath: this.modelPath, type: "model" })
  }

  cancel(model: ModelType) {
    return downloader.cancel(`${model.value}.bin`)
  }

  isInstalled(model: ModelType) {
    const files = fs.readdirSync(this.modelPath)
    return files.find((file) => path.basename(file, path.extname(file)) === model.value)
  }

  registerIpcHandlers() {
    ipcMain.handle("model-list", async (_event: IpcMainInvokeEvent) => this.getModels());

    ipcMain.handle("model-download-start", async (event: IpcMainInvokeEvent, model: ModelType) => {
      return this.download(model)
    })

    ipcMain.handle("model-download-cancel", async (event: IpcMainInvokeEvent, model: ModelType) => {
      return this.cancel(model)
    })
  }
}


export default new ModelHandler()