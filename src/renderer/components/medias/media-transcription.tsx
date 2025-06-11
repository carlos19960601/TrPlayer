import { cn } from "@/lib/utils";
import { MediaShadowProviderContext } from "@/renderer/context";
import { formatDuration } from "@/renderer/lib/utils";
import { t } from "i18next";
import { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle, ScrollArea } from "../ui";

export const MediaTranscription = () => {
	const { transcription, currentSegmentIndex } = useContext(
		MediaShadowProviderContext,
	);

	if (!transcription?.recognitionResult?.timeline) {
		return null;
	}

	return (
		<Card className="mx-4 bg-muted">
			<CardHeader>
				<CardTitle>{t("transcript")}</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea>
					<div className="max-h-[calc(100vh-160px)]">
						{transcription.recognitionResult?.timeline.map((entry, index) => (
							<div
								key={`segment-${index}`}
								className={cn(
									"flex gap-3 my-2",
									currentSegmentIndex === index && "font-bold",
								)}
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
