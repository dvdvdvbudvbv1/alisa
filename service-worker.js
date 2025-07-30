const CACHE_NAME = 'alisa-birthday-pwa-v11'; // Увеличена версия кэша
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './music.mp3',
  './karina.gif',
  './fonts/Minecraftia-Regular.ttf',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './IMG_0020.gif',
  './IMG_0023.webp',
  './default_cover.png',
  // Добавляем все треки
  './tracks/01 the way u see things.mp3',
  './tracks/02 OMG.mp3',
  './tracks/03 The Song They Played (When I Crashed).mp3',
  './tracks/04 Nothing To Do.mp3',
  './tracks/05 OM.Nomnom.mp3',
  './tracks/06 When I Lie (but the door slaps kinda).mp3',
  './tracks/07 Star Shopping.mp3',
  './tracks/08 Walk Away In The Door (demo F_ck).mp3',
  './tracks/09 Absolute in Doubt.mp3',
  './tracks/10 Hell Like.mp3',
  './tracks/11 promised (unreleased).flac',
  './tracks/12 Still Alive (feat lido) (for a day).wav',
  './tracks/wxtd.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache during install:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          });
      })
      .catch(() => {
        return caches.match('./index.html');
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});