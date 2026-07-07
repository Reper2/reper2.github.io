import { Database, Grass, Music } from "../../lib/db-typings";
import { updateUrl, playTrackWithEngine } from "./utils";
import { RandomPicker } from "./core";
import { isLocalhost, appState } from "./core";
import SavUtils from "./storage";
import { MarioKartStems } from "./interfaces";

// Shared crossfade element caching pointers 
let activeElementsPointer: [HTMLAudioElement, HTMLAudioElement] | null = null;
let activeIndexPointer: { currentIdx: 0 | 1; } = { currentIdx: 0 };

export function initMusicProxy(elems: [HTMLAudioElement, HTMLAudioElement], indexTracker: { currentIdx: 0 | 1; }): void {
  activeElementsPointer = elems;
  activeIndexPointer = indexTracker;
}

export const music = {
  get style() {
    if (activeElementsPointer) return activeElementsPointer[activeIndexPointer.currentIdx].style;
    const fallback = document.getElementById("music") as HTMLAudioElement;
    return fallback ? fallback.style : ({} as CSSStyleDeclaration);
  }
};

export function togglePlayPause(obj: Music.Config, playPauseBtn: HTMLButtonElement): void {
  if (!isLocalhost) return;
  const activeEl = obj.elems[obj.currentIndex];
  if (!activeEl) return;

  if (activeEl.paused) {
    activeEl.play().catch(e => console.warn("Play deferred:", e));
    playPauseBtn.childNodes[0].textContent = "⏸️ Pause";
  } else {
    activeEl.pause();
    playPauseBtn.childNodes[0].textContent = "▶️ Play";
  }
}

/**
 * Resolves full URL structure from a given "Album: Track" compound key string.
 */
export async function getTrackUrl(obj: Music.Config, sav: string): Promise<string | null> {
  const [targetAlbum, targetTrack] = sav.includes(": ") ? sav.split(": ") : [null, sav];
  const musicStorage = new SavUtils("music");

  for (const album of obj.db[0].contents) {
    if (targetAlbum && album.name !== targetAlbum) continue;

    for (const track of album.contents) {
      if (track.name.replace(/\.[^/.]+$/, "") === targetTrack) {
        musicStorage.ss = `${album.name}: ${targetTrack}`;
        return `/assets/music/${album.name}/${track.name}`;
      }
    }
  }
  return null;
}

/**
 * Safely handles track cancellations globally if needed.
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
  state: typeof appState,
  overrideUrl?: string // Support engine overrides
): Promise<void> {
  if (state.isBooting) return;
  if (state.isCrossfading) {
    cancelCurrentCrossfade(musicObj, state);
  }

  const currentEl = musicObj.elems[musicObj.currentIndex];
  const nextIdx: 0 | 1 = musicObj.currentIndex === 0 ? 1 : 0;
  const nextEl = musicObj.elems[nextIdx];

  const trackUrl = overrideUrl || (await getTrackUrl(musicObj, targetTrackName));
  if (!trackUrl) {
    console.error("Invalid soundtrack target:", targetTrackName);
    return;
  }

  state.isCrossfading = true;

  nextEl.src = trackUrl;
  nextEl.load();
  nextEl.volume = 0;
  nextEl.controls = true;
  nextEl.style.display = document.getElementById("audctrlBtn_hide")?.style.display === "block" ? "block" : "none";

  if (currentEl) {
    currentEl.ontimeupdate = null;
    currentEl.onended = null;
  }

  if (!overrideUrl) {
    setupAudioListeners(nextEl, musicObj, grassObj, state);
  } else {
    console.log("🎯 [CROSSFADE] Stem engine path active. Bypassing global auto-skip listeners.");
  }

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
    const progress = Math.min(1, Math.max(0, currentStep / steps));
    const targetNextVolume = Math.sin(progress * (Math.PI / 2));
    nextEl.volume = Math.min(1, Math.max(0, targetNextVolume));

    if (currentEl && !currentEl.paused) {
      currentEl.volume = Math.min(1, Math.max(0, Math.cos(progress * (Math.PI / 2))));
    }

    if (currentStep >= steps) {
      if (state.fadeIntervalId !== null) {
        clearInterval(state.fadeIntervalId);
        state.fadeIntervalId = null;
      }

      if (currentEl) {
        currentEl.pause();
        currentEl.controls = false;
        currentEl.style.display = "none";
        currentEl.volume = 0;
      }

      nextEl.volume = 1;
      musicObj.currentIndex = nextIdx;
      state.isCrossfading = false;
      console.log(`✨ Cross-fade complete. Active stem/track asset: ${trackUrl}`);
    }
  }, INTERVAL_STEP);
}

/**
 * Assigns standardised operational timeline monitoring listeners to active decks.
 */
