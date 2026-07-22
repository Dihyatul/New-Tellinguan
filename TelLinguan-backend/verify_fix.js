require("dotenv").config();
const http = require("http");

function req(method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: "localhost", port: 5000, path, method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };
    const r = http.request(opts, (res) => {
      let s = "";
      res.on("data", (c) => (s += c));
      res.on("end", () => resolve({ status: res.statusCode, body: s }));
    });
    r.on("error", (e) => resolve({ status: 0, body: e.message }));
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  console.log("\n══════════════════════════════════════════════");
  console.log("  Verifikasi Fix Kerentanan TC-14");
  console.log("══════════════════════════════════════════════\n");

  const ts = Date.now();
  await req("POST", "/api/auth/register", {
    email: "fix" + ts + "@t.com", instansi: "T",
    userName: "fix" + ts, nimNisn: "999",
    password: "Test1234!", confirmPassword: "Test1234!",
  });
  const lr = await req("POST", "/api/auth/login", { username: "fix" + ts, password: "Test1234!" });
  const token = JSON.parse(lr.body).token;
  console.log("  User JWT     :", token ? "diperoleh" : "GAGAL");

  const r1 = await req("GET", "/api/results/all", null, token);
  const pass1 = r1.status === 401;
  console.log("\n  [" + (pass1 ? "✓ PASS" : "✗ FAIL") + "] TC-14 User JWT → /api/results/all");
  console.log("         HTTP Status :", r1.status, "(expected 401)");
  console.log("         Response    :", r1.body.slice(0, 80));

  const r2 = await req("GET", "/api/results/all", null, "admin-token");
  const pass2 = r2.status === 200;
  console.log("\n  [" + (pass2 ? "✓ PASS" : "✗ FAIL") + "] Admin token → /api/results/all");
  console.log("         HTTP Status :", r2.status, "(expected 200 - admin OK)");

  console.log("\n══════════════════════════════════════════════");
  console.log("  Kerentanan", pass1 ? "BERHASIL DIPERBAIKI ✓" : "BELUM DIPERBAIKI ✗");
  console.log("══════════════════════════════════════════════\n");
})();
