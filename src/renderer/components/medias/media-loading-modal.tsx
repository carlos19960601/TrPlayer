import { MediaShadowProviderContext } from "@/renderer/context";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@renderer/components/ui";
import { t } from "i18next";
import { useContext } from "react";

export const MediaLoadingModal = () => {
	const { decoded } = useContext(MediaShadowProviderContext);
	return (
		<AlertDialog open={!decoded}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("preparingMedia")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("itMayTakeAWhileToPrepareForTheFirstLoad")}
					</AlertDialogDescription>
				</AlertDialogHeader>
			</AlertDialogContent>
		</AlertDialog>
	);
};
