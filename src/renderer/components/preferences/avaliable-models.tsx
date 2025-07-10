import { ModelProviderContext } from "@/renderer/context/model-provider";
import {
	Button,
	ScrollArea,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@renderer/components/ui";
import { t } from "i18next";
import { RefreshCcwIcon } from "lucide-react";
import { useContext } from "react";
import { ModelList } from "./model-list";

export const AvailableModels = () => {
	const { reload } = useContext(ModelProviderContext);

	return (
		<div>
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-sm font-semibold">
					{t("preferences.availableModels")}
				</span>
				<Button variant="ghost" size="icon" onClick={reload}>
					<RefreshCcwIcon className="size-4" />
				</Button>
			</div>

			<div className="p-2 border rounded-md bg-muted/50">
				<Tabs defaultValue="all">
					<TabsList className="w-full grid grid-cols-3">
						<TabsTrigger value="all">{t("model.all")}</TabsTrigger>
						<TabsTrigger value="multiLanguage">
							{t("model.multiLanguage")}
						</TabsTrigger>
						<TabsTrigger value="onlyEnglish">
							{t("model.onlyEnglish")}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="all">
						<ScrollArea className="h-96">
							<span className="text-muted-foreground text-sm font-semibold ml-2 my-1">
								{t("model.all")}
							</span>
							<ModelList label="multiLanguage" />
							<span className="text-muted-foreground text-sm font-semibold ml-2 my-1">
								{t("model.multiLanguage")}
							</span>
							<ModelList label="onlyEnglish" />
						</ScrollArea>
					</TabsContent>

					<TabsContent value="multiLanguage">
						<ScrollArea className="h-96">
							<ModelList label="multiLanguage" />
						</ScrollArea>
					</TabsContent>

					<TabsContent value="onlyEnglish">
						<ScrollArea className="h-96">
							<ModelList label="onlyEnglish" />
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};
