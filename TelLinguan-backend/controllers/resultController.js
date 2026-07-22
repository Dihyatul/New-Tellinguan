const pool = require("../config/db");
const http = require("http");
const { URL } = require("url");

// ── ML Flask server call ──────────────────────────────────────────────────────
const ML_URL = new URL(process.env.ML_SERVER_URL || "http://127.0.0.1:5001");

const callMLPredict = (payload) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: ML_URL.hostname,
        port: parseInt(ML_URL.port, 10) || 5001,
        path: "/predict",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error("Invalid JSON from ML server")); }
        });
      }
    );
    req.setTimeout(5000, () => req.destroy(new Error("ML server timeout")));
    req.on("error", reject);
    req.write(body);
    req.end();
  });

// ── Fallback grading (matches ML thresholds) ──────────────────────────────────
const getLevel = (score) => {
  if (score <= 12) return "Basic";
  if (score <= 20) return "Intermediate";
  if (score <= 26) return "Proficient";
  return "Advanced";
};

const getRecommendation = (answers, questions) => {
  const wrongByType = {};
  answers.forEach(({ questionId, selected }) => {
    const q = questions.find((q) => q.id === questionId);
    if (q && selected !== q.answer) {
      wrongByType[q.type] = (wrongByType[q.type] || 0) + 1;
    }
  });
  const kurang = [];
  const improve = [];
  if (wrongByType.grammar)   { kurang.push("Grammar");   improve.push("Practice grammar structure and sentence completion exercises"); }
  if (wrongByType.listening) { kurang.push("Listening");  improve.push("Improve listening comprehension with audio practice daily"); }
  if (wrongByType.reading)   { kurang.push("Reading");    improve.push("Improve reading comprehension with passage analysis drills"); }
  if (!kurang.length) improve.push("Maintain your performance and challenge yourself with advanced material");
  return { kurang, improve };
};

// POST /api/submit  (protected)
const submitTest = async (req, res) => {
  const { answers, analysis } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0)
    return res.status(400).json({ message: "Answers array is required." });

  if (!analysis || !analysis.goal || !analysis.duration || !analysis.days || !analysis.time)
    return res.status(400).json({ message: "Analysis object with goal, duration, days, and time is required." });

  try {
    const questionIds = answers.map((a) => a.questionId);
    const placeholders = questionIds.map((_, i) => `$${i + 1}`).join(", ");
    const questionsResult = await pool.query(
      `SELECT id, type, answer FROM questions WHERE id IN (${placeholders})`,
      questionIds
    );
    const questions = questionsResult.rows;
    const totalQuestions = questions.length;

    // ── Compute total score and per-section correct counts ───────────────────
    let score = 0;
    const sectionCorrect = { grammar: 0, listening: 0, reading: 0 };

    answers.forEach(({ questionId, selected }) => {
      const q = questions.find((q) => q.id === questionId);
      if (!q) return;
      if (q.answer === selected) {
        score++;
        if (sectionCorrect[q.type] !== undefined) sectionCorrect[q.type]++;
      }
    });

    // ── Fetch user analysis preferences for ML ───────────────────────────────
    let speed = "Moderate", hoursPerDay = 2, daysPerWeek = 3;
    try {
      const uaResult = await pool.query(
        "SELECT speed, hours, days FROM user_analysis WHERE user_id = $1",
        [req.user.id]
      );
      if (uaResult.rows.length > 0) {
        const ua = uaResult.rows[0];
        speed       = ua.speed || "Moderate";
        hoursPerDay = ua.hours || 2;
        daysPerWeek = Array.isArray(ua.days) ? ua.days.length : 3;
      }
    } catch (e) {
      console.warn("Could not fetch user_analysis, using ML defaults:", e.message);
    }

    // ── Call ML Flask server ─────────────────────────────────────────────────
    let mlResult = null;
    let level          = getLevel(score);
    let recommendation = getRecommendation(answers, questions);

    try {
      const t0 = performance.now();
      mlResult = await callMLPredict({
        grammar_correct:   sectionCorrect.grammar,
        listening_correct: sectionCorrect.listening,
        reading_correct:   sectionCorrect.reading,
        speed,
        hours_per_day: hoursPerDay,
        days_per_week: daysPerWeek,
      });
      const total = performance.now() - t0;
      const infer = mlResult.inference_ms;
      console.log(`[ML timing] total=${total.toFixed(3)}ms inference=${infer}ms overhead=${(total - infer).toFixed(3)}ms`);
      if (mlResult.level)          level          = mlResult.level;
      if (mlResult.recommendation) recommendation = mlResult.recommendation;
    } catch (e) {
      console.warn("ML server unavailable, using fallback grading:", e.message);
    }

    // ── Persist result ───────────────────────────────────────────────────────
    await pool.query(
      `INSERT INTO test_results (user_id, score, total_questions, level, answers, recommendation, analysis, ml_result)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        req.user.id,
        score,
        totalQuestions,
        level,
        JSON.stringify(answers),
        JSON.stringify(recommendation),
        JSON.stringify(analysis),
        mlResult ? JSON.stringify(mlResult) : null,
      ]
    );

    return res.status(200).json({
      message: "Test submitted successfully",
      score,
      totalQuestions,
      level,
      recommendation,
      analysis,
      mlResult,
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
      `SELECT score, total_questions, level, recommendation, analysis, ml_result
       FROM test_results
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "No test result found." });

    const row = result.rows[0];
    return res.status(200).json({
      score:          row.score,
      totalQuestions: row.total_questions,
      level:          row.level,
      recommendation: row.recommendation,
      analysis:       row.analysis,
      mlResult:       row.ml_result,
    });
  } catch (err) {
    console.error("Get result error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/results/all  (admin)
const getAllResults = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tr.id, u.username, u.email,
              tr.score, tr.total_questions, tr.level,
              tr.recommendation, tr.ml_result, tr.created_at
       FROM test_results tr
       JOIN users u ON u.id = tr.user_id
       ORDER BY tr.created_at DESC`
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get all results error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { submitTest, getResult, getAllResults };
