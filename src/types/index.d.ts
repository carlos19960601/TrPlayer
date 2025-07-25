interface PlatformInfoType {
	platform: string;
	arch: string;
	version: string;
}

type PlatformType = "darwin" | "win32" | "linux";

type ThemeType = "light" | "dark" | "system";

type LanguageType = "en" | "zh-CN";

type ModelState = "installed" | "uninstall";

interface ModelType {
	name: string;
	value: string;
	description: string;
	state?: ModelState;
	label: string;
}

type ModelState = "installed" | "downloading" | "uninstall";

type DownloadType = "model";

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

type TranscribeConfigType = {
	model: string;
	language: LanguageType;
};

type MediaType = "Audio" | "Video" | "Unknown";

type TransactionStateType = {
	model: string;
	id: string;
	action: "create" | "update" | "destroy";
	record?: VideoType;
};

type TranslateConfigType = {
	providerId: string;
	targetLanguage: string;
	modelId: string;
};

type MediaExportConfigType = {
	format: string;
	language: ExportLanguageType;
}


type ExportLanguageType = "original" | "translated" | "multi"

type AssExportConfigType = {
	language: ExportLanguageType;
}