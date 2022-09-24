/* eslint-disable no-undef */
/* eslint-disable semi */
"use strict";
const [_optForm, _optSet, _optReset, _optRand] = [document.getElementById("optForm"), document.createElement("input"), document.createElement("input"), document.createElement("input")];


const [_aud, _audSrc] = [document.getElementById("music"), document.createElement("source")];
[_aud.controls, _aud.autoplay, _aud.loop, _aud.preload, _aud.style.display, _audSrc.type] = [true, true, true, "auto", "none", "audio/mp3"];
if (_aud.paused) _aud.play();

const [_musLabel, _musSel] = [document.createElement("label"), document.createElement("select")];
const _musPlacehld = document.createElement("option");
const mus_ = []; for (let i = 0; i < 3; i++) mus_.push(document.createElement("optgroup"));
const mus_smg = []; for (let i = 0; i < 33; i++) mus_smg.push(document.createElement("option"));
const mus_mk8d = []; for (let i = 0; i < 47; i++) mus_mk8d.push(document.createElement("option"));
const mus_smo = []; for (let i = 0; i < 35; i++) mus_smo.push(document.createElement("option"));

_musLabel.innerHTML = "Select Song:";
_musLabel.htmlFor = _musSel.name = "music";
_musSel.title = "select a song from the dropdown then click SET";
[_musPlacehld.value, _musPlacehld.innerHTML] = ["", "-- select song --"];
[mus_[0].label, mus_[1].label, mus_[2].label] = ["Super Mario Galaxy", "Mario Kart 8 Deluxe", "Super Mario Odyssey"];

mus_smg[0].value = mus_smg[0].innerHTML = "Airship Armada";
mus_smg[1].value = mus_smg[1].innerHTML = "Attack of the Airships";
mus_smg[2].value = mus_smg[2].innerHTML = "Battlerock Galaxy";
mus_smg[3].value = mus_smg[3].innerHTML = "Beach Bowl Galaxy";
mus_smg[4].value = mus_smg[4].innerHTML = "Beach Bowl Galaxy - Undersea";
mus_smg[5].value = mus_smg[5].innerHTML = "Birth";
mus_smg[6].value = mus_smg[6].innerHTML = "Blue Sky Athletic";
mus_smg[7].value = mus_smg[7].innerHTML = "Buoy Base Galaxy";
mus_smg[8].value = mus_smg[8].innerHTML = "Buoy Base Galaxy - Undersea";
mus_smg[9].value = mus_smg[9].innerHTML = "Deep Dark Galaxy";
mus_smg[10].value = mus_smg[10].innerHTML = "Drip Drop Galaxy";
mus_smg[11].value = mus_smg[11].innerHTML = "Dusty Dune Galaxy";
mus_smg[12].value = mus_smg[12].innerHTML = "Enter Bowser Jr.!";
mus_smg[13].value = mus_smg[13].innerHTML = "Enter the Galaxy";
mus_smg[14].value = mus_smg[14].innerHTML = "Final Battle with Bowser";
mus_smg[15].value = mus_smg[15].innerHTML = "Gateway Galaxy";
mus_smg[16].value = mus_smg[16].innerHTML = "Good Egg Galaxy";
mus_smg[17].value = mus_smg[17].innerHTML = "Gusty Garden Galaxy";
mus_smg[18].value = mus_smg[18].innerHTML = "Heavy Metal Mecha-Bowser";
mus_smg[19].value = mus_smg[19].innerHTML = "King Bowser";
mus_smg[20].value = mus_smg[20].innerHTML = "Melty Molten Galaxy";
mus_smg[21].value = mus_smg[21].innerHTML = "Overture";
mus_smg[22].value = mus_smg[22].innerHTML = "Purple Comet";
mus_smg[23].value = mus_smg[23].innerHTML = "Space Athletic";
mus_smg[24].value = mus_smg[24].innerHTML = "Space Fantasy";
mus_smg[25].value = mus_smg[25].innerHTML = "Space Junk Road";
mus_smg[26].value = mus_smg[26].innerHTML = "Super Mario 2007";
mus_smg[27].value = mus_smg[27].innerHTML = "Super Mario Galaxy -Credits Theme-";
mus_smg[28].value = mus_smg[28].innerHTML = "The Fiery Stronghold";
mus_smg[29].value = mus_smg[29].innerHTML = "The Galaxy Reactor";
mus_smg[30].value = mus_smg[30].innerHTML = "The Honeyhive";
mus_smg[31].value = mus_smg[31].innerHTML = "The Star Festival";
mus_smg[32].value = mus_smg[32].innerHTML = "Waltz of the Boos";

