import { useState } from "react";
import { API_URL } from "../config.js";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Registrasi = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    instansi: "",
    userName: "",
    nimNisn: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password tidak sama!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registrasi gagal.");
        return;
      }

      alert("Registrasi berhasil! Silakan login.");
      navigate("/Login");
    } catch (err) {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-red-600 to-red-800 flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-5xl p-10 rounded-xl shadow-lg">

        <h2 className="text-lg mb-1">Welcome!</h2>
        <h1 className="text-2xl font-semibold">Sign Up to</h1>
        <p className="text-gray-600 mb-8">TelLinguan</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          <Input label="Email Address" name="email" value={form.email} onChange={handleChange} />
          <Input label="Instansi" name="instansi" value={form.instansi} onChange={handleChange} />

          <Input label="User Name" name="userName" value={form.userName} onChange={handleChange} />
          <Input label="NIM/NISN" name="nimNisn" value={form.nimNisn} onChange={handleChange} />

          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />

          <div className="flex items-end justify-center">
            <div className="mt-6">
              <ReCAPTCHA
                sitekey="6LfMHagsAAAAAO3e6gLoWHaUjTs3mf6ZLPWUrtsh"
                onChange={(value) => console.log("Captcha value:", value)}
              />
            </div>
          </div>

          <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />

          <div className="col-span-2 flex flex-col items-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-115 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="w-full text-sm mt-3 text-gray-500 text-center translate-x-60">
              Already have an Account?{" "}
              <Link to="/Login" className="text-black font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={`Enter your ${label.toLowerCase()}`}
      className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-red-400"
    />
  </div>
);

export default Registrasi;
