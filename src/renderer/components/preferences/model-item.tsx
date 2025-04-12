import { AppSettingsProviderContext } from "@/renderer/context";
import { ModelProviderContext } from "@/renderer/context/model-provider";
import { t } from "i18next";
import { CircleCheck } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui";
import { Progress } from "../ui/progress";

interface ModelItemProps {
	value: string;
}

export const ModelItem = (props: ModelItemProps) => {
	const { value } = props;
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const [progress, setProgress] = useState(0);
	const { models, downloadModel, cancelDownload, downloadingModel, reload } =
		useContext(ModelProviderContext);

	const model = models.find((m) => m.value === value);

	useEffect(() => {
		TrPlayerApp.download.onState((_event, downloadState: DownloadStateType) => {
			const { type, state, received, total } = downloadState;
			if (type !== "model") return;

			if (state === "progressing")
				setProgress(Math.floor((received / total) * 100));

			if (state === "completed") reload();
		});

		return () => {
			TrPlayerApp.download.removeAllListeners();
		};
	}, []);

	if (!model) return null;

	return (
		<div className="flex items-center justify-between px-4 py-2 mb-1 hover:bg-muted">
			<div className="flex flex-col gap-1">
				<div>{model.name}</div>
				<div className="text-muted-foreground text-xs">
					{t(`model.${model.description}`)}
				</div>
			</div>

			<ModelAction
				model={model}
				progress={progress}
				downloadingModel={downloadingModel}
				downloadModel={downloadModel}
				cancelDownload={cancelDownload}
			/>
		</div>
	);
};

const ModelAction = ({
	model,
	progress,
	downloadingModel,
	downloadModel,
	cancelDownload,
}: {
	model: ModelType;
	progress: number;
	downloadingModel: ModelType | null;
	downloadModel: (model: ModelType) => void;
	cancelDownload: (model: ModelType) => void;
}) => {
	if (model.state === "installed") {
		return <CircleCheck className="size-4 text-green-400" />;
	}

	if (downloadingModel?.value === model.value) {
		return (
			<div className="flex gap-2 items-center">
				<Progress value={progress} className="w-16" />
				<span className="text-sm">{progress}%</span>
				<Button
					variant="destructive"
					onClick={() => cancelDownload(model)}
					size="sm"
				>
					{t("cancel")}
				</Button>
			</div>
		);
	}

	return (
		<Button
			variant="outline"
			onClick={() => downloadModel(model)}
			size="sm"
			disabled={!!downloadingModel}
		>
			{t("download")}
		</Button>
	);
};
