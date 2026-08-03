import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../config.js";

const resolveAudioUrl = (url) => {
  if (!url) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  return url;
};
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

import Edit from "../assets/edit.png";
import Delete from "../assets/delM.png";
import lock from "../assets/locked.png";
import unlock from "../assets/unlocked.png";
import Import from "../assets/import.png";
import viewD from "../assets/viewD.png";

const sidebarItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/Admin",
    icon: DashboardIcon,
  },
  {
    key: "course",
    label: "Course",
    path: "/CourseAdmin",
    icon: CourseIcon,
  },
  {
    key: "practice",
    label: "Practice",
    path: "/PracticeAdmin",
    icon: PracticeIcon,
  },
  {
    key: "participants",
    label: "Participants",
    path: "/ParticipantsAdmin",
    icon: ParticipantIcon,
  },
  {
    key: "placement",
    label: "Placement Test",
    path: "/PlacementTestAdmin",
    icon: PlacementIcon,
  },
  {
    key: "message",
    label: "Message",
    path: "/MessageAdmin",
    icon: MessageIcon,
  },
];

const PlacementTestAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats: adminStats, loading: statsLoading, totalCourses } = useAdminStats();
  const statsCards = [
    { title: "Total Participants", value: statsLoading ? "…" : `${adminStats?.stats?.totalParticipants ?? 0}\nParticipants`, bg: "bg-[#fff1f1]", icon: ParticipantsBar },
    { title: "Total Courses",      value: `${totalCourses}\nCourses`,                                                        bg: "bg-[#eef5ff]", icon: CourseBar },
    { title: "Total Practice",     value: statsLoading ? "…" : `${adminStats?.stats?.totalPractice ?? 0}\nPractice`,        bg: "bg-[#fff3e5]", icon: PracticeBar },
    { title: "Total Subscriber",   value: statsLoading ? "…" : `${adminStats?.stats?.totalSubscribers ?? 0}\nSubscribers`,  bg: "bg-[#ecffe8]", icon: SubscriberBar },
  ];

  const [activeTab, setActiveTab] = useState("reading");
  const [search, setSearch] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/questions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setQuestionList(Array.isArray(data) ? data : []);
    } catch {
      setQuestionList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const filteredQuestions = questionList.filter((item) => {
    const matchType = item.type === activeTab;
    const matchSearch = item.question.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const totalReading   = questionList.filter((q) => q.type === "reading").length;
  const totalListening = questionList.filter((q) => q.type === "listening").length;
  const totalGrammar   = questionList.filter((q) => q.type === "grammar").length;

  const handleToggleQuestion = (id) => {
    setQuestionList((prev) =>
      prev.map((item) => item.id === id ? { ...item, active: !item.active } : item)
    );
  };

  const getCefrColor = (cefr) => {
    switch (cefr) {
      case "A1":
        return "text-[#ff3b3b]";

      case "A2":
        return "text-[#f28c28]";

      case "B1":
        return "text-[#3cc65a]";

      case "B2":
        return "text-[#19b5d8]";

      case "C1":
        return "text-[#c23be6]";

      case "C2":
        return "text-[#7e57c2]";

      default:
        return "text-gray-500";
    }
  };


  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">

        {/* ADMIN CARD */}
        <div className="bg-white text-black rounded-xl p-6 mb-8 text-center shadow-md">
          <h2 className="text-2xl font-bold text-[#b6252a]">
            Welcome Admin
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            TelLinguan Dashboard
          </p>
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
                                    ${isActive
                    ? "bg-red-600 text-white"
                    : "bg-white text-black hover:bg-gray-200"
                  }
                                    `}
              >

                <div className="flex items-center gap-3">

                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-8 h-8 object-contain"
                  />

                  <span className="font-medium">
                    {item.label}
                  </span>

                </div>

                {(item.key === "course" || item.key === "practice") && (
                  <div
                    className={`
                          w-0 h-0
                          border-t-[7px]
                          border-t-transparent
                          border-b-[7px]
                          border-b-transparent
                          border-l-10
                          ${isActive
                        ? "border-l-white"
                        : "border-l-gray-400"
                      }
                        `}
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

              {/* LEFT */}
              <div>

                <p className="text-gray-500 text-sm">
                  {card.title}
                </p>

                <h2 className="text-xl font-bold mt-2 whitespace-pre-line">
                  {card.value}
                </h2>

              </div>

              {/* RIGHT ICON */}
              <button
                onClick={() => {
                  if (card.title === "Total Courses") {
                    navigate("/CourseForm");
                  }

                  if (card.title === "Total Practice") {
                    navigate("/PracticeForm");
                  }
                }}
                className="w-13 h-13 bg-white rounded-xl shadow-sm flex items-center justify-center"
              >

                <img
                  src={card.icon}
                  alt={card.title}
                  className="w-13 h-13 object-contain"
                />

              </button>
            </div>
          ))}
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold text-black">
              Placement Test
            </h1>

            <p className="text-gray-400 mt-1">
              Set questions for placement test
            </p>

          </div>

          <div className="flex items-center gap-3">

            {/* CLEAR ALL QUESTIONS */}
            <button
              onClick={async () => {
                if (!window.confirm("Delete ALL questions from the database? This cannot be undone.")) return;
                try {
                  await fetch(`${API_URL}/api/questions/all`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  });
                  setQuestionList([]);
                } catch {
                  alert("Failed to clear questions.");
                }
              }}
              className="bg-white border border-red-300 hover:bg-red-50 text-red-600 transition px-5 py-3 rounded-xl font-medium flex items-center gap-2"
            >
              Clear All Questions
            </button>

            {/* IMPORT EXCEL */}
            <button
              onClick={() =>
                navigate("/QuestionForm", {
                  state: {
                    importMode: true,
                  },
                })
              }
              className="
                bg-white
                border
                border-gray-300
                hover:bg-gray-50
                transition
                px-5
                py-3
                rounded-xl
                font-medium
                flex
                items-center
                gap-2
                text-gray-700
              "
            >
              <img
                src={Import}
                alt="Import"
                className="w-4 h-4"
              />

              Import Excel
            </button>

            {/* VIEW DATA NILAI */}
            <button
              onClick={() => navigate("/ViewNilaiPlacement")}
              className="
                bg-[#ed1e28]
                hover:bg-red-700
                transition
                text-white
                px-5
                py-3
                rounded-xl
                font-medium
                flex
                items-center
                gap-2
              "
            >
              <img
                src={viewD}
                alt="View Data"
                className="w-4 h-4"
              />

              View Data Nilai
            </button>

            {/* ADD QUESTION */}
            <button
              onClick={() => navigate("/QuestionForm")}
              className="
                bg-[#ed1e28]
                hover:bg-red-700
                transition
                text-white
                px-6
                py-3
                rounded-xl
                font-medium
                flex
                items-center
                gap-2
              "
            >
              <span className="text-lg">+</span>

              Add New Question
            </button>

          </div>

        </div>

        {/* OVERVIEW */}
        <div className="grid grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
            <p className="text-gray-500 text-xs">
              Total Questions
            </p>

            <h3 className="text-lg font-semibold mt-1">
              {questionList.length}
            </h3>

            <span className="text-sm font-medium">
              All Questions
            </span>
          </div>

          <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
            <p className="text-gray-500 text-xs">
              Reading Questions
            </p>

            <h3 className="text-lg font-semibold mt-1">
              {totalReading}
            </h3>

            <span className="text-sm font-medium">
              Reading Section
            </span>
          </div>

          <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
            <p className="text-gray-500 text-xs">
              Listening Questions
            </p>

            <h3 className="text-lg font-semibold mt-1">
              {totalListening}
            </h3>

            <span className="text-sm font-medium">
              Audio Section
            </span>
          </div>

          <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
            <p className="text-gray-500 text-xs">
              Grammar Questions
            </p>

            <h3 className="text-lg font-semibold mt-1">
              {totalGrammar}
            </h3>

            <span className="text-sm font-medium">
              Language Structure
            </span>
          </div>

        </div>

        <div className="flex justify-between items-center mb-6">

          <div className="flex gap-6">

            <button
              onClick={() => setActiveTab("reading")}
              className={`pb-2 border-b-2 ${activeTab === "reading"
                ? "border-red-500 text-red-500"
                : "border-transparent"
                }`}
            >
              Reading
            </button>

            <button
              onClick={() => setActiveTab("listening")}
              className={`pb-2 border-b-2 ${activeTab === "listening"
                ? "border-red-500 text-red-500"
                : "border-transparent"
                }`}
            >
              Listening
            </button>

            <button
              onClick={() => setActiveTab("grammar")}
              className={`pb-2 border-b-2 ${activeTab === "grammar"
                ? "border-red-500 text-red-500"
                : "border-transparent"
                }`}
            >
              Grammar
            </button>

          </div>

          <input
            type="text"
            placeholder="search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border border-gray-300 rounded-xl px-4 py-2 w-72"
          />

        </div>

        <div className="space-y-6">

          {filteredQuestions.map((item) => (

            <div
              key={item.id}
              className="bg-white border border-gray-300 rounded-xl p-6"
            >

              <div className="flex justify-between mb-4">

                <div>

                  <h2
                    className={`font-bold text-xl ${getCefrColor(
                      item.cefr
                    )}`}
                  >
                    {item.cefr}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {item.focus}
                  </p>

                </div>

                <div className="flex justify-center gap-2">

                  {/* EDIT */}
                  <button
                    onClick={() =>
                      navigate("/QuestionForm", {
                        state: {
                          question: item,
                          editMode: true,
                        },
                      })
                    }
                    className="
                      w-7 h-7
                      rounded-md
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      hover:bg-gray-200
                    "
                  >
                    <img
                      src={Edit}
                      alt="edit"
                      className="w-3.5 h-3.5"
                    />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={async () => {
                      if (!window.confirm(`Delete Question ${item.id}?`)) return;
                      try {
                        await fetch(`${API_URL}/api/questions/${item.id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        });
                      } catch {}
                      setQuestionList((prev) => prev.filter((q) => q.id !== item.id));
                    }}
                    className="
                      w-7 h-7
                      rounded-md
                      bg-red-100
                      flex
                      items-center
                      justify-center
                      hover:bg-red-200
                    "
                  >
                    <img
                      src={Delete}
                      alt="delete"
                      className="w-3.5 h-3.5"
                    />
                  </button>

                  {/* ACTIVE / INACTIVE */}
                  <button
                    onClick={() =>
                      handleToggleQuestion(item.id)
                    }
                    className={`
    w-7 h-7
    rounded-md
    flex
    items-center
    justify-center
    ${item.active
                        ? "bg-green-100 hover:bg-green-200"
                        : "bg-red-100 hover:bg-red-200"
                      }
  `}
                  >
                    <img
                      src={item.active ? unlock : lock}
                      alt={item.active ? "Unlocked" : "Locked"}
                      className="w-3.5 h-3.5"
                    />
                  </button>

                </div>

              </div>

              {/* READING */}
              {item.type === "reading" && (
                <>
                  {item.passages.map(
                    (paragraph, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 rounded-lg p-4 mb-3"
                      >
                        <h4 className="text-blue-500 text-sm mb-2">
                          Paragraph {index + 1}
                        </h4>

                        <p className="text-sm text-gray-600">
                          {paragraph}
                        </p>
                      </div>
                    )
                  )}
                </>
              )}

              {/* LISTENING */}
              {item.type === "listening" && (
                item.audio_url
                  ? <audio controls className="w-full mb-4"><source src={resolveAudioUrl(item.audio_url)} /></audio>
                  : <p className="text-sm text-gray-400 mb-4 italic">No audio file attached</p>
              )}

              {/* QUESTION */}
              <h3 className="font-semibold text-lg mb-4">
                {item.question}
              </h3>

              <div className="space-y-3">

                {item.options.map(
                  (option, index) => (
                    <div
                      key={index}
                      className={`border border-gray-300 rounded-lg p-3 ${index === item.answer
                        ? "bg-green-100 border-green-500"
                        : ""
                        }`}
                    >

                      <div className="flex items-center gap-3">

                        <input
                          type="radio"
                          checked={
                            index === item.answer
                          }
                          readOnly
                        />

                        <span>{option}</span>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          ))}

        </div>
      </main>
    </div>
  );
};

export default PlacementTestAdmin;