export function setupAudioListeners(
  el: HTMLAudioElement,
  musicObj: Music.Config,
  grassObj: Grass.Config,
  state: typeof appState
): void {
  el.ontimeupdate = () => {
    if (!el.duration || el.paused || state.isCrossfading) return;

    const timeRemaining = el.duration - el.currentTime;

    // Trigger transition precisely when the track enters its final 10 seconds
    if (timeRemaining <= 10) {
      el.ontimeupdate = null; // Clear trigger layout instantly to block loop racing conditions
      triggerNextTrack(musicObj, grassObj, state);
    }
  };

  el.onended = () => {
    if (state.isCrossfading) {
      console.log("🛑 [AUDIO LISTENERS] Bypassing onended execution loop: Crossfade is already active.");
      return;
    }
    
    triggerNextTrack(musicObj, grassObj, state);
  };
}

/**
 * Triggers track indexing loops and seamlessly pushes execution to the playback engine.
 */
export function triggerNextTrack(musicObj: Music.Config, grassObj: Grass.Config, state: typeof appState): void {
  state.playMode === "random" ? pickRandomTrack(musicObj) : pickNextTrack(musicObj);
  updateUrl(musicObj, grassObj, state);

  const nextTrackCompound = new SavUtils("music").ss;
  if (nextTrackCompound) {
    playTrackWithEngine(nextTrackCompound, musicObj, grassObj, state).catch(err =>
      console.error("Failed to transition to next engine track:", err)
    );
  }
}

export function triggerPreviousTrack(musicObj: Music.Config, grassObj: Grass.Config, state: typeof appState): void {
  if (state.playMode === "random") {
    pickRandomTrack(musicObj);
    updateUrl(musicObj, grassObj, state);
  } else {
    const musicStorage = new SavUtils("music");
    if (!musicStorage.ss) return;

    const [currentAlbum, currentTrack] = musicStorage.ss.includes(": ") ? musicStorage.ss.split(": ") : ["", musicStorage.ss];
    const album = musicObj.db[0].contents.find(a => a.name === currentAlbum);
    if (!album) return;

    const idx = album.contents.findIndex(t => t.name.replace(/\.[^/.]+$/, "") === currentTrack);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + album.contents.length) % album.contents.length;
      musicStorage.ss = `${album.name}: ${album.contents[prevIdx].name.replace(/\.[^/.]+$/, "")}`;
      updateUrl(musicObj, grassObj, state);
    }
  }

  // Force engine update on manual backwards navigation
  const prevTrackCompound = new SavUtils("music").ss;
  if (prevTrackCompound) {
    playTrackWithEngine(prevTrackCompound, musicObj, grassObj, state).catch(err => console.error(err));
  }
}

export function pickRandomTrack(obj: Music.Config): void {
  const musicStorage = new SavUtils("music");
  new RandomPicker(obj.db[0].contents.map(a => a.name)).pick(
    k => obj.db[0].contents.find(a => a.name === k)!.contents,
    (k, file: Database.File) => {
      musicStorage.ss = `${k}: ${file.name.split(/[?#]/)[0].trim().replace(/\.[^/.]+$/, "")}`;
    }
  );
}

export function pickNextTrack(obj: Music.Config): void {
  const musicStorage = new SavUtils("music");
  if (!musicStorage.ss) return pickRandomTrack(obj);

  const [currentAlbum, currentTrack] = musicStorage.ss.includes(": ") ? musicStorage.ss.split(": ") : ["", musicStorage.ss];
  const album = obj.db[0].contents.find(a => a.name === currentAlbum);
  if (!album) return;

  const idx = album.contents.findIndex(t => t.name.replace(/\.[^/.]+$/, "") === currentTrack);
  if (idx !== -1) {
    const nextIdx = (idx + 1) % album.contents.length;
    musicStorage.ss = `${album.name}: ${album.contents[nextIdx].name.replace(/\.[^/.]+$/, "")}`;
  }
}

