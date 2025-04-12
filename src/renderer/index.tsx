import App from "@renderer/app";
import { createRoot } from "react-dom/client";
import "./i18n";

const root = createRoot(document.getElementById("app"));
root.render(<App />);
