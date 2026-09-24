# SwasthyaSetu — Emergency Care Network (Frontend Prototype)

A working front-end prototype for a unified emergency-response platform: patients, hospitals,
and police/ambulance responders share one live picture of who needs help, where the nearest bed
is, and whether a doctor is actually free — instead of everyone finding out over the phone or in
a queue.

## How to run it

No build step — it's static HTML/CSS/JS. Two options:

1. **Just open it.** Double-click `index.html`. Everything works except the "use my real
   location" prompt on the SOS page (browsers block geolocation on `file://` — it falls back to
   a demo location automatically, so the flow still completes).
2. **Better: run a tiny local server** so geolocation and page-to-page state work exactly like
   production:
   ```
   cd swasthyasetu
   python3 -m http.server 8000
   ```
   then open `http://localhost:8000`.

## What's implemented (all 10 modules)

| # | Page | What it does |
|---|------|---------------|
| 1 | `index.html` | Home — the pitch, the 4-step flow, links to everything |
| 2 | `sos.html` | One-tap SOS: captures GPS, matches nearest hospital with capacity, "dispatches" an ambulance, timeline of live status |
| 3 | `severity.html` | Symptom checklist → weighted severity score → Critical/Serious/Moderate verdict with a recommended action |
| 4 | `hospitals.html` | Searchable, filterable hospital list with live bed counts per ward and one-tap token reservation |
| 5 | `qr-network.html` | Explains + simulates the QR check-in flow that replaces the counter line, plus a per-hospital QR gallery |
| 6 | `ambulance.html` | Animated live route/ETA, driver info, simulated vitals feed streaming to the receiving hospital |
| 7 | `hospital-dashboard.html` | Front-desk control room: live token queue, doctors on duty, incoming ambulance alerts, bed snapshot |
| 8 | `doctor-availability.html` | Every doctor on the network, live status (available / in surgery / busy / on leave), book next token |
| 9 | `icu-beds.html` | Ward-by-ward (General/ICU/Ventilator/Paediatric) occupancy across every hospital, network-wide totals |
| 10 | `alerts.html` | The police/responder screen — every live SOS with a location pin, severity, assigned unit, and status controls |

**The SOS → Alert Dashboard link is real, not just a mockup**: raising an SOS on page 2 writes an
alert into shared browser storage; the Alert Dashboard (page 10) and Hospital Dashboard (page 7)
both pick it up live (polling + an in-tab event) — so if you open `sos.html` and `alerts.html` in
two tabs, triggering an SOS in one updates the other within ~2 seconds, the way it would across a
patient's phone and a police terminal.

## Design approach

Emergency software has one job: be instantly legible under stress. So the system intentionally
avoids a decorative "startup" look — deep clinical teal-blue for trust and navigation, a single
reserved red for anything actually urgent (the SOS button, critical-severity pills), amber for
"getting full," green for "available." Space Grotesk for headings, IBM Plex Sans for body text,
IBM Plex Mono for anything numeric (tokens, IDs, timestamps, ETAs) so data reads as data. The
floating SOS button follows you on every page except the SOS page itself — the one thing this
whole product exists to make faster.

## Beyond the 10 requested modules — what I'd add next

- **Offline/SMS fallback for the SOS** — in low-signal areas, a USSD/SMS gateway version of the
  SOS (`*108#` style) so location can still reach the network without data connectivity.
- **Blood bank availability module** — same live-inventory pattern as ICU & Bed Availability,
  reused for blood units by type/hospital.
- **Multilingual UI** — Hindi + regional language toggle; emergency UX shouldn't assume English.
- **Verified responder accounts** — the "Responder Login" button is a stub; a real build needs
  authenticated roles (hospital staff, police, ambulance driver) with permission-scoped views.
- **Push notifications** — the "notify police" step is simulated via the Alert Dashboard polling;
  a real build would use FCM/APNs (or SMS as a fallback) to push straight to patrol officers'
  phones the moment an SOS lands nearby.

## Turning this into a real system

This is a frontend-only prototype: all "hospital," "doctor," and "ambulance" data lives in
`assets/shared.js` as mock arrays, and "live" state (SOS alerts, queue tokens) is kept in the
browser's `localStorage` so the demo works without a server. To make it real:

- Replace the mock arrays with API calls to a backend (hospitals/doctors/beds as a proper
  database, updated by hospital staff through the dashboard rather than hardcoded).
- Replace `localStorage` alerts with a real-time channel (WebSocket / Firebase / MQTT) so an SOS
  actually reaches other devices, not just other tabs in the same browser.
- Wire the QR codes to real per-hospital, per-desk check-in endpoints.
- Add a real routing/maps provider (Google Maps or OpenStreetMap + OSRM) in place of the
  simulated SVG route on the Ambulance Tracking page.
- The AI Severity Assessment is currently a transparent, weighted rule-based score (by design —
  it's auditable and doesn't hallucinate). If you want true ML triage later, keep this rule-based
  version as a fallback for when the model is unavailable.
