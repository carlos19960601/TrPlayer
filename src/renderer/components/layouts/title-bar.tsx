import { cn } from "@/lib/utils";
import { AppSettingsProviderContext } from "@/renderer/context";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@renderer/components/ui";
import { t } from "i18next";
import { ArrowLeftIcon, SettingsIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Preferences } from "@renderer/components/preferences";

interface TitleBarProps {}

const TitleBar = (props: TitleBarProps) => {
	const { TrPlayerApp } = useContext(AppSettingsProviderContext);
	const [platform, setPlatform] = useState<PlatformType>();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		TrPlayerApp.app.getPlatformInfo().then((info) => {
			setPlatform(info.platform as PlatformType);
		});
	}, []);

	return (
		<div className="fixed top-0 left-0 h-10 w-full flex items-center draggable-region">
			{platform === "darwin" && <div className="w-20" />}
			<div className="w-full flex justify-between">
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"non-draggable-region",
						location.pathname === "/" && "invisible",
					)}
					onClick={() => navigate(-1)}
				>
					<ArrowLeftIcon />
				</Button>

				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"non-draggable-region",
								location.pathname !== "/" && "invisible",
							)}
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
