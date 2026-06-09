const BASE = "http://localhost:5000";

export const saveAnalysisAPI = async (data) => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`${BASE}/api/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  } catch {
    // Non-blocking — localStorage already saved, test can still proceed
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
