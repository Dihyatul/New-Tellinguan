import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import x11 from "../assets/1 1.png";
import ReCAPTCHA from "react-google-recaptcha";
import { API_URL } from "../config.js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/intro";

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // ================= CAPTCHA CHECK =================
    if (!captchaValue) {
      setError("Please complete the captcha.");
      return;
    }

    // ================= ADMIN LOGIN =================
    try {
      const res = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data.user.username,
            role: "admin",
            subscribed: true,
          })
        );
        navigate("/Admin", { replace: true });
        return;
      }
    } catch {
      // network error — fall through to other login checks
    }

    // ================= USER LOGIN =================
    if (
      form.username === "user" &&
      form.password === "user123"
    ) {

      // ================= DUMMY SUBSCRIBE STATUS =================
      // ubah true / false untuk testing
      const isSubscribed = true;

      localStorage.setItem("token", "user-token");

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: "user",
          role: "user",
          subscribed: isSubscribed,
        })
      );

      // ================= REDIRECT =================
      if (isSubscribed) {
        navigate("/Course", { replace: true });
      } else {
        navigate("/Subscribe", { replace: true });
      }

      return;
    }

    // ================= INVALID LOGIN =================
    setError("Username or password is incorrect.");
  };

  return (
    <section className="min-h-screen bg-linear-to-r from-red-600 to-red-800 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10">

        {/* LEFT IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <img
              src={x11}
              alt="illustration"
              className="w-80"
            />
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

          <h2 className="text-lg mb-1">
            Welcome!
          </h2>

          <h1 className="text-2xl font-semibold">
            Sign in to
          </h1>

          <p className="text-gray-600 mb-8">
            TelLinguan
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            {/* USERNAME */}
            <div>
              <label className="text-sm">
                Username
              </label>

              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Enter your username"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm">
                Password
              </label>

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Enter your password"
              />
            </div>

            {/* CAPTCHA */}
            <div className="mt-5 flex items-center justify-center">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={(value) =>
                  setCaptchaValue(value)
                }
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-red-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">
              Login
            </button>
          </form>

          {/* SIGN UP */}
          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/registrasi"
              className="font-semibold text-red-600"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
};

export default Login;