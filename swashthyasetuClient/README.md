# SwasthyaSetu — SIH26133

A full-stack prototype for improving access and coordination of rural public healthcare.

## Core idea
SwasthyaSetu connects symptom assessment, care navigation, public facility discovery, referrals, ASHA workflows, teleconsultation and follow-up.

## Stack
- Frontend: HTML, CSS, JavaScript (multilingual: English / Hindi / Marathi)
- Backend: Python + Flask, SQLite database (real persistence, cross-device)
- Offline-first: writes made without a network are queued in the browser and
  auto-synced once the backend is reachable again ("Save & Sync Later")

## Run
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on `http://127.0.0.1:5000`. Then open `index.html` in a browser
(or serve the root folder with any static server).

## Interoperability roadmap
Patient, referral and facility records are modelled so they can be mapped to
**ABDM (Ayushman Bharat Digital Mission)** Health ID and **FHIR** resource
standards (Patient, Encounter, ServiceRequest) for future integration with
India's national digital health stack — out of scope for this prototype, but
the data model (see `backend/app.py`) is designed to migrate cleanly to it.

## Important prototype note
The project uses demo/seed data for facilities and a rule-based (not
diagnostic) AI triage classifier. Production healthcare deployment requires
authentication, consent, encryption, audit logs, role-based access and
approved government/health-system integrations (ABDM/FHIR, DPDP Act
compliance).


Restored: hospital names, doctor roster and seat/token availability, ambulance visual/tracking, government scheme cards, and severity-check entry points.
