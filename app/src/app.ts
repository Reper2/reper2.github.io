import { Background, Database, Grass, Music } from "../lib/db-typings";
import { fetchDB } from "./core";

export const app = {
  form: <HTMLFormElement>document.getElementById("optForm"),
  lbl: {
    _: <HTMLLabelElement[]>[],
    name: ["select song:", "or type the name:", "select box background:"]
  },
  sel: {
    _: <HTMLSelectElement[]>[],
    title: ["select a song from the dropdown then click SET", "select grass (box background) then click SET"]
  },
  placehld: {
    _: <HTMLOptionElement[]>[],
    name: ["-- select song --", "-- select grass --"]
  },
  br: <HTMLBRElement[]>[],
  inp: {
    _: <HTMLInputElement[]>[],
    type: ["text", "submit", "reset", "button"],
    val: ["", "Set", "Reset", "Random"],
    id: ["", "optSet", "optReset", "optRand"],
    placehld: ["enter song name", "", "", ""],
    onclick: [
      (): void => submit(),
      (): void => submit(),
      (): void => sessionStorage.clear(), // Reset all saved customisations
      (): void => {
        const musicPicker = new RandomPicker(app.mus.db[0].contents.map(album => album.name));
        musicPicker.pick(
          k => app.mus.db[0].contents.find(album => album.name === k)!.contents,
          (k, file: Database.File) => {
            const cleanName = file.name
              .split(/[?#]/)[0]
              .trim()
              .replace(/\.[^/.]+$/, "");

            sessionStorage.setItem("music", cleanName);
            app.mus.srcElem.src = `/assets/music/${k}/${file.name}`;
            console.log(`🎵Randomly selected track from ${k}:`, cleanName);
          },
        );

        sessionStorage.setItem("grass", app.grass.db.src[Math.floor(Math.random() * app.grass.db.src.length)]);

        window.location.href = "./?music=" + encodeURIComponent(app.mus.sav.ss) + "&grass=" + encodeURIComponent(app.grass.sav.ss);
      }
    ]
  },

  mus: <Music.Config>{
    _: [],
    elem: <HTMLAudioElement>document.getElementById("music"),
    srcElem: document.createElement("source"),
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
      loz_botw: await fetchDB("bg-loz-botw"),
      loz_eow: await fetchDB("bg-loz-eow"),
      loz_ss: await fetchDB("bg-loz-ss"),
      loz_totk: await fetchDB("bg-loz-totk")
    },
    game: ["acnh", "dkb", "hw_aoi", "katfl", "lm3", "mk8dx", "mps", "miitopia", "pm_ttyd", "pik4", "poke_la", "poke_sword", "sm3da", "sm3dw_bf", "smbw", "smg2", "smo", "smp", "ssbu", "loz_botw", "loz_eow", "loz_ss", "loz_totk"]
  }
};

function submit() {
  sessionStorage.setItem("music", app.inp._[0].value || app.sel._[0].value);
  sessionStorage.setItem("grass", app.sel._[1].value);
  sessionStorage.setItem("bg", app.sel._[2].value);
}

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
  [app.inp._[i].type, app.inp._[i].value, app.inp._[i].id, app.inp._[i].placeholder, app.inp._[i].onclick] = [app.inp.type[i], app.inp.val[i], app.inp.id[i], app.inp.placehld[i], app.inp.onclick[i]];
}

app.mus.elem.controls = app.mus.elem.autoplay = app.mus.elem.loop = true;
[app.mus.elem.preload, app.mus.elem.style.display] = ["auto", "none"];
app.mus.srcElem.type = "audio/mpeg";
app.mus.elem.paused ? app.mus.elem.play() : null;

/**
 * Creates option group elements and sets their properties.
 * @param elems Empty array for option group elements to be pushed to.
 * @param labels Array of names to label each group.
 */
function pushOptGroups(elems: HTMLOptGroupElement[], labels: string[]): void {
  for (let i = 0; i < labels.length; i++) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = labels[i];
    elems.push(optgroup);
  }
}

/**
 * Creates option elements and sets their properties.
 * @param elems Array of empty arrays to push option elements to.
 * @param data Object with properties `src` and `name`, each arrays of data for each option.
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


/**
 * Searches each album to find a match between the saved soundtrack name and a soundtrack, to set the audio source.
 * @param sav Whether you are checking a soundtrack name against the value in session storage or url parameter.
 */
function findSoundtrack(sav: string): void {
  app.mus.srcElem.src = "";
  for (let i = 0; i < app.mus.db[0].contents.length; i++) {
    const album = app.mus.db[0].contents[i];

    for (let j = 0; j < album.contents.length; j++) {
      if (album.contents[j].name.replace(/\.[^/.]+$/, "") === sav) {
        app.mus.srcElem.src = "../../assets/music/" + album.name + "/" + album.contents[j].name;
        return;
      }
    }
  }
  console.error("Invalid session storage value:", sav);
}

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
  // Create option elements for selecting music
  const parent = app.mus.db[0]; // ParentObj

  for (let i = 0; i < parent.contents.length; i++) {
    const album = parent.contents[i]; // Obj1

    // Create optgroup
    pushOptGroups(app.mus._, [album.name]);

    // Initialize option array for this album
    app.mus.opt[i] = [];

    // Create options for each file
    for (let j = 0; j < album.contents.length; j++) {
      const file = album.contents[j];

      const option = document.createElement("option");
      option.value = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension for value
      option.textContent = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension for display

      app.mus.opt[i].push(option);
    }
  }

  // Create option elements for selecting box background
  pushGrassOpts(app.grass.opt, app.grass.db);

  // Add the music selector to the html
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

  // Add the box background selector to the html 
  app.sel._[1].appendChild(app.placehld._[1]);
  for (let i = 0; i < app.grass.db.src.length; i++) {
    app.sel._[1].appendChild(app.grass.opt[i]);
  }
  app.form.appendChild(app.lbl._[2]);
  app.form.appendChild(app.sel._[1]);
  app.form.appendChild(app.br[2]);

  // Add the set, reset, and random buttons to the html
  for (let i = 1; i < app.inp.type.length; i++) app.form.appendChild(app.inp._[i]);

  // Get saved data and use it
  if (app.mus.sav.ss != null) {
    findSoundtrack(app.mus.sav.ss);
    console.log("💾Retrieved the song you selected from session storage:", app.mus.sav.ss);
  } else if (app.mus.sav.param != null) {
    findSoundtrack(app.mus.sav.param);
    console.log("🔗Using song provided in url:", app.mus.sav.param);
  } app.mus.elem.appendChild(app.mus.srcElem);

  if (app.grass.sav.ss != null) {
    app.grass.elem.style.backgroundImage = "url('/assets/grass/" + app.grass.sav.ss + ".png')";
    console.log("💾Retrieved the grass you selected from session storage:", app.grass.sav.ss);
  } else if (app.grass.sav.param != null) {
    app.grass.elem.style.backgroundImage = "url('/assets/grass/" + app.grass.sav.param + ".png')";
    console.log("🔗Using grass provided in url for box styling:", app.grass.sav.param);
  } else app.grass.elem.style.backgroundImage = "url('/assets/grass/" + app.grass.db.src[0] + ".png')";

  const bgPicker = new RandomPicker(app.bg.game);
  bgPicker.pick(
    k => app.bg.db[k][0].contents,
    (k, file: Database.File) => {
      app.bg.elem.style.backgroundImage =
        `url('https://raw.githubusercontent.com/reper2/switch-album/${k}/${file.name}')`;
      console.log(`🎮Randomly selected background from ${k}:`, file.name);
    },
  );
});