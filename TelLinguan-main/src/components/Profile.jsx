import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import poorImg from "../assets/level1.png";
import acceptableImg from "../assets/level2.png";
import goodImg from "../assets/level3.png";
import excellentImg from "../assets/level4.png";

import LAPTOP from "../assets/course.png";
import BOOK from "../assets/practice.png";
import PHONE from "../assets/contact.png";
import COG from "../assets/profile.png";

import AVATAR_ICON from "../assets/user.png";
import USER_ICON from "../assets/myUsername.png";
import EMAIL_ICON from "../assets/myEmail.png";
import UNIVERSITY_ICON from "../assets/myUni.png";
import ID_ICON from "../assets/myId.png";

const user = JSON.parse(localStorage.getItem("user")) || {};

const {
    username = "admin",
    name = "-",
    email = "-",
    university = "-",
    studentId = "-",
    level = "excellent",
} = user;

// ================= SIDEBAR =================
const sidebarItems = [
    { key: "course", label: "Course", icon: LAPTOP, path: "/course" },
    { key: "practice", label: "Practice", icon: BOOK, path: "/practice" },
    { key: "contact", label: "Contact", icon: PHONE, path: "/contact" },
    { key: "profile", label: "Profile", icon: COG, path: "/profile" },
];

// ================= LEVEL SYSTEM =================
const levelOrder = ["poor", "acceptable", "good", "excellent"];

const levelStyles = {
    poor: { color: "bg-red-400", label: "Poor", img: poorImg },
    acceptable: { color: "bg-yellow-400", label: "Acceptable", img: acceptableImg },
    good: { color: "bg-green-400", label: "Good", img: goodImg },
    excellent: { color: "bg-blue-400", label: "Excellent", img: excellentImg },
};

const currentIndex = levelOrder.indexOf(level);
const nextLevel =
    currentIndex !== -1 && currentIndex < levelOrder.length - 1
        ? levelOrder[currentIndex + 1]
        : "excellent";

const currentLevel = levelStyles[level] || levelStyles["poor"];
const nextLevelData = levelStyles[nextLevel];

const learningGoals = "Meningkatkan Skor EPRT";
const preferredDays = ["Monday", "Thursday"];
const preferredTime = "Afternoon 12.00 - 15.00 WIB";
const preferredDuration = "2 month";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();

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

                {/* PROFILE CARD */}
                <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                <div className="bg-white rounded-xl shadow border border-gray-200 p-4 flex items-center gap-6 max-w-2xl ml-65">
                    <div className="bg-red-800 w-60 h-60 rounded-xl flex items-center justify-center">
                        <img src={AVATAR_ICON} alt="avatar" className="w-40 h-40" />
                    </div>

                    <div className="space-y-2">

                        <h2 className="text-xl font-semibold">{name || "-"}</h2>

                        <div className="flex items-center gap-3 text-gray-600">
                            <img src={USER_ICON} className="w-5 h-5" />
                            <p className="text-lg">{username || "-"}</p>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                            <img src={EMAIL_ICON} className="w-5 h-5" />
                            <p className="text-lg">{email || "-"}</p>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                            <img src={UNIVERSITY_ICON} className="w-5 h-5" />
                            <p className="text-lg">{university || "-"}</p>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                            <img src={ID_ICON} className="w-5 h-5" />
                            <p className="text-lg">{studentId || "-"}</p>
                        </div>

                    </div>

                </div>

                {/* LEVEL SECTION */}
                <div className="flex items-center gap-10 mt-10 ml-75">

                    <img
                        src={currentLevel.img}
                        alt={currentLevel.label}
                        className="w-40 h-40 object-contain"
                    />

                    <div className="relative">

                        <div className="text-2xl font-bold leading-snug">

                            {level === "excellent" ? (
                                <>
                                    🎉 Stay consistent, <br />
                                    you're already at the top! <br />

                                    <span className="relative inline-block text-red-600">
                                        Excellent 🚀✨

                                        <span className="absolute inset-0 firework pointer-events-none"></span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    Stay consistent, <br />
                                    you're just one step <br />
                                    away from reaching{" "}
                                    <span className="text-red-600">
                                        {nextLevelData.label}
                                    </span>
                                </>
                            )}

                        </div>

                    </div>
                </div>

            </main >
        </div >
    );
};

export default Profile;