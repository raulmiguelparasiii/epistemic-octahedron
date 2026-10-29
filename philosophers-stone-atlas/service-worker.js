const CACHE_NAME = 'philosophers-stone-atlas-offline-v11';
// revision: 2026-10-29 Plot terminology and current paper assets.
const CACHE_PREFIX = 'philosophers-stone-atlas-offline-';

const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './pwa.html',
  './pwa.webmanifest',
  './core.01.b64',
  './core.02.b64',
  './core.03.b64',
  './core.04.b64',
  './core.05a.b64',
  './core.05b.b64',
  './core.06.b64',
  './core.07.b64',
  './core.08.b64',
  './stone-data-v2.js',
  './stone-doctrines-v6.js',
  './stone-layer.js',
  './stone-polish-v3.js',
  './stone-readings-core-v2.js',
  './stone-readings-more-v2.js',
  './stone-referents-v4.js',
  './stone-semantics-camera-v6.js',
  './stone-semantics-v5.js',
  './stone-ui-v2.js',
  './worldview-layer.js',
  './paper/page-01.jpg',
  './paper/The-Philosophers-Stone-The-Objective-Structure-of-Maturity.pdf'
];

async function refreshPrecache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = PRECACHE.map(url => new Request(url, { cache: 'reload' }));
  await cache.addAll(requests);
}

self.addEventListener('install', event => {
  event.waitUntil(
    refreshPrecache().then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        .map(name => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        return (await caches.match('./index.html')) || (await caches.match('./pwa.html'));
      }
      throw error;
    }
  })());
});

self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'UPDATE_CACHE') return;

  event.waitUntil((async () => {
    try {
      await refreshPrecache();
      if (event.ports && event.ports[0]) event.ports[0].postMessage({ ok: true });
    } catch (error) {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ ok: false, message: String(error && error.message || error) });
      }
    }
  })());
});
