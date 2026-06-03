// Internal pointer to track elements locally without relying on the app object tree
let activeElementsPointer: [HTMLAudioElement, HTMLAudioElement] | null = null;
let activeIndexPointer: { currentIdx: 0 | 1 } = { currentIdx: 0 };

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

/**
 * Connects the dual crossfader arrays directly to the core proxy tracking hooks
 */
export function initMusicProxy(elems: [HTMLAudioElement, HTMLAudioElement], indexTracker: { currentIdx: 0 | 1 }): void {
  activeElementsPointer = elems;
  activeIndexPointer = indexTracker;
}

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

  // 💡 FIXED: Updates the active frame context cleanly
  setParam(name: string, value: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url.toString());
  }
}