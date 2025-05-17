import { MediaShadowProviderContext } from "@/renderer/context";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@renderer/components/ui";
import { t } from "i18next";
import { LoaderIcon } from "lucide-react";
import { useContext } from "react";
import { TranscriptionCreateForm } from "../transcriptions/transcription-create-form";

export const MediaLoadingModal = () => {
	const { transcription } = useContext(MediaShadowProviderContext);
	return (
		<AlertDialog open={!transcription?.recognitionResult?.timeline}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("preparingMedia")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("itMayTakeAWhileToPrepareForTheFirstLoad")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<LoadingContent />
			</AlertDialogContent>
		</AlertDialog>
	);
};

const LoadingContent = () => {
	const {
		transcribing,
		transcription,
		transcribingProgress,
		transcribingOutput,
		generateTranscription,
		onCancel,
	} = useContext(MediaShadowProviderContext);

	if (transcription && !transcription.recognitionResult?.timeline) {
		return (
			<TranscriptionCreateForm
				transcribing={transcribing}
				transcribingProgress={transcribingProgress}
				transcribingOutput={transcribingOutput}
				onSubmit={(data) => {
					generateTranscription({
						language: data.language,
						model: data.model,
					});
				}}
				onCancel={onCancel}
			/>
		);
	} else {
		return (
			<div className="flex items-center space-x-4">
				<LoaderIcon className="w-4 h-4 animate-spin" />
			</div>
		);
	}
};
