import { useParams } from "react-router-dom";
import { VideoPlayer } from "../components/videos";
import { MediaShadowProvider } from "../context/media-shadow-provider";

const VideoPage = () => {
	const { id } = useParams();
	return (
		<div>
			<MediaShadowProvider>
				<VideoPlayer id={id} />
			</MediaShadowProvider>
		</div>
	);
};

export default VideoPage;
