import { isLocalhost, copyLink } from "./core/core";
import { AudioControlPanel, EggCookbookPanel } from "./core/utils";
import { globalTheme } from "./themes";
import app from "./app";
import BeforeInstallPromptEvent from "../lib/install-typings";
import SavUtils from "./core/storage";

onload = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then((reg) => {
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
  back: {
    _: document.getElementById("back") as HTMLDivElement,
    btn: document.createElement("img")
  },
  audctrls: {
    _: document.getElementById("audctrls") as HTMLDivElement,
    btn: {
      _: [] as HTMLButtonElement[],
      id: ["audctrlBtn_show", "audctrlBtn_hide"],
      disp: ["block", "none"], // 0: Closed (Show visible), 1: Open (Hide visible)
      name: ["🎵🎛️ - ON", "🎵🎛️ - OFF"],
      log: ["🎵🎛️ Audio controls are now visible.", "🚫 Audio controls are now hidden."]
    },
    tt: {
      _: [] as HTMLSpanElement[],
      name: ["Show Audio Controls (Alt+S)", "Hide Audio Controls (Alt+H)"]
    },
    playback: {
      _: [] as HTMLButtonElement[],
      ids: ["audBtn_prev", "audBtn_playPause", "audBtn_next"],
      labels: ["⏮️ Prev", "⏸️ Pause", "⏭️ Next"],
      tooltips: ["Previous Track", "Play / Pause Soundtrack", "Next Track"]
    },
    alt: {
      btn_name: ["Show Audio Controls", "Hide Audio Controls"],
      playback_labels: ["Previous", "Pause", "Next"],
    }
  },
  eggMenu: {
    _: document.getElementById("eggMenu") as HTMLDivElement,
    toggle: {
      _: [] as HTMLButtonElement[],
      id: ["eggctrlBtn_show", "eggctrlBtn_hide"],
      disp: ["block", "none"], // 0: Closed (Show visible), 1: Open (Hide visible)
      labels: ["🥚📂 Open Menu", "🥚🔒 Close Menu"],
      altLabels: ["Show Ledger Options", "Hide Ledger Options"],
      tooltips: ["Show backup and management utilities", "Hide backup and management utilities"]
    }
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
    _: document.getElementById("footer") as HTMLDivElement | null,
    cr: {
      license: document.createElement("a"),
      txt: document.createElement("h3")
    }
  }
};
export default btns;

// Back Button
if (btns.back._) {
  btns.back._.onclick = () => {
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        const currentUrl = new URL(window.location.href);

        // Enforce exact origin constraints to isolate internal application routes
        if (referrerUrl.origin === currentUrl.origin) {
          window.location.href = document.referrer;
          return;
        }
      } catch (e) {
        console.error("Failed to safely parse document referrer parameter context:", e);
      }
    }
    // Strict perimeter fallback to prevent unintended open redirects
    window.location.href = window.location.origin;
  };
  [btns.back.btn.src, btns.back.btn.title] = ["/images/back.png", "Back (Alt+◁)"];
  btns.back._.appendChild(btns.back.btn);
}

if (btns.audctrls._ && isLocalhost) {
  new AudioControlPanel("audctrls", btns.audctrls, app);
}

if (btns.eggMenu._) {
  new EggCookbookPanel("eggMenu", btns.eggMenu);
}

// Copy Button
if (btns.copy._) {
  const dynamicThemeCheck = globalTheme.ls || globalTheme.sp || "alt";
  btns.copy.btn.innerHTML = (dynamicThemeCheck === "alt") ? "Copy Link" : "📋🔗";
  btns.copy._.className = "tooltip";
  btns.copy.btn.onclick = (): void => copyLink(window.location.href);

  [btns.copy.tt.innerHTML, btns.copy.tt.className] = ["Copy Link (Ctrl+C)", "tooltiptext"];
  btns.copy.btn.appendChild(btns.copy.tt);
  btns.copy._.appendChild(btns.copy.btn);
}

// Footer
if (btns.footer._) {
  btns.footer.cr.license.title = "View License (Alt+L)";
  btns.footer.cr.license.href = "https://github.com/Reper2/reper2.github.io/blob/master/LICENSE";
  btns.footer.cr.license.target = "_blank";
  btns.footer.cr.license.rel = "noopener noreferrer";
  btns.footer.cr.txt.textContent = "(c) 2021-2026 Reper2/Ethan. All rights reserved.";

  btns.footer.cr.license.appendChild(btns.footer.cr.txt);
  btns.footer._.appendChild(btns.footer.cr.license);
}

const reminder = new SavUtils("install_reminder_shown");
let installListener: ((e: Event) => void) | null = null; // Declare install listener outside the scope of onload
let appInstalledListener: (() => void) | null = null;

if (btns.sw._) {
  if (!matchMedia("(display-mode: standalone)").matches) {
    document.addEventListener("DOMContentLoaded", () => {
      if (!reminder.ss && !isLocalhost) {
        console.log('Executing app install reminder.');
        // reminds the user they can install the app
        window.alert('Consider installing the app!\nDesktop Browser - click install button in top-right of address bar\nMobile Browser - click "Add to Home Screen" in browser menu');
        reminder.ss = "true";
      }
    });

    let deferredPrompt: BeforeInstallPromptEvent | null;

    function isBeforeInstallPromptEvent(e: Event): e is BeforeInstallPromptEvent {
      return e !== null && typeof e === "object" && "prompt" in e && typeof (e as any).prompt === "function";
    }

    installListener = function install(e: Event) {
      if (isBeforeInstallPromptEvent(e)) {
        e.preventDefault();
        deferredPrompt = e;
      }
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
    
    const activeValue = globalTheme.ls || globalTheme.sp;
    const currentTheme = (activeValue === "original") ? "original" : "alt";

    if (currentTheme === "original") {
      btns.sw.btn.innerHTML = "🌐📲";
    } else {
      btns.sw.btn.innerHTML = "Install App";
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