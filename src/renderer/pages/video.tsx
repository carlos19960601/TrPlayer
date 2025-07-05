import { VideoPlayer } from "@renderer/components/videos";
import { MediaShadowProvider } from "@renderer/context";
import { useNavigate, useParams } from "react-router-dom";

const VideoPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	return (
		<MediaShadowProvider onCancel={() => navigate("/")}>
			<VideoPlayer id={id} />
		</MediaShadowProvider>
	);
};

export default VideoPage;
