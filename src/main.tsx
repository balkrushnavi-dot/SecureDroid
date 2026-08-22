import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/App";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import "./src/index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
