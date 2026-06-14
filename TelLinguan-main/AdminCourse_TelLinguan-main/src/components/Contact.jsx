import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import poorImg from "../assets/level1.png";
import acceptableImg from "../assets/level2.png";
import goodImg from "../assets/level3.png";
import excellentImg from "../assets/level4.png";

import LAPTOP from "../assets/Course.png";
import BOOK from "../assets/Practice.png";
import PHONE from "../assets/contact.png";
import COG from "../assets/profile.png";

import EMAIL_ICON from "../assets/Email.png";
import PHONE_ICON from "../assets/Phone.png";
import LOCATION_ICON from "../assets/Location Pin.png";
import Send from "../assets/Send.png";

const userData = JSON.parse(localStorage.getItem("user"));
const username = userData?.username || "User";

const sidebarItems = [
    { key: "course", label: "Course", icon: LAPTOP, path: "/course" },
    { key: "practice", label: "Practice", icon: BOOK, path: "/practice" },
    { key: "contact", label: "Contact", icon: PHONE, path: "/contact" },
    { key: "profile", label: "Profile", icon: COG, path: "/profile" },
];

// dari backend
const userLevel = "Good";

const levelStyles = {
    poor: { color: "bg-red-400", label: "Poor", img: poorImg },
    acceptable: { color: "bg-yellow-400", label: "Acceptable", img: acceptableImg },
    good: { color: "bg-green-400", label: "Good", img: goodImg },
    excellent: { color: "bg-blue-400", label: "Excellent", img: excellentImg },
};

const learningGoals = "Meningkatkan Skor EPRT";
const preferredDays = ["Monday", "Thursday"];
const preferredTime = "Afternoon 12.00 - 15.00 WIB";
const preferredDuration = "2 month";

const Contact = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState("");
    const [showPurpose, setShowPurpose] = useState(false);
    const currentLevel = levelStyles[userLevel.toLowerCase()];
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
        purpose: "",
    });

    const handleSelect = (value) => {
        setSelected(value);
        setShowPurpose(value === "other");
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (!form.name || !form.email || !form.message) {
            setError("Semua field wajib diisi!");
            return;
        }

        if (showPurpose && !form.purpose) {
            setError("Purpose harus diisi!");
            return;
        }

        setError("");

        console.log("Data terkirim:", form);
    };

    // data yang dikirim ke backend nanti bentuknya gini
    // const handleSubmit = async () => {
    //     if (!form.name || !form.email || !form.message) {
    //         setError("Semua field wajib diisi!");
    //         return;
    //     }

    //     if (showPurpose && !form.purpose) {
    //         setError("Purpose harus diisi!");
    //         return;
    //     }

    //     if (!selected) {
    //         setError("Pilih jenis course dulu!");
    //         return;
    //     }

    //     setError("");

    //     const payload = {
    //         ...form,
    //         type: selected,
    //     };

    //     try {
    //         const res = await fetch("/api/message", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!res.ok) {
    //             throw new Error("Gagal kirim");
    //         }

    //         alert("Message sent to admin!");
    //     } catch (err) {
    //         console.error(err);
    //         alert("Failed to send");
    //     }
    // };

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

                    {/* LEFT SIDE */}
                    <div className="space-y-6 ml-25">

                        <h1 className="text-3xl font-bold leading-snug">
                            Let&apos;s discuss <br />
                            on something <span className="text-red-600">cool</span> <br />
                            together
                        </h1>

                        {/* EMAIL */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <img src={EMAIL_ICON} alt="email" className="w-5 h-5" />
                            <p>lac@telkomuniversity.ac.id</p>
                        </div>

                        {/* PHONE */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <img src={PHONE_ICON} alt="phone" className="w-5 h-5" />
                            <p>+(62) 821-2929-4443</p>
                        </div>

                        {/* LOCATION */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <img src={LOCATION_ICON} alt="location" className="w-5 h-5" />
                            <p>
                                Gedung Grha Cacuk <br /> Sudarijanto-A Lt. 1, Ruang A112
                            </p>
                        </div>

                    </div>

                    {/* RIGHT SIDE (FORM) */}
                    <div className="max-w-md bg-white p-6 rounded-xl shadow border border-gray-200">

                        <p className="text-sm text-blue-500 mb-3">I'm interested to...</p>

                        {/* OPTIONS */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <button
                                onClick={() => handleSelect("zoom")}
                                className={`p-3 rounded-lg border transition ${selected === "zoom"
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-gray-200"
                                    }`}
                            >
                                Courses with Teachers by Zoom Meet
                            </button>

                            <button
                                onClick={() => handleSelect("onsite")}
                                className={`p-3 rounded-lg border transition ${selected === "onsite"
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-gray-200"
                                    }`}
                            >
                                Courses with On-site Teachers
                            </button>
                        </div>

                        <button
                            onClick={() => handleSelect("other")}
                            className={`w-full p-2 mb-4 rounded-lg border transition ${selected === "other"
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-200"
                                }`}
                        >
                            other...
                        </button>

                        {/* INPUT */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            onChange={handleChange}
                            className="w-full border-b-2 border-red-400 mb-4 outline-none"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Your email"
                            onChange={handleChange}
                            className="w-full border-b-2 border-red-400 mb-4 outline-none"
                        />

                        <textarea
                            name="message"
                            placeholder="Your message"
                            onChange={handleChange}
                            rows={3}
                            className="w-full border-b-2 border-red-400 mb-4 outline-none resize-none"
                        />

                        {/* CONDITIONAL */}
                        {showPurpose && (
                            <input
                                type="text"
                                name="purpose"
                                placeholder="Your purpose"
                                onChange={handleChange}
                                className="w-full border-b-2 border-red-400 mb-4 outline-none"
                            />
                        )}

                        <button
                            onClick={handleSubmit}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
                        >
                            <img src={Send} alt="send" className="w-7 h-7" />
                            <span>Send Message</span>
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Contact;