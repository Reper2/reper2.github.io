import { Background, Database, Grass, Music } from "../lib/db-typings";
import { fetchDB } from "./core";
// import { fetchAudioFromZip } from "./zip-extractor"; // Import our clean utility
import { applyThemeElements } from "./themes";

// Initialize global state container if missing, checking cache first before defaulting to Zelda
const cachedTheme = sessionStorage.getItem("site-theme") || "zelda";
(window as any).globalState = (window as any).globalState || { theme: cachedTheme };

// Global tracking variable to know how the current track was generated
let playMode: "sequential" | "random" = "sequential";
let isBooting = true;
let isCrossfading = false;
let fadeIntervalId: number | null = null; // Track crossfade timer globally to clear rapid skips

// Centralized, Memory-Safe Sound Engine
const sfx = {
  cookingNormal: new Audio("/assets/zelda-theme/cooking_success.mp3"),
  cookingCritical: new Audio("/assets/zelda-theme/cooking_critical.mp3"),
  cookingDubious: new Audio("/assets/zelda-theme/cooking_failed.mp3"),

  playRandomCooking() {
    // Break out immediately if the user is running the 'original' theme
    if ((window as any).globalState?.theme !== "zelda") return;

    const roll = Math.random();
    let selectedAudio: HTMLAudioElement;

    if (roll < 0.15) {
      selectedAudio = this.cookingCritical;
      console.log("🎲 SFX: Critical Success Fanfare!");
    } else if (roll < 0.30) {
      selectedAudio = this.cookingDubious;
      console.log("🎲 SFX: Dubious Food Failure Thud!");
    } else {
      selectedAudio = this.cookingNormal;
      console.log("🎲 SFX: Standard Cooking Success!");
    }

    selectedAudio.currentTime = 0;
    selectedAudio.volume = 0.5;
    selectedAudio.play().catch(e => console.warn("SFX playback interrupted:", e));
  }
};

sfx.playRandomCooking = sfx.playRandomCooking.bind(sfx);

