const DYNAMIC_CACHE = "dynamic-v1";
const STATIC_CACHE = "static-v2";
const STATIC_FILES = [
	"/",
	"index.html",
	"/favicon.ico",
	"assets/css/style.css",
	"assets/fonts/neuland_inline.woff2",
	"assets/img/jurassic-park.jpg",
	"assets/js/app.js",
	"offline.html",
];

self.addEventListener("install", (event) => {
	console.log("%c[sw.js] Service Worker installed", "color: #FEC233");
	event.waitUntil(
		caches.open(STATIC_CACHE).then((cache) => {
			cache.addAll(STATIC_FILES).then(() => {
				console.log("%c[sw.js] Files added to static cache", "color: #FEC233");
				self.skipWaiting();
			});
		})
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		// will return an array of cache names
		caches.keys().then((keys) => {
			return Promise.all(
				// go over all available keys
				keys.map((key) => {
					if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
						console.log("%c[sw.js] Deleting old caches", "color: #FEC233");
						return caches.delete(key);
					}
				})
			);
		})
	);
	console.log("%c[sw.js] Service Worker activated", "color: #FEC233");
	// ensure that the Service Worker is activated correctly (fail-safe)
	return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		// look at all caches for a match on the key (= request)
		caches.match(event.request).then((response) => {
			if (response) {
				// return from cache
				return response;
			} else {
				// fetch it from the server and save to cache
				return fetch(event.request)
					.then((res) => {
						return caches.open(DYNAMIC_CACHE).then((cache) => {
							cache.put(event.request.url, res.clone());
							return res;
						});
					})
					.catch(() => {
						return caches.open(STATIC_CACHE).then((cache) => {
							if (event.request.headers.get("accept").includes("text/html")) {
								return cache.match("/offline.html");
							}
						});
					});
			}
		})
	);
});
