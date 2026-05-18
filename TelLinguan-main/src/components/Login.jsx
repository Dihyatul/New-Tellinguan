import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import x11 from "../assets/1 1.png";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/intro";

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(from, { replace: true });
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-linear-to-r from-red-600 to-red-800 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10">

        {/* LEFT - IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <img src={x11} alt="illustration" className="w-80" />
          </div>
        </div>

        {/* RIGHT - LOGIN CARD */}
        <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

          <h2 className="text-lg mb-1">Welcome!</h2>
          <h1 className="text-2xl font-semibold">Sign in to</h1>
          <p className="text-gray-600 mb-8">TelLinguan</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="text-sm">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="mt-5 flex items-center justify-center">
              <ReCAPTCHA
                sitekey="6LfMHagsAAAAAO3e6gLoWHaUjTs3mf6ZLPWUrtsh"
                onChange={(value) => console.log("Captcha:", value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link to="/registrasi" className="font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
