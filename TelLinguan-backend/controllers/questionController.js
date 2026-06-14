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

// POST /api/questions
const createQuestion = async (req, res) => {
  try {
    const { type, question, options, answer, audio_url, passages } = req.body;
    if (!type || !question || !options || answer === undefined || answer === null) {
      return res.status(400).json({ message: "type, question, options, and answer are required." });
    }
    const result = await pool.query(
      `INSERT INTO questions (type, question, options, answer, audio_url, passages)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, type, question, options, answer, audio_url, passages`,
      [
        type.trim(),
        question.trim(),
        JSON.stringify(Array.isArray(options) ? options : []),
        Number(answer),
        audio_url || null,
        passages && Array.isArray(passages) && passages.length > 0 ? JSON.stringify(passages) : null,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createQuestion error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const { type, question, options, answer, audio_url, passages } = req.body;
    const result = await pool.query(
      `UPDATE questions
       SET type = $1, question = $2, options = $3, answer = $4, audio_url = $5, passages = $6
       WHERE id = $7
       RETURNING id, type, question, options, answer, audio_url, passages`,
      [
        type.trim(),
        question.trim(),
        JSON.stringify(Array.isArray(options) ? options : []),
        Number(answer),
        audio_url || null,
        passages && Array.isArray(passages) && passages.length > 0 ? JSON.stringify(passages) : null,
        req.params.id,
      ]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Question not found." });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("updateQuestion error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    await pool.query("DELETE FROM questions WHERE id = $1", [req.params.id]);
    return res.status(200).json({ message: "Question deleted." });
  } catch (err) {
    console.error("Delete question error:", err);
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

module.exports = { getQuestions, getTestQuestions, getGrammarQuestions, getListeningQuestions, getReadingQuestions, createQuestion, updateQuestion, deleteQuestion, deleteAllQuestions };
