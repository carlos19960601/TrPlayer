import { AppSettingsProviderContext } from "@/renderer/context";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@renderer/components/ui";
import { t } from "i18next";
import {
	PanelLeftOpenIcon,
	PanelRightOpenIcon,
	SettingsIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Preferences } from "../preferences";

interface TitleBarProps {}

const TitleBar = (props: TitleBarProps) => {
	const { TrPlayerApp, isSidebarCollapsed, switchSidebarCollapsed } =
		useContext(AppSettingsProviderContext);
	const [platform, setPlatform] = useState<PlatformType>();

	useEffect(() => {
		TrPlayerApp.app.getPlatformInfo().then((info) => {
			setPlatform(info.platform as PlatformType);
		});
	}, []);

	return (
		<div className="h-10 w-full flex items-center draggable-region border-b">
			{platform === "darwin" && <div className="w-20" />}
			<div className="flex">
				<Button
					variant="ghost"
					size="icon"
					className="non-draggable-region"
					onClick={switchSidebarCollapsed}
				>
					{isSidebarCollapsed ? <PanelLeftOpenIcon /> : <PanelRightOpenIcon />}
				</Button>
				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="non-draggable-region"
						>
							<SettingsIcon />
						</Button>
					</DialogTrigger>
					<DialogContent className="min-w-3/4 h-4/5 p-0">
						<DialogTitle className="hidden">
							{t("sidebar.preferences")}
						</DialogTitle>
						<Preferences />
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default TitleBar;
