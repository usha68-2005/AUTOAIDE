require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const startTaskReminder = require("./services/reminderService");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// ✅ Socket.io with correct CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("🔌 Client connected");
  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});

// 🔔 Start smart reminders
startTaskReminder();

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
