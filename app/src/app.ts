import { Background, Grass, Music } from "../lib/db-typings";
import {
  changeBackground, // bg
  pushGrassOpts, pushOptGroups, // form
  getTrackUrl, setupAudioListeners, pickRandomTrack, // music
  fetchDB, sfx, submit, updateUrl, // utils
} from "./core/";
// import { fetchAudioFromZip } from "./zip-extractor"; // Import our clean utility
import { applyThemeElements } from "./themes";

// Initialise global state container if missing, checking cache first before defaulting to Zelda
const cachedTheme = localStorage.getItem("site-theme") || "zelda";
(window as any).globalState = (window as any).globalState || { theme: cachedTheme };

// Global tracking variable to know how the current track was generated
export let playMode: "sequential" | "random" = "sequential";
export let isBooting = true;
export let isCrossfading = false;
export let fadeIntervalId: number | null = null; // Track crossfade timer globally to clear rapid skips

export const app = {
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
        submit(app.music, app.input._, app.selector._);
        updateUrl(app.music, app.grass, playMode, fadeIntervalId, isCrossfading, isBooting);
      },
      // Index 1: Set via clicking the explicit option buttons
      (e: MouseEvent): void => {
        e.preventDefault();
        sfx.playRandomCooking();
        playMode = "sequential";
        submit(app.music, app.input._, app.selector._);
        updateUrl(app.music, app.grass, playMode, fadeIntervalId, isCrossfading, isBooting);
      },
      (): void => {
        sessionStorage.clear();
        updateUrl(app.music, app.grass, playMode, fadeIntervalId, isCrossfading, isBooting);
      },
      // Index 3: Randomization Shuffle Button
      (): void => {
        sfx.playRandomCooking();

        playMode = "random";
        pickRandomTrack(app.music);

        const randomGrass = app.grass.db.src[Math.floor(Math.random() * app.grass.db.src.length)];
        sessionStorage.setItem("grass", randomGrass);

        updateUrl(app.music, app.grass, playMode, fadeIntervalId, isCrossfading, isBooting);
      },
      // ⭐ INDEX 4: Theme Toggle Interaction Logic
      (): void => {
        const currentTheme = (window as any).globalState.theme;
        // Swap cleanly between original and zelda
        const nextTheme = currentTheme === "zelda" ? "original" : "zelda";

        // 1. Update operational memory container and session cache
        (window as any).globalState.theme = nextTheme;
        localStorage.setItem("site-theme", nextTheme);

        // 2. Push attribute state directly to the document architecture for CSS selectors
        document.body.setAttribute("data-theme", nextTheme);

        // 3. Disable or enable the theme stylesheet link depending on the active state
        const themeLink = document.getElementById("theme-link") as HTMLLinkElement | null;
        if (themeLink) {
          themeLink.disabled = (nextTheme === "original");
        }

        // 4. Explicitly rerun structural script assets instantly
        applyThemeElements();

        // 5. Fire fallback confirmation audio if they switched back to Zelda
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

app.label._[0].htmlFor = app.selector._[0].name = app.label._[1].htmlFor = app.input._[0].name = "music";
app.label._[2].htmlFor = app.selector._[1].name = "grass";

$(function () {
  const savedTheme = localStorage.getItem("site-theme") || "zelda";
  (window as any).globalState.theme = savedTheme;
  document.body.setAttribute("data-theme", savedTheme);

  const themeLink = document.getElementById("theme-link") as HTMLLinkElement | null;
  if (themeLink) {
    themeLink.disabled = (savedTheme === "original");
  }

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
    pickRandomTrack(app.music);
  }

  const bootTrack = sessionStorage.getItem("music");
  if (bootTrack) {
    const url = new URL(window.location.href);
    url.searchParams.set("music", bootTrack);

    const deckA = app.music.elems[0];

    getTrackUrl(app.music, bootTrack).then((trackUrl) => {
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

        setupAudioListeners(deckA, app.music, app.grass, playMode, fadeIntervalId, isCrossfading, isBooting);

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

  changeBackground(app.bg);
  setInterval(() => {
    changeBackground(app.bg);
  }, 20000);
});

export default app;