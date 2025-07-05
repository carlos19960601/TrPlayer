import { useTranscriptions } from "@renderer/hooks/use-transcriptions";
import { MediaPlayerInstance } from "@vidstack/react";
import log from "electron-log/renderer";
import {
	PropsWithChildren,
	RefObject,
	createContext,
	useRef,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";

const logger = log.scope("media-shadow-provider.tsx");

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
	playerRef: RefObject<MediaPlayerInstance>;
	// player state
	currentSegmentIndex: number;
	setCurrentSegmentIndex: (index: number) => void;
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
	const navigate = useNavigate();

	const [media, setMedia] = useState<AudioType | VideoType>(null);
	const playerRef = useRef<MediaPlayerInstance>(null);

	// player state
	const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);

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
				playerRef,
				currentSegmentIndex,
				setCurrentSegmentIndex,
			}}
		>
			{children}
		</MediaShadowProviderContext.Provider>
	);
};
