const SHELL = 'source-trail-shell-v2';
const ASSETS = 'source-trail-assets-v2';
const CORE = [
  '/',
  '/index.html',
  '/offline.html',
  '/privacy/',
  '/terms/',
  '/legal.css',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/assets/research-trail-hero-960.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then(async (cache) => {
    const fetchFresh = async (url) => {
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (!response.ok) throw new Error(`Could not cache ${url}`);
      await cache.put(url, response.clone());
      return response;
    };
    await Promise.all(CORE.map(fetchFresh));
    const html = await (await fetchFresh('/index.html')).text();
    const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)].map((match) => match[1]);
    await Promise.all([...new Set(builtAssets)].map(fetchFresh));
  }));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => ![SHELL, ASSETS].includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => (await caches.match(event.request, { ignoreVary: true })) || (await caches.match('/index.html', { ignoreVary: true })) || caches.match('/offline.html', { ignoreVary: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreVary: true }).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) caches.open(ASSETS).then((cache) => cache.put(event.request, response.clone()));
      return response;
    }))
  );
});
