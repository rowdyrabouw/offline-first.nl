if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("sw.js")
			.then((reg) => {
				console.log("%c[app.js] Service Worker registered", "color: #00ABD2");
			})
			.catch((e) => {
				console.error(
					"%c[app.js] Error during service worker registration:",
					e
				);
			});
	});
}
