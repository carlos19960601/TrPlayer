import { AppSettingsProviderContext } from "@renderer/context";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const useVideo = (options: { id?: string; md5?: string }) => {
	const { id, md5 } = options;
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	const [video, setVideo] = useState<VideoType>(null);

	useEffect(() => {
		const where = id ? { id } : md5 ? { md5 } : null;
		if (!where) return;

		TrPlayerApp.videos.findOne(where).then((video) => {
			if (video) setVideo(video);
			else toast.error(t("models.video.notFound"));
		});
	}, [id, md5]);

	return {
		video: video,
	};
};
