import { copyLink } from "./core";

document.addEventListener("keydown", (k) => {
  if (k.ctrlKey && k.key === "/") {
    console.warn("Ctrl+/ was pressed");
    window.location.href = "/keybinds.html";
  }

  if (k.altKey && k.key === "s") {
    k.preventDefault(); // Prevent default browser behavior for Alt+S
    console.warn("Alt+S was pressed");
    $("#audctrlBtn_show").trigger("click");
  }

  if (k.altKey && k.key === "h") {
    k.preventDefault(); // Prevent default browser behavior for Alt+H
    console.warn("Alt+H was pressed");
    $("#audctrlBtn_hide").trigger("click");
  }

  if (k.ctrlKey && k.key === "c") {
    k.preventDefault(); // Prevent default browser behavior for Ctrl+C
    console.warn("Ctrl+C was pressed");
    copyLink(window.location.href);
  }

  if (k.altKey && k.key === "l") {
    k.preventDefault(); // Prevent default browser behavior for Alt+L
    console.warn("Alt+L was pressed");
    window.open("https://github.com/Reper2/reper2.github.io/blob/master/LICENSE");
    window.open("/LICENSE");
  }

  if (k.ctrlKey && k.key === "i") {
    k.preventDefault(); // Prevent default browser behavior for Ctrl+I
    console.warn("Ctrl+I was pressed");
    $("#install").trigger("click");
  }

  if (k.key === "Backspace") {
    k.preventDefault(); // Prevent default browser behavior for Backspace
    console.warn("Backspace was pressed");
    $("#back").trigger("click");
  }

  if (k.key === "Enter") {
    k.preventDefault(); // Prevent default browser behavior for Enter
    console.warn("Enter was pressed");
    $("#optSet").trigger("click");
  }

  if (k.altKey && k.key === "r") {
    k.preventDefault(); // Prevent default browser behavior for Alt+R
    console.warn("Alt+R was pressed");
    $("#optReset").trigger("click");
  }

  if (k.key === "?") {
    console.warn("? was pressed");
    $("#optRand").trigger("click");
  }

  if (k.ctrlKey && k.altKey && k.key === "d") {
    k.preventDefault(); // Prevent default browser behavior for Ctrl+Alt+D
    console.warn("Ctrl+Alt+D was pressed");
    window.open("/app/dist/keybinds.js");
    window.open("/app/src/keybinds.ts");
  }

  if (k.ctrlKey && k.key === "z") {
    k.preventDefault(); // Prevent default browser behavior for Ctrl+Z
    console.warn("Ctrl+Z was pressed");
    localStorage.setItem("eggs", "{}");
    location.reload();
  }
});