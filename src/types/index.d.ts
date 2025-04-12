interface PlatformInfoType {
  platform: string;
  arch: string;
  version: string;
}

type PlatformType = "darwin" | "win32" | "linux";

type ThemeType = "light" | "dark" | "system";

type LanguageType = "en" | "zh-CN"

interface ModelType {
  name: string;
  value: string;
  description: string;
  state?: string;
  label: string;
}

type ModelState = "installed" | "downloading" | "uninstall";


type DownloadType = "model"

type DownloadStateType = {
  name: string;
  type: DownloadType;
  isPaused: boolean;
  canResume: boolean;
  state: "progressing" | "interrupted" | "completed" | "cancelled";
  received: number;
  total: number;
  speed?: string;
};


