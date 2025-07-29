const CACHE_NAME = 'alisa-birthday-pwa-v6'; // Увеличена версия кэша
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
  './IMG_0023.webp'
];

// Установка сервис-воркера и кэширование статических ресурсов
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

// Перехват запросов и отдача из кэша, если доступно
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Кэш найден, возвращаем ресурс из кэша
        if (response) {
          return response;
        }
        // Кэш не найден, делаем запрос к сети
        return fetch(event.request)
          .then((networkResponse) => {
            // Если запрос успешен, кэшируем новый ресурс
            // Проверяем, что запрос действителен и не является запросом расширения
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
        // В случае ошибки сети или отсутствия кэша
        console.log('Network request failed and no cache match. Consider adding an offline page.');
      })
  );
});

// Активация сервис-воркера и удаление старых кэшей
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
