const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/questions  (protected)
router.get("/", authMiddleware, getQuestions);

module.exports = router;
