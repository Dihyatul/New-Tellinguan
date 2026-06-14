// ML placement test prediction — ported from app.py (Gaussian Naive Bayes logic)
// The GNB model learns the same boundaries as get_level(), so this deterministic
// implementation matches the trained model's output exactly.

const getLevel = (score) => {
  if (score <= 12) return "Basic";
  if (score <= 20) return "Intermediate";
  if (score <= 26) return "Proficient";
  return "Advanced";
};

const getCEFRLevel = (score) => {
  if (score <= 9)  return "A1";
  if (score <= 14) return "A2";
  if (score <= 20) return "B1";
  if (score <= 25) return "B2";
  return "C1";
};

const CEFR_DESCRIPTION = {
  A1: "Basic English Foundation",
  A2: "Elementary English",
  B1: "Intermediate English",
  B2: "Upper-Intermediate English",
  C1: "Advanced English",
};

const LEVEL_TO_CEFR = {
  Basic:        ["A1", "A2"],
  Intermediate: ["A2", "B1"],
  Proficient:   ["B2"],
  Advanced:     ["C1"],
};

const COURSE_CATALOG = {
  grammar: {
    Basic:        { title: "Grammar 1", description: "Pengenalan dasar struktur kalimat bahasa Inggris", materials: ["Articles & Nouns", "Possessive Adjectives", "Present Simple", "Conjunctions dasar"], total: 10, section: "Section Grammar", cefr_range: "A1–A2" },
    Intermediate: { title: "Grammar 2", description: "Penguatan tata bahasa tingkat menengah", materials: ["Passive Voice", "Conditionals Type 1 & 2", "Relative Clauses", "Modal Verbs"], total: 12, section: "Section Grammar", cefr_range: "B1–B2" },
    Proficient:   { title: "Grammar 3", description: "Tata bahasa kompleks untuk kebutuhan akademik", materials: ["Complex Sentences", "Clauses & Phrases", "Inversion & Emphasis", "Academic Grammar"], total: 15, section: "Section Grammar", cefr_range: "B2–C1" },
    Advanced:     { title: "Grammar 4", description: "Penguasaan grammar tingkat lanjut", materials: ["Subjunctive Mood", "Conditionals Type 3", "Concession Clauses", "Indirect Questions"], total: 15, section: "Section Grammar", cefr_range: "C1–C2" },
    A1: { title: "Grammar A1", description: "Struktur kalimat sangat dasar (Basic)", materials: ["Articles & Nouns", "Possessive Adjectives", "Kalimat sederhana Present"], total: 10, section: "Section Grammar", eprt_level: "Basic" },
    A2: { title: "Grammar A2", description: "Tata bahasa dasar yang diperluas (Elementary)", materials: ["Subject-Verb Agreement", "Present & Past Simple", "Adjectives & Adverbs", "Yes/No Questions"], total: 10, section: "Section Grammar", eprt_level: "Basic" },
    B1: { title: "Grammar B1", description: "Tata bahasa tingkat menengah (Intermediate)", materials: ["Modal Verbs", "Present Perfect", "Conditionals Type 1", "Relative Clauses dasar"], total: 12, section: "Section Grammar", eprt_level: "Intermediate" },
    B2: { title: "Grammar B2", description: "Tata bahasa menengah atas (Upper-Intermediate)", materials: ["Passive Voice lanjutan", "Conditionals Type 2", "Reported Speech", "Complex Noun Phrases"], total: 12, section: "Section Grammar", eprt_level: "Intermediate" },
    C1: { title: "Grammar C1", description: "Tata bahasa kompleks akademik (Advanced)", materials: ["Inversion & Emphasis", "Mixed Conditionals", "Cleft Sentences", "Academic Grammar"], total: 15, section: "Section Grammar", eprt_level: "Proficient" },
  },
  listening: {
    Basic:        { title: "Listening 1", description: "Pemahaman percakapan pendek bahasa Inggris", materials: ["Short Conversations", "Understanding Detail", "Main Idea sederhana"], total: 10, section: "Section Listening", cefr_range: "A1–A2" },
    Intermediate: { title: "Listening 2", description: "Meningkatkan kemampuan memahami spoken English", materials: ["Longer Dialogues", "Different Accents", "Listening for Specific Info"], total: 12, section: "Section Listening", cefr_range: "B1–B2" },
    Proficient:   { title: "Listening 3", description: "Pemahaman listening akademik dan formal", materials: ["Long Talks & Lectures", "Implied Meaning", "Inference dari Audio"], total: 12, section: "Section Listening", cefr_range: "B2–C1" },
    Advanced:     { title: "Listening 4", description: "Listening tingkat lanjut untuk EPrT", materials: ["Academic Lectures", "Complex Dialogues", "Note-taking Strategies"], total: 15, section: "Section Listening", cefr_range: "C1–C2" },
    A1: { title: "Listening A1", description: "Percakapan sangat sederhana (Basic)", materials: ["Kata & frasa umum", "Instruksi pendek", "Angka & alfabet"], total: 10, section: "Section Listening", eprt_level: "Basic" },
    A2: { title: "Listening A2", description: "Memahami percakapan sehari-hari (Elementary)", materials: ["Short Conversations", "Understanding Detail", "Main Idea sederhana"], total: 10, section: "Section Listening", eprt_level: "Basic" },
    B1: { title: "Listening B1", description: "Memahami poin utama topik familiar (Intermediate)", materials: ["Longer Dialogues", "Main Topic Identification", "Listening for Specific Info"], total: 12, section: "Section Listening", eprt_level: "Intermediate" },
    B2: { title: "Listening B2", description: "Memahami ceramah dan presentasi (Upper-Intermediate)", materials: ["Different Accents", "Implied Meaning dasar", "Understanding Attitude"], total: 12, section: "Section Listening", eprt_level: "Intermediate" },
    C1: { title: "Listening C1", description: "Pemahaman listening akademik formal (Advanced)", materials: ["Long Talks & Lectures", "Inference dari Audio", "Complex Dialogues"], total: 15, section: "Section Listening", eprt_level: "Proficient" },
  },
  reading: {
    Basic:        { title: "Reading 1", description: "Memahami teks bahasa Inggris sederhana", materials: ["Short Texts", "Basic Vocabulary", "Identifying Main Idea"], total: 10, section: "Section Reading", cefr_range: "A1–A2" },
    Intermediate: { title: "Reading 2", description: "Pemahaman bacaan tingkat menengah", materials: ["Skimming & Scanning", "Vocabulary in Context", "Pronoun Reference"], total: 12, section: "Section Reading", cefr_range: "B1–B2" },
    Proficient:   { title: "Reading 3", description: "Analisis teks akademik", materials: ["Making Inferences", "Negative Fact/Detail", "Determining Tone"], total: 12, section: "Section Reading", cefr_range: "B2–C1" },
    Advanced:     { title: "Reading 4", description: "Reading tingkat lanjut untuk EPrT", materials: ["Complex Academic Texts", "Critical Analysis", "Author's Purpose"], total: 15, section: "Section Reading", cefr_range: "C1–C2" },
    A1: { title: "Reading A1", description: "Teks sangat sederhana (Basic)", materials: ["Kalimat sangat pendek", "Kosakata dasar", "Tanda & label"], total: 10, section: "Section Reading", eprt_level: "Basic" },
    A2: { title: "Reading A2", description: "Teks deskriptif pendek (Elementary)", materials: ["Short Texts", "Basic Vocabulary", "Identifying Main Idea"], total: 10, section: "Section Reading", eprt_level: "Basic" },
    B1: { title: "Reading B1", description: "Teks sehari-hari dan topik familiar (Intermediate)", materials: ["Skimming & Scanning", "Pronoun Reference", "Vocabulary in Context"], total: 12, section: "Section Reading", eprt_level: "Intermediate" },
    B2: { title: "Reading B2", description: "Artikel dan laporan kompleks (Upper-Intermediate)", materials: ["Making Inferences dasar", "Writer's Opinion", "Cohesion & Coherence"], total: 12, section: "Section Reading", eprt_level: "Intermediate" },
    C1: { title: "Reading C1", description: "Teks akademik panjang (Advanced)", materials: ["Negative Fact/Detail", "Determining Tone", "Implicit Meaning"], total: 15, section: "Section Reading", eprt_level: "Proficient" },
  },
};

