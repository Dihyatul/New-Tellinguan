-- TelLinguan Seed Data
-- Run AFTER schema.sql:
-- psql -U postgres -d tellinguan -f database/seed.sql

-- Clear existing questions (optional, comment out if you want to keep existing data)
-- TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

-- ===========================
-- SEED QUESTIONS
-- (3 sample questions from the frontend)
-- ===========================

INSERT INTO questions (type, question, options, answer, audio_url, passages)
VALUES
  (
    'grammar',
    'Some colonies of bryozoans, small marine animals, form ____ with trailing stems.',
    '["creeping colonies", "which colonies creep", "creeping colonies are", "colonies creep"]',
    0,
    NULL,
    NULL
  ),
  (
    'listening',
    'Understanding Detail',
    '["Organizing a presentation", "Using pictures as visual aid", "Scheduling a one-hour meeting", "Finishing a task"]',
    1,
    '/audio/sample.mp3',
    NULL
  ),
  (
    'reading',
    'It can be inferred from the passage that resilience means____.',
    '["students are not easy to give up", "students do not have good sportsmanship", "student make less effort", "students are dissatisfied easily"]',
    0,
    NULL,
    '[
      "Do we treat our land like dirt? That question headlining a 1984 National Geographic article on soils remains as relevant today as it was more than 30 years ago. We lavish attention on our food, we want to know where it came from, who grew it, and whether it is \"conventional\" or \"organic.\" But we give hardly a passing thought to the ground our food grew in. Soil could use some more attention and respect. After all, soil is the thin skin of our Earth where we plant and grow the vital grain crops like wheat, rice, and corn that feed more than seven billion of us.",
      "22 Do we treat our land like dirt? That question headlining a 1984 National Geographic article on soils remains as relevant today as it was more than 30 years ago. We lavish attention on our food, we want to know where it came from, who grew it, and whether it is \"conventional\" or \"organic.\" But we give hardly a passing thought to the ground our food grew in.",
      "33 Do we treat our land like dirt? That question headlining a 1984 National Geographic article on soils remains as relevant today as it was more than 30 years ago.",
      "44 Do we treat our land like dirt? That question headlining a 1984 National Geographic article on soils remains as relevant today as it was more than 30 years ago."
    ]'
  );

-- Confirm seed
SELECT id, type, question FROM questions;
