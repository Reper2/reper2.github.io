"use strict";
const fs = require("fs");
const path = require("path");

// Pointing directly to the "dist" directory relative to the project root
const dir = path.resolve("./app/dist");

function processFile(file) {
  let text = fs.readFileSync(file, "utf8");

  // 🚀 The Magic Fix: Using "+?" makes the match non-greedy so it catches 
  // every individual quote path on a single minified line sequentially!
  text = text.replace(/(["'])([^"'\r\n]+?)(\1)/g, (match, quote, importPath) => {

    // 1. Ignore anything that isn't a relative path
    if (!importPath.startsWith("./") && !importPath.startsWith("../")) {
      return match;
    }

    // 2. Ignore if it already ends with .js
    if (importPath.endsWith(".js")) {
      return match;
    }

    // 3. Handle directory trailing slash mappings
    if (importPath.endsWith("/")) {
      return `${quote}${importPath}index.js${quote}`;
    }

    // 4. Safely attach the extension
    return `${quote}${importPath}.js${quote}`;
  });

  fs.writeFileSync(file, text, "utf8");
}

function walk(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);

    if (stat.isDirectory()) {
      walk(p);
    } else if (p.endsWith(".js")) {
      processFile(p);
    }
  }
}

console.log("Processing files...");
walk(dir);
console.log("Finished updating imports!");