import log from "@/main/logger";
import { Video } from "@main/db/models";
import { IpcMainInvokeEvent, ipcMain } from "electron";


const logger = log.scope("db/handlers/videos-handler");

class VideosHandler {
  private async create(_event: IpcMainInvokeEvent, uri: string) {
    logger.info("Creating video...", { uri });

    const file = uri;
    let source;
    if (uri.startsWith("http")) {
      // todo download file from uri
      if (!file) throw new Error("Failed to download file");
      source = uri;
    }

    try {
      const video = await Video.buildFromLocalFile(file, { source, })
      return video.toJSON();
    } catch (err) {

      logger.error(err.message);
      throw err;
    }
  }

  register() {
    ipcMain.handle("videos-create", this.create);
  }

  unregister() {
    ipcMain.removeHandler("videos-create");
  }
}


export const videosHandler = new VideosHandler()