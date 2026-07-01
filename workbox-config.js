const CURRENT_TIME = new Date().toISOString().replace('T', ' ').substring(0, 19);

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
		"assets/music/**/*", // Exclude raw music folders from pre-caching
		"app/databases/music.json", // Exclude the music database from pre-caching
		"app/databases/version.json", // Exclude the version file from pre-caching
		"**/*.map", // Exclude source maps from pre-caching
	],
	// Clean up production extensions and specifically target your app databases
	globPatterns: [
		"**/*.{html,css,js,png,jpg,jpeg,svg,ttf,webmanifest,ico,webp,bin,gltf}",
		"app/databases/*.json"
	],
	maximumFileSizeToCacheInBytes: 5000000, // 5MB is perfect for your background assets
	swDest: "./sw.js",
	cacheId: `reper2-build-${Date.now()}`,
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
      // 1. Target your specific deployment timestamp file
      urlPattern: /app\/databases\/version\.json$/,
      
      // 2. Enforce the NetworkOnly strategy (always bypass the cache)
      handler: 'NetworkFirst',
      
      // 3. Optional: Add a timeout so it fails quickly if the user is offline
      options: {
        networkTimeoutSeconds: 3
      }
    }
	],
};