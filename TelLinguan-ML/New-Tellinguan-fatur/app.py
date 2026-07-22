"""
app.py — Flask ML Server (standalone, terpisah dari Jupyter)
=============================================================
Cara menjalankan:
    py -3 app.py

Server akan berjalan di http://0.0.0.0:5001
Node.js backend memanggil: POST http://localhost:5001/predict
"""

import pickle
import time
import numpy as np
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

# ── Muat model dari file .pkl 
BASE_DIR   = Path(__file__).parent
MODEL_PATH = BASE_DIR / "placement_test_naive_bayes_model.pkl"

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model tidak ditemukan: {MODEL_PATH}\n"
        "Jalankan NBC (GNB).ipynb (Kernel → Restart & Run All) terlebih dahulu."
    )

with open(MODEL_PATH, "rb") as f:
    bundle = pickle.load(f)

gnb          = bundle["model"]
le           = bundle["label_encoder"]
FEATURE_MASK = bundle["feature_mask"]
SELECTED     = bundle["selected_features"]

print(f"Model dimuat: {MODEL_PATH}")
print(f"Kelas: {le.classes_.tolist()}")
print(f"Fitur aktif: {SELECTED}")

# Fungsi grading (harus sama persis dengan notebook)
def get_level(score):
    if score <= 12:   return "Basic"
    elif score <= 20: return "Intermediate"
    elif score <= 26: return "Proficient"
    else:             return "Advanced"

def get_cefr_level(score):
    if score <= 9:    return "A1"
    elif score <= 14: return "A2"
    elif score <= 20: return "B1"
    elif score <= 25: return "B2"
    else:             return "C1"

CEFR_DESCRIPTION = {
    "A1": "Basic English Foundation",
    "A2": "Elementary English",
    "B1": "Intermediate English",
    "B2": "Upper-Intermediate English",
    "C1": "Advanced English",
}

LEVEL_TO_CEFR = {
    "Basic":        ["A1", "A2"],
    "Intermediate": ["A2", "B1"],
    "Proficient":   ["B2"],
    "Advanced":     ["C1"],
}

