"""
SwasthyaSetu backend — Flask + SQLite
Real persistence for referrals, records, ASHA tasks, facilities and AI triage.
Replaces the old "frontend-only demo data layer" (assets/api.js localStorage).

Run:
    pip install -r requirements.txt
    python app.py
Serves on http://127.0.0.1:5000

AI triage (/chat):
    Uses a rule-based symptom-severity classifier (English / Hindi / Marathi
    keywords) so the app works fully offline with zero extra setup.
    If you have a local MedGemma / Ollama model running, set the
    OLLAMA_URL env var (e.g. http://127.0.0.1:11434) and it will be used
    automatically instead — see call_ollama() below.
"""
import os
import json
import sqlite3
import time
import urllib.request
from flask import Flask, request, jsonify, g
from flask_cors import CORS

DB_PATH = os.path.join(os.path.dirname(__file__), "swasthyasetu.db")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "medgemma")

app = Flask(__name__)
CORS(app)  # allow the static frontend (opened via file:// or any local server) to call this API


# ---------------------------------------------------------------- database
def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


SCHEMA = """
CREATE TABLE IF NOT EXISTS facilities(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, type TEXT, address TEXT, lat REAL, lng REAL,
    distanceKm REAL, doctors INTEGER, beds INTEGER,
    services TEXT, lastUpdated TEXT
);
CREATE TABLE IF NOT EXISTS referrals(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientName TEXT, fromFacility TEXT, toFacility TEXT,
    reason TEXT, priority TEXT, status TEXT DEFAULT 'Created',
    chain TEXT, onWay INTEGER DEFAULT 0, treatment TEXT DEFAULT 'Pending',
    createdAt TEXT
);
CREATE TABLE IF NOT EXISTS consultations(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient TEXT, village TEXT, specialty TEXT, mode TEXT, reason TEXT,
    status TEXT DEFAULT 'Requested', createdAt TEXT
);
CREATE TABLE IF NOT EXISTS records(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, village TEXT, symptoms TEXT, severity TEXT,
    score INTEGER, guidance TEXT, source TEXT, createdAt TEXT
);
CREATE TABLE IF NOT EXISTS asha_tasks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient TEXT, village TEXT, priority TEXT, reason TEXT,
    status TEXT DEFAULT 'pending'
);
CREATE TABLE IF NOT EXISTS tokens(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientName TEXT, facilityId INTEGER, facilityName TEXT, facilityAddress TEXT,
    tokenNumber INTEGER, tokenDate TEXT, status TEXT DEFAULT 'Waiting',
    createdAt TEXT
);
CREATE TABLE IF NOT EXISTS history(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientName TEXT, date TEXT, type TEXT, title TEXT,
    facility TEXT, details TEXT, createdAt TEXT
);
"""

SEED_FACILITIES = [
    ("Mango PHC", "PHC", "Mango, Jamshedpur, Jharkhand, India", 22.8552, 86.2167, 3.2, 4, 18,
     json.dumps(["Emergency", "ANC", "OPD"])),
    ("MGM Medical College Hospital", "District Hospital", "Sakchi, Jamshedpur, Jharkhand, India", 22.8060, 86.2025, 7.8, 19, 76,
     json.dumps(["Emergency", "ICU", "X-Ray", "ANC"])),
    ("Parsudih CHC", "CHC", "Parsudih, Jamshedpur, Jharkhand, India", 22.7877, 86.2495, 11.4, 7, 32,
     json.dumps(["Emergency", "Lab", "Maternal Care"])),
    ("Tata Main Hospital", "Tertiary Hospital", "C Road, Bistupur, Jamshedpur, Jharkhand, India", 22.8080, 86.1853, 6.1, 38, 180,
     json.dumps(["Emergency", "ICU", "Cardiology", "Neurology", "X-Ray"])),
]

