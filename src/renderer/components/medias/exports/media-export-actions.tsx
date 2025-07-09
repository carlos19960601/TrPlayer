import { VideoFormats } from "@/constants";
import {
	AppSettingsProviderContext,
	MediaShadowProviderContext,
} from "@/renderer/context";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@renderer/components/ui";
import { t } from "i18next";
import { FileTypeIcon, FileVideoIcon, UploadIcon } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { AssExportConfigForm } from "./ass-export-config-form";
import { VideoExportConfigForm } from "./video-export-config-form";

export const MediaExportActions = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const { media, transcription } = useContext(MediaShadowProviderContext);
	const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);
	const [assDialogOpen, setAssDialogOpen] = useState(false);
	const [videoDialogOpen, setVideoDialogOpen] = useState(false);

	const handleAssExport = (data: AssExportConfigType) => {
		TrPlayerApp.dialog
			.showSaveDialog({
				title: t("export"),
				defaultPath: `${media.name}.ass`,
				filters: [
					{
						name: "File",
						extensions: ["ass"],
					},
				],
			})
			.then((savePath: string) => {
				if (!savePath) return;

				toast.promise(
					TrPlayerApp.transcriptions.export(transcription.id, {
						savePath,
						...data,
					}),
					{
						success: () => t("exportedSuccessfully"),
						error: t("exportedFailed"),
					},
				);
			})
			.finally(() => {
				setAssDialogOpen(false);
			});
	};

	const handleVideoExport = (data: MediaExportConfigType) => {
		let lang = transcription.recognitionResult?.language;
		if (data.language === "translated") {
			lang = transcription.recognitionResult?.translationLanguage;
		}
		if (data.language === "multi") {
			lang = `lang-${transcription.recognitionResult?.translationLanguage}`;
		}

		TrPlayerApp.dialog
			.showSaveDialog({
				title: t("export"),
				defaultPath: `${media.name}.${lang}.${data.format}`,
				filters: [
					{
						name: "Video",
						extensions: VideoFormats,
					},
				],
			})
			.then((savePath: string) => {
				if (!savePath) return;

				toast.promise(
					TrPlayerApp.videos.export(media.id, {
						savePath,
						...data,
					}),
					{
						success: () => t("exportedSuccessfully"),
						error: t("exportedFailed"),
					},
				);
			})
			.finally(() => {
				setVideoDialogOpen(false);
			});
	};

	return (
		<>
			<DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<UploadIcon className="size-4" />
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<span>{t("transcription.export")}</span>
					</TooltipContent>
				</Tooltip>
				<DropdownMenuContent>
					<DropdownMenuLabel>{t("transcription.self")}</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => {
							setAssDialogOpen(true);
							setDropdownMenuOpen(false);
						}}
					>
						<FileTypeIcon className="opacity-60 size-4" /> <span>ASS</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuLabel>{t("video")}</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => {
							setVideoDialogOpen(true);
							setDropdownMenuOpen(false);
						}}
					>
						<FileVideoIcon className="opacity-60 size-4" />
						<span>{t("video")}</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Dialog open={assDialogOpen} onOpenChange={setAssDialogOpen}>
				<DialogContent>
					<DialogTitle>{t("export.ass")}</DialogTitle>
					<AssExportConfigForm onSubmit={handleAssExport} />
				</DialogContent>
			</Dialog>
			<Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
				<DialogContent>
					<DialogTitle>{t("export.video")}</DialogTitle>
					<VideoExportConfigForm onSubmit={handleVideoExport} />
				</DialogContent>
			</Dialog>
		</>
	);
};
