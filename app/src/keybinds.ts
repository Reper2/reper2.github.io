import { copyLink } from "./core/";
import vault from "./eggs/vault";

document.addEventListener("keydown", (k: KeyboardEvent) => {
  if (!(k.target instanceof HTMLElement)) return;
  const target = k.target;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
    // Exception: Allow Enter to still submit the form even when inside the input
    if (k.key === "Enter") {
      k.preventDefault();
      console.warn("Enter was pressed inside input");
      const optSet = document.getElementById("optSet");
      if (optSet) optSet.click();
    }
    return;
  }

  // Normalize input strings to lower-case for safe conditional checks
  const keyLower = k.key.toLowerCase();

  if (k.ctrlKey && k.key === "/") {
    console.warn("Ctrl+/ was pressed");
    window.location.href = "/keybinds.html";
  }

  if (k.altKey && keyLower === "s") {
    k.preventDefault();
    console.warn("Alt+S was pressed");
    document.getElementById("audctrlBtn_show")?.click();
  }

  if (k.altKey && keyLower === "h") {
    k.preventDefault();
    console.warn("Alt+H was pressed");
    document.getElementById("audctrlBtn_hide")?.click();
  }

  if (k.ctrlKey && keyLower === "c") {
    k.preventDefault();
    console.warn("Ctrl+C was pressed");
    copyLink(window.location.href);
  }

  if (k.altKey && keyLower === "l") {
    k.preventDefault();
    console.warn("Alt+L was pressed");
    window.open("https://github.com/Reper2/reper2.github.io/blob/master/LICENSE");
    window.open("/LICENSE");
  }

  if (k.ctrlKey && keyLower === "i") {
    k.preventDefault();
    console.warn("Ctrl+I was pressed");
    const btn = document.getElementById("install");
    if (btn) btn.click();
  }

  if (k.key === "Backspace") {
    k.preventDefault();
    console.warn("Backspace was pressed");
    const btn = document.getElementById("back");
    if (btn) btn.click();
  }

  if (k.key === "Enter") {
    k.preventDefault();
    console.warn("Enter was pressed");
    const btn = document.getElementById("optSet");
    if (btn) btn.click();
  }

  if (k.altKey && keyLower === "r") {
    k.preventDefault();
    console.warn("Alt+R was pressed");
    const btn = document.getElementById("optReset");
    if (btn) btn.click();
  }

  if (k.key === "?") {
    k.preventDefault(); // Added preventDefault to keep string pure
    console.warn("? was pressed");
    const btn = document.getElementById("optRand");
    if (btn) btn.click();
  }

  if (k.ctrlKey && k.altKey && keyLower === "d") {
    k.preventDefault();
    console.warn("Ctrl+Alt+D was pressed");
    window.open("/app/dist/keybinds.js");
    window.open("/app/src/keybinds.ts");
  }

  if (k.ctrlKey && keyLower === "z") {
    k.preventDefault();
    console.warn("Ctrl+Z was pressed");
    vault.clear();
    location.reload();
  }
});