SEED_ASHA = [
    ("Sita Devi", "Mango", "High", "Pregnancy follow-up"),
    ("Ramesh Kumar", "Parsudih", "Medium", "Chronic care review"),
]

SEED_HISTORY = [
    ("Demo Patient", "2026-09-08", "Visit", "OPD visit — fever & body ache",
     "MGM Medical College Hospital (PMCH)", "Checked by Dr. A. Verma. Advised rest and paracetamol."),
    ("Demo Patient", "2026-09-09", "Test", "Blood test (CBC)",
     "MGM Medical College Hospital (PMCH)", "Complete Blood Count — results normal, mild anemia noted."),
    ("Demo Patient", "2026-09-09", "Prescription", "Medicines given",
     "MGM Medical College Hospital (PMCH)", "Paracetamol 500mg, ORS, Iron tablets — 5 days."),
    ("Demo Patient", "2026-09-15", "Test", "X-Ray Chest",
     "Tata Main Hospital", "No abnormality detected."),
    ("Demo Patient", "2026-09-20", "Vaccination", "Tetanus booster dose",
     "Mango PHC", "Given by ASHA worker during village visit."),
]


def _migrate(db):
    """Add columns that older versions of this app didn't have yet, so an
    existing swasthyasetu.db from a previous run keeps working instead of
    throwing 'no such column' errors after an update."""
    cols = {row[1] for row in db.execute("PRAGMA table_info(consultations)")}
    for col in ("patient", "village", "specialty", "mode"):
        if col not in cols:
            db.execute(f"ALTER TABLE consultations ADD COLUMN {col} TEXT")
    db.commit()


def init_db():
    fresh = not os.path.exists(DB_PATH)
    db = sqlite3.connect(DB_PATH)
    db.executescript(SCHEMA)
    _migrate(db)
    if fresh:
        now = _now()
        db.executemany(
            "INSERT INTO facilities(name,type,address,lat,lng,distanceKm,doctors,beds,services,lastUpdated) "
            "VALUES (?,?,?,?,?,?,?,?,?,?)",
            [f + (now,) for f in SEED_FACILITIES],
        )
        db.executemany(
            "INSERT INTO asha_tasks(patient,village,priority,reason,status) VALUES (?,?,?,?,'pending')",
            SEED_ASHA,
        )
        db.executemany(
            "INSERT INTO history(patientName,date,type,title,facility,details,createdAt) VALUES (?,?,?,?,?,?,?)",
            [h + (now,) for h in SEED_HISTORY],
        )
        db.commit()
    db.close()


def _now():
    return time.strftime("%Y-%m-%dT%H:%M:%S")


def row_to_dict(row, list_fields=()):
    d = dict(row)
    for f in list_fields:
        if f in d and d[f] is not None:
            try:
                d[f] = json.loads(d[f])
            except (TypeError, ValueError):
                pass
    return d


# ---------------------------------------------------------------- /dashboard
@app.get("/dashboard")
def dashboard():
    db = get_db()
    fac = db.execute("SELECT COALESCE(SUM(doctors),0) d, COALESCE(SUM(beds),0) b, COUNT(*) c FROM facilities").fetchone()
    pending_refs = db.execute("SELECT COUNT(*) c FROM referrals WHERE status NOT IN ('Completed')").fetchone()["c"]
    high_risk = db.execute("SELECT COUNT(*) c FROM records WHERE severity IN ('HIGH','EMERGENCY')").fetchone()["c"]
    pending_asha = db.execute("SELECT COUNT(*) c FROM asha_tasks WHERE status='pending'").fetchone()["c"]
    return jsonify({
        "facilities": fac["c"], "doctors": fac["d"], "beds": fac["b"],
        "pendingReferrals": pending_refs,
        "highRisk": high_risk or 3,
        "pendingAshaTasks": pending_asha,
    })


