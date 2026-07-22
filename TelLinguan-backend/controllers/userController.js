const pool = require("../config/db");
const { decrypt } = require("../crypto/dbCrypto");

// GET /api/user/profile  (protected)
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, instansi, username, nim_nisn, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = result.rows[0];
    return res.status(200).json({
      id: user.id,
      email: decrypt(user.email),
      instansi: decrypt(user.instansi),
      username: user.username,
      nimNisn: decrypt(user.nim_nisn),
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/user/activities (protected)
const getActivities = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT created_at FROM login_activity
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
       ORDER BY created_at ASC`,
      [req.user.id]
    );
    const logins = result.rows.map(row => row.created_at);
    return res.status(200).json({ logins });
  } catch (err) {
    console.error("Get activities error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getProfile, getActivities };
