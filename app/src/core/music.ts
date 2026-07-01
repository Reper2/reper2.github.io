import { Database, Grass, Music } from "../../lib/db-typings";
import { updateUrl } from "./utils";
import { RandomPicker } from "./core";
import { isLocalhost, appState } from "./core";
import SavUtils from "./storage";
import { MarioKartStems } from "./interfaces";

// Internal pointer to track elements locally without relying on the app object tree
let activeElementsPointer: [HTMLAudioElement, HTMLAudioElement] | null = null;
let activeIndexPointer: { currentIdx: 0 | 1; } = { currentIdx: 0 };

/**
 * Connects the dual crossfader arrays directly to the core proxy tracking hooks
 */
export function initMusicProxy(elems: [HTMLAudioElement, HTMLAudioElement], indexTracker: { currentIdx: 0 | 1; }): void {
  activeElementsPointer = elems;
  activeIndexPointer = indexTracker;
}

/**
 * Global proxy for accessing the currently active music element dynamically.
 */
export const music = {
  get style() {
    if (activeElementsPointer) {
      return activeElementsPointer[activeIndexPointer.currentIdx].style;
    }
    // Fallback deck mapping to prevent boot crashes before initialization
    const fallback = document.getElementById("music") as HTMLAudioElement;;
    return fallback ? fallback.style : ({} as CSSStyleDeclaration);
  }
};

export function togglePlayPause(obj: Music.Config, playPauseBtn: HTMLButtonElement): void {
  if (!isLocalhost) return;

  const activeEl = obj.elems[obj.currentIndex];
  if (!activeEl) return;

  if (activeEl.paused) {
    activeEl.play();
    playPauseBtn.childNodes[0].textContent = "⏸️ Pause";
  } else {
    activeEl.pause();
    playPauseBtn.childNodes[0].textContent = "▶️ Play";
  }
}

export async function getTrackUrl(obj: Music.Config, sav: string): Promise<string | null> {
  const music = new SavUtils("music");
  let targetAlbum: string | null = null;
  let targetTrack = sav;

  if (sav.includes(": ")) {
    const parts = sav.split(": ");
    targetAlbum = parts[0];
    targetTrack = parts[1];
  }

  for (let i = 0; i < obj.db[0].contents.length; i++) {
    const album = obj.db[0].contents[i];
    
    // Efficiency optimisation: skip if we explicitly passed an album and it doesn't match
    if (targetAlbum && album.name !== targetAlbum) continue;

    for (let j = 0; j < album.contents.length; j++) {
      const track = album.contents[j];

      if (track.name.replace(/\.[^/.]+$/, "") === targetTrack) {
        music.ss = `${album.name}: ${targetTrack}`;
        
        const directAssetPath = `/assets/music/${album.name}/${track.name}`;
        return directAssetPath;
      }
    }
  }
  return null;
}

/**
 * Force-stops any active crossfade immediately, snapping volumes to their endpoints.
 */
export function cancelCurrentCrossfade(obj: Music.Config, state: typeof appState): void {
  if (state.fadeIntervalId !== null) {
    clearInterval(state.fadeIntervalId);
    state.fadeIntervalId = null;
    state.isCrossfading = false;

    const currentEl = obj.elems[obj.currentIndex];
    const nextIdx = obj.currentIndex === 0 ? 1 : 0;
    const nextEl = obj.elems[nextIdx];

    if (currentEl) {
      currentEl.pause();
      currentEl.volume = 0;
      currentEl.style.display = "none";
    }
    nextEl.volume = 1;
    obj.currentIndex = nextIdx;
  }
}

/**
 * Eases soundtracks into each other using logarithmic math to adjust the volume according to how our ears perceive sound.
 */
