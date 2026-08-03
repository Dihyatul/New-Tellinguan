import { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import * as XLSX from "xlsx";

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
import View from "../assets/viewQ.png";
import Calender from "../assets/jmlC.png";
import DownloadIcon from "../assets/download.png";


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

const PracticeAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats: adminStats, loading: statsLoading, totalCourses } = useAdminStats();
  const statsCards = [
    { title: "Total Participants", value: statsLoading ? "…" : `${adminStats?.stats?.totalParticipants ?? 0}\nParticipants`, bg: "bg-[#fff1f1]", icon: ParticipantsBar },
    { title: "Total Courses",      value: `${totalCourses}\nCourses`,                                                        bg: "bg-[#eef5ff]", icon: CourseBar },
    { title: "Total Practice",     value: statsLoading ? "…" : `${adminStats?.stats?.totalPractice ?? 0}\nPractice`,        bg: "bg-[#fff3e5]", icon: PracticeBar },
    { title: "Total Subscriber",   value: statsLoading ? "…" : `${adminStats?.stats?.totalSubscribers ?? 0}\nSubscribers`,  bg: "bg-[#ecffe8]", icon: SubscriberBar },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [practices, setPractices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [activePracticeMenu, setActivePracticeMenu] =
    useState(location.state?.activeMenu || "manage");

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/practices`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/api/practices/schedules`).then(r => r.ok ? r.json() : []),
    ])
      .then(([practiceList, scheduleList]) => {
        setPractices(Array.isArray(practiceList) ? practiceList : []);
        setSchedules(Array.isArray(scheduleList) ? scheduleList : []);
      })
      .catch(() => {});
  }, []);

  const totalPractice = practices.length;

  const totalActive = practices.filter(
    (item) => item.status === true
  ).length;

  const totalDraft = practices.filter(
    (item) => item.status === false
  ).length;

  const filteredPractices = practices.filter((item) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "active" && item.status) ||
      (activeTab === "draft" && !item.status);

    const keyword = search.toLowerCase();

    const matchSearch =
      item.title.toLowerCase().includes(keyword) ||
      item.course.toLowerCase().includes(keyword) ||
      (item.category || "").toLowerCase().includes(keyword) ||
      (item.description || "").toLowerCase().includes(keyword);

    return matchTab && matchSearch;
  });

  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [selectedCourse,      setSelectedCourse]      = useState("");
  const [allParticipants,     setAllParticipants]     = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/participants`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setAllParticipants(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Build report rows from real test_results (only users who have taken the placement test)
  const reportData = allParticipants
    .filter((p) => p.score != null)
    .map((p) => {
      const total = p.total_questions ?? 30;
      const score = p.score ?? 0;
      return {
        id:          p.id,
        participant: p.username,
        email:       p.email,
        practice:    "Placement Test",
        course:      p.level ?? "-",
        score,
        answers:     `${score}/${total}`,
        time:        "-",
        completed:   p.last_login
          ? new Date(p.last_login).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
          : "-",
      };
    });

  const participants = [...new Set(reportData.map((item) => item.participant))];
  const courses      = [...new Set(reportData.map((item) => item.course))];

  const filteredData = reportData.filter((item) => {
    const participantMatch = !selectedParticipant || item.participant === selectedParticipant;
    const courseMatch      = !selectedCourse      || item.course      === selectedCourse;
    return participantMatch && courseMatch;
  });

  let chartData = [];

  if (selectedParticipant && !selectedCourse) {
    chartData = filteredData.map((item) => ({
      name: item.course,
      Score: item.score,
    }));
  }

  else if (!selectedParticipant && selectedCourse) {
    chartData = filteredData.map((item) => ({
      name: item.participant,
      Score: item.score,
    }));
  }

  else if (selectedParticipant && selectedCourse) {
    chartData = filteredData.map((item) => ({
      name: item.practice,
      Score: item.score,
    }));
  }

  else {
    const grouped = {};

    filteredData.forEach((item) => {
      if (!grouped[item.practice]) {
        grouped[item.practice] = {
          name: item.practice,
        };
      }

      grouped[item.practice][item.participant] =
        item.score;
    });

    chartData = Object.values(grouped);
  }

  const [showParticipantDropdown, setShowParticipantDropdown] =
    useState(false);

  const [showCourseDropdown, setShowCourseDropdown] =
    useState(false);

  const exportToExcel = () => {
    const excelData = filteredData.map((item) => ({
      Participant: item.participant,
      Practice: item.practice,
      Course: item.course,
      Score: item.score,
      Answers: item.answers,
      Time: item.time,
      Completed: item.completed,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Results"
    );

    XLSX.writeFile(
      workbook,
      `Results_Analytics_${new Date()
        .toISOString()
        .split("T")[0]}.xlsx`
    );
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
              <div key={item.key}>

                {/* MAIN MENU */}
                <button
                  onClick={() => navigate(item.path)}
                  className={`
                    w-full h-14 rounded-xl px-4
                    flex items-center justify-between
                    transition-all duration-200 shadow-sm
                    ${isActive
                      ? "bg-red-500 text-white"
                      : "bg-white text-black hover:bg-gray-100"
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

                  {(item.key === "course" ||
                    item.key === "practice") && (
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

                {/* SUB MENU PRACTICE */}
                {item.key === "practice" && isActive && (

                  <div className="ml-10 mt-3 space-y-2">

                    <button
                      onClick={() => setActivePracticeMenu("manage")}
                      className={`
                        w-full h-14 rounded-xl px-4
                        flex items-center
                        text-sm font-semibold
                        transition-all duration-200
                        ${activePracticeMenu === "manage"
                          ? "bg-[#ed1e28bf] text-white"
                          : "text-white hover:bg-[#ffffff10]"
                        }
                      `}
                    >
                      Manage Practice
                    </button>

                    <button
                      onClick={() => setActivePracticeMenu("schedule")}
                      className={`
                        w-full h-14 rounded-xl px-4
                        flex items-center
                        text-sm font-semibold
                        transition-all duration-200
                        ${activePracticeMenu === "schedule"
                          ? "bg-[#ed1e28bf] text-white"
                          : "text-white hover:bg-[#ffffff10]"
                        }
                      `}
                    >
                      Schedule
                    </button>

                    <button
                      onClick={() => setActivePracticeMenu("results")}
                      className={`
                        w-full h-14 rounded-xl px-4
                        flex items-center
                        text-sm font-semibold
                        transition-all duration-200
                        ${activePracticeMenu === "results"
                          ? "bg-[#ed1e28bf] text-white"
                          : "text-white hover:bg-[#ffffff10]"
                        }
                      `}
                    >
                      Results & Analytics
                    </button>
                  </div>

                )}

              </div>
            );
          })}

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        {/* MANAGE PRACTICE */}
        {activePracticeMenu === "manage" && (
          <>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-5 mb-8">

              {statsCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.bg} rounded-xl p-5 shadow-sm flex items-center justify-between`}
                >

                  <div>

                    <p className="text-gray-500 text-sm">
                      {card.title}
                    </p>

                    <h2 className="text-xl font-bold mt-2 whitespace-pre-line">
                      {card.value}
                    </h2>

                  </div>

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
                  Practice Management
                </h1>

                <p className="text-gray-400 mt-1">
                  Create and manage your practice sessions
                </p>

              </div>

              <button
                onClick={() => navigate("/PracticeForm")}
                className="bg-[#ed1e28] hover:bg-red-700 transition text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >

                <span className="text-lg">+</span>

                Add New Practice

              </button>

            </div>


            {/* OVERVIEW */}
            <div className="grid grid-cols-3 gap-5 mb-8 max-w-2xl">

              <div className="bg-white rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs">
                  Total Practice
                </p>

                <h3 className="text-lg font-semibold mt-1">
                  {totalPractice}
                </h3>

                <span className="text-sm font-medium">
                  All Course
                </span>
              </div>


              <div className="bg-white rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs">
                  Total Practice Active
                </p>

                <h3 className="text-lg font-semibold mt-1">
                  {totalActive}
                </h3>

                <span className="text-sm font-medium">
                  Ongoing
                </span>
              </div>


              <div className="bg-white rounded-xl px-4 py-3">
                <p className="text-gray-500 text-xs">
                  Total Draft Practice
                </p>

                <h3 className="text-lg font-semibold mt-1">
                  {totalDraft}
                </h3>

                <span className="text-sm font-medium">
                  Not yet Published
                </span>
              </div>

            </div>

            {/* FILTER */}
            <div className="flex justify-between items-center mb-5">

              <div className="flex gap-6 border-b">

                {["all", "active", "draft"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 capitalize font-medium ${activeTab === tab
                      ? "border-b-2 border-red-600 text-red-600"
                      : "text-gray-400"
                      }`}
                  >
                    {tab}
                  </button>
                ))}

              </div>

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
              w-80
              px-4 py-3
              border
              rounded-xl
              outline-none
              focus:ring-2
              focus:ring-red-200
            "
              />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr className="text-gray-600 text-xs">
                    <th className="py-3 px-4 text-center font-medium">
                      Practice Name
                    </th>
                    <th className="py-3 px-4 text-center font-medium">
                      Course
                    </th>
                    <th className="py-3 px-4 text-center font-medium">
                      Category
                    </th>
                    <th className="py-3 px-4 text-center font-medium">
                      Description
                    </th>
                    <th className="py-3 px-4 text-center font-medium">
                      Status
                    </th>
                    <th className="py-3 px-4 text-center font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {
                    filteredPractices.map((item, index) => (
                      <tr
                        key={index}
                        className="
                          border-t
                          hover:bg-gray-50
                          text-gray-600
                        "
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-700 text-xs">
                            {item.title}
                          </p>
                        </td>
                        <td className="text-center text-xs">
                          {item.course}
                        </td>
                        <td className="text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                            item.category === "Grammar"   ? "bg-blue-100 text-blue-600"  :
                            item.category === "Reading"   ? "bg-green-100 text-green-600" :
                            item.category === "Listening" ? "bg-[#FFE8C2] text-[#FE8412]" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {item.category || "-"}
                          </span>
                        </td>
                        <td className="px-4 text-center text-xs text-gray-500">
                          {item.description
                            ? item.description.slice(0, 55) + (item.description.length > 55 ? "…" : "")
                            : "-"}
                        </td>
                        <td className="text-center">
                          <span
                            className={`
                          px-4 py-1
                          rounded-full
                          text-[11px]
                          font-medium

                        ${item.status
                                ?
                                "bg-red-100 text-red-600"
                                :
                                "bg-gray-200 text-gray-600"
                              }

                        `}
                          >
                            {
                              item.status
                                ?
                                "Active"
                                :
                                "Draft"
                            }
                          </span>
                        </td>
                        <td>
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                navigate("/PracticeForm", {
                                  state: {
                                    practice: item,
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
                                className="w-3.5 h-3.5"
                              />
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Delete "${item.title}"?`)) return;
                                const r = await fetch(`${API_URL}/api/practices/${item.id}`, { method: "DELETE" });
                                if (r.ok) setPractices((prev) => prev.filter((p) => p.id !== item.id));
                                else alert("Failed to delete practice.");
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
                                className="w-3.5 h-3.5"
                              />
                            </button>
                            <button
                              onClick={() => navigate(`/ViewPracticeAdmin/${index}`)}
                              className="
                            w-7 h-7
                            rounded-md
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-200
                          "
                            >

                              <img
                                src={View}
                                className="w-3.5 h-3.5"
                              />

                            </button>
                          </div>
                        </td>
                      </tr>

                    ))
                  }
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* SCHEDULE PRACTICE */}
        {activePracticeMenu === "schedule" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-4 gap-5 mb-8">

              {statsCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.bg} rounded-xl p-5 shadow-sm flex items-center justify-between`}
                >

                  <div>

                    <p className="text-gray-500 text-sm">
                      {card.title}
                    </p>

                    <h2 className="text-xl font-bold mt-2 whitespace-pre-line">
                      {card.value}
                    </h2>

                  </div>

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
                  Schedule
                </h1>

                <p className="text-gray-400 mt-1">
                  Set practice schedules and deadlines
                </p>

              </div>

              <button
                onClick={() => navigate("/ScheduleForm")}
                className="bg-[#ed1e28] hover:bg-red-700 transition text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >

                <span className="text-lg">+</span>

                Add New Schedule

              </button>

            </div>

            {/* SCHEDULE LIST */}
            <div className="space-y-5">

              {schedules.map((schedule) => {
                const practice = practices.find(
                  (item) => item.id === schedule.practiceId
                );

                return (
                  <div
                    key={schedule.id}
                    className="bg-white border border-gray-200 rounded-xl px-6 py-5 flex justify-between items-start shadow-sm"
                  >

                    {/* LEFT */}
                    <div className="flex gap-4">

                      <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                        <img
                          src={Calender}
                          alt="Calendar"
                          className="w-5 h-5"
                        />
                      </div>

                      <div>

                        <h3 className="text-xl font-semibold text-gray-700 mb-4">
                          {practice?.title}
                        </h3>

                        <div className="flex gap-28">

                          {/* DATE */}
                          <div>
                            <p className="text-xs text-gray-400 mb-1">
                              Date & Time
                            </p>

                            <p className="text-sm text-gray-700">
                              {new Date(schedule.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {schedule.startTime} - {schedule.endTime}
                            </p>
                          </div>

                          {/* PARTICIPANT */}
                          <div>
                            <p className="text-xs text-gray-400 mb-1">
                              Participant
                            </p>

                            <p className="text-sm text-gray-700">
                              {schedule.participant}
                            </p>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* ACTION */}
                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          navigate("/ScheduleForm", {
                            state: {
                              schedule,
                            },
                          })
                        }
                        className="w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100"
                      >
                        <img
                          src={Edit}
                          alt="Edit"
                          className="w-4 h-4"
                        />
                      </button>

                      <button
                        onClick={async () => {
                          if (!window.confirm(`Delete schedule for ${schedule.participant}?`)) return;
                          const r = await fetch(`${API_URL}/api/practices/schedules/${schedule.id}`, { method: "DELETE" });
                          if (r.ok) setSchedules((prev) => prev.filter((item) => item.id !== schedule.id));
                          else alert("Failed to delete schedule.");
                        }}
                        className="
    w-9 h-9
    rounded-lg
    bg-red-100
    flex
    items-center
    justify-center
    hover:bg-red-200
  "
                      >
                        <img
                          src={Delete}
                          alt="Delete"
                          className="w-4 h-4"
                        />
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          </>
        )}

        {/* RESULTS & ANALYTICS */}
        {activePracticeMenu === "results" && (
          <>
            {/* STATS */}
            <div className="grid grid-cols-4 gap-5 mb-8">

              {statsCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.bg} rounded-xl p-5 shadow-sm flex items-center justify-between`}
                >

                  <div>

                    <p className="text-gray-500 text-sm">
                      {card.title}
                    </p>

                    <h2 className="text-xl font-bold mt-2 whitespace-pre-line">
                      {card.value}
                    </h2>

                  </div>

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
                  Results & Analytics
                </h1>

                <p className="text-gray-400 mt-1">
                  View student performance and download reports
                </p>

              </div>

              <button
                onClick={exportToExcel}
                className="
    bg-red-500
    hover:bg-red-600
    text-white
    px-5 py-3
    rounded-lg
    font-medium
    flex items-center gap-2
    transition
  "
              >
                <img
                  src={DownloadIcon}
                  alt="download"
                  className="w-4 h-4"
                />

                Download Excel
              </button>

            </div>

            {/* FILTER */}
            <div className="flex gap-4 mb-6">

              {/* PARTICIPANT */}
              <div className="relative w-64">

                <button
                  type="button"
                  onClick={() =>
                    setShowParticipantDropdown(
                      !showParticipantDropdown
                    )
                  }
                  className="
        w-full h-14
        border border-gray-300
        rounded-xl
        px-5
        flex items-center justify-between
        bg-white
      "
                >

                  <span
                    className={
                      selectedParticipant
                        ? "text-black"
                        : "text-gray-400"
                    }
                  >
                    {selectedParticipant ||
                      "Select Participant"}
                  </span>

                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showParticipantDropdown
                      ? "rotate-180"
                      : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>

                </button>

                {showParticipantDropdown && (

                  <div
                    className="
          absolute z-50
          mt-2
          w-full
          bg-white
          border border-gray-300
          rounded-xl
          shadow-lg
          max-h-60
          overflow-y-auto
        "
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedParticipant("");
                        setShowParticipantDropdown(false);
                      }}
                      className="
            w-full
            text-left
            px-5 py-3
            hover:bg-gray-100
            border-b
          "
                    >
                      All Participants
                    </button>

                    {participants.map((participant) => (

                      <button
                        key={participant}
                        type="button"
                        onClick={() => {
                          setSelectedParticipant(
                            participant
                          );
                          setShowParticipantDropdown(
                            false
                          );
                        }}
                        className="
              w-full
              text-left
              px-5 py-3
              hover:bg-gray-100
              border-b last:border-b-0
            "
                      >
                        {participant}
                      </button>

                    ))}

                  </div>

                )}

              </div>

              {/* COURSE */}
              <div className="relative w-64">

                <button
                  type="button"
                  onClick={() =>
                    setShowCourseDropdown(
                      !showCourseDropdown
                    )
                  }
                  className="
        w-full h-14
        border border-gray-300
        rounded-xl
        px-5
        flex items-center justify-between
        bg-white
      "
                >

                  <span
                    className={
                      selectedCourse
                        ? "text-black"
                        : "text-gray-400"
                    }
                  >
                    {selectedCourse ||
                      "Select Course"}
                  </span>

                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showCourseDropdown
                      ? "rotate-180"
                      : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>

                </button>

                {showCourseDropdown && (

                  <div
                    className="
          absolute z-50
          mt-2
          w-full
          bg-white
          border border-gray-300
          rounded-xl
          shadow-lg
          max-h-60
          overflow-y-auto
        "
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCourse("");
                        setShowCourseDropdown(false);
                      }}
                      className="
            w-full
            text-left
            px-5 py-3
            hover:bg-gray-100
            border-b
          "
                    >
                      All Courses
                    </button>

                    {courses.map((course) => (

                      <button
                        key={course}
                        type="button"
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowCourseDropdown(false);
                        }}
                        className="
              w-full
              text-left
              px-5 py-3
              hover:bg-gray-100
              border-b last:border-b-0
            "
                      >
                        {course}
                      </button>

                    ))}

                  </div>

                )}

              </div>

            </div>

            {/* CHART */}
            <div className="bg-white border rounded-xl p-5 mb-8">

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <LineChart data={chartData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis domain={[0, 100]} />

                  <Tooltip />

                  <Legend />

                  {selectedParticipant ||
                    selectedCourse ? (
                    <Line
                      type="monotone"
                      dataKey="Score"
                      stroke="#6366F1"
                      strokeWidth={3}
                    />
                  ) : (
                    participants.map((participant, index) => {
                      const colors = [
                        "#6366F1",
                        "#06B6D4",
                        "#EF4444",
                        "#22C55E",
                        "#F59E0B",
                      ];

                      return (
                        <Line
                          key={participant}
                          type="monotone"
                          dataKey={participant}
                          stroke={
                            colors[index % colors.length]
                          }
                          strokeWidth={3}
                        />
                      );
                    })
                  )}

                </LineChart>
              </ResponsiveContainer>

            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

              <table className="w-full text-sm">

                <thead className="bg-gray-100">

                  <tr className="text-gray-600 text-xs">

                    <th className="py-3 px-4 text-center font-medium">
                      Participant
                    </th>

                    <th className="py-3 px-4 text-center font-medium">
                      Practice
                    </th>

                    <th className="py-3 px-4 text-center font-medium">
                      Course
                    </th>

                    <th className="py-3 px-4 text-center font-medium">
                      Score
                    </th>

                    <th className="py-3 px-4 text-center font-medium">
                      Answers
                    </th>

                    <th className="py-3 px-4 text-center font-medium">
                      Time
                    </th>

                    <th className="py-3 px-4 text-center font-medium">
                      Completed
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredData.map((item, index) => (

                    <tr
                      key={index}
                      className="
                        border-t
                        hover:bg-gray-50
                        text-gray-600
                      "
                    >

                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-700 text-xs">
                          {item.participant}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.practice}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.course}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.score}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.answers}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.time}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.completed}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default PracticeAdmin;

