import React from "react";
import { Link } from "react-router-dom";
import klik from "../assets/klik.png";
import stars from "../assets/stars.png";    

const PlacementTest = () => {
  return (
    <div className="bg-white w-full min-h-screen relative overflow-hidden flex flex-col items-center">
      <div className="absolute -top-62.5 w-[150%] h-175 rounded-[50%] bg-[linear-gradient(121deg,#ed1e28_0%,#871117_100%)] flex flex-col items-center justify-start pt-90">
        <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 tracking-tight text-center">
          Level Up & Go Beyond!
        </h1>
        <p className="text-white text-2xl font-semibold text-center max-w-4xl ">
          Mulai dengan Placement Test, dapatkan prediksi tepat, dan atur jadwal belajarmu dengan bebas.
        </p>
      </div>

      <div className="relative mt-87.5 z-10">
        <div className="w-150 h-75 bg-[#d9d9d9] rounded-[30px] shadow-2xl flex items-center justify-center relative">
          <Link to="/IntroTest">
            <button className="bg-[#871116] text-white text-3xl font-semibold px-12 py-5 rounded-2xl hover:bg-[#a0151b] transition-colors shadow-lg">
              Let's Start!
            </button>
          </Link>
          <img
            className="absolute -top-20 -left-16 w-50 h-auto object-contain"
            alt="Hand Icon"
            src={klik}
          />
          <img
          
            className="absolute -bottom-10 -right-10 w-35 h-auto object-contain"
            alt="Star Icon"
            src={stars}
          />
        </div>
      </div>
    </div>
  );
};

export default PlacementTest;