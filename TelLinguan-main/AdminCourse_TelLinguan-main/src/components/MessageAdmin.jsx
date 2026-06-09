import { useState, useEffect } from "react";
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

import Delete from "../assets/delM.png";
import Chat from "../assets/chat.png";

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

const MessageAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("");

  const initialMessages = [
    {
      id: 1,
      name: "Jenny Desi",
      email: "jennydesi@gmail.com",
      date: "18-April-2026",
      category: "Zoom Classes",
      categoryColor: "bg-blue-500",
      subject: "Courses with Classes by Zoom Meet",
      message:
        "I am interested in learning English online through Zoom. I would like to know more about the available courses and schedules.",
      pinned: false,
    },
    {
      id: 2,
      name: "Alika",
      email: "Alika@gmail.com",
      date: "20-April-2026",
      category: "On-site Teachers",
      categoryColor: "bg-green-500",
      subject: "On-site Teachers",
      message:
        "Our school is looking for native English speakers to teach on-site. We have facilities ready and need teachers for elementary students.",
      pinned: false,
    },
    {
      id: 3,
      name: "Intan",
      email: "Intan@gmail.com",
      date: "27-April-2026",
      category: "Others",
      categoryColor: "bg-red-500",
      subject: "One-on-one tutoring",
      message:
        "I need information about private tutoring sessions. Is this something you offer?",
      pinned: false,
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const togglePin = (id) => {
    setMessages((prev) => {
      const updated = prev
        .map((msg) =>
          msg.id === id
            ? { ...msg, pinned: !msg.pinned }
            : msg
        )
        .sort((a, b) => Number(b.pinned) - Number(a.pinned));

      const selected = updated.find(
        (msg) => msg.id === selectedMessage?.id
      );

      if (selected) {
        setSelectedMessage(selected);
      }

      return updated;
    });
  };

  const deleteMessage = (id) => {
    const filtered = messages.filter(
      (msg) => msg.id !== id
    );

    setMessages(filtered);

    if (selectedMessage?.id === id) {
      setSelectedMessage(
        filtered.length > 0 ? filtered[0] : null
      );
    }
  };

  const filteredMessages = messages.filter((msg) =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Message
            </h1>

            <p className="text-gray-400 mt-1">
              Set questions for placement test
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
        <div className="grid grid-cols-12 gap-4">

          {/* LEFT LIST */}
          <div
            className={`${selectedMessage ? "col-span-5" : "col-span-12"
              } space-y-3 transition-all`}
          >
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`
          bg-white
          border
          rounded-xl
          p-4
          cursor-pointer
          hover:shadow-md
          transition
          ${selectedMessage?.id === msg.id
                    ? "border-red-500"
                    : "border-gray-200"
                  }
        `}
              >
                <div className="flex justify-between">

                  <div className="flex gap-3 flex-1">

                    {/* AVATAR */}
                    <div className="w-11 h-11 rounded-full bg-[#b6252a] text-white flex items-center justify-center font-bold">
                      JD
                    </div>

                    <div className="flex-1">

                      <div className="flex items-center gap-2 flex-wrap">

                        <h3 className="font-semibold">
                          {msg.name}
                        </h3>

                        <span
                          className={`${msg.categoryColor} text-white text-[10px] px-3 py-1 rounded-full`}
                        >
                          {msg.category}
                        </span>

                      </div>

                      <div className="text-xs text-gray-500">
                        {msg.email}
                      </div>

                      <div className="text-xs text-gray-400 mb-2">
                        {msg.date}
                      </div>

                      <div className="flex items-start gap-2">

                        <img
                          src={Chat}
                          alt=""
                          className="w-3 h-3 mt-1"
                        />

                        <p className="text-xs text-gray-500 line-clamp-2">
                          {msg.message}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="flex gap-3">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(msg.id);
                      }}
                    >
                      <span
                        className={`text-lg ${msg.pinned
                          ? "text-yellow-400"
                          : "text-gray-400"
                          }`}
                      >
                        ★
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(msg.id);
                      }}
                    >
                      <img
                        src={Delete}
                        alt="delete"
                        className="w-4 h-4"
                      />
                    </button>

                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* RIGHT DETAIL */}
          {selectedMessage && (
            <div className="col-span-7">

              <div className="bg-white border rounded-xl p-5 h-full">

                <div className="flex justify-between items-start">

                  <div>
                    <span
                      className={`${selectedMessage.categoryColor} text-white text-[10px] px-3 py-1 rounded-full`}
                    >
                      {selectedMessage.subject}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      togglePin(selectedMessage.id)
                    }
                  >
                    <span
                      className={`text-lg ${selectedMessage.pinned
                        ? "text-yellow-400"
                        : "text-gray-400"
                        }`}
                    >
                      ★
                    </span>
                  </button>

                </div>

                <div className="mt-6">

                  <h3 className="font-semibold text-lg">
                    {selectedMessage.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {selectedMessage.email}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    {selectedMessage.date}
                  </p>

                </div>

                <hr className="my-5" />

                <div className="flex items-center gap-2 mb-3">

                  <img
                    src={Chat}
                    alt=""
                    className="w-4 h-4"
                  />

                  <span className="font-medium">
                    Message
                  </span>

                </div>

                <p className="text-gray-600 leading-7">
                  {selectedMessage.message}
                </p>

                <div className="flex gap-4 mt-12">

                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(
                        `Re: ${selectedMessage.subject}`
                      );

                      const body = encodeURIComponent(
                        `Hello ${selectedMessage.name},

                        Thank you for contacting TelLinguan.

                        We have received your inquiry and will respond shortly.

                        Best Regards,
                        TelLinguan Team`
                      );

                      window.location.href =
                        `mailto:${selectedMessage.email}?subject=${subject}&body=${body}`;

                    }}
                    className="
                      flex-1
                      bg-red-500
                      text-white
                      py-3
                      rounded-xl
                      font-medium
                      hover:bg-red-600
                      transition
                    "
                  >
                    Reply via Email
                  </button>

                  <button
                    onClick={() =>
                      setSelectedMessage(null)
                    }
                    className="
              px-8
              bg-gray-200
              rounded-xl
              font-medium
            "
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessageAdmin;