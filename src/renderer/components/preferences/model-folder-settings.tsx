import { AppSettingsProviderContext } from "@/renderer/context";
import { t } from "i18next";
import { FolderOpenIcon, PackageIcon } from "lucide-react";
import { useContext } from "react";
import { Button } from "@renderer/components/ui";

export const ModelFolderSettings = () => {
	const { modelPath, TrPlayerApp } = useContext(AppSettingsProviderContext);

	const openModelDir = () => {
		TrPlayerApp.shell.openPath(modelPath);
	};

	const handleChooseModelPath = async () => {
		const filePaths = await TrPlayerApp.dialog.showOpenDialog({
			properties: ["openDirectory"],
		});

		if (filePaths) {
			await TrPlayerApp.appSettings.setModelPath(filePaths[0]);
			const _modelDir = await TrPlayerApp.appSettings.getModelPath();
			// if (_modelDir != modelPath) {

			// }
		}
	};

	return (
		<div className="flex p-2 items-center justify-between">
			<div>
				<div className="flex gap-2 items-center">
					<PackageIcon className="size-3" />
					{t("model.modelFolder")}
				</div>
				<span className="ml-5 text-muted-foreground text-xs">{modelPath}</span>
			</div>

			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={openModelDir}>
					<FolderOpenIcon className="size-4" />
					<span>{t("model.openFolder")}</span>
				</Button>

				<Button variant="outline" size="sm" onClick={handleChooseModelPath}>
					<FolderOpenIcon className="size-4" />
					<span>{t("model.changeFolder")}</span>
				</Button>
			</div>
		</div>
	);
};
