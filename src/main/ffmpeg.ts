import log from "@main/logger";
import { IpcMainInvokeEvent, ipcMain } from "electron";
import Ffmpeg from "fluent-ffmpeg";
import fs from "fs-extra";
import path from "node:path";
import settings from "./settings";

const logger = log.scope("ffmpeg");

class FfmpegWrapper {

  generateMetadata(input: string): Promise<Ffmpeg.FfprobeData> {
    const ffmpeg = Ffmpeg()
    return new Promise((resolve, reject) => {
      ffmpeg
        .input(input).
        on("start", (commandLine) => {
          logger.info("Spawned FFmpeg with command: ", commandLine)
        })
        .on("error", (err) => {
          logger.error(err)
          reject(err)
        })
        .ffprobe((err, metadata) => {
          if (err) {
            logger.error(err)
            reject(err)
          }
          resolve(metadata)
        })
    })
  }

  generateCover(input: string, output: string): Promise<string> {
    const ffmpeg = Ffmpeg();
    return new Promise((resolve, reject) => {
      ffmpeg
        .input(input)
        .thumbnail({
          count: 1,
          filename: path.basename(output),
          folder: path.dirname(output),
        })
        .on("start", (commandLine) => {
          logger.info("Spawned FFmpeg with command: " + commandLine);
          fs.ensureDirSync(path.dirname(output));
        })
        .on("end", () => {
          logger.info(`File ${output} created`);
          resolve(output);
        })
        .on("error", (err) => {
          logger.error(err);
          reject(err);
        });
    });
  }

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
        })
        .on("end", (stdout, stderr) => {
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
        })
        .on("error", (err: Error) => {
          logger.error(err)
          reject(err)
        }).save(output)
    })
  }

  embedHardSubtitles(input: string, subtile: string, output: string) {
    const ffmpeg = Ffmpeg()
    return new Promise((resolve, reject) => {
      ffmpeg.input(input).outputOptions([
        "-vf",
        `subtitles=${subtile}`,
        "-c:a copy",
        "-y",
      ]).save(output)
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