import { useContext, useEffect, useState } from "react";
import { AppSettingsProviderContext } from "./app-settings-provider";

export const useTranscriptions = (media: AudioType | VideoType) => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	const [creating, setCreating] = useState<boolean>(false);
	const [transcription, setTranscription] = useState<TranscriptionType>(null);

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

	/*
	 * find or create transcription
	 */
	useEffect(() => {
		if (!media) return;

		findOrCreateTranscription();
	}, [media]);

	return {
		transcription,
	};
};
