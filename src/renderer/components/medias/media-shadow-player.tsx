import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@renderer/components/ui";
import { MediaLoadingModal } from "./media-loading-modal";
import { MediaProvider } from "./media-provider";
import { MediaTranscription } from "./media-transcription";

export const MediaShadowPlayer = () => {
	return (
		<>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={70}>
					<MediaProvider />
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel>
					<MediaTranscription />
				</ResizablePanel>
			</ResizablePanelGroup>
			<MediaLoadingModal />
		</>
	);
};
