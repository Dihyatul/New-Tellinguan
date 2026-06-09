import React from "react";
import { Link } from "react-router-dom";
import x21 from "../assets/2 1.png";
import Logout from "../assets/logout.png";
import Home from "../assets/home.png";
import Notif from "../assets/notification.png";

const Top = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("USER:", user);
  console.log("ROLE:", user.role);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const notifications =
    JSON.parse(localStorage.getItem("notifications")) || [];

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

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

          <div className="relative">
            <img
              src={Notif}
              alt="Notification"
              className="w-6 h-6"
            />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Home */}
          <Link to={user.role === "admin" ? "/Admin" : "/Course"}>
            <img
              src={Home}
              alt="Home"
              className="w-6 h-6 opacity-80 hover:opacity-100 transition cursor-pointer"
            />
          </Link>

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

export default Top;