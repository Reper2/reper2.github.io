import app from "./app";

// Core UI control mapping structures
const audctrls = {
  _: <HTMLDivElement>document.getElementById("audctrls"),
  btn: {
    _: <HTMLButtonElement[]>[],
    id: ["audctrlBtn_show", "audctrlBtn_hide"],
    disp: ["none", "block"],
    name: ["🎵🎛️ - ON", "🎵🎛️ - OFF"],
    log: ["🎵🎛️ Audio controls are now visible.", "🚫 Audio controls are now hidden."]
  },
  tt: {
    _: <HTMLSpanElement[]>[],
    name: ["Show Audio Controls (Alt+S)", "Hide Audio Controls (Alt+H)"]
  }
};

// 1. Build components, link tooltips, and securely inject into the DOM layout tree
for (let i = 0; i < audctrls.btn.name.length; i++) {
  const button = document.createElement("button");
  button.id = audctrls.btn.id[i];
  button.style.display = audctrls.btn.disp[i ^ 1];
  button.innerHTML = audctrls.btn.name[i];
  audctrls.btn._.push(button);

  const tooltip = document.createElement("span");
  tooltip.className = "tooltiptext";
  tooltip.innerHTML = audctrls.tt.name[i];
  audctrls.tt._.push(tooltip);

  // Nest structures together
  button.appendChild(tooltip);
  if (audctrls._) {
    audctrls._.appendChild(button);
  }
}

// Assign tooltip utility class to container block
if (audctrls._) {
  audctrls._.className = "tooltip";
}

/**
 * Explicitly makes the currently active audio deck track visible on the page layout
 */
function showControls(): void {
  audctrls.btn._[0].style.display = "none";
  audctrls.btn._[1].style.display = "block";
  console.log(audctrls.btn.log[0]);
  
  // Instantly map block visualization to the active player index
  const activeEl = app.mus.elems[app.mus.currentIdx];
  if (activeEl) {
    activeEl.style.display = "block";
  }
  console.log(audctrls.btn.log[0], "Active player index:", app.mus.currentIdx);
}

/**
 * Sweeps and hides both audio decks completely out of view
 */
function hideControls(): void {
  audctrls.btn._[0].style.display = "block";
  audctrls.btn._[1].style.display = "none";
  console.log(audctrls.btn.log[1]);
  
  // Enforce structural hidden state on all elements to kill overlapping layout artifacts
  app.mus.elems.forEach((el: HTMLAudioElement) => {
    el.style.display = "none";
  });
  console.log(audctrls.btn.log[1], "All player elements hidden.");
}

// 2. Wire up interface click handlers
audctrls.btn._[0].onclick = () => showControls();
audctrls.btn._[1].onclick = () => hideControls();