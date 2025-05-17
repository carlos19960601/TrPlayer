import log from "@/main/logger";
import { Audio, Video } from "@main/db/models";
import { Transcription } from "@main/db/models/transcription";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import _ from "lodash";
import { Attributes, FindOptions } from "sequelize";

const logger = log.scope("db/handlers/transcriptions-handler");

class TranscriptionsHandler {

  private async findOrCreate(event: IpcMainInvokeEvent, where: Transcription) {
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

  private async findAll(event: IpcMainInvokeEvent, options: FindOptions<Attributes<Transcription>> & { targetType?: string }) {
    const { where = {}, targetType } = options
    delete options.targetType
    delete options.where

    if (targetType !== "all") {
      (where as any).targetType = _.capitalize(targetType)
    }

    const transcriptions = await Transcription.findAll({
      ...options,
      where,
      include: [
        {
          association: "video",
          model: Video,
        }
      ],
    })

    if (!transcriptions) {
      return [];
    }

    return transcriptions.map((transcription) => transcription.toJSON())
  }

  private async update(event: IpcMainInvokeEvent, id: string, params: Attributes<Transcription>) {
    const { state, recognitionResult } = params

    const transcription = await Transcription.findByPk(id)
    if (!transcription) {
      throw new Error("models.transcription.notFound");
    }

    return await transcription.update({
      state,
      recognitionResult,
    })
  }



  register() {
    ipcMain.handle("transcriptions-find-or-create", this.findOrCreate);
    ipcMain.handle("transcriptions-find-all", this.findAll)
    ipcMain.handle("transcriptions-update", this.update);
  }

  unregister() {
    ipcMain.removeHandler("transcriptions-find-or-create");
    ipcMain.removeHandler("transcriptions-find-all")
    ipcMain.removeHandler("transcriptions-update");
  }
}

export const transcriptionsHandler = new TranscriptionsHandler();