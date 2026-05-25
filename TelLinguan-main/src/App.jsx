import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import ScrollTop from "./components/ScrollTop";
import WebLandingPage from "./components/WebLandingPage";
import About from "./components/About";
import PlacementTest from "./components/PlacementTest";
import IntroTest from "./components/IntroTest";
import ProtectedRoute from "./components/ProtectedRoute";
import Intro from "./components/Intro";
import Analysis from "./components/Analysis";
import IntroPlacement from "./components/IntroPlacement";
import Test from "./components/Test";
import Hasil from "./components/Hasil";
import Footer from "./components/Footer";
import Top from "./components/Top";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgetPass";
import Registrasi from "./components/Registrasi";
import Navbar from "./components/Navbar";
import Course from "./components/Course";
import Practice from "./components/Practice";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import UploadQuestions from "./components/UploadQuestions";


const MainLayout = () => {
  return (
    <>
      <Header />
      <ScrollTop />
      <Outlet />
      <Footer />
    </>
  );
};

const SignLayout = () => {
  return (
    <>
      <Top />
      <Outlet />
    </>
  );
};

const CourseLayout = () => {
  return (
    <>
      <Navbar />
      <ScrollTop />
      <Outlet />
    </>
  );
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <div>
      <Routes>
        {/* Route yang MENGGUNAKAN Header dan Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<WebLandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/placement" element={<PlacementTest />} />
          <Route path="/IntroTest" element={<IntroTest />} />
          <Route
            path="/Intro"
            element={
              <ProtectedRoute>
                <Intro />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />

          <Route
            path="/IntroPlacement"
            element={
              <ProtectedRoute>
                <IntroPlacement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Test"
            element={
              <ProtectedRoute>
                <Test />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Hasil"
            element={
              <ProtectedRoute>
                <Hasil />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* Route yang MENGGUNAKAN Layout Sign */}
        <Route element={<SignLayout />}>
          <Route path="/Login" element={<Login />} />
          <Route path="/Registrasi" element={<Registrasi />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Route yang MENGGUNAKAN Course Layout */}
      <Route element={<CourseLayout />}>
        <Route path="/Course" element={
          <ProtectedRoute>
            <Course />
          </ProtectedRoute>
          } 
          />

          <Route path="/Practice" element={
          <ProtectedRoute>
            <Practice />
          </ProtectedRoute>
          } 
          />

          <Route path="/Contact" element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
          } 
          />

          <Route path="/Profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
          } 
          />

        </Route>

        {/* Upload Questions - standalone page */}
        <Route path="/UploadQuestions" element={<UploadQuestions />} />

      </Routes>
    </div>
  )
};

export default App;