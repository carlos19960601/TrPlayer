import { AppSettingsProviderContext } from "@renderer/context";
import { PropsWithChildren, useContext } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedPage = ({
	children,
	redirectPath = "/landing",
}: PropsWithChildren<{ redirectPath?: string }>) => {
	const { initialized } = useContext(AppSettingsProviderContext);

	if (!initialized) {
		return <Navigate to={redirectPath} replace />;
	}

	return children;
};
