# SIH Judge Pitch — SwasthyaSetu

## 30-second version
Rural healthcare is often not a lack of one service; it is a lack of coordination between services. A patient may not know where to go, an ASHA worker may have fragmented information, and a referral may not know whether the next facility can actually provide the required care. SwasthyaSetu connects the journey from village to the right level of public healthcare through explainable risk assessment, facility capability matching, teleconsultation, smart referrals and follow-up continuity.

## Core USP
**No Wrong Door:** Whether a citizen enters through an ASHA worker, self-assessment, PHC, teleconsultation or emergency pathway, the system connects them to the same continuous care journey.

## What makes it different
We are not presenting many disconnected features. Our core is the **Smart Care Navigation & Referral Engine** that decides the safest next coordination step using patient context, required service, facility capability, availability, distance and data freshness.

## Responsible AI line
The system does not claim to diagnose diseases or replace doctors. It provides explainable decision support and navigation; qualified healthcare professionals retain clinical decision-making.

## Standards & interoperability
Records are structured to map onto **ABDM (Ayushman Bharat Digital Mission)** Health ID and **FHIR** resources (Patient, Encounter, ServiceRequest), so the prototype's referral and record data can plug into India's national digital health stack as it matures.

## What makes the AI different from other health apps
- **Voice-first triage:** a patient or ASHA worker can just tap the mic and speak their symptoms in Hindi, Marathi or English — the form fills and submits itself. Built for low-literacy rural users who won't type a symptom description, not just a navigation gimmick.
- **Explainable, not a black box:** every severity result shows exactly which phrase(s) triggered it ("You mentioned 'chest pain', 'cannot breathe' — that's why this is EMERGENCY risk"), building trust and giving judges a concrete responsible-AI example instead of an opaque score.

## Built for low-connectivity, real backend
A Flask + SQLite backend gives every referral, record and ASHA task a real, cross-device source of truth — not just browser storage. When connectivity drops, the app keeps working: entries are captured locally and auto-synced the moment the network returns ("Save & Sync Later"), so frontline workers in low-signal areas are never blocked.
