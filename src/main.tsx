import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./app/styles/index.css";
import "./app/i18n.ts";

createRoot(document.getElementById("root")!).render(<App />);