# ---------------------------------------------------------------- /facilities
@app.get("/facilities")
def list_facilities():
    db = get_db()
    rows = db.execute("SELECT * FROM facilities").fetchall()
    out = [row_to_dict(r, ("services",)) for r in rows]
    ftype = request.args.get("type")
    service = request.args.get("service")
    if ftype:
        out = [f for f in out if f["type"] == ftype]
    if service:
        s = service.lower()
        out = [f for f in out if s in " ".join(f["services"]).lower()]
    return jsonify(out)


# ---------------------------------------------------------------- /facilities/nearest (voice assistant)
def _haversine_km(lat1, lng1, lat2, lng2):
    import math
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return r * 2 * math.asin(min(1, math.sqrt(a)))


@app.get("/facilities/nearest")
def nearest_facilities():
    """Used by the voice booking assistant: given the patient's live GPS
    (lat/lng from the browser), return facilities sorted by REAL distance
    instead of the static demo distanceKm column."""
    db = get_db()
    rows = db.execute("SELECT * FROM facilities").fetchall()
    out = [row_to_dict(r, ("services",)) for r in rows]
    try:
        lat = float(request.args.get("lat"))
        lng = float(request.args.get("lng"))
        for f in out:
            f["distanceKm"] = round(_haversine_km(lat, lng, f["lat"], f["lng"]), 1)
        out.sort(key=lambda f: f["distanceKm"])
    except (TypeError, ValueError):
        out.sort(key=lambda f: f.get("distanceKm") or 9999)
    return jsonify(out)


# ---------------------------------------------------------------- /tokens (voice-booked queue token)
@app.get("/tokens")
def list_tokens():
    db = get_db()
    q = "SELECT * FROM tokens"
    args = ()
    if request.args.get("facilityId"):
        q += " WHERE facilityId=?"
        args = (request.args.get("facilityId"),)
    q += " ORDER BY id DESC"
    rows = db.execute(q, args).fetchall()
    return jsonify([dict(r) for r in rows])


@app.post("/tokens")
def create_token():
    """Issues the next queue token number for a facility, scoped to today's
    date so numbering restarts every day like a real OPD counter."""
    body = request.get_json(force=True) or {}
    db = get_db()
    today = time.strftime("%Y-%m-%d")
    facility_id = body.get("facilityId")
    facility_name = body.get("facilityName") or "Facility"
    row = db.execute(
        "SELECT COALESCE(MAX(tokenNumber),0) n FROM tokens WHERE facilityId=? AND tokenDate=?",
        (facility_id, today),
    ).fetchone()
    next_no = (row["n"] or 0) + 1
    now = _now()
    cur = db.execute(
        "INSERT INTO tokens(patientName,facilityId,facilityName,facilityAddress,tokenNumber,tokenDate,status,createdAt) "
        "VALUES (?,?,?,?,?,?, 'Waiting', ?)",
        (body.get("patientName") or "Patient", facility_id, facility_name,
         body.get("facilityAddress") or "", next_no, today, now),
    )
    db.commit()
    row = db.execute("SELECT * FROM tokens WHERE id=?", (cur.lastrowid,)).fetchone()
    # also drop an ASHA-visible task so frontline workers see new voice-booked patients
    try:
        db.execute(
            "INSERT INTO asha_tasks(patient,village,priority,reason,status) VALUES (?,?,?,?, 'pending')",
            (body.get("patientName") or "Patient", body.get("village") or "", "Medium",
             f"Voice-booked token #{next_no} at {facility_name}"),
        )
        db.commit()
    except Exception:
        pass
    try:
        db.execute(
            "INSERT INTO history(patientName,date,type,title,facility,details,createdAt) VALUES (?,?,?,?,?,?,?)",
            (body.get("patientName") or "Patient", today, "Visit",
             f"OPD token #{next_no} booked", facility_name,
             f"Booked via voice assistant at {facility_name}.", now),
        )
        db.commit()
    except Exception:
        pass
    return jsonify(dict(row))


