const express = require("express");
const router = express.Router();
const { submitTest, getResult, getAllResults } = require("../controllers/resultController");
const authMiddleware = require("../middleware/authMiddleware");
const { adminAuth } = require("../middleware/authMiddleware");

// POST /api/submit  (protected)
router.post("/submit", authMiddleware, submitTest);

// GET /api/result  (protected)
router.get("/result", authMiddleware, getResult);

// GET /api/results/all  (admin only)
router.get("/results/all", adminAuth, getAllResults);

module.exports = router;
