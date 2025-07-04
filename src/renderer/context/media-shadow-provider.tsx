import { useTranscriptions } from "@renderer/hooks/use-transcriptions";
import Artplayer from "artplayer";
import {
	PropsWithChildren,
	createContext,
	useEffect,
	useRef,
	useState,
} from "react";
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
	// artPlayer
	artPlayer: Artplayer;
	setArtPlayerRef: (ref: any) => void;
	// player state
	currentTime: number;
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

	const [artPlayerRef, setArtPlayerRef] = useState(null);
	const [artPlayer, setArtPlayer] = useState<Artplayer>(null);

	// player state
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);

	const transcriptionRef = useRef<TranscriptionType>(null);

	//  Player state
	const {
		transcription,
		generateTranscription,
		transcribing,
		transcribingProgress,
		transcribingOutput,
	} = useTranscriptions(media);

	const initializeArtPlayer = () => {
		if (!media) return;
		if (!media.src) return;
		if (!artPlayerRef?.current) return;

		const artPlayer = new Artplayer({
			url: encodeURI(`local://${media.src}`),
			container: artPlayerRef.current,
			loop: false,
			autoSize: true,
			autoplay: false,
		});

		setArtPlayer(artPlayer);
	};

	// 这届使用transcription，由于闭包问题，导致逻辑一直不会执行
	// 如果将transcription添加到useEffect的依赖项中，
	// 但这种方式会频繁触发 ArtPlayer 的事件绑定/解绑，不够优雅，容易出错。
	// 所以使用 useRef 保存最新值
	const videoTimeUpdateListener = () => {
		setCurrentTime(artPlayer.currentTime);

		if (transcriptionRef.current.recognitionResult) {
			const index =
				transcriptionRef.current.recognitionResult.timeline.findIndex(
					(t) =>
						artPlayer.currentTime * 1000 >= t.startTime &&
						artPlayer.currentTime * 1000 < t.endTime
				);
			setCurrentSegmentIndex(index);
		}
	};

	useEffect(() => {
		transcriptionRef.current = transcription;
	}, [transcription]);

	// Initialize artPlayer when media changes
	useEffect(() => {
		initializeArtPlayer();
	}, [media, artPlayerRef]);

	useEffect(() => {
		if (!artPlayer) return;

		setCurrentTime(0);

		artPlayer.on("video:timeupdate", videoTimeUpdateListener);

		return () => {
			artPlayer.off("video:timeupdate", videoTimeUpdateListener);
			artPlayer.destroy();
		};
	}, [artPlayer]);

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
				artPlayer,
				setArtPlayerRef,
				currentTime,
				currentSegmentIndex,
				setCurrentSegmentIndex,
			}}
		>
			{children}
		</MediaShadowProviderContext.Provider>
	);
};
