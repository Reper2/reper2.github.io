module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{html,mp3,ttf,png,css,ico,zip,js,webmanifest,txt,svg}'
	],

	maximumFileSizeToCacheInBytes: 100000000, //100MB
	swDest: './sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};