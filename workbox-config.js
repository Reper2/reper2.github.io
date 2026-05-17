// eslint-disable-next-line no-undef
module.exports = {
	globDirectory: "./",
	globIgnores: ["**/node_modules/**/*", "**/src/**/*", "workbox-config.js", "package.json", "package-lock.json", "**/cmd/**/*"],
	globPatterns: ["**/*.{html,css,js,map,ts,png,jpg,jpeg,svg,ttf,txt,webmanifest,json,ico,webp,md}"],
	maximumFileSizeToCacheInBytes: 5000000, //5MB
	swDest: "./sw.js",
	ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
	runtimeCaching: [
		{
			// Match any request going to the GitHub raw content domain
			urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*$/,
			// Use the Cache-First strategy so it only hits the network once per image
			handler: 'CacheFirst',
			options: {
				cacheName: 'backgrounds-db-cache',
				expiration: {
					maxEntries: 50,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
				},
				// Ensure CORS requests are cached properly
				cacheableResponse: {
					statuses: [0, 200], // 0 handles opaque responses if CORS behaves strictly, 200 is standard success
				},
			},
		},
	],
};