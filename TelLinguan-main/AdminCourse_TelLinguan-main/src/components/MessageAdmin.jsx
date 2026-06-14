import { useState, useEffect, useCallback } from "react";
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
import { useAdminStats } from "../hooks/useAdminStats";

import Delete from "../assets/delM.png";
import Chat from "../assets/chat.png";

const API = `${API_URL}/api/admin`;
const ADMIN_HEADERS = { Authorization: "Bearer admin-token" };

const CATEGORY_COLOR = {
  "Zoom Classes":     "bg-blue-500",
  "On-site Teachers": "bg-green-500",
  "Others":           "bg-red-500",
};

const sidebarItems = [
  { key: "dashboard",    label: "Dashboard",     path: "/Admin",              icon: DashboardIcon },
  { key: "course",       label: "Course",         path: "/CourseAdmin",        icon: CourseIcon },
  { key: "practice",    label: "Practice",       path: "/PracticeAdmin",      icon: PracticeIcon },
  { key: "participants", label: "Participants",   path: "/ParticipantsAdmin",  icon: ParticipantIcon },
  { key: "placement",   label: "Placement Test", path: "/PlacementTestAdmin", icon: PlacementIcon },
  { key: "message",     label: "Message",        path: "/MessageAdmin",       icon: MessageIcon },
];

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const MessageAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats: adminStats, loading: statsLoading, totalCourses } = useAdminStats();

  const statsCards = [
    { title: "Total Participants", value: statsLoading ? "…" : `${adminStats?.stats?.totalParticipants ?? 0}\nParticipants`, bg: "bg-[#fff1f1]", icon: ParticipantsBar },
    { title: "Total Courses",      value: `${totalCourses}\nCourses`,                                                        bg: "bg-[#eef5ff]", icon: CourseBar },
    { title: "Total Practice",     value: statsLoading ? "…" : `${adminStats?.stats?.totalPractice ?? 0}\nPractice`,        bg: "bg-[#fff3e5]", icon: PracticeBar },
    { title: "Total Subscriber",   value: statsLoading ? "…" : `${adminStats?.stats?.totalSubscribers ?? 0}\nSubscribers`,  bg: "bg-[#ecffe8]", icon: SubscriberBar },
  ];

  const [messages,         setMessages]         = useState([]);
  const [selectedMessage,  setSelectedMessage]  = useState(null);
  const [searchTerm,       setSearchTerm]       = useState("");
  const [unreadCount,      setUnreadCount]      = useState(0);
  const [loadingMessages,  setLoadingMessages]  = useState(true);
  const [confirmDeleteId,  setConfirmDeleteId]  = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API}/messages`, { headers: ADMIN_HEADERS });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data);
      setUnreadCount(data.filter((m) => !m.is_read).length);
    } catch {
      // network error — keep existing messages
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);

    if (!msg.is_read) {
      try {
        await fetch(`${API}/messages/${msg.id}/read`, {
          method: "PATCH",
          headers: ADMIN_HEADERS,
        });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        );
        setSelectedMessage((prev) => prev ? { ...prev, is_read: true } : prev);
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // silent — UI already shows message
      }
    }
  };

  const toggleStar = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API}/messages/${id}/star`, {
        method: "PATCH",
        headers: ADMIN_HEADERS,
      });
      const data = await res.json();
      setMessages((prev) =>
        prev
          .map((m) => (m.id === id ? { ...m, is_starred: data.is_starred } : m))
          .sort((a, b) => Number(b.is_starred) - Number(a.is_starred))
      );
      setSelectedMessage((prev) =>
        prev?.id === id ? { ...prev, is_starred: data.is_starred } : prev
      );
    } catch {
      // silent
    }
  };

  const confirmDelete = (e, id) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    try {
      await fetch(`${API}/messages/${id}/delete`, {
        method: "PATCH",
        headers: ADMIN_HEADERS,
      });
      const remaining = messages.filter((m) => m.id !== id);
      setMessages(remaining);
      setUnreadCount(remaining.filter((m) => !m.is_read).length);
      if (selectedMessage?.id === id) {
        setSelectedMessage(remaining.length > 0 ? remaining[0] : null);
      }
    } catch {
      // silent
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const q = searchTerm.toLowerCase();
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.category.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* CONFIRM DELETE DIALOG */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl w-80">
            <h3 className="font-bold text-lg mb-2">Delete Message</h3>
            <p className="text-gray-500 text-sm mb-5">Are you sure you want to delete this message?</p>
            <div className="flex gap-3">
              <button
                onClick={executeDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 bg-gray-200 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">

        {/* ADMIN CARD */}
        <div className="bg-white text-black rounded-xl p-6 mb-8 text-center shadow-md">
          <h2 className="text-2xl font-bold text-[#b6252a]">Welcome Admin</h2>
          <p className="text-sm text-gray-500 mt-2">TelLinguan Dashboard</p>
        </div>

        {/* MENU */}
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

                {item.key === "message" && unreadCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}

                {(item.key === "course" || item.key === "practice") && (
                  <div
                    className={`w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-10
                      ${isActive ? "border-l-white" : "border-l-gray-400"}`}
                  />
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
            <div
              key={index}
              className={`${card.bg} rounded-xl p-5 shadow-sm flex items-center justify-between`}
            >
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
            <h1 className="text-3xl font-bold text-black">Message</h1>
            <p className="text-gray-400 mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
                : "All messages read"}
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-xl border border-gray-300 p-3 mb-4">
          <input
            type="text"
            placeholder="Search name, email, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* MESSAGE SECTION */}
        {loadingMessages ? (
          <div className="flex items-center justify-center py-20 text-gray-400">Loading messages…</div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            {searchTerm ? "No messages match your search." : "No messages yet."}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">

            {/* LEFT LIST */}
            <div className={`${selectedMessage ? "col-span-5" : "col-span-12"} space-y-3 transition-all`}>
              {filteredMessages.map((msg) => {
                const isUnread = !msg.is_read;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`
                      bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition
                      ${selectedMessage?.id === msg.id ? "border-red-500" : isUnread ? "border-blue-400" : "border-gray-200"}
                    `}
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-3 flex-1">

                        {/* AVATAR */}
                        <div className="w-11 h-11 rounded-full bg-[#b6252a] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {initials(msg.name)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`${isUnread ? "font-bold" : "font-semibold"}`}>
                              {msg.name}
                            </h3>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title="Unread" />
                            )}
                            <span className={`${CATEGORY_COLOR[msg.category] ?? "bg-gray-500"} text-white text-[10px] px-3 py-1 rounded-full`}>
                              {msg.category}
                            </span>
                          </div>

                          <div className="text-xs text-gray-500 truncate">{msg.email}</div>
                          <div className="text-xs text-gray-400 mb-2">{formatDate(msg.created_at)}</div>

                          <div className="flex items-start gap-2">
                            <img src={Chat} alt="" className="w-3 h-3 mt-1 flex-shrink-0" />
                            <p className="text-xs text-gray-500 line-clamp-2">{msg.message}</p>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-3 flex-shrink-0 ml-2">
                        <button onClick={(e) => toggleStar(e, msg.id)} title="Star">
                          <span className={`text-lg ${msg.is_starred ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                        </button>
                        <button onClick={(e) => confirmDelete(e, msg.id)} title="Delete">
                          <img src={Delete} alt="delete" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT DETAIL */}
            {selectedMessage && (
              <div className="col-span-7">
                <div className="bg-white border rounded-xl p-5 h-full">

                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`${CATEGORY_COLOR[selectedMessage.category] ?? "bg-gray-500"} text-white text-[10px] px-3 py-1 rounded-full`}>
                        {selectedMessage.category}
                      </span>
                    </div>
                    <button onClick={(e) => toggleStar(e, selectedMessage.id)} title="Star">
                      <span className={`text-lg ${selectedMessage.is_starred ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                    </button>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-lg">{selectedMessage.name}</h3>
                    <p className="text-gray-500 text-sm">{selectedMessage.email}</p>
                    <p className="text-gray-400 text-sm mt-1">{formatDate(selectedMessage.created_at)}</p>
                  </div>

                  <hr className="my-5" />

                  <div className="flex items-center gap-2 mb-3">
                    <img src={Chat} alt="" className="w-4 h-4" />
                    <span className="font-medium">Message</span>
                  </div>

                  <p className="text-gray-600 leading-7 whitespace-pre-wrap">{selectedMessage.message}</p>

                  <div className="flex gap-4 mt-12">
                    <button
                      onClick={() => {
                        const subject = encodeURIComponent(`Re: ${selectedMessage.category} — TelLinguan`);
                        const body = encodeURIComponent(
                          `Hello ${selectedMessage.name},\n\nThank you for contacting TelLinguan.\n\nWe have received your inquiry and will respond shortly.\n\nBest Regards,\nTelLinguan Team`
                        );
                        window.location.href = `mailto:${selectedMessage.email}?subject=${subject}&body=${body}`;
                      }}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition"
                    >
                      Reply via Email
                    </button>

                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="px-8 bg-gray-200 rounded-xl font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MessageAdmin;