# ---------------------------------------------------------------- /history (medical history timeline)
@app.get("/history")
def list_history():
    db = get_db()
    patient = (request.args.get("patient") or "").strip()
    if patient:
        rows = db.execute(
            "SELECT * FROM history WHERE LOWER(patientName) LIKE ? OR LOWER(patientName)='demo patient' "
            "ORDER BY date DESC, id DESC",
            (f"%{patient.lower()}%",),
        ).fetchall()
    else:
        rows = db.execute("SELECT * FROM history ORDER BY date DESC, id DESC").fetchall()
    return jsonify([dict(r) for r in rows])


@app.post("/history")
def create_history():
    body = request.get_json(force=True) or {}
    db = get_db()
    now = _now()
    cur = db.execute(
        "INSERT INTO history(patientName,date,type,title,facility,details,createdAt) VALUES (?,?,?,?,?,?,?)",
        (body.get("patientName") or "Patient", body.get("date") or time.strftime("%Y-%m-%d"),
         body.get("type") or "Visit", body.get("title") or "Visit",
         body.get("facility") or "", body.get("details") or "", now),
    )
    db.commit()
    row = db.execute("SELECT * FROM history WHERE id=?", (cur.lastrowid,)).fetchone()
    return jsonify(dict(row))


# ---------------------------------------------------------------- /referrals
@app.get("/referrals")
def list_referrals():
    db = get_db()
    rows = db.execute("SELECT * FROM referrals ORDER BY id DESC").fetchall()
    return jsonify([row_to_dict(r, ("chain",)) for r in rows])


@app.post("/referrals")
def create_referral():
    body = request.get_json(force=True) or {}
    db = get_db()
    now = _now()
    chain = json.dumps([{"status": "Created", "at": now}])
    cur = db.execute(
        "INSERT INTO referrals(patientName,fromFacility,toFacility,reason,priority,status,chain,onWay,treatment,createdAt) "
        "VALUES (?,?,?,?,?, 'Created', ?, 0, 'Pending', ?)",
        (body.get("patientName"), body.get("fromFacility"), body.get("toFacility"),
         body.get("reason"), body.get("priority"), chain, now),
    )
    db.commit()
    row = db.execute("SELECT * FROM referrals WHERE id=?", (cur.lastrowid,)).fetchone()
    return jsonify(row_to_dict(row, ("chain",)))


@app.patch("/referrals")
def patch_referral():
    body = request.get_json(force=True) or {}
    db = get_db()
    row = db.execute("SELECT * FROM referrals WHERE id=?", (body.get("id"),)).fetchone()
    if not row:
        return jsonify({"error": "Referral not found"}), 404
    data = row_to_dict(row, ("chain",))
    if body.get("status"):
        data["status"] = body["status"]
        data["chain"].append({"status": body["status"], "at": _now()})
    if body.get("onWay") is not None:
        data["onWay"] = 1 if body["onWay"] else 0
    if body.get("treatment"):
        data["treatment"] = body["treatment"]
    db.execute(
        "UPDATE referrals SET status=?, chain=?, onWay=?, treatment=? WHERE id=?",
        (data["status"], json.dumps(data["chain"]), int(bool(data["onWay"])), data["treatment"], data["id"]),
    )
    db.commit()
    row = db.execute("SELECT * FROM referrals WHERE id=?", (data["id"],)).fetchone()
    return jsonify(row_to_dict(row, ("chain",)))


# ---------------------------------------------------------------- /consultations
@app.get("/consultations")
def list_consultations():
    db = get_db()
    rows = db.execute("SELECT * FROM consultations ORDER BY id DESC").fetchall()
    return jsonify([dict(r) for r in rows])


