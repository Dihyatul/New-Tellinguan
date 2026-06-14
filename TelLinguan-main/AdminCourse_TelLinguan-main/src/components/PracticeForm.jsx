import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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

const courseOptions = [
    "Grammar 1", "Grammar 2", "Grammar 3",
    "Listening 1", "Listening 2", "Listening 3",
    "Reading 1", "Reading 2", "Reading 3",
];

const categoryOptions = ["Grammar", "Listening", "Reading"];

const PracticeForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const editingPractice = location.state?.practice;
    const isEdit = !!editingPractice;

    const [practiceName, setPracticeName] = useState(editingPractice?.title || "");
    const [description,  setDescription]  = useState(editingPractice?.description || "");
    const [course,       setCourse]       = useState(editingPractice?.course || "");
    const [category,     setCategory]     = useState(editingPractice?.category || "");
    const [content,      setContent]      = useState(editingPractice?.content || "");
    const [status,       setStatus]       = useState(editingPractice?.status ?? false);

    const [showCourseDropdown,   setShowCourseDropdown]   = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [saving,               setSaving]               = useState(false);

    const handleCancel = () => navigate("/PracticeAdmin");

    const handleSubmit = async () => {
        if (!practiceName || !description || !course || !category) {
            alert("Please complete all required fields (Name, Description, Course, Category).");
            return;
        }

        setSaving(true);

        const body = { title: practiceName, description, course, category, content, status };

        try {
            let res;

            if (isEdit) {
                res = await fetch(`${API_URL}/api/practices/${editingPractice.id}`, {
                    method:  "PUT",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify(body),
                });
            } else {
                res = await fetch(`${API_URL}/api/practices`, {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify(body),
                });
            }

            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Failed to save practice.");
                return;
            }

            alert(isEdit ? "Practice updated successfully!" : "Practice created successfully!");
            navigate("/PracticeAdmin");
        } catch {
            alert("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* SIDEBAR */}
            <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">

                <div className="bg-white text-black rounded-xl p-6 mb-8 text-center shadow-md">
                    <h2 className="text-2xl font-bold text-[#b6252a]">Welcome Admin</h2>
                    <p className="text-sm text-gray-500 mt-2">TelLinguan Dashboard</p>
                </div>

                <div className="space-y-3">
                    {sidebarItems.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            (item.key === "practice" && location.pathname === "/PracticeForm");

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
                                        <button className="w-full h-14 rounded-xl px-4 flex items-center text-sm font-semibold bg-[#ed1e28bf] text-white">
                                            Manage Practice
                                        </button>
                                        <button className="w-full h-14 rounded-xl px-4 flex items-center text-sm font-semibold text-white hover:bg-[#ffffff10]">
                                            Schedule
                                        </button>
                                        <button className="w-full h-14 rounded-xl px-4 flex items-center text-sm font-semibold text-white hover:bg-[#ffffff10]">
                                            Results &amp; Analytics
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </aside>

            {/* CONTENT */}
            <main className="flex-1 p-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black">Practice Management</h1>
                    <p className="text-gray-400 mt-1">Create and manage learning materials</p>
                </div>

                <div className="bg-white rounded-2xl border-[3px] border-slate-200 shadow-sm p-10 max-w-5xl">

                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold">
                            {isEdit ? "Edit Practice" : "Add New Practice"}
                        </h2>
                        <button onClick={() => navigate("/PracticeAdmin")} className="text-gray-400 text-2xl">
                            ×
                        </button>
                    </div>

                    {/* Practice Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Practice Name *</label>
                        <input
                            type="text"
                            value={practiceName}
                            onChange={(e) => setPracticeName(e.target.value)}
                            placeholder="e.g. Basic Grammar Foundations"
                            className="w-full h-14 rounded-xl border border-gray-300 px-5"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short summary of what this material covers"
                            rows={3}
                            className="w-full rounded-xl border border-gray-300 p-5 resize-none"
                        />
                    </div>

                    {/* Course + Category */}
                    <div className="grid grid-cols-2 gap-8 mb-6 items-start">

                        {/* COURSE */}
                        <div className="relative z-20">
                            <label className="block text-sm font-medium mb-2">Course *</label>
                            <button
                                type="button"
                                onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                                className="w-full h-14 border border-gray-300 rounded-xl px-5 flex items-center justify-between bg-white"
                            >
                                <span className={course ? "text-black" : "text-gray-400"}>
                                    {course || "Select a course"}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showCourseDropdown ? "rotate-180" : ""}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showCourseDropdown && (
                                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {courseOptions.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => { setCourse(item); setShowCourseDropdown(false); }}
                                            className="w-full text-left px-5 py-3 hover:bg-gray-100 border-b last:border-b-0"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CATEGORY */}
                        <div className="relative z-10">
                            <label className="block text-sm font-medium mb-2">Category *</label>
                            <button
                                type="button"
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="w-full h-14 border border-gray-300 rounded-xl px-5 flex items-center justify-between bg-white"
                            >
                                <span className={category ? "text-black" : "text-gray-400"}>
                                    {category || "Select a category"}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showCategoryDropdown ? "rotate-180" : ""}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showCategoryDropdown && (
                                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {categoryOptions.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => { setCategory(item); setShowCategoryDropdown(false); }}
                                            className="w-full text-left px-5 py-3 hover:bg-gray-100 border-b last:border-b-0"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Learning Material Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write the full learning material here — explanations, examples, rules, tips..."
                            rows={8}
                            className="w-full rounded-xl border border-gray-300 p-5 resize-y"
                        />
                    </div>

                    {/* Status */}
                    <div className="mb-10">
                        <label className="block text-sm font-medium mb-3">Status</label>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-2">
                                <input type="radio" checked={status === true}  onChange={() => setStatus(true)}  />
                                Active
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" checked={status === false} onChange={() => setStatus(false)} />
                                Draft
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="bg-[#ed1e28] hover:bg-red-700 disabled:opacity-60 text-white px-10 h-14 rounded-xl font-medium"
                        >
                            {saving ? "Saving…" : isEdit ? "Update Practice" : "Create Practice"}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-300 hover:bg-gray-400 px-10 h-14 rounded-xl font-medium"
                        >
                            Cancel
                        </button>
                    </div>

                </div>

            </main>

        </div>
    );
};

export default PracticeForm;
