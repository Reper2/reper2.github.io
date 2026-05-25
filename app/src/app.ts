import { Background, Database, Grass, Music } from "../lib/db-typings";
import { fetchDB } from "./core";

// Global tracking variable to know how the current track was generated
let playMode: "sequential" | "random" = "sequential";
let isBooting = true;

const app = {
  form: <HTMLFormElement>document.getElementById("optForm"),
  lbl: {
    _: <HTMLLabelElement[]>[],
    name: ["select song:", "or type the name:", "select box background:"]
  },
  sel: {
    _: <HTMLSelectElement[]>[],
    title: ["select a soundtrack from the dropdown then click SET", "select grass (box background) then click SET"]
  },
  placehld: {
    _: <HTMLOptionElement[]>[],
    name: ["-- select soundtrack --", "-- select grass --"]
  },
  br: <HTMLBRElement[]>[],
  inp: {
    _: <HTMLInputElement[]>[],
    type: ["text", "submit", "reset", "button"],
    val: ["", "Set", "Reset", "Random"],
    id: ["", "optSet", "optReset", "optRand"],
    placehld: ["enter song name", "", "", ""],
    onclick: [
      (e: MouseEvent): void => {
        e.preventDefault();
        playMode = "sequential";
        submit();
        updateUrl();
      },
      (e: MouseEvent): void => {
        e.preventDefault();
        playMode = "sequential";
        submit();
        updateUrl();
      },
      (): void => {
        sessionStorage.clear();
        updateUrl();
      },
      (): void => {
        playMode = "random";
        pickRandomTrack();
        sessionStorage.setItem("grass", app.grass.db.src[Math.floor(Math.random() * app.grass.db.src.length)]);
        updateUrl();
      }
    ]
  },

  mus: <Music.Config>{
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
          // Absolute fallback if Deck A isn't parsed yet
          document.body.appendChild(deckB);
        }
      }

      return [deckA, deckB];
    },
    currentIdx: 0,
    sav: {
      ss: sessionStorage.getItem("music"),
      param: new URL(window.location.href).searchParams.get("music")
    },
    db: await fetchDB("music"),
    opt: []
  },

  grass: <Grass.Config>{
    elem: <HTMLDivElement>document.getElementById("grassBox"),
    sav: {
      ss: sessionStorage.getItem("grass"),
      param: new URL(window.location.href).searchParams.get("grass")
    },
db: await fetchDB("grass"),
  opt: <HTMLOptionElement[]>[]
  },

bg: <Background.Config>{
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
}
};

/**
 * Configures base properties for both audio structures globally
 */
app.mus.elems.forEach((el: HTMLAudioElement) => {
  el.controls = true;
  el.style.display = "none";
  el.preload = "auto";
});

/**
 * Returns a fully mapped asset URL string for a track name
 */
function getTrackUrl(sav: string): string | null {
  for (let i = 0; i < app.mus.db[0].contents.length; i++) {
    const album = app.mus.db[0].contents[i];
    for (let j = 0; j < album.contents.length; j++) {
      if (album.contents[j].name.replace(/\.[^/.]+$/, "") === sav) {
        return "../../assets/music/" + album.name + "/" + album.contents[j].name;
      }
    }
  }
  return null;
}

let isCrossfading = false;

function playWithCrossfade(targetTrackName: string): void {
  if (isBooting || isCrossfading) {
    return;
  }

  const currentEl = app.mus.elems[app.mus.currentIdx];
  const nextIdx: 0 | 1 = app.mus.currentIdx === 0 ? 1 : 0;
  const nextEl = app.mus.elems[nextIdx];
  
  const trackUrl = getTrackUrl(targetTrackName);
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

  const fadeInterval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;

    nextEl.volume = Math.min(Math.sin(progress * (Math.PI / 2)), 1);
    
    if (currentEl && !currentEl.paused) {
      currentEl.volume = Math.max(Math.cos(progress * (Math.PI / 2)), 0);
    }

    if (currentStep >= steps) {
      clearInterval(fadeInterval);

      if (currentEl) {
        currentEl.pause();
        currentEl.controls = false;
        currentEl.style.display = "none"; 
      }

      nextEl.volume = 1;
      app.mus.currentIdx = nextIdx;
      
      isCrossfading = false;
      console.log(`✨ 10s Logarithmic Cross-fade complete. Active track: ${targetTrackName}`);
    }
  }, INTERVAL_STEP);
}

function setupAudioListeners(el: HTMLAudioElement): void {
  // Early trigger: start crossfading when 4 seconds remain
  el.ontimeupdate = () => {
    if (el.duration && !isCrossfading) {
      const crystalTimeRemaining = el.duration - el.currentTime;
      if (crystalTimeRemaining <= 10) {
        // Trigger the next selection mechanism early!
        if (playMode === "random") {
          pickRandomTrack();
        } else {
          pickNextTrack();
        }
        updateUrl();
      }
    }
  };

  // Safe backup: if a track is short or skipped ahead past the window
  el.onended = () => {
    if (!isCrossfading) {
      if (playMode === "random") {
        pickRandomTrack();
      } else {
        pickNextTrack();
      }
      updateUrl();
    }
  };
}

