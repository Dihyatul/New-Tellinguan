const pool = require("../config/db");

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
      email: user.email,
      instansi: user.instansi,
      username: user.username,
      nimNisn: user.nim_nisn,
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getProfile };
