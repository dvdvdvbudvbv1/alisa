const CACHE_NAME = 'alisa-birthday-pwa-final-v1';
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
  
  // Треки с URL-encoded именами
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
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(err => console.error('Cache addAll error:', err))
  );
});

self.addEventListener('fetch', event => {
  // Особый обработчик для аудио
  if (event.request.url.includes('/tracks/') || event.request.url.includes('music.mp3')) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => {
          return cached || fetch(event.request)
            .then(response => {
              // Кэшируем полученный файл
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
              return response;
            })
            .catch(() => {
              // Fallback для аудио
              return caches.match('./music.mp3');
            });
        })
    );
  } else {
    // Стандартная обработка
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});