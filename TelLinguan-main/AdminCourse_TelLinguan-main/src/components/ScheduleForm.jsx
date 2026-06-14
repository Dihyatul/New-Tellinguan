import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../config.js";

import DashboardIcon from "../assets/Dashboard.png";
import CourseIcon from "../assets/Course.png";
import PracticeIcon from "../assets/Practice.png";
import ParticipantIcon from "../assets/Participants.png";
import PlacementIcon from "../assets/PlacementTest.png";
import MessageIcon from "../assets/Message.png";

const sidebarItems = [
    { key: "dashboard",    label: "Dashboard",      path: "/Admin",              icon: DashboardIcon },
    { key: "course",       label: "Course",          path: "/CourseAdmin",        icon: CourseIcon },
    { key: "practice",     label: "Practice",        path: "/PracticeAdmin",      icon: PracticeIcon },
    { key: "participants", label: "Participants",    path: "/ParticipantsAdmin",  icon: ParticipantIcon },
    { key: "placement",    label: "Placement Test",  path: "/PlacementTestAdmin", icon: PlacementIcon },
    { key: "message",      label: "Message",         path: "/MessageAdmin",       icon: MessageIcon },
];

const ScheduleForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const editingSchedule = location.state?.schedule;
    const isEdit = !!editingSchedule;

    const [practices, setPractices] = useState([]);
    const [showPracticeDropdown, setShowPracticeDropdown] = useState(false);

    const [practiceId,  setPracticeId]  = useState(editingSchedule?.practiceId || "");
    const [participant, setParticipant] = useState(editingSchedule?.participant || "");
    const [date,        setDate]        = useState(editingSchedule?.date || "");
    const [startTime,   setStartTime]   = useState(editingSchedule?.startTime || "");
    const [endTime,     setEndTime]     = useState(editingSchedule?.endTime || "");
    const [saving,      setSaving]      = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/practices`)
            .then((r) => r.ok ? r.json() : [])
            .then((data) => setPractices(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    const handleCancel = () =>
        navigate("/PracticeAdmin", { state: { activeMenu: "schedule" } });

    const handleSubmit = async () => {
        if (!practiceId || !participant || !date || !startTime || !endTime) {
            alert("Please complete all fields.");
            return;
        }

        setSaving(true);

        const body = {
            practiceId: Number(practiceId),
            participant,
            date,
            startTime,
            endTime,
        };

        try {
            let res;

            if (isEdit) {
                res = await fetch(`${API_URL}/api/practices/schedules/${editingSchedule.id}`, {
                    method:  "PUT",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify(body),
                });
            } else {
                res = await fetch(`${API_URL}/api/practices/schedules`, {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify(body),
                });
            }

            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Failed to save schedule.");
                return;
            }

            alert(isEdit ? "Schedule updated successfully!" : "Schedule created successfully!");
            navigate("/PracticeAdmin", { state: { activeMenu: "schedule" } });
        } catch {
            alert("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">

                <div className="bg-white text-black rounded-xl p-6 mb-8 text-center shadow-md">
                    <h2 className="text-2xl font-bold text-[#b6252a]">Welcome Admin</h2>
                    <p className="text-sm text-gray-500 mt-2">TelLinguan Dashboard</p>
                </div>

                <div className="space-y-3">
                    {sidebarItems.map((item) => {
                        const isPracticePage =
                            location.pathname === "/PracticeAdmin" ||
                            location.pathname === "/PracticeForm" ||
                            location.pathname === "/ScheduleForm";

                        const isActive =
                            location.pathname === item.path ||
                            (item.key === "practice" && isPracticePage);

                        return (
                            <div key={item.key}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`
                                        w-full h-14 rounded-xl px-4
                                        flex items-center justify-between
                                        transition-all duration-200 shadow-sm
                                        ${isActive ? "bg-red-500 text-white" : "bg-white text-black hover:bg-gray-100"}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <img src={item.icon} alt={item.label} className="w-8 h-8 object-contain" />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {(item.key === "course" || item.key === "practice") && (
                                        <div className={`
                                            w-0 h-0 border-t-[7px] border-t-transparent
                                            border-b-[7px] border-b-transparent border-l-10
                                            ${isActive ? "border-l-white" : "border-l-gray-400"}
                                        `} />
                                    )}
                                </button>

                                {item.key === "practice" && isActive && (
                                    <div className="ml-10 mt-3 space-y-2">
                                        <button
                                            onClick={() => navigate("/PracticeAdmin")}
                                            className={`
                                                w-full h-14 rounded-xl px-4 flex items-center
                                                text-sm font-semibold transition-all duration-200
                                                ${location.pathname === "/PracticeAdmin"
                                                    ? "bg-[#ed1e28bf] text-white"
                                                    : "text-white hover:bg-[#ffffff10]"}
                                            `}
                                        >
                                            Manage Practice
                                        </button>
                                        <button
                                            onClick={() => navigate("/ScheduleForm")}
                                            className={`
                                                w-full h-14 rounded-xl px-4 flex items-center
                                                text-sm font-semibold transition-all duration-200
                                                ${location.pathname === "/ScheduleForm"
                                                    ? "bg-[#ed1e28bf] text-white"
                                                    : "text-white hover:bg-[#ffffff10]"}
                                            `}
                                        >
                                            Schedule
                                        </button>
                                        <button
                                            onClick={() => navigate("/PracticeAdmin")}
                                            className="w-full h-14 rounded-xl px-4 flex items-center text-sm font-semibold text-white hover:bg-[#ffffff10]"
                                        >
                                            Results &amp; Analytics
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </aside>

            <main className="flex-1 p-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black">Schedule</h1>
                    <p className="text-gray-400 mt-1">Set practice schedules and deadlines</p>
                </div>

                <div className="bg-white rounded-2xl border-[3px] border-slate-200 shadow-sm p-10 max-w-5xl">

                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold">
                            {isEdit ? "Edit Schedule" : "Add New Schedule"}
                        </h2>
                        <button
                            onClick={() => navigate("/PracticeAdmin", { state: { activeMenu: "schedule" } })}
                            className="text-gray-400 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-6 items-start">

                        {/* PRACTICE */}
                        <div className="relative z-20">
                            <label className="block text-sm font-medium mb-2">Practice</label>
                            <button
                                type="button"
                                onClick={() => setShowPracticeDropdown(!showPracticeDropdown)}
                                className="w-full h-14 border border-gray-300 rounded-xl px-5 flex items-center justify-between bg-white"
                            >
                                <span className={practiceId ? "text-black" : "text-gray-400"}>
                                    {practiceId
                                        ? practices.find((p) => p.id === Number(practiceId))?.title || "Select a practice"
                                        : "Select a practice"}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showPracticeDropdown ? "rotate-180" : ""}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showPracticeDropdown && (
                                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {practices.map((practice) => (
                                        <button
                                            key={practice.id}
                                            type="button"
                                            onClick={() => { setPracticeId(practice.id); setShowPracticeDropdown(false); }}
                                            className="w-full text-left px-5 py-3 hover:bg-gray-100 border-b last:border-b-0"
                                        >
                                            {practice.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PARTICIPANT */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Participant</label>
                            <input
                                type="text"
                                value={participant}
                                onChange={(e) => setParticipant(e.target.value)}
                                placeholder="Participant Name"
                                className="w-full h-14 rounded-xl border border-gray-300 px-5"
                            />
                        </div>

                        {/* DATE */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-14 rounded-xl border border-gray-300 px-5"
                            />
                        </div>

                        {/* START TIME */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full h-14 rounded-xl border border-gray-300 px-5"
                            />
                        </div>

                        {/* END TIME */}
                        <div>
                            <label className="block text-sm font-medium mb-2">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full h-14 rounded-xl border border-gray-300 px-5"
                            />
                        </div>

                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="bg-[#ed1e28] hover:bg-red-700 disabled:opacity-60 text-white px-8 py-3 rounded-lg font-medium"
                        >
                            {saving ? "Saving…" : isEdit ? "Update Schedule" : "Create Schedule"}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-200 hover:bg-gray-300 px-8 py-3 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>

                </div>

            </main>

        </div>
    );
};

export default ScheduleForm;
