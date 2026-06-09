import React from "react";
import { Link } from "react-router-dom";
import x21 from "../assets/2 1.png";
import Home from "../assets/home.png";

const Top = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      
      <div className="flex items-center justify-between px-6 md:px-10 py-4">
        
        {/* Logo kiri */}
        <Link to="/">
          <img
            src={x21}
            alt="TelLinguan Logo"
            className="h-14 md:h-20 w-auto"
          />
        </Link>

        {/* Icon Home kanan */}
        <Link to="/">
          <img
            src={Home}
            alt="Home"
            className="w-6 h-6 opacity-80 hover:opacity-100 transition"
          />
        </Link>

      </div>

    </header>
  );
};

export default Top;