COURSE_CATALOG = {
    "grammar": {
        "Basic":        {"title": "Grammar 1", "description": "Pengenalan dasar struktur kalimat bahasa Inggris", "materials": ["Articles & Nouns", "Possessive Adjectives", "Present Simple", "Conjunctions dasar"], "total": 10, "section": "Section Grammar", "cefr_range": "A1–A2"},
        "Intermediate": {"title": "Grammar 2", "description": "Penguatan tata bahasa tingkat menengah", "materials": ["Passive Voice", "Conditionals Type 1 & 2", "Relative Clauses", "Modal Verbs"], "total": 12, "section": "Section Grammar", "cefr_range": "B1"},
        "Proficient":   {"title": "Grammar 3", "description": "Tata bahasa kompleks untuk kebutuhan akademik", "materials": ["Complex Sentences", "Clauses & Phrases", "Inversion & Emphasis", "Academic Grammar"], "total": 15, "section": "Section Grammar", "cefr_range": "B2"},
        "Advanced":     {"title": "Grammar 4", "description": "Penguasaan grammar tingkat lanjut", "materials": ["Subjunctive Mood", "Conditionals Type 3", "Concession Clauses", "Indirect Questions"], "total": 15, "section": "Section Grammar", "cefr_range": "C1"},
        "A1": {"title": "Grammar A1", "description": "Struktur kalimat sangat dasar", "materials": ["Articles & Nouns", "Possessive Adjectives", "Kalimat sederhana Present"], "total": 10, "section": "Section Grammar", "eprt_level": "Basic"},
        "A2": {"title": "Grammar A2", "description": "Tata bahasa dasar yang diperluas", "materials": ["Subject-Verb Agreement", "Present & Past Simple", "Adjectives & Adverbs", "Yes/No Questions"], "total": 10, "section": "Section Grammar", "eprt_level": "Basic"},
        "B1": {"title": "Grammar B1", "description": "Tata bahasa tingkat menengah", "materials": ["Modal Verbs", "Present Perfect", "Conditionals Type 1", "Relative Clauses dasar"], "total": 12, "section": "Section Grammar", "eprt_level": "Intermediate"},
        "B2": {"title": "Grammar B2", "description": "Tata bahasa menengah atas", "materials": ["Passive Voice lanjutan", "Conditionals Type 2", "Reported Speech", "Complex Noun Phrases"], "total": 12, "section": "Section Grammar", "eprt_level": "Proficient"},
        "C1": {"title": "Grammar C1", "description": "Tata bahasa kompleks akademik", "materials": ["Inversion & Emphasis", "Mixed Conditionals", "Cleft Sentences", "Academic Grammar"], "total": 15, "section": "Section Grammar", "eprt_level": "Advanced"},
    },
    "listening": {
        "Basic":        {"title": "Listening 1", "description": "Pemahaman percakapan pendek bahasa Inggris", "materials": ["Short Conversations", "Understanding Detail", "Main Idea sederhana"], "total": 10, "section": "Section Listening", "cefr_range": "A1–A2"},
        "Intermediate": {"title": "Listening 2", "description": "Meningkatkan kemampuan memahami spoken English", "materials": ["Longer Dialogues", "Different Accents", "Listening for Specific Info"], "total": 12, "section": "Section Listening", "cefr_range": "B1"},
        "Proficient":   {"title": "Listening 3", "description": "Pemahaman listening akademik dan formal", "materials": ["Long Talks & Lectures", "Implied Meaning", "Inference dari Audio"], "total": 12, "section": "Section Listening", "cefr_range": "B2"},
        "Advanced":     {"title": "Listening 4", "description": "Listening tingkat lanjut untuk EPrT", "materials": ["Academic Lectures", "Complex Dialogues", "Note-taking Strategies"], "total": 15, "section": "Section Listening", "cefr_range": "C1"},
        "A1": {"title": "Listening A1", "description": "Percakapan sangat sederhana", "materials": ["Kata & frasa umum", "Instruksi pendek", "Angka & alfabet"], "total": 10, "section": "Section Listening", "eprt_level": "Basic"},
        "A2": {"title": "Listening A2", "description": "Memahami percakapan sehari-hari", "materials": ["Short Conversations", "Understanding Detail", "Main Idea sederhana"], "total": 10, "section": "Section Listening", "eprt_level": "Basic"},
        "B1": {"title": "Listening B1", "description": "Memahami poin utama topik familiar", "materials": ["Longer Dialogues", "Main Topic Identification", "Listening for Specific Info"], "total": 12, "section": "Section Listening", "eprt_level": "Intermediate"},
        "B2": {"title": "Listening B2", "description": "Memahami ceramah dan presentasi", "materials": ["Different Accents", "Implied Meaning dasar", "Understanding Attitude"], "total": 12, "section": "Section Listening", "eprt_level": "Proficient"},
        "C1": {"title": "Listening C1", "description": "Pemahaman listening akademik formal", "materials": ["Long Talks & Lectures", "Inference dari Audio", "Complex Dialogues"], "total": 15, "section": "Section Listening", "eprt_level": "Advanced"},
    },
    "reading": {
        "Basic":        {"title": "Reading 1", "description": "Memahami teks bahasa Inggris sederhana", "materials": ["Short Texts", "Basic Vocabulary", "Identifying Main Idea"], "total": 10, "section": "Section Reading", "cefr_range": "A1–A2"},
        "Intermediate": {"title": "Reading 2", "description": "Pemahaman bacaan tingkat menengah", "materials": ["Skimming & Scanning", "Vocabulary in Context", "Pronoun Reference"], "total": 12, "section": "Section Reading", "cefr_range": "B1"},
        "Proficient":   {"title": "Reading 3", "description": "Analisis teks akademik", "materials": ["Making Inferences", "Negative Fact/Detail", "Determining Tone"], "total": 12, "section": "Section Reading", "cefr_range": "B2"},
        "Advanced":     {"title": "Reading 4", "description": "Reading tingkat lanjut untuk EPrT", "materials": ["Complex Academic Texts", "Critical Analysis", "Author's Purpose"], "total": 15, "section": "Section Reading", "cefr_range": "C1"},
        "A1": {"title": "Reading A1", "description": "Teks sangat sederhana", "materials": ["Kalimat sangat pendek", "Kosakata dasar", "Tanda & label"], "total": 10, "section": "Section Reading", "eprt_level": "Basic"},
        "A2": {"title": "Reading A2", "description": "Teks deskriptif pendek", "materials": ["Short Texts", "Basic Vocabulary", "Identifying Main Idea"], "total": 10, "section": "Section Reading", "eprt_level": "Basic"},
        "B1": {"title": "Reading B1", "description": "Teks sehari-hari dan topik familiar", "materials": ["Skimming & Scanning", "Pronoun Reference", "Vocabulary in Context"], "total": 12, "section": "Section Reading", "eprt_level": "Intermediate"},
        "B2": {"title": "Reading B2", "description": "Artikel dan laporan kompleks", "materials": ["Making Inferences dasar", "Writer's Opinion", "Cohesion & Coherence"], "total": 12, "section": "Section Reading", "eprt_level": "Proficient"},
        "C1": {"title": "Reading C1", "description": "Teks akademik panjang", "materials": ["Negative Fact/Detail", "Determining Tone", "Implicit Meaning"], "total": 15, "section": "Section Reading", "eprt_level": "Advanced"},
    },
}

