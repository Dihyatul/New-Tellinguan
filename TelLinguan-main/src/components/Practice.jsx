import { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useLocation, useNavigate } from "react-router-dom";
import practiceImg from "../assets/BOOK.png";
import clockImg from "../assets/comingsoon.png";
import poorImg from "../assets/level1.png";
import acceptableImg from "../assets/level2.png";
import goodImg from "../assets/level3.png";
import excellentImg from "../assets/level4.png";

import LAPTOP from "../assets/course.png";
import BOOK from "../assets/practice.png";
import PHONE from "../assets/contact.png";
import COG from "../assets/profile.png";

const sidebarItems = [
  { key: "course",   label: "Course",   icon: LAPTOP, path: "/course" },
  { key: "practice", label: "Practice", icon: BOOK,   path: "/practice" },
  { key: "contact",  label: "Contact",  icon: PHONE,  path: "/contact" },
  { key: "profile",  label: "Profile",  icon: COG,    path: "/profile" },
];

// Keyed by the same "level" string the backend computes and stores — keep in
// sync with getLevel() in resultController.js / the ML model's classes.
const levelStyles = {
  Basic:        { color: "bg-red-400",    label: "Basic",        img: poorImg },
  Intermediate: { color: "bg-yellow-400", label: "Intermediate", img: acceptableImg },
  Proficient:   { color: "bg-green-400",  label: "Proficient",   img: goodImg },
  Advanced:     { color: "bg-blue-400",   label: "Advanced",     img: excellentImg },
};

const categoryColor = {
  Grammar:   "bg-blue-100 text-blue-600",
  Reading:   "bg-green-100 text-green-600",
  Listening: "bg-yellow-100 text-yellow-700",
};

const Practice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile,   setProfile]   = useState(null);
  const [analysis,  setAnalysis]  = useState(null);
  const [result,    setResult]    = useState(null);
  const [practices, setPractices] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    Promise.all([
      fetch(`${API_URL}/api/user/profile`,   { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/api/analysis`,       { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/api/result`,         { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/api/practices`).then(r => r.ok ? r.json() : []),
    ])
      .then(([prof, anal, res, practiceList]) => {
        setProfile(prof);
        setAnalysis(anal);
        setResult(res);
        setPractices(Array.isArray(practiceList) ? practiceList : []);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const currentLevel = levelStyles[result?.level] ?? levelStyles.Basic;

  const preferredDays = analysis?.days  ?? [];
  const preferredTime = analysis?.times?.[0] ?? "-";
  const learningGoal  = Array.isArray(analysis?.goals) ? analysis.goals.join(", ") : (analysis?.goals ?? "-");
  const duration      = analysis?.weeks ? `${analysis.weeks} minggu` : "-";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Memuat latihan...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">
        <div className="bg-white text-black rounded-xl p-4 mb-8">
          <div className="flex items-center">
            <img src={currentLevel.img} alt={currentLevel.label} className="w-25 h-25 object-contain" />
            <div className="flex flex-col justify-center flex-1 text-center">
              <h2 className="text-lg font-semibold">Welcome {profile?.username ?? "User"}</h2>
              <div className={`mx-auto mt-1 px-3 py-1 rounded text-white text-sm ${currentLevel.color}`}>
                Level {currentLevel.label}
              </div>
              <p className="text-sm mt-1">Course Active</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-62 h-13.75 flex items-center gap-3 px-4 rounded-lg transition text-center
                  ${isActive ? "bg-red-600 text-white" : "bg-white text-black hover:bg-gray-200"}`}
              >
                <img src={item.icon} alt="" className="w-10 h-10" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">

        {/* TOP INFO */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Learning Goals</p>
            <p className="font-semibold text-gray-800">{learningGoal || "-"}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Preferred Schedule</p>
            <p className="font-semibold text-gray-800">{duration || "-"}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="flex flex-wrap gap-2 mb-2">
              {preferredDays.length > 0 ? (
                preferredDays.map((day, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {day}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">-</span>
              )}
            </div>
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm w-fit">
              {preferredTime || "-"}
            </div>
          </div>
        </div>

        {/* PRACTICE CARDS */}
        <div className="space-y-6">
          {practices.length === 0 && (
            <p className="text-gray-400 text-center mt-12">No practice materials available yet.</p>
          )}

          {practices.map((item, i) => (
            <div
              key={item.id}
              className="relative bg-white rounded-xl shadow border border-gray-200 p-6 flex justify-between items-center overflow-hidden"
            >
              {/* LEFT */}
              <div className="max-w-lg">
                <div className="flex items-center gap-3 mb-2">
                  <p className={`text-sm font-medium ${item.status ? "text-blue-500" : "text-gray-400"}`}>
                    {item.status ? `Practice ${i + 1}` : "Coming Soon"}
                  </p>
                  {item.category && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor[item.category] || "bg-gray-100 text-gray-600"}`}>
                      {item.category}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>

                <p className="text-gray-500 text-sm mb-1">{item.description}</p>

                {item.course && (
                  <p className="text-xs text-gray-400 mb-4">{item.course}</p>
                )}

                {item.status ? (
                  <button
                    onClick={() => navigate("/listening")}
                    className="bg-red-700 text-white px-5 py-2 rounded-lg shadow hover:bg-red-800 transition"
                  >
                    PRACTICE
                  </button>
                ) : (
                  <button disabled className="bg-gray-300 text-gray-500 px-5 py-2 rounded-lg cursor-not-allowed">
                    LOCKED
                  </button>
                )}
              </div>

              {/* RIGHT IMAGE */}
              <div className="absolute right-4 bottom-0 w-50 h-50 flex items-end justify-center">
                <img
                  src={item.status ? practiceImg : clockImg}
                  alt={item.status ? "active" : "locked"}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Practice;
