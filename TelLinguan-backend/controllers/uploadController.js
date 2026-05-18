const pool = require("../config/db");
const csv = require("csv-parser");
const { Readable } = require("stream");

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

const parseCSV = (buffer) =>
  new Promise((resolve, reject) => {
    const rows = [];
    const stream = Readable.from(buffer.toString("utf-8"));
    stream
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });

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
    } else {
      return res.status(400).json({ message: "Only .json and .csv files are allowed." });
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
