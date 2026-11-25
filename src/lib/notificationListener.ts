import { io } from "socket.io-client";

export default function initNotifications() {
  const socket = io("http://localhost:5000");

  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  socket.on("task-reminder", (task: { title: string; time: string }) => {
    console.log("🔔 Reminder:", task.title);

    if (Notification.permission === "granted") {
      new Notification("🔔 Task Reminder", {
        body: `${task.title} at ${task.time}`,
      });
    }
  });
}