mus_mk8d[0].value = mus_mk8d[0].innerHTML = "3DS DK Jungle";
mus_mk8d[1].value = mus_mk8d[1].innerHTML = "3DS Music Park";
mus_mk8d[2].value = mus_mk8d[2].innerHTML = "3DS Neo Bowser City";
mus_mk8d[3].value = mus_mk8d[3].innerHTML = "3DS Wuhu Town";
mus_mk8d[4].value = mus_mk8d[4].innerHTML = "Animal Crossing (Summer)";
mus_mk8d[5].value = mus_mk8d[5].innerHTML = "Animal Crossing (Fall)";
mus_mk8d[6].value = mus_mk8d[6].innerHTML = "Animal Crossing (Winter)";
mus_mk8d[7].value = mus_mk8d[7].innerHTML = "Animal Crossing (Spring)";
mus_mk8d[8].value = mus_mk8d[8].innerHTML = "Animal Crossing Results";
mus_mk8d[9].value = mus_mk8d[9].innerHTML = "Cloudtop Cruise";
mus_mk8d[10].value = mus_mk8d[10].innerHTML = "DS Cheep Cheep Beach";
mus_mk8d[11].value = mus_mk8d[11].innerHTML = "DS Shroom Ridge";
mus_mk8d[12].value = mus_mk8d[12].innerHTML = "DS Tick-Tock Clock";
mus_mk8d[13].value = mus_mk8d[13].innerHTML = "DS Wario Stadium";
mus_mk8d[14].value = mus_mk8d[14].innerHTML = "Electrodome";
mus_mk8d[15].value = mus_mk8d[15].innerHTML = "GBA Sky Garden";
mus_mk8d[16].value = mus_mk8d[16].innerHTML = "GCN Luigi's Mansion";
mus_mk8d[17].value = mus_mk8d[17].innerHTML = "GCN Sherbet Land";
mus_mk8d[18].value = mus_mk8d[18].innerHTML = "Hyrule Circuit";
mus_mk8d[19].value = mus_mk8d[19].innerHTML = "Ice Ice Outpost";
mus_mk8d[20].value = mus_mk8d[20].innerHTML = "Lunar Colony";
mus_mk8d[21].value = mus_mk8d[21].innerHTML = "Mario Circuit";
mus_mk8d[22].value = mus_mk8d[22].innerHTML = "Mario Kart 8";
mus_mk8d[23].value = mus_mk8d[23].innerHTML = "Mario Kart Stadium";
mus_mk8d[24].value = mus_mk8d[24].innerHTML = "Mount Wario";
mus_mk8d[25].value = mus_mk8d[25].innerHTML = "Mute City";
mus_mk8d[26].value = mus_mk8d[26].innerHTML = "N64 Choco Mountain";
mus_mk8d[27].value = mus_mk8d[27].innerHTML = "N64 Rainbow Road";
mus_mk8d[28].value = mus_mk8d[28].innerHTML = "N64 Royal Raceway";
mus_mk8d[29].value = mus_mk8d[29].innerHTML = "N64 Toad's Turnpike";
mus_mk8d[30].value = mus_mk8d[30].innerHTML = "Rainbow Road";
mus_mk8d[31].value = mus_mk8d[31].innerHTML = "Shy Guy Falls";
mus_mk8d[32].value = mus_mk8d[32].innerHTML = "SNES Rainbow Road";
mus_mk8d[33].value = mus_mk8d[33].innerHTML = "Sunshine Airport";
mus_mk8d[34].value = mus_mk8d[34].innerHTML = "Super Bell Subway";
mus_mk8d[35].value = mus_mk8d[35].innerHTML = "Sweet Sweet Canyon";
mus_mk8d[36].value = mus_mk8d[36].innerHTML = "Thwomp Ruins";
mus_mk8d[37].value = mus_mk8d[37].innerHTML = "Toad Harbour";
mus_mk8d[38].value = mus_mk8d[38].innerHTML = "Tour Ninja Hideaway";
mus_mk8d[39].value = mus_mk8d[39].innerHTML = "Tour Paris Promenade";
mus_mk8d[40].value = mus_mk8d[40].innerHTML = "Tour Tokyo Blur";
mus_mk8d[41].value = mus_mk8d[41].innerHTML = "Twisted Mansion";
mus_mk8d[42].value = mus_mk8d[42].innerHTML = "Water Park";
mus_mk8d[43].value = mus_mk8d[43].innerHTML = "Wii Coconut Mall";
mus_mk8d[44].value = mus_mk8d[44].innerHTML = "Wii Grumble Volcano";
mus_mk8d[45].value = mus_mk8d[45].innerHTML = "Wii Moo Moo Meadows";
mus_mk8d[46].value = mus_mk8d[46].innerHTML = "Wii Wario's Gold Mine";

