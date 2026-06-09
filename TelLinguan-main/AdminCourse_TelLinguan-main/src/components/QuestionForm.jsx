import { useState } from "react";
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

    const handleSubmit = () => {
        const payload = {
            id: editingQuestion
                ? editingQuestion.id
                : Date.now(),

            type: questionType,
            question,
            options,
            answer,
            focus,
            cefr,
            active: true,
        };

        if (questionType === "reading") {
            payload.passages = passages;
        }

        payload.audio = audioPreview;

        const existingQuestions =
            JSON.parse(
                localStorage.getItem("placementQuestions")
            ) || [];

        if (editingQuestion) {

            const updatedQuestions =
                existingQuestions.map((item) =>
                    item.id === editingQuestion.id
                        ? payload
                        : item
                );

            localStorage.setItem(
                "placementQuestions",
                JSON.stringify(updatedQuestions)
            );

        } else {

            existingQuestions.push(payload);

            localStorage.setItem(
                "placementQuestions",
                JSON.stringify(existingQuestions)
            );

        }

        navigate("/PlacementTestAdmin");

        navigate("/PlacementTestAdmin");
    };

    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState("");

    const handleAudioChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setAudioFile(file);
        setAudioPreview(URL.createObjectURL(file));
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

    const downloadTemplate = () => {
        const template = [
            {
                type: "reading",
                difficulty: "A1",
                question: "What is the main idea of the passage?",
                option1: "Option A",
                option2: "Option B",
                option3: "Option C",
                option4: "Option D",
                correct_answer: 0,
                focus: "Main Idea",
                paragraph: "This is sample reading paragraph"
            }
        ];

        const worksheet =
            XLSX.utils.json_to_sheet(template);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Questions"
        );

        XLSX.writeFile(
            workbook,
            "Placement_Test_Template.xlsx"
        );
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setSelectedFile(file);
    };

    const handleImportExcel = () => {
        if (!selectedFile) {
            alert("Please select a file");
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;

            const workbook = XLSX.read(data, {
                type: "binary",
            });

            const sheetName =
                workbook.SheetNames[0];

            const worksheet =
                workbook.Sheets[sheetName];

            const jsonData =
                XLSX.utils.sheet_to_json(
                    worksheet
                );

            const importedQuestions =
                jsonData.map((row, index) => ({
                    id: Date.now() + index,

                    type: row.type,

                    cefr: row.difficulty,

                    question: row.question,

                    focus: row.focus,

                    options: [
                        row.option1,
                        row.option2,
                        row.option3,
                        row.option4,
                    ],

                    answer: Number(
                        row.correct_answer
                    ),

                    passages: row.paragraph
                        ? [row.paragraph]
                        : [],

                    audio:
                        row.audio_url || "",

                    active: true,
                }));

            const existing =
                JSON.parse(
                    localStorage.getItem(
                        "placementQuestions"
                    )
                ) || [];

            const merged = [
                ...existing,
                ...importedQuestions,
            ];

            localStorage.setItem(
                "placementQuestions",
                JSON.stringify(merged)
            );

            alert(
                `${importedQuestions.length} questions imported successfully`
            );

            navigate("/PlacementTestAdmin");
        };

        reader.readAsBinaryString(
            selectedFile
        );
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

                        <h2 className="text-3xl font-bold mb-8">
                            Import Questions from Excel
                        </h2>

                        <div className="border border-gray-300 rounded-xl p-5 bg-gray-50 mb-6">
                            <h3 className="font-semibold mb-3">
                                File Format Requirements:
                            </h3>

                            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                                <li>File must be CSV or XLSX format</li>
                                <li>Required columns: type, difficulty, question, option1, option2, option3, option4, correct_answer</li>
                                <li>Type must be reading, listening, or grammar</li>
                                <li>Difficulty must be A1, A2, B1, B2, C1</li>
                                <li>Correct answer = option index (0-3)</li>
                                <li>Reading requires paragraph column</li>
                                <li>Listening requires audio_url column</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-300 rounded-xl p-5 mb-6">

                            <h3 className="font-semibold text-blue-700 mb-2">
                                Download Template
                            </h3>

                            <p className="text-sm text-blue-600 mb-4">
                                Download sample excel template.
                            </p>

                            <button
                                onClick={downloadTemplate}
                                className="
                bg-blue-500
                hover:bg-blue-600
                text-white
                px-5
                py-2
                rounded-lg
            "
                            >
                                Download Template
                            </button>

                        </div>

                        <label className="block font-medium mb-3">
                            Select File
                        </label>

                        <label
                            className="
            h-40
            border-2
            border-dashed
            border-gray-300
            rounded-xl
            flex
            flex-col
            justify-center
            items-center
            cursor-pointer
            hover:bg-gray-50
        "
                        >
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div className="text-center">
                                <img
                                    src={Import}
                                    alt="Import"
                                    className="w-16 h-16 mx-auto mb-4 object-contain"
                                />

                                <p className="font-medium">
                                    Click to upload file
                                </p>

                                <p className="text-sm text-gray-400">
                                    CSV or XLSX files only
                                </p>

                                {selectedFile && (
                                    <p className="mt-3 text-green-600 font-medium">
                                        {selectedFile.name}
                                    </p>
                                )}
                            </div>

                        </label>

                        <div className="flex gap-3 mt-6">

                            <button
                                onClick={handleImportExcel}
                                className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-6
                py-3
                rounded-lg
            "
                            >
                                Import Question
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/PlacementTestAdmin")
                                }
                                className="
                bg-gray-300
                px-6
                py-3
                rounded-lg
            "
                            >
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

                                <input
                                    type="file"
                                    accept=".mp3,.wav"
                                    onChange={handleAudioChange}
                                    className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-4 mb-5"
                                />
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
                                className="bg-[#ed1e28] text-white px-6 py-3 rounded-lg"
                            >
                                {editingQuestion
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