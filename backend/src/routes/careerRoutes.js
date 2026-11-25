const express = require("express");
const multer = require("multer");
const { extractSkillsFromResume } = require("../controllers/careerController");

const router = express.Router();
const upload = multer(); // memory storage

// POST /api/career/upload-resume
router.post("/upload-resume", upload.single("resume"), extractSkillsFromResume);

module.exports = router;
