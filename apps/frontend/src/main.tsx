import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RootContext } from "./components/root-context/root-context.tsx";
import { Routes } from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootContext>
      <Routes />
    </RootContext>
  </StrictMode>
);
