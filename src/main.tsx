import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import "./app/utils/mockApi";
import App from "./app/App.tsx";
import "./app/styles/index.css";
import "./app/i18n.ts";

createRoot(document.getElementById("root")!).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>
);
