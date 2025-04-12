import { AudioFormats, VideoFormats } from "@/constants";
import { AppSettingsProviderContext } from "@/renderer/context";
import { t } from "i18next";
import { FolderIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Dialog, DialogContent } from "../ui";

const ChooseLocalFile = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	const [open, setOpen] = useState(false);
	const [uri, setUri] = useState("");

	return (
		<>
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

					if (selected) {
						setUri(selected[0]);
						setOpen(true);
					}
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
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
          
        </DialogContent>
			</Dialog>
		</>
	);
};

export default ChooseLocalFile;
