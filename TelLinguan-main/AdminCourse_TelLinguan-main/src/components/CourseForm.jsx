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

import { courses as initialCourses } from "./CourseMateri";

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

const CourseForm = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const editingCourse = location.state?.course;

  const isEdit = !!editingCourse;

  const [courses, setCourses] =
    useState(initialCourses);

  const [courseTitle, setCourseTitle] =
    useState(
      editingCourse?.title || ""
    );

  const [description, setDescription] =
    useState(
      editingCourse?.description || ""
    );

  const [totalLessons, setTotalLessons] =
    useState(
      editingCourse?.lesson?.replace(
        " Lessons",
        ""
      ) || ""
    );

  const [coverageItems, setCoverageItems] =
    useState(
      editingCourse?.coverage || [""]
    );

  const handleCoverageChange = (
    index,
    value
  ) => {

    const updated = [...coverageItems];

    updated[index] = value;

    setCoverageItems(updated);

  };

  const addCoverageItem = () => {

    setCoverageItems([
      ...coverageItems,
      "",
    ]);

  };

  const removeCoverageItem = (
    index
  ) => {

    const updated =
      coverageItems.filter(
        (_, i) => i !== index
      );

    setCoverageItems(updated);

  };

  const handleCancel = () => {

    navigate("/CourseAdmin");

  };

  const handleSubmit = () => {

    if (
      !courseTitle ||
      !description ||
      !totalLessons
    ) {

      alert(
        "Please complete all fields"
      );

      return;

    }

    if (isEdit) {

      const updatedCourses =
        initialCourses.map(
          (course) => {

            if (
              course.title ===
              editingCourse.title
            ) {

              return {
                ...course,
                title: courseTitle,
                description:
                  description,
                lesson: `${totalLessons} Lessons`,
                coverage:
                  coverageItems.filter(
                    (item) =>
                      item.trim() !== ""
                  ),
              };

            }

            return course;

          }
        );

      initialCourses.length = 0;

      initialCourses.push(
        ...updatedCourses
      );

      setCourses(updatedCourses);

      alert("Course updated!");

    } else {

      const newCourse = {
        section: `Section ${courses.length + 1}`,
        title: courseTitle,
        description: description,
        coverage:
          coverageItems.filter(
            (item) =>
              item.trim() !== ""
          ),
        lesson: `${totalLessons} Lessons`,
        subscriptions:
          "0 Subscriber Assigned",
        active: false,
        locked: true,
      };

      const updatedCourses = [
        ...courses,
        newCourse,
      ];

      setCourses(updatedCourses);

      initialCourses.push(
        newCourse
      );

      alert(
        "Course created successfully!"
      );

    }

    navigate("/CourseAdmin");

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
                item.key === "course" &&
                location.pathname === "/CourseForm"
              );

            return (
              <div key={item.key}>

                {/* MAIN MENU */}
                <button
                  onClick={() =>
                    navigate(item.path)
                  }
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

                {/* SUB MENU */}
                {item.key === "course" &&
                  isActive && (

                    <div className="ml-10 mt-3 space-y-2">

                      <button
                        onClick={() =>
                          navigate("/CourseAdmin")
                        }
                        className="
                          w-full h-14 rounded-xl px-4
                          flex items-center
                          text-sm font-semibold
                          transition-all duration-200
                          bg-[#ed1e28bf] text-white
                        "
                      >
                        Manage Course
                      </button>

                      <button
                        onClick={() =>
                          navigate("/CourseAdmin")
                        }
                        className="
                          w-full h-14 rounded-xl px-4
                          flex items-center
                          text-sm font-semibold
                          transition-all duration-200
                          text-white hover:bg-[#ffffff10]
                        "
                      >
                        Active Course
                      </button>

                    </div>

                  )}

              </div>
            );
          })}

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        {/* STATS */}
        <div className="grid grid-cols-4 gap-5 mb-8">

          {statsCards.map(
            (card, index) => (
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
            )
          )}

        </div>

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-black">
            Course Management
          </h1>

          <p className="text-gray-400 mt-1">
            Create and manage your courses
          </p>

        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl border-[3px] border-slate-200 shadow-sm p-10 max-w-5xl">

          {/* TOP */}
          <div className="flex items-center justify-between mb-8">

            <h2 className="text-3xl font-bold">

              {isEdit
                ? "Edit Course"
                : "Add New Course"}

            </h2>

            <button
              onClick={() =>
                navigate("/CourseAdmin")
              }
              className="text-gray-400 text-2xl"
            >
              ×
            </button>

          </div>

          {/* COURSE TITLE */}
          <div className="mb-6">

            <label className="block text-sm font-medium mb-2">
              Course Title
            </label>

            <input
              type="text"
              placeholder="e.g., Reading 2"
              value={courseTitle}
              onChange={(e) =>
                setCourseTitle(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-xl border border-gray-300 px-5 outline-none"
            />

          </div>

          {/* DESCRIPTION */}
          <div className="mb-6">

            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              placeholder="add description..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full h-40 rounded-xl border border-gray-300 p-5 outline-none resize-none"
            />

          </div>

          {/* LESSON + COVERAGE */}
          <div className="grid grid-cols-2 gap-8 mb-10">

            {/* LESSON */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Total Lessons
              </label>

              <input
                type="number"
                placeholder="0"
                value={totalLessons}
                onChange={(e) =>
                  setTotalLessons(
                    e.target.value
                  )
                }
                className="w-full h-14 rounded-xl border border-gray-300 px-5 outline-none"
              />

            </div>

            {/* COVERAGE */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="text-sm font-medium">
                  Coverage of Material
                </label>

                <button
                  type="button"
                  onClick={
                    addCoverageItem
                  }
                  className="text-red-500 text-sm"
                >
                  + Add Item
                </button>

              </div>

              <div className="space-y-3">

                {coverageItems.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >

                      <input
                        type="text"
                        placeholder={`Coverage item ${index + 1}`}
                        value={item}
                        onChange={(e) =>
                          handleCoverageChange(
                            index,
                            e.target
                              .value
                          )
                        }
                        className="flex-1 h-14 rounded-xl border border-gray-300 px-5 outline-none"
                      />

                      {coverageItems.length >
                        1 && (

                          <button
                            type="button"
                            onClick={() =>
                              removeCoverageItem(
                                index
                              )
                            }
                            className="w-10 h-10 rounded-xl bg-red-100 text-red-500 font-bold text-lg hover:bg-red-200 transition"
                          >
                            ×
                          </button>

                        )}

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

          {/* BUTTON */}
          <div className="flex gap-4">

            <button
              onClick={handleSubmit}
              className="bg-[#ed1e28] hover:bg-red-700 transition text-white px-10 h-14 rounded-xl font-medium"
            >

              {isEdit
                ? "Update Course"
                : "Create Course"}

            </button>

            <button
              onClick={
                handleCancel
              }
              className="bg-gray-300 hover:bg-gray-400 transition text-black px-10 h-14 rounded-xl font-medium"
            >
              Cancel
            </button>

          </div>

        </div>

      </main>

    </div>
  );
};

export default CourseForm;