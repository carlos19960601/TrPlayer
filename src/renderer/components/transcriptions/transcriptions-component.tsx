import { AppSettingsProviderContext } from "@/renderer/context";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui/tabs";
import { t } from "i18next";
import { LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { TranscriptionCard } from "./transcription-card";

export const TranscriptionsComponent = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const [layout, setLayout] = useState("grid");
	const [targetType, setTargetType] = useState("all");
	const [transcriptions, setTranscriptions] = useState<TranscriptionType[]>([]);

	const fetchTranscriptions = async () => {
		const transcriptions = await TrPlayerApp.transcriptions.findAll({
			where: {},
			targetType,
		});
		setTranscriptions(transcriptions);
	};

	useEffect(() => {
		fetchTranscriptions();
	}, [targetType]);

	return (
		<div className="flex flex-col h-full gap-4">
			<div className="flex justify-between">
				<Tabs value={targetType} onValueChange={setTargetType}>
					<TabsList>
						<TabsTrigger value="all">{t("all")}</TabsTrigger>
						<TabsTrigger value="video">{t("video")}</TabsTrigger>
						<TabsTrigger value="audio">{t("audio")}</TabsTrigger>
					</TabsList>
				</Tabs>

				<Tabs value={layout} onValueChange={setLayout}>
					<TabsList>
						<TabsTrigger value="grid">
							<LayoutGridIcon className="h-4 w-4" />
						</TabsTrigger>
						<TabsTrigger value="list">
							<LayoutListIcon className="h-4 w-4" />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="">
				{layout === "grid" && (
					<div className="grid gap-4 grid-cols-4">
						{transcriptions.map((transcription) => (
							<TranscriptionCard transcription={transcription} />
						))}
					</div>
				)}
				{layout === "list" && <div></div>}
			</div>
		</div>
	);
};
