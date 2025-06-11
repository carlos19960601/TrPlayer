import { DATABASE_NAME, LIBRARY_PATH_SUFFIX } from "@/constants";
import { AppSettingsKeyEnum } from "@/types/enums";
import { IpcMainInvokeEvent, app, ipcMain } from "electron";
import settings from "electron-settings";
import fs from "fs-extra";
import path from "path";

const libraryPath = () => {
  const _library = settings.getSync(AppSettingsKeyEnum.LIBRARY);

  if (!_library || typeof _library !== "string") {
    settings.setSync(
      AppSettingsKeyEnum.LIBRARY,
      process.env.LIBRARY_PATH ||
      path.join(app.getPath("documents"), LIBRARY_PATH_SUFFIX)
    );
  } else if (path.parse(_library).base !== LIBRARY_PATH_SUFFIX) {
    settings.setSync(
      AppSettingsKeyEnum.LIBRARY,
      path.join(_library, LIBRARY_PATH_SUFFIX)
    );
  }

  const library = settings.getSync(AppSettingsKeyEnum.LIBRARY) as string;
  fs.ensureDirSync(library);

  return library;
};

const cachePath = () => {
  const tmpDir = path.join(libraryPath(), "cache");
  fs.ensureDirSync(tmpDir);

  return tmpDir;
};

const storagePath = () => {
  const tmpDir = path.join(libraryPath(), "storage");
  fs.ensureDirSync(tmpDir);

  return tmpDir;
};


const dbPath = () => {
  if (!libraryPath()) return null;

  const dbName = app.isPackaged
    ? `${DATABASE_NAME}.sqlite`
    : `${DATABASE_NAME}_dev.sqlite`;
  return path.join(libraryPath(), dbName);
};

const modelPath = () => {
  const _modelPath = settings.getSync(AppSettingsKeyEnum.MODELS);
  if (!_modelPath || typeof _modelPath !== "string") {
    const modelDir = path.join(libraryPath(), "models")
    settings.setSync(AppSettingsKeyEnum.MODELS, modelDir)
  }

  const modelDir = settings.getSync(AppSettingsKeyEnum.MODELS) as string;
  fs.ensureDirSync(modelDir);

  return modelDir;
}

export default {
  registerIpcHandlers: () => {
    ipcMain.handle("app-settings-get-library", (_event: IpcMainInvokeEvent) => {
      libraryPath();
      return settings.getSync(AppSettingsKeyEnum.LIBRARY);
    });

    ipcMain.handle("app-settings-get-model-path", (_event: IpcMainInvokeEvent) => {
      return modelPath();
    })

    ipcMain.handle("app-settings-set-model-path", (_event: IpcMainInvokeEvent, path: string) => {
      return modelPath();
    })
  },
  libraryPath,
  dbPath,
  cachePath,
  storagePath,
  modelPath,
  ...settings,
}