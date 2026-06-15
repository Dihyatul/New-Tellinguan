const express = require("express");
const router = express.Router();
const { uploadQuestions } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const audioUpload = require("../middleware/audioUploadMiddleware");
const { put } = require("@vercel/blob");

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

// POST /api/upload/audio  (admin-token only) — uploads to Vercel Blob
router.post("/audio", adminOnly, audioUpload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No audio file uploaded." });

  try {
    const blob = await put(req.file.originalname, req.file.buffer, {
      access: "public",
      contentType: req.file.mimetype,
    });

    res.json({ url: blob.url, filename: blob.pathname });
  } catch (err) {
    console.error("Vercel Blob upload error:", err);
    res.status(500).json({ message: "Failed to upload audio file.", detail: err.message });
  }
});

module.exports = router;
