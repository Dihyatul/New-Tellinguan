import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Header from "./components/Header";
import Top from "./components/Top";
import ScrollTop from "./components/ScrollTop";

// Auth Pages
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPass";
import Subscribe from "./components/Subscribe";

// User Pages
import Course from "./components/Course";
import Practice from "./components/Practice";
import Contact from "./components/Contact";
import Profile from "./components/Profile";

// Admin Pages
import Admin from "./components/AdminDashboard";
import CourseAdmin from "./components/CourseAdmin";
import CourseForm from "./components/CourseForm";
import PracticeAdmin from "./components/PracticeAdmin";
import PracticeForm from "./components/PracticeForm";
import ViewPracticeAdmin from "./components/ViewPracticeAdmin";
import ScheduleForm from "./components/ScheduleForm";
import ParticipantsAdmin from "./components/ParticipantsAdmin";
import PlacementTestAdmin from "./components/PlacementTestAdmin";
import QuestionForm from "./components/QuestionForm";
import MessageAdmin from "./components/MessageAdmin";
import AnalysisAdmin from "./components/AnalysisAdmin";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";
import SubscriberRoute from "./components/SubscriberRoute";

// ================= USER LAYOUT =================
const SubsLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

// ================= COURSE LAYOUT =================
const CourseLayout = () => {
  return (
    <>
      <Top />
      <ScrollTop />
      <Outlet />
    </>
  );
};

// ================= ADMIN LAYOUT =================
const AdminCourseLayout = () => {
  return (
    <>
      <Top />
      <ScrollTop />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <div>
      <Routes>

        {/* ================= AUTH ================= */}
        <Route element={<SubsLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/Subscribe" element={<Subscribe />} />
        </Route>

        {/* ================= USER ================= */}
        <Route element={<CourseLayout />}>

          <Route
            path="/Course"
            element={
              <SubscriberRoute>
                <Course />
              </SubscriberRoute>
            }
          />

          <Route
            path="/Practice"
            element={
              <SubscriberRoute>
                <Practice />
              </SubscriberRoute>
            }
          />

          <Route
            path="/Contact"
            element={
              <SubscriberRoute>
                <Contact />
              </SubscriberRoute>
            }
          />

          <Route
            path="/Profile"
            element={
              <SubscriberRoute>
                <Profile />
              </SubscriberRoute>
            }
          />

        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<AdminCourseLayout />}>

          <Route
            path="/Admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/CourseAdmin"
            element={
              <ProtectedRoute>
                <CourseAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/CourseForm"
            element={
              <ProtectedRoute>
                <CourseForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PracticeAdmin"
            element={
              <ProtectedRoute>
                <PracticeAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PracticeForm"
            element={
              <ProtectedRoute>
                <PracticeForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ViewPracticeAdmin/:id"
            element={
              <ProtectedRoute>
                <ViewPracticeAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ScheduleForm"
            element={
              <ProtectedRoute>
                <ScheduleForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ParticipantsAdmin"
            element={
              <ProtectedRoute>
                <ParticipantsAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PlacementTestAdmin"
            element={
              <ProtectedRoute>
                <PlacementTestAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/QuestionForm"
            element={
              <ProtectedRoute>
                <QuestionForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/MessageAdmin"
            element={
              <ProtectedRoute>
                <MessageAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AnalysisAdmin"
            element={
              <ProtectedRoute>
                <AnalysisAdmin />
              </ProtectedRoute>
            }
          />


        </Route>

      </Routes>
    </div>
  );
};

export default App;