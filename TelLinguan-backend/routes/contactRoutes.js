const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/contactController");

// POST /api/message  (public — user_id added from JWT if available)
router.post("/message", sendMessage);

module.exports = router;
