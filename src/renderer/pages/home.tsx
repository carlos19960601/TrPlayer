import { AppSettingsProviderContext } from "@renderer/context/app-settings-provider";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChooseLocalFile from "../components/medias/choose-local-file";

const HomePage = () => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const [platformInfo, setPlatformInfo] = useState<PlatformInfoType>();
	const navigate = useNavigate();
	useEffect(() => {
		TrPlayerApp.app.getPlatformInfo().then(setPlatformInfo);
		// navigate("/videos/3d629c9c-bc37-5535-93cf-d22d8b9e8a39");
	}, []);

	return (
		<div className="flex flex-col pt-10 max-w-3xl mx-auto">
			<div className="grid select-none">
				<ChooseLocalFile />
			</div>
		</div>
	);
};

export default HomePage;
