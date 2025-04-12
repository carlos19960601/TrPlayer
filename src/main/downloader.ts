import log from "@main/logger";
import settings from "@main/settings";
import mainWin from "@main/window";
import { ipcMain } from "electron";
import fs from "fs";
import path from "node:path";

const logger = log.scope("downloader");

class Downloader {
  public tasks: Electron.DownloadItem[];

  constructor() {
    this.tasks = [];
  }

  download(
    options: {
      url: string,
      webContents?: Electron.WebContents;
      savePath?: string;
      type: string;
    }
  ): Promise<string | undefined> {
    const { url, webContents = mainWin.win.webContents, savePath, type } = options || {};

    const cachePath = settings.cachePath();
    return new Promise((resolve, _reject) => {
      webContents.downloadURL(url);

      webContents.session.on("will-download", (_event, item, webContents) => {
        const downloadingPath = path.join(
          cachePath,
          `${item.getFilename()}.downloading`
        );
        item.setSavePath(downloadingPath);

        this.tasks.push(item);

        item.on("updated", (_event, state) => {
          webContents.send("download-on-state", {
            name: item.getFilename(),
            type,
            state,
            received: item.getReceivedBytes(),
            total: item.getTotalBytes(),
          });

          if (state === "interrupted") {
            resolve(undefined);
          }
        });

        item.on("done", (_event, state) => {
          webContents.send("download-on-state", {
            name: item.getFilename(),
            type,
            state,
            received: item.getReceivedBytes(),
            total: item.getTotalBytes(),
          });

          if (state === "completed") {
            let destPath = path.join(cachePath, item.getFilename());
            if (savePath) {
              destPath = fs.statSync(savePath).isDirectory()
                ? path.join(savePath, item.getFilename())
                : savePath;
            }
            fs.renameSync(downloadingPath, destPath);
            resolve(destPath);
          } else {
            logger.error("download failed: ", state);
          }
        });
      });
    });
  }

  cancel(filename: string) {
    logger.info("cancel download, filename: ", filename)
    this.tasks
      .filter(
        (t) => filename === t.getFilename() && "progressing" === t.getState()
      )
      .forEach((t) => t.cancel());
  }

  registerIpcHandlers() {
    ipcMain.handle("download-start", (event, options) => {
      return this.download(options);
    });
  }
}

export default new Downloader();
