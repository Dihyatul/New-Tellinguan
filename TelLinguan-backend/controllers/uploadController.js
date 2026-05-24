const pool = require("../config/db");
const csv = require("csv-parser");
const { Readable } = require("stream");
const XLSX = require("xlsx");

const validateRow = (row, index) => {
  const errors = [];

  if (!row.type) errors.push(`Row ${index}: Missing 'type' field`);
  if (!row.question) errors.push(`Row ${index}: Missing 'question' field`);

  let options = row.options;
  if (typeof options === "string") {
    try {
      options = JSON.parse(options);
    } catch {
      errors.push(`Row ${index}: 'options' is not valid JSON`);
      return { valid: false, errors };
    }
  }
  if (!Array.isArray(options) || options.length === 0) {
    errors.push(`Row ${index}: 'options' must be a non-empty array`);
    return { valid: false, errors };
  }

  const answer = Number(row.answer);
  if (isNaN(answer)) {
    errors.push(`Row ${index}: 'answer' must be a number`);
    return { valid: false, errors };
  }
  if (answer < 0 || answer >= options.length) {
    errors.push(`Row ${index}: 'answer' index ${answer} is out of bounds for options array`);
    return { valid: false, errors };
  }

  let passages = row.passages || null;
  if (passages && typeof passages === "string") {
    try {
      passages = JSON.parse(passages);
    } catch {
      errors.push(`Row ${index}: 'passages' is not valid JSON`);
      return { valid: false, errors };
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      type: row.type.trim(),
      question: row.question.trim(),
      options,
      answer,
      audio_url: row.audio_url || null,
      passages: passages || null,
    },
  };
};

const insertQuestion = async (data) => {
  await pool.query(
    `INSERT INTO questions (type, question, options, answer, audio_url, passages)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      data.type,
      data.question,
      JSON.stringify(data.options),
      data.answer,
      data.audio_url,
      data.passages ? JSON.stringify(data.passages) : null,
    ]
  );
};

const normalizeKeys = (rows) =>
  rows.map((row) => {
    const normalized = {};
    for (const key of Object.keys(row)) {
      normalized[key.trim().toLowerCase()] = row[key];
    }
    return normalized;
  });

const parseCSV = (buffer) =>
  new Promise((resolve, reject) => {
    const rows = [];
    const stream = Readable.from(buffer.toString("utf-8"));
    stream
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(normalizeKeys(rows)))
      .on("error", reject);
  });

// Detect if this workbook uses the Q-bank sheet layout
// (sheets named LISTENING, GRAMMAR, READING, TEXT 1)
const isQBankFormat = (workbook) => {
  const names = workbook.SheetNames.map((n) => n.trim().toUpperCase());
  return names.some((n) => ["LISTENING", "GRAMMAR", "READING"].includes(n));
};

// Parse the Q-bank format:
//   Sheets: LISTENING | GRAMMAR | READING | TEXT 1
//   Columns: IDE | Questions Type | Question Stem | Correct Answer |
//            Distractor 1 | Distractor 2 | Distractor 3 | Language Focus | CEFR | Audio URL
const parseExcelQBank = (workbook) => {
  const rows = [];

  // Extract reading passages from "TEXT 1" sheet if present
  let readingPassages = null;
  const textSheetName = workbook.SheetNames.find(
    (n) => n.trim().toUpperCase() === "TEXT 1"
  );
  if (textSheetName) {
    const textSheet = workbook.Sheets[textSheetName];
    const cells = XLSX.utils.sheet_to_json(textSheet, { header: 1, defval: "" });
    const passages = cells
      .flat()
      .map((c) => String(c).trim())
      .filter((c) => c.length > 30);
    if (passages.length > 0) readingPassages = passages;
  }

  const sheetTypeMap = { LISTENING: "listening", GRAMMAR: "grammar", READING: "reading" };

  for (const sheetName of workbook.SheetNames) {
    const type = sheetTypeMap[sheetName.trim().toUpperCase()];
    if (!type) continue;

    const sheet = workbook.Sheets[sheetName];
    const sheetRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    sheetRows.forEach((row, i) => {
      // Normalize column headers to lowercase
      const r = {};
      for (const key of Object.keys(row)) r[key.trim().toLowerCase()] = row[key];

      const question = String(r["question stem"] || r["question"] || "").trim();
      const correct  = String(r["correct answer"] || "").trim();
      const d1       = String(r["distractor 1"] || "").trim();
      const d2       = String(r["distractor 2"] || "").trim();
      const d3       = String(r["distractor 3"] || "").trim();
      const audioUrl = String(r["audio url"] || r["audio_url"] || "").trim() || null;

      if (!question || !correct) return;

      const distractors = [d1, d2, d3].filter((d) => d.length > 0);

      // Rotate the correct answer position across rows so it's not always option A
      const pos = i % (distractors.length + 1);
      const options = [...distractors];
      options.splice(pos, 0, correct);

      rows.push({
        type,
        question,
        options,
        answer: pos,
        audio_url: audioUrl,
        passages: type === "reading" && readingPassages ? readingPassages : null,
      });
    });
  }

  return rows;
};

const parseExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  if (isQBankFormat(workbook)) return parseExcelQBank(workbook);
  // Fallback: single-sheet standard format
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const sheetRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return normalizeKeys(sheetRows);
};

// POST /api/upload/questions  (protected)
const uploadQuestions = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const ext = req.file.originalname.split(".").pop().toLowerCase();
  let rows = [];

  try {
    if (ext === "json") {
      const parsed = JSON.parse(req.file.buffer.toString("utf-8"));
      if (!Array.isArray(parsed)) {
        return res.status(400).json({ message: "JSON file must contain an array of questions." });
      }
      rows = parsed;
    } else if (ext === "csv") {
      rows = await parseCSV(req.file.buffer);
    } else if (ext === "xlsx" || ext === "xls") {
      rows = parseExcel(req.file.buffer);
    } else {
      return res.status(400).json({ message: "Only .json, .csv, .xlsx, and .xls files are allowed." });
    }
  } catch (err) {
    return res.status(400).json({ message: `Failed to parse file: ${err.message}` });
  }

  let inserted = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const rowIndex = i + 1;
    const { valid, errors: rowErrors, data } = validateRow(rows[i], rowIndex);

    if (!valid) {
      failed++;
      rowErrors.forEach((err) => errors.push({ row: rowIndex, error: err.replace(`Row ${rowIndex}: `, "") }));
      continue;
    }

    try {
      await insertQuestion(data);
      inserted++;
    } catch (dbErr) {
      failed++;
      errors.push({ row: rowIndex, error: `Database error: ${dbErr.message}` });
    }
  }

  return res.status(200).json({
    message: "Upload processed",
    inserted,
    failed,
    errors,
  });
};

module.exports = { uploadQuestions };
