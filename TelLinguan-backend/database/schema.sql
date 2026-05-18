-- TelLinguan Database Schema
-- Run: psql -U postgres -d tellinguan -f database/schema.sql

-- Create database (run separately if needed):
-- CREATE DATABASE tellinguan;

-- ===========================
-- USERS TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  instansi    VARCHAR(255) NOT NULL,
  username    VARCHAR(100) UNIQUE NOT NULL,
  nim_nisn    VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- QUESTIONS TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS questions (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(50) NOT NULL,        -- 'grammar' | 'listening' | 'reading'
  question    TEXT NOT NULL,
  options     JSONB NOT NULL,              -- ["A", "B", "C", "D"]
  answer      INTEGER NOT NULL,            -- index of correct option (0-based)
  audio_url   TEXT,                        -- nullable, used for listening
  passages    JSONB,                        -- nullable, used for reading
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- TEST RESULTS TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS test_results (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score            INTEGER NOT NULL,
  total_questions  INTEGER NOT NULL,
  level            VARCHAR(50) NOT NULL,
  answers          JSONB NOT NULL,          -- [{ questionId, selected }]
  recommendation   JSONB NOT NULL,          -- { kurang: [], improve: [] }
  analysis         JSONB NOT NULL,          -- { goal, duration, days, time }
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- CONTACT MESSAGES TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON contact_messages(user_id);
