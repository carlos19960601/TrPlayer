import { UserSettingKeyEnum } from "@/types/enums";
import { DbProviderContext } from "@renderer/context";
import i18n from "@renderer/i18n";
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

type AppSettingsProviderState = {
	TrPlayerApp?: TrPlayerType;
	initialized: boolean;
	language?: LanguageType;
	switchLanguage?: (language: LanguageType) => void;
	isSidebarCollapsed?: boolean;
	switchSidebarCollapsed?: () => void;
	modelPath?: string;
	llmProviders?: LlmProviderType[];
	getLlmProviderById?: (providerId: string) => LlmProviderType;
};

const initialState: AppSettingsProviderState = {
	initialized: false,
};

export const AppSettingsProviderContext =
	createContext<AppSettingsProviderState>(initialState);

export const AppSettingsProvider = ({ children }: PropsWithChildren) => {
	const TrPlayerApp = window.__TRPLAYER_APP__;
	const db = useContext(DbProviderContext);

	const [language, setLanguage] = useState<LanguageType>();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [modelPath, setModelPath] = useState("");

	const switchSidebarCollapsed = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	// Path
	const fetchModelPath = async () => {
		const dir = await TrPlayerApp.appSettings.getModelPath();
		setModelPath(dir);
	};

	// Language
	const fetchLanguages = async () => {
		const language = await TrPlayerApp.userSettings.get(
			UserSettingKeyEnum.LANGUAGE,
		);
		setLanguage((language as LanguageType) || "en");
		i18n.changeLanguage(language);
	};

	const switchLanguage = (language: LanguageType) => {
		TrPlayerApp.userSettings
			.set(UserSettingKeyEnum.LANGUAGE, language)
			.then(() => {
				i18n.changeLanguage(language);
				setLanguage(language);
			});
	};

	useEffect(() => {
		if (db.state === "connected") {
			fetchLanguages();
		}
	}, [db.state]);

	useEffect(() => {
		fetchModelPath();
	}, []);

	return (
		<AppSettingsProviderContext.Provider
			value={{
				TrPlayerApp: TrPlayerApp,
				initialized: db.state === "connected",
				language: language,
				switchLanguage: switchLanguage,
				isSidebarCollapsed: isSidebarCollapsed,
				switchSidebarCollapsed: switchSidebarCollapsed,
				modelPath,
			}}
		>
			{children}
		</AppSettingsProviderContext.Provider>
	);
};
