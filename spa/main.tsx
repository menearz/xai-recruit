import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/styles.css";
import { GameApp } from "../src/components/game/GameApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameApp />
  </StrictMode>,
);
