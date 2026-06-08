import { Database, Grass, Music } from "../../lib/db-typings";
import { updateUrl, RandomPicker } from "./utils";

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
interface AudCtrlElems {
  _: HTMLDivElement;
  btn: {
    _: HTMLButtonElement[]; // [showBtn, hideBtn]
    id: string[];
    disp: string[];
    name: string[];
    log: string[];
  };
  tt: {
    _: HTMLSpanElement[]; // [showTooltip, hideTooltip]
    name: string[];
  };
  playback: {
    _: HTMLButtonElement[]; // [prevBtn, playPauseBtn, nextBtn]
    ids: string[];
    labels: string[];
    tooltips: string[];
  };
}

export function showAudioControls(obj: AudCtrlElems, audObj: Music.Config): void {
  obj.btn._[0].style.display = "none";
  obj.btn._[1].style.display = "block";

  // Show all playback buttons
  obj.playback._.forEach(btn => btn.style.display = "inline-block");

  const activeEl = audObj.elems[audObj.currentIndex];
  if (activeEl) activeEl.style.display = "block";
}

export function hideAudioControls(obj: AudCtrlElems, audObj: Music.Config): void {
  obj.btn._[0].style.display = "block";
  obj.btn._[1].style.display = "none";

  // Hide all playback buttons
  obj.playback._.forEach(btn => btn.style.display = "none");

  audObj.elems.forEach((el: HTMLAudioElement) => el.style.display = "none");
}
/**
 * Asynchronously locates and extracts the audio file out of the zip binary array.
 */
export async function getTrackUrl(obj: Music.Config, sav: string): Promise<string | null> {
  for (let i = 0; i < obj.db[0].contents.length; i++) {
    const album = obj.db[0].contents[i];

    for (let j = 0; j < album.contents.length; j++) {
      const track = album.contents[j];

      // Strip the extension to match against your 'sav' tracking state
      if (track.name.replace(/\.[^/.]+$/, "") === sav) {

        // 🌐 Directly build the relative network path to the loose asset file
        const directAssetPath = `./assets/music/${album.name}/${track.name}`;

        // Return the raw URL string immediately—no extraction required!
        return directAssetPath;
      }
    }
  }
  return null;
}
/**
 * Force-stops any active crossfade immediately, snapping volumes to their endpoints.
 */
