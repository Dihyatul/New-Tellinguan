const express = require("express");
const router = express.Router();
const { uploadQuestions } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const audioUpload = require("../middleware/audioUploadMiddleware");

const adminOnly = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === "admin-token") return next();
  return res.status(403).json({ message: "Admin access only." });
};

const adminOrAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === "admin-token") return next();
  return authMiddleware(req, res, next);
};

// POST /api/upload/questions  (JWT or admin-token)
router.post("/questions", adminOrAuth, upload.single("file"), uploadQuestions);

// POST /api/upload/audio  (admin-token only)
router.post("/audio", adminOnly, audioUpload.single("audio"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No audio file uploaded." });
  const url = `${req.protocol}://${req.get("host")}/uploads/audio/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

module.exports = router;
