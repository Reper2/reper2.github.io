/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

import { Background, Grass, Music } from "../lib/db-typings";
import { Workbox } from "https://cdn.jsdelivr.net/npm/workbox-window@6.5.4/+esm";
import * as utils from "./core/";
import { initMusicProxy } from "./core/music"; // Adjust path if necessary depending on folder tree
import SavUtils from "./core/storage";
import { applyThemeElements } from "./themes";

// 1. Unified SavUtils Storage Layers
const themeSav = new SavUtils("site-theme");
const musicSav = new SavUtils("music");
const grassSav = new SavUtils("grass");

// Instantiating isolated loaders
const bgLoader = new utils.BackgroundDatabaseLoader();
const musicLoader = utils.isLocalhost ? new utils.MusicDatabaseLoader() : null;
const grassLoader = new utils.GrassDatabaseLoader();

// Fetch and resolve all async registries up front before constructing the 'app' tree
const compiledBackgrounds = await bgLoader.loadWithMetadata();
const compiledMusicDB = await musicLoader?.loadRegistry();
const compiledGrassDB = await grassLoader.loadRegistry();

const bgSav = {
  cat: new SavUtils("bg_cat"),
  game: new SavUtils("bg_game")
};

async function initialiseAppEngine() {
  // 1. Instantly trigger the fresh abstract data loader to fetch the live deployment date
  const versionLoader = new utils.VersionLoader();
  const liveBuildData = await versionLoader.loadRegistry();

  // Render the server-side timestamp value onto the screen interface
  const deploySlot = document.getElementById("deploy-time");
  if (deploySlot && liveBuildData.timestamp) {
    // 💡 Convert the UTC string to a local JavaScript Date object
    const localDate = new Date(liveBuildData.timestamp);

    // Format nicely based on the user's browser location settings
    deploySlot.textContent = localDate.toLocaleString();
  }

  // 2. Initialise Workbox Window lifecycle tracking
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('sw.js', { type: 'module' });

    // Whenever a new worker successfully claims and takes active control, reload immediately.
    wb.addEventListener('controlling', () => {
      console.log("✅ App Engine: Service Worker has taken control of the page. Reloading...");
      window.location.reload();
    });

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log("🚀 App Engine: Service Worker activated for the first time!");
      }
    });

    // This listener triggers if Workbox realises files on the network differ from local caches
    wb.addEventListener('waiting', () => {
      const banner = document.getElementById("update-banner");
      const refreshBtn = document.getElementById("refresh-btn");

      if (banner) banner.style.display = "block";

      if (refreshBtn) {
        // Use { once: true } so we don't accidentally stack up click event listeners
        refreshBtn.addEventListener('click', () => {
          console.log("📥 Update button clicked. Sending skipWaiting payload...");

          // Tell the dormant, waiting service worker to skip waiting and activate.
          // The global 'controlling' listener above will catch this and handle the reload!
          wb.messageSkipWaiting()
          console.log("✅ Update completed. Reloading...");
          window.location.reload();
        }, { once: true });
      }
    });

    // Fire the background registration cycle
    wb.register();
  }
}

await initialiseAppEngine();

// GUARDRAIL OVERRIDES: Check the DOM context up-front before building selections
const forcedCategoryAttr = document.body.getAttribute("data-bg-force");
const isForcedBgPage = forcedCategoryAttr === "games" || forcedCategoryAttr === "holidays";

export const bgSelectionState = {
  get category(): string {
    if (isForcedBgPage) return forcedCategoryAttr!;
    return bgSav.cat.ss ?? bgSav.cat.sp ?? "games"; // defaults to games
  },
  set category(val: string) {
    if (isForcedBgPage) return; // Prevent state writing if page forces a layout
    bgSav.cat.ss = bgSav.cat.sp = val;
  },
  get specificGame(): string | null {
    if (isForcedBgPage) return null;
    return bgSav.game.ss ?? bgSav.game.sp ?? null;
  },
  set specificGame(val: string | null) {
    if (isForcedBgPage) return; // Prevent state writing if page forces a layout
    bgSav.game.ss = bgSav.game.sp = val ?? "";
  }
};

