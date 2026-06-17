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

  if (globalTheme.ls === "alt") {
    themeLink.href = "/assets/alt-theme.css";
    themeLink.disabled = false; // 🔑 Ensure the tag is explicitly enabled
    console.log("⚔️ alt CSS layers injected dynamically.");
  } else {
    themeLink.disabled = true; 
    console.log("😐 Original fallback enabled (alt overrides purged).");
  }
}