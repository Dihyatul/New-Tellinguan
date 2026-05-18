import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOTAL_QUESTIONS = 30;

const Hasil = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [level, setLevel] = useState("");
  const [recommendation, setRecommendation] = useState({ kurang: [], improve: [] });
  const [analysis, setAnalysis] = useState({ goal: "", duration: "", days: [], time: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/result", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json();
          setError(errData.message || "Failed to load result.");
          return;
        }

        const data = await res.json();

        setResult(data.score);
        setLevel(data.level);
        setRecommendation({
          kurang: data.recommendation?.kurang || [],
          improve: data.recommendation?.improve || [],
        });
        setAnalysis({
          goal: data.analysis?.goal || "",
          duration: data.analysis?.duration || "",
          days: data.analysis?.days || [],
          time: data.analysis?.time || "",
        });
      } catch (err) {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">

      <div className="absolute -top-72 w-[150%] h-175 rounded-[50%] bg-linear-to-br from-[#871117] to-[#ED1E28]" />

      <div className="relative z-10 w-full flex justify-center">
        <div className="w-full max-w-5xl px-6 py-10">

          <section className="text-center mt-40">
            <h1 className="text-6xl font-bold mb-6 text-white">THIS IS YOUR RESULT!</h1>
            <div className="bg-white shadow-lg rounded-xl w-60 mx-auto py-6 mt-25">
              <h2 className="text-5xl font-bold text-red-600">
                {result}/{TOTAL_QUESTIONS}
              </h2>
            </div>
            <p className="mt-6 text-lg max-w-xl mx-auto">
              Score kamu masuk ke <b>{level || "Level belum tersedia"}</b>!
              <br />
              Tingkatkan lagi level kamu dengan materi di bawah ini.
            </p>
          </section>

          <section className="mt-16 bg-white p-8 rounded-xl shadow">
            <h2 className="font-semibold text-xl mb-4">Masih kurang apa?</h2>
            <ul className="list-disc ml-6 mb-6">
              {recommendation.kurang.length > 0 ? (
                recommendation.kurang.map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <li className="text-gray-400">Semua kategori sudah dikuasai!</li>
              )}
            </ul>

            <h2 className="font-semibold text-xl mb-4">Apa yang harus ditingkatkan?</h2>
            <ul className="list-disc ml-6">
              {recommendation.improve.length > 0 ? (
                recommendation.improve.map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <li className="text-gray-400">Pertahankan performa kamu!</li>
              )}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Your Course Time Analysis Results</h2>
            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-500">Learning Goals</p>
                <h3 className="font-semibold text-lg">{analysis.goal || "-"}</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-500">Preferred Schedule</p>
                <h3 className="font-semibold text-lg">{analysis.duration || "-"}</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
                <p className="text-gray-500 mb-2">Available Days</p>
                <div className="flex gap-3 flex-wrap">
                  {analysis.days.length > 0 ? (
                    analysis.days.map((day, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-100 rounded-lg">{day}</span>
                    ))
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow md:col-span-2 text-center">
                <p className="text-gray-500">Preferred Time</p>
                <h3 className="font-semibold text-lg">{analysis.time || "-"}</h3>
              </div>
            </div>
          </section>

          <section className="text-center mt-20">
            <h2 className="text-2xl font-bold mb-4">Ingin Meningkatkan Level?</h2>
            <p className="mb-6">
              Tingkatkan kemampuan bahasa inggris Anda <br /> dengan course sesuai level Anda!
            </p>
            <button
              onClick={() => navigate("/Course")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Join Course
            </button>
          </section>

        </div>
      </div>
    </main>
  );
};

export default Hasil;
