const pool = require("../config/db");

const getLevel = (score, totalQuestions) => {
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  if (percentage <= 25) return "A1";
  if (percentage <= 50) return "A2";
  if (percentage <= 75) return "B1";
  return "B2";
};

const getRecommendation = (answers, questions) => {
  const wrongByType = {};

  answers.forEach(({ questionId, selected }) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    if (selected !== question.answer) {
      const type = question.type;
      if (!wrongByType[type]) wrongByType[type] = 0;
      wrongByType[type]++;
    }
  });

  const kurang = [];
  const improve = [];

  if (wrongByType.grammar) {
    kurang.push("Grammar");
    improve.push("Practice grammar structure and sentence completion exercises");
  }
  if (wrongByType.listening) {
    kurang.push("Listening");
    improve.push("Improve listening comprehension with audio practice daily");
  }
  if (wrongByType.reading) {
    kurang.push("Reading");
    improve.push("Improve reading comprehension with passage analysis drills");
  }

  if (kurang.length === 0) {
    improve.push("Maintain your performance and challenge yourself with advanced material");
  }

  return { kurang, improve };
};

// POST /api/submit  (protected)
const submitTest = async (req, res) => {
  const { answers, analysis } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "Answers array is required." });
  }

  if (!analysis || !analysis.goal || !analysis.duration || !analysis.days || !analysis.time) {
    return res.status(400).json({ message: "Analysis object with goal, duration, days, and time is required." });
  }

  try {
    const questionIds = answers.map((a) => a.questionId);
    const placeholders = questionIds.map((_, i) => `$${i + 1}`).join(", ");
    const questionsResult = await pool.query(
      `SELECT id, type, answer FROM questions WHERE id IN (${placeholders})`,
      questionIds
    );

    const questions = questionsResult.rows;
    const totalQuestions = questions.length;

    let score = 0;
    answers.forEach(({ questionId, selected }) => {
      const q = questions.find((q) => q.id === questionId);
      if (q && q.answer === selected) score++;
    });

    const level = getLevel(score, totalQuestions);
    const recommendation = getRecommendation(answers, questions);

    await pool.query(
      `INSERT INTO test_results (user_id, score, total_questions, level, answers, recommendation, analysis)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        req.user.id,
        score,
        totalQuestions,
        level,
        JSON.stringify(answers),
        JSON.stringify(recommendation),
        JSON.stringify(analysis),
      ]
    );

    return res.status(200).json({
      message: "Test submitted successfully",
      score,
      totalQuestions,
      level,
      recommendation,
      analysis,
    });
  } catch (err) {
    console.error("Submit test error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/result  (protected)
const getResult = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT score, total_questions, level, recommendation, analysis
       FROM test_results
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No test result found." });
    }

    const row = result.rows[0];
    return res.status(200).json({
      score: row.score,
      totalQuestions: row.total_questions,
      level: row.level,
      recommendation: row.recommendation,
      analysis: row.analysis,
    });
  } catch (err) {
    console.error("Get result error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { submitTest, getResult };
