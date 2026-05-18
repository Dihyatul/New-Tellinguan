import React from "react";
import { Link } from "react-router-dom";
import x21 from "../assets/2 1.png";
import Logout from "../assets/logout.png";
import Home from "../assets/home.png";
import Notif from "../assets/notification.png";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-10 py-4">

        <Link to="/">
          <img
            src={x21}
            alt="TelLinguan Logo"
            className="h-14 md:h-20 w-auto"
          />
        </Link>

        <div className="flex items-center gap-4">

          {/* Notification */}
          <button>
            <img
              src={Notif}
              alt="Notification"
              className="w-6 h-6 opacity-80 hover:opacity-100 transition cursor-pointer"
            />
          </button>


          {/* Home / Course */}
          <Link to="/Course">
            <img
              src={Home}
              alt="Course"
              className="w-6 h-6 opacity-80 hover:opacity-100 transition cursor-pointer"
            />
          </Link>

          {/* Logout */}
          <button onClick={handleLogout}>
            <img
              src={Logout}
              alt="Logout"
              className="w-6 h-6 opacity-80 hover:opacity-100 transition cursor-pointer"
            />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;