if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("sw.js")
			.then((reg) => {
				console.log(
					"%c[script.js] Service Worker registered",
					"color: #00ABD2"
				);
				reg.onupdatefound = () => {
					const installingWorker = reg.installing;
					installingWorker.onstatechange = () => {
						if (installingWorker.state === "installed") {
							console.log(
								"%c[app.js] New or updated content is available",
								"color: #00ABD2"
							);
							if (
								confirm(
									"A new version is available.\nWould you like to load the new version?"
								)
							) {
								window.location.reload();
							}
						}
					};
				};
			})
			.catch((e) => {
				console.error(
					"%c[app.js] Error during service worker registration:",
					e
				);
			});
	});
}