const bgElem = document.getElementById("_bg");
if (!(bgElem instanceof HTMLBodyElement)) {
  throw new Error("[App Initialisation] Target background container element '#_bg' was not found or is not a valid HTMLBodyElement.");
}

// 2. High-Level Abstract State Managers with Automated Side-Effects
export const themeState = {
  get active(): "original" | "alt" {
    return ((themeSav.ls || themeSav.sp) as "original" | "alt") || "alt";
  },
  set active(nextTheme: "original" | "alt") {
    themeSav.ls = themeSav.sp = nextTheme;
    (window as any).globalState = { theme: nextTheme };

    document.body.setAttribute("data-theme", nextTheme);

    const themeLink = document.getElementById("theme-link") as HTMLLinkElement | null;
    if (themeLink) {
      themeLink.disabled = (nextTheme === "original");
    }

    applyThemeElements();
  }
};

export const grassTheme = {
  get active(): string {
    return grassSav.ss || grassSav.sp || grassSav.ls || compiledGrassDB.src[0];
  },
  set active(themeName: string | null) {
    if (!themeName) {
      grassSav.clear();
      return;
    }
    grassSav.ss = themeName;
    grassSav.sp = themeName;

    if (app?.grass?.elem) {
      app.grass.elem.style.backgroundImage = `url('/images/grass/${themeName}.png')`;
    }
  }
};

export const musicTrackState = {
  get active(): string | null {
    return musicSav.ss || musicSav.sp || musicSav.ls;
  },
  set active(trackName: string | null) {
    if (!trackName) {
      musicSav.clear();
      return;
    }
    musicSav.ss = trackName;
    musicSav.sp = trackName;
  }
};

