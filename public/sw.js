const CACHE_VERSION = 'v1';
const STATIC_CACHE = `modesy-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `modesy-images-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `modesy-dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/en',
  '/ar',
];

const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|avif|svg)$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== IMAGE_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (IMAGE_EXTENSIONS.test(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      return caches.match('/en');
    }

    return new Response('Offline', { status: 503 });
  }
}
