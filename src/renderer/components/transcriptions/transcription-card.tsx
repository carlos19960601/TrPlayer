import { AppSettingsProviderContext } from "@/renderer/context";
import { Button, Card, CardContent } from "@renderer/components/ui";
import dayjs from "@renderer/lib/dayjs";
import { TrashIcon } from "lucide-react";
import { MouseEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const TranscriptionCard = (props: {
	transcription: Partial<TranscriptionType>;
}) => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const navigate = useNavigate();
	const { transcription } = props;
	const createdAt = dayjs(transcription.createdAt);

	console.log(transcription);

	const handleTranscriptionDelete = (e: MouseEvent) => {
		e.stopPropagation();
		TrPlayerApp.transcriptions
			.destroy(transcription.id)
			.catch((err) => toast.error(err.message));
	};

	const handleClick = () => {
		navigate(
			`${transcription.targetType.toLowerCase()}s/${transcription.targetId}`,
		);
	};

	return (
		<Card
			className="p-0 overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
			onClick={handleClick}
		>
			<CardContent className="p-0">
				<div className="relative">
					{/* <img src="https://picsum.photos/300/200" /> */}
					<img src={transcription.coverUrl} />
					<div className="absolute top-1 right-1 group-hover:block hidden">
						<Button
							variant="ghost"
							size="icon"
							className="text-white bg-gray-900/50 hover:bg-gray-900/70 hover:text-white"
							onClick={handleTranscriptionDelete}
						>
							<TrashIcon />
						</Button>
					</div>
				</div>

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
