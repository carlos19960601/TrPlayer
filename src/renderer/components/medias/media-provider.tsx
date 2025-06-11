import { MediaShadowProviderContext } from "@/renderer/context";
import { formatDuration } from "@/renderer/lib/utils";
import { Clock5Icon } from "lucide-react";
import { useContext, useEffect, useRef } from "react";

export const MediaProvider = () => {
	const artRef = useRef<HTMLDivElement>(null);
	const { media, setArtPlayerRef } = useContext(MediaShadowProviderContext);

	useEffect(() => {
		if (!media?.src) return;
		if (!artRef?.current) return;

		setArtPlayerRef(artRef);
	}, [media?.src, artRef]);

	if (!media?.src) return null;

	return (
		<div className="flex flex-col px-2 gap-4">
			<div
				ref={artRef}
				className="aspect-video w-full overflow-hidden rounded-md *:z-0"
			/>
			<div className="flex flex-row px-2 items-center justify-between">
				<h2 className="flex-2/3 text-lg font-bold break-words min-w-0">
					{media.name}
				</h2>
				<div className="flex-1/3 flex justify-end">
					<div className="flex flex-col gap-1 items-center">
						<div className="flex gap-2 items-center">
							<Clock5Icon className="size-4" />
							<span>{formatDuration(media.duration, "second")}</span>
						</div>
						<span className="text-xs text-muted-foreground">
							Total Duration
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
