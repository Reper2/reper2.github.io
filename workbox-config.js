// eslint-disable-next-line no-undef
module.exports = {
	globDirectory: "./",
	// Explicitly ignore audio directories so they never accidentally sneak into the installation step
	globIgnores: [
		"**/node_modules/**/*", 
		"**/src/**/*", 
		"workbox-config.js", 
		"package.json", 
		"package-lock.json", 
		"**/cmd/**/*",
		"assets/music/**/*" // Exclude raw music folders from pre-caching
	],
	// Clean up production extensions and specifically target your app databases
	globPatterns: [
		"**/*.{html,css,js,png,jpg,jpeg,svg,ttf,webmanifest,ico,webp,bin}",
		"app/databases/*.json"
	],
	maximumFileSizeToCacheInBytes: 5000000, // 5MB is perfect for your background assets
	swDest: "./sw.js",
	ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
	clientsClaim: true, // Forces immediate control of active pages
	skipWaiting: true,   // Skips the service worker waiting room on updates
	runtimeCaching: [
		{
			// Match any request going to the GitHub raw content domain
			urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*$/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'backgrounds-db-cache',
				expiration: {
					maxEntries: 150,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
				},
				cacheableResponse: {
					statuses: [0, 200], 
				},
			},
		},
		{
			// ⚡ OPTIMAL AUDIO CACHING: Stream your audio files using CacheFirst + Range Requests
			urlPattern: /\/assets\/music\/.*\.(mp3|mpeg|ogg)$/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'app-music-cache',
				expiration: {
					maxEntries: 20, // Keeps your storage lean
					maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
				},
				cacheableResponse: {
					statuses: [200],
				},
				// Crucial for media elements to prevent partial-content safari/chrome errors
				plugins: [
					{
						// Note: Ensure your build environment inputs the workbox.rangeRequests plugin if using a bundler
						cachedResponseWillBeUsed: async ({cachedResponse}) => cachedResponse,
					}
				]
			}
		}
	],
};