mus_smo[0].value = mus_smo[0].innerHTML = "Above the Clouds Stage";
mus_smo[1].value = mus_smo[1].innerHTML = "Band Performance (Super Mario Brothers Above Ground)";
mus_smo[2].value = mus_smo[2].innerHTML = "Bonneton";
mus_smo[3].value = mus_smo[3].innerHTML = "Bowser Castle";
mus_smo[4].value = mus_smo[4].innerHTML = "Bowser Castle Courtyard";
mus_smo[5].value = mus_smo[5].innerHTML = "Break Free (Lead the Way)";
mus_smo[6].value = mus_smo[6].innerHTML = "Bubblaine";
mus_smo[7].value = mus_smo[7].innerHTML = "Bubblaine Underwater";
mus_smo[8].value = mus_smo[8].innerHTML = "Forgotten Isle";
mus_smo[9].value = mus_smo[9].innerHTML = "Fossil Falls";
mus_smo[10].value = mus_smo[10].innerHTML = "Honeylune Ridge";
mus_smo[11].value = mus_smo[11].innerHTML = "Honeylune Ridge Collapse";
mus_smo[12].value = mus_smo[12].innerHTML = "Ice Cave";
mus_smo[13].value = mus_smo[13].innerHTML = "Jump Up, Super Star!";
mus_smo[14].value = mus_smo[14].innerHTML = "Jump Up, Super Star! NDC Festival Edition";
mus_smo[15].value = mus_smo[15].innerHTML = "Lake Lamode";
mus_smo[16].value = mus_smo[16].innerHTML = "Lake Lamode Above Ground";
mus_smo[17].value = mus_smo[17].innerHTML = "Lake Lamode Underwater Passage";
mus_smo[18].value = mus_smo[18].innerHTML = "Mount Volbono";
mus_smo[19].value = mus_smo[19].innerHTML = "New Donk City";
mus_smo[20].value = mus_smo[20].innerHTML = "New Donk City Night 1";
mus_smo[21].value = mus_smo[21].innerHTML = "New Donk City Night 2 ~City Hall~";
mus_smo[22].value = mus_smo[22].innerHTML = "Peach's Castle";
mus_smo[23].value = mus_smo[23].innerHTML = "Peronza Plaza";
mus_smo[24].value = mus_smo[24].innerHTML = "Poolside Rest";
mus_smo[25].value = mus_smo[25].innerHTML = "Shiveria Town";
mus_smo[26].value = mus_smo[26].innerHTML = "Snowline Circuit";
mus_smo[27].value = mus_smo[27].innerHTML = "Steam Gardens";
mus_smo[28].value = mus_smo[28].innerHTML = "Top-Hat Tower";
mus_smo[29].value = mus_smo[29].innerHTML = "Tostarena Night";
mus_smo[30].value = mus_smo[30].innerHTML = "Tostarena Ruins";
mus_smo[31].value = mus_smo[31].innerHTML = "Tostarena Town";
mus_smo[32].value = mus_smo[32].innerHTML = "Underground Moon Caverns";
mus_smo[33].value = mus_smo[33].innerHTML = "Underground Power Plant";
mus_smo[34].value = mus_smo[34].innerHTML = "Wedding Hall";

