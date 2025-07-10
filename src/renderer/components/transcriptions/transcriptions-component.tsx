import {
	AppSettingsProviderContext,
	DbProviderContext,
} from "@/renderer/context";
import { transcriptionsReducer } from "@/renderer/reducers";
import { Tabs, TabsList, TabsTrigger } from "@renderer/components/ui";
import { t } from "i18next";
import { LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { useContext, useEffect, useReducer, useState } from "react";
import { toast } from "sonner";
import { TranscriptionCard } from "./transcription-card";
import { TranscriptionItem } from "./transcription-item";

export const TranscriptionsComponent = () => {
	const { addDblistener, removeDbListener } = useContext(DbProviderContext);
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const [layout, setLayout] = useState("grid");
	const [targetType, setTargetType] = useState("all");
	const [loading, setLoading] = useState(false);

	const [transcriptions, dispatchTranscriptions] = useReducer(
		transcriptionsReducer,
		[]
	);

	const fetchTranscriptions = async () => {
		if (loading) return;

		setLoading(true);

		TrPlayerApp.transcriptions
			.findAll({
				where: {},
				targetType,
			})
			.then((transcriptions: TranscriptionType[]) => {
				dispatchTranscriptions({ type: "set", records: transcriptions });
			})
			.catch((err: Error) => {
				toast.error(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchTranscriptions();
	}, [targetType]);

	const onTranscriptionsUpdate = (event: CustomEvent) => {
		const { record, action, model } = event.detail || {};

		if (model === "Transcription") {
			switch (action) {
				case "create":
					dispatchTranscriptions({ type: "append", record });
					break;
				case "update":
					dispatchTranscriptions({ type: "update", record });
					break;
				case "destroy":
					dispatchTranscriptions({ type: "destroy", record });
					break;
			}
		}
	};

	useEffect(() => {
		addDblistener(onTranscriptionsUpdate);

		return () => {
			removeDbListener(onTranscriptionsUpdate);
		};
	}, []);

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
					<div className="grid gap-4 grid-cols-3 lg:grid-cols-4">
						{transcriptions.map((transcription) => (
							<TranscriptionCard
								transcription={transcription}
								key={transcription.id}
							/>
						))}
					</div>
				)}
				{layout === "list" && (
					<div className="flex flex-col gap-2">
						{transcriptions.map((transcription) => (
							<TranscriptionItem
								transcription={transcription}
								key={transcription.id}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
