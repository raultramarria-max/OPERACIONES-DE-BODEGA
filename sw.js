/* ============================================================
   Service worker · Regularización sin OC
   Deja la app disponible sin señal (offline).

   >>> IMPORTANTE <<<
   Cada vez que subas una versión nueva de index.html, cambia el
   número de VERSION de abajo (ej: 'v2', 'v3'...). Eso obliga a
   los teléfonos a bajar la versión nueva.
   ============================================================ */
const VERSION = 'v1';
const CACHE   = 'regularizacion-' + VERSION;

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* instalación: guarda la app completa en el teléfono */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

/* activación: borra las versiones viejas */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* la app pide activar la versión nueva de inmediato */
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // no tocamos otros dominios

  /* la página: primero red (para tomar actualizaciones), si no hay señal, caché */
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copia));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  /* base de órdenes (opcional): siempre primero la red, para tomar la versión nueva */
  if (url.pathname.endsWith('ordenes.json')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copia = res.clone();
            caches.open(CACHE).then(c => c.put('./ordenes.json', copia));
          }
          return res;
        })
        .catch(() => caches.match('./ordenes.json'))
    );
    return;
  }

  /* el resto: primero caché (rápido), si no está, red */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
      }
      return res;
    }).catch(() => hit))
  );
});
