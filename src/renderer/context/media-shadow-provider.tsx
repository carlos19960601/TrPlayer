import { AppSettingsProviderContext } from "@renderer/context";
import { useTranscriptions } from "@renderer/hooks/use-transcriptions";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type MediaShadowProviderState = {
	media: AudioType | VideoType;
	setMedia: (media: AudioType | VideoType) => void;
	onCancel: () => void;
	transcription: TranscriptionType;
	transcribing: boolean;
	transcribingProgress: number;
	transcribingOutput: string;
	generateTranscription: (params?: {
		language?: string;
		model?: string;
	}) => Promise<void>;
};

export const MediaShadowProviderContext =
	createContext<MediaShadowProviderState>(null);

interface MediaShadowProviderProps {
	onCancel?: () => void;
}

export const MediaShadowProvider = ({
	children,
	onCancel,
}: PropsWithChildren<MediaShadowProviderProps>) => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	const navigate = useNavigate();

	const [media, setMedia] = useState<AudioType | VideoType>(null);

	//  Player state
	const {
		transcription,
		generateTranscription,
		transcribing,
		transcribingProgress,
		transcribingOutput,
	} = useTranscriptions(media);

	return (
		<MediaShadowProviderContext.Provider
			value={{
				media,
				setMedia,
				onCancel: onCancel || (() => navigate(-1)),
				transcription,
				transcribing,
				transcribingProgress,
				transcribingOutput,
				generateTranscription,
			}}
		>
			{children}
		</MediaShadowProviderContext.Provider>
	);
};
