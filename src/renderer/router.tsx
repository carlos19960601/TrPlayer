import AudioPage from "@renderer/pages/audio";
import ErrorPage from "@renderer/pages/error";
import HomePage from "@renderer/pages/home";
import VideoPage from "@renderer/pages/video";
import { createHashRouter } from "react-router-dom";
import { Layout } from "./components/layouts";

export default createHashRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <HomePage /> },
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
