import dayjs from "@renderer/lib/dayjs";
import { MusicIcon, VideoIcon } from "lucide-react";

export const TranscriptionItem = (props: {
	transcription: Partial<TranscriptionType>;
}) => {
	const { transcription } = props;

	const createdAt = dayjs(transcription.createdAt);
	return (
		<div className="flex items-center gap-2">
			{transcription.targetType === "video" && <VideoIcon />}
			{transcription.targetType === "audio" && <MusicIcon />}

			<div>
				<p>{transcription.filename}</p>
				<p>{createdAt.fromNow()}</p>

				{transcription.recognitionResult?.timeline && (
					<p className="text-sm text-muted-foreground line-clamp-2">
						{transcription.recognitionResult.timeline[0].text}
					</p>
				)}
			</div>
		</div>
	);
};
