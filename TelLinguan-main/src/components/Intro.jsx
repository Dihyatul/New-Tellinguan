import React, { useState } from "react";
import { Link } from "react-router-dom";
import listeningImg from "../assets/1.1.png";
import writingImg from "../assets/3.3.png";
import readingImg from "../assets/2.2.png";
import speakingImg from "../assets/4.4.png";

const Intro = () => {
    const courses = [
        { title: "Listening", img: listeningImg },
        { title: "Writing", img: writingImg },
        { title: "Reading", img: readingImg },
        { title: "Speaking", img: speakingImg },
    ];
    
    const [page, setPage] = useState("intro"); 

    return (
        <section className="min-h-150 bg-white flex items-center justify-center px-2">

            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT CONTENT */}
                <div className="text-center md:text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-red-700 leading-tight">
                        GET YOUR PERSONAL <br /> COURSE ANALYSIS
                    </h1>

                    <Link to="/Analysis">
                        <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                            Get Your Personal Analysis
                        </button>
                    </Link>
                </div>

                {/* RIGHT CARDS */}
                <div className="grid grid-cols-2 gap-6 place-items-center">
                    {courses.map((icon, index) => (
                        <img
                            key={index}
                            src={icon.img}
                            alt={icon.title}
                            className="w-40 md:w-52 object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
                        />
                    ))}
                </div>
            </div>


        </section >
    );
};

export default Intro;