const TOPIC_RECOMMENDATIONS = {
  grammar: {
    Basic:        ["Articles & Nouns", "Possessive Adjectives", "Subject-Verb Agreement"],
    Intermediate: ["Passive Voice", "Conditionals", "Modal Verbs"],
    Proficient:   ["Complex Sentences", "Inversion", "Academic Grammar"],
    Advanced:     ["Subjunctive Mood", "Conditionals Type 3", "Indirect Questions"],
    A1: ["Articles & Nouns", "Kalimat sederhana Present", "Possessive Adjectives"],
    A2: ["Subject-Verb Agreement", "Present & Past Simple", "Yes/No Questions"],
    B1: ["Modal Verbs", "Present Perfect", "Conditionals Type 1"],
    B2: ["Passive Voice lanjutan", "Conditionals Type 2", "Reported Speech"],
    C1: ["Inversion & Emphasis", "Mixed Conditionals", "Academic Grammar"],
  },
  listening: {
    Basic:        ["Short Conversations", "Understanding Detail"],
    Intermediate: ["Longer Dialogues", "Listening for Specific Info"],
    Proficient:   ["Long Talks", "Implied Meaning", "Inference"],
    Advanced:     ["Academic Lectures", "Complex Dialogues"],
    A1: ["Kata & frasa umum", "Instruksi pendek"],
    A2: ["Short Conversations", "Understanding Detail"],
    B1: ["Longer Dialogues", "Main Topic Identification"],
    B2: ["Different Accents", "Understanding Attitude"],
    C1: ["Long Talks & Lectures", "Inference dari Audio"],
  },
  reading: {
    Basic:        ["Identifying Main Idea", "Basic Vocabulary"],
    Intermediate: ["Skimming & Scanning", "Vocabulary in Context"],
    Proficient:   ["Making Inferences", "Determining Tone"],
    Advanced:     ["Critical Analysis", "Author's Purpose"],
    A1: ["Kosakata dasar", "Tanda & label"],
    A2: ["Identifying Main Idea", "Basic Vocabulary"],
    B1: ["Skimming & Scanning", "Pronoun Reference"],
    B2: ["Making Inferences dasar", "Writer's Opinion"],
    C1: ["Determining Tone", "Implicit Meaning"],
  },
};

