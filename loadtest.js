// ============================================================================
// loadtest.js — Pengujian Performa Backend TelLinguan (k6)
// ============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// ============================ CONFIG =========================================
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

const LOGIN_PATH   = '/api/auth/login';
const PROFILE_PATH = '/api/auth/profile';
const RESULTS_PATH = '/api/results/history';
const SUBMIT_PATH  = '/api/results';

const TEST_USER = { username: 'tester_load', password: 'Password123!' };
const TOKEN_FIELD = 'token';
const TEST_SUBMIT = false;

const SUBMIT_PAYLOAD = {
  answers: [0, 1, 2, 1, 0],
  score: 80,
  total_questions: 5,
};

const LEVELS = [1, 10, 50, 100];
const DURATION = '20s';
// =============================================================================

const T = {};
for (const l of LEVELS) {
  T[l] = {
    login:   new Trend(`login_${l}`),
    profile: new Trend(`profile_${l}`),
    results: new Trend(`results_${l}`),
    submit:  new Trend(`submit_${l}`),
  };
}

function buildScenarios() {
  const sc = {};
  let start = 0;
  const gap = 3;
  for (const l of LEVELS) {
    sc[`load_${l}`] = {
      executor: 'constant-vus',
      vus: l,
      duration: DURATION,
      startTime: `${start}s`,
      exec: `flow_${l}`,
      tags: { level: String(l) },
    };
    start += parseInt(DURATION) + gap;
  }
  return sc;
}

export const options = {
  scenarios: buildScenarios(),
  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
};

function getToken(res) {
  try {
    const body = res.json();
    return body[TOKEN_FIELD] || (body.data && body.data[TOKEN_FIELD]) || body.accessToken || null;
  } catch (e) {
    return null;
  }
}

function runFlow(level) {
  const m = T[level];

  const loginRes = http.post(`${BASE_URL}${LOGIN_PATH}`, JSON.stringify(TEST_USER), {
    headers: { 'Content-Type': 'application/json' },
  });
  m.login.add(loginRes.timings.duration);
  check(loginRes, { 'login status 200': (r) => r.status === 200 });

  const token = getToken(loginRes);
  const authHeaders = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };

  if (token) {
    const profRes = http.get(`${BASE_URL}${PROFILE_PATH}`, authHeaders);
    m.profile.add(profRes.timings.duration);
    check(profRes, { 'profile status 200': (r) => r.status === 200 });

    const resRes = http.get(`${BASE_URL}${RESULTS_PATH}`, authHeaders);
    m.results.add(resRes.timings.duration);
    check(resRes, { 'results status 200': (r) => r.status === 200 });

    if (TEST_SUBMIT) {
      const subRes = http.post(`${BASE_URL}${SUBMIT_PATH}`, JSON.stringify(SUBMIT_PAYLOAD), authHeaders);
      m.submit.add(subRes.timings.duration);
      check(subRes, { 'submit status 2xx': (r) => r.status >= 200 && r.status < 300 });
    }
  }

  sleep(1);
}

export function flow_1()   { runFlow(1); }
export function flow_10()  { runFlow(10); }
export function flow_50()  { runFlow(50); }
export function flow_100() { runFlow(100); }

export function handleSummary(data) {
  const fmt = (v) => (v === undefined || isNaN(v)) ? '   -  ' : v.toFixed(1).padStart(6);
  const get = (name) => {
    const mtr = data.metrics[name];
    return mtr && mtr.values ? mtr.values.avg : undefined;
  };

  let out = '\n';
  out += '================ HASIL PENGUJIAN PERFORMA BACKEND (rata-rata, ms) ================\n';
  out += ' Pengguna |  Login  | Profil  | Ambil Hasil | Submit \n';
  out += '----------+---------+---------+-------------+--------\n';
  for (const l of LEVELS) {
    out += ` ${String(l).padStart(7)}  | ${fmt(get(`login_${l}`))} | ${fmt(get(`profile_${l}`))} |   ${fmt(get(`results_${l}`))}    | ${fmt(get(`submit_${l}`))}\n`;
  }
  out += '=================================================================================\n';
  out += '(Submit "-" jika TEST_SUBMIT=false. Salin angka ini ke Tabel 1 jurnal.)\n';

  return {
    'stdout': out,
    'hasil_loadtest.txt': out,
  };
}