export const app = {
  form: document.getElementById("optForm") as HTMLFormElement | null,
  label: {
    _: [] as HTMLLabelElement[],
    name: [
      "select song:",
      "or type the name:",
      "select box background:",
      "select page background category:",
      "then select specific game:"
    ]
  },
  selector: {
    _: [] as HTMLSelectElement[],
    title: [
      "select a soundtrack from the dropdown then click SET",
      "select grass (box background) then click SET",
      "choose between games or holiday albums",
      "choose a specific game album"
    ]
  },
  placeholder: {
    _: [] as HTMLOptionElement[],
    name: [
      "-- select soundtrack --",
      "-- select grass --",
      "---",
      "-- all games --"
    ]
  },
  break: [] as HTMLBRElement[],
  input: {
    _: [] as HTMLInputElement[],
    type: ["text", "submit", "reset", "button", "button"],
    value: ["", "Set", "Reset", "Random", "Toggle Theme"],
    id: ["", "optSet", "optReset", "optRand", "themeToggle"],
    placeholder: ["enter song name", "", "", "", ""],
    onclick: [
      (e: MouseEvent): void => {
        e.preventDefault();
        utils.sfx.playRandomCooking();
        utils.appState.playMode = "sequential";
        utils.submit(app.music, app.input._, app.selector._);
        utils.updateUrl(app.music, app.grass, utils.appState);
      },
      (e: MouseEvent): void => {
        e.preventDefault();
        utils.sfx.playRandomCooking();
        utils.appState.playMode = "sequential";
        utils.submit(app.music, app.input._, app.selector._);
        utils.updateUrl(app.music, app.grass, utils.appState);
      },
      (): void => {
        musicTrackState.active = null;
        grassTheme.active = null;
        utils.updateUrl(app.music, app.grass, utils.appState);
      },
      (): void => {
        utils.sfx.playRandomCooking();
        utils.appState.playMode = "random";
        utils.pickRandomTrack(app.music);

        grassTheme.active = app.grass.db.src[Math.floor(Math.random() * app.grass.db.src.length)];
        utils.updateUrl(app.music, app.grass, utils.appState);
      },
      (): void => {
        const nextTheme = themeState.active === "alt" ? "original" : "alt";
        themeState.active = nextTheme;

        if (nextTheme === "alt") {
          utils.sfx.playRandomCooking();
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
    sav: musicSav,
    db: compiledMusicDB,
    opt: []
  } as Music.Config,

  grass: {
    elem: <HTMLDivElement>document.getElementById("grassBox"),
    sav: grassSav,
    db: compiledGrassDB,
    opt: [] as HTMLOptionElement[]
  } as Grass.Config,

  bg: {
    elem: bgElem,
    db: compiledBackgrounds.db,
    game: compiledBackgrounds.game,
    get category() { return bgSelectionState.category; },
    get specificGame() { return bgSelectionState.specificGame; }
  } as Background.Config
};

// Global Memory Allocations
for (let i = 0; i < 6; i++) app.break.push(document.createElement("br"));
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

app.placeholder._[1].value = "summer1";

for (let i = 0; i < app.input.type.length; i++) {
  app.input._.push(document.createElement("input"));
  const input = app.input._[i];
  [input.type, input.value, input.id, input.placeholder] =
    [app.input.type[i], app.input.value[i], app.input.id[i], app.input.placeholder[i]];

  input.onclick = (e: MouseEvent) => {
    const targetCallback = app.input.onclick[i];
    if (targetCallback) targetCallback.call(input, e);
  };
}

app.label._[0].htmlFor = app.selector._[0].name = app.label._[1].htmlFor = app.input._[0].name = "music";
app.label._[2].htmlFor = app.selector._[1].name = "grass";

$(function () {
  themeState.active = themeState.active;

  // FORM ENGINE DEEP SAFEGUARD
  if (!app.form) {
    console.log("ℹ️ Configuration form ('#optForm') unallocated on this view page matrix. Sub-injection bypassed.");
  } else {
    initMusicProxy(app.music.elems, {
      get currentIdx() { return app.music.currentIndex as 0 | 1; }
    });

    // Initialise audio elements safely if they map inside the layout
    app.music.elems.forEach((el: HTMLAudioElement | null) => {
      if (el) {
        el.controls = true;
        el.style.display = "none";
        el.preload = "auto";
      }
    });

    if (utils.isLocalhost) {
      for (let i = 0; i < app.selector._.length; i++) {
        app.selector._[i].appendChild(app.placeholder._[i]);
      }

      const parent = app.music.db[0];
      for (let i = 0; i < parent.contents.length; i++) {
        const album = parent.contents[i];
        utils.pushOptGroups(app.music._, [album.name]);
        app.music.opt[i] = [];

        for (let j = 0; j < album.contents.length; j++) {
          const file = album.contents[j];
          const option = document.createElement("option");
          option.value = file.name.replace(/\.[^/.]+$/, "");
          option.textContent = file.name.replace(/\.[^/.]+$/, "");
          app.music.opt[i].push(option);
        }
      }
    } else {
      app.selector._[1].appendChild(app.placeholder._[1]);
    }

    utils.pushGrassOpts(app.grass.opt, app.grass.db);

    if (utils.isLocalhost) {
      for (let i = 0; i < app.music._.length; i++) {
        const optgroup = app.music._[i];
        for (const option of app.music.opt[i]) {
          optgroup.appendChild(option);
        }
        app.selector._[0].appendChild(optgroup);
      }
    }

    if (utils.isLocalhost) {
      app.form.appendChild(app.label._[0]);
      app.form.appendChild(app.selector._[0]);
      app.form.appendChild(app.break[0]);
      app.form.appendChild(app.label._[1]);
      app.form.appendChild(app.input._[0]);
      app.form.appendChild(app.break[1]);
    }

    for (let i = 0; i < app.grass.db.src.length; i++) {
      app.selector._[1].appendChild(app.grass.opt[i]);
    }
    app.form.appendChild(app.label._[2]);
    app.form.appendChild(app.selector._[1]);
    app.form.appendChild(app.break[2]);

    const categorySelect = app.selector._[2];
    const optGames = document.createElement("option");
    optGames.value = "games";
    optGames.textContent = "Games";
    const optHolidays = document.createElement("option");
    optHolidays.value = "holidays";
    optHolidays.textContent = "Holidays";
    categorySelect.appendChild(optGames);
    categorySelect.appendChild(optHolidays);
    categorySelect.value = bgSelectionState.category;

    // Build specific game selector options
    const gameSelect = app.selector._[3];
    gameSelect.appendChild(app.placeholder._[3]); // -- all games --
    app.bg.game.forEach((game: string | number) => {
      if (typeof game === "string") {
        const opt = document.createElement("option");
        opt.value = game;
        opt.textContent = game;
        gameSelect.appendChild(opt);
      } else if (typeof game === "number") {
        console.error("An array element contains an element of numerical value where it should not:", game);
      }
    });
    gameSelect.value = bgSelectionState.specificGame || "";

    // Toggle specific game dropdown visibility depending on category choice
    function updateBgSelVis() {
      if (categorySelect.value === "games") {
        gameSelect.style.display = "inline-block";
        app.label._[4].style.display = "inline-block";
      } else {
        gameSelect.style.display = "none";
        app.label._[4].style.display = "none";
      }
    }
    categorySelect.addEventListener("change", updateBgSelVis);
    updateBgSelVis();

    app.form.appendChild(app.break[2]); // Break after grass

    // UI GUARDRAIL: Lock or completely skip rendering selectors if the page enforces a context
    if (isForcedBgPage) {
      categorySelect.disabled = true;
      categorySelect.style.opacity = "0.5";
      gameSelect.disabled = true;

      // Hide them completely so users cannot alter the path
      categorySelect.style.display = "none";
      gameSelect.style.display = "none";
      app.label._[3].style.display = "none";
      app.label._[4].style.display = "none";
    } else {
      // Standard layout rendering
      app.form.appendChild(app.label._[3]);
      app.form.appendChild(categorySelect);
      app.form.appendChild(app.break[3]);
      app.form.appendChild(app.label._[4]);
      app.form.appendChild(gameSelect);
      app.form.appendChild(app.break[4]);
    }

    app.form.appendChild(app.break[5]);

    for (let i = 1; i < app.input.type.length; i++) {
      app.form.appendChild(app.input._[i]);
    }
  }

  // Fallback independent side-effects (Still runs smoothly even without the options box present)
  if (app.grass.elem) {
    app.grass.elem.style.backgroundImage = `url('/images/grass/${grassTheme.active}.png')`;
  }

  if (utils.isLocalhost) {
    const initialTrackCompound = musicSav.ss || musicSav.sp;

    if (initialTrackCompound) {
      // Passes "album: track" directly into the configuration block state context
      musicTrackState.active = initialTrackCompound;
    } else {
      if (app.music) {
        utils.pickRandomTrack(app.music);
      }
    }

    const verifiedTrack = musicTrackState.active;

    if (verifiedTrack && app.music?.elems?.[0]) {
      // Let the centralised service handle initial booting, probing, and class matching
      utils.playTrackWithEngine(verifiedTrack, app.music, app.grass, utils.appState);
      console.log("🚀 Initial Boot Deck Sync Complete:", verifiedTrack);
    } else {
      console.log("ℹ️ Audio layer unallocated or bypassed for this project scope.");
      utils.appState.isBooting = false;
    }
  }

  utils.changeBackground(app.bg);
  setInterval(() => { utils.changeBackground(app.bg); }, 20000);
});

export default app;