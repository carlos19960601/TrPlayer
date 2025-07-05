import {
	MediaShadowProviderContext,
	ThemeProviderContext,
} from "@/renderer/context";
import { formatDuration } from "@/renderer/lib/utils";
import { millisecondsToTimestamp } from "@/utils";
import {
	MediaTimeUpdateEvent,
	MediaTimeUpdateEventDetail,
	TextTrack,
	MediaPlayer as VidstackMediaPlayer,
	MediaProvider as VidstackMediaProvider,
} from "@vidstack/react";
import {
	DefaultAudioLayout,
	DefaultVideoLayout,
	defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { Clock5Icon } from "lucide-react";
import { useContext, useEffect } from "react";
import { toast } from "sonner";

export const MediaProvider = () => {
	const { media, transcription, setCurrentSegmentIndex, playerRef } =
		useContext(MediaShadowProviderContext);
	const { theme } = useContext(ThemeProviderContext);
	if (!media?.src) return null;

	const handleTimeUpdate = (
		detail: MediaTimeUpdateEventDetail,
		nativeEvent: MediaTimeUpdateEvent,
	) => {
		if (transcription?.recognitionResult) {
			const index = transcription.recognitionResult.timeline.findIndex(
				(t) =>
					detail.currentTime * 1000 >= t.startTime &&
					detail.currentTime * 1000 < t.endTime,
			);
			setCurrentSegmentIndex(index);
		}
	};

	useEffect(() => {
		if (!transcription?.recognitionResult?.timeline) return;
		if (!playerRef?.current) return;

		const srt = transcription.recognitionResult.timeline
			.map(
				(t: TimelineEntry, index: number) =>
					`${index + 1}\n${millisecondsToTimestamp(t.startTime)} --> ${millisecondsToTimestamp(t.endTime)}\n${t.text}${t.translation}`,
			)
			.join("\n\n");

		playerRef.current.textTracks.clear();
		playerRef.current.textTracks.add(
			new TextTrack({
				label: "Transcription",
				content: srt,
				kind: "subtitles",
				type: "srt",
				language: "double",
			}),
		);
	}, [transcription]);

	return (
		<div className="flex flex-col px-2 gap-4">
			<VidstackMediaPlayer
				ref={playerRef}
				src={`local://${media.src}`}
				onError={(err) => {
					toast.error(err.message);
				}}
				onTimeUpdate={handleTimeUpdate}
			>
				<VidstackMediaProvider />
				<DefaultAudioLayout icons={defaultLayoutIcons} colorScheme={theme} />
				<DefaultVideoLayout icons={defaultLayoutIcons} colorScheme={theme} />
			</VidstackMediaPlayer>

			<div className="flex flex-row px-2 items-center justify-between">
				<h2 className="flex-2/3 text-lg font-bold break-words min-w-0">
					{media.name}
				</h2>
				<div className="flex-1/3 flex justify-end">
					<div className="flex flex-col gap-1 items-center">
						<div className="flex gap-2 items-center">
							<Clock5Icon className="size-4" />
							<span>{formatDuration(media.duration, "second")}</span>
						</div>
						<span className="text-xs text-muted-foreground">
							Total Duration
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
