import React from "react";
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

        // nanti dari database
        // value: participants.length + "\nParticipants",

        value: "200\nParticipants",
        bg: "bg-[#fff1f1]",
        icon: ParticipantsBar,
    },

    {
        title: "Total Courses",

        // nanti dari database
        // value: totalCourses + "\nCourses",

        value: "63\nCourses",
        bg: "bg-[#eef5ff]",
        icon: CourseBar,
    },

    {
        title: "Total Practice",

        // nanti dari database
        // value: totalPractice + "\nPractice",

        value: "100\nPractice",
        bg: "bg-[#fff3e5]",
        icon: PracticeBar,
    },

    {
        title: "Total Subscriber",

        // nanti dari database
        // value: totalSubscriber + "\nSubscribers",

        value: "53\nSubscribers",
        bg: "bg-[#ecffe8]",
        icon: SubscriberBar,
    },
];

const activities = [
    {
        // nanti dari database
        // name: activity.user_name,
        // action: activity.action,
        // time: activity.created_at,

        name: "Agustinus",
        action: "Completed practice",
        time: "2 minutes ago",
    },

    {
        // name: activity.user_name,
        // action: activity.action,
        // time: activity.created_at,

        name: "Bastian Judi",
        action: "Completed course",
        time: "20 minutes ago",
    },

    {
        // name: activity.user_name,
        // action: activity.action,
        // time: activity.created_at,

        name: "Rasyad",
        action: "New Subscriber",
        time: "2 hours ago",
    },

    {
        // name: activity.user_name,
        // action: activity.action,
        // time: activity.created_at,

        name: "Intan",
        action: "Started Listening 2",
        time: "1 day ago",
    },
];

const learningGoals = [
    {
        // nanti dari database
        // title: analysis.goal,
        // progress: analysis.percentage + "%",
        // width: `w-[${analysis.percentage}%]`,

        title: "Meningkatkan Skor EPRT",
        progress: "36%",
        width: "w-[36%]",
    },

    {
        // title: analysis.goal,
        // progress: analysis.percentage + "%",
        // width: `w-[${analysis.percentage}%]`,

        title: "Berlatih Simulasi Tes",
        progress: "28%",
        width: "w-[28%]",
    },

    {
        // title: analysis.goal,
        // progress: analysis.percentage + "%",
        // width: `w-[${analysis.percentage}%]`,

        title: "Persiapan Kelulusan",
        progress: "20%",
        width: "w-[20%]",
    },

    {
        // title: analysis.goal,
        // progress: analysis.percentage + "%",
        // width: `w-[${analysis.percentage}%]`,

        title: "Strategi Pengerjaan Tes",
        progress: "16%",
        width: "w-[16%]",
    },
];

const Admin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

    console.log(notifications);

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

                {/* CHART SECTION */}
                <div className="grid grid-cols-3 gap-5 mb-8">

                    {/* MONTHLY GROWTH */}
                    <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">

                        <h2 className="text-xl font-bold mb-5">
                            Monthly Growth
                        </h2>

                        <div className="h-93 border rounded-lg p-4">
                            <MonthlyGrowthChart />
                        </div>

                    </div>

                    {/* COURSE DISTRIBUTION */}
                    <div className="bg-white rounded-xl p-6 shadow-sm w-full">

                        <h2 className="text-xl font-bold mb-5">
                            Course Distribution
                        </h2>

                        <div className="w-full flex justify-center items-center">
                            <ParticipantLevelChart />
                        </div>

                    </div>

                </div>

                {/* BOTTOM SECTION */}
                <div className="grid grid-cols-2 gap-5">

                    {/* RECENT ACTIVITIES */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">

                        <h2 className="text-xl font-bold mb-5">
                            Recent Activities
                        </h2>

                        <div className="space-y-4">

                            {activities.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border-b pb-3"
                                >
                                    <div>
                                        <h3 className="font-semibold">
                                            {item.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {item.action}
                                        </p>
                                    </div>

                                    <span className="text-xs text-gray-400">
                                        {item.time}
                                    </span>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* LEARNING GOALS */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">

                        <h2 className="text-xl font-bold mb-5">
                            Top Learning Goal
                        </h2>

                        <div className="space-y-6">

                            {learningGoals.map((goal, index) => (
                                <div key={index}>

                                    <div className="flex justify-between mb-2">
                                        <p className="text-sm font-medium">
                                            {goal.title}
                                        </p>

                                        <span className="text-sm text-gray-500">
                                            {goal.progress}
                                        </span>
                                    </div>

                                    <div className="w-full h-3 bg-gray-200 rounded-full">

                                        <div
                                            className={`h-3 bg-red-500 rounded-full ${goal.width}`}
                                        />

                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Admin;