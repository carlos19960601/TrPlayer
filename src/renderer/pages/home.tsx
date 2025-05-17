import ChooseLocalFile from "@renderer/components/medias/choose-local-file";
import { TranscriptionsComponent } from "@renderer/components/transcriptions";
import { AppSettingsProviderContext } from "@renderer/context/app-settings-provider";
import { useContext } from "react";

const HomePage = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);

	return (
		<div className="flex flex-col pt-10 w-5/6 mx-auto gap-10">
			<div className="grid select-none">
				<ChooseLocalFile />
			</div>

			<TranscriptionsComponent />
		</div>
	);
};

export default HomePage;
