const fs = require("fs");
const pdf = require("pdf-parse");

/**
 * Extract raw text from PDF resume
 */
async function extractTextFromPDF(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text;
}

/**
 * Extract skills from resume text
 */
function extractSkillsFromText(text) {
  const SKILL_KEYWORDS = [
    "python", "java", "c++", "c", "javascript", "typescript",
    "react", "node", "express", "mongodb", "mysql",
    "html", "css", "tailwind",
    "machine learning", "deep learning", "data science",
    "tensorflow", "keras", "pytorch",
    "git", "github", "docker",
    "aws", "azure",
    "flask", "django",
    "nlp", "opencv"
  ];

  const lowerText = text.toLowerCase();

  return SKILL_KEYWORDS.filter(skill =>
    lowerText.includes(skill)
  );
}

module.exports = {
  extractTextFromPDF,
  extractSkillsFromText,
};
