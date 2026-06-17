import { Grass, Music } from "../../lib/db-typings";
import { globalTheme } from "../themes";
import { eggsav, getParsedState } from "../eggs/";
import vault from "../eggs/vault";
import { AppPanel } from "./interfaces";
import { triggerPreviousTrack, triggerNextTrack, togglePlayPause } from "./music";
import { isLocalhost, appState } from "./core";
import SavUtils from "./storage";

// Define hidden private pointers to hold our audio instances
let cookingNormalInstance: HTMLAudioElement | null = null;
let cookingCriticalInstance: HTMLAudioElement | null = null;
let cookingDubiousInstance: HTMLAudioElement | null = null;

export const sfx = {
  playRandomCooking() {
    // 1. STAGE 1 GUARDS: Terminate instantly before any assets are constructed or fetched
    if (!isLocalhost) return;
    if ((window as any).globalState?.theme !== "alt") return;

    // 2. LAZY LOAD: Allocate the audio memory buffers only if we pass the guards above
    if (!cookingNormalInstance) {
      cookingNormalInstance = new Audio("/assets/alt-theme/cooking_success.mp3");
    }
    if (!cookingCriticalInstance) {
      cookingCriticalInstance = new Audio("/assets/alt-theme/cooking_critical.mp3");
    }
    if (!cookingDubiousInstance) {
      cookingDubiousInstance = new Audio("/assets/alt-theme/cooking_failed.mp3");
    }

    // 3. EXECUTE GAMEPLAY ROLL LOGIC
    const roll = Math.random();
    let selectedAudio: HTMLAudioElement;

    if (roll < 0.15) {
      selectedAudio = cookingCriticalInstance;
      console.log("🎲 SFX: Critical Success Fanfare!");
    } else if (roll < 0.30) {
      selectedAudio = cookingDubiousInstance;
      console.log("🎲 SFX: Dubious Food Failure Thud!");
    } else {
      selectedAudio = cookingNormalInstance;
      console.log("🎲 SFX: Standard Cooking Success!");
    }

    // Safe to trigger playback now
    selectedAudio.currentTime = 0;
    selectedAudio.volume = 0.5;
    selectedAudio.play().catch(e => console.warn("SFX playback interrupted:", e));
  }
};
sfx.playRandomCooking = sfx.playRandomCooking.bind(sfx);

export async function updateUrl(
  musicObj: Music.Config,
  grassObj: Grass.Config,
  state: typeof appState
): Promise<void> {
  const { musicTrackState, grassTheme: grassThemeState } = await import("../app");

  const activeTrack = musicTrackState.active;
  const activeGrass = grassThemeState.active;
  const url = new URL(window.location.href);

  if (activeTrack) {
    url.searchParams.set("music", activeTrack);
    const { playWithCrossfade } = await import("./music");
    await playWithCrossfade(activeTrack, musicObj, grassObj, state);
  } else {
    url.searchParams.delete("music");
  }

  if (activeGrass) {
    url.searchParams.set("grass", activeGrass);
    grassObj.elem.style.backgroundImage = `url('/images/grass/${activeGrass}.png')`;
  } else {
    url.searchParams.delete("grass");
  }

  window.history.pushState({}, '', url.toString());
  console.log("🛠️ Forge Sync Complete:", url.search);
}

/**
 * 🏛️ THE BASE BLUEPRINT (Abstract Base Class)
 */
export abstract class BasePanel implements AppPanel {
  readonly elementId: string;
  public isOpen: boolean = false;
  protected container: HTMLElement;

  constructor(elementId: string) {
    this.elementId = elementId;
    const foundContainer = document.getElementById(elementId);
    if (!foundContainer) {
      throw new Error(`DOM Element with ID "${elementId}" could not be located.`);
    }
    this.container = foundContainer;
  }

  public abstract render(): void;
  public abstract toggleVisibility(forceState?: boolean): void;

  public show(): void {
    this.isOpen = true;
    this.toggleVisibility(true);
  }

  public hide(): void {
    this.isOpen = false;
    this.toggleVisibility(false);
  }
}

