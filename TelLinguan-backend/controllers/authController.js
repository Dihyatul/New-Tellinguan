const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// POST /api/auth/register
const register = async (req, res) => {
  const { email, instansi, userName, nimNisn, password, confirmPassword } = req.body;

  if (!email || !instansi || !userName || !nimNisn || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    const existingEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const existingUsername = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [userName]
    );
    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await pool.query(
      `INSERT INTO users (email, instansi, username, nim_nisn, password_hash)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, instansi, userName, nimNisn, passwordHash]
    );

    return res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    pool.query(
      "INSERT INTO login_activity (user_id, username, action) VALUES ($1, $2, 'Logged In')",
      [user.id, user.username]
    ).catch(() => {});

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        instansi: user.instansi,
        nimNisn: user.nim_nisn,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = { register, login };
