// backend/src/models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: String,   // yyyy-mm-dd
    time: String,   // HH:mm
    priority: String,
    category: String,
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
