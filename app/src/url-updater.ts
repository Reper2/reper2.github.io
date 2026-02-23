import { opt } from "./app";
export default function updateURL() {
  window.location.href = "./?music=" + encodeURIComponent(opt.mus.sav.ss) + "&grass=" + encodeURIComponent(opt.grass.sav.ss);
}

const urlUd = {
  _: <HTMLDivElement>document.getElementById("urlUpdate"),
  btn: document.createElement("button"),
  tt: document.createElement("span")
};


[urlUd._.className, urlUd._.onclick] = ["tooltip", () => updateURL()];
urlUd._.className = "tooltip";
urlUd.btn.innerHTML = "🔄️🔗";
[urlUd.tt.className, urlUd.tt.innerHTML] = ["tooltiptext", "Update URL with new params (Ctrl+U)"];

urlUd.btn.appendChild(urlUd.tt);
urlUd._.appendChild(urlUd.btn);