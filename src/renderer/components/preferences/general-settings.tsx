import { t } from "i18next";
import { LanguageSettings } from "./language-settings";
import { ThemeSettings } from "./theme-settings";

export const GeneralSettings = () => {
	return (
		<div className="flex flex-col gap-4">
			<div className="font-semibold text-muted-foreground text-sm">
				{t("preferences.appearance")}
				<div className="p-2 border rounded-md bg-muted/50">
					<ThemeSettings />
				</div>
			</div>

			<div className="font-semibold text-muted-foreground text-sm">
				{t("preferences.language")}
				<div className="p-2 border rounded-md bg-muted/50">
					<LanguageSettings />
				</div>
			</div>
		</div>
	);
};