export function resolveTrackStems(
  trackUrl: string, 
  musicDb: any, 
  strictContext?: { category: string; exactFileName: string }
): MarioKartStems {
  const stems: MarioKartStems = { base: trackUrl };
  
  // 1. Fully decode track URL to handle standard filesystem spaces vs %20
  const decodedTrackUrl = decodeURIComponent(trackUrl);
  const lastSlash = decodedTrackUrl.lastIndexOf("/");
  
  const targetCategoryDir = strictContext 
    ? decodeURIComponent(strictContext.category) 
    : decodedTrackUrl.substring(0, lastSlash).split("/").pop() || "";
    
  const fileNameWithExt = strictContext 
    ? decodeURIComponent(strictContext.exactFileName) 
    : decodedTrackUrl.substring(lastSlash + 1);
    
  const cleanTrackName = fileNameWithExt.replace(/\.[^/.]+$/, "");

  let mainAlbum = musicDb?.[0]?.contents?.find((album: any) => 
    album.name.toLowerCase().trim() === targetCategoryDir.toLowerCase().trim()
  );

  if (!mainAlbum && musicDb?.[0]?.contents) {
    mainAlbum = musicDb[0].contents.find((album: any) =>
      album.contents?.some((file: any) => decodeURIComponent(file.name) === fileNameWithExt)
    );
  }
  
  if (!mainAlbum) return stems;

  // 2. Exact folder matching using the unencoded string containing the literal '?'
  const targetStemFolder = mainAlbum.contents?.find((item: any) =>
    item.type === "directory" && 
    (item.name === `.stems_${cleanTrackName}` || item.name === `_stems_${cleanTrackName}`)
  );
  
  if (!targetStemFolder || !targetStemFolder.contents || targetStemFolder.contents.length === 0) {
    return stems;
  }

  // 3. Construct the parent path ensuring path segments are safely URI-escaped for the browser
  const escapedCategory = encodeURIComponent(mainAlbum.name);
  const escapedFolder = encodeURIComponent(targetStemFolder.name);
  const hiddenDir = `/assets/music/${escapedCategory}/${escapedFolder}`;

  const findFileByKeyword = (keywords: string[]) => {
    const match = targetStemFolder.contents.find((f: any) => {
      if (!f || !f.name) return false;
      const normalizedName = f.name.toLowerCase().replace(/[\s_-]/g, "");
      return keywords.some(kw => normalizedName.includes(kw.replace(/[\s_-]/g, "")));
    });
    
    if (!match) return undefined;
    const cleanFileName = match.name.substring(match.name.lastIndexOf("/") + 1);
    
    // Encode individual filenames safely
    return `${hiddenDir}/${encodeURIComponent(cleanFileName)}`;
  };

  stems.prelude = findFileByKeyword(["prelude", "intro", "start"]);
  stems.finalLap = findFileByKeyword(["final lap", "finallap", "fast", "critical", "rune", "fierce"]);
  stems.frontrunning = findFileByKeyword(["frontrunning", "front", "lead", "fwd", "1st"]);
  stems.medley = findFileByKeyword(["medley", "mashup", "compilation"]);
  stems.submix = findFileByKeyword(["moviescreen", "water", "underwater", "submix", "outpost"]);
  
  const sectionRegex = /(section|part|sec|pt|phase|ph)[\s_-]*\d+/i;
  const sectionMatches = targetStemFolder.contents
    .filter((f: any) => f && f.name && sectionRegex.test(f.name))
    .sort((a: any, b: any) => {
      const numA = parseInt(a.name.match(sectionRegex)?.[1] ?? "0", 10);
      const numB = parseInt(b.name.match(sectionRegex)?.[1] ?? "0", 10);
      return numA - numB;
    });

  if (sectionMatches.length > 0) {
    stems.sections = sectionMatches.map((f: any) => {
      const cleanFileName = f.name.substring(f.name.lastIndexOf("/") + 1);
      return `${hiddenDir}/${encodeURIComponent(cleanFileName)}`;
    });
    stems.base = stems.sections?.[0] ?? stems.base;
  } else {
    const normalFile = targetStemFolder.contents.find((f: any) => {
      if (!f || !f.name) return false;
      const nameLower = f.name.toLowerCase();
      return nameLower.includes("normal") || nameLower.includes("base") || 
        (!nameLower.includes("prelude") && !nameLower.includes("intro") && !nameLower.includes("start") && 
         !nameLower.includes("lap") && !nameLower.includes("medley") && !nameLower.includes("front"));
    });

    if (normalFile) {
      const cleanFileName = normalFile.name.substring(normalFile.name.lastIndexOf("/") + 1);
      stems.base = `${hiddenDir}/${encodeURIComponent(cleanFileName)}`;
    } else if (targetStemFolder.contents[0]) {
      const cleanFileName = targetStemFolder.contents[0].name.substring(targetStemFolder.contents[0].name.lastIndexOf("/") + 1);
      stems.base = `${hiddenDir}/${encodeURIComponent(cleanFileName)}`;
    }
  }

  return stems;
}