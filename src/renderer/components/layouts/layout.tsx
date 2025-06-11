import { AppSettingsProviderContext } from "@/renderer/context";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import TitleBar from "./title-bar";

export const Layout = () => {
	const { initialized } = useContext(AppSettingsProviderContext);

	if (!initialized) return null;

	return (
		<>
			<TitleBar />
			<div className="h-screen pt-10">
				<Outlet />
			</div>
		</>
	);
};