const [_getStoredMusic, _musicUrl_string] = [sessionStorage.getItem("music"), window.location.href];
const _musicUrl = new URL(_musicUrl_string);
const _getParamMusic = _musicUrl.searchParams.get("music");

_musSel.appendChild(_musPlacehld);
for (let i = 0; i < mus_smg.length; i++) mus_[0].appendChild(mus_smg[i]);
for (let i = 0; i < mus_mk8d.length; i++) mus_[1].appendChild(mus_mk8d[i]);
for (let i = 0; i < mus_smo.length; i++) mus_[2].appendChild(mus_smo[i]);
for (let i = 0; i < mus_.length; i++) _musSel.appendChild(mus_[i]);

_optForm.appendChild(_musLabel);
_optForm.appendChild(_musSel);
_optForm.appendChild(document.createElement("br"));

$(function() {
	const _music_sav = (_getStoredMusic || _getParamMusic);

	_audSrc.src = "/assets/music/" + _music_sav + ".mp3"; _aud.appendChild(_audSrc);

	console.group("🎵music");
	if (_getStoredMusic != null && _getParamMusic != "") console.log("💾Retrieved the song you selected from session storage:", _getStoredMusic);
	if (_getParamMusic != null && _getParamMusic != "") console.log("🔗Using song provided in url:", _getParamMusic);
	console.log("🎵Music has been set to", _music_sav);
	console.groupEnd();
});


const [_grassLabel, _grassSel] = [document.createElement("label"), document.createElement("select")];
const _grassPlacehld = document.createElement("option");
const grass = []; for (let i = 0; i < 10; i++) grass.push(document.createElement("option"));

_grassLabel.innerHTML = "Select Box Background:";
_grassLabel.htmlFor = (_grassSel.name = "grass");
_grassSel.title = "select grass (box background) then click SET";
[_grassPlacehld.value, _grassPlacehld.innerHTML] = ["_def", "-- select grass --"];

grass[0].value = "summer1"; grass[0].innerHTML = "Summer 1";
grass[1].value = "summer2"; grass[1].innerHTML = "Summer 2";
grass[2].value = "fall1"; grass[2].innerHTML = "Fall/Autumn 1";
grass[3].value = "fall2"; grass[3].innerHTML = "Fall/Autumn 2";
grass[4].value = "fall3"; grass[4].innerHTML = "Fall/Autumn 3";
grass[5].value = "fall4"; grass[5].innerHTML = "Fall/Autumn 4";
grass[6].value = "fall5"; grass[6].innerHTML = "Fall/Autumn 5";
grass[7].value = "fall6"; grass[7].innerHTML = "Fall/Autumn 6";
grass[8].value = "winter"; grass[8].innerHTML = "Winter";
grass[9].value = "spring"; grass[9].innerHTML = "Spring";

const [_getStoredGrass, _grassUrl_string] = [sessionStorage.getItem("grass"), window.location.href];
const _grassUrl = new URL(_grassUrl_string);
const _getParamGrass = _grassUrl.searchParams.get("grass");

_grassSel.appendChild(_grassPlacehld);
for (let i = 0; i < grass.length; i++) _grassSel.appendChild(grass[i]);

_optForm.appendChild(_grassLabel);
_optForm.appendChild(_grassSel);
_optForm.appendChild(document.createElement("br"));

$(function() {
	const [_grassBox, _grass_sav] = [document.getElementById("grassBox"), (_getStoredGrass || _getParamGrass)];

	_grassBox.style.backgroundPosition = "center center";
	if (_grass_sav == null || _grass_sav == "" || _grass_sav == "_def") [_grassBox.style.backgroundImage, _grassBox.style.backgroundSize, _grassBox.style.backgroundAttachment] = ["url('/assets/grass/_def.png')", "contain", "fixed"]
	else _grassBox.style.backgroundImage = "url('/assets/grass/" + _grass_sav + ".png')";

	console.group("🍀grass");
	if (_getStoredGrass != null && _getStoredGrass != "") console.log("💾Retrieved the grass you selected from session storage:", _getStoredGrass);
	if (_getParamGrass != null && _getParamGrass != "") console.log("🔗Using grass provided in url for box styling:", _getParamGrass);
	console.log("🍀Box background has been set to", _grass_sav);
	console.groupEnd();
});


