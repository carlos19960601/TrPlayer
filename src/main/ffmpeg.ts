import log from "@main/logger";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import Ffmpeg from "fluent-ffmpeg";
import fs from "fs-extra";
import path from "node:path";
import settings from "./settings";

const logger = log.scope("ffmpeg");

class FfmpegWrapper {
  transcode(input: string): Promise<string> {
    const filename = path.basename(input, path.extname(input))
    const output = path.join(settings.cachePath(), `${filename}.wav`)

    const ffmpeg = Ffmpeg()
    return new Promise((resolve, reject) => {
      ffmpeg
        .input(input)
        .outputOptions([
          "-vn",
          "-ar 16000",
          "-ac 1",
        ])
        .on("start", (commandLine) => {
          logger.debug(`Trying to convert ${input} to ${output}`);
          logger.info("Spawned FFmpeg with command: " + commandLine);
        }).on("end", (stdout, stderr) => {
          if (stdout) {
            logger.debug(stdout)
          }

          if (stderr) {
            logger.info(stderr)
          }

          if (fs.existsSync(output)) {
            resolve(output)
          } else {
            reject(new Error("Ffmpeg command failed"))
          }
        }).on("error", (err: Error) => {
          logger.error(err)
          reject(err)
        }).save(output)
    })
  }

  registerIpcHandlers() {
    ipcMain.handle(
      "ffmpeg-transcode",
      async (_event: IpcMainInvokeEvent, input: string) => {
        return this.transcode(input);
      }
    );
  }
}

export default new FfmpegWrapper();