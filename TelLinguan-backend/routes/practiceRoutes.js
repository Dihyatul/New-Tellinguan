const express = require("express");
const router = express.Router();

let nextPracticeId = 5;
let nextScheduleId = 6;

const PRACTICES = [
  {
    id: 1,
    title: "Basic Grammar Foundations",
    description: "Learn the fundamentals of English grammar including sentence structure, verb tenses, and basic rules.",
    course: "Grammar 1",
    category: "Grammar",
    content: "English grammar forms the foundation of effective communication. In this material, you will study parts of speech, sentence structures, subject-verb agreement, and common grammatical rules that are essential for both speaking and writing.",
    status: true,
  },
  {
    id: 2,
    title: "Reading Comprehension Basics",
    description: "Develop your reading skills by analyzing short passages and extracting key information.",
    course: "Reading 1",
    category: "Reading",
    content: "Reading comprehension is the ability to understand, analyze, and interpret what you read. This material guides you through techniques such as skimming, scanning, identifying main ideas, and understanding context clues in academic and everyday texts.",
    status: true,
  },
  {
    id: 3,
    title: "Grammar Accuracy Workshop",
    description: "Advanced grammar exercises focusing on common errors and how to correct them.",
    course: "Grammar 2",
    category: "Grammar",
    content: "In this material, you will explore common grammatical mistakes made by language learners. Topics include misused tenses, incorrect article usage, preposition errors, and run-on sentences. Each section includes explanations and example corrections.",
    status: false,
  },
  {
    id: 4,
    title: "Listening Comprehension",
    description: "Improve your listening skills through analysis of spoken dialogues and conversations.",
    course: "Listening 3",
    category: "Listening",
    content: "Listening comprehension involves understanding spoken language in context. You will practice identifying key details, understanding intonation and tone, following conversational threads, and responding appropriately to different types of spoken communication.",
    status: false,
  },
];

const SCHEDULES = [
  { id: 1, practiceId: 1, participant: "Jonny Desi",  date: "2026-05-13", startTime: "09:00", endTime: "11:00" },
  { id: 2, practiceId: 1, participant: "Sarah Smith", date: "2026-05-24", startTime: "09:00", endTime: "11:00" },
  { id: 3, practiceId: 2, participant: "Sonny",       date: "2026-06-01", startTime: "09:00", endTime: "10:00" },
  { id: 4, practiceId: 3, participant: "Annie",       date: "2026-06-05", startTime: "09:00", endTime: "11:00" },
  { id: 5, practiceId: 4, participant: "Johnson",     date: "2026-06-13", startTime: "09:00", endTime: "10:00" },
];

// GET /api/practices
router.get("/", (req, res) => res.json(PRACTICES));

// GET /api/practices/schedules — must stay before /:id
router.get("/schedules", (req, res) => res.json(SCHEDULES));

// POST /api/practices
router.post("/", (req, res) => {
  const { title, description, course, category, content, status } = req.body;
  if (!title || !course || !category) {
    return res.status(400).json({ message: "title, course, and category are required." });
  }
  const practice = {
    id: nextPracticeId++,
    title,
    description: description || "",
    course,
    category,
    content: content || "",
    status: typeof status === "boolean" ? status : status === "true",
  };
  PRACTICES.push(practice);
  res.status(201).json(practice);
});

// PUT /api/practices/:id
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = PRACTICES.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: "Practice not found." });
  const { title, description, course, category, content, status } = req.body;
  PRACTICES[idx] = {
    ...PRACTICES[idx],
    title,
    description: description || "",
    course,
    category,
    content: content || "",
    status: typeof status === "boolean" ? status : status === "true",
  };
  res.json(PRACTICES[idx]);
});

// DELETE /api/practices/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = PRACTICES.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ message: "Practice not found." });
  PRACTICES.splice(idx, 1);
  res.json({ message: "Deleted." });
});

// POST /api/practices/schedules
router.post("/schedules", (req, res) => {
  const { practiceId, participant, date, startTime, endTime } = req.body;
  if (!practiceId || !participant || !date || !startTime || !endTime) {
    return res.status(400).json({ message: "All schedule fields are required." });
  }
  const schedule = {
    id: nextScheduleId++,
    practiceId: Number(practiceId),
    participant,
    date,
    startTime,
    endTime,
  };
  SCHEDULES.push(schedule);
  res.status(201).json(schedule);
});

// PUT /api/practices/schedules/:id
router.put("/schedules/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = SCHEDULES.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ message: "Schedule not found." });
  const { practiceId, participant, date, startTime, endTime } = req.body;
  SCHEDULES[idx] = {
    ...SCHEDULES[idx],
    practiceId: Number(practiceId),
    participant,
    date,
    startTime,
    endTime,
  };
  res.json(SCHEDULES[idx]);
});

// DELETE /api/practices/schedules/:id
router.delete("/schedules/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = SCHEDULES.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ message: "Schedule not found." });
  SCHEDULES.splice(idx, 1);
  res.json({ message: "Deleted." });
});

module.exports = router;
