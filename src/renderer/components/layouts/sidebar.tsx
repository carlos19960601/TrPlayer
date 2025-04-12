import { cn } from "@/lib/utils";
import { AppSettingsProviderContext } from "@/renderer/context";
import { t } from "i18next";
import { HomeIcon, LucideIcon, YoutubeIcon } from "lucide-react";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, ScrollArea } from "../ui";

const Sidebar = () => {
	const { isSidebarCollapsed } = useContext(AppSettingsProviderContext);
	const location = useLocation();
	const activeTab = location.pathname;

	return (
		<div
			className={cn(
				"h-full transition-all border-r flex flex-col",
				isSidebarCollapsed
					? "w-sidebar-collapsed-width"
					: "w-sidebar-expanded-width",
			)}
		>
			<SidebarHeader isCollapsed={isSidebarCollapsed} />
			<ScrollArea className="flex-1">
				<div className="flex flex-col gap-2">
					<SidebarItem
						href="/"
						Icon={HomeIcon}
						label={t("sidebar.home")}
						active={activeTab === "/"}
						isCollapsed={isSidebarCollapsed}
					/>
					{/* <SidebarItem
						href="/media"
						Icon={YoutubeIcon}
						label={t("sidebar.medias")}
						active={activeTab === "/media"}
						isCollapsed={isSidebarCollapsed}
					/> */}
				</div>
			</ScrollArea>
		</div>
	);
};

const SidebarHeader = (props: { isCollapsed: boolean }) => {
	const { isCollapsed } = props;
	return (
		<div className="flex justify-center py-3 gap-2">
			<img src="assets/icon.png" className="size-8" />
			{!isCollapsed && <span className="text-lg font-bold">DuoPlayer</span>}
		</div>
	);
};

const SidebarItem = (props: {
	href: string;
	Icon: LucideIcon;
	label: string;
	active: boolean;
	isCollapsed: boolean;
}) => {
	const { href, Icon, label, active, isCollapsed } = props;
	return (
		<Link to={href} className="px-1">
			<Button
				size="sm"
				variant={active ? "default" : "ghost"}
				className={cn(
					"w-full",
					isCollapsed ? "justify-center" : "justify-start",
				)}
			>
				<Icon className="size-4" />
				{!isCollapsed && <span className="ml-2">{label}</span>}
			</Button>
		</Link>
	);
};

export default Sidebar;
