import { MediaShadowPlayer } from "@renderer/components";

export const VideoPlayer = (props: {
	id?: string;
}) => {
	const { id } = props;
	return (
		<div>
			<MediaShadowPlayer />
		</div>
	);
};