TOPIC_RECOMMENDATIONS = {
    "grammar": {
        "Basic": ["Articles & Nouns", "Possessive Adjectives", "Subject-Verb Agreement"],
        "Intermediate": ["Passive Voice", "Conditionals", "Modal Verbs"],
        "Proficient": ["Complex Sentences", "Inversion", "Academic Grammar"],
        "Advanced": ["Subjunctive Mood", "Conditionals Type 3", "Indirect Questions"],
        "A1": ["Articles & Nouns", "Kalimat sederhana Present", "Possessive Adjectives"],
        "A2": ["Subject-Verb Agreement", "Present & Past Simple", "Yes/No Questions"],
        "B1": ["Modal Verbs", "Present Perfect", "Conditionals Type 1"],
        "B2": ["Passive Voice lanjutan", "Conditionals Type 2", "Reported Speech"],
        "C1": ["Inversion & Emphasis", "Mixed Conditionals", "Academic Grammar"],
    },
    "listening": {
        "Basic": ["Short Conversations", "Understanding Detail"],
        "Intermediate": ["Longer Dialogues", "Listening for Specific Info"],
        "Proficient": ["Long Talks", "Implied Meaning", "Inference"],
        "Advanced": ["Academic Lectures", "Complex Dialogues"],
        "A1": ["Kata & frasa umum", "Instruksi pendek"],
        "A2": ["Short Conversations", "Understanding Detail"],
        "B1": ["Longer Dialogues", "Main Topic Identification"],
        "B2": ["Different Accents", "Understanding Attitude"],
        "C1": ["Long Talks & Lectures", "Inference dari Audio"],
    },
    "reading": {
        "Basic": ["Identifying Main Idea", "Basic Vocabulary"],
        "Intermediate": ["Skimming & Scanning", "Vocabulary in Context"],
        "Proficient": ["Making Inferences", "Determining Tone"],
        "Advanced": ["Critical Analysis", "Author's Purpose"],
        "A1": ["Kosakata dasar", "Tanda & label"],
        "A2": ["Identifying Main Idea", "Basic Vocabulary"],
        "B1": ["Skimming & Scanning", "Pronoun Reference"],
        "B2": ["Making Inferences dasar", "Writer's Opinion"],
        "C1": ["Determining Tone", "Implicit Meaning"],
    },
}

SPEED_TIPS = {
    "Relax":     "Fokus 1 topik per minggu, jangan terburu-buru.",
    "Moderate":  "Target selesai 2 topik per minggu dengan latihan soal rutin.",
    "Intensive": "Kerjakan minimal 30 soal per hari dan review kesalahan setiap sesi.",
}