const [_bgLabel, _bgSel] = [document.createElement("label"), document.createElement("select")];
const _bgPlacehld = document.createElement("option");
const bg_ = []; for (let i = 0; i < 6; i++) bg_.push(document.createElement("optgroup"));
const bg_acnh = []; for (let i = 0; i < 17; i++) bg_acnh.push(document.createElement("option"));
const bg_bf = []; for (let i = 0; i < 14; i++) bg_bf.push(document.createElement("option"));
const bg_sm3dw = []; for (let i = 0; i < 4; i++) bg_sm3dw.push(document.createElement("option"));
const bg_smg = []; for (let i = 0; i < 9; i++) bg_smg.push(document.createElement("option"));
const bg_smo = []; for (let i = 0; i < 14; i++) bg_smo.push(document.createElement("option"));
const bg_smp = []; for (let i = 0; i < 2; i++) bg_smp.push(document.createElement("option"));

_bgLabel.innerHTML = "Select Background:";
_bgLabel.htmlFor = _bgSel.name = "bg";
_bgSel.title = "select background then click SET";
[_bgPlacehld.value, _bgPlacehld.innerHTML] = ["_def", "-- select background --"];
[bg_[0].label, bg_[1].label, bg_[2].label, bg_[3].label, bg_[4].label, bg_[5].label] = ["Animal Crossing: New Horizons", "Bowser's Fury", "Super Mario 3D World", "Super Mario Galaxy", "Super Mario Odyssey", "Super Mario Party"];

bg_acnh[0].value = "acnh_fwShow_1"; bg_acnh[0].innerHTML = "Fireworks Show 1";
bg_acnh[1].value = "acnh_fwShow_2"; bg_acnh[1].innerHTML = "Fireworks Show 2";
bg_acnh[2].value = "acnh_fwShow_3"; bg_acnh[2].innerHTML = "Fireworks Show 3";
bg_acnh[3].value = "acnh_fwShow_4"; bg_acnh[3].innerHTML = "Fireworks Show 4";
bg_acnh[4].value = "acnh_fwShow-bowser"; bg_acnh[4].innerHTML = "Fireworks Show - Bowser Firework";
bg_acnh[5].value = "acnh_fwShow-luigi_1"; bg_acnh[5].innerHTML = "Fireworks Show - Luigi Firework 1";
bg_acnh[6].value = "acnh_fwShow-luigi_2"; bg_acnh[6].innerHTML = "Fireworks Show - Luigi Firework 2";
bg_acnh[7].value = "acnh_fwShow-mario_1"; bg_acnh[7].innerHTML = "Fireworks Show - Mario Firework 1";
bg_acnh[8].value = "acnh_fwShow-mario_2"; bg_acnh[8].innerHTML = "Fireworks Show - Mario Firework 2";
bg_acnh[9].value = "acnh_fwShow-peach+bowser"; bg_acnh[9].innerHTML = "Fireworks Show - Peach + Bowser Firework";
bg_acnh[10].value = "acnh_fwShow-peach+luigi"; bg_acnh[10].innerHTML = "Fireworks Show - Peach + Luigi Firework";
bg_acnh[11].value = "acnh_fwShow-smoMario"; bg_acnh[11].innerHTML = "Fireworks Show - Mario (Odyssey) Firework";
bg_acnh[12].value = "acnh_fwShow-smoMoon"; bg_acnh[12].innerHTML = "Fireworks Show - Power Moon Firework";
bg_acnh[13].value = "acnh_fwShow-starFrag"; bg_acnh[13].innerHTML = "Fireworks Show - Star Fragment Firework";
bg_acnh[14].value = "acnh_hhp_curlysCodespace"; bg_acnh[14].innerHTML = "HHP - Curly's Codespace";
bg_acnh[15].value = "acnh_hhp_reper2+wardell-moonlight"; bg_acnh[15].innerHTML = "HHP - Reper2 & Wardell in Moonlight";
bg_acnh[16].value = "acnh_hhp_skyhighCityApartment"; bg_acnh[16].innerHTML = "HHP - Sky-High City Apartment";

