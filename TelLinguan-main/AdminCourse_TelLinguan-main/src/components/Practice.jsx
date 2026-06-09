import React from "react";
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

import { practices as initialPractice } from "./PracticeMateri";

// USER
const userData = JSON.parse(localStorage.getItem("user"));
const username = userData?.username || "User";

const sidebarItems = [
    { key: "course", label: "Course", icon: LAPTOP, path: "/course" },
    { key: "practice", label: "Practice", icon: BOOK, path: "/practice" },
    { key: "contact", label: "Contact", icon: PHONE, path: "/contact" },
    { key: "profile", label: "Profile", icon: COG, path: "/profile" },
];

// LEVEL (dummy backend)
const userLevel = "Good";

const levelStyles = {
    poor: { color: "bg-red-400", label: "Poor", img: poorImg },
    acceptable: { color: "bg-yellow-400", label: "Acceptable", img: acceptableImg },
    good: { color: "bg-green-400", label: "Good", img: goodImg },
    excellent: { color: "bg-blue-400", label: "Excellent", img: excellentImg },
};

// TOP INFO (sementara static → nanti dari backend)
const learningGoals = "Meningkatkan Skor EPRT";
const preferredDays = ["Monday", "Thursday"];
const preferredTime = "Afternoon 12.00 - 15.00 WIB";
const preferredDuration = "2 month";

// IMAGE BASED ON STATUS
const statusImage = {
    active: practiceImg,
    locked: clockImg,
};

const practices = initialPractice.map((item) => ({
    id: item.id,
    title: item.title,
    description: `${item.course} • ${item.type} • ${item.quantity} Questions • ${item.duration}`,
    status: item.status ? "active" : "locked",
}));

const Practice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const normalizedLevel = userLevel?.toLowerCase();
    const currentLevel =
        levelStyles[normalizedLevel] || levelStyles["poor"];

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

                {/* ================= PRACTICE CARD ================= */}
                <div className="space-y-6">

                    {practices.map((item, index) => {
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