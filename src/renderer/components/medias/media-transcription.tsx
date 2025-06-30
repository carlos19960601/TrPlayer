import { cn } from "@/lib/utils";
import {
	AppSettingsProviderContext,
	MediaShadowProviderContext,
} from "@/renderer/context";
import { useAiCommand } from "@/renderer/hooks";
import { formatDuration } from "@/renderer/lib/utils";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@renderer/components/ui";
import { t } from "i18next";
import {
	LanguagesIcon,
	StopCircleIcon,
	UnfoldVerticalIcon,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { TranslateConfigForm } from "./translate-config-form";

export const MediaTranscription = () => {
	const { transcription, currentSegmentIndex } = useContext(
		MediaShadowProviderContext,
	);
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const { translate } = useAiCommand();

	const [autoScroll, setAutoScroll] = useState(true);
	const [open, setOpen] = useState(false);
	const [translating, setTranslating] = useState(false);

	const transcriptionContainerRef = useRef<HTMLDivElement>(null);
	const transcriptionSegmentRefs = useRef<HTMLDivElement[]>([]);
	const [abortController, setAbortController] =
		useState<AbortController | null>(null);

	const handleTranslate = async (data: TranslateConfigType) => {
		if (!transcription.recognitionResult) return;
		setOpen(false);
		setTranslating(true);

		const abortController = new AbortController();
		setAbortController(abortController);

		try {
			transcription.recognitionResult.timeline.forEach(async (entry) => {
				const translation = await translate(entry.text, data.targetLanguage, {
					providerId: data.providerId,
					modelId: data.modelId,
					abortSignal: abortController.signal,
				});
				entry.translation = translation;

				// TrPlayerApp.transcriptions.update(transcription.id, {
				// 	recognitionResult: transcription.recognitionResult,
				// });
			});
		} catch (err) {
			console.error(err);
		} finally {
			setAbortController(null);
			setTranslating(false);
		}
	};

	const stopTranslate = () => {
		abortController?.abort();
		setTranslating(false);
	};

	useEffect(() => {
		if (!autoScroll) return;
		if (!transcriptionSegmentRefs.current) return;
		if (!transcriptionContainerRef.current) return;

		const currentTranscriptionSegment =
			transcriptionSegmentRefs.current[currentSegmentIndex];
		const transcriptionContainer = transcriptionContainerRef.current;
		if (currentTranscriptionSegment && transcriptionContainer) {
			const { offsetTop, offsetHeight } = currentTranscriptionSegment;
			const { clientHeight } = transcriptionContainer;

			// 判断是否在可视区域
			if (offsetTop + offsetHeight > clientHeight) {
				currentTranscriptionSegment.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}
		}
	}, [currentSegmentIndex, autoScroll]);

	if (!transcription?.recognitionResult?.timeline) {
		return null;
	}

	return (
		<Card className="mx-4 shadow-md">
			<CardHeader>
				<CardTitle>
					<div className="flex justify-between items-center">
						<span className="text-md">{t("transcript")}</span>
						<div className="flex gap-2">
							{translating ? (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="icon" onClick={stopTranslate}>
											<StopCircleIcon className="size-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{t("stop")}</p>
									</TooltipContent>
								</Tooltip>
							) : (
								<Popover open={open} onOpenChange={setOpen}>
									<Tooltip>
										<TooltipTrigger asChild>
											<PopoverTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setAutoScroll(!autoScroll)}
												>
													<LanguagesIcon className="size-4" />
												</Button>
											</PopoverTrigger>
										</TooltipTrigger>

										<TooltipContent>
											<p>{t("translate")}</p>
										</TooltipContent>
									</Tooltip>
									<PopoverContent>
										<TranslateConfigForm onSubmit={handleTranslate} />
									</PopoverContent>
								</Popover>
							)}

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={autoScroll ? "default" : "ghost"}
										size="icon"
										onClick={() => setAutoScroll(!autoScroll)}
									>
										<UnfoldVerticalIcon className="size-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{t("transcription.autoScroll")}</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea>
					<div
						ref={transcriptionContainerRef}
						className="max-h-[calc(100vh-180px)]"
					>
						{transcription.recognitionResult?.timeline.map((entry, index) => (
							<div
								key={`segment-${index}`}
								className={cn(
									"flex gap-3 my-2",
									currentSegmentIndex === index && "font-bold",
								)}
								ref={(ref) => {
									transcriptionSegmentRefs.current[index] = ref;
								}}
							>
								<span className=" text-muted-foreground">
									{formatDuration(entry.startTime)}
								</span>
								<div className="flex flex-col gap-2">
									<p className="">{entry.text}</p>
									{entry.translation && <p className="">{entry.translation}</p>}
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};
