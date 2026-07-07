const CURRENT_TIME = new Date().toISOString().replace('T', ' ').substring(0, 19);

module.exports = {
  globDirectory: "./",
  // Explicitly ignore raw media source hierarchies
  globIgnores: [
    "**/node_modules/**/*",
    "**/src/**/*",
    "workbox-config.js",
    "package.json",
    "package-lock.json",
    "**/cmd/**/*",
    "assets/music/**/*", 
    "app/databases/version.json", 
    "**/*.map",
    "sw.js",
    "workbox-*.js"
  ],
  globPatterns: [
    "**/*.{html,css,js,png,jpg,jpeg,svg,ttf,webmanifest,ico,webp,bin,gltf}",
    // 💡 FIX: The "{.,}" modifier explicitly tells Workbox to match 
    // folders or filenames starting with a dot (like your .stems_ JSON maps)
    "app/databases/music/**/{.,}*.json"
  ],
  maximumFileSizeToCacheInBytes: 5000000, 
  swDest: "./sw.js",
  cacheId: `reper2-build-${Date.now()}`,
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  clientsClaim: true, 
  skipWaiting: true,   
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'backgrounds-db-cache',
        expiration: {
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, 
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /app\/databases\/version\.json$/,
      handler: 'NetworkOnly'
    }
  ],
};