# Fungsi prediksi utama 
def predict_student(grammar_correct, listening_correct, reading_correct,
                    speed="Moderate", hours_per_day=2, days_per_week=3):
    total   = grammar_correct + listening_correct + reading_correct
    X_input = np.array([[grammar_correct, listening_correct, reading_correct, total]], dtype=float)

    t0                = time.perf_counter()
    predicted_encoded = gnb.predict(X_input[:, FEATURE_MASK])[0]
    probabilities     = gnb.predict_proba(X_input[:, FEATURE_MASK])[0]
    inference_ms      = (time.perf_counter() - t0) * 1000
    level             = le.inverse_transform([predicted_encoded])[0]
    confidence        = probabilities[predicted_encoded]

    cefr      = get_cefr_level(total)
    cefr_desc = CEFR_DESCRIPTION[cefr]

    sections = {
        "grammar":   {"correct": grammar_correct,  "total": 10, "pct": round(grammar_correct  / 10 * 100, 1)},
        "listening": {"correct": listening_correct, "total": 10, "pct": round(listening_correct / 10 * 100, 1)},
        "reading":   {"correct": reading_correct,   "total": 10, "pct": round(reading_correct   / 10 * 100, 1)},
    }
    weak = [k for k, v in sections.items() if v["pct"] < 60]

    next_level_map  = {"Basic": 13, "Intermediate": 21, "Proficient": 27, "Advanced": 30}
    next_cefr_map   = {"A1": 10, "A2": 15, "B1": 21, "B2": 26, "C1": 30}
    points_needed   = max(0, next_level_map[level] - total)
    cefr_pts_needed = max(0, next_cefr_map[cefr] - total)

    speed_multiplier = {"Relax": 0.5, "Moderate": 1.0, "Intensive": 1.5}.get(speed, 1.0)
    effort           = hours_per_day * days_per_week * speed_multiplier
    est_weeks        = int(np.ceil(points_needed   / effort)) if effort > 0 else 0
    cefr_est_weeks   = int(np.ceil(cefr_pts_needed / effort)) if effort > 0 else 0

    kurang      = [t for sec in weak for t in TOPIC_RECOMMENDATIONS.get(sec, {}).get(level, [])]
    cefr_kurang = [t for sec in weak for t in TOPIC_RECOMMENDATIONS.get(sec, {}).get(cefr, [])]
    improve     = [SPEED_TIPS.get(speed, "")]

    # Hanya rekomendasikan kursus untuk section yang lemah; jika semua baik, tampilkan semua
    target_sections = weak if weak else ["grammar", "listening", "reading"]

    recommended_courses = []
    for sec in target_sections:
        course  = COURSE_CATALOG[sec][level].copy()
        pct     = sections[sec]["pct"]
        if sec in weak:
            course["status"] = "priority"
            course["reason"] = (
                f"Skor {sec.capitalize()} kamu {sections[sec]['correct']}/10 ({pct}%) "
                f"— di bawah standar lulus (60%). Perlu segera ditingkatkan."
            )
            course["action"] = "Ambil Kursus Ini Sekarang"
        else:
            course["status"] = "available"
            course["reason"] = (
                f"Skor {sec.capitalize()} kamu {sections[sec]['correct']}/10 ({pct}%) "
                f"— sudah baik. Pertahankan dengan latihan rutin."
            )
            course["action"] = "Lanjutkan Latihan"
        course["progress"] = 0
        recommended_courses.append(course)

    cefr_courses = []
    for sec in target_sections:
        course  = COURSE_CATALOG[sec][cefr].copy()
        pct     = sections[sec]["pct"]
        if sec in weak:
            course["status"] = "priority"
            course["reason"] = (
                f"Tingkatkan {sec.capitalize()} untuk mencapai level CEFR berikutnya ({cefr})."
            )
            course["action"] = "Ambil Kursus Ini Sekarang"
        else:
            course["status"] = "available"
            course["reason"] = f"Pertahankan performa {sec.capitalize()} di level {cefr}."
            course["action"] = "Lanjutkan Latihan"
        course["progress"] = 0
        cefr_courses.append(course)

    return {
        "total_score":                   total,
        "total_questions":               30,
        "percentage":                    round(total / 30 * 100, 1),
        "level":                         level,
        "level_confidence":              round(float(confidence), 4),
        "inference_ms":                  round(inference_ms, 4),
        "all_probabilities":             {cls: round(float(p), 4) for cls, p in zip(le.classes_, probabilities)},
        "cefr_level":                    cefr,
        "cefr_description":              cefr_desc,
        "cefr_range":                    LEVEL_TO_CEFR[level],
        "section_scores":                sections,
        "weak_sections":                 weak,
        "estimated_weeks_to_next_level": est_weeks,
        "cefr_estimated_weeks_next":     cefr_est_weeks,
        "weekly_study_hours":            hours_per_day * days_per_week,
        "recommendation": {
            "kurang":      kurang,
            "cefr_kurang": cefr_kurang,
            "improve":     improve,
        },
        "recommended_courses": recommended_courses,
        "cefr_courses":        cefr_courses,
    }

# ── Flask app
app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "GaussianNB", "port": 5001})

@app.route("/predict", methods=["POST"])
def predict():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Body JSON tidak valid"}), 400

    required = ["grammar_correct", "listening_correct", "reading_correct"]
    missing  = [f for f in required if f not in body]
    if missing:
        return jsonify({"error": f"Field wajib kurang: {missing}"}), 400

    try:
        g     = int(body["grammar_correct"])
        l_val = int(body["listening_correct"])
        r     = int(body["reading_correct"])
    except (ValueError, TypeError):
        return jsonify({"error": "Nilai skor harus berupa angka"}), 400

    if not (0 <= g <= 10 and 0 <= l_val <= 10 and 0 <= r <= 10):
        return jsonify({"error": "Skor tiap section harus antara 0–10"}), 400

    try:
        result = predict_student(
            grammar_correct   = g,
            listening_correct = l_val,
            reading_correct   = r,
            speed             = body.get("speed", "Moderate"),
            hours_per_day     = int(body.get("hours_per_day", 2)),
            days_per_week     = int(body.get("days_per_week", 3)),
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Jalankan server 
if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("  Flask ML Server siap")
    print("  GET  http://localhost:5001/health")
    print("  POST http://localhost:5001/predict")
    print("=" * 50 + "\n")
    app.run(host="0.0.0.0", port=5001, debug=False)
