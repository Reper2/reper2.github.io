import { eggs } from "./eggs";
import {
  copyLink, isLocalhost,
  togglePlayPause, showAudioControls, hideAudioControls,
  triggerNextTrack, triggerPreviousTrack
} from "./core/";
import { globalState } from "./themes";
import BeforeInstallPromptEvent from "../lib/install-typings";
import app, { fadeIntervalId, isBooting, isCrossfading, playMode } from "./app";

onload = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      console.groupCollapsed("Service Worker Status");
      if (reg.installing) {
        console.log("service worker installing...");
      } if (reg.waiting) {
        console.log("service worker installed");
      } if (reg.active) {
        console.log("service worker active");
      }
      console.log("Service Worker registration successful with scope:", reg.scope);
      console.groupEnd();
    }).catch((err) => console.error("Service Worker registration failed:", err));
  }
};

const btns = {
  // Back button for subpages, most useful while using the web app.
  back: {
    _: document.getElementById("back") as HTMLDivElement,
    btn: document.createElement("img")
  },
  audctrls: {
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
    },
    zelda: {
      btn_name: ["Show Audio Controls", "Hide Audio Controls"],
      playback_labels: ["Previous", "Pause", "Next"],
    }
  },
  resetEggs: {
    _: document.getElementById("resetEggs") as HTMLDivElement,
    btn: document.createElement("button"),
    tt: document.createElement("span")
  },
  copy: {
    _: document.getElementById("copy") as HTMLDivElement,
    btn: document.createElement("button"),
    tt: document.createElement("span")
  },
  sw: {
    _: document.getElementById("install") as HTMLDivElement,
    btn: document.createElement("button"),
    tt: document.createElement("span")
  },
  footer: {
    _: document.getElementById("footer"),
    cr: {
      license: document.createElement("a"),
      txt: document.createElement("h3")
    }
  }
}

if (btns.back._) {
  btns.back._.onclick = () => {
    if (window.history.length > 1 && document.referrer.startsWith(window.location.origin)) {
      if (window.location.href.includes("#") || window.location.href.includes("?")) {
        console.log("⚙️url contained a hash (#) or parameter (?), window.location.href='../' was used rather than window.history.back() to skip all the hashes or url parameters.");
        window.location.href = "../";
      }
      else window.history.back();
    }
    else window.location.href = "../../";
  };

  [btns.back.btn.src, btns.back.btn.title] = ["/images/back.png", "Back (Alt+◁)"];
  btns.back._.appendChild(btns.back.btn);
}

if (btns.audctrls._) {
  for (let i = 0; i < btns.audctrls.btn.name.length; i++) {
    const button = document.createElement("button");
    button.id = btns.audctrls.btn.id[i];
    button.style.display = btns.audctrls.btn.disp[i ^ 1];

    button.className = "tooltip";

    if (globalState.theme === "zelda") {
      button.innerHTML = btns.audctrls.zelda.btn_name[i];
    } else if (globalState.theme === "original") {
      button.innerHTML = btns.audctrls.btn.name[i];
    } else {
      throw new TypeError(`Unknown theme state: ${globalState.theme}`);
    }
    btns.audctrls.btn._.push(button);

    const tooltip = document.createElement("span");
    tooltip.className = "tooltiptext";
    tooltip.innerHTML = btns.audctrls.tt.name[i];
    btns.audctrls.tt._.push(tooltip);

    button.appendChild(tooltip);
    btns.audctrls._.appendChild(button);
  }

  // Set initial display state matching the "hidden" state on first load
  const initialPlaybackDisp = "none";

  btns.audctrls.playback.ids.forEach((id, idx) => {
    const btn = document.createElement("button");
    btn.id = id;
    btn.style.display = initialPlaybackDisp; // Sync default visibility state

    btn.className = "tooltip";

    if (globalState.theme === "zelda") {
      btn.innerHTML = btns.audctrls.zelda.playback_labels[idx];
    } else if (globalState.theme === "original") {
      btn.innerHTML = btns.audctrls.playback.labels[idx];
    } else {
      throw new TypeError(`Unknown theme state: ${globalState.theme}`);
    }

    // Add custom tooltips 
    const tip = document.createElement("span");
    tip.className = "tooltiptext";
    tip.innerHTML = btns.audctrls.playback.tooltips[idx];
    btn.appendChild(tip);

    // Store reference and append
    btns.audctrls.playback._.push(btn);
    btns.audctrls._.appendChild(btn);
  });

  document.getElementById("audBtn_prev")!.onclick = (e) => {
    e.preventDefault();
    triggerPreviousTrack(app.music, app.grass, playMode, fadeIntervalId, isCrossfading, isBooting);
  };

  document.getElementById("audBtn_next")!.onclick = (e) => {
    e.preventDefault();
    triggerNextTrack(app.music, app.grass, playMode, fadeIntervalId, isCrossfading, isBooting);
  };

  const playPauseBtn = document.getElementById("audBtn_playPause") as HTMLButtonElement;
  playPauseBtn.onclick = (e) => {
    e.preventDefault();
    togglePlayPause(app.music, playPauseBtn);
  };

  btns.audctrls.btn._[0].onclick = () => showAudioControls(btns.audctrls, app.music);
  btns.audctrls.btn._[1].onclick = () => hideAudioControls(btns.audctrls, app.music);
}

