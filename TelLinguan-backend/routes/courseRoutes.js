const express = require("express");
const router = express.Router();

// Course catalogue — single source of truth for both user and admin.
// Stored here until a courses DB table is added.
const COURSES = [
  {
    id: 1,
    section: "Section 1",
    title: "Grammar 3",
    description: "Learning basic word structures in sentence construction",
    coverage: [
      "Complex sentence",
      "Clauses & phrases",
      "Inversion & emphasis",
      "Academic & formal grammar",
    ],
    lesson: "15 lessons",
    active: true,
    locked: false,
  },
  {
    id: 2,
    section: "Section 2",
    title: "Reading 1",
    description: "Understand English texts from main ideas to detailed information",
    coverage: [
      "Reading short texts",
      "Basic vocabulary building",
      "Identifying simple main ideas",
    ],
    lesson: "15 lessons",
    active: true,
    locked: false,
  },
  {
    id: 3,
    section: "Section 3",
    title: "Listening 2",
    description: "Enhances the ability to understand spoken English",
    coverage: [
      "Understanding longer dialogues",
      "Different basic accents",
      "Listening specific information",
    ],
    lesson: "15 lessons",
    active: true,
    locked: false,
  },
  {
    id: 4,
    section: "Section 4",
    title: "Reading 2",
    description: "Understand English texts from main ideas to detailed information",
    coverage: [
      "Skimming & scanning",
      "Understanding context",
      "Paragraph analysis",
    ],
    lesson: "15 lessons",
    active: false,
    locked: true,
  },
];

// GET /api/courses  — public, no auth required
router.get("/", (req, res) => {
  res.json(COURSES);
});

module.exports = router;
module.exports.COURSES = COURSES;
