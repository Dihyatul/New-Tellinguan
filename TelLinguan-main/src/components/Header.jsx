import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import x21 from "../assets/2 1.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Sync user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // Navigation items
  const navItems = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "About", path: "/about" },
    { id: 3, name: "Placement Test", path: "/placement" },
    { id: 4, name: "Course", path: "/course" },
  ];

  // Navigate to login
  const handleLoginClick = () => {
    navigate("/login", {
      state: { from: location.pathname },
    });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  // Active path checker
  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
      <div className="w-full flex items-center px-6 md:px-10 py-4">
        <Link to="/">
          <img
            src={x21}
            alt="TelLinguan Logo"
            className="h-16 md:h-20 w-auto cursor-pointer"
          />
        </Link>
        <div className="ml-auto flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-4">

            {navItems.map((item) => {
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-300
                  ${
                    isActive
                      ? "bg-red-600 text-white shadow-md"
                      : "text-black hover:text-red-600"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

          </nav>

          {/* AUTH SECTION */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">

              {/* PROFILE LINK */}
              <Link
                to="/profile"
                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition-all duration-300"
              >

                {/* AVATAR */}
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user.username?.charAt(0).toUpperCase()}
                </div>

                {/* USERNAME */}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {user.username}
                  </span>

                  <span className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </span>
                </div>

              </Link>

              {/* LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                Logout
              </button>

            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="hidden md:block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-md"
            >
              Sign in
            </button>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-3xl text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 bg-white border-t border-gray-200 shadow-lg">

          {/* MOBILE NAVIGATION */}
          <div className="space-y-2 mt-4">

            {navItems.map((item) => {
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-black hover:text-red-600 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

          </div>

          {/* MOBILE AUTH */}
          <div className="mt-6">

            {user ? (
              <div className="space-y-3">

                {/* PROFILE */}
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl"
                >

                  {/* AVATAR */}
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>

                  {/* USER INFO */}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {user.username}
                    </h3>

                    <p className="text-sm text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>

                </Link>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Logout
                </button>

              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
              >
                Sign in
              </button>
            )}

          </div>

        </div>
      )}
    </header>
  );
};

export default Header;