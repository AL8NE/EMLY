const CACHE_NAME = 'emly-v1';
const assets = [
  './',
  './index.html',
  './css/style.css',
  './css/animations.css',
  './js/main.js',
  './js/vision.js',
  './js/ui.js',
  './js/speech.js',
  './js/brain.js',
  './js/actions.js'
];

// Cache the files for offline use
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});