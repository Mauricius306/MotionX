// BASECAMP Service Worker
// Strategy: Cache app shell + CDN resources on install. Network-first for app files,
// cache-first for CDN assets.

const CACHE = 'basecamp-v2';

const APP_SHELL = [
  './',
  'index.html',
  'basecamp.jsx',
  'lucide-adapter.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-512-maskable.png'
];

const CDN_URLS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      // Cache app shell strictly
      return Promise.all([
        cache.addAll(APP_SHELL).catch(err => console.warn('App shell cache failed', err)),
        // CDN: tolerant, keep going even if one fails
        ...CDN_URLS.map(url =>
          fetch(url, { mode: 'cors' })
            .then(r => r.ok ? cache.put(url, r) : null)
            .catch(() => null)
        )
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET
  if (event.request.method !== 'GET') return;

  // Cache-first for CDN
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(event.request, copy));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Network-first for app files, fall back to cache
  event.respondWith(
    fetch(event.request).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy));
      }
      return res;
    }).catch(() => caches.match(event.request))
  );
});