bg_bf[0].value = "bf_crispClimbCastle-lighthouse"; bg_bf[0].innerHTML = "Crisp Climb Castle";
bg_bf[1].value = "bf_furyBowser-appearing"; bg_bf[1].innerHTML = "Fury Bowser (appearing)";
bg_bf[2].value = "bf_furyBowser-shell-spinning_1"; bg_bf[2].innerHTML = "Fury Bowser (shell spinning) 1";
bg_bf[3].value = "bf_furyBowser-shell-spinning_2"; bg_bf[3].innerHTML = "Fury Bowser (shell spinning) 2";
bg_bf[4].value = "bf_furyMode_1"; bg_bf[4].innerHTML = "Fury Mode 1";
bg_bf[5].value = "bf_furyMode_2"; bg_bf[5].innerHTML = "Fury Mode 2";
bg_bf[6].value = "bf_furyMode_3"; bg_bf[6].innerHTML = "Fury Mode 3";
bg_bf[7].value = "bf_furyMode_4"; bg_bf[7].innerHTML = "Fury Mode 4";
bg_bf[8].value = "bf_furyMode_5"; bg_bf[8].innerHTML = "Fury Mode 5";
bg_bf[9].value = "bf_furyMode_6"; bg_bf[9].innerHTML = "Fury Mode 6";
bg_bf[10].value = "bf_furyMode_7"; bg_bf[10].innerHTML = "Fury Mode 7";
bg_bf[11].value = "bf_furyMode_furyBowser-glowing"; bg_bf[11].innerHTML = "Fury Mode - Fury Bowser (glowing)";
bg_bf[12].value = "bf_gigabell"; bg_bf[12].innerHTML = "Gigabell";
bg_bf[13].value = "bf_scamperShores-lighthouse"; bg_bf[13].innerHTML = "Scamper Shores lighthouse";

bg_sm3dw[0].value = "sm3dw_courseClear_1"; bg_sm3dw[0].innerHTML = "Course Clear 1";
bg_sm3dw[1].value = "sm3dw_courseClear_2"; bg_sm3dw[1].innerHTML = "Course Clear 2";
bg_sm3dw[2].value = "sm3dw_courseClear_3"; bg_sm3dw[2].innerHTML = "Course Clear 3";
bg_sm3dw[3].value = "sm3dw_underwater-clearPipes"; bg_sm3dw[3].innerHTML = "Underwater Clear Pipes Adventure";

bg_smg[0].value = "smg_battlerockGalaxy_1"; bg_smg[0].innerHTML = "Battlerock Galaxy 1";
bg_smg[1].value = "smg_battlerockGalaxy_2"; bg_smg[1].innerHTML = "Battlerock Galaxy 2";
bg_smg[2].value = "smg_battlerockGalaxy_3"; bg_smg[2].innerHTML = "Battlerock Galaxy 3";
bg_smg[3].value = "smg_battlerockGalaxy_4"; bg_smg[3].innerHTML = "Battlerock Galaxy 4";
bg_smg[4].value = "smg_battlerockGalaxy_5"; bg_smg[4].innerHTML = "Battlerock Galaxy 5";
bg_smg[5].value = "smg_battlerockGalaxy_6"; bg_smg[5].innerHTML = "Battlerock Galaxy 6";
bg_smg[6].value = "smg_fieryStronghold-bowser"; bg_smg[6].innerHTML = "The Fiery Stronghold - Bowser";
bg_smg[7].value = "smg_ghostlyGalaxy"; bg_smg[7].innerHTML = "Ghostly Galaxy";
bg_smg[8].value = "smg_rosalinaStorytime"; bg_smg[8].innerHTML = "Rosalina Storytime";

