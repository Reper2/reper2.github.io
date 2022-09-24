"use strict";

// eslint-disable-next-line no-undef
module.exports = {
  globDirectory: "./",
  globPatterns: ["**/*.{html,mp3,ttf,png,jpg,css,ico,js,webmanifest,svg}"],
  maximumFileSizeToCacheInBytes: 100000000,
  //100MB
  swDest: "./sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/]
};