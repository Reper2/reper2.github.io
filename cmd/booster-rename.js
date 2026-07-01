const fs = require('fs');
const path = require('path');

// web1.txt and files1.txt are right next to the script inside /cmd/
const WEB_TEXT_FILE = path.join(__dirname, 'web1.txt');   
const TARGET_LIST_FILE = path.join(__dirname, 'files1.txt'); 

// Target path moves out of /cmd/ up to the root, then into /assets/music/
const MUSIC_DIR = path.resolve(__dirname, '../assets/music/');

function runBatchRename() {
  if (!fs.existsSync(WEB_TEXT_FILE)) return console.error(`❌ Missing: ${WEB_TEXT_FILE}`);
  if (!fs.existsSync(TARGET_LIST_FILE)) return console.error(`❌ Missing: ${TARGET_LIST_FILE}`);
  if (!fs.existsSync(MUSIC_DIR)) return console.error(`❌ Missing Music Directory target path: ${MUSIC_DIR}`);

  console.log(`📂 Target Folder Located: "${path.basename(MUSIC_DIR)}"`);
  console.log('🔄 Step 1: Extracting clean tracklist database...');
  
  const webContent = fs.readFileSync(WEB_TEXT_FILE, 'utf8');
  const lines = webContent.replace(/\r\n/g, '\n').split('\n');
  const webTracks = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // 🎯 UNIVERSAL FIX: Match multi-disc "1  1." or single-disc "1." tracks dynamically
    const multiDiscMatch = line.match(/^(\d+)\s+(\d+)\./);
    const singleDiscMatch = line.match(/^(\d+)\./);
    
    if (multiDiscMatch || singleDiscMatch) {
      let prefix = "";
      let trackNum = 0;

      if (multiDiscMatch) {
        const currentCD = multiDiscMatch[1];
        trackNum = parseInt(multiDiscMatch[2], 10);
        const paddedTrack = trackNum < 10 ? `0${trackNum}` : `${trackNum}`;
        prefix = `${currentCD}-${paddedTrack}.`;
      } else {
        trackNum = parseInt(singleDiscMatch[1], 10);
        const paddedTrack = trackNum < 10 ? `0${trackNum}` : `${trackNum}`;
        prefix = `${paddedTrack}.`;
      }

      // Scan downwards to locate the text block title line cleanly
      let nameLineIndex = i + 1;
      while (nameLineIndex < lines.length && !lines[nameLineIndex].trim()) {
        nameLineIndex++;
      }

      if (nameLineIndex < lines.length) {
        let trackName = lines[nameLineIndex].trim();
        
        // Safety guard against hitting structural artifacts or metadata sizes
        if (trackName.match(/^\d+:\d+/) || trackName.includes('MB') || trackName.includes('get_app')) {
          continue; 
        }

        // Clean out illegal operating system filename characters safely
        trackName = trackName.replace(/\//g, '');
        trackName = trackName.replace(/[\/\\?%*:|"<>]/g, '').trim();

        webTracks.push({
          prefix: prefix,
          fullName: trackName
        });
      }
    }
  }

  console.log(`📋 Successfully built a clean database of ${webTracks.length} tracks.`);
  console.log('📑 Step 2: Processing target files from files1.txt...');
  
  const targetContent = fs.readFileSync(TARGET_LIST_FILE, 'utf8');
  const localTargets = targetContent.replace(/\r\n/g, '\n')
    .split('\n')
    .map(name => name.trim())
    .filter(name => name.length > 0 && name.toLowerCase().endsWith('.mp3'));

  let renameCount = 0;
  const usedPrefixes = new Set();

  localTargets.forEach(filename => {
    const ext = path.extname(filename);
    const coreFilename = path.basename(filename, ext);
    const oldPath = path.join(MUSIC_DIR, filename);

    if (!fs.existsSync(oldPath)) {
      console.warn(`⚠️ Skipped (Not found on disk): "${filename}"`);
      return;
    }

    let bestMatch = null;
    let highestScore = 0;

    webTracks.forEach(wt => {
      const score = calculateUniversalFuzzyScore(coreFilename, wt.fullName);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = wt;
      }
    });

    // Accept matches with a strong structural confidence rating
    if (bestMatch && highestScore >= 0.40) {
      if (usedPrefixes.has(bestMatch.prefix)) {
        console.error(`🚨 Collision Alert: Duplicate track match on ID "${bestMatch.prefix}". Skipping "${filename}".`);
        return;
      }

      const newFilename = `${bestMatch.prefix} ${bestMatch.fullName}${ext}`;
      const newPath = path.join(MUSIC_DIR, newFilename);

      try {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ [Match Clarity: ${(highestScore * 100).toFixed(0)}%] "${filename}" ➔ "${newFilename}"`);
        usedPrefixes.add(bestMatch.prefix);
        renameCount++;
      } catch (e) {
        console.error(`❌ Rename Error on ${filename}:`, e.message);
      }
    } else {
      console.warn(`⚠️ Skipped (No clean database match): "${filename}"`);
    }
  });

  console.log(`\n🎉 Complete! Formatted ${renameCount} soundtracks.`);
}

function calculateUniversalFuzzyScore(localName, webName) {
  const clean = (str) => str.toLowerCase()
    .replace(/'s/g, 's')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
  
  const s1 = clean(localName);
  const s2 = clean(webName);

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const tokens1 = s1.split(/\s+/);
  const tokens2 = s2.split(/\s+/);

  let matchedTokens = 0;
  tokens1.forEach(t => {
    if (tokens2.includes(t)) matchedTokens++;
  });

  const tokenScore = matchedTokens / Math.max(tokens1.length, tokens2.length);
  const stringSimilarity = jaroWinklerDistance(s1, s2);

  return (tokenScore * 0.7) + (stringSimilarity * 0.3);
}

function jaroWinklerDistance(s1, s2) {
  let m = 0; if (s1.length === 0 || s2.length === 0) return 0; if (s1 === s2) return 1;
  let s1_matches = new Array(s1.length).fill(false), s2_matches = new Array(s2.length).fill(false);
  let range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1; if (range < 0) range = 0;
  for (let i = 0; i < s1.length; i++) {
    let start = Math.max(0, i - range), end = Math.min(i + range + 1, s2.length);
    for (let j = start; j < end; j++) {
      if (s2_matches[j] || s1[i] !== s2[j]) continue;
      s1_matches[i] = true; s2_matches[j] = true; m++; break;
    }
  }
  if (m === 0) return 0;
  let t = 0, k = 0;
  for (let i = 0; i < s1.length; i++) {
    if (!s1_matches[i]) continue;
    while (!s2_matches[k]) k++; if (s1[i] !== s2[k]) t++; k++;
  }
  t = t / 2;
  let jaro = ((m / s1.length) + (m / s2.length) + ((m - t) / m)) / 3, p = 0.1, l = 0;
  while (s1[l] === s2[l] && l < Math.min(4, s1.length)) l++;
  return jaro + (l * p * (1 - jaro));
}

runBatchRename();