bg_smo[0].value = "smo_bonneton-peach"; bg_smo[0].innerHTML = "Bonneton - Peach in the Cap Kingdom";
bg_smo[1].value = "smo_bowserBattle1_1"; bg_smo[1].innerHTML = "Bowser Battle 1 ~Nimbus Arena Showdown~ 1";
bg_smo[2].value = "smo_bowserBattle1_2"; bg_smo[2].innerHTML = "Bowser Battle 1 ~Nimbus Arena Showdown~ 2";
bg_smo[3].value = "smo_bowserBattle1_3"; bg_smo[3].innerHTML = "Bowser Battle 1 ~Nimbus Arena Showdown~ 3";
bg_smo[4].value = "smo_honeyluneRidge-earth"; bg_smo[4].innerHTML = "Honeylune Ridge - Looking at Earth";
bg_smo[5].value = "smo_honeyluneRidge-starBit"; bg_smo[5].innerHTML = "Honeylune Ridge - Star Bit (regional coins)";
bg_smo[6].value = "smo_lakeLamode-binoculars--sky"; bg_smo[6].innerHTML = "Lake Lamode - Binoculars ~sky~";
bg_smo[7].value = "smo_map-moonKingdom"; bg_smo[7].innerHTML = "Map - Path to Moon Kingdom";
bg_smo[8].value = "smo_mountVolbono_crazyCap"; bg_smo[8].innerHTML = "Mount Volbono - Crazy Cap";
bg_smo[9].value = "smo_mushroomKingdom-goombaTower"; bg_smo[9].innerHTML = "Mushroom Kingdom - Goomba Tower";
bg_smo[10].value = "smo_mushroomKingdom-tailTree"; bg_smo[10].innerHTML = "Mushroom Kingdom - Tail Tree";
bg_smo[11].value = "smo_ndc-cityHall"; bg_smo[11].innerHTML = "New Donk City - City Hall";
bg_smo[12].value = "smo_ndc-fest--start"; bg_smo[12].innerHTML = "New Donk City - Traditional Festival ~start~";
bg_smo[13].value = "smo_peachsCastle-throne-mario"; bg_smo[13].innerHTML = "Peach's Castle - Mario sitting on the throne";

bg_smp[0].value = "smp_~yeah~"; bg_smp[0].innerHTML = "~Yeah!~";
bg_smp[1].value = "smp_actionHighlight"; bg_smp[1].innerHTML = "Action Highlight";

const [_getStoredBg, _bgUrl_string] = [sessionStorage.getItem("bg"), window.location.href];
const _bgUrl = new URL(_bgUrl_string);
const _getParamBg = _bgUrl.searchParams.get("bg");

_bgSel.appendChild(_bgPlacehld);
for (let i = 0; i < bg_acnh.length; i++) bg_[0].appendChild(bg_acnh[i]);
for (let i = 0; i < bg_bf.length; i++) bg_[1].appendChild(bg_bf[i]);
for (let i = 0; i < bg_sm3dw.length; i++) bg_[2].appendChild(bg_sm3dw[i]);
for (let i = 0; i < bg_smg.length; i++) bg_[3].appendChild(bg_smg[i]);
for (let i = 0; i < bg_smo.length; i++) bg_[4].appendChild(bg_smo[i]);
for (let i = 0; i < bg_smp.length; i++) bg_[5].appendChild(bg_smp[i]);
for (let i = 0; i < bg_.length; i++) _bgSel.appendChild(bg_[i]);

_optForm.appendChild(_bgLabel);
_optForm.appendChild(_bgSel);
_optForm.appendChild(document.createElement("br"));

$(function() {
	const [_bg, _bg_sav] = [document.getElementById("_bg"), (_getStoredBg || _getParamBg)];

	if (_bg_sav == null || _bg_sav == "" || _bg_sav == "_def") _bg.style.backgroundImage = "url('/assets/background/_def.png')";
	else _bg.style.backgroundImage = "url('/assets/background/" + _bg_sav + ".jpg')";

	console.group("🖼️background");
	if (_getStoredBg != null && _getStoredBg != "") console.log("💾Retrieved the background you selected from session storage:", _getStoredBg);
	if (_getParamBg != null && _getParamBg != "") console.log("🔗Using background provided in url for box styling:", _getParamBg);
	console.log("🖼️Background has been set to", _bg_sav);
	console.groupEnd();
});