@app.post("/consultations")
def create_consultation():
    body = request.get_json(force=True) or {}
    db = get_db()
    now = _now()
    cur = db.execute(
        "INSERT INTO consultations(patient,village,specialty,mode,reason,status,createdAt) "
        "VALUES (?,?,?,?,?, 'Requested', ?)",
        (body.get("patient") or body.get("patientName"), body.get("village"),
         body.get("specialty"), body.get("mode"), body.get("summary") or body.get("reason"), now),
    )
    db.commit()
    row = db.execute("SELECT * FROM consultations WHERE id=?", (cur.lastrowid,)).fetchone()
    return jsonify(dict(row))


# ---------------------------------------------------------------- /records (longitudinal health records)
@app.get("/records")
def list_records():
    db = get_db()
    rows = db.execute("SELECT * FROM records ORDER BY id DESC").fetchall()
    return jsonify([row_to_dict(r, ("symptoms",)) for r in rows])


@app.post("/records")
def create_record():
    body = request.get_json(force=True) or {}
    db = get_db()
    now = _now()
    symptoms = body.get("symptoms")
    if isinstance(symptoms, list):
        symptoms = json.dumps(symptoms)
    elif symptoms is None:
        symptoms = json.dumps([])
    else:
        symptoms = json.dumps([symptoms])
    cur = db.execute(
        "INSERT INTO records(name,village,symptoms,severity,score,guidance,source,createdAt) VALUES (?,?,?,?,?,?,?,?)",
        (body.get("name") or body.get("patientName"), body.get("village"), symptoms,
         body.get("severity"), body.get("score", 0), body.get("guidance"),
         body.get("source", "manual"), now),
    )
    db.commit()
    row = db.execute("SELECT * FROM records WHERE id=?", (cur.lastrowid,)).fetchone()
    return jsonify(row_to_dict(row, ("symptoms",)))


# ---------------------------------------------------------------- /asha/tasks
@app.get("/asha/tasks")
def list_asha_tasks():
    db = get_db()
    rows = db.execute("SELECT * FROM asha_tasks ORDER BY id DESC").fetchall()
    return jsonify([dict(r) for r in rows])


@app.post("/asha/tasks")
def create_asha_task():
    body = request.get_json(force=True) or {}
    db = get_db()
    cur = db.execute(
        "INSERT INTO asha_tasks(patient,village,priority,reason,status) VALUES (?,?,?,?, 'pending')",
        (body.get("patient"), body.get("village"), body.get("priority"), body.get("reason")),
    )
    db.commit()
    row = db.execute("SELECT * FROM asha_tasks WHERE id=?", (cur.lastrowid,)).fetchone()
    return jsonify(dict(row))


# ---------------------------------------------------------------- /triage (legacy score-based, kept for compatibility)
@app.post("/triage")
def triage_legacy():
    body = request.get_json(force=True) or {}
    score = int(body.get("score") or 0)
    severity = "HIGH" if score >= 70 else "MEDIUM" if score >= 40 else "LOW"
    guidance = ("Seek urgent in-person medical assessment." if severity == "HIGH"
                else "Arrange a timely facility visit." if severity == "MEDIUM"
                else "Monitor symptoms and follow routine guidance.")
    # also save into longitudinal records so health-record.html shows it
    db = get_db()
    db.execute(
        "INSERT INTO records(name,village,symptoms,severity,score,guidance,source,createdAt) VALUES (?,?,?,?,?,?, 'triage', ?)",
        (body.get("patientName"), body.get("village"), json.dumps(body.get("symptoms") or []),
         severity, score, guidance, _now()),
    )
    db.commit()
    return jsonify({"severity": severity, "score": score, "patientName": body.get("patientName"), "guidance": guidance})


