import React, { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useLocation, useNavigate } from "react-router-dom";
import poorImg      from "../assets/level1.png";
import acceptableImg from "../assets/level2.png";
import goodImg      from "../assets/level3.png";
import excellentImg from "../assets/level4.png";

import LAPTOP from "../assets/course.png";
import BOOK   from "../assets/practice.png";
import PHONE  from "../assets/contact.png";
import COG    from "../assets/profile.png";

import AVATAR_ICON     from "../assets/user.png";
import USER_ICON       from "../assets/myUsername.png";
import EMAIL_ICON      from "../assets/myEmail.png";
import UNIVERSITY_ICON from "../assets/myUni.png";
import ID_ICON         from "../assets/myId.png";

const sidebarItems = [
  { key: "course",   label: "Course",   icon: LAPTOP, path: "/course" },
  { key: "practice", label: "Practice", icon: BOOK,   path: "/practice" },
  { key: "contact",  label: "Contact",  icon: PHONE,  path: "/contact" },
  { key: "profile",  label: "Profile",  icon: COG,    path: "/profile" },
];

const levelOrder  = ["poor", "acceptable", "good", "excellent"];
const levelStyles = {
  poor:       { color: "bg-red-400",    label: "Poor",       img: poorImg },
  acceptable: { color: "bg-yellow-400", label: "Acceptable", img: acceptableImg },
  good:       { color: "bg-green-400",  label: "Good",       img: goodImg },
  excellent:  { color: "bg-blue-400",   label: "Excellent",  img: excellentImg },
};

const SCORE_TO_LEVEL = (score, total) => {
  const pct = total ? (score / total) * 100 : 0;
  if (pct >= 80) return "excellent";
  if (pct >= 60) return "good";
  if (pct >= 40) return "acceptable";
  return "poor";
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile,  setProfile]  = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    Promise.all([
      fetch(`${API_URL}/api/user/profile`,  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/api/analysis`,      { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/api/result`,        { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
    ])
      .then(([prof, anal, res]) => {
        setProfile(prof);
        setAnalysis(anal);
        setResult(res);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const levelKey    = result ? SCORE_TO_LEVEL(result.score, result.totalQuestions) : "poor";
  const currentLevel = levelStyles[levelKey] || levelStyles.poor;
  const currentIdx  = levelOrder.indexOf(levelKey);
  const nextKey     = currentIdx < levelOrder.length - 1 ? levelOrder[currentIdx + 1] : "excellent";
  const nextLevel   = levelStyles[nextKey];

  const preferredDays = analysis?.days  ?? [];
  const preferredTime = analysis?.times?.[0] ?? "-";
  const learningGoal  = Array.isArray(analysis?.goals) ? analysis.goals.join(", ") : (analysis?.goals ?? "-");
  const duration      = analysis?.weeks ? `${analysis.weeks} minggu` : "-";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Memuat profil...</p>
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
              <h2 className="text-lg font-semibold">Welcome {profile?.username ?? "-"}</h2>
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
                aria-label={item.label}
                className={`w-62 h-13.75 flex items-center gap-3 px-4 rounded-lg transition text-center ${
                  isActive ? "bg-red-600 text-white" : "bg-white text-black hover:bg-gray-200"
                }`}
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

        {/* TOP INFO CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Learning Goals</p>
            <p className="font-semibold text-gray-800">{learningGoal || "-"}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Preferred Schedule</p>
            <p className="font-semibold text-gray-800">{duration}</p>
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
              {preferredTime}
            </div>
          </div>
        </div>

        {/* PROFILE CARD */}
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 flex items-center gap-6 max-w-2xl ml-65">
          {/* Avatar area — ready for future upload */}
          <div
            className="bg-red-800 w-60 h-60 rounded-xl flex items-center justify-center cursor-pointer"
            title="Profile photo (upload coming soon)"
            aria-label="Profile photo area"
          >
            <img src={AVATAR_ICON} alt="avatar" className="w-40 h-40" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{profile?.username ?? "-"}</h2>

            <div className="flex items-center gap-3 text-gray-600">
              <img src={USER_ICON} className="w-5 h-5" alt="username" />
              <p className="text-lg">{profile?.username ?? "-"}</p>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <img src={EMAIL_ICON} className="w-5 h-5" alt="email" />
              <a
                href={`mailto:${profile?.email}`}
                className="text-lg text-blue-600 hover:underline"
              >
                {profile?.email ?? "-"}
              </a>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <img src={UNIVERSITY_ICON} className="w-5 h-5" alt="institution" />
              <p className="text-lg">{profile?.instansi ?? "-"}</p>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <img src={ID_ICON} className="w-5 h-5" alt="NIM/NIP" />
              <p className="text-lg">{profile?.nimNisn ?? "-"}</p>
            </div>
          </div>
        </div>

        {/* LEVEL SECTION */}
        <div className="flex items-center gap-10 mt-10 ml-75">
          <img src={currentLevel.img} alt={currentLevel.label} className="w-40 h-40 object-contain" />

          <div className="text-2xl font-bold leading-snug">
            {levelKey === "excellent" ? (
              <>
                🎉 Stay consistent, <br />
                you're already at the top! <br />
                <span className="relative inline-block text-red-600">Excellent 🚀✨</span>
              </>
            ) : (
              <>
                Stay consistent, <br />
                you're just one step <br />
                away from reaching{" "}
                <span className="text-red-600">{nextLevel.label}</span>
              </>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Profile;