[_optSet.type, _optSet.value, _optSet.id, _optSet.onclick] = ["submit", "Set", "optSet",
	function() {
		sessionStorage.setItem("music", _musSel.value);
		sessionStorage.setItem("grass", _grassSel.value);
		sessionStorage.setItem("bg", _bgSel.value);
	}
];
[_optReset.type, _optReset.value, _optReset.id, _optReset.onclick] = ["reset", "Reset", "optReset", function del() { sessionStorage.clear() }];
[_optRand.type, _optRand.value, _optRand.id, _optRand.onclick] = ["button", "Random", "optRand",
	function() {
		var _musRand = Math.floor(Math.random() * (mus_smg.length + mus_mk8d.length + mus_smo.length));
		if (_musRand < mus_smg.length) sessionStorage.setItem("music", mus_smg[_musRand].value)
		else if (_musRand >= mus_smg.length && _musRand < (mus_smg.length + mus_mk8d.length)) sessionStorage.setItem("music", mus_mk8d[_musRand - mus_smg.length].value)
		else if (_musRand >= (mus_smg.length + mus_mk8d.length) && _musRand < (mus_smg.length + mus_mk8d.length + mus_smo.length)) sessionStorage.setItem("music", mus_smo[_musRand - mus_smg.length - mus_mk8d.length].value)
		else console.error("Invalid number thrown in random music selector algorithm:", _musRand);

		var _grassRand = Math.floor(Math.random() * grass.length);
		if (_grassRand < grass.length) sessionStorage.setItem("grass", grass[_grassRand].value)
		else console.error("Invalid number thrown in random grass (box background) selector algorithm:", _grassRand);

		var _bgRand = Math.floor(Math.random() * (bg_acnh.length + bg_bf.length + bg_sm3dw.length + bg_smg.length + bg_smo.length + bg_smp.length));
		if (_bgRand < bg_acnh.length) sessionStorage.setItem("bg", bg_acnh[_bgRand].value)
		else if (_bgRand >= bg_acnh.length && _bgRand < (bg_acnh.length + bg_bf.length)) sessionStorage.setItem("bg", bg_bf[_bgRand - bg_acnh.length].value)
		else if (_bgRand >= (bg_acnh.length + bg_bf.length) && _bgRand < (bg_acnh.length + bg_bf.length + bg_sm3dw.length)) sessionStorage.setItem("bg", bg_sm3dw[_bgRand - bg_acnh.length - bg_bf.length].value)
		else if (_bgRand >= (bg_acnh.length + bg_bf.length + bg_sm3dw.length) && _bgRand < (bg_acnh.length + bg_bf.length + bg_sm3dw.length + bg_smg.length)) sessionStorage.setItem("bg", bg_smg[_bgRand - bg_acnh.length - bg_bf.length - bg_sm3dw.length].value)
		else if (_bgRand >= (bg_acnh.length + bg_bf.length + bg_sm3dw.length + bg_smg.length) && _bgRand < (bg_acnh.length + bg_bf.length + bg_sm3dw.length + bg_smg.length + bg_smo.length)) sessionStorage.setItem("bg", bg_smo[_bgRand - bg_acnh.length - bg_bf.length - bg_sm3dw.length - bg_smg.length].value)
		else if (_bgRand >= (bg_acnh.length + bg_bf.length + bg_sm3dw.length + bg_smg.length + bg_smo.length) && _bgRand < (bg_acnh.length + bg_bf.length + bg_sm3dw.length + bg_smg.length + bg_smo.length)) sessionStorage.setItem("bg", bg_smp[_bgRand - bg_acnh.length - bg_bf.length - bg_sm3dw.length - bg_smg.length - bg_smo.length].value)
		else console.error("Invalid number thrown in random background selector algorithm:", _bgRand);

		window.location.reload();
	}
];

_optForm.appendChild(_optSet);
_optForm.appendChild(_optReset);
_optForm.appendChild(_optRand);