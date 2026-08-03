import { API_URL } from "../config.js";
const BASE = API_URL;

export const saveAnalysisAPI = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE}/api/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error("Failed to save analysis:", await res.text());
    }
  } catch (err) {
    // Non-blocking — localStorage already saved, test can still proceed
    console.error("Failed to save analysis:", err);
  }
};

export const getAnalysisAPI = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/api/analysis`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
};
