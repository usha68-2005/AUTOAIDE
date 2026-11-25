const Task = require("../models/Task");

function startTaskReminder() {
  console.log("🔔 Smart task reminder service started");

  setInterval(async () => {
    const now = new Date();

    const currentDate = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const currentTime = now.toTimeString().slice(0, 5);  // HH:mm

    try {
      const tasks = await Task.find({
        date: currentDate,
        time: currentTime,
        status: "pending",
      });

      tasks.forEach((task) => {
        if (global.io) {
          global.io.emit("task-reminder", {
            title: task.title,
            time: task.time,
          });
        }
      });
    } catch (err) {
      console.error("Reminder error:", err.message);
    }
  }, 60 * 1000); // ⏱️ check once per minute
}

module.exports = startTaskReminder;
