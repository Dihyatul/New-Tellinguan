import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import x11 from "../assets/1 1.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // cek password sama
    if (form.newPassword !== form.confirmPassword) {
      alert("Password confirmation does not match!");
      return;
    }

    // cek batas 1 bulan
    const lastChange = localStorage.getItem("lastPasswordChange");

    if (lastChange) {
      const lastDate = new Date(lastChange);
      const now = new Date();

      const diffTime = now - lastDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 30) {
        alert(
          'Password can only be changed once every 30 days.'
        );
        return;
      }
    }

    // simulasi verifikasi email
    alert(`Verification email sent to ${form.email}`);

    // simpan password baru
    localStorage.setItem(
      "userPassword",
      form.newPassword
    );

    // simpan tanggal ganti password
    localStorage.setItem(
      "lastPasswordChange",
      new Date().toISOString()
    );

    alert("Password successfully changed!");

    navigate("/login");
  };

  return (
    <section className="min-h-screen bg-linear-to-r from-red-600 to-red-800 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10">

        {/* LEFT IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <img src={x11} alt="illustration" className="w-80" />
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

          <h2 className="text-lg mb-1">Reset Password</h2>
          <h1 className="text-2xl font-semibold">
            Forgot Password
          </h1>

          <p className="text-gray-600 mb-8">
            Enter your account information
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-sm">Email</label>
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
                required
              />
            </div>

            {/* USERNAME */}
            <div>
              <label className="text-sm">Username</label>
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
                required
              />
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="text-sm">
                New Password
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    newPassword: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Enter new password"
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 mt-1"
                placeholder="Confirm password"
                required
              />
            </div>

            {/* BUTTON */}
            <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;