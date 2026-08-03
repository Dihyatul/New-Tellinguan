const express = require("express");
const router = express.Router();
const { saveAnalysis, getAnalysis, getAllAnalyses } = require("../controllers/analysisController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminAuth } = require("../middleware/authMiddleware");

router.get("/all", adminAuth, getAllAnalyses);
router.post("/", authMiddleware, saveAnalysis);
router.get("/", authMiddleware, getAnalysis);

module.exports = router;
