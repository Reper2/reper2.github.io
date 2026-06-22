import SavUtils from "./core/storage";

export type ThemeType = "original" | "alt";

// Maintain local compatibility, but dynamically look up the window/session state
export const globalTheme = new SavUtils("site-theme");

/**
 * Updates the active stylesheet in the DOM based on the global state
 */
export function applyThemeElements(): void {
  let themeLink = document.getElementById("theme-link") as HTMLLinkElement;

  if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.id = "theme-link";
    themeLink.rel = "stylesheet";
    document.head.appendChild(themeLink);
  }

  const currentTheme = globalTheme.ls || globalTheme.sp;

  if (typeof currentTheme === "string" && currentTheme === "alt") {
    themeLink.href = "/assets/alt-theme.css";
    themeLink.disabled = false;
  } else if (typeof currentTheme === "string" && currentTheme === "original") {
    themeLink.disabled = true;
  } else {
    // Gracefully clear out anomalies or throw explicit errors
    throw new TypeError(`Unknown or corrupt theme state detected: Value primitive is a ${typeof currentTheme}`);
  }
}