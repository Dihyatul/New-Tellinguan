import { useState, useRef } from "react";
import { API_URL } from "../config.js";

const UploadQuestions = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);
  const [clearMsg, setClearMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setResult(null);
    setError("");

    if (!selected) {
      setFile(null);
      return;
    }

    const ext = selected.name.split(".").pop().toLowerCase();
    if (!["json", "csv", "xlsx", "xls"].includes(ext)) {
      setError("Only .json, .csv, .xlsx, and .xls files are allowed.");
      setFile(null);
      fileInputRef.current.value = "";
      return;
    }

    setFile(selected);
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL questions from the database? This cannot be undone.")) return;

    const token = localStorage.getItem("token");
    setClearing(true);
    setClearMsg("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/questions/all`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to clear questions.");
      } else {
        setClearMsg(data.message);
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setClearing(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to upload questions.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/upload/questions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Upload failed.");
        return;
      }

      setResult(data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold text-red-700 mb-1">Upload Questions</h1>
        <p className="text-gray-500 text-sm mb-6">
          Upload a <code>.json</code>, <code>.csv</code>, <code>.xlsx</code>, or <code>.xls</code> file to insert questions into the database.
        </p>

        {/* FILE INPUT */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select File (.json, .csv, .xlsx, .xls)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
          />
          {file && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* CLEAR SUCCESS */}
        {clearMsg && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-md text-sm">
            {clearMsg}
          </div>
        )}

        {/* UPLOAD BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Uploading..." : "Upload Questions"}
        </button>

        {/* CLEAR BUTTON */}
        <button
          onClick={handleClearAll}
          disabled={clearing}
          className="w-full mt-3 bg-white border border-red-400 text-red-600 py-2 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {clearing ? "Clearing..." : "Clear All Questions"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg">
            <h2 className="text-green-800 font-semibold text-lg mb-2">Upload Complete</h2>
            <div className="flex gap-6 mb-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">{result.inserted}</p>
                <p className="text-sm text-gray-600">Inserted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{result.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-semibold text-red-700 mb-1">Row Errors:</p>
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <li key={i} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded">
                      <span className="font-medium">Row {err.row}:</span> {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* FORMAT GUIDE */}
        <div className="mt-6 text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-700">Expected JSON format:</p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">{`[
  {
    "type": "grammar",
    "question": "Some colonies...",
    "options": ["A", "B", "C", "D"],
    "answer": 0,
    "audio_url": null,
    "passages": null
  }
]`}</pre>
          <p className="font-semibold text-gray-700 mt-2">Expected CSV columns:</p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">{`type,question,options,answer,audio_url,passages
grammar,"Some colonies...","[""A"",""B"",""C"",""D""]",0,,`}</pre>
          <p className="font-semibold text-gray-700 mt-2">Expected Excel (.xlsx) columns:</p>
          <p className="text-gray-500">Same columns as CSV — one row per question with headers in row 1:</p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">{`type | question | options | answer | audio_url | passages
grammar | Some colonies... | ["A","B","C","D"] | 0 | (leave blank) | (leave blank)`}</pre>
        </div>

      </div>
    </div>
  );
};

export default UploadQuestions;
