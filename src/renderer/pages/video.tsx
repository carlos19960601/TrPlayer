import { useNavigate, useParams } from "react-router-dom";
import { VideoPlayer } from "../components/videos";
import { MediaShadowProvider } from "../context/media-shadow-provider";

const VideoPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	return (
		<div>
			<MediaShadowProvider onCancel={() => navigate("/")}>
				<VideoPlayer id={id} />
			</MediaShadowProvider>
		</div>
	);
};

export default VideoPage;
