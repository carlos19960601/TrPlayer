import { cn } from "@/lib/utils";
import { MediaShadowProviderContext } from "@/renderer/context";
import { formatDuration } from "@/renderer/lib/utils";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ScrollArea,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@renderer/components/ui";
import { t } from "i18next";
import { UnfoldVerticalIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

export const MediaTranscription = () => {
	const { transcription, currentSegmentIndex } = useContext(
		MediaShadowProviderContext,
	);
	const [autoScroll, setAutoScroll] = useState(true);
	const transcriptionContainerRef = useRef<HTMLDivElement>(null);
	const transcriptionSegmentRefs = useRef<HTMLDivElement[]>([]);

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
						{t("transcript")}
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
								<p className="">{entry.text}</p>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};
