// backend/src/models/Diary.js
const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    mood: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diary", diarySchema);
