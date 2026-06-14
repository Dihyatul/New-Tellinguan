import { useState, useEffect } from "react";
import { API_URL } from "../config.js";

export const useAdminStats = () => {
  const [stats,       setStats]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: "Bearer admin-token" },
      }).then((r) => r.ok ? r.json() : null),

      fetch(`${API_URL}/api/courses`)
        .then((r) => r.ok ? r.json() : []),
    ])
      .then(([statsData, courseList]) => {
        setStats(statsData);
        setTotalCourses(Array.isArray(courseList) ? courseList.length : 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, totalCourses };
};
