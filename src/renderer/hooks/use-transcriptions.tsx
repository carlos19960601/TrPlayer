import { useTranscribe } from "@/renderer/hooks/use-transcribe";
import {
	AppSettingsProviderContext,
	DbProviderContext,
} from "@renderer/context";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const useTranscriptions = (media: AudioType | VideoType) => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const { addDblistener, removeDbListener } = useContext(DbProviderContext);

	const [creating, setCreating] = useState<boolean>(false);
	const [transcription, setTranscription] = useState<TranscriptionType>(null);
	const [transcribing, setTranscribing] = useState<boolean>(false);
	const [transcribingProgress, setTranscribingProgress] = useState<number>(0);
	const [transcribingOutput, setTranscribingOutput] = useState<string>("");
	const { transcribe, output } = useTranscribe();

	const findOrCreateTranscription =
		async (): Promise<TranscriptionType | void> => {
			if (!media) return;
			if (creating) return;

			try {
				setCreating(true);
				const tr = await TrPlayerApp.transcriptions.findOrCreate({
					targetId: media.id,
					targetType: media.mediaType,
				});
				setTranscription(tr);
				return tr;
			} catch (err) {
				console.error(err);
				return null;
			} finally {
				setCreating(false);
			}
		};

	const generateTranscription = async (params?: {
		language: string;
		model: string;
	}) => {
		const { language, model } = params || {};
		setTranscribing(true);
		setTranscribingProgress(0);

		try {
			const result = await transcribe(media.src, {
				targetId: media.id,
				targetType: media.mediaType,
				language,
				model,
			});

			await TrPlayerApp.transcriptions.update(transcription.id, {
				state: "finished",
				language: language,
				recognitionResult: result,
			});

			setTranscribing(false);
		} catch (err) {
			setTranscribing(false);
			toast.error(err.message);
		}
	};

	const onTranscriptionUpdate = (event: CustomEvent) => {
		if (!transcription) return;

		const { model, action, record } = event.detail || {};
		if (
			model === "Transcription" &&
			record.id === transcription.id &&
			action === "update"
		) {
			setTranscription(record);
		}
	};

	const abortGenerateTranscription = () => {
		setTranscribing(false);
	};

	/*
	 * find or create transcription
	 */
	useEffect(() => {
		if (!media) return;

		findOrCreateTranscription();
	}, [media]);

	/*
	 * listen to transcription update
	 */
	useEffect(() => {
		if (!transcription) return;

		addDblistener(onTranscriptionUpdate);
		return () => {
			removeDbListener(onTranscriptionUpdate);
		};
	}, [transcription]);

	return {
		transcription,
		generateTranscription,
		abortGenerateTranscription,
		transcribing,
		transcribingProgress,
		transcribingOutput: output || transcribingOutput,
	};
};
