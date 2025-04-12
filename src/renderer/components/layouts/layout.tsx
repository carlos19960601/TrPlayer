import { AppSettingsProviderContext } from "@/renderer/context";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import TitleBar from "./title-bar";

export const Layout = () => {
	const { initialized } = useContext(AppSettingsProviderContext);

	if (initialized) {
		return (
			<div className="h-screen">
				<TitleBar />
				<div className="h-content flex">
					<Sidebar />
					<div className="flex-1">
						<Outlet />
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="h-screen flex flex-col">
				<TitleBar />
				<div className="h-content">
					<Outlet />
				</div>
			</div>
		);
	}
};
