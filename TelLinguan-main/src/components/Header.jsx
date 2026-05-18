import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import x21 from "../assets/2 1.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Re-read localStorage whenever the route changes so the header stays in sync
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  const navItems = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "About", path: "/about" },
    { id: 3, name: "Placement Test", path: "/placement" },
    { id: 4, name: "Course", path: "/course" },
  ];

  const handleLoginClick = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white border-b border-gray-300 sticky top-0 z-50">
      <div className="w-full flex items-center px-6 md:px-10 py-4">

        {/* Logo */}
        <Link to="/">
          <img src={x21} alt="TelLinguan Logo" className="h-16 md:h-20 w-auto cursor-pointer" />
        </Link>

        {/* Right Section */}
        <div className="ml-auto flex items-center space-x-6">

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-semibold text-lg transition-colors
                    ${isActive ? "bg-red-600 text-white" : "text-black hover:text-red-600"}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Button */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="font-semibold text-gray-700">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="hidden md:block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Sign in
            </button>
          )}

          {/* Mobile Toggle */}
          <button className="md:hidden text-3xl" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`block px-4 py-2 rounded-lg font-semibold
                  ${isActive ? "bg-red-600 text-white" : "text-black hover:text-red-600"}`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}

          {user ? (
            <>
              <p className="px-4 py-2 font-semibold text-gray-700">Hi, {user.username}</p>
              <button
                onClick={handleLogout}
                className="block w-full bg-gray-200 text-gray-800 text-center px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="block w-full bg-red-600 text-white text-center px-6 py-2 rounded-lg font-semibold hover:bg-red-700 mt-2"
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
