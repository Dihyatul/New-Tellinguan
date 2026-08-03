const express = require("express");
const router = express.Router();
const { uploadQuestions } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const audioUpload = require("../middleware/audioUploadMiddleware");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload/questions
router.post("/questions", authMiddleware, upload.single("file"), uploadQuestions);

// POST /api/upload/audio — uploads to Cloudinary
router.post("/audio", adminAuth, audioUpload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No audio file uploaded." });

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "tellinguan/audio" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url, filename: result.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Failed to upload audio.", detail: err.message });
  }
});

module.exports = router;
