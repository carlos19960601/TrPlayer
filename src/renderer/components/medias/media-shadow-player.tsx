import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@renderer/components/ui";
import { MediaLoadingModal } from "./media-loading-modal";

export const MediaShadowPlayer = () => {
	return (
		<>
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel></ResizablePanel>
				<ResizableHandle />
				<ResizablePanel></ResizablePanel>
			</ResizablePanelGroup>
			<MediaLoadingModal />
		</>
	);
};
