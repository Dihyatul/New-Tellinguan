const pool = require("../config/db");
const { decrypt } = require("../crypto/dbCrypto");

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      participants,
      subscribers,
      questions,
      listeningQ,
      levelDist,
      monthlyUsers,
      monthlySubscribers,
      recentActivity,
      goalRows,
    ] = await Promise.all([
      // Total participants
      pool.query("SELECT COUNT(*)::int AS count FROM users"),

      // Total subscribers
      pool.query("SELECT COUNT(*)::int AS count FROM users WHERE is_subscriber = true"),

      // Total questions (course content)
      pool.query("SELECT COUNT(*)::int AS count FROM questions"),

      // Listening questions (practice content)
      pool.query("SELECT COUNT(*)::int AS count FROM questions WHERE type = 'listening'"),

      // Level distribution from latest result per user
      pool.query(`
        SELECT tr.level, COUNT(*)::int AS count
        FROM test_results tr
        INNER JOIN (
          SELECT DISTINCT ON (user_id) user_id, id
          FROM test_results
          ORDER BY user_id, created_at DESC
        ) latest ON latest.id = tr.id
        GROUP BY tr.level
      `),

      // Monthly user registrations (last 12 months)
      pool.query(`
        SELECT
          EXTRACT(MONTH FROM created_at)::int AS month_num,
          EXTRACT(YEAR  FROM created_at)::int AS year,
          COUNT(*)::int AS count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY year, month_num
        ORDER BY year, month_num
      `),

      // Monthly new subscribers (last 12 months) — approximated via login_activity
      pool.query(`
        SELECT
          EXTRACT(MONTH FROM la.created_at)::int AS month_num,
          EXTRACT(YEAR  FROM la.created_at)::int AS year,
          COUNT(DISTINCT la.user_id)::int AS count
        FROM login_activity la
        WHERE la.created_at >= NOW() - INTERVAL '12 months'
        GROUP BY year, month_num
        ORDER BY year, month_num
      `),

      // Recent login activity (last 10)
      pool.query(`
        SELECT username, action, created_at
        FROM login_activity
        ORDER BY created_at DESC
        LIMIT 10
      `),

      // Learning goals aggregated
      pool.query(`
        SELECT goal::text AS goal, COUNT(*)::int AS count
        FROM (
          SELECT jsonb_array_elements_text(goals) AS goal
          FROM user_analysis
        ) sub
        GROUP BY goal
        ORDER BY count DESC
        LIMIT 6
      `),
    ]);

    // Build 12-month chart data
    const now = new Date();
    const monthlyMap = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthlyMap[key] = {
        month: MONTH_LABELS[d.getMonth()],
        participants: 0,
        subscribers: 0,
      };
    }
    monthlyUsers.rows.forEach(({ year, month_num, count }) => {
      const key = `${year}-${month_num}`;
      if (monthlyMap[key]) monthlyMap[key].participants = count;
    });
    monthlySubscribers.rows.forEach(({ year, month_num, count }) => {
      const key = `${year}-${month_num}`;
      if (monthlyMap[key]) monthlyMap[key].subscribers = count;
    });
    const monthlyGrowth = Object.values(monthlyMap);

    // Level distribution with percentages
    const levelOrder = ["Basic", "Intermediate", "Proficient", "Advanced"];
    const totalTested = levelDist.rows.reduce((s, r) => s + r.count, 0);
    const levelDistribution = levelOrder.map((lvl) => {
      const row = levelDist.rows.find((r) => r.level === lvl);
      const count = row?.count ?? 0;
      return {
        name: lvl,
        value: count,
        percentage: totalTested ? Math.round((count / totalTested) * 100) : 0,
      };
    });

    // Learning goals with percentages
    const totalGoals = goalRows.rows.reduce((s, r) => s + r.count, 0);
    const learningGoals = goalRows.rows.map((r) => ({
      title: r.goal,
      count: r.count,
      percentage: totalGoals ? Math.round((r.count / totalGoals) * 100) : 0,
    }));

    // Recent activities with relative time
    const activities = recentActivity.rows.map((r) => ({
      name: r.username,
      action: r.action,
      createdAt: r.created_at,
      timeAgo: timeAgo(new Date(r.created_at)),
    }));

    return res.json({
      stats: {
        totalParticipants: participants.rows[0].count,
        totalSubscribers: subscribers.rows[0].count,
        totalCourses: questions.rows[0].count,
        totalPractice: listeningQ.rows[0].count,
      },
      monthlyGrowth,
      levelDistribution,
      recentActivities: activities,
      learningGoals,
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// POST /api/admin/subscribers/:id  — toggle subscriber status
const toggleSubscriber = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE users SET is_subscriber = NOT is_subscriber WHERE id = $1 RETURNING id, username, is_subscriber",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found." });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("toggleSubscriber error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/admin/participants
const getAllParticipants = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.username, u.email, u.instansi, u.nim_nisn,
             u.is_subscriber, u.created_at,
             tr.level, tr.score, tr.total_questions,
             la.created_at AS last_login
      FROM users u
      LEFT JOIN LATERAL (
        SELECT level, score, total_questions
        FROM test_results
        WHERE user_id = u.id
        ORDER BY created_at DESC LIMIT 1
      ) tr ON true
      LEFT JOIN LATERAL (
        SELECT created_at
        FROM login_activity
        WHERE user_id = u.id
        ORDER BY created_at DESC LIMIT 1
      ) la ON true
      ORDER BY u.created_at DESC
    `);
    const decryptedRows = result.rows.map((row) => ({
      ...row,
      email: decrypt(row.email),
      instansi: decrypt(row.instansi),
      nim_nisn: decrypt(row.nim_nisn),
    }));
    return res.json(decryptedRows);
  } catch (err) {
    console.error("getAllParticipants error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60)    return `${secs} detik yang lalu`;
  if (secs < 3600)  return `${Math.floor(secs / 60)} menit yang lalu`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} jam yang lalu`;
  return `${Math.floor(secs / 86400)} hari yang lalu`;
}

