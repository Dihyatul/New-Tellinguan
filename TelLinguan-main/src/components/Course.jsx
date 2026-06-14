import { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useLocation, useNavigate } from "react-router-dom";
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


const generateWeeklySchedule = (days, courseList) => {
  if (!days.length) return {};
  const schedule = {};
  days.forEach((day) => { schedule[day] = []; });
  courseList.forEach((course, i) => {
    const day = days[i % days.length];
    schedule[day].push(course);
  });
  return schedule;
};

const Course = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [profile,  setProfile]  = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [result,   setResult]   = useState(null);
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  const [activeTab, setActiveTab] = useState("recommended");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    Promise.all([
      fetch(`${API_URL}/api/user/profile`,  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/api/analysis`,      { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/api/result`,        { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API_URL}/api/courses`).then(r => r.ok ? r.json() : []),
    ])
      .then(([prof, anal, res, courseList]) => {
        setProfile(prof);
        setAnalysis(anal);
        setResult(res);
        setCourses(Array.isArray(courseList) ? courseList : []);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const levelKey    = result ? SCORE_TO_LEVEL(result.score, result.totalQuestions) : "poor";
  const currentLevel = levelStyles[levelKey] ?? levelStyles.poor;

  const preferredDays = analysis?.days  ?? [];
  const preferredTime = analysis?.times?.[0] ?? "-";
  const learningGoal  = Array.isArray(analysis?.goals) ? analysis.goals.join(", ") : (analysis?.goals ?? "-");
  const duration      = analysis?.weeks ? `${analysis.weeks} minggu` : "-";

  const weeklySchedule = generateWeeklySchedule(preferredDays, courses);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Memuat kursus...</p>
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

        {/* TAB */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("recommended")}
            className={`px-4 py-2 rounded-lg ${activeTab === "recommended" ? "bg-white shadow font-semibold" : "bg-gray-200 text-gray-500"}`}
          >
            Recommended Course
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-4 py-2 rounded-lg ${activeTab === "weekly" ? "bg-white shadow font-semibold" : "bg-gray-200 text-gray-500"}`}
          >
            Weekly Schedule
          </button>
        </div>

        {activeTab === "recommended" ? (

          <div className="grid grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${course.locked ? "text-red-500" : "text-blue-500"}`}>
                    {course.section}
                  </p>
                  <h3 className="text-xl font-bold text-black mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{course.description}</p>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Coverage of material:</p>
                  <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                    {course.coverage.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                  <p className="text-sm text-gray-500 mt-3">
                    <span className="font-semibold">Total Lessons:</span> {course.lesson}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  {course.locked ? (
                    <button disabled className="bg-gray-200 text-gray-400 px-5 py-2 rounded-lg text-sm cursor-not-allowed">
                      Coming Soon
                    </button>
                  ) : course.active ? (
                    <button className="bg-red-700 text-white px-5 py-2 rounded-lg text-sm shadow hover:bg-red-800 transition">
                      START
                    </button>
                  ) : (
                    <button disabled className="bg-gray-200 text-gray-400 px-5 py-2 rounded-lg text-sm cursor-not-allowed">
                      Inactive
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        ) : (

          <div className="space-y-6">
            {preferredDays.length === 0 ? (
              <p className="text-gray-400 text-sm">No preferred days set. Update your profile to see your weekly schedule.</p>
            ) : (
              Object.entries(weeklySchedule).map(([day, dayCourses], i) => (
                <div key={i}>
                  <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-semibold mb-3 shadow">
                    {day.toUpperCase()}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {dayCourses.map((course) => (
                      <div key={course.id} className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
                        <div>
                          <p className={`text-sm font-medium mb-1 ${course.locked ? "text-red-500" : "text-blue-500"}`}>
                            {course.section}
                          </p>
                          <h3 className="text-xl font-bold text-black mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-500 mb-3">{course.description}</p>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Coverage of material:</p>
                          <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                            {course.coverage.map((item, i) => <li key={i}>{item}</li>)}
                          </ul>
                          <p className="text-sm text-gray-500 mt-3">
                            <span className="font-semibold">Total Lessons:</span> {course.lesson}
                          </p>
                        </div>

                        <div className="flex justify-end mt-4">
                          {course.locked ? (
                            <button disabled className="bg-gray-200 text-gray-400 px-5 py-2 rounded-lg text-sm cursor-not-allowed">
                              Coming Soon
                            </button>
                          ) : course.active ? (
                            <button className="bg-red-700 text-white px-5 py-2 rounded-lg text-sm shadow hover:bg-red-800 transition">
                              START
                            </button>
                          ) : (
                            <button disabled className="bg-gray-200 text-gray-400 px-5 py-2 rounded-lg text-sm cursor-not-allowed">
                              Inactive
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        )}
      </main>
    </div>
  );
};

export default Course;
