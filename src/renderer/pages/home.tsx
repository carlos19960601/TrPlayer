import { AppSettingsProviderContext } from "@renderer/context/app-settings-provider";
import { useContext, useEffect, useState } from "react";
import ChooseLocalFile from "../components/medias/choose-local-file";

const Home = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const [platformInfo, setPlatformInfo] = useState<PlatformInfoType>();

	useEffect(() => {
		TrPlayerApp.app.getPlatformInfo().then(setPlatformInfo);
	}, []);

	return (
		<div className="flex flex-col pt-10 max-w-3xl mx-auto">
			<div className="grid select-none">
				<ChooseLocalFile />
			</div>
		</div>
	);
};

export default Home;
