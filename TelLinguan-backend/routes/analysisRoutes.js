const express = require("express");
const router = express.Router();
const { saveAnalysis, getAnalysis, getAllAnalyses } = require("../controllers/analysisController");
const authMiddleware = require("../middleware/authMiddleware");

const adminOnly = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === "admin-token") return next();
  return res.status(403).json({ message: "Admin access only." });
};

router.get("/all", adminOnly, getAllAnalyses);
router.post("/", authMiddleware, saveAnalysis);
router.get("/", authMiddleware, getAnalysis);

module.exports = router;
