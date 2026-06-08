import { Grass, Music } from "../../lib/db-typings";
import { playWithCrossfade } from "./music";

export const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

/**
 * Asynchronously fetch the contents of a json file.
*/
export async function fetchDB<T>(filename: string): Promise<T> {
  const response = await fetch(`/app/databases/${filename}.json`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch database "${filename}": ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * Copies link to clipboard.
*/
export function copyLink(url: string): void {
  navigator.clipboard.writeText(url)
  .then(() => {
    console.log("📋 Added to clipboard:", url);
    alert(`Copied link: ${url}`);
  })
  .catch(e => {
    console.error("Error copying to clipboard:", e);
    throw e;
  });
}

/**
 * Aliases for getting/setting session storage and url parameter data.
*/
export class SavUtils {
  getSS(key: string): string | null {
    return sessionStorage.getItem(key);
  }
  
  setSS(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
  
  getParam(name: string): string | null {
    return new URL(window.location.href).searchParams.get(name);
  }
  
  setParam(name: string, value: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url.toString());
  }
}

// Centralized, Memory-Safe Sound Engine
export const sfx = {
  cookingNormal: new Audio("/assets/zelda-theme/cooking_success.mp3"),
  cookingCritical: new Audio("/assets/zelda-theme/cooking_critical.mp3"),
  cookingDubious: new Audio("/assets/zelda-theme/cooking_failed.mp3"),
  
  playRandomCooking() {
    // Break out immediately if the user is running the 'original' theme
    if ((window as any).globalState?.theme !== "zelda") return;
    
    const roll = Math.random();
    let selectedAudio: HTMLAudioElement;
    
    if (roll < 0.15) {
      selectedAudio = this.cookingCritical;
      console.log("🎲 SFX: Critical Success Fanfare!");
    } else if (roll < 0.30) {
      selectedAudio = this.cookingDubious;
      console.log("🎲 SFX: Dubious Food Failure Thud!");
    } else {
      selectedAudio = this.cookingNormal;
      console.log("🎲 SFX: Standard Cooking Success!");
    }
    
    selectedAudio.currentTime = 0;
    selectedAudio.volume = 0.5;
    selectedAudio.play().catch(e => console.warn("SFX playback interrupted:", e));
  }
};
sfx.playRandomCooking = sfx.playRandomCooking.bind(sfx);

export function updateUrl(
  musicObj: Music.Config,
  grassObj: Grass.Config,
  playMode: "sequential" | "random",
  fadeIntervalId: number | null,
  isCrossfading: boolean,
  isBooting: boolean,
): void {
  const url = new URL(window.location.href);
  const music = sessionStorage.getItem("music");
  const grass = sessionStorage.getItem("grass");

  if (music) {
    url.searchParams.set("music", music);
    playWithCrossfade(music, musicObj, grassObj, playMode, fadeIntervalId, isCrossfading, isBooting);
  }

  if (grass) {
    url.searchParams.set("grass", grass);
    grassObj.elem.style.backgroundImage = `url('/images/grass/${grass}.png')`;
  }

  window.history.pushState({}, '', url);
  console.log("🚀 Forge Sync Complete:", url.search);
}

type Name = string | number;

export class RandomPicker {
  constructor(private names: Name[]) { }

  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomName(): Name {
    return this.randomItem(this.names);
  }

  pick<T>(
    getContents: (name: Name) => T[],
    useFile: (name: Name, file: T) => void,
  ): void {
    const k = this.randomName();
    const contents = getContents(k);
    const file = this.randomItem(contents);
    useFile(k, file);
  }
}