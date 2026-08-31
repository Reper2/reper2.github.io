const express = require('express');
const path = require('path');
const app = express();
const PORT = 2633;

const projectRoot = path.resolve(__dirname, '..');

console.log("======================================");
console.log(`Real Project Root Path: ${projectRoot}`);
console.log("======================================");

const staticOptions = {
  extensions: ['html', 'htm']
};

// 1. Serve your main repository at the root URL (using the options)
app.use('/', express.static(projectRoot, staticOptions));
app.use('/assets', express.static(path.join(projectRoot, 'assets'), { 
  dotfiles: 'allow',
  fallthrough: false // This will force Express to print a loud error if it's a permission issue instead of hiding it
}));
app.use('/app', express.static(path.join(projectRoot, 'app'), {
  dotfiles: 'allow',
  fallthrough: false
}));

// 2. Serve sibling repositories at their respective URL paths

const repos = [
  'acnh',
  'acnh-apps',
  'cosmic-shower',
  'desktop-clock',
  // 'easter-egg-engine',
  // 'gtcf',
  'holiday-album',
  'mario-texture-pack',
  'mobile-clock',
  'switch-album',
  // 'tomodachi-album',
];

repos.forEach(repo => {
  const siblingPath = path.resolve(__dirname, '..', '..', repo);
  
  console.log(`Mapping URL /${repo}/ to system path: ${siblingPath}`);
  
  // Apply the same options to sibling repos just in case they have loose HTML files too
  app.use(`/${repo}`, express.static(siblingPath, staticOptions));
});

console.log("======================================");

app.use((req, res) => {
  res.status(404).send(`404: Local route "${req.url}" not found in Express mapping.`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running flawlessly at http://localhost:${PORT}`);
});