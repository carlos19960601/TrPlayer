import { cn } from "@/renderer/lib/utils";
import { Button, ScrollArea } from "@renderer/components/ui";
import { t } from "i18next";
import { FolderIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { GeneralSettings } from "./general-settings";
import { LlmProviderSettings } from "./llm-provider-settings";
import ModelSettings from "./model-settings";

export const Preferences = () => {
	const [activeTab, setActiveTab] = useState<string>("general");

	const TABS = [
		{
			value: "general",
			label: t("preferences.generalSettings"),
			icon: SettingsIcon,
			component: () => (
				<ScrollArea className="min-h-full col-span-4 py-6 px-10">
					<GeneralSettings />
				</ScrollArea>
			),
		},
		{
			value: "llm-providers",
			label: t("LLM"),
			icon: SettingsIcon,
			component: () => (
				<div className="min-h-full col-span-4 py-6 px-10">
					<LlmProviderSettings />
				</div>
			),
		},
		{
			value: "models",
			label: t("preferences.models"),
			icon: FolderIcon,
			component: () => (
				<ScrollArea className="min-h-full col-span-4 py-6 px-10">
					<ModelSettings />
				</ScrollArea>
			),
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
							activeTab === tab.value ? "" : "hover:bg-muted"
						)}
						onClick={() => setActiveTab(tab.value)}
					>
						<tab.icon className="mr-2 h-4 w-4" />
						<span className="text-sm">{tab.label}</span>
					</Button>
				))}
			</ScrollArea>
			{TABS.find((tab) => tab.value === activeTab)?.component()}
		</div>
	);
};
