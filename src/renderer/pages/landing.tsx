import LanguageButtonGroup from "@renderer/components/misc/language-button-group";
import { t } from "i18next";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { AppSettingsProviderContext } from "../context";

const Landing = () => {
	const { initialized, language } = useContext(AppSettingsProviderContext);
	const [started, setStarted] = useState(false);

	if (initialized) {
		return <Navigate to="/" replace />;
	}

	if (!started) {
		return (
			<div className="flex justify-center items-center h-full bg-[url(assets/images/background.png)] bg-cover bg-center">
				<div className="space-y-20">
					<div className="text-lg">
						{t("welcomeTo")} <span className="font-semibold">TrPlayer</span>
					</div>

					<LanguageButtonGroup />
				</div>
			</div>
		);
	}
};

export default Landing;
