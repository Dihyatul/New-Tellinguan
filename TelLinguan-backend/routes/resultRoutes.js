const express = require("express");
const router = express.Router();
const { submitTest, getResult } = require("../controllers/resultController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/submit  (protected)
router.post("/submit", authMiddleware, submitTest);

// GET /api/result  (protected)
router.get("/result", authMiddleware, getResult);

module.exports = router;
