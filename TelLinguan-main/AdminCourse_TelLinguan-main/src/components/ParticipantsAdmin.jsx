import { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardIcon from "../assets/Dashboard.png";
import CourseIcon from "../assets/Course.png";
import PracticeIcon from "../assets/Practice.png";
import ParticipantIcon from "../assets/Participants.png";
import PlacementIcon from "../assets/PlacementTest.png";
import MessageIcon from "../assets/Message.png";
import ParticipantsBar from "../assets/TotParticipants.png";
import CourseBar from "../assets/addCourse.png";
import PracticeBar from "../assets/addPractice.png";
import SubscriberBar from "../assets/TotSubscriber.png";
import SubsIcon from "../assets/userSubs.png";
import { useAdminStats } from "../hooks/useAdminStats";

const sidebarItems = [
  { key: "dashboard",    label: "Dashboard",      path: "/Admin",              icon: DashboardIcon },
  { key: "course",       label: "Course",          path: "/CourseAdmin",        icon: CourseIcon },
  { key: "practice",     label: "Practice",        path: "/PracticeAdmin",      icon: PracticeIcon },
  { key: "participants", label: "Participants",    path: "/ParticipantsAdmin",  icon: ParticipantIcon },
  { key: "placement",    label: "Placement Test",  path: "/PlacementTestAdmin", icon: PlacementIcon },
  { key: "message",      label: "Message",         path: "/MessageAdmin",       icon: MessageIcon },
];

const levelColor = {
  Basic:        "bg-red-100 text-red-500",
  Intermediate: "bg-yellow-100 text-yellow-600",
  Proficient:   "bg-blue-100 text-blue-600",
  Advanced:     "bg-green-100 text-green-600",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const initials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const ParticipantsAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats: adminStats, loading: statsLoading, totalCourses } = useAdminStats();

  const statsCards = [
    { title: "Total Participants", value: statsLoading ? "…" : `${adminStats?.stats?.totalParticipants ?? 0}\nParticipants`, bg: "bg-[#fff1f1]", icon: ParticipantsBar },
    { title: "Total Courses",      value: `${totalCourses}\nCourses`,                                                         bg: "bg-[#eef5ff]", icon: CourseBar },
    { title: "Total Practice",     value: statsLoading ? "…" : `${adminStats?.stats?.totalPractice ?? 0}\nPractice`,         bg: "bg-[#fff3e5]", icon: PracticeBar },
    { title: "Total Subscriber",   value: statsLoading ? "…" : `${adminStats?.stats?.totalSubscribers ?? 0}\nSubscribers`,   bg: "bg-[#ecffe8]", icon: SubscriberBar },
  ];

  const [activeTab, setActiveTab] = useState("participants");
  const [allUsers,  setAllUsers]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectAll,            setSelectAll]            = useState(false);
  const [promoting,            setPromoting]            = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/participants`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setAllUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const participants = allUsers.filter((u) => !u.is_subscriber);
  const subscribers  = allUsers.filter((u) =>  u.is_subscriber);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(participants.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectParticipant = (id) => {
    const updated = selectedParticipants.includes(id)
      ? selectedParticipants.filter((x) => x !== id)
      : [...selectedParticipants, id];
    setSelectedParticipants(updated);
    setSelectAll(updated.length === participants.length);
  };

  const toggleSubscriberStatus = async (userId) => {
    await fetch(`${API_URL}/api/admin/subscribers/${userId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setAllUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, is_subscriber: !u.is_subscriber } : u)
    );
  };

  const handlePromoteSingle = async (userId) => {
    await toggleSubscriberStatus(userId);
    setSelectedParticipants((prev) => prev.filter((id) => id !== userId));
  };

  const handlePromoteBulk = async () => {
    if (!selectedParticipants.length) return;
    setPromoting(true);
    await Promise.all(selectedParticipants.map((id) =>
      fetch(`${API_URL}/api/admin/subscribers/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
    ));
    setAllUsers((prev) =>
      prev.map((u) =>
        selectedParticipants.includes(u.id) ? { ...u, is_subscriber: true } : u
      )
    );
    setSelectedParticipants([]);
    setSelectAll(false);
    setPromoting(false);
  };

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
                className={`w-full h-14 flex items-center justify-between px-4 rounded-lg transition
                  ${isActive ? "bg-red-600 text-white" : "bg-white text-black hover:bg-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  <img src={item.icon} alt={item.label} className="w-8 h-8 object-contain" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {(item.key === "course" || item.key === "practice") && (
                  <div className={`w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-10
                    ${isActive ? "border-l-white" : "border-l-gray-400"}`} />
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        {/* STATS */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className={`${card.bg} rounded-xl p-5 shadow-sm flex items-center justify-between`}>
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h2 className="text-xl font-bold mt-2 whitespace-pre-line">{card.value}</h2>
              </div>
              <button
                onClick={() => {
                  if (card.title === "Total Courses")  navigate("/CourseForm");
                  if (card.title === "Total Practice") navigate("/PracticeForm");
                }}
                className="w-13 h-13 bg-white rounded-xl shadow-sm flex items-center justify-center"
              >
                <img src={card.icon} alt={card.title} className="w-13 h-13 object-contain" />
              </button>
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">Participant Management</h1>
            <p className="text-gray-400 mt-1">Manage participants and subscribers</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/AnalysisAdmin")}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition"
            >
              View Analysis
            </button>

            <button
              onClick={handlePromoteBulk}
              disabled={!selectedParticipants.length || promoting}
              className={`px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition
                ${selectedParticipants.length
                  ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                  : "bg-green-200 text-green-400 cursor-not-allowed"}`}
            >
              <img src={SubsIcon} alt="subs" className="w-4 h-4" />
              {promoting ? "Promoting…" : `Promote to Subscribers (${selectedParticipants.length})`}
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("participants")}
            className={`px-5 py-2 rounded-lg text-sm font-medium ${activeTab === "participants" ? "bg-gray-200" : "bg-white"}`}
          >
            All Participants ({participants.length})
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-5 py-2 rounded-lg text-sm font-medium ${activeTab === "subscribers" ? "bg-gray-200" : "bg-white"}`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>

        {loading && (
          <p className="text-gray-400 text-center mt-12">Loading participants...</p>
        )}

        {/* ALL PARTICIPANTS */}
        {!loading && activeTab === "participants" && (
          <div className="bg-white rounded-2xl border p-6">

            {participants.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No participants yet.</p>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Select All</span>
                  <span className="text-xs text-gray-400">({selectedParticipants.length} selected)</span>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {participants.map((participant) => (
                    <div key={participant.id} className="border border-gray-300 rounded-xl p-4 relative">

                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(participant.id)}
                        onChange={() => handleSelectParticipant(participant.id)}
                        className="absolute top-3 right-3"
                      />

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-sm">
                          {initials(participant.username)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{participant.username}</h3>
                          <p className="text-xs text-gray-400">{participant.email}</p>
                        </div>
                      </div>

                      <p className="text-sm"><b>Joined:</b></p>
                      <p className="text-xs text-gray-500 mb-3">{formatDate(participant.created_at)}</p>

                      <p className="text-sm"><b>Last Active</b></p>
                      <p className="text-xs text-gray-500 mb-3">{formatDate(participant.last_login)}</p>

                      <div className="mb-4">
                        <span className="text-sm">Level: </span>
                        {participant.level ? (
                          <span className={`ml-1 px-3 py-1 rounded-full text-xs font-medium ${levelColor[participant.level] || "bg-gray-100 text-gray-600"}`}>
                            {participant.level}
                          </span>
                        ) : (
                          <span className="ml-1 text-xs text-gray-400">Not Tested</span>
                        )}
                      </div>

                      <button
                        onClick={() => handlePromoteSingle(participant.id)}
                        className="w-full bg-gray-200 hover:bg-green-100 hover:text-green-700 rounded-lg py-2 text-sm transition"
                      >
                        Promote
                      </button>

                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* SUBSCRIBERS */}
        {!loading && activeTab === "subscribers" && (
          <>
            {subscribers.length === 0 ? (
              <div className="bg-white rounded-2xl border p-6">
                <p className="text-gray-400 text-center py-12">No subscribers yet. Promote participants to add them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="bg-white border border-green-300 rounded-xl p-4">

                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-sm">
                          {initials(subscriber.username)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{subscriber.username}</h3>
                          <p className="text-xs text-gray-400">{subscriber.email}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs h-fit">
                        Subscriber
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
                      <div>
                        <p className="text-xs text-gray-400">Joined</p>
                        <p className="text-sm font-medium">{formatDate(subscriber.created_at)}</p>
                      </div>
                      <div className="ml-6">
                        <p className="text-xs text-gray-400">Last Active</p>
                        <p className="text-sm font-medium">{formatDate(subscriber.last_login)}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-sm">Level: </span>
                      {subscriber.level ? (
                        <span className={`ml-1 px-3 py-1 rounded-full text-xs font-medium ${levelColor[subscriber.level] || "bg-gray-100 text-gray-600"}`}>
                          {subscriber.level}
                        </span>
                      ) : (
                        <span className="ml-1 text-xs text-gray-400">Not Tested</span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleSubscriberStatus(subscriber.id)}
                      className="w-full mt-4 bg-green-100 hover:bg-red-100 text-green-700 hover:text-red-600 rounded-lg py-2 text-sm transition"
                    >
                      Remove Subscriber
                    </button>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default ParticipantsAdmin;
