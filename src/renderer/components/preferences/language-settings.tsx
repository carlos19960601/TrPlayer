import { AppSettingsProviderContext } from "@/renderer/context";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renderer/components/ui";
import { t } from "i18next";
import { LanguagesIcon } from "lucide-react";
import { useContext } from "react";

export const LanguageSettings = () => {
	const { language, switchLanguage } = useContext(AppSettingsProviderContext);

	return (
		<div className="flex items-center justify-between">
			<div className="flex gap-2 items-center">
				<LanguagesIcon className="size-4" />
				{t("language.changeLanguage")}
			</div>
			<Select
				value={language}
				onValueChange={(lang: LanguageType) => switchLanguage(lang)}
			>
				<SelectTrigger>
					<SelectValue
						placeholder={
							language ? t(`language.${language}`) : "Select a Language"
						}
					/>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="en">{t("language.en")}</SelectItem>
					<SelectItem value="zh-CN">{t("language.zh-CN")}</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
