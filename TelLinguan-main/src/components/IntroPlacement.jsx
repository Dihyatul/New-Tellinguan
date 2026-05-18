import React from "react";
import { Link } from "react-router-dom";

const IntroPlacement = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute -top-72 w-[150%] h-175 rounded-[50%] bg-linear-to-br from-[#871117] to-[#ED1E28] flex flex-col items-center justify-end pb-20"></div>
      <div className="relative z-10 w-full flex justify-center">

        <div className="w-[90vw] max-w-291.25 aspect-1165/619 bg-linear-to-r from-[#ED1E28] to-[#871117] p-1.5 rounded-3xl">

          <div className="bg-white rounded-3xl h-full w-full p-14 text-center shadow-xl flex flex-col justify-center items-center">

            <h1 className="text-3xl font-bold mb-6"> Welcome to the EPrT® Placement Test</h1>
            <p className="text-gray-600 mb-8 text-lg text-left"> Penilaian ini membantu menentukan level bahasa Inggris Anda dan menempatkan Anda <br /> pada kelas EPrT® Preparation yang paling sesuai.</p>
            <h2 className="text-2xl font-semibold mb-4"> Cara Kerja:</h2>
            <p className="text-gray-600 mb-12 text-lg text-left"> 
                1. Soal dirancang untuk menemukan batas kemampuan Anda secara bertahap. <br />
                2. Setiap jawaban bersifat final. Harap periksa kembali pilihan Anda sebelum menekan “Next”. <br />
                3. Setiap pengguna mendapat kombinasi soal berbeda dari bank soal yang luas.
            </p>

            <Link
              to="/Test"
              className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-semibold transition"
            >
              Let's Start!
            </Link>

          </div>
        </div>
      </div>
  </div>
  );
};

export default IntroPlacement;