import AudioPage from "@renderer/pages/audio";
import ErrorPage from "@renderer/pages/error";
import HomePage from "@renderer/pages/home";
import VideoPage from "@renderer/pages/video";
import { createHashRouter } from "react-router-dom";
import { Layout } from "./components/layouts";
import LandingPage from "./pages/landing";
import { ProtectedPage } from "./pages/protected-page";

export default createHashRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{ path: "/landing", element: <LandingPage /> },
			{
				index: true,
				element: (
					<ProtectedPage>
						<HomePage />
					</ProtectedPage>
				),
			},
			{
				path: "audios/:id",
				element: <AudioPage />,
			},
			{
				path: "videos/:id",
				element: <VideoPage />,
			},
		],
	},
]);
