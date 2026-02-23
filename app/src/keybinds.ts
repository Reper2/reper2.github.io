import { copyLink } from "./core";
import updateUrl from "./url-updater";

document.addEventListener("keydown", (k) => {
  if (k.ctrlKey && k.key === "/") {
    console.warn("Ctrl+/ was pressed");
    window.location.href = "/keybinds.html";
  }

  if (k.altKey && k.key === "s") {
    console.warn("Alt+S was pressed");
    $("#audctrlBtn_show").trigger("click");
  }

  if (k.altKey && k.key === "h") {
    console.warn("Alt+H was pressed");
    $("#audctrlBtn_hide").trigger("click");
  }

  if (k.altKey && k.key === "u") {
    console.warn("Alt+U was pressed");
    updateUrl();
  }

  if (k.ctrlKey && k.key === "c") {
    console.warn("Ctrl+C was pressed");
    copyLink(window.location.href);
  }

  if (k.altKey && k.key === "l") {
    console.warn("Alt+L was pressed");
    window.open("https://github.com/Reper2/reper2.github.io/blob/master/LICENSE");
    window.open("/LICENSE");
  }

  if (k.ctrlKey && k.key === "i") {
    console.warn("Ctrl+I was pressed");
    $("#install").trigger("click");
  }

  if (k.key === "Backspace") {
    console.warn("Backspace was pressed");
    $("#back").trigger("click");
  }

  if (k.key === "Enter") {
    console.warn("Enter was pressed");
    $("#optSet").trigger("click");
  }

  if (k.altKey && k.key === "r") {
    console.warn("Alt+R was pressed");
    $("#optReset").trigger("click");
  }

  if (k.key === "?") {
    console.warn("? was pressed");
    $("#optRand").trigger("click");
  }

  if (k.ctrlKey && k.altKey && k.key === "d") {
    console.warn("Ctrl+Alt+D was pressed");
    window.open("/app/dist/keybinds.js");
    window.open("/app/src/keybinds.ts");
  }
});