const app = {
  form: document.getElementById("optForm") as HTMLFormElement,
  label: {
    _: [] as HTMLLabelElement[],
    name: ["select song:", "or type the name:", "select box background:"]
  },
  selector: {
    _: [] as HTMLSelectElement[],
    title: ["select a soundtrack from the dropdown then click SET", "select grass (box background) then click SET"]
  },
  placeholder: {
    _: [] as HTMLOptionElement[],
    name: ["-- select soundtrack --", "-- select grass --"]
  },
  break: [] as HTMLBRElement[],
  input: {
    _: [] as HTMLInputElement[],
    type: ["text", "submit", "reset", "button", "button"],
    value: ["", "Set", "Reset", "Random", "Toggle Theme"],
    id: ["", "optSet", "optReset", "optRand", "themeToggle"],
    placeholder: ["enter song name", "", "", "", ""],
    onclick: [
      // Index 0: Set via text typing / form submit
      (e: MouseEvent): void => {
        e.preventDefault();
        sfx.playRandomCooking();
        playMode = "sequential";
        submit();
        updateUrl();
      },
      // Index 1: Set via clicking the explicit option buttons
      (e: MouseEvent): void => {
        e.preventDefault();
        sfx.playRandomCooking();
        playMode = "sequential";
        submit();
        updateUrl();
      },
      (): void => {
        sessionStorage.clear();
        updateUrl();
      },
      // Index 3: Randomization Shuffle Button
      (): void => {
        sfx.playRandomCooking();

        playMode = "random";
        pickRandomTrack();

        const randomGrass = app.grass.db.src[Math.floor(Math.random() * app.grass.db.src.length)];
        sessionStorage.setItem("grass", randomGrass);

        updateUrl();
      },
      // ⭐ INDEX 4: Theme Toggle Interaction Logic
      (): void => {
        const currentTheme = (window as any).globalState.theme;
        // Swap cleanly between original and zelda
        const nextTheme = currentTheme === "zelda" ? "original" : "zelda";

        // 1. Update operational memory container and session cache
        (window as any).globalState.theme = nextTheme;
        sessionStorage.setItem("site-theme", nextTheme);

        // 2. Push attribute state directly to the document architecture for CSS selectors
        document.body.setAttribute("data-theme", nextTheme);

        // 3. Explicitly rerun structural script assets instantly
        applyThemeElements();

        // 4. Fire fallback confirmation audio if they switched back to Zelda
        if (nextTheme === "zelda") {
          sfx.playRandomCooking();
        }

        console.log(`🎨 UI Theme State flipped and re-rendered to: ${nextTheme.toUpperCase()}`);
      }
    ]
  },

  music: {
    _: [],
    get elems(): [HTMLAudioElement, HTMLAudioElement] {
      const deckA = <HTMLAudioElement>document.getElementById("music");
      let deckB = <HTMLAudioElement>document.getElementById("music_deck_b");

      if (!deckB) {
        deckB = document.createElement("audio");
        deckB.id = "music_deck_b";
        deckB.controls = true;
        deckB.style.display = "none";
        deckB.preload = "auto";

        if (deckA) {
          deckA.insertAdjacentElement('afterend', deckB);
          console.log("⚓ Deck B successfully attached as a sibling directly after Deck A");
        } else {
          document.body.appendChild(deckB);
        }
      }

      return [deckA, deckB];
    },
    currentIndex: 0,
    sav: {
      ss: sessionStorage.getItem("music"),
      param: new URL(window.location.href).searchParams.get("music")
    },
    db: await fetchDB("music"),
    opt: []
  } as Music.Config,

  grass: {
    elem: <HTMLDivElement>document.getElementById("grassBox"),
    sav: {
      ss: sessionStorage.getItem("grass"),
      param: new URL(window.location.href).searchParams.get("grass")
    },
    db: await fetchDB("grass"),
    opt: [] as HTMLOptionElement[]
  } as Grass.Config,

  bg: {
    elem: <HTMLBodyElement>document.getElementById("_bg"),
    db: {
      acnh: await fetchDB("bg-acnh"),
      dkb: await fetchDB("bg-dkb"),
      hw_aoi: await fetchDB("bg-hw-aoi"),
      katfl: await fetchDB("bg-katfl"),
      lm3: await fetchDB("bg-lm3"),
      mk8dx: await fetchDB("bg-mk8dx"),
      mkw: await fetchDB("bg-mkw"),
      mps: await fetchDB("bg-mps"),
      miitopia: await fetchDB("bg-miitopia"),
      pm_ttyd: await fetchDB("bg-pm-ttyd"),
      pik4: await fetchDB("bg-pik4"),
      poke_la: await fetchDB("bg-poke-la"),
      poke_sword: await fetchDB("bg-poke-sword"),
      sm3da: await fetchDB("bg-sm3da"),
      sm3dw_bf: await fetchDB("bg-sm3dw_bf"),
      smbw: await fetchDB("bg-smbw"),
      smg2: await fetchDB("bg-smg2"),
      smo: await fetchDB("bg-smo"),
      smp: await fetchDB("bg-smp"),
      ssbu: await fetchDB("bg-ssbu"),
      tlltd: await fetchDB("bg-tlltd"),
      loz_botw: await fetchDB("bg-loz-botw"),
      loz_eow: await fetchDB("bg-loz-eow"),
      loz_ss: await fetchDB("bg-loz-ss"),
      loz_totk: await fetchDB("bg-loz-totk")
    },
    game: ["acnh", "dkb", "hw_aoi", "katfl", "lm3", "mk8dx", "mkw", "mps", "miitopia", "pm_ttyd", "pik4", "poke_la", "poke_sword", "sm3da", "sm3dw_bf", "smbw", "smg2", "smo", "smp", "ssbu", "tlltd", "loz_botw", "loz_eow", "loz_ss", "loz_totk"]
  } as Background.Config
};

/**
 * Configures base properties for both audio structures globally
 */
app.music.elems.forEach((el: HTMLAudioElement) => {
  el.controls = true;
  el.style.display = "none";
  el.preload = "auto";
});

/**
 * Asynchronously locates and extracts the audio file out of the zip binary array.
 */
async function getTrackUrl(sav: string): Promise<string | null> {
  for (let i = 0; i < app.music.db[0].contents.length; i++) {
    const album = app.music.db[0].contents[i];
    
    for (let j = 0; j < album.contents.length; j++) {
      const track = album.contents[j];
      
      // Strip the extension to match against your 'sav' tracking state
      if (track.name.replace(/\.[^/.]+$/, "") === sav) {
        
        // 🌐 Directly build the relative network path to the loose asset file
        const directAssetPath = `./assets/music/${album.name}/${track.name}`;
        
        // Return the raw URL string immediately—no extraction required!
        return directAssetPath;
      }
    }
  }
  return null;
}

/**
 * Force-stops any active crossfade immediately, snapping volumes to their endpoints.
 */
