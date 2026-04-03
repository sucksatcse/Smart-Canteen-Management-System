import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";   // adjust path if needed
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' not found.");
}

createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
