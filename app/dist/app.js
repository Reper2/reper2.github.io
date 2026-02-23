import { fetchDB } from "./core.js";
export const opt = {
    form: document.getElementById("optForm"),
    lbl: {
        _: [],
        name: ["select song:", "or type the name:", "select box background:"]
    },
    sel: {
        _: [],
        title: ["select a song from the dropdown then click SET", "select grass (box background) then click SET"]
    },
    placehld: {
        _: [],
        name: ["-- select song --", "-- select grass --"]
    },
    br: [],
    inp: {
        _: [],
        type: ["text", "submit", "reset", "button"],
        val: ["", "Set", "Reset", "Random"],
        id: ["", "optSet", "optReset", "optRand"],
        placehld: ["enter song name", "", "", ""],
        onclick: [
            () => submit(),
            () => submit(),
            () => sessionStorage.clear(),
            () => {
                const musicPicker = new RandomPicker(opt.mus.db[0].contents.map(album => album.name));
                musicPicker.pick(k => opt.mus.db[0].contents.find(album => album.name === k).contents, (k, file) => {
                    const cleanName = file.name
                        .split(/[?#]/)[0]
                        .trim()
                        .replace(/\.[^/.]+$/, "");
                    sessionStorage.setItem("music", cleanName);
                    opt.mus.srcElem.src = `/assets/music/${k}/${file.name}`;
                    console.log(`🎵Randomly selected track from ${k}:`, cleanName);
                });
                sessionStorage.setItem("grass", opt.grass.db.src[Math.floor(Math.random() * opt.grass.db.src.length)]);
                window.location.href = "./?music=" + encodeURIComponent(opt.mus.sav.ss) + "&grass=" + encodeURIComponent(opt.grass.sav.ss);
            }
        ]
    },
    mus: {
        _: [],
        elem: document.getElementById("music"),
        srcElem: document.createElement("source"),
        sav: {
            ss: sessionStorage.getItem("music"),
            param: new URL(window.location.href).searchParams.get("music")
        },
        db: await fetchDB("music"),
        opt: []
    },
    grass: {
        elem: document.getElementById("grassBox"),
        sav: {
            ss: sessionStorage.getItem("grass"),
            param: new URL(window.location.href).searchParams.get("grass")
        },
        db: await fetchDB("grass"),
        opt: []
    },
    bg: {
        elem: document.getElementById("_bg"),
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
    sessionStorage.setItem("music", opt.inp._[0].value || opt.sel._[0].value);
    sessionStorage.setItem("grass", opt.sel._[1].value);
    sessionStorage.setItem("bg", opt.sel._[2].value);
}
for (let i = 0; i < 4; i++)
    opt.br.push(document.createElement("br"));
for (let i = 0; i < opt.lbl.name.length; i++) {
    opt.lbl._.push(document.createElement("label"));
    opt.lbl._[i].innerHTML = opt.lbl.name[i];
}
for (let i = 0; i < opt.sel.title.length; i++) {
    opt.sel._.push(document.createElement("select"));
    opt.sel._[i].title = opt.sel.title[i];
}
for (let i = 0; i < opt.placehld.name.length; i++) {
    opt.placehld._.push(document.createElement("option"));
    [opt.placehld._[i].value, opt.placehld._[i].innerHTML] = ["", opt.placehld.name[i]];
}
for (let i = 0; i < opt.inp.type.length; i++) {
    opt.inp._.push(document.createElement("input"));
    [opt.inp._[i].type, opt.inp._[i].value, opt.inp._[i].id, opt.inp._[i].placeholder, opt.inp._[i].onclick] = [opt.inp.type[i], opt.inp.val[i], opt.inp.id[i], opt.inp.placehld[i], opt.inp.onclick[i]];
}
opt.mus.elem.controls = opt.mus.elem.autoplay = opt.mus.elem.loop = true;
[opt.mus.elem.preload, opt.mus.elem.style.display] = ["auto", "none"];
opt.mus.srcElem.type = "audio/mpeg";
opt.mus.elem.paused ? opt.mus.elem.play() : null;
function pushOptGroups(elems, labels) {
    for (let i = 0; i < labels.length; i++) {
        const optgroup = document.createElement("optgroup");
        optgroup.label = labels[i];
        elems.push(optgroup);
    }
}
export function pushOpts(obj, data) {
    for (let i = 0; i < data.contents.length; i++) {
        const option = document.createElement("option");
        option.value = data.contents[i].name.replace(/\.[^/.]+$/, "");
        option.innerHTML = data.contents[i].name.replace(/\.[^/.]+$/, "");
        obj.push(option);
    }
}
export function pushGrassOpts(obj, data) {
    for (let i = 0; i < data.src.length; i++) {
        const option = document.createElement("option");
        option.value = data.name[i];
        option.innerHTML = data.name[i];
        obj.push(option);
    }
}
opt.lbl._[0].htmlFor = opt.sel._[0].name = opt.lbl._[1].htmlFor = opt.inp._[0].name = "music";
opt.lbl._[2].htmlFor = opt.sel._[1].name = "grass";
function findSoundtrack(sav) {
    opt.mus.srcElem.src = "";
    for (let i = 0; i < opt.mus.db[0].contents.length; i++) {
        const album = opt.mus.db[0].contents[i];
        for (let j = 0; j < album.contents.length; j++) {
            if (album.contents[j].name.replace(/\.[^/.]+$/, "") === sav) {
                opt.mus.srcElem.src = "../../assets/music/" + album.name + "/" + album.contents[j].name;
                return;
            }
        }
    }
    console.error("Invalid session storage value:", sav);
}
export class RandomPicker {
    names;
    constructor(names) {
        this.names = names;
    }
    randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    randomName() {
        return this.randomItem(this.names);
    }
    pick(getContents, useFile) {
        const k = this.randomName();
        const contents = getContents(k);
        const file = this.randomItem(contents);
        useFile(k, file);
    }
}
$(function () {
    const parent = opt.mus.db[0];
    for (let i = 0; i < parent.contents.length; i++) {
        const album = parent.contents[i];
        pushOptGroups(opt.mus._, [album.name]);
        opt.mus.opt[i] = [];
        pushOpts(opt.mus.opt[i], opt.mus.db[0]);
    }
    pushGrassOpts(opt.grass.opt, opt.grass.db);
    for (let i = 0; i < opt.mus._.length; i++) {
        const optgroup = opt.mus._[i];
        for (const option of opt.mus.opt[i]) {
            optgroup.appendChild(option);
        }
        opt.sel._[0].appendChild(optgroup);
    }
    opt.form.appendChild(opt.lbl._[0]);
    opt.form.appendChild(opt.sel._[0]);
    opt.form.appendChild(opt.br[0]);
    opt.form.appendChild(opt.lbl._[1]);
    opt.form.appendChild(opt.inp._[0]);
    opt.form.appendChild(opt.br[1]);
    opt.sel._[1].appendChild(opt.placehld._[1]);
    for (let i = 0; i < opt.grass.db.src.length; i++) {
        opt.sel._[1].appendChild(opt.grass.opt[i]);
    }
    opt.form.appendChild(opt.lbl._[2]);
    opt.form.appendChild(opt.sel._[1]);
    opt.form.appendChild(opt.br[2]);
    for (let i = 1; i < opt.inp.type.length; i++)
        opt.form.appendChild(opt.inp._[i]);
    if (opt.mus.sav.ss != null) {
        findSoundtrack(opt.mus.sav.ss);
        console.log("💾Retrieved the song you selected from session storage:", opt.mus.sav.ss);
    }
    else if (opt.mus.sav.param != null) {
        findSoundtrack(opt.mus.sav.param);
        console.log("🔗Using song provided in url:", opt.mus.sav.param);
    }
    opt.mus.elem.appendChild(opt.mus.srcElem);
    if (opt.grass.sav.ss != null) {
        opt.grass.elem.style.backgroundImage = "url('/assets/grass/" + opt.grass.sav.ss + ".png')";
        console.log("💾Retrieved the grass you selected from session storage:", opt.grass.sav.ss);
    }
    else if (opt.grass.sav.param != null) {
        opt.grass.elem.style.backgroundImage = "url('/assets/grass/" + opt.grass.sav.param + ".png')";
        console.log("🔗Using grass provided in url for box styling:", opt.grass.sav.param);
    }
    else
        opt.grass.elem.style.backgroundImage = "url('/assets/grass/" + opt.grass.db.src[0] + ".png')";
    const bgPicker = new RandomPicker(opt.bg.game);
    bgPicker.pick(k => opt.bg.db[k][0].contents, (k, file) => {
        opt.bg.elem.style.backgroundImage =
            `url('https://raw.githubusercontent.com/reper2/switch-album/${k}/${file.name}')`;
        console.log(`🎮Randomly selected background from ${k}:`, file.name);
    });
});
//# sourceMappingURL=app.js.map