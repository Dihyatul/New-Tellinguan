require("dotenv").config();

const ML_URL = process.env.ML_SERVER_URL || "http://127.0.0.1:5001";
const RUNS = parseInt(process.argv[2], 10) || 100;

const payload = {
  grammar_correct: 8,
  listening_correct: 5,
  reading_correct: 9,
  speed: "Moderate",
  hours_per_day: 2,
  days_per_week: 3,
};

const callPredict = async () => {
  const t0 = performance.now();
  const res = await fetch(`${ML_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  const total = performance.now() - t0;
  const infer = data.inference_ms;
  return { total, infer, overhead: total - infer };
};

(async () => {
  const results = [];
  for (let i = 0; i < RUNS; i++) {
    const r = await callPredict();
    results.push(r);
    console.log(`run ${i + 1}: total=${r.total.toFixed(3)}ms infer=${r.infer}ms overhead=${r.overhead.toFixed(3)}ms`);
  }

  const avg = (key) => results.reduce((s, r) => s + r[key], 0) / results.length;

  console.log("\n=== Averages over", RUNS, "runs ===");
  console.log("total (ms):    ", avg("total").toFixed(3));
  console.log("inference (ms):", avg("infer").toFixed(3));
  console.log("overhead (ms): ", avg("overhead").toFixed(3));
})();
