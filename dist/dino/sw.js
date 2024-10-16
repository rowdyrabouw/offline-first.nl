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
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.host === "localhost:3000") {
    event.respondWith(
      (async () => {
        const dinosaurName = url.pathname.substring(1);
        const cachedResponse = await db.get('dinosaurs', dinosaurName);
        if (cachedResponse) {
          console.log("%c[sw.js] Returning cached response", "color: #FEC233");
          return new Response(JSON.stringify(cachedResponse));
        }
        console.log("%c[sw.js] Fetching from network", "color: #FEC233");
        const response = await fetch(event.request);
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        await db.put('dinosaurs', data);
        return response;
      })()
    );
  }
});