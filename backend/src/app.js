const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/taskRoutes");
const diaryRoutes = require("./routes/diaryRoutes");
const careerRoutes = require("./routes/careerRoutes"); // ✅ ADD THIS

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080", // frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// ================== AGENTS ==================

// Task Agent
app.use("/api/tasks", taskRoutes);

// Diary Agent
app.use("/api/diary", diaryRoutes);

// Career Agent (Resume upload + skill extraction)
app.use("/api/career", careerRoutes); // ✅ ADD THIS

// ============================================

module.exports = app;
