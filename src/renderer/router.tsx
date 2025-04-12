import ErrorPage from "@renderer/pages/error";
import Home from "@renderer/pages/home";
import { createHashRouter } from "react-router-dom";
import { Layout } from "./components/layouts";

export default createHashRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [{ index: true, element: <Home /> }],
	},
]);
