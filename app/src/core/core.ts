import { Name } from "./interfaces";
import SavUtils from "./storage";

// Dedicated storage instance for developer utility overrides
declare global {
  interface Window {
    devModeStorage: SavUtils;      // The instance (the variable)
    SavUtils: typeof SavUtils; // The Class itself (the constructor)
  }
}
window.devModeStorage = new SavUtils("fvs_dev_force_production");

// Checks for localhost/subnets, but strictly overrides to false if our session token is set to "true"
export const isLocalhost = window.devModeStorage.ss === "true" ? false : (
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) ||
  /^192\.168\\./.test(window.location.hostname) ||
  /^10\\./.test(window.location.hostname) ||
  /^172\\.(1[6-9]|2[0-9]|3[0-1])\\./.test(window.location.hostname)
);

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

export const appState = {
  playMode: "sequential" as "sequential" | "random",
  isBooting: true,
  isCrossfading: false,
  fadeIntervalId: null as number | null
};
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
    useFile: (name: Name, file: T) => void
  ): void {
    const k = this.randomName();
    const contents = getContents(k);
    const file = this.randomItem(contents);
    useFile(k, file);
  }
}
