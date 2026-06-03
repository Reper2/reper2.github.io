import app, { triggerNextTrack, triggerPreviousTrack } from "./app";
import { globalState } from "./themes";

const audctrls = {
  _: document.getElementById("audctrls") as HTMLDivElement,
  // Main ON/OFF Master panel switches
  btn: {
    _: [] as HTMLButtonElement[],
    id: ["audctrlBtn_show", "audctrlBtn_hide"],
    disp: ["none", "block"],
    name: ["🎵🎛️ - ON", "🎵🎛️ - OFF"],
    log: ["🎵🎛️ Audio controls are now visible.", "🚫 Audio controls are now hidden."]
  },
  tt: {
    _: [] as HTMLSpanElement[],
    name: ["Show Audio Controls (Alt+S)", "Hide Audio Controls (Alt+H)"]
  },
  // Operational playback buttons configuration map
  playback: {
    _: [] as HTMLButtonElement[], // <-- Storage array added to cleanly reference buttons later
    ids: ["audBtn_prev", "audBtn_playPause", "audBtn_next"],
    labels: ["⏮️ Prev", "⏸️ Pause", "⏭️ Next"],
    tooltips: ["Previous Track", "Play / Pause Soundtrack", "Next Track"]
  }
};

const zelda_audctrls = {
  btn_name: ["Show Audio Controls", "Hide Audio Controls"],
  playback_labels: ["Previous", "Pause", "Next"],
};

for (let i = 0; i < audctrls.btn.name.length; i++) {
  const button = document.createElement("button");
  button.id = audctrls.btn.id[i];
  button.style.display = audctrls.btn.disp[i ^ 1];
  
  button.className = "tooltip";

  if (globalState.theme === "zelda") {
    button.innerHTML = zelda_audctrls.btn_name[i];
  } else if (globalState.theme === "original") {
    button.innerHTML = audctrls.btn.name[i];
  } else {
    throw new TypeError(`Unknown theme state: ${globalState.theme}`);
  }
  audctrls.btn._.push(button);

  const tooltip = document.createElement("span");
  tooltip.className = "tooltiptext";
  tooltip.innerHTML = audctrls.tt.name[i];
  audctrls.tt._.push(tooltip);

  button.appendChild(tooltip);
  if (audctrls._) audctrls._.appendChild(button);
}

if (audctrls._) {
  // Set initial display state matching the "hidden" state on first load
  const initialPlaybackDisp = "none"; 

  audctrls.playback.ids.forEach((id, idx) => {
    const btn = document.createElement("button");
    btn.id = id;
    btn.style.display = initialPlaybackDisp; // Sync default visibility state
    
    btn.className = "tooltip";

    if (globalState.theme === "zelda") {
      btn.innerHTML = zelda_audctrls.playback_labels[idx];
    } else if (globalState.theme === "original") {
      btn.innerHTML = audctrls.playback.labels[idx];
    } else {
      throw new TypeError(`Unknown theme state: ${globalState.theme}`);
    }
    
    // Add custom tooltips 
    const tip = document.createElement("span");
    tip.className = "tooltiptext";
    tip.innerHTML = audctrls.playback.tooltips[idx];
    btn.appendChild(tip);
    
    // Store reference and append
    audctrls.playback._.push(btn);
    audctrls._.appendChild(btn);
  });
}

function togglePlayPause(playPauseBtn: HTMLButtonElement): void {
  const activeEl = app.music.elems[app.music.currentIndex];
  if (!activeEl) return;

  if (activeEl.paused) {
    activeEl.play();
    playPauseBtn.childNodes[0].textContent = "⏸️ Pause";
  } else {
    activeEl.pause();
    playPauseBtn.childNodes[0].textContent = "▶️ Play";
  }
}

// Hook up event behaviors safely after components render
document.getElementById("audBtn_prev")!.onclick = (e) => {
  e.preventDefault();
  triggerPreviousTrack();
};

document.getElementById("audBtn_next")!.onclick = (e) => {
  e.preventDefault();
  triggerNextTrack();
};

const playPauseBtn = document.getElementById("audBtn_playPause") as HTMLButtonElement;
playPauseBtn.onclick = (e) => {
  e.preventDefault();
  togglePlayPause(playPauseBtn);
};

// Original display visibility toggles
function showControls(): void {
  audctrls.btn._[0].style.display = "none";
  audctrls.btn._[1].style.display = "block";
  
  // Show all playback buttons
  audctrls.playback._.forEach(btn => btn.style.display = "inline-block");

  const activeEl = app.music.elems[app.music.currentIndex];
  if (activeEl) activeEl.style.display = "block";
}

function hideControls(): void {
  audctrls.btn._[0].style.display = "block";
  audctrls.btn._[1].style.display = "none";
  
  // Hide all playback buttons
  audctrls.playback._.forEach(btn => btn.style.display = "none");

  app.music.elems.forEach((el: HTMLAudioElement) => el.style.display = "none");
}

audctrls.btn._[0].onclick = () => showControls();
audctrls.btn._[1].onclick = () => hideControls();