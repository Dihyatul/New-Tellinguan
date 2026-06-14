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
const adminRoutes    = require("./routes/adminRoutes");
const courseRoutes    = require("./routes/courseRoutes");
const practiceRoutes  = require("./routes/practiceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ===========================
// MIDDLEWARE
// ===========================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
  ...(process.env.ADMIN_URL  ? [process.env.ADMIN_URL]  : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(require("path").join(__dirname, "uploads")));

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
app.use("/api/admin",   adminRoutes);    // GET /api/admin/stats, /participants
app.use("/api/courses",   courseRoutes);   // GET /api/courses
app.use("/api/practices", practiceRoutes); // GET /api/practices, /api/practices/schedules

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
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`TelLinguan backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
