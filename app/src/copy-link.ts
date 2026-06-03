import { copyLink } from "./core";
import { globalState } from "./themes";

const copy = {
  _: document.getElementById("copy") as HTMLDivElement,
  btn: document.createElement("button"),
  tt: document.createElement("span")
};


if (globalState.theme === "original") {
  copy.btn.innerHTML = "📋🔗";
} else if (globalState.theme === "zelda") {
  copy.btn.innerHTML = "Copy Link";
} else {
  throw new TypeError(`Unknown theme state: ${globalState.theme}`);
}

copy._.className = "tooltip";
copy.btn.onclick = (): void => copyLink(window.location.href);
[copy.tt.innerHTML, copy.tt.className] = ["Copy Link (Ctrl+C)", "tooltiptext"];

copy.btn.appendChild(copy.tt);
copy._.appendChild(copy.btn);