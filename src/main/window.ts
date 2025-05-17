import db from "@main/db";
import downloader from "@main/downloader";
import ffmpeg from "@main/ffmpeg";
import log from "@main/logger";
import model from "@main/model";
import settings from "@main/settings";
import whisper from "@main/whisper";
import { BrowserWindow, IpcMainInvokeEvent, OpenDialogSyncOptions, dialog, ipcMain, shell } from "electron";
import path from 'path';

const __dirname = import.meta.dirname;

const logger = log.scope("window");

class WindowWrapper {
  public win: BrowserWindow | null = null;

  public init() {
    if (this.win) {
      this.win.show();
      return;
    }

    // Prepare local database
    db.registerIpcHandlers();

    // Prepare Settings
    settings.registerIpcHandlers();
    // Models
    model.registerIpcHandlers();
    // Downloader
    downloader.registerIpcHandlers();
    // ffmpeg
    ffmpeg.registerIpcHandlers();
    // whisper
    whisper.registerIpcHandlers()

    // App Options
    ipcMain.handle("app-platform-info", () => {
      return {
        platform: process.platform,
        arch: process.arch,
        version: process.getSystemVersion(),
      }
    })

    // Shell
    ipcMain.handle("shell-open-path", (_event: IpcMainInvokeEvent, path: string) => {
      shell.openPath(path);
    });


    // Dialog
    ipcMain.handle("dialog-show-open-dialog", (event: IpcMainInvokeEvent, options: OpenDialogSyncOptions) => {
      return dialog.showOpenDialogSync(
        BrowserWindow.fromWebContents(event.sender),
        options
      );
    });

    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        spellcheck: false,
      },
      frame: false,
      // remove the default titlebar
      titleBarStyle: 'hidden',
      titleBarOverlay: process.platform === "darwin",
      trafficLightPosition: {
        x: 10,
        y: 12,
      },
      useContentSize: true,
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    this.win = mainWindow;
  }
}

export default new WindowWrapper();