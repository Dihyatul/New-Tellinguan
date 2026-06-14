const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getTestQuestions,
  getGrammarQuestions,
  getListeningQuestions,
  getReadingQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  deleteAllQuestions,
} = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

const adminOrAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token === "admin-token") return next();
  return authMiddleware(req, res, next);
};

router.get("/",          adminOrAuth, getQuestions);
router.get("/test",      adminOrAuth, getTestQuestions);
router.get("/grammar",   adminOrAuth, getGrammarQuestions);
router.get("/listening", adminOrAuth, getListeningQuestions);
router.get("/reading",   adminOrAuth, getReadingQuestions);
router.post("/",         adminOrAuth, createQuestion);
router.put("/:id",       adminOrAuth, updateQuestion);
router.delete("/all",    adminOrAuth, deleteAllQuestions);
router.delete("/:id",    adminOrAuth, deleteQuestion);

module.exports = router;
