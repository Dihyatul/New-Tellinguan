import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import poorImg from "../assets/level1.png";
import acceptableImg from "../assets/level2.png";
import goodImg from "../assets/level3.png";
import excellentImg from "../assets/level4.png";

import LAPTOP from "../assets/Course.png";
import BOOK from "../assets/Practice.png";
import PHONE from "../assets/contact.png";
import COG from "../assets/profile.png";

const userData = JSON.parse(localStorage.getItem("user"));
const username = userData?.username || "User";

const sidebarItems = [
  { key: "course", label: "Course", icon: LAPTOP, path: "/course" },
  { key: "practice", label: "Practice", icon: BOOK, path: "/practice" },
  { key: "contact", label: "Contact", icon: PHONE, path: "/contact" },
  { key: "profile", label: "Profile", icon: COG, path: "/profile" },
];

// dari backend
const userLevel = "Good";

const levelStyles = {
  poor: { color: "bg-red-400", label: "Poor", img: poorImg },
  acceptable: { color: "bg-yellow-400", label: "Acceptable", img: acceptableImg },
  good: { color: "bg-green-400", label: "Good", img: goodImg },
  excellent: { color: "bg-blue-400", label: "Excellent", img: excellentImg },
};

const learningGoals = "Meningkatkan Skor EPRT";
const preferredDays = ["Monday", "Thursday"];
const preferredTime = "Afternoon 12.00 - 15.00 WIB";
const preferredDuration = "2 month";

const courses = [
  {
    section: "Section 1",
    title: "Grammar 3",
    description: "Learning basic word structures in sentence construction",
    materials: [
      "Complex sentence",
      "Clauses & phrases",
      "Inversion & emphasis",
      "Academic & formal grammar",
    ],
    progress: 5,
    total: 15,
    status: "progress", 
  },
  {
    section: "Section 2",
    title: "Reading 1",
    description: "Understand English texts from main ideas to detailed information",
    materials: [
      "Reading short texts",
      "Basic vocabulary building",
      "Identifying simple main ideas",
    ],
    progress: 0,
    total: 10,
    status: "available",
  },
  {
    section: "Section 3",
    title: "Listening 2",
    description: "Enhances the ability to understand spoken English",
    materials: [
      "Understanding longer dialogues",
      "Exposure to different accents",
      "Listening for specific information",
    ],
    progress: 0,
    total: 12,
    status: "available",
  },
  {
    section: "Coming Soon",
    title: "Reading 2",
    description: "Advanced reading comprehension",
    materials: [
      "Skimming & scanning",
      "Understanding context",
      "Paragraph analysis",
    ],
    progress: 0,
    total: 0,
    status: "locked", 
  },
];

const generateWeeklySchedule = (days, courses) => {
  if (!days.length) return {};

  const schedule = {};

  // init array kosong tiap hari
  days.forEach((day) => {
    schedule[day] = [];
  });

  // distribusi course ke hari (round robin)
  courses.forEach((course, index) => {
    const dayIndex = index % days.length;
    const day = days[dayIndex];

    schedule[day].push(course);
  });

  return schedule;
};


