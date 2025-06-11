
type TrPlayerType = {
  app: {
    getPlatformInfo: () => Promise<PlatformInfoType>;
    onCmdOutput: (callback: (event, output: string) => void) => void;
    removeCmdOutputListeners: () => void;
  },
  appSettings: {
    getModelPath: () => Promise<string>;
    setModelPath: (path: string) => Promise<void>;
  },
  audios: {
    create: (uri: string) => Promise<AudioType>
  },
  db: {
    connect: () => Promise<DbState>,
    onTransaction: (
      callback: (event, state: TransactionStateType) => void
    ) => Promise<void>;
    removeListeners: () => Promise<void>;
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
  ffmpeg: {
    transcode: (
      input: string
    ) => Promise<string>;
  },
  model: {
    getModels: () => Promise<ModelType[]>;
    download: (model: ModelType) => Promise<void>;
    cancel: (model: ModelType) => Promise<void>;
  },
  shell: {
    openPath: (path: string) => Promise<void>;
  },
  transcriptions: {
    findOrCreate: (params: any) => Promise<TranscriptionType>;
    findAll: (params: any) => Promise<TranscriptionType[]>;
    update: (id: string, params: Partial<Omit<TranscriptionType, "id">>) => Promise<void>;
    destroy: (id: string) => Promise<undefined>;
  },
  userSettings: {
    get: (key: UserSettingKeyEnum) => Promise<any>;
    set: (key: UserSettingKeyEnum, value: any) => Promise<void>;
  },
  videos: {
    findOne: (params: any) => Promise<VideoType | null>;
    create: (uri: string) => Promise<VideoType>;
  },
  whisper: {
    recognize: (params: {
      url: string,
      language: string,
      model: string,
    }) => Promise<RecognitionResult>
  }
}