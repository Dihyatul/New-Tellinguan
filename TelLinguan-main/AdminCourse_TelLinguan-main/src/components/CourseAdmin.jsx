import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

import Delete from "../assets/del.png";
import EditIcon from "../assets/edit.png";
import SubscriberIcon from "../assets/subs.png";
import LockIcon from "../assets/locked.png";
import UnlockIcon from "../assets/unlocked.png";
import ActiveIcon from "../assets/view.png";
import InactiveIcon from "../assets/viewoff.png";
import AssignedIcon from "../assets/assig.png";
import NoassignedIcon from "../assets/notassig.png";

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

const CourseAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [courses, setCourses] = useState(initialCourses);

  const [activeCourseMenu, setActiveCourseMenu] =
    useState("manage");

  /* NEW STATE */
  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [assignedUsers, setAssignedUsers] = useState([
    {
      initial: "JD",
      name: "Jenny Desi",
      email: "jennydesi@gmail.com",
    },
    {
      initial: "JD",
      name: "Jenny Desi",
      email: "jennydesi@gmail.com",
    },
    {
      initial: "JD",
      name: "Jenny Desi",
      email: "jennydesi@gmail.com",
    },
  ]);

  const [unassignedUsers, setUnassignedUsers] =
    useState([
      {
        initial: "AD",
        name: "Anderson Denny",
        email: "denny@gmail.com",
      },
    ]);

  const toggleActive = (index) => {
    const updatedCourses = [...courses];

    updatedCourses[index].active =
      !updatedCourses[index].active;

    setCourses(updatedCourses);
  };

  const toggleLocked = (index) => {
    const updatedCourses = [...courses];

    updatedCourses[index].locked =
      !updatedCourses[index].locked;

    setCourses(updatedCourses);
  };

  const assignUser = (user) => {
    setAssignedUsers([...assignedUsers, user]);

    setUnassignedUsers(
      unassignedUsers.filter(
        (item) => item.email !== user.email
      )
    );
  };

  const unassignUser = (user) => {
    setUnassignedUsers([...unassignedUsers, user]);

    setAssignedUsers(
      assignedUsers.filter(
        (item) => item.email !== user.email
      )
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

            const isActive = location.pathname === item.path;

            return (
              <div key={item.key}>

                {/* MAIN MENU */}
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

                {/* SUB MENU COURSE */}
                {item.key === "course" && isActive && (

                  <div className="ml-10 mt-3 space-y-2">

                    <button
                      onClick={() => setActiveCourseMenu("manage")}
                      className={`
                        w-full h-14 rounded-xl px-4
                        flex items-center
                        text-sm font-semibold
                        transition-all duration-200
                        ${activeCourseMenu === "manage"
                          ? "bg-[#ed1e28bf] text-white"
                          : "text-white hover:bg-[#ffffff10]"
                        }
                      `}
                    >
                      Manage Course
                    </button>

                    <button
                      onClick={() => setActiveCourseMenu("active")}
                      className={`
                        w-full h-14 rounded-xl px-4
                        flex items-center
                        text-sm font-semibold
                        transition-all duration-200
                        ${activeCourseMenu === "active"
                          ? "bg-[#ed1e28bf] text-white"
                          : "text-white hover:bg-[#ffffff10]"
                        }
                      `}
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

        {/* MANAGE COURSE */}
        {activeCourseMenu === "manage" && (
          <>

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
            <div className="flex items-center justify-between mb-8">

              <div>

                <h1 className="text-3xl font-bold text-black">
                  Course Management
                </h1>

                <p className="text-gray-400 mt-1">
                  Create and manage your courses
                </p>

              </div>

              <button
                onClick={() => navigate("/CourseForm")}
                className="bg-[#ed1e28] hover:bg-red-700 transition text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >

                <span className="text-lg">+</span>

                Add New Course

              </button>

            </div>

            {/* COURSE CARDS */}
            <div className="grid grid-cols-3 gap-8">

              {courses.map((course, index) => (

                <div
                  key={index}
                  className="bg-white rounded-3xl border-4 border-[#dfe5ee] p-6 shadow-sm relative"
                >

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => {

                      const confirmDelete = window.confirm(
                        `Delete ${course.title}?`
                      );

                      if (!confirmDelete) return;

                      const updatedCourses =
                        courses.filter(
                          (_, i) => i !== index
                        );

                      setCourses(updatedCourses);

                      initialCourses.splice(index, 1);

                    }}
                    className="absolute top-5 right-5 hover:scale-110 transition"
                  >

                    <img
                      src={Delete}
                      alt="Delete"
                      className="w-6 h-6 object-contain"
                    />

                  </button>

                  <p className="text-[#009dff] text-sm font-medium">
                    {course.section}
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {course.title}
                  </h2>

                  <p className="text-gray-500 text-sm mt-3 leading-6">
                    {course.description}
                  </p>

                  <div className="mt-4">

                    <h3 className="font-semibold text-gray-700 text-sm mb-2">
                      Coverage of material:
                    </h3>

                    <ul className="text-sm text-gray-500 space-y-1 list-disc pl-5">

                      {course.coverage.map((item, idx) => (
                        <li key={idx}>
                          {item}
                        </li>
                      ))}

                    </ul>

                  </div>

                  <p className="mt-6 text-sm text-gray-500">

                    <span className="font-semibold">
                      Total Lessons:
                    </span>{" "}

                    {course.lesson}

                  </p>

                  <button
                    onClick={() =>
                      navigate("/CourseForm", {
                        state: {
                          course,
                          editMode: true,
                        },
                      })
                    }
                    className="w-full mt-5 bg-gray-100 hover:bg-gray-200 transition rounded-xl py-3 text-gray-600 font-medium text-sm flex items-center justify-center gap-2"
                  >

                    <img
                      src={EditIcon}
                      alt="Edit"
                      className="w-4 h-4 object-contain"
                    />

                    Edit Course

                  </button>

                </div>

              ))}

            </div>

          </>
        )}

        {/* ACTIVE COURSE */}
        {activeCourseMenu === "active" && (
          <>

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

                  <div className="w-13 h-13 bg-white rounded-xl shadow-sm flex items-center justify-center">

                    <img
                      src={card.icon}
                      alt={card.title}
                      className="w-13 h-13 object-contain"
                    />

                  </div>

                </div>
              ))}

            </div>

            {/* HEADER */}
            <div className="mb-8">

              <h1 className="text-3xl font-bold text-black">
                Active Courses
              </h1>

              <p className="text-gray-400 mt-1">
                Monitor all active learning courses
              </p>

            </div>

            {/* ACTIVE COURSE CARDS */}
            <div className="grid grid-cols-3 gap-8">

              {courses.map((course, index) => (

                <div
                  key={index}
                  className="bg-white rounded-2xl border-[3px] border-slate-200 p-5 shadow-sm"
                >

                  <p className="text-[#009dff] text-sm font-medium">
                    {course.section}
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    {course.title}
                  </h2>

                  <p className="text-gray-500 text-sm mt-3 leading-6">
                    {course.description}
                  </p>

                  <div className="mt-4">

                    <h3 className="font-semibold text-gray-700 text-sm mb-2">
                      Coverage of material:
                    </h3>

                    <ul className="text-sm text-gray-500 space-y-1 list-disc pl-5">

                      {course.coverage.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}

                    </ul>

                  </div>

                  <p className="mt-6 text-sm text-gray-500">
                    <span className="font-semibold">
                      Total Lessons:
                    </span>{" "}
                    {course.lesson}
                  </p>

                  {/* SUBSCRIBER */}
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full mt-5 border border-red-300 bg-red-50 hover:bg-red-100 transition rounded-xl py-3 text-red-500 font-medium text-sm flex items-center justify-center gap-2"
                  >

                    <img
                      src={SubscriberIcon}
                      alt="Subscriber"
                      className="w-4 h-4 object-contain"
                    />

                    {course.subscriptions}

                  </button>

                  {/* CONTROL PANEL */}
                  <div className="mt-5 border border-gray-200 rounded-xl p-3">

                    <p className="text-xs text-gray-400 mb-3">
                      Control Panel
                    </p>

                    <div className="flex gap-3">

                      {/* ACTIVE */}
                      <button
                        onClick={() => toggleActive(index)}
                        className={`
                          flex-1 h-10 rounded-xl flex items-center justify-center gap-2
                          text-sm font-medium transition
                          ${course.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-500"
                          }
                        `}
                      >

                        <img
                          src={
                            course.active
                              ? ActiveIcon
                              : InactiveIcon
                          }
                          alt="Status"
                          className="w-4 h-4 object-contain"
                        />

                        {course.active
                          ? "Active"
                          : "Inactive"}

                      </button>

                      {/* LOCK */}
                      <button
                        onClick={() => toggleLocked(index)}
                        className={`
                          flex-1 h-10 rounded-xl flex items-center justify-center gap-2
                          text-sm font-medium transition
                          ${course.locked
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                          }
                        `}
                      >

                        <img
                          src={
                            course.locked
                              ? LockIcon
                              : UnlockIcon
                          }
                          alt="Lock Status"
                          className="w-4 h-4 object-contain"
                        />

                        {course.locked
                          ? "Locked"
                          : "Unlocked"}

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>
        )}

      </main>

      {/* ACTIVE COURSE VIEW SUBSCRIBER MODAL */}
      {selectedCourse && (

        <div className="fixed inset-0 z-50 flex">

          {/* BLUR BACKGROUND */}
          <div
            onClick={() => setSelectedCourse(null)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* RIGHT PANEL */}
          <div className="ml-auto relative w-107.5 h-full bg-white shadow-2xl overflow-y-auto">

            {/* HEADER */}
            <div className="p-6 border-b border-gray-200">

              <h2 className="text-3xl font-bold text-black">
                Course Access
              </h2>

              <p className="text-gray-400 mt-2 text-lg">
                {selectedCourse.title}
              </p>

            </div>

            {/* ASSIGNED */}
            <div className="p-6">

              <div className="flex items-center gap-2 mb-5">

                <img
                  src={AssignedIcon}
                  alt="Assigned"
                  className="w-6 h-6 object-contain"
                />

                <h3 className="text-xl font-semibold">
                  Assigned ({assignedUsers.length})
                </h3>

              </div>

              <div className="space-y-4">

                {assignedUsers.map((user, index) => (

                  <div
                    key={index}
                    className="bg-[#dff7df] border border-green-400 rounded-xl p-4 flex items-center justify-between"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                        {user.initial}
                      </div>

                      <div>

                        <h4 className="font-semibold text-sm">
                          {user.name}
                        </h4>

                        <p className="text-xs text-gray-500">
                          {user.email}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() => unassignUser(user)}
                      className="w-7 h-7 rounded-md border border-green-300 flex items-center justify-center text-green-700 hover:bg-green-100 transition"
                    >
                      −
                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* UNASSIGNED */}
            <div className="px-6 pb-6">

              <div className="flex items-center gap-2 mb-5">

                <img
                  src={NoassignedIcon}
                  alt="Not Assigned"
                  className="w-6 h-6 object-contain"
                />

                <h3 className="text-xl font-semibold">
                  Not Assigned ({unassignedUsers.length})
                </h3>

              </div>

              <div className="space-y-4">

                {unassignedUsers.map((user, index) => (

                  <div
                    key={index}
                    className="bg-gray-200 border border-gray-300 rounded-xl p-4 flex items-center justify-between"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold">
                        {user.initial}
                      </div>

                      <div>

                        <h4 className="font-semibold text-sm">
                          {user.name}
                        </h4>

                        <p className="text-xs text-gray-500">
                          {user.email}
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() => assignUser(user)}
                      className="w-7 h-7 rounded-md border border-gray-400 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition"
                    >
                      +
                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* ADD SUBSCRIBER */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-5 flex gap-3">

              <input
                type="text"
                placeholder="Name New Subscriber..."
                className="flex-1 h-12 rounded-xl border border-gray-300 px-4 outline-none"
              />

              <button
                className="bg-[#ed1e28] hover:bg-red-700 transition text-white px-6 rounded-xl font-medium"
              >
                + Add
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default CourseAdmin;