export class AudioControlPanel extends BasePanel {
  private config: any;
  private toggleBtns: HTMLButtonElement[] = [];
  private playbackBtns: HTMLButtonElement[] = [];
  private obj: { music: Music.Config, grass: Grass.Config };

  constructor(elementId: string, config: any, obj: { music: Music.Config, grass: Grass.Config }) {
    super(elementId);
    this.config = config;
    this.obj = obj;
    this.render();
  }

  public render(): void {
    this.container.innerHTML = "";
    this.toggleBtns = [];
    this.playbackBtns = [];

    const isAlt = globalTheme.ls === "alt";
    const stateIdx = Number(this.isOpen);

    const switchLabels = [
      isAlt ? this.config.alt.btn_name[0] : this.config.btn.name[0],
      isAlt ? this.config.alt.btn_name[1] : this.config.btn.name[1]
    ];

    for (let i = 0; i < 2; i++) {
      const btn = document.createElement("button");
      btn.id = this.config.btn.id[i];
      btn.className = "tooltip";
      btn.innerHTML = switchLabels[i];
      btn.style.display = this.config.btn.disp[i ^ stateIdx];

      const tip = document.createElement("span");
      tip.className = "tooltiptext";
      tip.innerHTML = this.config.tt.name[i];

      btn.appendChild(tip);
      this.toggleBtns.push(btn);
      this.container.appendChild(btn);
    }

    const playbackData = [
      { id: "audBtn_prev", label: isAlt ? "Previous" : "⏮️ Prev", tip: "Previous Track", action: () => triggerPreviousTrack(this.obj.music, this.obj.grass, appState) },
      { id: "audBtn_playPause", label: isAlt ? "Pause" : "⏸️ Pause", tip: "Play / Pause Soundtrack", action: (btn: HTMLButtonElement) => togglePlayPause(this.obj.music, btn) },
      { id: "audBtn_next", label: isAlt ? "Next" : "⏭️ Next", tip: "Next Track", action: () => triggerNextTrack(this.obj.music, this.obj.grass, appState) }
    ];

    playbackData.forEach(item => {
      const btn = document.createElement("button");
      btn.id = item.id;
      btn.className = "tooltip";
      btn.innerHTML = item.label;
      btn.style.display = this.isOpen ? "inline-flex" : "none";

      const tip = document.createElement("span");
      tip.className = "tooltiptext";
      tip.innerHTML = item.tip;
      btn.appendChild(tip);

      btn.onclick = (e) => {
        e.preventDefault();
        item.action(btn);
      };

      this.playbackBtns.push(btn);
      this.container.appendChild(btn);
    });

    this.toggleBtns[0].onclick = () => this.show();
    this.toggleBtns[1].onclick = () => this.hide();
  }

  public toggleVisibility(forceState?: boolean): void {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    const stateIdx = Number(this.isOpen);

    this.toggleBtns.forEach((btn, i) => {
      if (btn) btn.style.display = this.config.btn.disp[i ^ stateIdx];
    });

    this.playbackBtns.forEach(btn => {
      if (btn) btn.style.display = this.isOpen ? "inline-flex" : "none";
    });

    if (this.isOpen) {
      const activeEl = this.obj.music.elems[this.obj.music.currentIndex];
      if (activeEl) activeEl.style.display = "block";
    } else {
      this.obj.music.elems.forEach((el: HTMLAudioElement) => el.style.display = "none");
    }
  }
}

export class EggCookbookPanel extends BasePanel implements AppPanel {
  private config: any;

  constructor(elementId: string, config: any) {
    super(elementId);
    this.config = config;
    this.render();
  }

