import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 🔔 Notification listener (DEFAULT import)
import initNotifications from "@/lib/notificationListener";

// Initialize browser notifications + socket listener
initNotifications();

createRoot(document.getElementById("root")!).render(
  <App />
);
