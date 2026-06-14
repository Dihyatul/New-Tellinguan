import React, { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useNavigate, useLocation } from "react-router-dom";
import MonthlyGrowthChart from "./MonthlyGrowthChart";
import ParticipantLevelChart from "./ParticipantChart";

import DashboardIcon  from "../assets/Dashboard.png";
import CourseIcon     from "../assets/Course.png";
import PracticeIcon   from "../assets/Practice.png";
import ParticipantIcon from "../assets/Participants.png";
import PlacementIcon  from "../assets/PlacementTest.png";
import MessageIcon    from "../assets/Message.png";
import { courses as courseList } from "./CourseMateri";
import ParticipantsBar from "../assets/TotParticipants.png";
import CourseBar      from "../assets/addCourse.png";
import PracticeBar    from "../assets/addPractice.png";
import SubscriberBar  from "../assets/TotSubscriber.png";

const sidebarItems = [
  { key: "dashboard",    label: "Dashboard",     path: "/Admin",              icon: DashboardIcon },
  { key: "course",       label: "Course",         path: "/CourseAdmin",        icon: CourseIcon },
  { key: "practice",    label: "Practice",       path: "/PracticeAdmin",      icon: PracticeIcon },
  { key: "participants", label: "Participants",   path: "/ParticipantsAdmin",  icon: ParticipantIcon },
  { key: "placement",   label: "Placement Test", path: "/PlacementTestAdmin", icon: PlacementIcon },
  { key: "message",     label: "Message",        path: "/MessageAdmin",       icon: MessageIcon },
];

const Admin = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [stats,      setStats]      = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: "Bearer admin-token" },
    })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statsCards = [
    {
      title: "Total Participants",
      value: loading ? "…" : `${stats?.stats?.totalParticipants ?? 0}\nParticipants`,
      bg: "bg-[#fff1f1]",
      icon: ParticipantsBar,
      action: null,
    },
    {
      title: "Total Courses",
      value: `${courseList.length}\nCourses`,
      bg: "bg-[#eef5ff]",
      icon: CourseBar,
      action: () => navigate("/CourseAdmin"),
    },
    {
      title: "Total Practice",
      value: loading ? "…" : `${stats?.stats?.totalPractice ?? 0}\nPractice`,
      bg: "bg-[#fff3e5]",
      icon: PracticeBar,
      action: () => navigate("/PracticeAdmin"),
    },
    {
      title: "Total Subscriber",
      value: loading ? "…" : `${stats?.stats?.totalSubscribers ?? 0}\nSubscribers`,
      bg: "bg-[#ecffe8]",
      icon: SubscriberBar,
      action: null,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">
        <div className="bg-white text-black rounded-xl p-6 mb-8 text-center shadow-md">
          <h2 className="text-2xl font-bold text-[#b6252a]">Welcome Admin</h2>
          <p className="text-sm text-gray-500 mt-2">TelLinguan Dashboard</p>
        </div>

        <div className="space-y-3">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full h-14 flex items-center justify-between px-4 rounded-lg transition ${
                  isActive ? "bg-red-600 text-white" : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={item.icon} alt={item.label} className="w-8 h-8 object-contain" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {(item.key === "course" || item.key === "practice") && (
                  <div className={`w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-10 ${isActive ? "border-l-white" : "border-l-gray-400"}`} />
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className={`${card.bg} rounded-xl p-5 shadow-sm flex items-center justify-between`}>
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h2 className="text-xl font-bold mt-2 whitespace-pre-line">{card.value}</h2>
              </div>
              <button
                onClick={card.action ?? undefined}
                className="w-13 h-13 bg-white rounded-xl shadow-sm flex items-center justify-center"
              >
                <img src={card.icon} alt={card.title} className="w-13 h-13 object-contain" />
              </button>
            </div>
          ))}
        </div>

        {/* CHART SECTION */}
        <div className="grid grid-cols-3 gap-5 mb-8">

          {/* MONTHLY GROWTH */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5">Monthly Growth</h2>
            <div className="h-93 border rounded-lg p-4">
              <MonthlyGrowthChart data={stats?.monthlyGrowth ?? []} />
            </div>
          </div>

          {/* COURSE DISTRIBUTION */}
          <div className="bg-white rounded-xl p-6 shadow-sm w-full">
            <h2 className="text-xl font-bold mb-5">Course Distribution</h2>
            <div className="w-full flex justify-center items-center">
              <ParticipantLevelChart data={stats?.levelDistribution ?? []} />
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-2 gap-5">

          {/* RECENT ACTIVITIES */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5">Recent Activities</h2>

            {loading ? (
              <p className="text-gray-400 text-sm">Memuat...</p>
            ) : !stats?.recentActivities?.length ? (
              <p className="text-gray-400 text-sm">Belum ada aktivitas.</p>
            ) : (
              <div className="space-y-4">
                {stats.recentActivities.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.action}</p>
                    </div>
                    <span className="text-xs text-gray-400 text-right">{item.timeAgo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LEARNING GOALS */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5">Top Learning Goal</h2>

            {loading ? (
              <p className="text-gray-400 text-sm">Memuat...</p>
            ) : !stats?.learningGoals?.length ? (
              <p className="text-gray-400 text-sm">Belum ada data tujuan belajar.</p>
            ) : (
              <div className="space-y-6">
                {stats.learningGoals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium">{goal.title}</p>
                      <span className="text-sm text-gray-500">{goal.percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div
                        className="h-3 bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${goal.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Admin;
