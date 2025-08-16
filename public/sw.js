const CACHE_NAME = 'my-friend-assistant-cache-v2.11.0';
const urlsToCache = [
  '/auth',
  '/favicon.ico',
  '/logo-auth.png',
  '/to-buy',
  '/policy',
  '/menu-list',
  '/account',
  '/fallback',
  '/cam',
];

// Установка Service Worker
// self.addEventListener('install', (event) => {
//   console.log('Service Worker installing.');
//   self.skipWaiting();
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(urlsToCache);
        console.log('Кэш успешно заполнен');
      } catch (error) {
        console.error('Ошибка при добавлении ресурсов в кэш:', error);
      }
    })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  const currentCache = CACHE_NAME; // текущий кэш
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== currentCache) {
            console.log('Удаляем кэш:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Обработка fetch-запросов
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const excludePaths = [
    '/api/ai-chat',
    '/api/user',
  ];

  const shouldExclude = excludePaths.some((path) => url.pathname.startsWith(path));

  if (event.request.method !== 'GET' || shouldExclude) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/fallback');
        });
      })
  );
});

// Обработка push-уведомлений
// self.addEventListener('push', (event) => {
//   const data = event.data ? event.data.json() : {};
//   event.waitUntil(
//     clients.matchAll({ type: 'window', includeUncontrolled: true }).then(() => {
//       // Можно добавить логику, если нужно проверить активные окна
//       // Например, не показывать уведомление, если открыта страница PWA
//       const title = data.title || 'Новое уведомление';
//       const options = {
//         body: data.body || '',
//         icon: '/logo192.png',
//         badge: '/push-badge.png',
//         data: data.data || {},
//       };
//       return self.registration.showNotification(title, options);
//     })
//   );
// });
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const appUrl = 'my-friend-assistant.ru';
      const appUrlLocal = 'localhost:3000';

      // Проверяем, есть ли активное окно с нужным URL
      const isAppActive = clientList.some((client) => {
        return client.url.includes(appUrl) || client.url.includes(appUrlLocal);
      });

      console.log('isAppActive, dont show push', isAppActive);

      // Если приложение активно, не показываем уведомление
      // if (isAppActive) {
      //   return;
      // }

      // Иначе показываем уведомление
      const title = data.title || 'Новое уведомление';
      const options = {
        body: data.body || '',
        icon: '/logo192.png',
        badge: '/push-badge.png',
        data: data.data || {},
      };

      return self.registration.showNotification(title, options);
    })
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const appUrl = 'my-friend-assistant.ru';
      let appClient = null;

      for (const client of clientList) {
        if (client.url.includes(appUrl)) {
          appClient = client;
          break;
        }
      }

      if (appClient) {
        return appClient.focus();
      } else {
        return clients.openWindow(appUrl);
      }
    })
  );
});