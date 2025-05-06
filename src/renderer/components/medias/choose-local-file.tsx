import { AudioFormats, VideoFormats } from "@/constants";
import { AppSettingsProviderContext } from "@/renderer/context";
import { determineMediaType } from "@/utils";
import { t } from "i18next";
import { FolderIcon } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChooseLocalFile = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	const navigate = useNavigate();

	const handleCreateMedia = async (uri: string) => {
		const mediaType = determineMediaType(uri);
		if (mediaType === "Unknown") {
			toast.error(t("unsupportedMediaType"));
			return;
		}

		TrPlayerApp[`${mediaType.toLowerCase()}s` as "audios" | "videos"]
			.create(uri)
			.then((media) => {
				navigate(`/${mediaType.toLowerCase()}s/${media.id}`);
			})
			.catch((err) => {
				toast.error(err.message);
			});
	};

	return (
		<div
			className="flex flex-col gap-3 p-5 border hover:border-emerald-800/50 rounded-sm text-start cursor-pointer bg-muted hover:bg-white"
			onClick={async () => {
				const selected = await TrPlayerApp.dialog.showOpenDialog({
					properties: ["openFile"],
					filters: [
						{
							name: "audio,video",
							extensions: [...AudioFormats, ...VideoFormats],
						},
					],
				});
				if (!selected) return;
				handleCreateMedia(selected[0]);
			}}
		>
			<div className="flex items-center gap-2">
				<FolderIcon className="size-4" />
				{t("home.localFile")}
			</div>
			<div className="text-muted-foreground text-sm ml-6">
				MP4、MP3、ACC、M4A ...
			</div>
		</div>
	);
};

export default ChooseLocalFile;
