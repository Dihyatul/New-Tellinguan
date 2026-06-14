const express = require("express");
const router = express.Router();
const { submitTest, getResult, getAllResults } = require("../controllers/resultController");
const authMiddleware = require("../middleware/authMiddleware");

const adminOrAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === "admin-token") return next();
  return authMiddleware(req, res, next);
};

// POST /api/submit  (protected)
router.post("/submit", authMiddleware, submitTest);

// GET /api/result  (protected)
router.get("/result", authMiddleware, getResult);

// GET /api/results/all  (admin)
router.get("/results/all", adminOrAuth, getAllResults);

module.exports = router;
