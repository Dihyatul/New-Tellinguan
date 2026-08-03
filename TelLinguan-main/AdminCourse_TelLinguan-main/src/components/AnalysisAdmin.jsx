import { useState, useEffect } from "react";
import { API_URL } from "../config.js";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardIcon from "../assets/Dashboard.png";
import CourseIcon from "../assets/Course.png";
import PracticeIcon from "../assets/Practice.png";
import ParticipantIcon from "../assets/Participants.png";
import PlacementIcon from "../assets/PlacementTest.png";
import MessageIcon from "../assets/Message.png";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", path: "/Admin", icon: DashboardIcon },
  { key: "course", label: "Course", path: "/CourseAdmin", icon: CourseIcon },
  { key: "practice", label: "Practice", path: "/PracticeAdmin", icon: PracticeIcon },
  { key: "participants", label: "Participants", path: "/ParticipantsAdmin", icon: ParticipantIcon },
  { key: "placement", label: "Placement Test", path: "/PlacementTestAdmin", icon: PlacementIcon },
  { key: "message", label: "Message", path: "/MessageAdmin", icon: MessageIcon },
];

const SPEED_COLOR = {
  Relax: "bg-blue-100 text-blue-600",
  Moderate: "bg-yellow-100 text-yellow-700",
  Intensive: "bg-red-100 text-red-600",
};

const AnalysisAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/analysis/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAnalyses(data);
      } catch {
        setError("Failed to load analyses.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  const filtered = analyses.filter((a) =>
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#b6252a] text-white flex flex-col p-5">
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
                className={`w-full h-14 flex items-center justify-between px-4 rounded-lg transition ${
                  isActive ? "bg-red-600 text-white" : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={item.icon} alt={item.label} className="w-8 h-8 object-contain" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Member Analysis</h1>
            <p className="text-gray-400 mt-1">Learning preferences submitted by members</p>
          </div>
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 w-72"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Total Submissions</p>
            <h2 className="text-2xl font-bold mt-1">{analyses.length}</h2>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Most Common Speed</p>
            <h2 className="text-2xl font-bold mt-1">
              {analyses.length
                ? Object.entries(
                    analyses.reduce((acc, a) => {
                      acc[a.speed] = (acc[a.speed] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
                : "—"}
            </h2>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm">Avg Study Hours/Day</p>
            <h2 className="text-2xl font-bold mt-1">
              {analyses.length
                ? (analyses.reduce((sum, a) => sum + Number(a.hours), 0) / analyses.length).toFixed(1) + "h"
                : "—"}
            </h2>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No analysis data found.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-6 py-4 font-medium">Member</th>
                  <th className="px-6 py-4 font-medium">Goals</th>
                  <th className="px-6 py-4 font-medium">Days</th>
                  <th className="px-6 py-4 font-medium">Times</th>
                  <th className="px-6 py-4 font-medium">Hours</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium">Speed</th>
                  <th className="px-6 py-4 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{a.username}</p>
                      <p className="text-xs text-gray-400">{a.email}</p>
                    </td>
                    <td className="px-6 py-4 max-w-[180px]">
                      <div className="flex flex-wrap gap-1">
                        {(a.goals || []).map((g, i) => (
                          <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">
                            {g.length > 20 ? g.slice(0, 20) + "…" : g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(a.days || []).map((d, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(a.times || []).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{a.hours}h</td>
                    <td className="px-6 py-4">{a.weeks} weeks</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${SPEED_COLOR[a.speed] || "bg-gray-100 text-gray-600"}`}>
                        {a.speed}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelected(a)}
                        className="text-red-600 hover:underline text-xs font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">{selected.username}</h2>
                <p className="text-sm text-gray-400">{selected.email}</p>
                {selected.instansi && <p className="text-xs text-gray-400">{selected.instansi}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium mb-1">Learning Goals</p>
                <ul className="list-disc pl-5 space-y-1">
                  {(selected.goals || []).map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Study Days</p>
                  <div className="flex flex-wrap gap-1">
                    {(selected.days || []).map((d, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Preferred Times</p>
                  <div className="flex flex-wrap gap-1">
                    {(selected.times || []).map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500 font-medium">Hours/Day</p>
                  <p className="font-semibold">{selected.hours}h</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Duration</p>
                  <p className="font-semibold">{selected.weeks} weeks</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Speed</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SPEED_COLOR[selected.speed] || "bg-gray-100"}`}>
                    {selected.speed}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 pt-2">
                Last updated: {new Date(selected.updated_at).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisAdmin;
