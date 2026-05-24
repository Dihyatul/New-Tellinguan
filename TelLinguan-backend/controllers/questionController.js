const pool = require("../config/db");

const formatRows = (rows) =>
  rows.map((q) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
    answer: q.answer,
    audio_url: q.audio_url || null,
    passages: q.passages || null,
  }));

// GET /api/questions
const getQuestions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, type, question, options, answer, audio_url, passages FROM questions ORDER BY id ASC"
    );
    return res.status(200).json(formatRows(result.rows));
  } catch (err) {
    console.error("Get questions error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/questions/grammar
const getGrammarQuestions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, type, question, options, answer, audio_url, passages FROM questions WHERE type = 'grammar' ORDER BY id ASC"
    );
    return res.status(200).json(formatRows(result.rows));
  } catch (err) {
    console.error("Get grammar questions error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/questions/listening
const getListeningQuestions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, type, question, options, answer, audio_url, passages FROM questions WHERE type = 'listening' ORDER BY id ASC"
    );
    return res.status(200).json(formatRows(result.rows));
  } catch (err) {
    console.error("Get listening questions error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/questions/reading
const getReadingQuestions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, type, question, options, answer, audio_url, passages FROM questions WHERE type = 'reading' ORDER BY id ASC"
    );
    return res.status(200).json(formatRows(result.rows));
  } catch (err) {
    console.error("Get reading questions error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/questions/test
// Returns 30 questions in fixed sections: 10 listening → 10 grammar → 10 reading
// Within each section questions are randomised from the database
const getTestQuestions = async (req, res) => {
  try {
    const result = await pool.query(`
      (SELECT id, type, question, options, answer, audio_url, passages
         FROM questions WHERE type = 'listening' ORDER BY RANDOM() LIMIT 10)
      UNION ALL
      (SELECT id, type, question, options, answer, audio_url, passages
         FROM questions WHERE type = 'grammar'   ORDER BY RANDOM() LIMIT 10)
      UNION ALL
      (SELECT id, type, question, options, answer, audio_url, passages
         FROM questions WHERE type = 'reading'   ORDER BY RANDOM() LIMIT 10)
    `);

    return res.status(200).json(formatRows(result.rows));
  } catch (err) {
    console.error("Get test questions error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/questions/all
const deleteAllQuestions = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM questions");
    return res.status(200).json({ message: `Deleted ${result.rowCount} questions.` });
  } catch (err) {
    console.error("Delete all questions error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getQuestions, getTestQuestions, getGrammarQuestions, getListeningQuestions, getReadingQuestions, deleteAllQuestions };
