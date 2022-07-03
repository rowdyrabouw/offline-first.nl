const retrieveCachedUrls = () => {
	const dynamicCacheVersion = localStorage.getItem("DYNAMIC_CACHE");
	const urls = [];
	caches.open(dynamicCacheVersion).then((cache) => {
		cache
			.keys()
			.then((keys) => {
				// retrieve all items from dynamic cache
				return Promise.all(
					keys.map((key) => {
						// only return pages, but ignore offline page
						if (key.url.endsWith(".html") && !key.url.includes("offline")) {
							urls.push(key.url);
							return key.url;
						}
					})
				);
			})
			.then(() => {
				cacheList(urls);
			});
	});
};

const cacheList = (urls) => {
	urls.forEach((url) => {
		// create a list item with link to cached page
		const listItem = document.createElement("li");
		const anchor = document.createElement("a");
		listItem.appendChild(anchor);
		// match the url with localStorage to retrieve text
		const text = localStorage[url] || url;
		const link = document.createTextNode(text);
		anchor.appendChild(link);
		anchor.href = url;
		// add link to offline page
		const element = document.getElementById("localStorageItems");
		element.appendChild(listItem);
	});
};

retrieveCachedUrls();
