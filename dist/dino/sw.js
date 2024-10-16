import './idb.js';

let db;

const openDatabase = async () => {
  db = await idb.openDB('dino', 1, {
    upgrade(db, oldVersion, newVersion, transaction, event) {
      if (oldVersion < 1) {
        db.createObjectStore('dinosaurs', { keyPath: "name" });
      }
    }
  });
};

self.addEventListener("install", () => {
  console.log("%c[sw.js] Service Worker installed", "color: #FEC233");
  self.skipWaiting();
});

self.addEventListener("activate", async () => {
  console.log("%c[sw.js] Service Worker activated", "color: #FEC233");
  await openDatabase();
  console.log("%c[sw.js] IndexedDB available", "color: #FEC233");
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("http://localhost:3000")) {
    event.respondWith(
      (async () => {
        const url = new URL(event.request.url);
        const cachedResponse = await db.get('dinosaurs', url.pathname.substring(1));
        if (cachedResponse) {
          console.log(`%c[sw.js] Returning cached response for ${event.request.url}`, "color: #FEC233");
          return new Response(JSON.stringify(cachedResponse));
        }
        console.log(`%c[sw.js] Fetching from ${event.request.url}`, "color: #FEC233");
        const response = await fetch(event.request);
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        await db.put('dinosaurs', data);
        return response;
      })()
    );
  }
});