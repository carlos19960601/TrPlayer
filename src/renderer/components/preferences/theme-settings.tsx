import { useTheme } from "@/renderer/context";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renderer/components/ui";
import { t } from "i18next";
import { PaletteIcon } from "lucide-react";

export const ThemeSettings = () => {
	const { setTheme, theme } = useTheme();

	return (
		<div className="flex items-center justify-between">
			<div className="flex gap-2 items-center">
				<PaletteIcon className="size-4" />
				{t("appearance.theme")}
			</div>
			<Select
				value={theme}
				onValueChange={(theme: ThemeType) => setTheme(theme)}
			>
				<SelectTrigger>
					<SelectValue placeholder={t(`appearance.${theme}`)} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="light">{t("appearance.light")}</SelectItem>
					<SelectItem value="dark">{t("appearance.dark")}</SelectItem>
					<SelectItem value="system">{t("appearance.system")}</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
