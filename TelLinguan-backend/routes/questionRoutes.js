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

router.get("/",          authMiddleware, getQuestions);
router.get("/test",      authMiddleware, getTestQuestions);
router.get("/grammar",   authMiddleware, getGrammarQuestions);
router.get("/listening", authMiddleware, getListeningQuestions);
router.get("/reading",   authMiddleware, getReadingQuestions);
router.post("/",         authMiddleware, createQuestion);
router.put("/:id",       authMiddleware, updateQuestion);
router.delete("/all",    authMiddleware, deleteAllQuestions);
router.delete("/:id",    authMiddleware, deleteQuestion);

module.exports = router;
