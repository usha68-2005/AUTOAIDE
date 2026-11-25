const Diary = require("../models/Diary");

// CREATE diary entry
exports.createDiaryEntry = async (req, res) => {
  try {
    const { date, mood, content, createdAt } = req.body;

    const entry = await Diary.create({
      date,
      mood,
      content,
      createdAt,
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error("Diary create error:", err);
    res.status(500).json({ message: "Failed to save diary entry" });
  }
};

// GET all diary entries (optional but safe)
exports.getDiaryEntries = async (req, res) => {
  try {
    const entries = await Diary.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch diary entries" });
  }
};