export async function playWithCrossfade(
  targetTrackName: string,
  musicObj: Music.Config,
  grassObj: Grass.Config,
  state: typeof appState
): Promise<void> {
  if (state.isBooting) {
    return;
  }

  if (state.isCrossfading) {
    cancelCurrentCrossfade(musicObj, state);
  }

  const currentEl = musicObj.elems[musicObj.currentIndex];
  const nextIdx: 0 | 1 = musicObj.currentIndex === 0 ? 1 : 0;
  const nextEl = musicObj.elems[nextIdx];

  const trackUrl = await getTrackUrl(musicObj, targetTrackName);
  if (!trackUrl) {
    console.error("Invalid soundtrack target:", targetTrackName);
    return;
  }

  state.isCrossfading = true;

  nextEl.src = trackUrl;
  nextEl.load();
  nextEl.volume = 0;
  nextEl.controls = true;

  const hideButton = document.getElementById("audctrlBtn_hide");
  const isControlsPreferenceOn = hideButton && hideButton.style.display === "block";

  if (isControlsPreferenceOn) {
    nextEl.style.display = "block";
  } else {
    nextEl.style.display = "none";
  }

  if (currentEl) {
    currentEl.ontimeupdate = null;
    currentEl.onended = null;
  }

  setupAudioListeners(nextEl, musicObj, grassObj, state);

  nextEl.play().catch(e => {
    console.warn("Audio play blocked by browser policy:", e);
    state.isCrossfading = false;
  });

  const CROSSFADE_DURATION = 10000;
  const INTERVAL_STEP = 100;
  const steps = CROSSFADE_DURATION / INTERVAL_STEP;
  let currentStep = 0;

  state.fadeIntervalId = window.setInterval(() => {
    currentStep++;
    // 🛡️ Clamp progress strictly between 0.0 and 1.0 to prevent negative trigonometric results
    const progress = Math.min(1, Math.max(0, currentStep / steps));

    // Calculate target volumes safely clamped
    const targetNextVolume = Math.sin(progress * (Math.PI / 2));
    nextEl.volume = Math.min(1, Math.max(0, targetNextVolume));

    if (currentEl && !currentEl.paused) {
      const targetCurrentVolume = Math.cos(progress * (Math.PI / 2));
      currentEl.volume = Math.min(1, Math.max(0, targetCurrentVolume));
    }

    // Use greater-than-or-equal to handle any interval step arithmetic overrides cleanly
    if (currentStep >= steps) {
      if (state.fadeIntervalId !== null) {
        clearInterval(state.fadeIntervalId);
        state.fadeIntervalId = null;
      }

      if (currentEl) {
        currentEl.pause();
        currentEl.controls = false;
        currentEl.style.display = "none";
        currentEl.volume = 0; // Reset completely
      }

      nextEl.volume = 1;
      musicObj.currentIndex = nextIdx;

      state.isCrossfading = false;
      console.log(`✨ 10s Logarithmic Cross-fade complete. Active track: ${targetTrackName}`);
    }
  }, INTERVAL_STEP);
}

/**
 * Configures the audio elements' event listeners.
 */
export function setupAudioListeners(
  el: HTMLAudioElement,
  musicObj: Music.Config,
  grassObj: Grass.Config,
  state: typeof appState
): void {
  el.ontimeupdate = () => {
    if (el.duration && !state.isCrossfading) {
      const crystalTimeRemaining = el.duration - el.currentTime;
      if (crystalTimeRemaining <= 10) {
        triggerNextTrack(musicObj, grassObj, state);
      }
    }
  };

  el.onended = () => {
    if (!state.isCrossfading) {
      triggerNextTrack(musicObj, grassObj, state);
    }
  };
}

/**
 * This function is bound to the Next [Track] button.
 */
export function triggerNextTrack(
  musicObj: Music.Config,
  grassObj: Grass.Config,
  state: typeof appState
): void {
  if (state.playMode === "random") {
    pickRandomTrack(musicObj);
  } else {
    pickNextTrack(musicObj);
  }
  updateUrl(musicObj, grassObj, state);
}

export function triggerPreviousTrack(
  musicObj: Music.Config,
  grassObj: Grass.Config,
  state: typeof appState
): void {
  if (state.playMode === "random") {
    pickRandomTrack(musicObj);
    updateUrl(musicObj, grassObj, state);
    return;
  }

  const currentMusicCompound = sessionStorage.getItem("music");
  if (!currentMusicCompound) return;

  // Unpack our coupled value cleanly
  const [currentAlbum, currentTrack] = currentMusicCompound.includes(": ") 
    ? currentMusicCompound.split(": ") 
    : ["", currentMusicCompound];

  for (let i = 0; i < musicObj.db[0].contents.length; i++) {
    const album = musicObj.db[0].contents[i];
    
    // Efficiency: Match album context bounds if known
    if (currentAlbum && album.name !== currentAlbum) continue;

    for (let j = 0; j < album.contents.length; j++) {
      if (album.contents[j].name.replace(/\.[^/.]+$/, "") === currentTrack) { // Uses clean track part now
        const prevIndex = (j - 1 + album.contents.length) % album.contents.length;
        const prevCleanName = album.contents[prevIndex].name.replace(/\.[^/.]+$/, "");
        
        sessionStorage.setItem("music", `${album.name}: ${prevCleanName}`);
        updateUrl(musicObj, grassObj, state);
        return;
      }
    }
  }
}

