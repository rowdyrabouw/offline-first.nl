self.addEventListener("install", (event) => {
	console.log("%c[sw.js] Service Worker installed", "color: #FEC233");
});

self.addEventListener("activate", (event) => {
	console.log("%c[sw.js] Service Worker activated", "color: #FEC233");
	// ensure that the Service Worker is activated correctly (fail-safe)
	return self.clients.claim();
});
