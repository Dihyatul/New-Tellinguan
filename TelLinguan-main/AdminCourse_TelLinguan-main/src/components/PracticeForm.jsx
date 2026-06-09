import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

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

import { practices as initialPractice } from "./PracticeMateri";

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

const courseOptions = [
    "Grammar 1",
    "Grammar 2",
    "Grammar 3",
    "Listening 1",
    "Listening 2",
    "Listening 3",
    "Reading 1",
    "Reading 2",
    "Reading 3",
];

const typeOptions = [
    "Multiple Choice",
    "Fill in the Blank",
    "Error Recognition",
];

const PracticeForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const editingPractice = location.state?.practice;
    const isEdit = !!editingPractice;

    const [practices, setPractices] = useState(initialPractice);

    const [practiceName, setPracticeName] = useState(
        editingPractice?.title || ""
    );

    const [description, setDescription] = useState(
        editingPractice?.description || ""
    );

    const [course, setCourse] = useState(
        editingPractice?.course || ""
    );

    const [type, setType] = useState(
        editingPractice?.type || ""
    );

    const [questions, setQuestions] = useState(
        editingPractice?.quantity?.replace(" questions", "") || ""
    );

    const [duration, setDuration] = useState(
        editingPractice?.duration?.replace(" minutes", "") || ""
    );

    const [status, setStatus] = useState(
        editingPractice?.status ?? true
    );

    const [showCourseDropdown, setShowCourseDropdown] =
        useState(false);

    const [showTypeDropdown, setShowTypeDropdown] =
        useState(false);

    const totalPractice = practices.length;

    const totalActive = practices.filter(
        (item) => item.status === true
    ).length;

    const totalDraft = practices.filter(
        (item) => item.status === false
    ).length;

    const handleCancel = () => {
        navigate("/PracticeAdmin");
    };

    const handleSubmit = () => {
        if (
            !practiceName ||
            !description ||
            !course ||
            !type ||
            !questions ||
            !duration
        ) {
            alert("Please complete all fields");
            return;
        }

        if (isEdit) {
            const updatedPractice = initialPractice.map((item) => {
                if (item.title === editingPractice.title) {
                    return {
                        ...item,
                        title: practiceName,
                        description,
                        course,
                        type,
                        quantity: `${questions} questions`,
                        duration: `${duration} minutes`,
                        status,
                    };
                }

                return item;
            });

            initialPractice.length = 0;
            initialPractice.push(...updatedPractice);

            setPractices(updatedPractice);

            alert("Practice updated successfully!");
        } else {
            const newPractice = {
                course,
                title: practiceName,
                description,
                type,
                quantity: `${questions} questions`,
                duration: `${duration} minutes`,
                status,
            };

            initialPractice.push(newPractice);

            setPractices([
                ...practices,
                newPractice,
            ]);

            alert("Practice created successfully!");
        }

        navigate("/PracticeAdmin");
    };

    return (
        <div className="min-h-screen flex bg-gray-100">

            {/* SIDEBAR */}
            <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">

                <div className="bg-white text-black rounded-xl p-6 mb-8 text-center shadow-md">
                    <h2 className="text-2xl font-bold text-[#b6252a]">
                        Welcome Admin
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        TelLinguan Dashboard
                    </p>
                </div>

                <div className="space-y-3">
                    {sidebarItems.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            (
                                item.key === "practice" &&
                                location.pathname === "/PracticeForm"
                            );

                        return (
                            <div key={item.key}>

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

                                {item.key === "practice" &&
                                    isActive && (
                                        <div className="ml-10 mt-3 space-y-2">

                                            <button
                                                className="
                                                    w-full h-14 rounded-xl px-4
                                                    flex items-center
                                                    text-sm font-semibold
                                                    bg-[#ed1e28bf] text-white
                                                "
                                            >
                                                Manage Practice
                                            </button>

                                            <button
                                                className="
                                                    w-full h-14 rounded-xl px-4
                                                    flex items-center
                                                    text-sm font-semibold
                                                    text-white hover:bg-[#ffffff10]
                                                
                                                    "
                                            >
                                                Schedule
                                            </button>

                                            <button
                                                className="
                                                    w-full h-14 rounded-xl px-4
                                                    flex items-center
                                                    text-sm font-semibold
                                                    text-white hover:bg-[#ffffff10]
                                                "
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

            {/* CONTENT */}
            <main className="flex-1 p-8">

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
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-black">
                        Practice Management
                    </h1>

                    <p className="text-gray-400 mt-1">
                        Create and manage your practice sessions
                    </p>

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

                {/* FORM */}
                <div className="bg-white rounded-2xl border-[3px] border-slate-200 shadow-sm p-10 max-w-5xl">

                    <div className="flex items-center justify-between mb-8">

                        <h2 className="text-3xl font-bold">
                            {isEdit
                                ? "Edit Practice"
                                : "Add New Practice"}
                        </h2>

                        <button
                            onClick={() =>
                                navigate("/PracticeAdmin")
                            }
                            className="text-gray-400 text-2xl"
                        >
                            ×
                        </button>

                    </div>

                    <div className="mb-6">

                        <label className="block text-sm font-medium mb-2">
                            Practice Name
                        </label>

                        <input
                            type="text"
                            value={practiceName}
                            onChange={(e) =>
                                setPracticeName(e.target.value)
                            }
                            placeholder="e.g. Basic Grammar"
                            className="w-full h-14 rounded-xl border border-gray-300 px-5"
                        />

                    </div>

                    <div className="mb-6">

                        <label className="block text-sm font-medium mb-2">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows={5}
                            className="w-full rounded-xl border border-gray-300 p-5 resize-none"
                        />

                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-6 items-start">

                        {/* COURSE */}
                        <div className="relative z-20">

                            <label className="block text-sm font-medium mb-2">
                                Course
                            </label>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCourseDropdown(!showCourseDropdown)
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
                                        course
                                            ? "text-black"
                                            : "text-gray-400"
                                    }
                                >
                                    {course || "Select a course"}
                                </span>

                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showTypeDropdown ? "rotate-180" : ""
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
                                <div className="
                                    absolute z-50
                                    mt-2
                                    w-full
                                   bg-white
                                    border border-gray-300
                                    rounded-xl
                                    shadow-lg
                                    max-h-60
                                    overflow-y-auto
                                ">
                                    {courseOptions.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                setCourse(item);
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
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* TYPE */}
                        <div className="relative z-10">

                            <label className="block text-sm font-medium mb-2">
                                Type
                            </label>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowTypeDropdown(!showTypeDropdown)
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
                                        type
                                            ? "text-black"
                                            : "text-gray-400"
                                    }
                                >
                                    {type || "Select a type"}
                                </span>

                                <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showTypeDropdown ? "rotate-180" : ""
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

                            {showTypeDropdown && (
                                <div className="
                                    absolute z-50
                                    mt-2
                                    w-full
                                    bg-white
                                    border border-gray-300
                                    rounded-xl
                                    shadow-lg
                                    max-h-60
                                    overflow-y-auto
                                ">
                                    {typeOptions.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {
                                                setType(item);
                                                setShowTypeDropdown(false);
                                            }}
                                            className="
                                                w-full
                                                text-left
                                                px-5 py-3
                                                hover:bg-gray-100
                                                border-b last:border-b-0
                                            "
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-6">

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Number of Questions
                            </label>

                            <input
                                type="number"
                                value={questions}
                                onChange={(e) =>
                                    setQuestions(e.target.value)
                                }
                                className="w-full h-14 rounded-xl border border-gray-300 px-5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Duration (minutes)
                            </label>

                            <input
                                type="number"
                                value={duration}
                                onChange={(e) =>
                                    setDuration(e.target.value)
                                }
                                className="w-full h-14 rounded-xl border border-gray-300 px-5"
                            />
                        </div>

                    </div>

                    <div className="mb-10">

                        <label className="block text-sm font-medium mb-3">
                            Status
                        </label>

                        <div className="flex gap-8">

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={status === true}
                                    onChange={() =>
                                        setStatus(true)
                                    }
                                />
                                Active
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={status === false}
                                    onChange={() =>
                                        setStatus(false)
                                    }
                                />
                                Draft
                            </label>

                        </div>

                    </div>

                    <div className="flex gap-4">

                        <button
                            onClick={handleSubmit}
                            className="bg-[#ed1e28] hover:bg-red-700 text-white px-10 h-14 rounded-xl font-medium"
                        >
                            {isEdit
                                ? "Update Practice"
                                : "Create Practice"}
                        </button>

                        <button
                            onClick={handleCancel}
                            className="bg-gray-300 hover:bg-gray-400 px-10 h-14 rounded-xl font-medium"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </main >

        </div >
    );
};

export default PracticeForm;