// WeatherGPT Documents PWA — offline shell cache + Red-alert push handler
var CACHE = 'weathergpt-doc-v1';
var CORE = ['./weathergpt-minimal-dashboard.html', './city-weather.html', './weathergpt-app.js', './weathergpt-plus.js', './manifest.json', './weather-logo.svg'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(function (hit) { return hit || fetch(e.request); }));
  }
});
self.addEventListener('push', function (e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) {}
  e.waitUntil(self.registration.showNotification(data.title || 'WeatherGPT Red Alert', {
    body: data.body || 'Red alert active — open WeatherGPT.',
    tag: 'wg-red'
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./weathergpt-minimal-dashboard.html'));
});
