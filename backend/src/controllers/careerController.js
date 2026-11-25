const pdfParse = require("pdf-parse");

// very simple skill list (can be expanded later)
const SKILLS_DB = [
  "python",
  "java",
  "c",
  "c++",
  "javascript",
  "react",
  "node",
  "express",
  "mongodb",
  "sql",
  "html",
  "css",
  "machine learning",
  "data analysis",
  "deep learning",
  "tensorflow",
  "pandas",
  "numpy",
  "power bi",
  "excel",
];

exports.extractSkillsFromResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    // 1️⃣ Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text.toLowerCase();

    // 2️⃣ Match skills
    const extractedSkills = SKILLS_DB.filter((skill) =>
      text.includes(skill)
    );

    res.json({
      skills: [...new Set(extractedSkills)],
      message: "Skills extracted successfully",
    });
  } catch (err) {
    console.error("Resume parsing failed:", err);
    res.status(500).json({ message: "Failed to extract skills" });
  }
};
