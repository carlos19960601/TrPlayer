import { AppSettingsProviderContext } from "@/renderer/context";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@renderer/components/ui";
import dayjs from "@renderer/lib/dayjs";
import { t } from "i18next";
import {
	Clock5Icon,
	MoreHorizontalIcon,
	MusicIcon,
	TrashIcon,
	VideoIcon,
} from "lucide-react";
import { MouseEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const TranscriptionItem = (props: {
	transcription: Partial<TranscriptionType>;
}) => {
	const { transcription } = props;
	const navigate = useNavigate();

	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	const createdAt = dayjs(transcription.createdAt);

	const handleClick = () => {
		navigate(
			`${transcription.targetType.toLowerCase()}s/${transcription.targetId}`
		);
	};

	const handleTranscriptionDelete = (e: MouseEvent) => {
		e.stopPropagation();
		TrPlayerApp.transcriptions
			.destroy(transcription.id)
			.catch((err) => toast.error(err.message));
	};

	return (
		<div
			className="flex items-start gap-3 border p-4 rounded-md shadow hover:bg-blue-500/30 hover:outline-2 hover:outline-blue-500/50 cursor-pointer"
			onClick={handleClick}
		>
			{transcription.targetType === "Video" && (
				<VideoIcon className="size-4 mt-1" />
			)}
			{transcription.targetType === "Audio" && (
				<MusicIcon className="size-4 mt-1" />
			)}

			<div className="w-full">
				<div className="flex justify-between">
					<p className="font-bold">{transcription.filename}</p>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm">
								<MoreHorizontalIcon className="size-3" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={handleTranscriptionDelete}>
								<TrashIcon className="size-3 text-destructive" />
								<span className="ml-1 text-destructive">{t("delete")}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex gap-2 items-center text-muted-foreground">
					<Clock5Icon className="size-3" />
					<span>{createdAt.fromNow()}</span>
				</div>

				{transcription.recognitionResult?.timeline && (
					<p className="text-sm text-muted-foreground line-clamp-2">
						{transcription.recognitionResult.timeline[0].text}
					</p>
				)}
			</div>
		</div>
	);
};
