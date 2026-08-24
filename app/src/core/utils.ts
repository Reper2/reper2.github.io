/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

import { Grass, Music } from "../../lib/db-typings";
import { globalTheme } from "../themes";
import { eggsav, getParsedState } from "../eggs/";
import vault from "../eggs/vault";
import { AppPanel, MarioKartStems } from "./interfaces";
import * as musicPlayer from "./music";
import { isLocalhost, appState } from "./core";
import { StemDatabaseLoader } from "./fetch";
import SavUtils from "./storage";

// Define hidden private pointers to hold our audio instances
let cookingNormalInstance: HTMLAudioElement | null = null;
let cookingCriticalInstance: HTMLAudioElement | null = null;
let cookingDubiousInstance: HTMLAudioElement | null = null;

export const sfx = {
  playRandomCooking() {
    if (!isLocalhost) return;

    const dynamicThemeCheck = globalTheme.ls || globalTheme.sp || "alt";
    if (dynamicThemeCheck !== "alt") return;

    if (!cookingNormalInstance) {
      cookingNormalInstance = new Audio("/assets/alt-theme/cooking_success.mp3");
    }
    if (!cookingCriticalInstance) {
      cookingCriticalInstance = new Audio("/assets/alt-theme/cooking_critical.mp3");
    }
    if (!cookingDubiousInstance) {
      cookingDubiousInstance = new Audio("/assets/alt-theme/cooking_failed.mp3");
    }

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
    await playTrackWithEngine(activeTrack, musicObj, grassObj, state);
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
 * THE BASE BLUEPRINT
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

    this.toggleVisibility(this.isOpen);
  }

  public render(): void {
    this.container.innerHTML = "";
    this.toggleBtns = [];
    this.playbackBtns = [];

    const isAlt = (globalTheme.ls || globalTheme.sp) === "alt";
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
      { id: "audBtn_prev", label: isAlt ? "Previous" : "⏮️ Prev", tip: "Previous Track", action: () => musicPlayer.triggerPreviousTrack(this.obj.music, this.obj.grass, appState) },
      { id: "audBtn_playPause", label: isAlt ? "Pause" : "⏸️ Pause", tip: "Play / Pause Soundtrack", action: (btn: HTMLButtonElement) => musicPlayer.togglePlayPause(this.obj.music, btn) },
      { id: "audBtn_next", label: isAlt ? "Next" : "⏭️ Next", tip: "Next Track", action: () => musicPlayer.triggerNextTrack(this.obj.music, this.obj.grass, appState) }
    ];

    playbackData.forEach(item => {
      const btn = document.createElement("button");
      btn.id = item.id;
      btn.className = "tooltip";
      btn.innerHTML = item.label;
      btn.style.display = this.isOpen ? "flex" : "none";

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
      if (btn) btn.style.display = this.isOpen ? "flex" : "none";
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

    const isAlt = (globalTheme.ls || globalTheme.sp) === "alt";

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
      if (hideBtn) hideBtn.style.display = "block";
      if (actionTray) actionTray.style.display = "flex";
    } else {
      if (showBtn) showBtn.style.display = "block";
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
      const isAlt = (globalTheme.ls || globalTheme.sp) === "alt";

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

/**
 * ABSTRACT FOUNDATION PIPELINE
 */
export abstract class BasePlaybackEngine {
  protected musicObj: Music.Config;
  protected grassObj: Grass.Config;
  protected state: typeof appState;

  protected crossfadeTriggered = false;
  protected userIsSeeking = false;

  constructor(music: Music.Config, grass: Grass.Config, globalState: typeof appState) {
    this.musicObj = music;
    this.grassObj = grass;
    this.state = globalState;
  }

  public abstract start(): Promise<void>;
  protected abstract evaluateTimeline(activeDeck: HTMLAudioElement): void;

  protected bindScrubProtection(audioElement: HTMLAudioElement) {
    audioElement.onseeking = () => { this.userIsSeeking = true; };
    audioElement.onseeked = () => {
      this.userIsSeeking = false;
      this.crossfadeTriggered = false;
    };
  }

  protected attachLifecycleListeners(activeDeck: HTMLAudioElement): void {
    activeDeck.ontimeupdate = () => {
      this.evaluateTimeline(activeDeck);
    };

    activeDeck.onended = () => {
      if (!this.crossfadeTriggered && !this.state.isCrossfading) {
        this.crossfadeTriggered = true;
        activeDeck.ontimeupdate = null;
        activeDeck.onended = null;
        musicPlayer.triggerNextTrack(this.musicObj, this.grassObj, this.state);
      }
    };
  }
}

export class StandardTrackPlaybackEngine extends BasePlaybackEngine {
  private targetTrackCompound: string;
  private cleanAssetUrl: string;

  constructor(targetTrackCompound: string, cleanAssetUrl: string, musicObj: Music.Config, grassObj: Grass.Config, state: typeof appState) {
    super(musicObj, grassObj, state);
    this.targetTrackCompound = targetTrackCompound;
    this.cleanAssetUrl = cleanAssetUrl;
  }

  public async start(): Promise<void> {
    console.log(`🎚️ Standard Engine routing track: ${this.targetTrackCompound}`);

    const currentIdx = this.musicObj.currentIndex;
    const currentDeck = this.musicObj.elems[currentIdx];

    const isInitialBoot = !currentDeck || currentDeck.src === "" || currentDeck.src === window.location.href;

    const targetIdx: 0 | 1 = isInitialBoot ? currentIdx : (currentIdx === 0 ? 1 : 0);
    const targetDeck = this.musicObj.elems[targetIdx];

    if (targetDeck) {
      const targetFullUrl = window.location.origin + this.cleanAssetUrl;
      if (targetDeck.src !== targetFullUrl) {
        targetDeck.src = this.cleanAssetUrl;
        targetDeck.load();
      }

      // 🧼 Clear any residual flags before playing
      this.crossfadeTriggered = false;
      this.bindScrubProtection(targetDeck);
      this.attachLifecycleListeners(targetDeck);

      if (isInitialBoot) {
        targetDeck.volume = 1;
        targetDeck.style.display = "block";
        targetDeck.controls = true;
        await targetDeck.play().catch(e => console.warn("Initial boot autoplay deferred:", e));
      } else {
        // Normal ongoing track skip crossfade execution routing
        await musicPlayer.playWithCrossfade(this.targetTrackCompound, this.musicObj, this.grassObj, this.state);
      }
    }

    this.state.isBooting = false;
  }

  protected evaluateTimeline(activeDeck: HTMLAudioElement): void {
    // CRITICAL SAFEGUARD: Don't trigger crossfades if seeking, already fading, or if the song just started!
    if (this.crossfadeTriggered || this.state.isCrossfading || this.userIsSeeking || activeDeck.currentTime < 5) return;

    const timeRemaining = activeDeck.duration - activeDeck.currentTime;
    if (activeDeck.duration && timeRemaining <= 10) {
      this.crossfadeTriggered = true;
      activeDeck.ontimeupdate = null;
      musicPlayer.triggerNextTrack(this.musicObj, this.grassObj, this.state);
    }
  }
}

export class StemPlaybackEngine extends BasePlaybackEngine {
  private targetTrackCompound: string;
  private stems: MarioKartStems;
  private currentPlayingStemType: "prelude" | "sections" | "base" = "base";
  private currentSectionIndex = 0;

  constructor(targetTrackCompound: string, stems: MarioKartStems, musicObj: Music.Config, grassObj: Grass.Config, state: typeof appState) {
    super(musicObj, grassObj, state);
    this.targetTrackCompound = targetTrackCompound;
    this.stems = stems;
  }

  public async start(): Promise<void> {
    console.log(`🎛️ Stem Engine preparing multi-track routing: ${this.targetTrackCompound}`);

    const currentIdx = this.musicObj.currentIndex;
    const currentDeck = this.musicObj.elems[currentIdx];
    const isInitialBoot = !currentDeck || currentDeck.src === "" || currentDeck.src === window.location.href;

    const targetIdx: 0 | 1 = isInitialBoot ? currentIdx : (currentIdx === 0 ? 1 : 0);
    const targetDeck = this.musicObj.elems[targetIdx];

    if (targetDeck) {
      // Determine our entry segment
      let initialSource = this.stems.base;
      if (this.stems.prelude) {
        initialSource = this.stems.prelude;
        this.currentPlayingStemType = "prelude";
        console.log(`🎬 [STEM ENGINE] Initializing sequence with Prelude: ${initialSource}`);
      } else if (this.stems.sections && this.stems.sections.length > 0) {
        initialSource = this.stems.sections[0];
        this.currentPlayingStemType = "sections";
        this.currentSectionIndex = 0;
        console.log(`🎬 [STEM ENGINE] No Prelude found. Starting straight with Section 1: ${initialSource}`);
      } else {
        this.currentPlayingStemType = "base";
        console.log(`🎬 [STEM ENGINE] Standard flat loop backup assigned: ${initialSource}`);
      }

      const targetFullUrl = window.location.origin + initialSource;
      if (targetDeck.src !== targetFullUrl) {
        targetDeck.src = initialSource;
        targetDeck.load();
      }

      this.crossfadeTriggered = false;
      this.bindScrubProtection(targetDeck);
      
      // Wire up local listeners
      this.attachStemLifecycleListeners(targetDeck);

      if (isInitialBoot) {
        targetDeck.volume = 1;
        targetDeck.style.display = "block";
        targetDeck.controls = true;
        await targetDeck.play().catch(e => console.warn("Autoplay deferred:", e));
      } else {
        await musicPlayer.playWithCrossfade(this.targetTrackCompound, this.musicObj, this.grassObj, this.state, initialSource);
      }
    }

    this.state.isBooting = false;
  }

  private attachStemLifecycleListeners(activeDeck: HTMLAudioElement): void {
    activeDeck.ontimeupdate = () => {
      this.evaluateTimeline(activeDeck);
    };

    activeDeck.onended = async () => {
      console.log(`🔁 [STEM ENGINE] Component track block ended. Processing segment transition from: ${this.currentPlayingStemType}`);

      // Case A: Prelude Finished -> Move to Sections, Medley, or Base Loop
      if (this.currentPlayingStemType === "prelude") {
        if (this.stems.sections && this.stems.sections.length > 0) {
          this.currentPlayingStemType = "sections";
          this.currentSectionIndex = 0;
          activeDeck.src = this.stems.sections[0];
        } else if (this.stems.medley) {
          this.currentPlayingStemType = "medley" as any;
          activeDeck.src = this.stems.medley;
        } else {
          this.currentPlayingStemType = "base";
          activeDeck.src = this.stems.base;
        }

        console.log(`➡️ [STEM ENGINE] Prelude complete. Transitioning to main loop: ${activeDeck.src}`);
        this.rebootAndPlayDeck(activeDeck);
        return;
      }

      // Case B: Sequential Section Complete -> Advance index or divert to Medley
      if (this.currentPlayingStemType === "sections" && this.stems.sections) {
        this.currentSectionIndex++;
        if (this.currentSectionIndex < this.stems.sections.length) {
          activeDeck.src = this.stems.sections[this.currentSectionIndex];
          console.log(`➡️ [STEM ENGINE] Sequencing into next section segment [${this.currentSectionIndex + 1}/${this.stems.sections.length}]: ${activeDeck.src}`);
          this.rebootAndPlayDeck(activeDeck);
          return;
        } else if (this.stems.medley) {
          this.currentPlayingStemType = "medley" as any;
          activeDeck.src = this.stems.medley;
          console.log(`🔀 [STEM ENGINE] Sections completed. Diverting to Medley segment: ${activeDeck.src}`);
          this.rebootAndPlayDeck(activeDeck);
          return;
        }
      }

      // Case C: Sequence fully exhausted (including Medley / Base) -> Advance global tracks
      if (!this.crossfadeTriggered && !this.state.isCrossfading) {
        this.crossfadeTriggered = true;
        activeDeck.ontimeupdate = null;
        activeDeck.onended = null;
        console.log(`🏁 [STEM ENGINE] Entire multi-stem structure fully completed. Fading out to next global playlist song.`);
        musicPlayer.triggerNextTrack(this.musicObj, this.grassObj, this.state);
      }
    };
  }

  private rebootAndPlayDeck(deck: HTMLAudioElement) {
    deck.load();
    deck.volume = 1;
    // Rebind local state rules to guard against dynamic DOM recycling drops
    this.attachStemLifecycleListeners(deck);
    deck.play().catch(e => console.error("Stem chain play exception:", e));
  }

  protected evaluateTimeline(activeDeck: HTMLAudioElement): void {
    if (this.crossfadeTriggered || this.state.isCrossfading || this.userIsSeeking || activeDeck.currentTime < 5) return;

    // The track is on its final structural segment if it's playing the 'base' track, 
    // or if a medley track exists and is currently active, or if it is on the last section with no medley available.
    const isOnFinalSegment = 
      this.currentPlayingStemType === "base" ||
      this.currentPlayingStemType === ("medley" as any) ||
      (this.currentPlayingStemType === "sections" && this.stems.sections && this.currentSectionIndex === this.stems.sections.length - 1 && !this.stems.medley);

    if (!isOnFinalSegment) return;

    const timeRemaining = activeDeck.duration - activeDeck.currentTime;
    if (activeDeck.duration && timeRemaining <= 10) {
      this.crossfadeTriggered = true;
      activeDeck.ontimeupdate = null;
      console.log("⏱️ [STEM ENGINE] Final track timeline bounds breached. Triggering crossfade sequence layout transition.");
      musicPlayer.triggerNextTrack(this.musicObj, this.grassObj, this.state);
    }
  }
}

let activeEngineInstance: any = null;

export async function playTrackWithEngine(
  trackCompound: string,
  musicObj: Music.Config,
  grassObj: Grass.Config,
  state: typeof appState
): Promise<void> {
  if (!trackCompound || !trackCompound.includes(":")) return;

  // 1. Purely split the compound by the colon
  const splitIdx = trackCompound.indexOf(":");
  const categoryName = trackCompound.substring(0, splitIdx).trim();
  const rawTrackName = trackCompound.substring(splitIdx + 1).trim();

  // Save the raw, exact compound back to storage so it matches the db on next reload
  new SavUtils("music").ss = trackCompound;

  let targetCategoryDir = categoryName;
  let finalTrackFilename = rawTrackName;
  let matchedAlbum: any = null;

  // 2. Resolve true folder casing and locate the exact file entry from the DB tree
  if (musicObj.db && musicObj.db[0] && musicObj.db[0].contents) {
    matchedAlbum = musicObj.db[0].contents.find((album: any) =>
      album.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
    );

    if (matchedAlbum) {
      targetCategoryDir = matchedAlbum.name;

      const foundFile = matchedAlbum.contents.find((item: any) => {
        if (item.type !== "file") return false;

        const dbNameLower = item.name.toLowerCase().trim();
        const searchNameLower = rawTrackName.toLowerCase().trim();

        // Guarantee exact filename match, or check exact match with an appended extension fallback
        return dbNameLower === searchNameLower ||
          dbNameLower === `${searchNameLower}.mp3` ||
          dbNameLower.replace(/\.mp3$/i, '') === searchNameLower;
      });

      if (foundFile) {
        finalTrackFilename = foundFile.name;
      }
    }
  }

  const cleanTrackBase = finalTrackFilename.replace(/\.mp3$/i, "");
  const targetUrlForStems = `/assets/music/${targetCategoryDir}/${cleanTrackBase}.mp3`;

  // DEDUPLICATION SAFEGUARD: Find which deck we are targetting
  const currentIdx = musicObj.currentIndex;
  const currentDeck = musicObj.elems[currentIdx];
  const isInitialBoot = !currentDeck || currentDeck.src === "" || currentDeck.src === window.location.href;

  const targetIdx: 0 | 1 = isInitialBoot ? currentIdx : (currentIdx === 0 ? 1 : 0);
  const targetDeck = musicObj.elems[targetIdx];

  // If the target deck is already loading or playing this exact asset file path, BAIL OUT!
  if (targetDeck && targetDeck.src.endsWith(encodeURI(targetUrlForStems))) {
    console.log(`🛡️ [ENGINE ROUTER] Blocked double-load/eviction for: ${cleanTrackBase}`);
    return;
  }

  console.log("==================================================");
  console.log(`🎵 [ENGINE ROUTER] Booting Track: ${cleanTrackBase} [Category: ${targetCategoryDir}]`);
  console.log(`🔗 [ENGINE ROUTER] Resolved Asset URL: ${targetUrlForStems}`);

  const hasTrackNumberPrefix = /^\d+[\.-]\d+\b|^\d+\.\s*/.test(cleanTrackBase);

  if (isLocalhost && matchedAlbum && !hasTrackNumberPrefix) {
    try {
      const stemsFolderName = `.stems_${cleanTrackBase}`;
      const hiddenDir = `${targetCategoryDir}/${stemsFolderName}`;

      const folderAlreadyExists = matchedAlbum.contents.some(
        (item: any) => item.name === stemsFolderName && item.type === "directory"
      );

      if (!folderAlreadyExists) {
        console.log(`📡 [STEM RUNTIME] Probing target layout structure via network: /app/databases/music/${hiddenDir}.json`);

        const stemsLoader = new StemDatabaseLoader(targetCategoryDir, encodeURIComponent(stemsFolderName));
        const discoveredContents = await stemsLoader.loadRegistry();

        if (discoveredContents && discoveredContents.length > 0) {
          // Payload flattening safeguard: If the root is a directory container, unpack its children
          let flatFiles = discoveredContents;
          if (discoveredContents[0] && discoveredContents[0].type === "directory" && Array.isArray(discoveredContents[0].contents)) {
            console.log(`🧼 [STEM RUNTIME] Unwrapping layout structural wrapper block cleanly.`);
            flatFiles = discoveredContents[0].contents;
          }

          matchedAlbum.contents.push({
            type: "directory",
            name: stemsFolderName,
            contents: flatFiles // Now strictly flat array entries containing type: "file"
          } as any);
          console.log(`🚀 [STEM RUNTIME] Injected "${stemsFolderName}" layer directly into memory tree parameters. Elements count:`, flatFiles.length);
        }
      }
    } catch (err) {
      console.error("🚨 [STEM RUNTIME] Core critical asset mapping crash encountered:", err);
    }
  }
  
  const stems = musicPlayer.resolveTrackStems(targetUrlForStems, musicObj.db, {
    category: targetCategoryDir,
    exactFileName: finalTrackFilename
  });
  console.log(`📋 [STEM ENGINE MATCH] Evaluating properties parsed by resolveTrackStems():`, stems);

  const sav = new SavUtils("music").ss ?? "";

  if (
    stems.prelude &&
    stems.base &&
    ((stems.sections && stems.sections.length > 0) || stems.submix || stems.medley)
  ) {
    activeEngineInstance = new StemPlaybackEngine(sav, stems, musicObj, grassObj, state);
    await activeEngineInstance.start();
  } else {
    activeEngineInstance = new StandardTrackPlaybackEngine(sav, targetUrlForStems, musicObj, grassObj, state);
    await activeEngineInstance.start();
  }
}