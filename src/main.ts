import log from "@main/logger";
import settings from "@main/settings";
import mainWindow from "@main/window";
import { BrowserWindow, app, net, protocol } from "electron";
import started from "electron-squirrel-startup";
import fs from "fs-extra";

const logger = log.scope("main");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: "local",
    privileges: {
      standard: true,
      secure: true,
      stream: true,
      supportFetchAPI: true,
      codeCache: true,
    },
  },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  protocol.handle("local", (request) => {
    logger.info("Handling local protocol request")
    logger.debug("original url: ", request.url)
    let url = request.url.replace("local://", "");
    url = decodeURIComponent(url)
    // url = path.normalize(url)
    log.info("decodeURIComponent local protocol request", url);
    return net.fetch(`file:///${url}`);
  });

  mainWindow.init();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow.init();
  }
});

// Clean up cache folder before quit
app.on("before-quit", () => {
  try {
    fs.emptyDirSync(settings.cachePath());
  } catch (err) { }
});
