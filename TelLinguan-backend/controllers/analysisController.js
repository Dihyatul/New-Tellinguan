const db = require("../config/db");
const { decrypt } = require("../crypto/dbCrypto");

// POST /api/analysis
const saveAnalysis = async (req, res) => {
  const userId = req.user.id;
  const { goals, days, times, hours, weeks, speed } = req.body;

  if (!goals?.length || !days?.length || !times?.length || !speed) {
    return res.status(400).json({ message: "All analysis fields are required." });
  }

  try {
    await db.query(
      `INSERT INTO user_analysis (user_id, goals, days, times, hours, weeks, speed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id)
       DO UPDATE SET goals=$2, days=$3, times=$4, hours=$5, weeks=$6, speed=$7, updated_at=NOW()`,
      [userId, JSON.stringify(goals), JSON.stringify(days), JSON.stringify(times), hours, weeks, speed]
    );

    res.json({ message: "Analysis saved." });
  } catch (err) {
    console.error("saveAnalysis error:", err);
    res.status(500).json({ message: "Failed to save analysis." });
  }
};

// GET /api/analysis
const getAnalysis = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT * FROM user_analysis WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No analysis found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("getAnalysis error:", err);
    res.status(500).json({ message: "Failed to fetch analysis." });
  }
};

// GET /api/analysis/all  (admin)
const getAllAnalyses = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ua.*, u.username, u.email, u.instansi
       FROM user_analysis ua
       JOIN users u ON u.id = ua.user_id
       ORDER BY ua.updated_at DESC`
    );
    const decryptedRows = result.rows.map((row) => ({
      ...row,
      email: decrypt(row.email),
      instansi: decrypt(row.instansi),
    }));
    res.json(decryptedRows);
  } catch (err) {
    console.error("getAllAnalyses error:", err);
    res.status(500).json({ message: "Failed to fetch analyses." });
  }
};

module.exports = { saveAnalysis, getAnalysis, getAllAnalyses };