const Course = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedLevel = userLevel?.toLowerCase();
  const currentLevel =
    levelStyles[normalizedLevel] || levelStyles["poor"];
  const [activeTab, setActiveTab] = useState("recommended");
  const weeklySchedule = generateWeeklySchedule(preferredDays, courses);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">

        {/* PROFILE */}
        <div className="bg-white text-black rounded-xl p-4 mb-8">
          <div className="flex items-center">

            {/* IMAGE (KIRI) */}
            <img
              src={currentLevel.img}
              alt={currentLevel.label}
              className="w-25 h-25 object-contain"
            />

            {/* TEXT (KANAN) */}
            <div className="flex flex-col justify-center flex-1 text-center">
              <h2 className="text-lg font-semibold">
                Welcome {username}
              </h2>

              <div
                className={`mx-auto mt-1 px-3 py-1 rounded text-white text-sm ${currentLevel.color}`}
              >
                Level {currentLevel.label}
              </div>

              <p className="text-sm mt-1">
                Course Active
              </p>
            </div>

          </div>
        </div>
        {/* MENU */}
        <div className="space-y-3">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-62 h-13.75 flex items-center gap-3 px-4 rounded-lg transition text-center
                  ${isActive
                    ? "bg-red-600 text-white"   
                    : "bg-white text-black hover:bg-gray-200"
                  }
                `}
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

          {/* LEARNING GOALS */}
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Learning Goals</p>
            <p className="font-semibold text-gray-800">
              {learningGoals || "-"}
            </p>
          </div>

          {/* PREFERRED SCHEDULE */}
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Preferred Schedule</p>
            <p className="font-semibold text-gray-800">
              {preferredDuration || "-"}
            </p>
          </div>

          {/* DAYS + TIME (SEPERTI GAMBAR) */}
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="flex flex-wrap gap-2 mb-2">
              {preferredDays.length > 0 ? (
                preferredDays.map((day, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
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
            className={`px-4 py-2 rounded-lg ${activeTab === "recommended"
              ? "bg-white shadow font-semibold"
              : "bg-gray-200 text-gray-500"
              }`}
          >
            Recommended Course
          </button>

          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-4 py-2 rounded-lg ${activeTab === "weekly"
              ? "bg-white shadow font-semibold"
              : "bg-gray-200 text-gray-500"
              }`}
          >
            Weekly Schedule
          </button>
        </div>

        {activeTab === "recommended" ? (

          // ================= RECOMMENDED =================
          <div className="grid grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
              >

                <div>
                  <p className={`text-sm font-medium mb-1 ${course.status === "locked"
                    ? "text-red-500"
                    : "text-blue-500"
                    }`}>
                    {course.section}
                  </p>

                  <h3 className="text-xl font-bold text-black mb-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-3">
                    {course.description}
                  </p>

                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Coverage of material:
                  </p>

                  <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                    {course.materials.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">

                  {course.status === "progress" && (
                    <>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{
                            width: `${(course.progress / course.total) * 100}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {course.progress}/{course.total} lessons
                      </p>
                    </>
                  )}

                  <div className="flex justify-end mt-3">

                    {course.status === "progress" && (
                      <button className="bg-red-700 text-white px-5 py-2 rounded-lg text-sm shadow">
                        CONTINUE
                      </button>
                    )}

                    {course.status === "available" && (
                      <button className="bg-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm shadow">
                        JUMP TO SECTION
                      </button>
                    )}

                    {course.status === "locked" && (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-400 px-5 py-2 rounded-lg text-sm cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (

          // ================= WEEKLY SCHEDULE =================
          <div className="space-y-6">

            {Object.entries(weeklySchedule).map(([day, dayCourses], i) => (
              <div key={i}>

                {/* LABEL HARI */}
                <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-semibold mb-3 shadow">
                  {day.toUpperCase()}
                </div>

                {/* COURSE PER HARI */}
                <div className="grid grid-cols-2 gap-6">
                  {dayCourses.map((course, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
                    >

                      <div>
                        <p className={`text-sm font-medium mb-1 ${course.status === "locked"
                          ? "text-red-500"
                          : "text-blue-500"
                          }`}>
                          {course.section}
                        </p>

                        <h3 className="text-xl font-bold text-black mb-2">
                          {course.title}
                        </h3>

                        <p className="text-sm text-gray-500 mb-3">
                          {course.description}
                        </p>

                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Coverage of material:
                        </p>

                        <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                          {course.materials.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4">

                        {/* PROGRESS BAR */}
                        {course.status === "progress" && (
                          <>
                            <div className="w-full bg-gray-200 h-2 rounded-full">
                              <div
                                className="bg-red-600 h-2 rounded-full"
                                style={{
                                  width: `${(course.progress / course.total) * 100}%`,
                                }}
                              />
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                              {course.progress}/{course.total} lessons
                            </p>
                          </>
                        )}

                        {/* BUTTON */}
                        <div className="flex justify-end mt-3">

                          {course.status === "progress" && (
                            <button className="bg-red-700 text-white px-5 py-2 rounded-lg text-sm shadow">
                              CONTINUE
                            </button>
                          )}

                          {course.status === "available" && (
                            <button className="bg-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm shadow">
                              JUMP TO SECTION
                            </button>
                          )}

                          {course.status === "locked" && (
                            <button
                              disabled
                              className="bg-gray-200 text-gray-400 px-5 py-2 rounded-lg text-sm cursor-not-allowed"
                            >
                              Coming Soon
                            </button>
                          )}

                        </div>

                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>

        )}
      </main>
    </div>
  );
};

export default Course;