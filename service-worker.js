const CACHE_NAME = 'alisa-birthday-pwa-v2'; // Обновляй версию при изменениях
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
  './default_cover.png',

  // Все аудиотреки (URL-encoded!)
  './tracks/01%20the%20way%20u%20see%20things.mp3',
  './tracks/02%20OMG.mp3',
  './tracks/03%20The%20Song%20They%20Played%20(When%20I%20Crashed).mp3',
  './tracks/04%20Nothing%20To%20Do.mp3',
  './tracks/05%20OM.Nomnom.mp3',
  './tracks/06%20When%20I%20Lie%20(but%20the%20door%20slaps%20kinda).mp3',
  './tracks/07%20Star%20Shopping.mp3',
  './tracks/08%20Walk%20Away%20In%20The%20Door%20(demo%20F_ck).mp3',
  './tracks/09%20Absolute%20in%20Doubt.mp3',
  './tracks/10%20Hell%20Like.mp3',
  './tracks/11%20promised%20(unreleased).flac',
  './tracks/12%20Still%20Alive%20(feat%20lido)%20(for%20a%20day).wav',
  './tracks/wxtd.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(
          urlsToCache.map(url => new Request(url, { cache: 'reload' }))
        );
      })
      .catch(err => console.error('Ошибка кэширования:', err))
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Аудио запросы — всегда сначала из кэша
  if (requestUrl.pathname.includes('/tracks/') || requestUrl.pathname.endsWith('music.mp3')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) return cachedResponse;

          return fetch(event.request)
            .then(networkResponse => {
              return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            })
            .catch(() => {
              // fallback — фоновая музыка
              return caches.match('./music.mp3');
            });
        })
    );
  } else {
    // Всё остальное — cache first, then network fallback
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});