export function cancelCurrentCrossfade(): void {
  if (fadeIntervalId !== null) {
    clearInterval(fadeIntervalId);
    fadeIntervalId = null;
    isCrossfading = false;

    const currentEl = app.music.elems[app.music.currentIndex];
    const nextIdx = app.music.currentIndex === 0 ? 1 : 0;
    const nextEl = app.music.elems[nextIdx];

    if (currentEl) {
      currentEl.pause();
      currentEl.volume = 0;
      currentEl.style.display = "none";
    }
    nextEl.volume = 1;
    app.music.currentIndex = nextIdx;
  }
}

async function playWithCrossfade(targetTrackName: string): Promise<void> {
  if (isBooting) {
    return;
  }

  if (isCrossfading) {
    cancelCurrentCrossfade();
  }

  const currentEl = app.music.elems[app.music.currentIndex];
  const nextIdx: 0 | 1 = app.music.currentIndex === 0 ? 1 : 0;
  const nextEl = app.music.elems[nextIdx];

  const trackUrl = await getTrackUrl(targetTrackName);
  if (!trackUrl) {
    console.error("Invalid soundtrack target:", targetTrackName);
    return;
  }

  isCrossfading = true;

  nextEl.src = trackUrl;
  nextEl.load();
  nextEl.volume = 0;
  nextEl.controls = true;

  const hideButton = document.getElementById("audctrlBtn_hide");
  const isControlsPreferenceOn = hideButton && hideButton.style.display === "block";

  if (isControlsPreferenceOn) {
    nextEl.style.display = "block";
  } else {
    nextEl.style.display = "none";
  }

  if (currentEl) {
    currentEl.ontimeupdate = null;
    currentEl.onended = null;
  }

  setupAudioListeners(nextEl);

  nextEl.play().catch(e => {
    console.warn("Audio play blocked by browser policy:", e);
    isCrossfading = false;
  });

  const CROSSFADE_DURATION = 10000;
  const INTERVAL_STEP = 100;
  const steps = CROSSFADE_DURATION / INTERVAL_STEP;
  let currentStep = 0;

  fadeIntervalId = window.setInterval(() => {
    currentStep++;
    // 🛡️ Clamp progress strictly between 0.0 and 1.0 to prevent negative trigonometric results
    const progress = Math.min(1, Math.max(0, currentStep / steps));

    // Calculate target volumes safely clamped
    const targetNextVolume = Math.sin(progress * (Math.PI / 2));
    nextEl.volume = Math.min(1, Math.max(0, targetNextVolume));

    if (currentEl && !currentEl.paused) {
      const targetCurrentVolume = Math.cos(progress * (Math.PI / 2));
      currentEl.volume = Math.min(1, Math.max(0, targetCurrentVolume));
    }

    // Use greater-than-or-equal to handle any interval step arithmetic overrides cleanly
    if (currentStep >= steps) {
      if (fadeIntervalId !== null) {
        clearInterval(fadeIntervalId);
        fadeIntervalId = null;
      }

      if (currentEl) {
        currentEl.pause();
        currentEl.controls = false;
        currentEl.style.display = "none";
        currentEl.volume = 0; // Reset completely
      }

      nextEl.volume = 1;
      app.music.currentIndex = nextIdx;

      isCrossfading = false;
      console.log(`✨ 10s Logarithmic Cross-fade complete. Active track: ${targetTrackName}`);
    }
  }, INTERVAL_STEP);
}

function setupAudioListeners(el: HTMLAudioElement): void {
  el.ontimeupdate = () => {
    if (el.duration && !isCrossfading) {
      const crystalTimeRemaining = el.duration - el.currentTime;
      if (crystalTimeRemaining <= 10) {
        triggerNextTrack();
      }
    }
  };

  el.onended = () => {
    if (!isCrossfading) {
      triggerNextTrack();
    }
  };
}

export function triggerNextTrack(): void {
  if (playMode === "random") {
    pickRandomTrack();
  } else {
    pickNextTrack();
  }
  updateUrl();
}

export function triggerPreviousTrack(): void {
  if (playMode === "random") {
    pickRandomTrack();
    updateUrl();
    return;
  }

  const currentMusic = sessionStorage.getItem("music");
  if (!currentMusic) return;

  for (let i = 0; i < app.music.db[0].contents.length; i++) {
    const album = app.music.db[0].contents[i];
    for (let j = 0; j < album.contents.length; j++) {
      if (album.contents[j].name.replace(/\.[^/.]+$/, "") === currentMusic) {
        const prevIndex = (j - 1 + album.contents.length) % album.contents.length;
        const prevCleanName = album.contents[prevIndex].name.replace(/\.[^/.]+$/, "");
        sessionStorage.setItem("music", prevCleanName);
        updateUrl();
        return;
      }
    }
  }
}

