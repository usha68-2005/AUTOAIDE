// backend/src/routes/diaryRoutes.js
const express = require("express");
const router = express.Router();
const Diary = require("../models/Diary");

router.post("/", async (req, res) => {
  try {
    const entry = await Diary.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    console.error("Diary save failed", err);
    res.status(500).json({ message: "Diary save failed" });
  }
});

module.exports = router;
