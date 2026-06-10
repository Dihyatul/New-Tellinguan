import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import practiceImg from "../assets/BOOK.png"; // buku
import clockImg from "../assets/comingsoon.png"; // jam
import poorImg from "../assets/level1.png";
import acceptableImg from "../assets/level2.png";
import goodImg from "../assets/level3.png";
import excellentImg from "../assets/level4.png";

import LAPTOP from "../assets/course.png";
import BOOK from "../assets/practice.png";
import PHONE from "../assets/contact.png";
import COG from "../assets/profile.png";

// USER
const userData = JSON.parse(localStorage.getItem("user"));
const username = userData?.username || "User";

const sidebarItems = [
    { key: "course", label: "Course", icon: LAPTOP, path: "/course" },
    { key: "practice", label: "Practice", icon: BOOK, path: "/practice" },
    { key: "contact", label: "Contact", icon: PHONE, path: "/contact" },
    { key: "profile", label: "Profile", icon: COG, path: "/profile" },
];

const levelStyles = {
    A1: { color: "bg-red-400", label: "A1", img: poorImg },
    A2: { color: "bg-yellow-400", label: "A2", img: acceptableImg },
    B1: { color: "bg-green-400", label: "B1", img: goodImg },
    B2: { color: "bg-blue-400", label: "B2", img: excellentImg },
};

const practicePlanByLevel = {
    A1: [
        {
            title: "Basic Vocabulary Boost",
            description: "Learn the essential words and phrases for everyday English.",
            status: "active",
        },
        {
            title: "Simple Sentence Practice",
            description: "Build confidence with short sentences and common expressions.",
            status: "available",
        },
        {
            title: "Listening Starter",
            description: "Practice understanding slow, clear conversations.",
            status: "available",
        },
    ],
    A2: [
        {
            title: "Routine Communication",
            description: "Practice reading and speaking for familiar daily situations.",
            status: "active",
        },
        {
            title: "Past and Future Tenses",
            description: "Strengthen your ability to talk about past events and plans.",
            status: "available",
        },
        {
            title: "Short Dialogues",
            description: "Listen to short dialogue clips and answer simple questions.",
            status: "available",
        },
    ],
    B1: [
        {
            title: "Intermediate Comprehension",
            description: "Practice longer passages and more complete listening tasks.",
            status: "active",
        },
        {
            title: "Grammar in Context",
            description: "Work on conditionals, modals, and sentence variety.",
            status: "available",
        },
        {
            title: "Everyday Fluency",
            description: "Develop comfort with conversational language and routine topics.",
            status: "available",
        },
    ],
    B2: [
        {
            title: "Advanced Comprehension",
            description: "Practice academic listening and reading with more complex content.",
            status: "active",
        },
        {
            title: "Performance Grammar",
            description: "Improve accuracy with more advanced grammar structures.",
            status: "available",
        },
        {
            title: "Speaking Confidence",
            description: "Practice expressing ideas clearly and fluently in longer turns.",
            status: "available",
        },
    ],
};

// TOP INFO (sementara static → nanti dari backend)
const learningGoals = "Meningkatkan Skor EPRT";
const preferredDays = ["Monday", "Thursday"];
const preferredTime = "Afternoon 12.00 - 15.00 WIB";
const preferredDuration = "2 month";

// PRACTICE DATA
const defaultPractices = [
    {
        title: "Refinement & accuracy",
        description:
            "Practice tailored to your weak spots, past mistakes, and learning goals.",
        status: "active",
    },
    {
        title: "Fundamental understanding",
        description:
            "Practice tailored to your weak spots, past mistakes, and learning goals.",
        status: "locked",
    },
    {
        title: "Comprehension & detail",
        description:
            "Practice tailored to your weak spots, past mistakes, and learning goals.",
        status: "locked",
    },
];

// IMAGE BASED ON STATUS
const statusImage = {
    active: practiceImg,
    locked: clockImg,
};

const Practice = () => {
    const [result, setResult] = useState(null);
    const [loadingResult, setLoadingResult] = useState(true);
    const [resultError, setResultError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const cachedResult = (() => {
        try {
            return JSON.parse(localStorage.getItem("mlResult"));
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        const fetchResult = async () => {
            const token = localStorage.getItem("token");

            if (cachedResult) {
                setResult(cachedResult);
            }

            try {
                const res = await fetch("http://localhost:5000/api/result", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    setResultError(errorData.message || "Failed to load result.");
                    return;
                }

                const data = await res.json();
                setResult(data);
                localStorage.setItem("mlResult", JSON.stringify(data));
            } catch (err) {
                setResultError("Cannot connect to server.");
            } finally {
                setLoadingResult(false);
            }
        };

        fetchResult();
    }, []);

    const displayLevel = result?.level || cachedResult?.level || "A2";
    const currentLevel = levelStyles[displayLevel] || levelStyles["A2"];
    const practicesToShow = practicePlanByLevel[displayLevel] || defaultPractices;
    const activeDays = result?.analysis?.days || cachedResult?.analysis?.days || preferredDays;
    const learningGoalsText = result?.analysis?.goal || cachedResult?.analysis?.goal || learningGoals;
    const preferredDurationText = result?.analysis?.duration || cachedResult?.analysis?.duration || preferredDuration;
    const preferredTimeText = result?.analysis?.time || cachedResult?.analysis?.time || preferredTime;

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
                            {learningGoalsText || "-"}
                        </p>
                    </div>

                    {/* PREFERRED SCHEDULE */}
                    <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                        <p className="text-gray-500 text-sm mb-1">Preferred Schedule</p>
                        <p className="font-semibold text-gray-800">
                            {preferredDurationText || "-"}
                        </p>
                    </div>

                    {/* DAYS + TIME (SEPERTI GAMBAR) */}
                    <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {activeDays.length > 0 ? (
                                activeDays.map((day, index) => (
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
                            {preferredTimeText || "-"}
                        </div>
                    </div>

                </div>

                {/* ================= PRACTICE CARD ================= */}
                <div className="space-y-6">

                    {practicesToShow.map((item, index) => {
                        const imageSrc = statusImage[item.status];

                        return (
                            <div
                                key={index}
                                className="relative bg-white rounded-xl shadow border border-gray-200 p-6 flex justify-between items-center overflow-hidden"
                            >

                                {/* LEFT */}
                                <div className="max-w-lg">

                                    {/* LABEL */}
                                    <p
                                        className={`text-sm font-medium mb-1 ${item.status === "locked"
                                            ? "text-blue-400"
                                            : "text-blue-500"
                                            }`}
                                    >
                                        {item.status === "locked" ? "Coming Soon" : `Practice ${index + 1}`}
                                    </p>

                                    {/* TITLE */}
                                    <h2 className="text-2xl font-bold mb-2">
                                        {item.title}
                                    </h2>

                                    {/* DESC */}
                                    <p className="text-gray-500 text-sm mb-4">
                                        {item.description}
                                    </p>

                                    {/* BUTTON */}
                                    {item.status === "active" ? (
                                        <button className="bg-red-700 text-white px-5 py-2 rounded-lg shadow hover:bg-red-800 transition">
                                            PRACTICE
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="bg-gray-300 text-gray-500 px-5 py-2 rounded-lg cursor-not-allowed"
                                        >
                                            LOCKED
                                        </button>
                                    )}

                                </div>

                                {/* RIGHT IMAGE */}
                                <div className="absolute right-4 bottom-0 w-50 h-50 flex items-end justify-center">
                                    <img
                                        src={imageSrc}
                                        alt={item.status}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>

                            </div>
                        );
                    })}

                </div>
            </main>
        </div>
    );
};

export default Practice;