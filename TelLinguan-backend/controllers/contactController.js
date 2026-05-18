const pool = require("../config/db");

// POST /api/message
const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // user_id from JWT if authenticated, null if not
  const userId = req.user ? req.user.id : null;

  try {
    await pool.query(
      `INSERT INTO contact_messages (user_id, name, email, message)
       VALUES ($1, $2, $3, $4)`,
      [userId, name, email, message]
    );

    return res.status(201).json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact message error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { sendMessage };
