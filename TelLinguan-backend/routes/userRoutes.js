const express = require("express");
const router = express.Router();
const { getProfile, getActivities } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/user/profile  (protected)
router.get("/profile", authMiddleware, getProfile);

// GET /api/user/activities (protected)
router.get("/activities", authMiddleware, getActivities);

module.exports = router;