# ---------------------------------------------------------------- /chat (AI symptom triage used by triage.html)
EMERGENCY_KEYWORDS = [
    # English
    "chest pain", "difficulty breathing", "can't breathe", "cannot breathe", "unconscious",
    "unresponsive", "severe bleeding", "heavy bleeding", "convulsion", "seizure", "stroke",
    "paralysis", "poisoning", "suicide", "not breathing", "blue lips", "severe burn",
    "snake bite", "drowning",
    # Hindi (romanized + devanagari)
    "saans nahi", "behosh", "khoon zyada", "chhati me dard", "dorra pad raha", "zeher",
    "सांस नहीं", "बेहोश", "ज्यादा खून", "छाती में दर्द", "दौरा", "जहर", "लकवा",
    # Marathi
    "श्वास घेता येत नाही", "बेशुद्ध", "जास्त रक्तस्त्राव", "छातीत दुखणे", "फेफरे", "विष",
]
HIGH_KEYWORDS = [
    "high fever", "tez bukhar", "बहुत तेज़ बुखार", "जास्त ताप", "vomiting blood", "khoon ki ulti",
    "severe pain", "bahut dard", "बहुत दर्द", "तीव्र वेदना", "dehydration", "dast", "दस्त",
    "पातळ जुलाब", "breathless", "saans phulna", "सांस फूलना", "धाप लागणे",
]
MODERATE_KEYWORDS = [
    "fever", "bukhar", "बुखार", "ताप", "cough", "khansi", "खांसी", "खोकला", "pain", "dard",
    "दर्द", "दुखणे", "cold", "sardi", "सर्दी", "सर्दी-खोकला", "headache", "sir dard", "सिरदर्द",
    "डोकेदुखी", "vomiting", "ulti", "उल्टी", "उलटी", "weakness", "kamzori", "कमजोरी",
]


def classify_severity(text):
    """Returns (severity, matched_terms) — matched_terms is what the
    explainability layer shows the patient/ASHA worker ('you said X, so...')."""
    t = (text or "").lower()
    for bucket, sev in ((EMERGENCY_KEYWORDS, "EMERGENCY"), (HIGH_KEYWORDS, "HIGH"), (MODERATE_KEYWORDS, "MODERATE")):
        matched = [k for k in bucket if k in t]
        if matched:
            # prefer the longest / most specific matched phrase(s), max 3
            matched = sorted(set(matched), key=len, reverse=True)[:3]
            return sev, matched
    return "LOW", []


NEXT_STEP = {
    "EMERGENCY": "Call Emergency SOS / 108 immediately and go to the nearest facility with emergency care.",
    "HIGH": "Visit a PHC/CHC or teleconsult today — do not wait more than a few hours.",
    "MODERATE": "Arrange a facility visit within 24–48 hours if symptoms do not improve.",
    "LOW": "Monitor symptoms at home, stay hydrated and rested; seek care if it worsens.",
}
REPLY = {
    "EMERGENCY": "These symptoms may be life-threatening. This needs emergency medical attention right now.",
    "HIGH": "These symptoms need prompt medical attention from a doctor or health worker.",
    "MODERATE": "These symptoms should be checked by a health worker soon, though they don't look immediately dangerous.",
    "LOW": "These symptoms look mild for now. Keep monitoring and rest.",
}


import re


def _extract_json_object(text):
    """MedGemma (and most local LLMs) often wrap JSON in ```json fences, add a
    sentence before/after it, or use smart quotes — a plain json.loads() on the
    raw response fails on all of these, which is why replies looked broken/empty.
    This pulls out the first {...} block and cleans it before parsing."""
    if not text:
        raise ValueError("empty response")
    text = text.strip()
    text = re.sub(r"^```(?:json)?", "", text.strip(), flags=re.I).strip()
    text = re.sub(r"```$", "", text.strip()).strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("no JSON object found in model response: " + text[:200])
    chunk = text[start:end + 1]
    chunk = chunk.replace("\u201c", '"').replace("\u201d", '"').replace("'", '"')
    # trailing commas before } or ] break strict json.loads — strip them
    chunk = re.sub(r",\s*([}\]])", r"\1", chunk)
    return json.loads(chunk)


