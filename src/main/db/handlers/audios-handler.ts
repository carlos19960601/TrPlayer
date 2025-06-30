import log from "@/main/logger";
import { Audio } from "@main/db/models";
import { IpcMainInvokeEvent, ipcMain } from "electron";

const logger = log.scope("db/handlers/audios-handler");

class AudiosHandler {
  private async create(event: IpcMainInvokeEvent, uri: string) {
    logger.info("Creating audio...", { uri });

    const file = uri;
    let source;
    if (uri.startsWith("http")) {
      // todo download file from uri

      if (!file) throw new Error("Failed to download file");
      source = uri;
    }

    try {
      const audio = await Audio.buildFromLocalFile(file)
      return audio.toJSON();
    } catch (err) {

      logger.error(err.message);
      throw err;
    }
  }

  register() {
    ipcMain.handle("audios-find-all", this.findAll);
    ipcMain.handle("audios-find-one", this.findOne);
    ipcMain.handle("audios-create", this.create);
    ipcMain.handle("audios-update", this.update);
    ipcMain.handle("audios-destroy", this.destroy);
    ipcMain.handle("audios-upload", this.upload);
    ipcMain.handle("audios-crop", this.crop);
    ipcMain.handle("audios-clean-up", this.cleanUp);
  }

  unregister() {
    ipcMain.removeHandler("audios-find-all");
    ipcMain.removeHandler("audios-find-one");
    ipcMain.removeHandler("audios-create");
    ipcMain.removeHandler("audios-update");
    ipcMain.removeHandler("audios-destroy");
    ipcMain.removeHandler("audios-upload");
    ipcMain.removeHandler("audios-crop");
    ipcMain.removeHandler("audios-clean-up");
  }
}

export const audiosHandler = new AudiosHandler();
