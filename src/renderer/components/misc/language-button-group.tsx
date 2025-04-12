import { AppSettingsProviderContext } from "@/renderer/context";
import { Button } from "@renderer/components/ui";
import { useContext } from "react";

const LanguageButtonGroup = () => {
	const { language, switchLanguage } = useContext(AppSettingsProviderContext);

	return (
		<div className="space-x-2">
			<Button
				variant={language === "en" ? "default" : "outline"}
				onClick={() => switchLanguage("en")}
			>
				English
			</Button>
			<Button
				variant={language === "zh-CN" ? "default" : "outline"}
				onClick={() => switchLanguage("zh-CN")}
			>
				简体中文
			</Button>
		</div>
	);
};

export default LanguageButtonGroup;
