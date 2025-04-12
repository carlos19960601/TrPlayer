import { cn } from "@/renderer/lib/utils";
import { t } from "i18next";
import { FolderIcon, LanguagesIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Button, ScrollArea } from "../ui";
import { GeneralSettings } from "./general-settings";
import ModelSettings from "./model-settings";

export const Preferences = () => {
	const [activeTab, setActiveTab] = useState<string>("general");

	const TABS = [
		{
			value: "general",
			label: t("preferences.generalSettings"),
			icon: SettingsIcon,
			component: () => <GeneralSettings />,
		},
		{
			value: "preferences.ollama",
			label: t("LLM"),
			icon: SettingsIcon,
			component: () => <div>General</div>,
		},
		{
			value: "translations",
			label: t("preferences.ollamaSettings"),
			icon: LanguagesIcon,
			component: () => <div>General</div>,
		},
		{
			value: "models",
			label: t("preferences.models"),
			icon: FolderIcon,
			component: () => <ModelSettings />,
		},
	];

	return (
		<div className="h-full overflow-hidden grid grid-cols-5">
			<ScrollArea className="min-h-full col-span-1 bg-muted/50 p-4">
				<div className="py-2 text-muted-foreground mb-4">
					{t("preferences.title")}
				</div>

				{TABS.map((tab) => (
					<Button
						key={tab.value}
						variant={activeTab === tab.value ? "default" : "ghost"}
						size="sm"
						className={cn(
							"capitalize w-full justify-start mb-2",
							activeTab === tab.value ? "" : "hover:bg-muted",
						)}
						onClick={() => setActiveTab(tab.value)}
					>
						<tab.icon className="mr-2 h-4 w-4" />
						<span className="text-sm">{tab.label}</span>
					</Button>
				))}
			</ScrollArea>
			<ScrollArea className="min-h-full col-span-4 py-6 px-10">
				{TABS.find((tab) => tab.value === activeTab)?.component()}
			</ScrollArea>
		</div>
	);
};
