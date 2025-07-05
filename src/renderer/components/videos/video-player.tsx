import { MediaShadowProviderContext } from "@/renderer/context";
import { useVideo } from "@/renderer/hooks/use-video";
import { MediaShadowPlayer } from "@renderer/components";
import { useContext, useEffect } from "react";

export const VideoPlayer = (props: {
	id?: string;
	md5?: string;
}) => {
	const { id, md5 } = props;
	const { setMedia } = useContext(MediaShadowProviderContext);
	const { video } = useVideo({ id, md5 });

	useEffect(() => {
		setMedia(video);
	}, [video]);

	if (!video) return null;

	return <MediaShadowPlayer />;
};
