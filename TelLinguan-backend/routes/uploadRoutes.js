const express = require("express");
const router = express.Router();
const { uploadQuestions } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// POST /api/upload/questions  (protected)
router.post(
  "/questions",
  authMiddleware,
  upload.single("file"),
  uploadQuestions
);

module.exports = router;
