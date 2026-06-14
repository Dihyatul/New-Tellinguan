const pool = require("../config/db");

const VALID_CATEGORIES = ["Zoom Classes", "On-site Teachers", "Others"];

// POST /api/message
const sendMessage = async (req, res) => {
  const { name, email, message, category } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!category) {
    return res.status(400).json({ message: "Category is required." });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "Invalid category." });
  }

  const userId = req.user ? req.user.id : null;

  try {
    await pool.query(
      `INSERT INTO contact_messages (user_id, name, email, message, category)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, name, email, message, category]
    );

    return res.status(201).json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact message error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { sendMessage };
