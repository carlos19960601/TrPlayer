
type TrPlayerType = {
  app: {
    getPlatformInfo: () => Promise<PlatformInfoType>;
  },
  appSettings: {
    getModelPath: () => Promise<string>;
    setModelPath: (path: string) => Promise<void>;
  },
  db: {
    connect: () => Promise<DbState>,
  },
  dialog: {
    showOpenDialog: (
      options: Electron.OpenDialogOptions
    ) => Promise<string[] | undefined>;
  },
  download: {
    onState: (callback: (event: IpcRendererEvent, state: DownloadStateType) => void) => void;
    start: (options: {
      url: string,
      savePath?: string
      type: string,
    }) => Promise<string | undefined>;
    removeAllListeners: () => void;
  },
  model: {
    getModels: () => Promise<ModelType[]>;
    download: (model: ModelType) => Promise<void>;
    cancel: (model: ModelType) => Promise<void>;
  },
  shell: {
    openPath: (path: string) => Promise<void>;
  },
  userSettings: {
    get: (key: UserSettingKeyEnum) => Promise<any>;
    set: (key: UserSettingKeyEnum, value: any) => Promise<void>;
  },
}