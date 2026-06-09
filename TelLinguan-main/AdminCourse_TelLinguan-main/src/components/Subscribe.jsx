import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import x11 from "../assets/1 1.png";

const Subscribe = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ================= SUBSCRIBE =================
  const handleSubscribe = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ================= VALIDATION =================
    if (
      !form.username ||
      !form.password ||
      !form.email
    ) {
      setError("Please fill all fields.");
      return;
    }

    // ================= UPDATE USER =================
    const user =
      JSON.parse(localStorage.getItem("user")) || {};

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        username: form.username,
        subscribed: true,
      })
    );

    const notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    notifications.push({
      id: Date.now(),
      type: "subscription",
      username: form.username,
      email: form.email,
      message: `${form.username} requested course access`,
      createdAt: new Date().toISOString(),
      read: false,
    });

    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );

    setSuccess(
      "Permission request sent successfully!"
    );

    // ================= REDIRECT =================
    setTimeout(() => {
      navigate("/course");
    }, 1500);
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

        {/* RIGHT CARD */}
        <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

          <h2 className="text-lg mb-1">
            Welcome!
          </h2>

          <h1 className="text-2xl font-semibold">
            Permission
          </h1>

          <p className="text-gray-600 mb-8">
            Subscribe to Course TelLinguan
          </p>

          <form
            onSubmit={handleSubscribe}
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

            {/* EMAIL */}
            <div>
              <label className="text-sm">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Enter your email"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="text-green-600 text-sm text-center">
                {success}
              </div>
            )}

            {/* BUTTON */}
            <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">
              Send Permission
            </button>

          </form>

        </div>
      </div>
    </section>
  );
};

export default Subscribe;