export function pickRandomTrack(obj: Music.Config): void {
  const music = new SavUtils("music");
  const musicPicker = new RandomPicker(obj.db[0].contents.map(album => album.name));
  musicPicker.pick(
    k => obj.db[0].contents.find(album => album.name === k)!.contents,
    (k, file: Database.File) => {
      const cleanName = file.name.split(/[?#]/)[0].trim().replace(/\.[^/.]+$/, "");
      // 🌟 Couple album identity string (k) with the track target 
      music.ss = `${k}: ${cleanName}`;
    }
  );
}

export function pickNextTrack(obj: Music.Config): void {
  const currentMusicCompound = new SavUtils("music");
  if (!currentMusicCompound.ss) {
    pickRandomTrack(obj);
    return;
  }

  const [currentAlbum, currentTrack] = currentMusicCompound.ss.includes(": ") 
    ? currentMusicCompound.ss.split(": ") 
    : ["", currentMusicCompound];

  for (let i = 0; i < obj.db[0].contents.length; i++) {
    const album = obj.db[0].contents[i];
    if (currentAlbum && album.name !== currentAlbum) continue;

    for (let j = 0; j < album.contents.length; j++) {
      if (album.contents[j].name.replace(/\.[^/.]+$/, "") === currentTrack) {
        const nextIndex = (j + 1) % album.contents.length;
        const nextCleanName = album.contents[nextIndex].name.replace(/\.[^/.]+$/, "");
        
        // 🌟 Write coupled format
        currentMusicCompound.ss = `${album.name}: ${nextCleanName}`;
        return;
      }
    }
  }
}

export function resolveTrackStems(trackUrl: string, musicDb: any): MarioKartStems {
  const stems: MarioKartStems = { base: trackUrl };

  if (!trackUrl.toLowerCase().includes("mario kart")) {
    return stems;
  }

  const lastSlash = trackUrl.lastIndexOf("/");
  const fileNameWithExt = trackUrl.substring(lastSlash + 1);
  const cleanTrackName = fileNameWithExt.replace(/\.[^/.]+$/, "");

  const mainAlbum = musicDb[0].contents.find((album: any) => 
    album.contents.some((file: any) => file.name === fileNameWithExt)
  );

  if (!mainAlbum) return stems;

  const targetStemFolder = mainAlbum.contents.find((item: any) => 
    item.type === "directory" && item.name === `.stems_${cleanTrackName}`
  );

  if (!targetStemFolder || !targetStemFolder.contents || targetStemFolder.contents.length === 0) {
    return stems;
  }

  const stemFiles = targetStemFolder.contents;
  const basePath = trackUrl.substring(0, lastSlash);
  const hiddenDir = `${basePath}/.stems_${cleanTrackName}`;

  const findFileByKeyword = (keywords: string[]) => {
    const match = stemFiles.find((file: any) => 
      keywords.some(kw => file.name.toLowerCase().includes(kw))
    );
    return match ? `${hiddenDir}/${match.name}` : undefined;
  };

  stems.prelude = findFileByKeyword(["prelude", "intro", "start", "countdown"]);
  stems.finalLap = findFileByKeyword(["final", "lap", "fast", "speed", "hurry", "3rd"]);
  stems.frontrunning = findFileByKeyword(["front", "lead", "fwd", "running", "1st"]);
  stems.medley = findFileByKeyword(["medley", "mashup", "compilation"]);

  // Parse and sort numbered elements dynamically
  const sectionMatches = stemFiles
    .filter((file: any) => /(section|part|sec|pt)[\s_-]*\d+/i.test(file.name))
    .sort((a: any, b: any) => {
      const numA = parseInt(a.name.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.name.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    });

  if (sectionMatches.length > 0) {
    stems.sections = sectionMatches.map((file: any) => `${hiddenDir}/${file.name}`);
    stems.base = stems.sections?.[0] ?? stems.base; // Point base tracking to Section 1
  } else {
    // Standard un-sectioned loop fallback scanner
    const normalFile = stemFiles.find((file: any) => {
      const nameLower = file.name.toLowerCase();
      return nameLower.includes("normal") || 
            (!nameLower.includes("prelude") && !nameLower.includes("intro") && 
             !nameLower.includes("final") && !nameLower.includes("lap") && 
             !nameLower.includes("fast") && !nameLower.includes("front") && 
             !nameLower.includes("medley"));
    });
    if (normalFile) {
      stems.base = `${hiddenDir}/${normalFile.name}`;
    }
  }

  return stems;
}