import { t } from "i18next";
import { AvailableModels } from "./avaliable-models";
import { ModelFolderSettings } from "./model-folder-settings";

const ModelSettings = () => {
	return (
		<div className="flex flex-col gap-4">
			<div className="">
				<span className="text-muted-foreground text-sm font-semibold">
					{t("preferences.model")}
				</span>
				<div className="border rounded-md bg-muted/50">
					<ModelFolderSettings />
				</div>
			</div>

			<AvailableModels />
		</div>
	);
};

export default ModelSettings;