function pickRandomTrack(): void {
  const musicPicker = new RandomPicker(app.mus.db[0].contents.map(album => album.name));
  musicPicker.pick(
    k => app.mus.db[0].contents.find(album => album.name === k)!.contents,
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

  for (let i = 0; i < app.mus.db[0].contents.length; i++) {
    const album = app.mus.db[0].contents[i];
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
    // Fires the standard crossfader for track alterations
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
  const inputValue = app.inp._[0].value || app.sel._[0].value;
  const currentSaved = sessionStorage.getItem("music");

  if (inputValue === currentSaved && inputValue !== "") {
    pickNextTrack();
  } else {
    sessionStorage.setItem("music", inputValue);
  }
  sessionStorage.setItem("grass", app.sel._[1].value);
}

// Element compilation operations
for (let i = 0; i < 4; i++)
  app.br.push(document.createElement("br"));
for (let i = 0; i < app.lbl.name.length; i++) {
  app.lbl._.push(document.createElement("label"));
  app.lbl._[i].innerHTML = app.lbl.name[i];
}
for (let i = 0; i < app.sel.title.length; i++) {
  app.sel._.push(document.createElement("select"));
  app.sel._[i].title = app.sel.title[i];
}
for (let i = 0; i < app.placehld.name.length; i++) {
  app.placehld._.push(document.createElement("option"));
  [app.placehld._[i].value, app.placehld._[i].innerHTML] = ["", app.placehld.name[i]];
}
for (let i = 0; i < app.inp.type.length; i++) {
  app.inp._.push(document.createElement("input"));
  const input = app.inp._[i];

  [input.type, input.value, input.id, input.placeholder] =
    [app.inp.type[i], app.inp.val[i], app.inp.id[i], app.inp.placehld[i]];

  input.onclick = (e: MouseEvent) => {
    if (app.inp.onclick[i]) {
      app.inp.onclick[i](e);
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

/**
 * Creates option elements and sets their properties.
 */
function pushGrassOpts(obj: HTMLOptionElement[], data: Grass.Config["db"]): void {
  for (let i = 0; i < data.src.length; i++) {
    const option = document.createElement("option");
    option.value = data.src[i];
    option.innerHTML = data.name[i];
    obj.push(option);
  }
}

app.lbl._[0].htmlFor = app.sel._[0].name = app.lbl._[1].htmlFor = app.inp._[0].name = "music";
app.lbl._[2].htmlFor = app.sel._[1].name = "grass";

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
  for (let i = 0; i < app.sel._.length; i++) {
    app.sel._[i].appendChild(app.placehld._[i]);
  }

  const parent = app.mus.db[0];

  for (let i = 0; i < parent.contents.length; i++) {
    const album = parent.contents[i];
    pushOptGroups(app.mus._, [album.name]);
    app.mus.opt[i] = [];

    for (let j = 0; j < album.contents.length; j++) {
      const file = album.contents[j];
      const option = document.createElement("option");
      option.value = file.name.replace(/\.[^/.]+$/, "");
      option.textContent = file.name.replace(/\.[^/.]+$/, "");
      app.mus.opt[i].push(option);
    }
  }

  pushGrassOpts(app.grass.opt, app.grass.db);

  for (let i = 0; i < app.mus._.length; i++) {
    const optgroup = app.mus._[i];
    for (const option of app.mus.opt[i]) {
      optgroup.appendChild(option);
    }
    app.sel._[0].appendChild(optgroup);
  }
  app.form.appendChild(app.lbl._[0]);
  app.form.appendChild(app.sel._[0]);
  app.form.appendChild(app.br[0]);
  app.form.appendChild(app.lbl._[1]);
  app.form.appendChild(app.inp._[0]);
  app.form.appendChild(app.br[1]);

  app.sel._[1].appendChild(app.placehld._[1]);
  for (let i = 0; i < app.grass.db.src.length; i++) {
    app.sel._[1].appendChild(app.grass.opt[i]);
  }
  app.form.appendChild(app.lbl._[2]);
  app.form.appendChild(app.sel._[1]);
  app.form.appendChild(app.br[2]);

  for (let i = 1; i < app.inp.type.length; i++) app.form.appendChild(app.inp._[i]);

  if (app.grass.sav.ss != null) {
    app.grass.elem.style.backgroundImage = "url('/images/grass/" + app.grass.sav.ss + ".png')";
  } else if (app.grass.sav.param != null) {
    app.grass.elem.style.backgroundImage = "url('/images/grass/" + app.grass.sav.param + ".png')";
  } else app.grass.elem.style.backgroundImage = "url('/images/grass/" + app.grass.db.src[0] + ".png')";

  // Boot track initialization logic
  let initialTrack = app.mus.sav.ss || app.mus.sav.param;
  if (initialTrack) {
    sessionStorage.setItem("music", initialTrack);
  } else {
    pickRandomTrack();
  }

  const bootTrack = sessionStorage.getItem("music");
  if (bootTrack) {
    const url = new URL(window.location.href);
    url.searchParams.set("music", bootTrack);
    
    const deckA = app.mus.elems[0];
    const trackUrl = getTrackUrl(bootTrack);
    
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
        .then(() => {
          isBooting = false;
        })
        .catch(e => {
          console.warn("Audio play blocked by browser policy:", e);
          isBooting = false; 
        });
    }
    
    window.history.pushState({}, '', url);
    console.log("🚀 Initial Boot Deck Sync Complete:", url.search);
  }

  // ─── BACKGROUND LAYERS SETUP (FLASH-RESISTANT) ──────────────────────────────────
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