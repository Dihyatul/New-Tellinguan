const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  toggleSubscriber,
  getAllParticipants,
  getUnreadCount,
  getAdminMessages,
  getAdminMessage,
  markMessageRead,
  toggleMessageStar,
  softDeleteMessage,
} = require("../controllers/adminController");
const { adminAuth } = require("../middleware/authMiddleware");

router.get("/stats",                      adminAuth, getDashboardStats);
router.get("/participants",               adminAuth, getAllParticipants);
router.post("/subscribers/:id",           adminAuth, toggleSubscriber);

// Message routes — unread-count must be declared before /:id to avoid conflict
router.get("/messages/unread-count",      adminAuth, getUnreadCount);
router.get("/messages",                   adminAuth, getAdminMessages);
router.get("/messages/:id",               adminAuth, getAdminMessage);
router.patch("/messages/:id/read",        adminAuth, markMessageRead);
router.patch("/messages/:id/star",        adminAuth, toggleMessageStar);
router.patch("/messages/:id/delete",      adminAuth, softDeleteMessage);

module.exports = router;