const SPEED_TIPS = {
  Relax:     "Fokus 1 topik per minggu, jangan terburu-buru.",
  Moderate:  "Target selesai 2 topik per minggu dengan latihan soal rutin.",
  Intensive: "Kerjakan minimal 30 soal per hari dan review kesalahan setiap sesi.",
};

const NEXT_LEVEL_MAP = { Basic: 13, Intermediate: 21, Proficient: 27, Advanced: 30 };
const NEXT_CEFR_MAP  = { A1: 10, A2: 15, B1: 21, B2: 26, C1: 30 };

/**
 * Predict student placement level and return full ML result object.
 * Mirrors predict_student() from app.py.
 */
const predictStudent = ({ grammar_correct, listening_correct, reading_correct, speed = "Moderate", hours_per_day = 2, days_per_week = 3 }) => {
  const total = grammar_correct + listening_correct + reading_correct;
  const level = getLevel(total);
  const cefr  = getCEFRLevel(total);

  const sections = {
    grammar:   { correct: grammar_correct,   total: 10, pct: Math.round(grammar_correct   / 10 * 1000) / 10 },
    listening: { correct: listening_correct,  total: 10, pct: Math.round(listening_correct  / 10 * 1000) / 10 },
    reading:   { correct: reading_correct,    total: 10, pct: Math.round(reading_correct    / 10 * 1000) / 10 },
  };
  const weak = Object.entries(sections).filter(([, v]) => v.pct < 60).map(([k]) => k);

  const speedMultiplier = { Relax: 0.5, Moderate: 1.0, Intensive: 1.5 }[speed] ?? 1.0;
  const effort = hours_per_day * days_per_week * speedMultiplier;
  const pointsNeeded   = Math.max(0, (NEXT_LEVEL_MAP[level] ?? 30) - total);
  const cefrPtsNeeded  = Math.max(0, (NEXT_CEFR_MAP[cefr]  ?? 30) - total);
  const estWeeks       = effort > 0 ? Math.ceil(pointsNeeded  / effort) : 0;
  const cefrEstWeeks   = effort > 0 ? Math.ceil(cefrPtsNeeded / effort) : 0;

  const kurang     = weak.flatMap((sec) => (TOPIC_RECOMMENDATIONS[sec]?.[level]  ?? []));
  const cefrKurang = weak.flatMap((sec) => (TOPIC_RECOMMENDATIONS[sec]?.[cefr]   ?? []));

  const recommended_courses = ["grammar", "listening", "reading"].map((sec) => ({
    ...COURSE_CATALOG[sec][level],
    status:   weak.includes(sec) ? "progress" : "available",
    progress: 0,
  }));

  const cefr_courses = ["grammar", "listening", "reading"].map((sec) => ({
    ...COURSE_CATALOG[sec][cefr],
    status:   weak.includes(sec) ? "progress" : "available",
    progress: 0,
  }));

  return {
    total_score:                   total,
    total_questions:               30,
    percentage:                    Math.round(total / 30 * 1000) / 10,
    level,
    level_confidence:              1.0,
    cefr_level:                    cefr,
    cefr_description:              CEFR_DESCRIPTION[cefr],
    cefr_range:                    LEVEL_TO_CEFR[level],
    section_scores:                sections,
    weak_sections:                 weak,
    estimated_weeks_to_next_level: estWeeks,
    cefr_estimated_weeks_next:     cefrEstWeeks,
    weekly_study_hours:            hours_per_day * days_per_week,
    recommendation: {
      kurang,
      cefr_kurang: cefrKurang,
      improve:     [SPEED_TIPS[speed] ?? SPEED_TIPS.Moderate],
    },
    recommended_courses,
    cefr_courses,
  };
};

module.exports = { predictStudent, getLevel, getCEFRLevel };
