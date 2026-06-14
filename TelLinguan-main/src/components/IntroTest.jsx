import React from "react";
import { Link, useNavigate } from "react-router-dom";

const IntroTest = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      <div className="absolute -top-72 w-[150%] h-175 rounded-[50%] bg-linear-to-br from-[#871117] to-[#ED1E28] flex flex-col items-center justify-end pb-20"></div>
      <div className="relative z-10 w-full flex justify-center">

        <div className="w-[90vw] max-w-291.25 aspect-1165/619 bg-linear-to-r from-[#ED1E28] to-[#871117] p-1.5 rounded-3xl">

          <div className="bg-white rounded-3xl h-full w-full p-14 text-center shadow-xl flex flex-col justify-center items-center">

            <h2 className="text-3xl font-bold mb-6">
              Access Placement Test Now ✨
            </h2>

            {isLoggedIn ? (
              <>
                <p className="text-gray-600 mb-8 text-lg">
                  Anda sudah masuk. Klik tombol di bawah untuk memulai placement test.
                </p>
                <Link
                  to="/IntroPlacement"
                  className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-semibold transition"
                >
                  Let's Start!
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-8 text-lg">
                  Masuk ke akun Anda terlebih dahulu untuk mulai mengerjakan placement test.
                </p>
                <Link
                  to="/Login"
                  state={{ from: "/IntroPlacement" }}
                  className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-semibold transition"
                >
                  Sign In
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
  </div>
  );
};

export default IntroTest;