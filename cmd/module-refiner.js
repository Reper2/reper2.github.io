"use strict";
const fs = require("fs");
const path = require("path");

// Pointing directly to the "dist" directory relative to the project root
const dir = path.resolve("./app/dist"); 

function processFile(file) {
  let text = fs.readFileSync(file, "utf8");

  // Captures the import statement and isolates the relative path inside $2
  text = text.replace(
    /(from\s+["'])(\.[^"']*?)(["'])/g,
    (match, prefix, importPath, suffix) => {
      
      // Rule 1: If it already ends with .js, leave it completely alone
      if (importPath.endsWith(".js")) {
        return match;
      }

      // Rule 2: If it ends with a forward slash, append "index.js"
      if (importPath.endsWith("/")) {
        return `${prefix}${importPath}index.js${suffix}`;
      }

      // Rule 3: Otherwise, it's a standard file path missing its extension, append ".js"
      return `${prefix}${importPath}.js${suffix}`;
    }
  );

  fs.writeFileSync(file, text);
}

function walk(dir) {
  // Ensure the directory exists before trying to read it
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);

    if (stat.isDirectory()) {
      walk(p); // Recursively look inside subdirectories
    } else if (p.endsWith(".js")) {
      processFile(p);
    }
  }
}

console.log("Processing files...");
walk(dir);
console.log("Finished updating imports!");