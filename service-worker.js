const CACHE_NAME = "lista-compras-v2";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Instalar y cachear todo
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activar y limpiar versiones viejas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener("fetch", event => {
  // Evita bloquear campos de formulario offline
  if (event.request.method !== "GET") {
    return; // no interceptar POST o formularios
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Si se pierde conexión y no hay recurso cacheado
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      });
    })
  );
});

