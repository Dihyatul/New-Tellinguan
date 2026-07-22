const express = require("express");
const router = express.Router();
const { submitTest, getResult, getAllResults } = require("../controllers/resultController");
const authMiddleware = require("../middleware/authMiddleware");

const adminOnly = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === "admin-token") return next();
  return res.status(401).json({ message: "Admin access required." });
};

// POST /api/submit  (protected)
router.post("/submit", authMiddleware, submitTest);

// GET /api/result  (protected)
router.get("/result", authMiddleware, getResult);

// GET /api/results/all  (admin only)
router.get("/results/all", adminOnly, getAllResults);

module.exports = router;
