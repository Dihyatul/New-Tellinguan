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

const adminOnly = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === "admin-token") return next();
  return res.status(401).json({ message: "Admin access required." });
};

router.get("/stats",                      adminOnly, getDashboardStats);
router.get("/participants",               adminOnly, getAllParticipants);
router.post("/subscribers/:id",           adminOnly, toggleSubscriber);

// Message routes — unread-count must be declared before /:id to avoid conflict
router.get("/messages/unread-count",      adminOnly, getUnreadCount);
router.get("/messages",                   adminOnly, getAdminMessages);
router.get("/messages/:id",               adminOnly, getAdminMessage);
router.patch("/messages/:id/read",        adminOnly, markMessageRead);
router.patch("/messages/:id/star",        adminOnly, toggleMessageStar);
router.patch("/messages/:id/delete",      adminOnly, softDeleteMessage);

module.exports = router;
