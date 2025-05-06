import log from "@/main/logger";
import { Audio, Video } from "@main/db/models";
import { Transcription } from "@main/db/models/transcription";
import { ipcMain } from "electron";

const logger = log.scope("db/handlers/transcriptions-handler");

class TranscriptionsHandler {

  private async findOrCreate(event: Electron.IpcMainInvokeEvent, where: Transcription) {
    const { targetType, targetId } = where;
    logger.debug({ targetId, targetType })
    let target: Video | Audio = null;
    if (targetType === "Video") {
      target = await Video.findByPk(targetId);
    } else if (targetType === "Audio") {
      target = await Audio.findByPk(targetId);
    } else {
      throw new Error("models.transcription.invalidTargetType");
    }

    const [transcription, _created] = await Transcription.findOrCreate({
      where: {
        targetId,
        targetType,
      },
      defaults: {
        targetId,
        targetType,
        targetMd5: target.md5,
      }
    })

    return transcription.toJSON();
  }



  register() {
    ipcMain.handle("transcriptions-find-or-create", this.findOrCreate);
    // ipcMain.handle("transcriptions-update", this.update);
  }

  unregister() {
    ipcMain.removeHandler("transcriptions-find-or-create");
    ipcMain.removeHandler("transcriptions-update");
  }
}

export const transcriptionsHandler = new TranscriptionsHandler();