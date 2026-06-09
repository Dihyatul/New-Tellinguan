require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const contactRoutes = require("./routes/contactRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ===========================
// MIDDLEWARE
// ===========================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
// ROUTES
// ===========================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api", resultRoutes);          // POST /api/submit  GET /api/result
app.use("/api", contactRoutes);         // POST /api/message
app.use("/api/upload", uploadRoutes);   // POST /api/upload/questions
app.use("/api/analysis", analysisRoutes); // POST/GET /api/analysis

// Health check
app.get("/", (req, res) => {
  res.json({ message: "TelLinguan API is running.", status: "OK" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (err.message && err.message.includes("Only .json and .csv")) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal server error." });
});

// ===========================
// START SERVER
// ===========================
app.listen(PORT, () => {
  console.log(`TelLinguan backend running on http://localhost:${PORT}`);
});
