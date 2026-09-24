# SwasthyaSetu — SIH Presentation Upgrade

## What was upgraded
- Projector-first typography with larger, sharper text and stronger contrast.
- Increased spacing and minimum touch/click target sizes.
- Stronger visual hierarchy for headings, metrics, tables, panels and CTAs.
- Persistent Emergency SOS and Find Ambulance quick-access controls on the main application.
- Responsive layout improvements for laptop, projector and mobile screens.
- Wider desktop content area for better projector utilization.
- Demo data is explicitly labelled as simulated so judges/users are not misled.
- Existing page content, navigation and original information were preserved.

## Important
This is still a frontend demo/prototype. Values marked as demo/simulated must be replaced with verified live data before real-world deployment.

## Backend redesign (this update)
- Added a real Flask + SQLite backend (`backend/app.py`) — replaces the old
  frontend-only `localStorage` demo layer for referrals, records, ASHA
  tasks and facilities. Data now persists across devices/browsers.
- `assets/api.js` rewritten: calls the real backend, with offline-first
  "Save & Sync Later" — writes made while offline are queued locally and
  auto-synced when the backend is reachable again.
- AI Symptom Check (`/chat`) now backed by a rule-based English/Hindi/Marathi
  severity classifier by default (works with zero setup), pluggable with a
  real local MedGemma/Ollama model via `OLLAMA_URL`.
- Triage results now auto-save into the longitudinal health record
  (`/records`) so `health-record.html` reflects real AI triage history.
- Marathi (`data-mr`) added across the shell/navigation and the Dashboard,
  AI Symptom Check, Health Records, ASHA Dashboard and Facility Dashboard
  pages, alongside existing English/Hindi.
- README/PITCH updated with an ABDM (Ayushman Bharat Digital Mission) /
  FHIR interoperability roadmap note.

## Voice-first triage + Explainable AI (this update)
- `triage.html`: added a mic button next to the symptom textarea using the
  Web Speech API (Hindi/Marathi/English, matched to the current UI language).
  Speaking symptoms fills the field and auto-submits — no typing required.
- `backend/app.py`: `/chat` now returns `matched_terms` — the exact phrase(s)
  that drove the severity decision — and `triage.html` renders a "Why?" line
  explaining the result in plain language, in the user's chosen language.
