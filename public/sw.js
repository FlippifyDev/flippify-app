// public/sw.js

console.log('Service worker is registered and running.');

self.addEventListener('install', function (event) {
  console.log('Service worker installed');
});

self.addEventListener('activate', function (event) {
  console.log('Service worker activated');
});

self.addEventListener('push', function (event) {
  console.log('Push event received: ', event);
  const data = event.data.json();
  const options = {
    body: data.body || 'You have a new notification!',
    icon: data.icon || '/flippify-logo.png',
    badge: data.badge || '/flippify-badge.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Flippify', options)
  );
});
