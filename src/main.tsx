import { createRoot } from "react-dom/client";
import { MotionConfig, LazyMotion, domAnimation } from "motion/react";
import "./app/utils/mockApi";
import App from "./app/App.tsx";
import "./app/styles/index.css";
import "./app/i18n.ts";

createRoot(document.getElementById("root")!).render(
  <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </LazyMotion>,
);