function pickRandomTrack(): void {
  const musicPicker = new RandomPicker(app.music.db[0].contents.map(album => album.name));
  musicPicker.pick(
    k => app.music.db[0].contents.find(album => album.name === k)!.contents,
    (_k, file: Database.File) => {
      const cleanName = file.name.split(/[?#]/)[0].trim().replace(/\.[^/.]+$/, "");
      sessionStorage.setItem("music", cleanName);
    },
  );
}

function pickNextTrack(): void {
  const currentMusic = sessionStorage.getItem("music");
  if (!currentMusic) {
    pickRandomTrack();
    return;
  }

  for (let i = 0; i < app.music.db[0].contents.length; i++) {
    const album = app.music.db[0].contents[i];
    for (let j = 0; j < album.contents.length; j++) {
      if (album.contents[j].name.replace(/\.[^/.]+$/, "") === currentMusic) {
        const nextIndex = (j + 1) % album.contents.length;
        const nextCleanName = album.contents[nextIndex].name.replace(/\.[^/.]+$/, "");
        sessionStorage.setItem("music", nextCleanName);
        return;
      }
    }
  }
}

function updateUrl(): void {
  const url = new URL(window.location.href);
  const music = sessionStorage.getItem("music");
  const grass = sessionStorage.getItem("grass");

  if (music) {
    url.searchParams.set("music", music);
    playWithCrossfade(music);
  }

  if (grass) {
    url.searchParams.set("grass", grass);
    app.grass.elem.style.backgroundImage = `url('/images/grass/${grass}.png')`;
  }

  window.history.pushState({}, '', url);
  console.log("🚀 Forge Sync Complete:", url.search);
}

function submit() {
  const inputValue = app.input._[0].value || app.selector._[0].value;
  const currentSaved = sessionStorage.getItem("music");

  if (inputValue === currentSaved && inputValue !== "") {
    pickNextTrack();
  } else {
    sessionStorage.setItem("music", inputValue);
  }
  sessionStorage.setItem("grass", app.selector._[1].value);
}

// Element compilation operations
for (let i = 0; i < 4; i++)
  app.break.push(document.createElement("br"));
for (let i = 0; i < app.label.name.length; i++) {
  app.label._.push(document.createElement("label"));
  app.label._[i].innerHTML = app.label.name[i];
}
for (let i = 0; i < app.selector.title.length; i++) {
  app.selector._.push(document.createElement("select"));
  app.selector._[i].title = app.selector.title[i];
}
for (let i = 0; i < app.placeholder.name.length; i++) {
  app.placeholder._.push(document.createElement("option"));
  [app.placeholder._[i].value, app.placeholder._[i].innerHTML] = ["", app.placeholder.name[i]];
}

for (let i = 0; i < app.input.type.length; i++) {
  app.input._.push(document.createElement("input"));
  const input = app.input._[i];

  [input.type, input.value, input.id, input.placeholder] =
    [app.input.type[i], app.input.value[i], app.input.id[i], app.input.placeholder[i]];

  input.onclick = (e: MouseEvent) => {
    const targetCallback = app.input.onclick[i];
    if (targetCallback) {
      targetCallback.call(input, e);
    }
  };
}

function pushOptGroups(elems: HTMLOptGroupElement[], labels: string[]): void {
  for (let i = 0; i < labels.length; i++) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = labels[i];
    elems.push(optgroup);
  }
}

function pushGrassOpts(obj: HTMLOptionElement[], data: Grass.Config["db"]): void {
  for (let i = 0; i < data.src.length; i++) {
    const option = document.createElement("option");
    option.value = data.src[i];
    option.innerHTML = data.name[i];
    obj.push(option);
  }
}

app.label._[0].htmlFor = app.selector._[0].name = app.label._[1].htmlFor = app.input._[0].name = "music";
app.label._[2].htmlFor = app.selector._[1].name = "grass";

type Name = string | number;

class RandomPicker {
  constructor(private names: Name[]) { }

  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomName(): Name {
    return this.randomItem(this.names);
  }

  pick<T>(
    getContents: (name: Name) => T[],
    useFile: (name: Name, file: T) => void,
  ): void {
    const k = this.randomName();
    const contents = getContents(k);
    const file = this.randomItem(contents);
    useFile(k, file);
  }
}

$(function () {
  const savedTheme = sessionStorage.getItem("site-theme") || "zelda";
  (window as any).globalState.theme = savedTheme;
  document.body.setAttribute("data-theme", savedTheme);

  // Initialize structural assets via package entry points
  applyThemeElements();

  for (let i = 0; i < app.selector._.length; i++) {
    app.selector._[i].appendChild(app.placeholder._[i]);
  }

  const parent = app.music.db[0];

  for (let i = 0; i < parent.contents.length; i++) {
    const album = parent.contents[i];
    pushOptGroups(app.music._, [album.name]);
    app.music.opt[i] = [];

    for (let j = 0; j < album.contents.length; j++) {
      const file = album.contents[j];
      const option = document.createElement("option");
      option.value = file.name.replace(/\.[^/.]+$/, "");
      option.textContent = file.name.replace(/\.[^/.]+$/, "");
      app.music.opt[i].push(option);
    }
  }

  pushGrassOpts(app.grass.opt, app.grass.db);

  for (let i = 0; i < app.music._.length; i++) {
    const optgroup = app.music._[i];
    for (const option of app.music.opt[i]) {
      optgroup.appendChild(option);
    }
    app.selector._[0].appendChild(optgroup);
  }
  app.form.appendChild(app.label._[0]);
  app.form.appendChild(app.selector._[0]);
  app.form.appendChild(app.break[0]);
  app.form.appendChild(app.label._[1]);
  app.form.appendChild(app.input._[0]);
  app.form.appendChild(app.break[1]);

  app.selector._[1].appendChild(app.placeholder._[1]);
  for (let i = 0; i < app.grass.db.src.length; i++) {
    app.selector._[1].appendChild(app.grass.opt[i]);
  }
  app.form.appendChild(app.label._[2]);
  app.form.appendChild(app.selector._[1]);
  app.form.appendChild(app.break[2]);

  for (let i = 1; i < app.input.type.length; i++) {
    app.form.appendChild(app.input._[i]);
  }

  if (app.grass.sav.ss != null) {
    app.grass.elem.style.backgroundImage = "url('/images/grass/" + app.grass.sav.ss + ".png')";
  } else if (app.grass.sav.param != null) {
    app.grass.elem.style.backgroundImage = "url('/images/grass/" + app.grass.sav.param + ".png')";
  } else app.grass.elem.style.backgroundImage = "url('/images/grass/" + app.grass.db.src[0] + ".png')";

  let initialTrack = app.music.sav.ss || app.music.sav.param;
  if (initialTrack) {
    sessionStorage.setItem("music", initialTrack);
  } else {
    pickRandomTrack();
  }

  const bootTrack = sessionStorage.getItem("music");
  if (bootTrack) {
    const url = new URL(window.location.href);
    url.searchParams.set("music", bootTrack);

    const deckA = app.music.elems[0];

    getTrackUrl(bootTrack).then((trackUrl) => {
      if (trackUrl) {
        deckA.src = trackUrl;
        deckA.load();
        deckA.volume = 1;
        deckA.controls = true;

        const hideButton = document.getElementById("audctrlBtn_hide");
        if (hideButton && hideButton.style.display === "none") {
          deckA.style.display = "none";
        } else {
          deckA.style.display = "block";
        }

        setupAudioListeners(deckA);

        deckA.play()
          .then(() => { isBooting = false; })
          .catch(e => {
            console.warn("Audio play blocked by browser policy:", e);
            isBooting = false;
          });
      }
    });

    window.history.pushState({}, '', url);
    console.log("🚀 Initial Boot Deck Sync Complete:", url.search);
  }

  let isLayerA = true;
  let isInitialLoad = true;

  function changeBackground(): void {
    const bgPicker = new RandomPicker(app.bg.game);
    bgPicker.pick(
      k => app.bg.db[k][0].contents,
      (k, file: Database.File) => {
        const targetUrl = `https://raw.githubusercontent.com/reper2/switch-album/${k}/${file.name}`;
        const imgCache = new Image();
        imgCache.src = targetUrl;

        imgCache.onload = () => {
          const urlValue = `url('${targetUrl}')`;

          if (isInitialLoad) {
            app.bg.elem.style.setProperty("--bg-before", urlValue);
            isInitialLoad = false;
          } else {
            if (isLayerA) {
              app.bg.elem.style.setProperty("--bg-after", urlValue);
              app.bg.elem.classList.add("bg-flip");
            } else {
              app.bg.elem.style.setProperty("--bg-before", urlValue);
              app.bg.elem.classList.remove("bg-flip");
            }
            isLayerA = !isLayerA;
          }
        };
      },
    );
  }

  changeBackground();
  setInterval(changeBackground, 20000);
});

export default app;