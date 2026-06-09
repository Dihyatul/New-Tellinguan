import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

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

import Edit from "../assets/edit.png";
import Delete from "../assets/delM.png";
import IconQuestion from "../assets/jmlQ.png";
import IconDuration from "../assets/jmlD.png";

import { practices as initialPractice } from "./PracticeMateri";
import { questionspractice } from "./QuestionPractice";

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

const ViewQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const practices = initialPractice;

    const { id } = useParams();

    const practice = practices[id] || practices[0];

    const isListening =
        practice.course?.toLowerCase().includes("listening");

    const [question, setQuestion] = useState("");
    const [text, setText] = useState("");
    const [answer, setAnswer] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [audio, setAudio] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [questionPractices, setQuestionPractices] = useState(questionspractice);
    const [editQuestion, setEditQuestion] = useState(null);
    const [listeningMode, setListeningMode] = useState("fill");

    const filteredQuestions =
        questionPractices.filter(
            item => item.practiceId === practice.id
        );

    const handleQuestionSubmit = () => {
        if (!question) {
            alert("Please enter a question");
            return;
        }

        if (editQuestion) {
            const updatedQuestions = questionPractices.map((item) => {
                if (item.id === editQuestion.id) {
                    return {
                        ...item,
                        question,
                        text,
                        answer,
                        options,
                        audio,
                    };
                }

                return item;
            });

            localStorage.setItem(
                "questionPractices",
                JSON.stringify(updatedQuestions)
            );

            setQuestionPractices(updatedQuestions);

            alert("Question updated successfully!");
        } else {
            const newQuestion = {
                id: Date.now(),
                practiceId: practice.id,
                question,
                text,
                answer,
                options,
                audio,
                practiceType: practice.type,
            };

            const updatedQuestions = [
                ...questionPractices,
                newQuestion,
            ];

            localStorage.setItem(
                "questionPractices",
                JSON.stringify(updatedQuestions)
            );

            setQuestionPractices(updatedQuestions);

            alert("Question created successfully!");
        }

        setShowForm(false);
        setEditQuestion(null);
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
                                (
                                    location.pathname === "/PracticeForm" ||
                                    location.pathname.startsWith("/ViewPracticeAdmin")
                                )
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

                <div className="flex justify-end mb-4">

                    <button
                        onClick={() => navigate("/PracticeAdmin")}
                        className="text-gray-400 text-2xl hover:text-red-500"
                    >
                        ×
                    </button>

                </div>



                {/* PRACTICE INFO */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">

                    <div className="flex justify-between items-start">

                        <div>
                            <h2 className="text-2xl font-bold">
                                {practice.title}
                            </h2>

                            <p className="text-gray-500 mt-1">
                                {practice.course}
                            </p>
                        </div>

                        <div className="flex gap-3">

                            <span
                                className={`px-4 py-1 rounded-full text-xs font-semibold
                                    ${practice.type === "Multiple Choice"
                                        ? "bg-blue-100 text-blue-600"
                                        : practice.type === "Fill in the Blank"
                                            ? "bg-green-100 text-green-600"
                                            : practice.type === "Error Recognition"
                                                ? "bg-[#FFE8C2] text-[#FE8412]"
                                                : practice.type === "Listening"
                                                    ? "bg-purple-100 text-purple-600"
                                                    : "bg-gray-100 text-gray-600"
                                    }
                                `}
                            >
                                {practice.type}
                            </span>

                            <span
                                className={`px-4 py-1 rounded-full text-xs font-semibold
                            ${practice.status
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {practice.status ? "Active" : "Draft"}
                            </span>

                        </div>

                    </div>

                    <div className="flex gap-8 mt-5">

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                                <img
                                    src={IconQuestion}
                                    alt="Question"
                                    className="w-5 h-5 object-contain"
                                />
                            </div>

                            <div>
                                <p className="text-gray-400 text-xs">
                                    Question
                                </p>

                                <p className="font-medium text-sm">
                                    {practice.quantity}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#FFF4E5] flex items-center justify-center">
                                <img
                                    src={IconDuration}
                                    alt="Duration"
                                    className="w-5 h-5 object-contain"
                                />
                            </div>

                            <div>
                                <p className="text-gray-400 text-xs">
                                    Duration
                                </p>

                                <p className="font-medium text-sm">
                                    {practice.duration}
                                </p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* QUESTION HEADER */}
                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-2xl font-bold">
                        Question
                    </h2>

                    <button
                        onClick={() => {
                            setEditQuestion(null);
                            setListeningMode("fill");
                            setShowForm(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg font-medium"
                    >
                        + Add New Question
                    </button>

                </div>

                {/* ADD/EDIT QUESTION FORM */}
                {showForm && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">

                        <h2 className="text-xl font-semibold mb-5">
                            {editQuestion ? "Edit Question" : "Add New Question"}
                        </h2>

                        {/* MULTIPLE CHOICE */}
                        {practice.type === "Multiple Choice" && (
                            <>
                                {/* Question */}
                                <label className="block text-sm font-semibold mb-2">
                                    Question <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    defaultValue={editQuestion?.question || ""}
                                    placeholder="Enter your question here..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
                                />

                                {/* Text Optional */}
                                <label className="block text-sm font-semibold mb-2">
                                    Text (Optional)
                                </label>

                                <textarea
                                    rows={5}
                                    defaultValue={editQuestion?.text || ""}
                                    placeholder="Enter your text here..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 resize-none"
                                />

                                {/* Answer Options */}
                                <label className="block text-sm font-semibold mb-4">
                                    Answer Options (Select the correct one)
                                    <span className="text-red-500"> *</span>
                                </label>

                                {["A", "B", "C", "D"].map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 mb-3"
                                    >
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            defaultChecked={
                                                editQuestion?.answer ===
                                                editQuestion?.options?.[index]
                                            }
                                            className="w-5 h-5 accent-blue-500"
                                        />

                                        <input
                                            type="text"
                                            defaultValue={
                                                editQuestion?.options?.[index] || ""
                                            }
                                            placeholder={`Option ${option}`}
                                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                                        />
                                    </div>
                                ))}
                            </>
                        )}

                        {/* ERROR RECOGNITION */}
                        {practice.type === "Error Recognition" && (
                            <>
                                {/* Question */}
                                <label className="block text-sm font-semibold mb-2">
                                    Question <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    defaultValue={editQuestion?.question || ""}
                                    placeholder="e.g. She ___ to school every day."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
                                />

                                {/* Error & Correct Word */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Error Word <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            defaultValue={editQuestion?.error || ""}
                                            placeholder="e.g. go"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Correct Word <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            defaultValue={editQuestion?.correct || ""}
                                            placeholder="e.g. goes"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* LISTENING */}
                        {(editQuestion?.practiceType === "Listening" || isListening) && (
                            <>
                                {/* Audio Upload */}
                                <label className="block text-sm font-semibold mb-2">
                                    Audio URL <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="file"
                                    accept=".mp3,.wav"
                                    className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-4 mb-5"
                                />

                                <label className="block text-sm font-semibold mb-2">
                                    Question Type
                                    <span className="text-red-500"> *</span>
                                </label>

                                <div className="relative mb-5">
                                    <select
                                        value={listeningMode}
                                        defaultValue={editQuestion?.audio || ""}
                                        className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-12 bg-white"
                                    >
                                        <option value="fill">Fill in the Blank</option>
                                        <option value="multiple">Multiple Choice</option>
                                    </select>

                                    <svg
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
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
                                </div>

                                {/* Preview Audio */}
                                {editQuestion?.audio && (
                                    <audio
                                        controls
                                        className="w-full mb-5"
                                    >
                                        <source
                                            src={editQuestion.audio}
                                            type="audio/mpeg"
                                        />
                                    </audio>
                                )}

                                {/* Question */}
                                <label className="block text-sm font-semibold mb-2">
                                    Question <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    defaultValue={editQuestion?.question || ""}
                                    placeholder="Enter your question here..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5"
                                />

                                {/* Listening Multiple Choice */}
                                {listeningMode === "multiple" ? (
                                    <>
                                        {/* Text Optional */}
                                        <label className="block text-sm font-semibold mb-2">
                                            Text (Optional)
                                        </label>

                                        <textarea
                                            rows={5}
                                            defaultValue={editQuestion?.text || ""}
                                            placeholder="Enter your text here..."
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-5 resize-none"
                                        />

                                        <label className="block text-sm font-semibold mb-4">
                                            Answer Options
                                            <span className="text-red-500"> *</span>
                                        </label>

                                        {["A", "B", "C", "D"].map((option, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 mb-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name="listeningAnswer"
                                                    defaultChecked={
                                                        editQuestion?.answer ===
                                                        editQuestion?.options?.[index]
                                                    }
                                                    className="w-5 h-5 accent-blue-500"
                                                />

                                                <input
                                                    type="text"
                                                    defaultValue={
                                                        editQuestion?.options?.[index] || ""
                                                    }
                                                    placeholder={`Option ${option}`}
                                                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                                                />
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {/* Fill In Blank */}
                                        <label className="block text-sm font-semibold mb-2">
                                            Correct Answer
                                            <span className="text-red-500"> *</span>
                                        </label>

                                        <input
                                            type="text"
                                            defaultValue={editQuestion?.answer || ""}
                                            placeholder="e.g. sunny"
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {/* FILL IN THE BLANK */}
                        {!isListening &&
                            practice.type === "Fill in the Blank" && (
                                <>
                                    {/* Question */}
                                    <label className="block text-sm font-semibold mb-2">
                                        Question <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        defaultValue={editQuestion?.question || ""}
                                        placeholder="Enter your question here..."
                                        className="w-full border border-gray-300 rounded-xl px-4 py-4 mb-6"
                                    />

                                    {/* Correct Answer */}
                                    <label className="block text-sm font-semibold mb-2">
                                        Correct Answer <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        defaultValue={editQuestion?.answer || ""}
                                        placeholder="e.g. goes"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-4"
                                    />
                                </>
                            )}

                        <div className="flex gap-3 mt-6">

                            <button
                                onClick={handleQuestionSubmit}
                                className="bg-red-500 text-white px-5 py-2 rounded-lg"
                            >
                                {editQuestion
                                    ? "Update Question"
                                    : "Create Question"}
                            </button>

                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditQuestion(null);
                                }}
                                className="bg-gray-200 px-5 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>
                )}

                {/* QUESTION LIST */}
                <div className="space-y-5">

                    {filteredQuestions.map((item, index) => (

                        <div
                            key={item.id}
                            className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm"
                        >

                            {/* TOP */}
                            <div className="flex justify-between items-center mb-4">

                                <div className="flex items-center gap-4">

                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                                        {index + 1}
                                    </div>

                                    <div className="flex items-center gap-2">

                                        {isListening && (
                                            <span className="text-[#FE8412] text-lg">
                                                🔊
                                            </span>
                                        )}

                                        <h3 className="font-medium">
                                            {item.question || item.sentence}
                                        </h3>

                                    </div>

                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => {
                                            setEditQuestion(item);
                                            setShowForm(true);
                                            setListeningMode(
                                                item.options?.length > 0
                                                    ? "multiple"
                                                    : "fill"
                                            );
                                        }}
                                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center"
                                    >
                                        <img
                                            src={Edit}
                                            alt="edit"
                                            className="w-4 h-4"
                                        />
                                    </button>

                                    <button
                                        onClick={() => {
                                            const confirmDelete = window.confirm(
                                                `Delete this question?`
                                            );

                                            if (!confirmDelete) return;

                                            const updatedQuestions = questionPractices.filter(
                                                (question) => question.id !== item.id
                                            );

                                            setQuestionPractices(updatedQuestions);

                                            localStorage.setItem(
                                                "questionPractices",
                                                JSON.stringify(updatedQuestions)
                                            );
                                        }}
                                        className="
                                            w-8 h-8
                                            rounded-lg
                                            bg-red-100
                                            flex
                                            items-center
                                            justify-center
                                            hover:bg-red-200
                                        "
                                    >
                                        <img
                                            src={Delete}
                                            alt="delete"
                                            className="w-4 h-4"
                                        />
                                    </button>

                                </div>

                            </div>

                            {/* MULTIPLE CHOICE */}
                            {item.practiceType === "Multiple Choice" && (

                                <div className="grid grid-cols-2 gap-3">

                                    {item.options.map((option) => (
                                        <div
                                            key={option}
                                            className={`
                                            flex items-center gap-3
                                            border rounded-lg px-4 py-3
                                            ${option === item.answer
                                                    ? "bg-green-100 border-green-500"
                                                    : "bg-white border-gray-300"
                                                }
                                        `}
                                        >

                                            <div
                                                className={`
                                                w-4 h-4 rounded-full
                                                ${option === item.answer
                                                        ? "bg-green-600"
                                                        : "border border-gray-500"
                                                    }
                                            `}
                                            />

                                            {option}

                                        </div>
                                    ))}

                                </div>

                            )}

                            {/* ERROR RECOGNITION */}
                            {item.practiceType ===
                                "Error Recognition" && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">

                                        <div className="flex gap-8 text-sm">

                                            <span>
                                                <strong>Error:</strong> {item.error}
                                            </span>

                                            <span>
                                                <strong>Correct:</strong> {item.correct}
                                            </span>

                                        </div>

                                    </div>
                                )}

                            {/* FILL IN BLANK */}
                            {item.practiceType === "Fill in the Blank" && (
                                <div className="bg-slate-50 border border-gray-300 rounded-lg p-4">

                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium">
                                        Answer: {item.answer}
                                    </span>

                                </div>
                            )}

                            {/* LISTENING */}
                            {item.practiceType === "Listening" && (
                                <div className="border rounded-lg p-4 bg-white">

                                    <audio
                                        controls
                                        className="w-full mb-4"
                                    >
                                        <source
                                            src={item.audio}
                                            type="audio/mpeg"
                                        />
                                    </audio>

                                    <p className="font-medium mb-4">
                                        {item.question}
                                    </p>

                                    {/* Listening Multiple Choice */}
                                    {item.options?.length > 0 ? (
                                        <div className="space-y-2">
                                            {item.options.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className={`border rounded-lg px-4 py-2 ${option === item.answer
                                                        ? "bg-green-100 border-green-500"
                                                        : "bg-gray-50"
                                                        }`}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Listening Fill in the Blank */
                                        <div className="bg-green-100 border border-green-500 rounded-lg px-4 py-2">
                                            <span className="font-semibold">
                                                Answer:
                                            </span>{" "}
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </main>
        </div>
    );
};

export default ViewQuestion;