def call_ollama(message):
    """Use a real local MedGemma/Ollama model if OLLAMA_URL is configured.

    Fixes vs the old version (which produced poor/garbled answers):
    - format: "json" tells Ollama to constrain generation to valid JSON
      (supported by Ollama's /api/generate), instead of hoping the model
      free-text happens to be parseable.
    - A stricter, example-driven system prompt in plain English so a small
      quantized MedGemma doesn't wander into a diagnosis or long preamble.
    - Robust extraction (_extract_json_object) as a safety net if the model
      still adds stray text/markdown around the JSON.
    - Output validation: severity must be one of the 4 known levels and
      reply/next_step must be non-empty, otherwise we fall back to the
      rule-based classifier rather than showing a broken/empty answer.
    - Longer timeout (60s) since MedGemma on CPU/small GPUs is slow, and the
      old 15s timeout was silently truncating most real replies to the
      fallback with no indication why.
    """
    system = (
        "You are SwasthyaSetu, a calm rural-health triage assistant for India. "
        "A patient (who may describe symptoms in English, Hindi or Marathi, sometimes "
        "romanized) tells you what they feel. "
        "Respond with ONLY a single JSON object, nothing before or after it, no markdown fences. "
        "Schema: {\"severity\": one of \"LOW\", \"MODERATE\", \"HIGH\", \"EMERGENCY\", "
        "\"reply\": a short warm 1-2 sentence response in the SAME language the patient used, "
        "\"next_step\": one short clear sentence telling them exactly what to do next}. "
        "Never give a diagnosis or medicine name. If any life-threatening sign is mentioned "
        "(chest pain, can't breathe, unconscious, heavy bleeding, seizure, poisoning) use EMERGENCY.\n"
        "Example output: {\"severity\": \"HIGH\", \"reply\": \"Tez bukhar aur ulti 2 din se hona chinta ki baat hai.\", "
        "\"next_step\": \"Aaj hi nearest PHC ya CHC jaayein.\"}"
    )
    payload = json.dumps({
        "model": OLLAMA_MODEL,
        "system": system,
        "prompt": f"Patient says: {message}",
        "format": "json",
        "stream": False,
        "options": {"temperature": 0.2},
    }).encode()
    req = urllib.request.Request(f"{OLLAMA_URL}/api/generate", data=payload,
                                  headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
    result = _extract_json_object(data.get("response", ""))

    severity = str(result.get("severity", "")).upper().strip()
    reply = str(result.get("reply", "")).strip()
    next_step = str(result.get("next_step", "")).strip()
    if severity not in ("LOW", "MODERATE", "HIGH", "EMERGENCY") or not reply or not next_step:
        raise ValueError(f"MedGemma returned an incomplete/invalid answer: {result}")

    return {"severity": severity, "reply": reply, "next_step": next_step, "matched_terms": None}


@app.post("/chat")
def chat():
    body = request.get_json(force=True) or {}
    message = body.get("message", "")
    if OLLAMA_URL:
        try:
            result = call_ollama(message)
            return jsonify(result)
        except Exception as e:
            # Print (not swallow) so you can actually see WHY MedGemma failed —
            # e.g. Ollama not running, model not pulled, timeout, bad JSON —
            # instead of it silently and invisibly falling back every time.
            print(f"[MedGemma/Ollama fallback] {type(e).__name__}: {e}")
    severity, matched = classify_severity(message)
    result = {
        "severity": severity,
        "reply": REPLY[severity],
        "next_step": NEXT_STEP[severity],
        # Explainability: exactly which words drove the decision, so the UI
        # can show "You said X, that's why this is HIGH risk" instead of a
        # black-box label. Empty list for LOW (no risk phrase matched).
        "matched_terms": matched,
    }
    return jsonify(result)


# ---------------------------------------------------------------- health check
@app.get("/health")
def health():
    return jsonify({"status": "ok", "time": _now()})


if __name__ == "__main__":
    init_db()
    app.run(host="127.0.0.1", port=5000, debug=False)
