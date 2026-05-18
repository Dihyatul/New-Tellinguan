const pool = require("../config/db");

// GET /api/questions  (protected)
const getQuestions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, type, question, options, answer, audio_url, passages FROM questions ORDER BY id ASC"
    );

    const questions = result.rows.map((q) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      answer: q.answer,
      audio_url: q.audio_url || null,
      passages: q.passages || null,
    }));

    return res.status(200).json(questions);
  } catch (err) {
    console.error("Get questions error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getQuestions };