if (btns.resetEggs._) {
  btns.resetEggs._.className = "tooltip";
  if (globalState.theme === "original") {
    btns.resetEggs.btn.innerHTML = "🥚🗑️";
  } else if (globalState.theme === "zelda") {
    btns.resetEggs.btn.innerHTML = "Reset Eggs";
  } else {
    throw new TypeError(`Unknown theme state: ${globalState.theme}`);
  }
  btns.resetEggs.btn.onclick = (): void => {
    eggs.saved = {};
    location.reload();
  };
  [btns.resetEggs.tt.innerHTML, btns.resetEggs.tt.className] = ["Reset All Eggs (Ctrl+Z)", "tooltiptext"];

  btns.resetEggs.btn.appendChild(btns.resetEggs.tt);
  btns.resetEggs._.appendChild(btns.resetEggs.btn);
}

if (btns.copy._) {
  if (globalState.theme === "original") {
    btns.copy.btn.innerHTML = "📋🔗";
  } else if (globalState.theme === "zelda") {
    btns.copy.btn.innerHTML = "Copy Link";
  } else {
    throw new TypeError(`Unknown theme state: ${globalState.theme}`);
  }

  btns.copy._.className = "tooltip";
  btns.copy.btn.onclick = (): void => copyLink(window.location.href);
  [btns.copy.tt.innerHTML, btns.copy.tt.className] = ["Copy Link (Ctrl+C)", "tooltiptext"];

  btns.copy.btn.appendChild(btns.copy.tt);
  btns.copy._.appendChild(btns.copy.btn);
}

if (btns.footer._) {
  btns.footer.cr.license.title = "View License (Alt+L)";
  btns.footer.cr.license.href = "https://github.com/Reper2/reper2.github.io/blob/master/LICENSE";
  btns.footer.cr.license.target = "_blank";
  btns.footer.cr.license.rel = "noopener noreferrer";

  btns.footer.cr.txt.textContent = "(c) 2021-2026 Reper2/Ethan. All rights reserved.";

  btns.footer.cr.license.appendChild(btns.footer.cr.txt);
  btns.footer._.appendChild(btns.footer.cr.license);
}

const reminder = {
  get shown(): string | null {
    return sessionStorage.getItem("install_reminder_shown");
  },
  set shown(value: string) {
    sessionStorage.setItem("install_reminder_shown", value);
  }
};

let installListener: ((e: Event) => void) | null = null; // Declare install listener outside the scope of onload
let appInstalledListener: (() => void) | null = null;

if (btns.sw._) {
  if (!matchMedia("(display-mode: standalone)").matches) {
    document.addEventListener("DOMContentLoaded", () => {
      if (!reminder.shown && !isLocalhost) {
        console.log('Executing app install reminder.');
        // reminds the user they can install the app
        window.alert('Consider installing the app!\nDesktop Browser - click install button in top-right of address bar\nMobile Browser - click "Add to Home Screen" in browser menu');
        reminder.shown = "true";
      }
    });

    let deferredPrompt: BeforeInstallPromptEvent | null;

    installListener = function install(e: Event) { // Assign the listener to the variable for later removal
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
    };

    window.addEventListener("beforeinstallprompt", installListener); // Attach the listener

    btns.sw._.onclick = async () => {
      if (deferredPrompt !== null) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") deferredPrompt = null;
      }
    };

    appInstalledListener = function installed() {
      if (installListener) {
        window.removeEventListener("beforeinstallprompt", installListener); // Remove the listener once it has done its job
      }
      console.log("Thank you for installing the app!");
      console.warn("Reload to remove the install button.");
    };

    btns.sw._.className = "tooltip";
    if (globalState.theme === "original") {
      btns.sw.btn.innerHTML = "🌐📲";
    } else if (globalState.theme === "zelda") {
      btns.sw.btn.innerHTML = "Install App";
    } else {
      throw new TypeError(`Unknown theme state: ${globalState.theme}`);
    }
    [btns.sw.tt.className, btns.sw.tt.innerHTML] = ["tooltiptext", "Install App (Ctrl+I)"];

    btns.sw.btn.appendChild(btns.sw.tt);
    btns.sw._.appendChild(btns.sw.btn);
  }
}

window.onbeforeunload = () => {
  if (installListener) {
    window.removeEventListener("beforeinstallprompt", installListener);
  }
  if (appInstalledListener) {
    window.removeEventListener("appinstalled", appInstalledListener);
  }
};