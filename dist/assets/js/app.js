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

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			// if the link is in the viewport
			if (entry.intersectionRatio === 1) {
				const isFetched = localStorage.getItem(entry.target.href);
				// if the link is not fetched yet
				if (!isFetched) {
					fetch(entry.target.href, { cache: "no-store" }).then(() => {
						// save link information
						localStorage.setItem(entry.target.href, entry.target.innerText);
					});
				}
			}
		});
	},
	{ threshold: 1 }
);

// get all links on the page without data-skip-prefetch attribute
const linkList = document.querySelectorAll("a:not([data-skip-prefetch])");
if (linkList) {
	linkList.forEach((link) => {
		observer.observe(link);
	});
}
