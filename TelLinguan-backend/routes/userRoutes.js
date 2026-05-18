const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/user/profile  (protected)
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