  render(): void {
    if (!this.container) return;

    this.container.innerHTML = "";
    this.config.toggle._ = [];

    const isAlt = globalTheme.ls === "alt";

    for (let i = 0; i < this.config.toggle.labels.length; i++) {
      const toggleBtn = document.createElement("button");
      toggleBtn.id = this.config.toggle.id[i];
      toggleBtn.className = "tooltip cookbook-toggle-btn";
      toggleBtn.style.display = this.config.toggle.disp[i];
      toggleBtn.innerHTML = isAlt ? this.config.toggle.altLabels[i] : this.config.toggle.labels[i];

      const tooltip = document.createElement("span");
      tooltip.className = "tooltiptext";
      tooltip.innerHTML = this.config.toggle.tooltips[i];

      toggleBtn.appendChild(tooltip);
      this.config.toggle._.push(toggleBtn);
      this.container.appendChild(toggleBtn);

      toggleBtn.onclick = (e) => {
        e.preventDefault();
        this.toggleVisibility();
      };
    }

    const actionTray = document.createElement("div");
    actionTray.className = "menu-actions-tray";
    actionTray.style.display = "none";
    this.container.appendChild(actionTray);

    const actions = [
      {
        label: isAlt ? "Save Ledger" : "💾 Save",
        tip: "Save your active profile progress",
        click: () => {
          try {
            const rawData = eggsav.ls;
            const dataObj = rawData ? JSON.parse(rawData) : {};
            vault.save(dataObj);
          } catch (e) {
            console.error("Failed to parse ledger content payload details:", e);
            vault.save({});
          }
        }
      },
      {
        label: isAlt ? "Import Ledger" : "📥 Import",
        tip: "Restore a profile backup file (.eggfvs)",
        click: () => this.triggerFileImport()
      },
      {
        label: isAlt ? "Export Ledger" : "📤 Export",
        tip: "Download a secured backup file",
        click: () => {
          try {
            const rawData = eggsav.ls;
            const dataObj = rawData ? JSON.parse(rawData) : {};
            vault.exportToFile(dataObj);
          } catch (e) {
            console.error("Failed to map ledger data object profile parameters:", e);
            vault.exportToFile({});
          }
        }
      },
      {
        label: isAlt ? "Reset Ledger" : "🥚🗑️ Reset",
        tip: "Reset All Eggs (Ctrl+Z)",
        click: () => {
          const confirmMsg = isAlt ? "Are you sure you want to wipe the ledger?" : "Reset all progress?";
          if (confirm(confirmMsg)) {
            const legacyJar = new SavUtils("eggs");
            const safeJar = new SavUtils("fvs_egghunt_secure");
            legacyJar.clear();
            safeJar.clear();
            location.reload();
          }
        }
      }
    ];

    actions.forEach(act => {
      const btn = document.createElement("button");
      btn.className = "tooltip cookbook-btn";
      btn.innerHTML = act.label;
      btn.onclick = (e) => {
        e.preventDefault();
        act.click();
      };

      const tip = document.createElement("span");
      tip.className = "tooltiptext";
      tip.innerHTML = act.tip;

      btn.appendChild(tip);
      actionTray.appendChild(btn);
    });
  }

  public toggleVisibility(forceState?: boolean): void {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;

    const showBtn = this.config.toggle._[0];
    const hideBtn = this.config.toggle._[1];
    const actionTray = this.container?.querySelector(".menu-actions-tray") as HTMLDivElement;

    if (this.isOpen) {
      if (showBtn) showBtn.style.display = "none";
      if (hideBtn) hideBtn.style.display = "inline-flex";
      if (actionTray) actionTray.style.display = "flex";
    } else {
      if (showBtn) showBtn.style.display = "inline-flex";
      if (hideBtn) hideBtn.style.display = "none";
      if (actionTray) actionTray.style.display = "none";
    }
  }

  private triggerFileImport(): void {
    const uploader = document.createElement("input");
    uploader.type = "file";
    uploader.accept = ".eggfvs";

    uploader.onchange = async () => {
      const file = uploader.files?.[0];
      if (!file) return;
      const isAlt = globalTheme.ls === "alt";

      try {
        const buffer = await file.arrayBuffer();
        const binaryData = new Uint8Array(buffer);

        const activeState = getParsedState();
        const parsedState = vault.importFromFile(binaryData, activeState);

        if (parsedState) {
          vault.save(parsedState);
          alert(isAlt ? "📜 Ledger authenticated and restored successfully!" : "Save imported successfully!");
          location.reload();
        } else {
          alert("🚨 Failed to parse file verification signatures.");
        }
      } catch (err) {
        console.error("Import workflow crash:", err);
      }
    };

    uploader.click();
  }
}