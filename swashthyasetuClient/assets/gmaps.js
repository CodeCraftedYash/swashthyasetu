/* SwasthyaSetu — Google Maps integration layer.
   Two modes, so the app always works even with zero setup:

   1) NO API KEY (default): uses Google's classic keyless embed/deeplink URLs
      (maps.google.com/...&output=embed and the maps/dir/?api=1 deeplink).
      These need no key, no billing, and show a REAL Google map with real
      roads — good enough for distance-context + "open in Google Maps".

   2) WITH API KEY (optional, richer): if the user pastes a Google Maps
      JavaScript API key (Maps JavaScript API + Places API + Distance Matrix
      API enabled on their own Google Cloud project), SS_MAPS switches to:
        - Places Nearby Search  -> real, live hospital list (not just our
          fixed demo facility rows)
        - Distance Matrix       -> real driving distance/ETA on live traffic
        - JS Maps + Directions  -> an actual animated marker moving along the
          real route (used by the ambulance tracking page)

   Get a free-tier key: https://console.cloud.google.com/google/maps-apis
   (enable "Maps JavaScript API", "Places API", "Distance Matrix API").
*/
(function () {
  const KEY_STORAGE = 'ss_gmaps_api_key';

  function getKey() { return (localStorage.getItem(KEY_STORAGE) || '').trim(); }
  function setKey(k) { localStorage.setItem(KEY_STORAGE, (k || '').trim()); }
  function hasKey() { return !!getKey(); }

  let loadingPromise = null;
  function loadGoogleMaps() {
    const key = getKey();
    if (!key) return Promise.reject(new Error('NO_KEY'));
    if (window.google && window.google.maps) return Promise.resolve(window.google.maps);
    if (loadingPromise) return loadingPromise;
    loadingPromise = new Promise((resolve, reject) => {
      window.__ssGMapsReady = () => resolve(window.google.maps);
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places,geometry&callback=__ssGMapsReady`;
      s.onerror = () => { loadingPromise = null; reject(new Error('LOAD_FAIL')); };
      document.head.appendChild(s);
    });
    return loadingPromise;
  }

  function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  // Real hospital discovery via Google Places. Throws if no key / call fails —
  // caller should catch and fall back to the backend facility list.
  async function findNearestHospitals(lat, lng, opts = {}) {
    const maps = await loadGoogleMaps();
    return await new Promise((resolve, reject) => {
      const svc = new maps.places.PlacesService(document.createElement('div'));
      svc.nearbySearch(
        { location: { lat, lng }, rankBy: maps.places.RankBy.DISTANCE, type: 'hospital' },
        (results, status) => {
          if (status !== maps.places.PlacesServiceStatus.OK || !results || !results.length) {
            reject(new Error('NO_RESULTS: ' + status)); return;
          }
          const out = results.slice(0, opts.limit || 8).map(r => ({
            id: r.place_id,
            name: r.name,
            address: r.vicinity || '',
            lat: r.geometry.location.lat(),
            lng: r.geometry.location.lng(),
            distanceKm: Math.round(haversineKm(lat, lng, r.geometry.location.lat(), r.geometry.location.lng()) * 10) / 10,
            rating: r.rating,
            source: 'google',
          }));
          out.sort((a, b) => a.distanceKm - b.distanceKm);
          resolve(out);
        }
      );
    });
  }

  // Real driving distance/ETA (live traffic-aware) between two {lat,lng} points.
  async function drivingInfo(origin, dest) {
    const maps = await loadGoogleMaps();
    return await new Promise((resolve, reject) => {
      const svc = new maps.DistanceMatrixService();
      svc.getDistanceMatrix(
        { origins: [origin], destinations: [dest], travelMode: 'DRIVING' },
        (resp, status) => {
          if (status !== 'OK') { reject(new Error(status)); return; }
          const el = resp.rows[0].elements[0];
          if (el.status !== 'OK') { reject(new Error(el.status)); return; }
          resolve({
            distanceKm: el.distance.value / 1000,
            durationMin: Math.round(el.duration.value / 60),
            distanceText: el.distance.text,
            durationText: el.duration.text,
          });
        }
      );
    });
  }

  // ---- keyless helpers: always work, no API key needed ----
  function directionsUrl(origin, dest) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lng}&travelmode=driving`;
  }
  function embedUrl(origin, dest) {
    if (dest) return `https://www.google.com/maps?saddr=${origin.lat},${origin.lng}&daddr=${dest.lat},${dest.lng}&output=embed`;
    return `https://www.google.com/maps?q=${origin.lat},${origin.lng}&output=embed`;
  }

  // Small reusable "set your Google Maps API key" control — same markup/behaviour
  // wherever it's dropped in. Optional; the app works fully without it.
  function keyWidgetHTML(idPrefix) {
    const cur = getKey();
    return `<div style="margin-top:10px;font-size:12.5px;color:var(--muted)">
      <details ${cur ? '' : ''}>
        <summary style="cursor:pointer">🗝️ ${cur ? 'Google Maps API key set (live hospital search on)' : 'Add Google Maps API key for live hospital search'}</summary>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
          <input id="${idPrefix}Key" placeholder="Paste Google Maps API key" value="${cur ? cur.replace(/./g, '•').slice(0, 20) : ''}" style="flex:1;min-width:200px;padding:8px;border:1px solid var(--border,#dde3e7);border-radius:8px">
          <button type="button" id="${idPrefix}KeySave" class="btn outline btn-sm">Save</button>
          ${cur ? `<button type="button" id="${idPrefix}KeyClear" class="btn outline btn-sm">Clear</button>` : ''}
        </div>
        <small>Needs Maps JavaScript API + Places API + Distance Matrix API enabled on your Google Cloud project. Without a key the app still works using distance-based facility data.</small>
      </details>
    </div>`;
  }
  function bindKeyWidget(idPrefix, onChange) {
    const inp = document.getElementById(idPrefix + 'Key');
    const save = document.getElementById(idPrefix + 'KeySave');
    const clear = document.getElementById(idPrefix + 'KeyClear');
    if (save) save.onclick = () => {
      const v = inp.value.trim();
      if (v && !v.includes('•')) { setKey(v); if (onChange) onChange(); }
    };
    if (clear) clear.onclick = () => { setKey(''); if (onChange) onChange(); };
  }

  window.SS_MAPS = {
    getKey, setKey, hasKey, loadGoogleMaps, haversineKm,
    findNearestHospitals, drivingInfo, directionsUrl, embedUrl,
    keyWidgetHTML, bindKeyWidget,
  };
})();
