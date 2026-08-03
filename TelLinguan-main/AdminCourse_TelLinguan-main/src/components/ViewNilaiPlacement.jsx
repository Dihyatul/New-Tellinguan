import { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardIcon  from "../assets/Dashboard.png";
import CourseIcon     from "../assets/Course.png";
import PracticeIcon   from "../assets/Practice.png";
import ParticipantIcon from "../assets/Participants.png";
import PlacementIcon  from "../assets/PlacementTest.png";
import MessageIcon    from "../assets/Message.png";

const sidebarItems = [
  { key: "dashboard",   label: "Dashboard",      path: "/Admin",              icon: DashboardIcon },
  { key: "course",      label: "Course",          path: "/CourseAdmin",        icon: CourseIcon },
  { key: "practice",   label: "Practice",        path: "/PracticeAdmin",      icon: PracticeIcon },
  { key: "participants",label: "Participants",    path: "/ParticipantsAdmin",  icon: ParticipantIcon },
  { key: "placement",  label: "Placement Test",  path: "/PlacementTestAdmin", icon: PlacementIcon },
  { key: "message",    label: "Message",         path: "/MessageAdmin",       icon: MessageIcon },
];

const CEFR_COLOR = {
  A1: "bg-red-100 text-red-600",
  A2: "bg-orange-100 text-orange-600",
  B1: "bg-green-100 text-green-700",
  B2: "bg-sky-100 text-sky-600",
  C1: "bg-purple-100 text-purple-700",
};

const LEVEL_COLOR = {
  Basic:        "bg-red-50 text-red-500",
  Intermediate: "bg-yellow-50 text-yellow-600",
  Proficient:   "bg-blue-50 text-blue-600",
  Advanced:     "bg-green-50 text-green-700",
};

const ViewNilaiPlacement = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/results/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = results.filter((r) =>
    r.username.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  const getKurang = (row) => {
    const rec = row.ml_result?.recommendation ?? row.recommendation ?? {};
    const kurang = rec.kurang ?? [];
    return kurang.length ? kurang.join(", ") : "—";
  };

  const getImprove = (row) => {
    const rec = row.ml_result?.recommendation ?? row.recommendation ?? {};
    const improve = rec.improve ?? [];
    return improve.length ? improve.join(" ") : "—";
  };

  const getCefr = (row) => row.ml_result?.cefr_level ?? "—";
  const getWeak = (row) => {
    const w = row.ml_result?.weak_sections ?? [];
    return w.length ? w.join(", ") : "—";
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5 shrink-0">
        <div className="bg-white text-black rounded-xl p-6 mb-8 text-center shadow-md">
          <h2 className="text-2xl font-bold text-[#b6252a]">Welcome Admin</h2>
          <p className="text-sm text-gray-500 mt-2">TelLinguan Dashboard</p>
        </div>

        <div className="space-y-3">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full h-14 flex items-center gap-3 px-4 rounded-lg transition ${
                  isActive ? "bg-red-600 text-white" : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                <img src={item.icon} alt={item.label} className="w-8 h-8 object-contain" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">Data Nilai Placement Test</h1>
            <p className="text-gray-400 mt-1">Hasil tes seluruh peserta</p>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Cari nama / email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 w-72 text-sm"
            />
            <button
              onClick={() => navigate("/PlacementTestAdmin")}
              className="bg-white border border-gray-300 hover:bg-gray-50 transition px-5 py-2 rounded-xl font-medium text-gray-700 text-sm"
            >
              ← Kembali
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Peserta", value: results.length },
            { label: "Sudah Ikut Tes",  value: results.length },
            { label: "Rata-rata Skor",
              value: results.length
                ? (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1) + "/30"
                : "—" },
            { label: "Level Terbanyak",
              value: (() => {
                if (!results.length) return "—";
                const count = {};
                results.forEach((r) => { count[r.level] = (count[r.level] || 0) + 1; });
                return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
              })() },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl px-5 py-4 shadow-sm">
              <p className="text-gray-500 text-xs">{c.label}</p>
              <h3 className="text-xl font-bold mt-1">{c.value}</h3>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">Belum ada data nilai.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-4 text-left w-8">#</th>
                  <th className="px-5 py-4 text-left">Peserta</th>
                  <th className="px-5 py-4 text-center">Skor</th>
                  <th className="px-5 py-4 text-center">Level</th>
                  <th className="px-5 py-4 text-center">CEFR</th>
                  <th className="px-5 py-4 text-left">Masih Kurang</th>
                  <th className="px-5 py-4 text-left">Yang Harus Ditingkatkan</th>
                  <th className="px-5 py-4 text-left">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-4 text-gray-400">{idx + 1}</td>

                    {/* Peserta */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">{row.username}</p>
                      <p className="text-xs text-gray-400">{row.email}</p>
                    </td>

                    {/* Skor */}
                    <td className="px-5 py-4 text-center">
                      <span className="font-bold text-gray-800">{row.score}</span>
                      <span className="text-gray-400">/{row.total_questions}</span>
                    </td>

                    {/* Level */}
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${LEVEL_COLOR[row.level] ?? "bg-gray-100 text-gray-600"}`}>
                        {row.level}
                      </span>
                    </td>

                    {/* CEFR */}
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${CEFR_COLOR[getCefr(row)] ?? "bg-gray-100 text-gray-500"}`}>
                        {getCefr(row)}
                      </span>
                    </td>

                    {/* Masih Kurang */}
                    <td className="px-5 py-4 text-gray-600 capitalize max-w-48">
                      <p className="leading-snug">{getWeak(row)}</p>
                    </td>

                    {/* Yang Harus Ditingkatkan */}
                    <td className="px-5 py-4 text-gray-600 max-w-64">
                      <p className="leading-snug">{getKurang(row)}</p>
                    </td>

                    {/* Tanggal */}
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewNilaiPlacement;
