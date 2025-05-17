import { Card, CardContent } from "@renderer/components/ui";
import dayjs from "@renderer/lib/dayjs";

export const TranscriptionCard = (props: {
	transcription: TranscriptionType;
}) => {
	const { transcription } = props;
	const createdAt = dayjs(transcription.createdAt);

	console.log(transcription);
	return (
		<Card className="p-0 overflow-hidden">
			<CardContent className="p-0">
				<img src="https://picsum.photos/300/200" />
				<div className="p-4 flex flex-col gap-2">
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>{createdAt.fromNow()}</span>
						<span>{createdAt.format("HH:mm")}</span>
					</div>

					<h2 className="font-bold">{transcription.filename}</h2>

					{transcription.recognitionResult?.timeline && (
						<p className="text-sm text-muted-foreground line-clamp-2">
							{transcription.recognitionResult.timeline[0].text}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
