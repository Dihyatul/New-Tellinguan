const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/contactController");
const { optionalAuth } = require("../middleware/authMiddleware");

// POST /api/message  (attaches user_id from JWT when logged in)
router.post("/message", optionalAuth, sendMessage);

module.exports = router;