// GET /api/admin/messages/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM contact_messages WHERE is_read = false AND is_deleted = false`
    );
    return res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/admin/messages
const getAdminMessages = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, name, email, category, message, is_read, is_starred, created_at
       FROM contact_messages
       WHERE is_deleted = false
       ORDER BY is_starred DESC, created_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("getAdminMessages error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET /api/admin/messages/:id  (also marks as read)
const getAdminMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, user_id, name, email, category, message, is_read, is_starred, created_at
       FROM contact_messages WHERE id = $1 AND is_deleted = false`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Message not found." });

    await pool.query(`UPDATE contact_messages SET is_read = true WHERE id = $1`, [id]);
    return res.json({ ...result.rows[0], is_read: true });
  } catch (err) {
    console.error("getAdminMessage error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// PATCH /api/admin/messages/:id/read
const markMessageRead = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE contact_messages SET is_read = true WHERE id = $1`, [id]);
    return res.json({ message: "Marked as read." });
  } catch (err) {
    console.error("markMessageRead error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// PATCH /api/admin/messages/:id/star
const toggleMessageStar = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE contact_messages SET is_starred = NOT is_starred WHERE id = $1 RETURNING is_starred`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Message not found." });
    return res.json({ is_starred: result.rows[0].is_starred });
  } catch (err) {
    console.error("toggleMessageStar error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// PATCH /api/admin/messages/:id/delete
const softDeleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE contact_messages SET is_deleted = true WHERE id = $1`, [id]);
    return res.json({ message: "Message deleted." });
  } catch (err) {
    console.error("softDeleteMessage error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getDashboardStats,
  toggleSubscriber,
  getAllParticipants,
  getUnreadCount,
  getAdminMessages,
  getAdminMessage,
  markMessageRead,
  toggleMessageStar,
  softDeleteMessage,
};
