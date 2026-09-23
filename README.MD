# What this is

### SwasthyaSetu is a Smart India Hackathon healthcare prototype focused on coordinating rural healthcare access across patients, ASHA workers, hospitals, doctors, ambulances, police/responders, and government services. Its central idea is “No Wrong Door”: users can enter through symptom assessment, facility discovery, teleconsultation, referral, or emergency SOS and be guided through a connected care journey.

The repository is currently dominated by a browser-based HTML/CSS/JavaScript prototype. The emergency-care experience is explicitly demo-only, using simulated hospital, doctor, bed, ambulance, and alert data.

---

## Stack
Language(s): HTML, CSS, and JavaScript
Framework / runtime: Static browser application; no frontend framework or build system
Notable libraries: Browser APIs such as localStorage, Geolocation, Speech Recognition, and Speech Synthesis; no third-party package dependencies are evident in the frontend
Backend status: A swashthyasetuBackend Git submodule is referenced at the repository root, while the checked-in frontend documentation describes a planned Node.js + Express backend with JSON prototype data



# How its organized  

```
swashthyasetuBackend
  Backend submodule reference; backend source is not part of the visible repository tree

swashtyasetuClient/
  index.html                    Main healthcare dashboard
  triage.html                   Symptom and severity assessment entry point
  facility-finder.html          Public facility discovery
  care-navigation.html          Care-navigation workflow
  teleconsult.html              Teleconsultation flow
  referral.html                 Referral workflow
  health-record.html            Patient health-record view
  schemes.html                  Government healthcare schemes
  asha-dashboard.html           ASHA worker dashboard
  doctor-dashboard.html         Doctor-facing dashboard
  facility-dashboard.html       Facility-facing dashboard
  government-dashboard.html     Government/administrative dashboard
  medicine-diagnostics.html     Medicine and diagnostics workflow
  login.html                    Demo login screen
  assets/
    shared.js                   Shared dashboard shell, bilingual UI, voice assistant,
                                navigation, and browser-backed data helpers
    styles.css                  Shared responsive visual system and dashboard styles
  emergency-network/
    index.html                  Emergency-care network landing page
    sos.html                    One-tap SOS and dispatch simulation
    severity.html               Emergency severity assessment
    hospitals.html              Hospital search, capacity, and token reservation
    qr-network.html             QR-based hospital check-in simulation
    ambulance.html              Ambulance route, ETA, and vitals simulation
    hospital-dashboard.html     Hospital emergency/front-desk dashboard
    doctor-availability.html    Doctor status and token booking
    icu-beds.html               Network-wide bed and ICU occupancy
    alerts.html                 Police/responder alert dashboard
    assets/shared.js            Emergency-specific mock data and alert event bus
    assets/styles.css            Emergency-network visual styles
  README.md                     Prototype scope, modules, run instructions, limitations
  PITCH.md                      SIH pitch and “No Wrong Door” product positioning
  RUN_PROJECT.txt               Simplified local launch instructions
  ```