import { AppSettingsProviderContext } from "@renderer/context";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranscriptions } from "./use-transcriptions";

type MediaShadowProviderState = {
	media: AudioType | VideoType;
	setMedia: (media: AudioType | VideoType) => void;
	onCancel: () => void;
	transcription: TranscriptionType;
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
	const { transcription } = useTranscriptions(media);

	return (
		<MediaShadowProviderContext.Provider
			value={{
				media,
				setMedia,
				onCancel: onCancel || (() => navigate(-1)),
				transcription,
			}}
		>
			{children}
		</MediaShadowProviderContext.Provider>
	);
};
