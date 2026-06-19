/**
 * Low-level decoupled utility for session, local, and URL storage profiles.
 * This file has ZERO dependencies to explicitly eliminate initialisation loops.
 */
class SavUtils {
  key: string;
  constructor(key: string) {
    this.key = key;
  }

  get ss(): string | null {
    try { return sessionStorage.getItem(this.key); } catch { return null; }
  }

  set ss(value: string) {
    if (typeof value !== "string") {
      console.warn(`[SavUtils] Expected type string for key "${this.key}", received ${typeof value}. Stringifying payload automatically.`);
      value = JSON.stringify(value);
    }
    try { sessionStorage.setItem(this.key, value); } catch { }
  }

  get ls(): string | null {
    try { return localStorage.getItem(this.key); } catch { return null; }
  }

  set ls(value: string) {
    if (typeof value !== "string") {
      console.warn(`[SavUtils] Expected type string for key "${this.key}", received ${typeof value}. Stringifying payload automatically.`);
      value = JSON.stringify(value);
    }
    try { localStorage.setItem(this.key, value); } catch { }
  }

  get sp(): string | null {
    return new URL(window.location.href).searchParams.get(this.key);
  }

  set sp(value: string) {
    if (typeof value !== "string") {
      console.warn(`[SavUtils] Expected type string for key "${this.key}", received ${typeof value}. Stringifying payload automatically.`);
      value = JSON.stringify(value);
    }
    const url = new URL(window.location.href);
    url.searchParams.set(this.key, value);
    window.history.replaceState({}, '', url.toString());
  }

  clear(type?: "ss" | "ls" | "sp"): void {
    switch (type) {
      case "ss":
        try { sessionStorage.removeItem(this.key); } catch { }
        break;
      case "ls":
        try { localStorage.removeItem(this.key); } catch { }
        break;
      case "sp":
        this.clearUrlParam();
        break;
      default:
        try { sessionStorage.removeItem(this.key); } catch { }
        try { localStorage.removeItem(this.key); } catch { }
        this.clearUrlParam();
        break;
    }
  }

  private clearUrlParam(): void {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has(this.key)) {
        url.searchParams.delete(this.key);
        window.history.replaceState({}, '', url.toString());
      }
    } catch (e) {
      console.warn(`Failed to clean URL parameter for key "${this.key}":`, e);
    }
  }
}
export default SavUtils;