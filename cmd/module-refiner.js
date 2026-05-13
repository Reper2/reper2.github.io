"use strict";
const fs = require("fs");
const path = require("path");

const dir = path.resolve("./app/dist"); // run relative to project root

function processFile(file) {
  let text = fs.readFileSync(file, "utf8");

  text = text.replace(
  /(from\s+["'])(\.[^"']*?)(?<!\.js)(["'])/g,
  "$1$2.js$3"
);

  fs.writeFileSync(file, text);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);

    if (stat.isDirectory()) walk(p);
    else if (p.endsWith(".js")) processFile(p);
  }
}

walk(dir);

console.log("Finished updating imports");