export function cancelCurrentCrossfade(obj: Music.Config, fadeIntervalId: number | null, _isCrossfading: boolean): void {
  if (fadeIntervalId !== null) {
    clearInterval(fadeIntervalId);
    fadeIntervalId = null;
    _isCrossfading = false;

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
  playMode: "sequential" | "random",
  fadeIntervalId: number | null,
  isCrossfading: boolean,
  isBooting: boolean
): Promise<void> {
  if (isBooting) {
    return;
  }

  if (isCrossfading) {
    cancelCurrentCrossfade(musicObj, fadeIntervalId, isCrossfading);
  }

  const currentEl = musicObj.elems[musicObj.currentIndex];
  const nextIdx: 0 | 1 = musicObj.currentIndex === 0 ? 1 : 0;
  const nextEl = musicObj.elems[nextIdx];

  const trackUrl = await getTrackUrl(musicObj, targetTrackName);
  if (!trackUrl) {
    console.error("Invalid soundtrack target:", targetTrackName);
    return;
  }

  isCrossfading = true;

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

  setupAudioListeners(nextEl, musicObj, grassObj, playMode, fadeIntervalId, isCrossfading, isBooting);

  nextEl.play().catch(e => {
    console.warn("Audio play blocked by browser policy:", e);
    isCrossfading = false;
  });

  const CROSSFADE_DURATION = 10000;
  const INTERVAL_STEP = 100;
  const steps = CROSSFADE_DURATION / INTERVAL_STEP;
  let currentStep = 0;

  fadeIntervalId = window.setInterval(() => {
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
      if (fadeIntervalId !== null) {
        clearInterval(fadeIntervalId);
        fadeIntervalId = null;
      }

      if (currentEl) {
        currentEl.pause();
        currentEl.controls = false;
        currentEl.style.display = "none";
        currentEl.volume = 0; // Reset completely
      }

      nextEl.volume = 1;
      musicObj.currentIndex = nextIdx;

      isCrossfading = false;
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
  playMode: "sequential" | "random",
  fadeIntervalId: number | null,
  isCrossfading: boolean,
  isBooting: boolean
): void {
  el.ontimeupdate = () => {
    if (el.duration && !isCrossfading) {
      const crystalTimeRemaining = el.duration - el.currentTime;
      if (crystalTimeRemaining <= 10) {
        triggerNextTrack(musicObj, grassObj, playMode, fadeIntervalId, isCrossfading, isBooting);
      }
    }
  };

  el.onended = () => {
    if (!isCrossfading) {
      triggerNextTrack(musicObj, grassObj, playMode, fadeIntervalId, isCrossfading, isBooting);
    }
  };
}

/**
 * This function is bound to the Next [Track] button.
 */
export function triggerNextTrack(
  musicObj: Music.Config,
  grassObj: Grass.Config,
  playMode: "sequential" | "random",
  fadeIntervalId: number | null,
  isCrossfading: boolean,
  isBooting: boolean
): void {
  if (playMode === "random") {
    pickRandomTrack(musicObj);
  } else {
    pickNextTrack(musicObj);
  }
  updateUrl(musicObj, grassObj, playMode, fadeIntervalId, isCrossfading, isBooting);
}

/**
 * This function is bound to the Prev[ious] [Track] button.
 */
export function triggerPreviousTrack(
  musicObj: Music.Config,
  grassObj: Grass.Config,
  playMode: "sequential" | "random",
  fadeIntervalId: number | null,
  isCrossfading: boolean,
  isBooting: boolean
): void {
  if (playMode === "random") {
    pickRandomTrack(musicObj);
    updateUrl(musicObj, grassObj, playMode, fadeIntervalId, isCrossfading, isBooting);
    return;
  }

  const currentMusic = sessionStorage.getItem("music");
  if (!currentMusic) return;

  for (let i = 0; i < musicObj.db[0].contents.length; i++) {
    const album = musicObj.db[0].contents[i];
    for (let j = 0; j < album.contents.length; j++) {
      if (album.contents[j].name.replace(/\.[^/.]+$/, "") === currentMusic) {
        const prevIndex = (j - 1 + album.contents.length) % album.contents.length;
        const prevCleanName = album.contents[prevIndex].name.replace(/\.[^/.]+$/, "");
        sessionStorage.setItem("music", prevCleanName);
        updateUrl(musicObj, grassObj, playMode, fadeIntervalId, isCrossfading, isBooting);
        return;
      }
    }
  }
}

/**
 * Picks a soundtrack from a random number as the index to search at.
 */
export function pickRandomTrack(obj: Music.Config): void {
  const musicPicker = new RandomPicker(obj.db[0].contents.map(album => album.name));
  musicPicker.pick(
    k => obj.db[0].contents.find(album => album.name === k)!.contents,
    (_k, file: Database.File) => {
      const cleanName = file.name.split(/[?#]/)[0].trim().replace(/\.[^/.]+$/, "");
      sessionStorage.setItem("music", cleanName);
    }
  );
}

/**
 * If the 'Set' button was used, continue playing soundtracks from that album
 */
export function pickNextTrack(obj: Music.Config): void {
  const currentMusic = sessionStorage.getItem("music");
  if (!currentMusic) {
    pickRandomTrack(obj);
    return;
  }

  for (let i = 0; i < obj.db[0].contents.length; i++) {
    const album = obj.db[0].contents[i];
    for (let j = 0; j < album.contents.length; j++) {
      if (album.contents[j].name.replace(/\.[^/.]+$/, "") === currentMusic) {
        const nextIndex = (j + 1) % album.contents.length;
        const nextCleanName = album.contents[nextIndex].name.replace(/\.[^/.]+$/, "");
        sessionStorage.setItem("music", nextCleanName);
        return;
      }
    }
  }
}