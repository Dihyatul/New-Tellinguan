const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".json" || ext === ".csv" || ext === ".xlsx" || ext === ".xls") {
    cb(null, true);
  } else {
    cb(new Error("Only .json, .csv, .xlsx, and .xls files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
