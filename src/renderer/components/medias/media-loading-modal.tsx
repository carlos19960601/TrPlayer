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
		<AlertDialog open={!transcription?.result?.timeline}>
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
	const { transcription, onCancel } = useContext(MediaShadowProviderContext);

	if (transcription && !transcription.result?.timeline) {
		return (
			<TranscriptionCreateForm
				onSubmit={(data) => {
					//
				}}
				// originalText={transcription?.result?.originalText}
				// onSubmit={(data) => {
				// 	generateTranscription({
				// 		originalText: data.text,
				// 		language: data.language,
				// 		service: data.service as SttEngineOptionEnum | "upload",
				// 		isolate: data.isolate,
				// 	});
				// }}
				// onCancel={onCancel}
				// transcribing={transcribing}
				// transcribingProgress={transcribingProgress}
				// transcribingOutput={transcribingOutput}
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
