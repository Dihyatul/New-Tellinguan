import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MonthlyGrowthChart from "./MonthlyGrowthChart";
import ParticipantLevelChart from "./ParticipantChart";

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

const statsCards = [
  {
    title: "Total Participants",
    value: "200\nParticipants",
    bg: "bg-[#fff1f1]",
    icon: ParticipantsBar,
  },
  {
    title: "Total Courses",
    value: "63\nCourses",
    bg: "bg-[#eef5ff]",
    icon: CourseBar,
  },
  {
    title: "Total Practice",
    value: "100\nPractice",
    bg: "bg-[#fff3e5]",
    icon: PracticeBar,
  },
  {
    title: "Total Subscriber",
    value: "53\nSubscribers",
    bg: "bg-[#ecffe8]",
    icon: SubscriberBar,
  },
];

const ParticipantsAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] =
    useState("participants");

  const [selectedParticipants, setSelectedParticipants] =
    useState([]);

  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "Jenny Desi",
      email: "jennydesi@gmail.com",
      joined: "12-April-2026",
      lastActive: "21-April-2026",
      level: "Good",
    },

    {
      id: 2,
      name: "Aqila Kristy",
      email: "aqila.kristy@gmail.com",
      joined: "12-April-2026",
      lastActive: "21-April-2026",
      level: "Poor",
    },

    {
      id: 3,
      name: "Sarah Smith",
      email: "sarahsmith@gmail.com",
      joined: "12-April-2026",
      lastActive: "21-April-2026",
      level: "Excellent",
    },

    {
      id: 4,
      name: "Jeremy",
      email: "jeremy@gmail.com",
      joined: "12-April-2026",
      lastActive: "21-April-2026",
      level: "Acceptable",
    },

    {
      id: 5,
      name: "Jenny Desi",
      email: "jennydesi2@gmail.com",
      joined: "12-April-2026",
      lastActive: "21-April-2026",
      level: "Good",
    },
  ]);

  const [subscribers, setSubscribers] =
    useState([]);

  const handlePromoteSubscribers = () => {
    const promoted = participants.filter((item) =>
      selectedParticipants.includes(item.id)
    );

    const updatedParticipants = participants.filter(
      (item) =>
        !selectedParticipants.includes(item.id)
    );

    setSubscribers((prev) => [
      ...prev,
      ...promoted.map((item) => ({
        ...item,
        active: true,
        courses: ["Grammar 1", "Reading 1"],
      })),
    ]);

    setParticipants(updatedParticipants);

    setSelectedParticipants([]);

    setSelectAll(false);

  };

  const [selectAll, setSelectAll] = useState(false);
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(
        participants.map((item) => item.id)
      );
    }

    setSelectAll(!selectAll);
  };

  const handleSelectParticipant = (id) => {
    const updated = selectedParticipants.includes(id)
      ? selectedParticipants.filter(
        (item) => item !== id
      )
      : [...selectedParticipants, id];

    setSelectedParticipants(updated);

    setSelectAll(
      updated.length === participants.length
    );
  };

  const handlePromoteSingle = (participantId) => {
    const participant = participants.find(
      (item) => item.id === participantId
    );

    if (!participant) return;

    setSubscribers((prev) => [
      ...prev,
      {
        ...participant,
        active: true,
        courses: ["Grammar 1", "Reading 1"],
      },
    ]);

    setParticipants((prev) =>
      prev.filter(
        (item) => item.id !== participantId
      )
    );

    setSelectedParticipants((prev) =>
      prev.filter((id) => id !== participantId)
    );

    setSelectAll(false);

    setSelectedParticipants((prev) =>
      prev.filter((id) => id !== participantId)
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
              Course Management
            </h1>

            <p className="text-gray-400 mt-1">
              Create and manage your courses
            </p>

          </div>

          <button
            onClick={() => navigate("/AnalysisAdmin")}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition"
          >
            View Analysis
          </button>

          <button
            className="
    bg-green-500
    text-white
    px-5 py-3
    rounded-lg
    font-medium
    flex items-center gap-2
    cursor-default
  "
          >
            <img
              src={SubsIcon}
              alt="subs"
              className="w-4 h-4"
            />

            Promote to Subscribers
            ({selectedParticipants.length})
          </button>

        </div>

        <div className="flex gap-3 mb-6">

          <button
            onClick={() =>
              setActiveTab("participants")
            }
            className={`px-5 py-2 rounded-lg text-sm font-medium ${activeTab === "participants"
              ? "bg-gray-200"
              : "bg-white"
              }`}
          >
            All Participants
          </button>

          <button
            onClick={() =>
              setActiveTab("subscribers")
            }
            className={`px-5 py-2 rounded-lg text-sm font-medium ${activeTab === "subscribers"
              ? "bg-gray-200"
              : "bg-white"
              }`}
          >
            Subscribers Participants
          </button>

        </div>

        {activeTab === "participants" && (

          <div className="bg-white rounded-2xl border p-6">

            <div
              className="
  flex items-center
  gap-3
  mb-6
  px-4 py-3
  bg-gray-50
  border border-gray-300
  rounded-xl
"
            >

              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4"
              />

              <span className="text-sm font-medium">
                Select All
              </span>

              <span className="text-xs text-gray-400">
                ({selectedParticipants.length} selected)
              </span>

            </div>

            <div className="grid grid-cols-3 gap-6">

              {participants.map((participant) => (

                <div
                  key={participant.id}
                  className="
  border border-gray-300
  rounded-xl
  p-4
  relative
"
                >

                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(
                      participant.id
                    )}
                    onChange={() =>
                      handleSelectParticipant(
                        participant.id
                      )
                    }
                    className="
              absolute
              top-3
              right-3
            "
                  />

                  <div className="flex items-center gap-3 mb-4">

                    <div
                      className="
                w-10 h-10
                rounded-full
                bg-red-700
                text-white
                flex items-center
                justify-center
                font-bold
              "
                    >
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {participant.name}
                      </h3>

                      <p className="text-xs text-gray-400">
                        {participant.email}
                      </p>

                    </div>

                  </div>

                  <p className="text-sm">
                    <b>Joined to Course:</b>
                  </p>

                  <p className="text-xs text-gray-500 mb-3">
                    {participant.joined}
                  </p>

                  <p className="text-sm">
                    <b>Last Active</b>
                  </p>

                  <p className="text-xs text-gray-500 mb-3">
                    {participant.lastActive}
                  </p>

                  <div className="mb-4">

                    <span className="text-sm">
                      Level:
                    </span>

                    <span className="ml-2 px-3 py-1 rounded-full text-xs bg-red-100 text-red-500">
                      {participant.level}
                    </span>

                  </div>

                  <button
                    onClick={() =>
                      handlePromoteSingle(participant.id)
                    }
                    className="
    w-full
    bg-gray-200
    hover:bg-green-100
    hover:text-green-700
    rounded-lg
    py-2
    text-sm
    transition
  "
                  >
                    Promote
                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

        {activeTab === "subscribers" && (

          <div className="grid grid-cols-2 gap-6">

            {subscribers.map((subscriber) => (

              <div
                key={subscriber.id}
                className="
          bg-white
          border
          border-green-300
          rounded-xl
          p-4
        "
              >

                <div className="flex justify-between">

                  <div className="flex gap-3">

                    <div
                      className="
                w-10 h-10
                rounded-full
                bg-red-700
                text-white
                flex
                items-center
                justify-center
              "
                    >
                      {subscriber.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {subscriber.name}
                      </h3>

                      <p className="text-xs text-gray-400">
                        {subscriber.email}
                      </p>

                    </div>

                  </div>

                  <span
                    className="
              px-3 py-1
              bg-green-100
              text-green-600
              rounded-full
              text-xs
            "
                  >
                    Active
                  </span>

                </div>

                <div className="mt-4">

                  <p className="text-sm mb-2">
                    Assigned Courses (2)
                  </p>

                  <div className="flex gap-2">

                    {subscriber.courses.map(
                      (course, index) => (
                        <span
                          key={index}
                          className="
                    px-3 py-1
                    rounded-full
                    bg-blue-100
                    text-blue-600
                    text-xs
                  "
                        >
                          {course}
                        </span>
                      )
                    )}

                  </div>

                </div>

                <button
                  className="
            w-full
            mt-4
            bg-green-100
            text-green-700
            rounded-lg
            py-2
          "
                >
                  Activate
                </button>

              </div>

            ))}

          </div>

        )}

      </main>
    </div>
  );
};

export default ParticipantsAdmin;