// eslint-disable-next-line no-undef
module.exports = {
	globDirectory: "./",
	globIgnores: ["**\/node_modules\/**\/*", "**\/src\/**\/*", "workbox-config.js", "package.json", "package-lock.json", "**\/cmd\/**\/*"],
	globPatterns: ["**\/*.{html,css,js,map,ts,png,jpg,jpeg,svg,ttf,txt,webmanifest,json,ico,webp,md}"],
	maximumFileSizeToCacheInBytes: 5000000, //5MB
	swDest: "./sw.js",
	ignoreURLParametersMatching: [/^utm_/, /^fbclid$/]
};