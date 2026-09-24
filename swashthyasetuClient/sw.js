/* SwasthyaSetu Service Worker — makes the app installable and usable with
   no internet connection at all (rural / low-connectivity use case).
   Strategy: cache-first for everything the app ships with, so once a
   patient has opened the app one time (even briefly, e.g. on a relative's
   phone with signal, or via Wi-Fi at a PHC), every page, style and script
   loads instantly offline afterwards. Network is only used as a fallback
   for things not yet cached, and to pick up updates in the background. */

const CACHE_NAME = 'swasthyasetu-shell-v1';

const APP_SHELL = [
  './',
  'index.html',
  'login.html',
  'triage.html',
  'facility-finder.html',
  'facility-dashboard.html',
  'my-health-history.html',
  'teleconsult.html',
  'referral.html',
  'health-record.html',
  'medicine-diagnostics.html',
  'asha-dashboard.html',
  'doctor-dashboard.html',
  'traffic-police-dashboard.html',
  'government-dashboard.html',
  'schemes.html',
  'care-navigation.html',
  'ai-assistant.html',
  'awaaz-sahayak.html',
  'assets/styles.css',
  'assets/shared.js',
  'assets/api.js',
  'assets/gmaps.js',
  'assets/ambulance.svg',
  'emergency-network/index.html',
  'emergency-network/sos.html',
  'emergency-network/ambulance.html',
  'emergency-network/hospitals.html',
  'emergency-network/icu-beds.html',
  'emergency-network/alerts.html',
  'emergency-network/doctor-availability.html',
  'emergency-network/hospital-dashboard.html',
  'emergency-network/qr-network.html',
  'emergency-network/severity.html',
  'emergency-network/assets/styles.css',
  'emergency-network/assets/shared.js',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // addAll fails the whole install if even one file 404s — cache what we
      // can individually so one missing/renamed file never breaks offline mode.
      Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch(() => {/* skip missing file, keep going */})
        )
      )
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // never intercept POST/PATCH — api.js already queues those offline

  // Never cache calls to a backend API host (127.0.0.1:5000 etc.) or third-party
  // services (Maps, QR) — those are network-only and already degrade gracefully
  // in the page code itself when offline.
  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  if (!isSameOrigin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached); // offline and not cached: nothing more we can do
      // Cache-first: instant load offline; refresh cache quietly in the background.
      return cached || network;
    })
  );
});
