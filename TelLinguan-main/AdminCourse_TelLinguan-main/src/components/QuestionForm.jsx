import { useState } from "react";
import { API_URL } from "../config.js";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";

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

import Import from "../assets/select.png";

import { questions } from "./Question";

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

const QuestionForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const editingQuestion = location.state?.question || null;

    const [questionType, setQuestionType] = useState(
        editingQuestion?.type || ""
    );

    const [cefr, setCefr] = useState(
        editingQuestion?.cefr || ""
    );

    const [question, setQuestion] = useState(
        editingQuestion?.question || ""
    );

    const [focus, setFocus] = useState(
        editingQuestion?.focus || ""
    );

    const [answer, setAnswer] = useState(
        editingQuestion?.answer ?? 0
    );

    const [options, setOptions] = useState(
        editingQuestion?.options || ["", "", "", ""]
    );

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!questionType) { alert("Please select a Question Type."); return; }
        if (!question.trim()) { alert("Please enter the question text."); return; }
        if (options.some((o) => !o.trim())) { alert("Please fill in all answer options."); return; }
        if (questionType === "listening" && !audioPreview) { alert("Please upload an audio file for listening questions."); return; }

        setSubmitting(true);

        const body = {
            type:      questionType,
            question:  question.trim(),
            options,
            answer,
            audio_url: questionType === "listening" ? audioPreview : null,
            passages:  questionType === "reading"   ? passages      : null,
        };

        try {
            let res;
            if (editingQuestion) {
                res = await fetch(`${API_URL}/api/questions/${editingQuestion.id}`, {
                    method:  "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:  `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(body),
                });
            } else {
                res = await fetch(`${API_URL}/api/questions`, {
                    method:  "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:  `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(body),
                });
            }

            const data = await res.json();
            if (!res.ok) { alert(data.message || "Failed to save question."); return; }

            navigate("/PlacementTestAdmin");
        } catch {
            alert("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(editingQuestion?.audio || "");
    const [audioUploading, setAudioUploading] = useState(false);
    const [audioError, setAudioError] = useState("");

    const handleAudioChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAudioFile(file);
        setAudioError("");
        setAudioUploading(true);

        const formData = new FormData();
        formData.append("audio", file);

        try {
            const res = await fetch(`${API_URL}/api/upload/audio`, {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setAudioPreview(data.url);
        } catch (err) {
            setAudioError(err.message || "Upload failed.");
        } finally {
            setAudioUploading(false);
        }
    };

    const [passages, setPassages] = useState(
        editingQuestion?.passages || []
    );

    const [currentParagraph, setCurrentParagraph] = useState("");

    const handleAddParagraph = () => {
        if (!currentParagraph.trim()) return;

        setPassages((prev) => [
            ...prev,
            currentParagraph.trim(),
        ]);

        setCurrentParagraph("");
    };

    const handleRemoveParagraph = (index) => {
        setPassages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const [grammarQuestionType, setGrammarQuestionType] =
        useState("");

    const [showGrammarDropdown, setShowGrammarDropdown] =
        useState(false);

    const grammarOptions = [
        "Fill in the blank",
        "Sentence Completion",
        "Error Recognition",
    ];

    const importMode = location.state?.importMode || false;

    const [selectedFile, setSelectedFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);

    const downloadTemplate = () => {
        const grammar = [
            { "Question Stem": "She ___ to school every day.", "Correct Answer": "goes", "Distractor 1": "go", "Distractor 2": "going", "Distractor 3": "gone", "Language Focus": "Simple Present", "CEFR": "A1" }
        ];
        const listening = [
            { "Question Stem": "What does the speaker say about the weather?", "Correct Answer": "It will rain tomorrow", "Distractor 1": "It will be sunny", "Distractor 2": "It will snow", "Distractor 3": "It will be cloudy", "Language Focus": "Listening Comprehension", "CEFR": "B1", "Audio URL": "" }
        ];
        const reading = [
            { "Question Stem": "What is the main idea of the passage?", "Correct Answer": "Climate change is a global issue", "Distractor 1": "Weather patterns change daily", "Distractor 2": "Scientists disagree on causes", "Distractor 3": "Governments are not acting", "Language Focus": "Main Idea", "CEFR": "B2" }
        ];
        const text1 = [
            { "Text": "Climate change refers to long-term shifts in global temperatures and weather patterns. While some of these shifts are natural, since the 1800s human activities have been the main driver of climate change." }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(grammar), "GRAMMAR");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(listening), "LISTENING");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(reading), "READING");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(text1), "TEXT 1");
        XLSX.writeFile(wb, "TelLinguan_Questions_Template.xlsx");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setImportResult(null);
    };

    const handleImportExcel = async () => {
        if (!selectedFile) {
            alert("Please select a file");
            return;
        }

        setImporting(true);
        setImportResult(null);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await fetch(`${API_URL}/api/upload/questions`, {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData,
            });

            const data = await res.json();
            setImportResult(data);

            if (data.inserted > 0) {
                setTimeout(() => navigate("/PlacementTestAdmin"), 2000);
            }
        } catch {
            setImportResult({ message: "Cannot connect to server.", inserted: 0, failed: 0, errors: [] });
        } finally {
            setImporting(false);
        }
    };


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
                        const isActive =
                            location.pathname === item.path ||
                            (
                                item.key === "placement" &&
                                location.pathname === "/QuestionForm"
                            );

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
                            Placement Test
                        </h1>

                        <p className="text-gray-400 mt-1">
                            Set questions for placement test
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        {/* IMPORT EXCEL */}
                        <button
                            onClick={() =>
                                navigate("/QuestionForm", {
                                    state: {
                                        importMode: true,
                                    },
                                })
                            }
                            className="
                    bg-white
                    border
                    border-gray-300
                    hover:bg-gray-50
                    transition
                    px-5
                    py-3
                    rounded-xl
                    font-medium
                    flex
                    items-center
                    gap-2
                    text-gray-700
                  "
                        >
                            <img
                                src={Import}
                                alt="Import"
                                className="w-4 h-4"
                            />

                            Import Excel
                        </button>

                        {/* ADD QUESTION */}
                        <button
                            onClick={() => navigate("/QuestionForm")}
                            className="
                    bg-[#ed1e28]
                    hover:bg-red-700
                    transition
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-medium
                    flex
                    items-center
                    gap-2
                  "
                        >
                            <span className="text-lg">+</span>

                            Add New Question
                        </button>

                    </div>

                </div>

                {importMode ? (

                    <div className="bg-white border border-gray-300 rounded-2xl p-8">

                        <h2 className="text-3xl font-bold mb-2">Import Questions from Excel</h2>
                        <p className="text-gray-400 mb-8">Upload a single Excel file with all three sections at once.</p>

                        {/* FORMAT INFO */}
                        <div className="border border-gray-300 rounded-xl p-5 bg-gray-50 mb-6">
                            <h3 className="font-semibold mb-3">Excel Sheet Format</h3>
                            <p className="text-sm text-gray-600 mb-3">Your Excel file needs <strong>4 sheets</strong> named exactly:</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-white rounded-lg p-3 border">
                                    <p className="font-semibold text-red-600">GRAMMAR</p>
                                    <p className="text-gray-500 text-xs mt-1">Question Stem, Correct Answer, Distractor 1-3, CEFR</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border">
                                    <p className="font-semibold text-blue-600">LISTENING</p>
                                    <p className="text-gray-500 text-xs mt-1">Question Stem, Correct Answer, Distractor 1-3, Audio URL</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border">
                                    <p className="font-semibold text-green-600">READING</p>
                                    <p className="text-gray-500 text-xs mt-1">Question Stem, Correct Answer, Distractor 1-3, CEFR</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border">
                                    <p className="font-semibold text-purple-600">TEXT 1</p>
                                    <p className="text-gray-500 text-xs mt-1">Reading passages (one per row)</p>
                                </div>
                            </div>
                        </div>

                        {/* DOWNLOAD TEMPLATE */}
                        <div className="bg-blue-50 border border-blue-300 rounded-xl p-5 mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-blue-700 mb-1">Download Template</h3>
                                <p className="text-sm text-blue-600">Get a sample Excel file with all 4 sheets pre-formatted.</p>
                            </div>
                            <button onClick={downloadTemplate} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm whitespace-nowrap">
                                Download Template
                            </button>
                        </div>

                        {/* FILE PICKER */}
                        <label className="h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 mb-6">
                            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
                            <img src={Import} alt="Import" className="w-12 h-12 mb-3 object-contain" />
                            <p className="font-medium">{selectedFile ? selectedFile.name : "Click to select Excel file"}</p>
                            <p className="text-sm text-gray-400 mt-1">.xlsx or .xls only</p>
                        </label>

                        {/* RESULT */}
                        {importResult && (
                            <div className={`rounded-xl p-4 mb-6 ${importResult.inserted > 0 ? "bg-green-50 border border-green-300" : "bg-red-50 border border-red-300"}`}>
                                <p className="font-semibold mb-1">{importResult.message}</p>
                                <p className="text-sm">✅ Inserted: <strong>{importResult.inserted}</strong> &nbsp; ❌ Failed: <strong>{importResult.failed}</strong></p>
                                {importResult.errors?.length > 0 && (
                                    <ul className="mt-2 text-xs text-red-600 space-y-1 max-h-32 overflow-y-auto">
                                        {importResult.errors.map((e, i) => (
                                            <li key={i}>Row {e.row}: {e.error}</li>
                                        ))}
                                    </ul>
                                )}
                                {importResult.inserted > 0 && <p className="text-xs text-green-600 mt-2">Redirecting to Placement Test...</p>}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleImportExcel}
                                disabled={importing || !selectedFile}
                                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg"
                            >
                                {importing ? "Importing..." : "Import Questions"}
                            </button>
                            <button onClick={() => navigate("/PlacementTestAdmin")} className="bg-gray-300 px-6 py-3 rounded-lg">
                                Cancel
                            </button>
                        </div>

                    </div>

                ) : (
                    <div className="bg-white border rounded-2xl p-8">

                        <h2 className="text-3xl font-bold mb-8">
                            {editingQuestion
                                ? "Edit Question"
                                : "Add New Question"}
                        </h2>

                        {/* TYPE */}

                        <label className="block mb-2 font-medium">
                            Question Type <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-3 gap-4 mb-6">

                            {["reading", "listening", "grammar"].map(
                                (item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() =>
                                            setQuestionType(item)
                                        }
                                        className={`border border-gray-300 rounded-xl py-3 capitalize
                    ${questionType === item
                                                ? "border-blue-500 bg-blue-50"
                                                : ""
                                            }`}
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        </div>

                        {/* CEFR */}

                        <label className="block mb-2 font-medium">
                            Difficulty Level <span className="text-red-500">*</span>
                        </label>

                        <div className="flex gap-4 mb-6">

                            {["A1", "A2", "B1", "B2", "C1"].map(
                                (item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setCefr(item)}
                                        className={`border border-gray-300 rounded-lg px-8 py-2
                    ${cefr === item
                                                ? "border-red-500 text-red-500"
                                                : ""
                                            }`}
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        </div>

                        {/* READING */}

                        {questionType === "reading" && (
                            <>
                                <label className="block mb-2 font-medium">
                                    Passage Paragraphs (Add one by one) <span className="text-red-500">*</span>
                                    <span className="text-red-500"> *</span>
                                </label>

                                <textarea
                                    rows={5}
                                    value={currentParagraph}
                                    onChange={(e) =>
                                        setCurrentParagraph(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg p-4"
                                    placeholder="Write a paragraph and click 'Add Paragraph' button..."
                                />

                                <button
                                    type="button"
                                    onClick={handleAddParagraph}
                                    className="
                mt-3
                bg-blue-500
                hover:bg-blue-600
                text-white
                px-5
                py-3
                rounded-lg
                flex
                items-center
                gap-2
            "
                                >
                                    <span className="text-lg">+</span>
                                    Add Paragraph
                                </button>

                                {/* LIST PARAGRAPH */}

                                {passages.length > 0 && (
                                    <div className="mt-5 space-y-3">

                                        {passages.map((paragraph, index) => (
                                            <div
                                                key={index}
                                                className="
                            border
                            rounded-lg
                            p-4
                            bg-gray-50
                        "
                                            >
                                                <div className="flex justify-between items-center mb-2">

                                                    <h4 className="font-semibold">
                                                        Paragraph {index + 1}
                                                    </h4>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveParagraph(index)
                                                        }
                                                        className="
                                    text-red-500
                                    hover:text-red-700
                                    text-sm
                                "
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                                <p className="text-gray-700 whitespace-pre-wrap">
                                                    {paragraph}
                                                </p>
                                            </div>
                                        ))}

                                    </div>
                                )}
                            </>
                        )}

                        {/* LISTENING */}

                        {questionType === "listening" && (
                            <>
                                <label className="block text-sm font-semibold mb-2">
                                    Audio File <span className="text-red-500">*</span>
                                </label>

                                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl py-6 cursor-pointer hover:bg-gray-50 mb-3">
                                    <input
                                        type="file"
                                        accept=".mp3,.wav,.ogg,.m4a,.aac"
                                        onChange={handleAudioChange}
                                        className="hidden"
                                    />
                                    <p className="text-sm font-medium text-gray-600">
                                        {audioFile ? audioFile.name : "Click to upload audio file"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">MP3, WAV, OGG, M4A, AAC — max 20MB</p>
                                </label>

                                {audioUploading && (
                                    <p className="text-sm text-blue-600 mb-3">Uploading...</p>
                                )}

                                {audioError && (
                                    <p className="text-sm text-red-500 mb-3">{audioError}</p>
                                )}

                                {audioPreview && !audioUploading && (
                                    <div className="mb-5">
                                        <p className="text-xs text-green-600 mb-1">Uploaded successfully</p>
                                        <audio controls className="w-full">
                                            <source src={audioPreview} />
                                        </audio>
                                    </div>
                                )}
                            </>
                        )}

                        {/* GRAMMAR */}

                        {questionType === "grammar" && (
                            <div className="relative z-20 mb-6">

                                <label className="block mb-2 font-medium">
                                    Grammar Question Type
                                </label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowGrammarDropdown(
                                            !showGrammarDropdown
                                        )
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
                                            grammarQuestionType
                                                ? "text-black"
                                                : "text-gray-400"
                                        }
                                    >
                                        {grammarQuestionType ||
                                            "Select Grammar Type"}
                                    </span>

                                    <svg
                                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showGrammarDropdown
                                            ? "rotate-180"
                                            : ""
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

                                {showGrammarDropdown && (
                                    <div
                                        className="
                    absolute z-50
                    mt-2
                    w-full
                    bg-white
                    border border-gray-300
                    rounded-xl
                    shadow-lg
                    overflow-hidden
                "
                                    >
                                        {grammarOptions.map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => {
                                                    setGrammarQuestionType(
                                                        item
                                                    );

                                                    setShowGrammarDropdown(
                                                        false
                                                    );
                                                }}
                                                className="
                            w-full
                            text-left
                            px-5 py-3
                            hover:bg-gray-100
                            border-b
                            last:border-b-0
                        "
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                )}

                            </div>
                        )}

                        {/* FOCUS */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Focus <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                value={focus}
                                onChange={(e) =>
                                    setFocus(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg p-3"
                                placeholder="Identifying Main Idea"
                            />

                        </div>

                        {/* QUESTION */}

                        <div className="mt-1">

                            <label className="block mb-2 font-medium">
                                Question <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                value={question}
                                onChange={(e) =>
                                    setQuestion(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg p-3 mb-6"
                                placeholder="Enter question..."
                            />
                        </div>

                        {/* OPTIONS */}
                        <div className="mt-1">
                            <label className="block mb-2 font-medium">
                                Answer Options <span className="text-red-500">*</span>
                            </label>

                            <div className="space-y-3">

                                {options.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <input
                                            type="radio"
                                            checked={answer === index}
                                            onChange={() =>
                                                setAnswer(index)
                                            }
                                        />

                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                                const copy = [...options];
                                                copy[index] =
                                                    e.target.value;
                                                setOptions(copy);
                                            }}
                                            className="flex-1 border border-gray-300 rounded-lg p-3"
                                            placeholder={`Option ${index + 1
                                                }`}
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* BUTTON */}

                        <div className="flex gap-4 mt-8">

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="bg-[#ed1e28] hover:bg-red-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg"
                            >
                                {submitting
                                    ? "Saving…"
                                    : editingQuestion
                                        ? "Update Question"
                                        : "Create Question"}
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/PlacementTestAdmin")
                                }
                                className="bg-gray-300 px-6 py-3 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                )}
            </main>
        </div>
    );
};

export default QuestionForm;