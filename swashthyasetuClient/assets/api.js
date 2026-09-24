/* SwasthyaSetu API layer — real Flask+SQLite backend, with offline-first
   "Save & Sync Later" support so the app keeps working with no internet.
   - GET requests: try the network first, fall back to the last cached copy.
   - POST/PATCH requests: try the network first; if it fails (offline / backend
     down), the write is queued in localStorage and auto-synced once the
     backend becomes reachable again (on 'online' event, tab focus, and a
     30s background retry). */
(function () {
  const BASE = (window.SS_BACKEND_URL || 'http://127.0.0.1:5000');
  const CACHE_KEY = 'swasthyasetu_cache_v1';
  const QUEUE_KEY = 'swasthyasetu_sync_queue_v1';

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
    catch { return fallback; }
  }
  function writeJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

  function cacheGet(path) { const c = readJSON(CACHE_KEY, {}); return c[path]; }
  function cacheSet(path, data) { const c = readJSON(CACHE_KEY, {}); c[path] = data; writeJSON(CACHE_KEY, c); }

  function queueList() { return readJSON(QUEUE_KEY, []); }
  function queuePush(item) { const q = queueList(); q.push(item); writeJSON(QUEUE_KEY, q); updateOfflineBadge(); }
  function queueClearSynced(ids) {
    const q = queueList().filter(x => !ids.includes(x._qid));
    writeJSON(QUEUE_KEY, q);
    updateOfflineBadge();
  }

  function updateOfflineBadge() {
    const n = queueList().length;
    let el = document.getElementById('ssSyncBadge');
    if (!n) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement('div');
      el.id = 'ssSyncBadge';
      el.style.cssText = 'position:fixed;left:14px;bottom:14px;z-index:9999;background:#D98C00;color:#fff;' +
        'font-size:12px;font-weight:700;padding:7px 12px;border-radius:20px;box-shadow:0 2px 8px rgba(0,0,0,.2);cursor:pointer';
      el.onclick = syncQueue;
      document.body.appendChild(el);
    }
    el.textContent = `⏳ ${n} item(s) waiting to sync — tap to retry`;
  }

  async function syncQueue() {
    const q = queueList();
    if (!q.length) return;
    const synced = [];
    for (const item of q) {
      try {
        const r = await fetch(BASE + item.path, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.body),
        });
        if (r.ok) synced.push(item._qid);
      } catch (e) { /* still offline, stop trying the rest for now */ break; }
    }
    if (synced.length) { queueClearSynced(synced); if (window.ssToast) ssToast('Synced ' + synced.length + ' saved item(s)'); }
  }

  window.addEventListener('online', syncQueue);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncQueue(); });
  setInterval(syncQueue, 30000);

  async function request(path, opt = {}) {
    const method = (opt.method || 'GET').toUpperCase();
    const body = opt.body ? JSON.parse(opt.body) : undefined;
    const url = BASE + path;

    if (method === 'GET') {
      try {
        const r = await fetch(url, { method });
        if (!r.ok) throw new Error('Backend error ' + r.status);
        const data = await r.json();
        cacheSet(path, data);
        return data;
      } catch (e) {
        const cached = cacheGet(path);
        if (cached !== undefined) return cached; // offline-first: serve last known data
        throw e;
      }
    }

    // POST / PATCH — try network, else queue for later sync
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error('Backend error ' + r.status);
      return await r.json();
    } catch (e) {
      const qid = 'q' + Date.now() + Math.random().toString(36).slice(2, 7);
      queuePush({ _qid: qid, path, method, body, at: new Date().toISOString() });
      if (window.ssToast) ssToast('Offline — saved locally, will sync automatically');
      // Return an optimistic local echo so the UI can update immediately.
      return { ...body, id: qid, status: body.status || 'Created', _pendingSync: true, createdAt: new Date().toISOString() };
    }
  }

  window.SS_API = {
    request,
    get(p) { return request(p); },
    post(p, b) { return request(p, { method: 'POST', body: JSON.stringify(b) }); },
    patch(p, b) { return request(p, { method: 'PATCH', body: JSON.stringify(b) }); },
  };

  window.SS_SYNC = { sync: syncQueue, pending: () => queueList().length };
  document.addEventListener('DOMContentLoaded', updateOfflineBadge);
  updateOfflineBadge();
})();
