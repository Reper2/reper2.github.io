"use strict";
/* eslint-disable semi */
/* eslint-disable no-undef */

const opt = {
	form: document.getElementById("optForm"),
	lbl: {
		_: [],
		name: ["select song:", "or type the name:", "select box background:", "select background:"]
	},
	sel: {
		_: [],
		title: ["select a song from the dropdown then click SET", "select grass (box background) then click SET", "select background then click SET"]
	},
	placehld: {
		_: [],
		name: ["-- select song --", "-- select grass --", "-- select background --"]
	},
	br: [],
	inp: {
		_: [],
		type: ["text", "submit", "reset", "button"],
		val: [null, "Set", "Reset", "Random"],
		id: ["", "optSet", "optReset", "optRand"],
		placehld: ["enter song name", null, null, null],
		onclick: [
			() => {
				sessionStorage.setItem("music", opt.inp._[0].value || opt.sel._[0].value);
				sessionStorage.setItem("grass", opt.sel._[1].value);
				sessionStorage.setItem("bg", opt.sel._[2].value);
			},
			() => {
				sessionStorage.setItem("music", opt.inp._[0].value || opt.sel._[0].value);
				sessionStorage.setItem("grass", opt.sel._[1].value);
				sessionStorage.setItem("bg", opt.sel._[2].value);
			},
			() => sessionStorage.clear(),
			() => {
				var r = {
					m: Math.floor(Math.random() * (opt.mus.smg.name.length + opt.mus.mk8d.name.length + opt.mus.smo.name1.length)),
					g: Math.floor(Math.random() * opt.grass.name1.length),
					b: Math.floor(Math.random() * (opt.bg.acnh.name1.length + opt.bg.botw.name1.length + opt.bg.sm3dw_bf.name1.length + opt.bg.smg.name1.length + opt.bg.smo.name1.length + opt.bg.smp.name1.length))
				};

				(r.m < opt.mus.smg.name.length) ? sessionStorage.setItem("music", opt.mus.smg.name[r.m]) // Super Mario Galaxy
					: (r.m >= opt.mus.smg.name.length && r.m < opt.mus.smg.name.length + opt.mus.mk8d.name.length) ? sessionStorage.setItem("music", opt.mus.mk8d.name[r.m - opt.mus.smg.name.length]) // Mario Kart 8 Deluxe
						: (r.m >= opt.mus.smg.name.length + opt.mus.mk8d.name.length && r.m < opt.mus.smg.name.length + opt.mus.mk8d.name.length + opt.mus.smo.name1.length) ? sessionStorage.setItem("music", opt.mus.smo.name1[r.m - opt.mus.smg.name.length - opt.mus.mk8d.name.length]) // Super Mario Odyssey
							: null;

				sessionStorage.setItem("grass", opt.grass.name1[r.g]);

				(r.b < opt.bg.acnh.name1.length) ? sessionStorage.setItem("bg", opt.bg.acnh.name1[r.b]) // Animal Crossing
					: (r.b >= opt.bg.acnh.name1.length && r.b < opt.bg.acnh.name1.length + opt.bg.botw.name1.length) ? sessionStorage.setItem("bg", opt.bg.botw.name1[r.b - opt.bg.acnh.name1.length]) // Breath of the Wild
						: (r.b >= opt.bg.acnh.name1.length + opt.bg.botw.name1.length && r.b < opt.bg.acnh.name1.length + opt.bg.botw.name1.length + opt.bg.sm3dw_bf.name1.length) ? sessionStorage.setItem("bg", opt.bg.sm3dw_bf.name1[r.b - opt.bg.acnh.name1.length - opt.bg.botw.name1.length]) // Super Mario 3D World
							: (r.b >= opt.bg.acnh.name1.length + opt.bg.botw.name1.length + opt.bg.sm3dw_bf.name1.length && r.b < opt.bg.acnh.name1.length + opt.bg.botw.name1.length + opt.bg.sm3dw_bf.name1.length + opt.bg.smg.name1.length) ? sessionStorage.setItem("bg", opt.bg.smg.name1[r.b - opt.bg.acnh.name1.length - opt.bg.botw.name1.length - opt.bg.sm3dw_bf.name1.length]) // Super Mario Galaxy
								: (r.b >= opt.bg.acnh.name1.length + opt.bg.botw.name1.length + opt.bg.sm3dw_bf.name1.length + opt.bg.smg.name1.length && r.b < opt.bg.acnh.name1.length + opt.bg.botw.name1.length + opt.bg.sm3dw_bf.name1.length + opt.bg.smg.name1.length + opt.bg.smo.name1.length) ? sessionStorage.setItem("bg", opt.bg.smo.name1[r.b - opt.bg.acnh.name1.length - opt.bg.botw.name1.length - opt.bg.sm3dw_bf.name1.length - opt.bg.smg.name1.length]) // Super Mario Odyssey
									: (r.b >= opt.bg.acnh.name1.length + opt.bg.botw.name1.length + opt.bg.sm3dw_bf.name1.length + opt.bg.smg.name1.length + opt.bg.smo.name1.length && r.b < opt.bg.acnh.name1.length + opt.bg.botw.name1.length + opt.bg.sm3dw_bf.name1.length + opt.bg.smg.name1.length + opt.bg.smo.name1.length) ? sessionStorage.setItem("bg", opt.bg.smp.name1[r.b - opt.bg.acnh.name1.length - opt.bg.botw.name1.length - opt.bg.sm3dw_bf.name1.length - opt.bg.smg.name1.length - opt.bg.smo.name1.length]) // Super Mario Party
										: null;
				window.location.href = "./?music=" + encodeURIComponent(opt.mus._sav.ss) + "&grass=" + encodeURIComponent(opt.grass._sav.ss) + "&bg=" + encodeURIComponent(opt.bg._sav.ss);
			}
		]
	},

	aud: document.getElementById("music"),
	audSrc: document.createElement("source"),
	mus: {
		_: [],
		_sav: {
			ss: sessionStorage.getItem("music"),
			param: new URL(window.location.href).searchParams.get("music")
		},
		name: ["Super Mario Galaxy", "Mario Kart 8 Deluxe", "Super Mario Odyssey"],
		smg: {
			opt: [],
			name: ["Overture", "The Star Festival", "Attack of the Airships", "Enter the Galaxy", "Egg Planet", "Rosalina in the Observatory 1", "The Honeyhive", "Space Junk Road", "Battlerock Galaxy", "Beach Bowl Galaxy", "Rosalina in the Observatory 2", "Enter Bowser Jr.!", "Waltz of the Boos", "Buoy Base Galaxy", "Gusty Garden Galaxy", "Rosalina in the Observatory 3", "King Bowser", "Melty Molten Galaxy", "The Galaxy Reactor", "Final Battle with Bowser", "Daybreak - A New Dawn", "Birth", "Super Mario Galaxy -Credits Theme-", "Purple Comet", "Blue Sky Athletic", "Super Mario 2007", "Luma", "Gateway Galaxy", "To the Observatory Grounds 1", "Observation Dome", "Course Select", "The Toad Brigade", "Airship Armada", "Space Fantasy", "To the Observatory 2", "Space Athletic", "Beach Bowl Galaxy - Undersea", "The Fiery Stronghold", "The Library", "Buoy Base Galaxy - Undersea", "Rainbow Mario", "Cosmic Comet", "Drip Drop Galaxy", "Dusty Dune Galaxy", "Heavy Metal Mecha-Bowser", "Deep Dark Galaxy", "A Wish", "Family"]
		},
		mk8d: {
			opt: [],
			name: ["Mario Kart 8", "Main Menu", "Mario Kart Stadium", "Water Park", "Sweet Sweet Canyon", "Thwomp Ruins", "Mario Circuit", "Toad Harbour", "Twisted Mansion", "Shy Guy Falls", "Sunshine Airport", "Dolphin Shoals", "Dolphin Shoals (Undersea)", "Electrodrome", "Mount Wario", "Cloudtop Cruise", "Bone-Dry Dunes", "Bowser's Castle", "Rainbow Road", "Wii Moo Moo Meadows", "GBA Mario Circuit", "DS Cheep Cheep Beach", "N64 Toad's Turnpike", "GCN Dry Dry Desert", "SNES Donut Plains 3", "N64 Royal Raceway", "3DS DK Jungle", "DS Wario Stadium", "GCN Sherbet Land", "3DS Melody Motorway", "N64 Yoshi Valley", "DS Tick-Tock Clock", "3DS Piranha Plant Pipeway", "Wii Grumble Volcano", "N64 Rainbow Road", "GCN Yoshi Circuit", "Excitebike Arena", "Dragon Driftway", "Mute City", "Wii Wario's Gold Mine", "SNES Rainbow Road", "Ice Ice Outpost", "Hyrule Circuit", "GCN Baby Park", "GBA Cheese Land", "Wild Woods", "Animal Crossing (Summer)", "Animal Crossing (Fall)", "Animal Crossing (Winter)", "Animal Crossing Results", "3DS Neo Bowser City", "GBA Ribbon Road", "Super Bell Subway", "Big Blue", "Tour Paris Promenade", "3DS Toad Circuit", "N64 Choco Mountain", "Wii Coconut Mall", "Tour Tokyo Blur", "DS Shroom Ridge", "GBA Sky Garden", "Tour Ninja Hideaway", "Tour New York Minute", "SNES Mario Circuit 3", "N64 Kalimari Desert", "Tour Sydney Sprint", "GBA Snow Land", "Wii Mushroom Gorge", "Sky High Sundae", "Waluigi Pinball", "Battle Stadium", "Sweet Sweet Kingdom", "Dragon Palace", "Lunar Colony", "3DS Wuhu Town", "GCN Luigi's Mansion", "Urchin Underpass"]
		},
		smo: {
			opt: [],
			name1: ["Bonneton", "Fossil Falls", "Fossil Falls (8-Bit)", "Fossil Falls Dinosaur", "Tostarena Ruins", "Tostarena Ruins (8-Bit)", "Tostarena Night", "Tostarena Night (8-Bit)", "Tostarena Town", "Tostarena Jaxi", "Steam Gardens", "Steam Gardens (8-Bit)", "Steam Gardens Sherm", "Lake Lamode 1", "Lake Lamode 1 (8-Bit)", "Lake Lamode 2", "Lake Lamode Underwater Passage", "Forgotten Isle 1", "Forgotten Isle 2", "Forgotten Isle 1 (8-Bit)", "New Donk City Night 1", "New Donk City Night 2", "New Donk City Daytime", "New Donk City Cafe", "New Donk City (Band Performance)", "NDC Festival", "NDC Festival (8-Bit)", "Bubblaine", "Bubblaine Underwater", "Bubblaine (8-Bit)", "Shiveria Town", "Shiveria Race-Course Entrance", "Mount Volbono", "Mount Volbono (8-Bit)", "Mount Volbono Town", "Bowser's Castle 1", "Bowser's Castle 1 (8-Bit)", "Bowser's Castle 2", "Honeylune Ridge", "Honeylune Ridge (8-Bit)", "Honeylune Ridge Caves", "Honeylune Ridge Wedding Hall", "Honeylune Ridge Collapse", "Honeylune Ridge Collapse (8-Bit)", "Honeylune Ridge Escape", "Honeylune Ridge Escape (Japanese)", "Honeylune Ridge Escape (8-Bit)", "Peach's Castle", "Broodals Battle", "Madame Broode Battle", "Knucklotec Battle", "Torkdrift Battle", "Mechawiggler Battle", "Mollusque-Lanceur Battle", "Mollusque-Lanceur Battle (8-Bit)", "Cookatiel Battle", "Ruined Dragon Battle", "RoboBrood Battle", "Bowser Battle 1", "Bowser Battle 2", "Run, Jump, Throw! 1", "Run, Jump, Throw! 2", "Run, Jump, Throw! 2 (8-Bit)", "Subterranean 1", "Subterranean 1 (8-Bit)", "Caves", "Ice", "Another World", "Ruins", "Ruins (8-Bit)", "Projection Room Above Ground", "Projection Room Underground", "Above the Clouds", "To the Next Kingdom", "Shop", "Race", "RC Car", "Spinning Slots", "Climatic Duel!"],
			name2: ["Bonneton", "Fossil Falls", "Fossil Falls (8-Bit)", "Fossil Falls: Dinosaur", "Tostarena: Ruins", "Tostarena: Ruins (8-Bit)", "Tostarena: Night", "Tostarena: Night (8-Bit)", "Tostarena: Town", "Tostarena: Jaxi", "Steam Gardens", "Steam Gardens (8-Bit)", "Steam Gardens: Sherm", "Lake Lamode 1", "Lake Lamode 1 (8-Bit)", "Lake Lamode 2", "Lake Lamode: Underwater Passage", "Forgotten Isle 1", "Forgotten Isle 2", "Forgotten Isle 1 (8-Bit)", "New Donk City: Night 1", "New Donk City: Night 2", "New Donk City: Daytime", "New Donk City: Cafe", "New Donk City (Band Performance)", "NDC Festival", "NDC Festival (8-Bit)", "Bubblaine", "Bubblaine: Underwater", "Bubblaine (8-Bit)", "Shiveria: Town", "Shiveria: Race-Course Entrance", "Mount Volbono", "Mount Volbono (8-Bit)", "Mount Volbono: Town", "Bowser's Castle 1", "Bowser's Castle 1 (8-Bit)", "Bowser's Castle 2", "Honeylune Ridge", "Honeylune Ridge (8-Bit)", "Honeylune Ridge: Caves", "Honeylune Ridge: Wedding Hall", "Honeylune Ridge: Collapse", "Honeylune Ridge: Collapse (8-Bit)", "Honeylune Ridge: Escape", "Honeylune Ridge: Escape (Japanese)", "Honeylune Ridge: Escape (8-Bit)", "Peach's Castle", "Broodals Battle", "Madame Broode Battle", "Knucklotec Battle", "Torkdrift Battle", "Mechawiggler Battle", "Mollusque-Lanceur Battle", "Mollusque-Lanceur Battle (8-Bit)", "Cookatiel Battle", "Ruined Dragon Battle", "RoboBrood Battle", "Bowser Battle 1", "Bowser Battle 2", "Run, Jump, Throw! 1", "Run, Jump, Throw! 2", "Run, Jump, Throw! 2 (8-Bit)", "Subterranean 1", "Subterranean 1 (8-Bit)", "Caves", "Ice", "Another World", "Ruins", "Ruins (8-Bit)", "Projection Room: Above Ground", "Projection Room: Underground", "Above the Clouds", "To the Next Kingdom", "Shop", "Race", "RC Car", "Spinning Slots", "Climatic Duel!"]
		},
		secret: ["Agent K.K.", "Bubblegum K.K.", "Go K.K. Rider!", "K.K. Dixie", "K.K. Jazz", "Space K.K.", "Wild World", "New Years Event - One Hour Left", "New Years Event - 30 Minutes Left", "New Years Event - 10 Minutes Left", "New Years Event - 5 Minutes Left", "New Years Event - New Years Eve! Midnight", "New Years Event - New Years Eve! 200 a.m."]
	},

	grass: {
		_elem: document.getElementById("grassBox"),
		_sav: {
			ss: sessionStorage.getItem("grass"),
			param: new URL(window.location.href).searchParams.get("grass")
		},
		opt: [],
		name1: ["summer1", "summer2", "fall1", "fall2", "fall3", "fall4", "fall5", "fall6", "winter", "spring"],
		name2: ["Summer 1", "Summer 2", "Fall 1", "Fall 2", "Fall 3", "Fall 4", "Fall 5", "Fall 6", "Winter", "Spring"],
	},

	bg: {
		_: [],
		_elem: document.getElementById("_bg"),
		_sav: {
			ss: sessionStorage.getItem("bg"),
			param: new URL(window.location.href).searchParams.get("bg")
		},
		name: ["Animal Crossing: New Horizons", "Breath of the Wild", "Super Mario 3D World + Bowser's Fury", "Super Mario Galaxy", "Super Mario Odyssey", "Super Mario Party"],
		acnh: {
			opt: [],
			name1: ["acnh_campsite_1", "acnh_campsite_2", "acnh_camspite_3", "acnh_castleEntrance", "acnh_castleThrone", "acnh_celeste", "acnh_cherryBlossomForest", "acnh_cherryBlossomPark_1", "acnh_cherryBlossomPark_2", "acnh_cherryBlossomPark_3", "acnh_cosmosCedarForest-west_1", "acnh_cosmosCedarForest-west_2", "acnh_fancyDinnerWithMaple_1", "acnh_fancyDinnerWithMaple_2", "acnh_flowerFieldSpacePath-billowClouds", "acnh_fountainFw", "acnh_fwShow_1", "acnh_fwShow_2", "acnh_fwShow_3", "acnh_fwShow-bowser", "acnh_fwShow-luigi_1", "acnh_fwShow-luigi_2", "acnh_fwShow-mario_1", "acnh_fwShow-mario_2", "acnh_fwShow-peach+bowser", "acnh_fwShow-peach+luigi", "acnh_fwShow-smoMario", "acnh_fwShow-smoMoon", "acnh_fwShow-starFrag", "acnh_glitchedInFireFlower", "acnh_glowingMossFalls", "acnh_glowingMossShrine_1", "acnh_glowingMossShrine_2", "acnh_glowingMossValley", "acnh_hhp_anActualGym", "acnh_hhp_cafe", "acnh_hhp_curlysCodespace_1", "acnh_hhp_curlysCodespace_2", "acnh_hhp_hospital-waitingRoom", "acnh_hhp_lighthouseLifestyle", "acnh_hhp_myCuttingEdgeKeep_1", "acnh_hhp_myCuttingEdgeKeep_2", "acnh_hhp_myOldSummertimeShelter_1", "acnh_hhp_myOldSummertimeShelter_2", "acnh_hhp_myVeryOwnTalentAgency", "acnh_hhp_sittingInTheMoonlight", "acnh_hhp_skyhighCityApartment_1", "acnh_hhp_skyHighCityApartment_2", "acnh_hhpEntrance", "acnh_hyacinthFieldFountain", "acnh_hyacinthFieldFounatin-fwShow", "acnh_hyacinthFieldFountain-nyeFw", "acnh_icecreamAtHarvsIsland", "acnh_marioArea-nyeFw", "acnh_mayDayTour-rover", "acnh_mumGardenBench_1", "acnh_mumGardenBench_2", "acnh_museum-critter_1", "acnh_museum-critter_2", "acnh_museum-critter_3", "acnh_museum-critter_4", "acnh_museum-critter_5", "acnh_museum-fish_1", "acnh_museum-fish_2", "acnh_museum-fish_3", "acnh_museum-fish_4", "acnh_museum-fish_5", "acnh_museum-fish_6", "acnh_museum-fish_7", "acnh_museum-fish_8", "acnh_northEasternShore", "acnh_park", "acnh_pinkCosmosCanyon", "acnh_ponchoSinging", "acnh_riversideGarden", "acnh_roadsideCampsite_1", "acnh_roadsideCampsite_2", "acnh_southWesternShore", "acnh_spaceArea", "acnh_starWishing_1", "acnh_starWishing_2", "acnh_starWishing_3", "acnh_statueOfLiberty", "acnh_walkingInWater_1", "acnh_walkingInWater_2", "acnh_walkingInWater_3", "acnh_walkingInWater_4", "acnh_walkingInWater_5", "acnh_walkingInWater_6", "acnh_walkingInWater_7", "acnh_walkingInWater_8", "acnh_walkingInWater_9", "acnh_weddingSeasonPic", "acnh_wisp--spiritScatter"],
			name2: ["Campsite _1", "Campsite _2", "Camspite _3", "Castle Entrance", "Castle Throne", "Celeste", "Cherry Blossom Forest", "Cherry Blossom Park _1", "Cherry Blossom Park _2", "Cherry Blossom Park _3", "Cosmos Cedar Forest - West _1", "Cosmos Cedar Forest - West _2", "Fancy Dinner with Maple _1", "Fancy Dinner with Maple _2", "Flower Field Space Path ~Billow Clouds~",	"Fountain Fireworks", "Fireworks Show _1", "Fireworks Show _2", "Fireworks Show _3", "Fireworks Show - Bowser Firework", "Fireworks Show - Luigi Firework _1", "Fireworks Show - Luigi Firework _2", "Fireworks Show - Mario Firework _1", "Fireworks Show - Mario Firework _2", "Fireworks Show - Peach + Bowser Firework", "Fireworks Show - Peach + Luigi Firework", "Fireworks Show - Mario (Odyssey) Firework", "Fireworks Show - Power Moon Firework", "Fireworks Show - Star Fragment Firework", "Glitched in Fire Flower (OOB glitch)", "Glowing Moss Falls", "Glowing Moss Shrine _1", "Glowing Moss Shrine _2", "Glowing Moss Valley", "HHP - An Actual Gym", "HHP - Curly's Codespace _1", "HHP - Curly's Codespace _2", "HHP - Hospital - Waiting Room", "HHP - Lighthouse Lifestyle",	"HHP - My Cutting Edge Keep _1", "HHP - My Cutting Edge Keep _2", "HHP - My Old Summertime Shelter _1", "HHP - My Old Summertime Shelter _2", "HHP - My Very Own Talent Agency", "HHP -- Sitting in the Moonlight", "HHP - Sky-High City Apartment _1", "HHP - Sky-High City Apartment _2", "HHP Entrance (night)", "Hyacinth Field Fountain", "Hyacinth Field Fountain - Fireworks Show", "Hyacinth Field Fountain - New Years Event", "Ice cream at Harv's Island", "Mario Area - New Years Event", "May Day Tour - Rover", "Mum Garden Bench _1", "Mum Garden Bench _2", "Museum - Critter Exhibit _1", "Museum - Critter Exhibit _2", "Museum - Critter Exhibit _3", "Museum - Critter Exhibit _4", "Museum - Critter Exhibit _5", "Museum - Fish Exhibit _1", "Museum - Fish Exhibit _2", "Museum - Fish Exhibit _3", "Museum - Fish Exhibit _4", "Museum - Fish Exhibit _5", "Museum - Fish Exhibit _6", "Museum - Fish Exhibit _7", "Museum - Fish Exhibit _8", "Eastern Shore", "Park", "Pink Cosmos Canyon", "Poncho Singing", "Riverside Garden", "Roadside Campsite _1", "Roadside Campsite _2", "South-Western Shore", "Space Area", "Star Wishing _1", "Star Wishing _2", "Star Wishing _3", "Statue of Liberty", "Walking in Water _1", "Walking in Water _2", "Walking in Water _3", "Walking in Water _4", "Walking in Water _5", "Walking in Water _6", "Walking in Water _7", "Walking in Water _8", "Walking in Water _9", "Wedding Season Pic", "Wisp ~Spirit Scatter~"]
		},
		botw: {
			opt: [],
			name1: ["botw_duelingPeaksStable", "botw_duelingPeaksStable--bloodMoon_1", "botw_duelingPeaksStable--bloodMoon_2", "botw_duelingPeaksStable--bloodMoon_3", "botw_hatenoAncientTechLab--bloodMoon", "botw_duelingPeaks", "botw_farosh", "botw_fairy-cotera_1", "botw_fairy-cotera_2", "botw_ruta", "botw_tot--staminaVessel", "botw_woodlandTower_1", "botw_woodlandTower_2", "botw_korokForest-masterSword", "botw_thundraPlateau_1", "botw_thundraPlateau_2", "botw_sanidinParkRuins--doubleRainbow", "botw_shaeLoyaShrine", "botw_lanayruWetlands--bloodMoon", "botw_nearFlightRange--frozenHorse", "botw_hebra-aurora_1", "botw_hebra-aurora_2", "botw_karkarikoVillage--cookpot", "botw_faron--floatingBoulder", "botw_7heroines", "botw_karaKaraBazaar--bloodMoon", "botw_gerudoTower--bloodMoon", "botw_deyaVilageRuins--floatingRock_1", "botw_deyaVilageRuins--floatingRock_2", "botw_spiritOrbReceived", "botw_karkarikoVillage--heartContainer", "botw_korokForest"],
			name2: ["Dueling Peaks Stable", "Dueling Peaks Stable ~Blood Moon~ 1", "Dueling Peaks Stable ~Blood Moon~ 2", "Dueling Peaks Stable ~Blood Moon~ 3", "Hateno Ancient Tech Lab ~Blood Moon~", "Dueling Peaks", "Farosh", "Great Fairy Fountain - Cotera 1", "Great Fairy Fountain - Cotera 2", "Divine Beast vah Ruta", "Temple of Time ~ Stamina Vessel", "Woodland Tower 1", "Woodland Tower 2", "Korok Forest - Master Sword", "Thundra Plateau 1", "Thundra Plateau 2", "Sanidin Park Ruins ~Double Rainbow~", "Shae Loya Shrine", "Lanayru Wetlands ~Blood Moon~", "(near) Flight Range ~ Frozen Horse", "Hebra - Aurora 1", "Hebra - Aurora 2", "Karkariko Village ~ Cookpot", "Faron ~ Floating Boulder", "The Seven Heroines", "Kara Kara Bazaar ~Blood Moon~", "Gerudo Tower ~Blood Moon~", "Deya Village Ruins ~ Floating Rock _1", "Deya Village Ruins ~ Floating Rock 2", "Spirit Orb Recieved", "Karkariko Village ~ Heart Container", "Korok Forest"]
		},
		sm3dw_bf: {
			opt: [],
			name1: ["sm3dw_courseClear_1", "sm3dw_courseClear_2", "sm3dw_courseClear_3", "sm3dw_underwater-clearPipes", "bf_crispClimbCastle-lighthouse", "bf_furyBowser-appearing", "bf_furyBowser-shell-spinning_1", "bf_furyBowser-shell-spinning_2", "bf_furyMode_1", "bf_furyMode_2", "bf_furyMode_3", "bf_furyMode_4", "bf_furyMode_5", "bf_furyMode_6", "bf_furyMode_7", "bf_furyMode_furyBowser-glowing", "bf_gigabell", "bf_scamperShores-lighthouse"],
			name2: ["Course Clear 1", "Course Clear 2", "Course Clear 3", "Underwater Clear Pipes Adventure", "Crisp Climb Castle - lighthouse", "Fury Bowser (appearing)", "Fury Bowser (shell spinning) 1",	"Fury Bowser (shell spinning) 2", "Fury Mode 1", "Fury Mode 2", "Fury Mode 3", "Fury Mode 4", "Fury Mode 5", "Fury Mode 6", "Fury Mode 7", "Fury Mode - Fury Bowser (glowing)", "Gigabell", "Scamper Shores - lighthouse"]
		},
		smg: {
			opt: [],
			name1: ["smg_battlerockGalaxy_1", "smg_battlerockGalaxy_2", "smg_battlerockGalaxy_3", "smg_battlerockGalaxy_4", "smg_battlerockGalaxy_5", "smg_battlerockGalaxy_6", "smg_fieryStronghold-bowser", "smg_ghostlyGalaxy", "smg_rosalinaStorytime"],
			name2: ["Battlerock Galaxy 1", "Battlerock Galaxy 2", "Battlerock Galaxy 3", "Battlerock Galaxy 4", "Battlerock Galaxy 5", "Battlerock Galaxy 6", "Bowser (The Fiery Stronghold)", "Ghostly Galaxy", "Rosalina Storytime"]
		},
		smo: {
			opt: [],
			name1: ["smo_bonneton-peach", "smo_bonneton-peach", "smo_bowserBattle1_1", "smo_bowserBattle1_2", "smo_bowserBattle1_3", "smo_honeyluneRidge-earth", "smo_honeyluneRidge-starBit", "smo_lakeLamode-binoculars--sky", "smo_map-moonKingdom", "smo_mountVolbono-crazyCap", "smo_mushroomKingdom-goombaTower", "smo_mushroomKingdom-tailTree", "smo_ndc-cityHall",	"smo_ndc-fest--start", "smo_peachsCastle-throne-mario"],
			name2: ["Bonneton - Peach in the Cap Kingdom", "Bonneton - Peach in the Cap Kingdom", "Bowser Battle 1 ~Nimbus Arena Showdown~ 1", "Bowser Battle 1 ~Nimbus Arena Showdown~ 2", "Bowser Battle 1 ~Nimbus Arena Showdown~ 3", "Honeylune Ridge - Looking at Earth", "Honeylune Ridge - Star Bit (regional coins)", "Lake Lamode - Binoculars ~sky~", "Map - Path to Moon Kingdom", "Mount Volbono - Crazy Cap", "Mushroom Kingdom - Goomba Tower", "Mushroom Kingdom - Tail Tree", "New Donk City - City Hall", "New Donk City - Traditional Festival ~start~", "Peach's Castle - Mario sitting on the throne"]
		},
		smp: {
			opt: [],
			name1: ["smp_~yeah~", "smp_actionHighlight"],
			name2: ["~Yeah!~", "Action Highlight"]
		},
	}
};

for (let i = 0; i < 4; i++)
	opt.br.push(document.createElement("br"));
for (let i = 0; i < opt.lbl.name.length; i++) {
	opt.lbl._.push(document.createElement("label"));
	opt.lbl._[i].innerHTML = opt.lbl.name[i];
} for (let i = 0; i < opt.sel.title.length; i++) {
	opt.sel._.push(document.createElement("select"));
	opt.sel._[i].title = opt.sel.title[i];
} for (let i = 0; i < opt.placehld.name.length; i++) {
	opt.placehld._.push(document.createElement("option"));
	[opt.placehld._[i].value, opt.placehld._[i].innerHTML] = ["", opt.placehld.name[i]];
} for (let i = 0; i < opt.inp.type.length; i++) {
	opt.inp._.push(document.createElement("input"));
	[opt.inp._[i].type, opt.inp._[i].value, opt.inp._[i].id, opt.inp._[i].placeholder, opt.inp._[i].onclick] = [opt.inp.type[i], opt.inp.val[i], opt.inp.id[i], opt.inp.placehld[i], opt.inp.onclick[i]];
}

opt.aud.controls = opt.aud.autoplay = opt.aud.loop = true;
[opt.aud.preload, opt.aud.style.display] = ["auto", "none"];
opt.audSrc.type = "audio/mpeg";
opt.aud.paused ? opt.aud.play() : null;

opt.lbl._[0].htmlFor = opt.sel._[0].name = opt.lbl._[1].htmlFor = opt.inp._[0].name = "music";
for (let i = 0; i < opt.mus.name.length; i++) {
	opt.mus._.push(document.createElement("optgroup"));
	opt.mus._[i].label = opt.mus.name[i];
} for (let i = 0; i < opt.mus.smg.name.length; i++) {
	opt.mus.smg.opt.push(document.createElement("option"));
	opt.mus.smg.opt[i].value = opt.mus.smg.opt[i].innerHTML = opt.mus.smg.name[i];
} for (let i = 0; i < opt.mus.mk8d.name.length; i++) {
	opt.mus.mk8d.opt.push(document.createElement("option"));
	opt.mus.mk8d.opt[i].value = opt.mus.mk8d.opt[i].innerHTML = opt.mus.mk8d.name[i];
} for (let i = 0; i < opt.mus.smo.name1.length; i++) {
	opt.mus.smo.opt.push(document.createElement("option"));
	[opt.mus.smo.opt[i].value, opt.mus.smo.opt[i].innerHTML] = [opt.mus.smo.name1[i], opt.mus.smo.name2[i]];
}

opt.lbl._[2].htmlFor = opt.sel._[1].name = "grass";
for (let i = 0; i < opt.grass.name1.length; i++) {
	opt.grass.opt.push(document.createElement("option"));
	[opt.grass.opt[i].value, opt.grass.opt[i].innerHTML] = [opt.grass.name1[i], opt.grass.name2[i]];
}

opt.lbl._[3].htmlFor = opt.sel._[2].name = "bg";
for (let i = 0; i < 6; i++) {
	opt.bg._.push(document.createElement("optgroup"));
	opt.bg._[i].label = opt.bg.name[i];
} for (let i = 0; i < opt.bg.acnh.name1.length; i++) {
	opt.bg.acnh.opt.push(document.createElement("option"));
	[opt.bg.acnh.opt[i].value, opt.bg.acnh.opt[i].innerHTML] = [opt.bg.acnh.name1[i], opt.bg.acnh.name2[i]];
} for (let i = 0; i < opt.bg.botw.name1.length; i++) {
	opt.bg.botw.opt.push(document.createElement("option"));
	[opt.bg.botw.opt[i].value, opt.bg.botw.opt[i].innerHTML] = [opt.bg.botw.name1[i], opt.bg.botw.name2[i]];
} for (let i = 0; i < opt.bg.sm3dw_bf.name1.length; i++) {
	opt.bg.sm3dw_bf.opt.push(document.createElement("option"));
	[opt.bg.sm3dw_bf.opt[i].value, opt.bg.sm3dw_bf.opt[i].innerHTML] = [opt.bg.sm3dw_bf.name1[i], opt.bg.sm3dw_bf.name2[i]];
} for (let i = 0; i < opt.bg.smg.name1.length; i++) {
	opt.bg.smg.opt.push(document.createElement("option"));
	[opt.bg.smg.opt[i].value, opt.bg.smg.opt[i].innerHTML] = [opt.bg.smg.name1[i], opt.bg.smg.name2[i]];
} for (let i = 0; i < opt.bg.smo.name1.length; i++) {
	opt.bg.smo.opt.push(document.createElement("option"));
	[opt.bg.smo.opt[i].value, opt.bg.smo.opt[i].innerHTML] = [opt.bg.smo.name1[i], opt.bg.smo.name2[i]];
} for (let i = 0; i < opt.bg.smp.name1.length; i++) {
	opt.bg.smp.opt.push(document.createElement("option"));
	[opt.bg.smp.opt[i].value, opt.bg.smp.opt[i].innerHTML] = [opt.bg.smp.name1[i], opt.bg.smp.name2[i]];
}

// music options
opt.sel._[0].appendChild(opt.placehld._[0]);
for (let i = 0; i < opt.mus.smg.name.length; i++)
	opt.mus._[0].appendChild(opt.mus.smg.opt[i]);
for (let i = 0; i < opt.mus.mk8d.name.length; i++)
	opt.mus._[1].appendChild(opt.mus.mk8d.opt[i]);
for (let i = 0; i < opt.mus.smo.name1.length; i++)
	opt.mus._[2].appendChild(opt.mus.smo.opt[i]);
for (let i = 0; i < opt.mus.name.length; i++)
	opt.sel._[0].appendChild(opt.mus._[i]);
opt.form.appendChild(opt.lbl._[0]);
opt.form.appendChild(opt.sel._[0]);
opt.form.appendChild(opt.br[0]);
opt.form.appendChild(opt.lbl._[1]);
opt.form.appendChild(opt.inp._[0]);
opt.form.appendChild(opt.br[1]);

// box background options
opt.sel._[1].appendChild(opt.placehld._[1]);
for (let i = 0; i < opt.grass.name1.length; i++)
	opt.sel._[1].appendChild(opt.grass.opt[i]);
opt.form.appendChild(opt.lbl._[2]);
opt.form.appendChild(opt.sel._[1]);
opt.form.appendChild(opt.br[2]);

// background options
opt.sel._[2].appendChild(opt.placehld._[2]);
for (let i = 0; i < opt.bg.acnh.name1.length; i++)
	opt.bg._[0].appendChild(opt.bg.acnh.opt[i]);
for (let i = 0; i < opt.bg.botw.name1.length; i++)
	opt.bg._[1].appendChild(opt.bg.botw.opt[i]);
for (let i = 0; i < opt.bg.sm3dw_bf.name1.length; i++)
	opt.bg._[2].appendChild(opt.bg.sm3dw_bf.opt[i]);
for (let i = 0; i < opt.bg.smg.name1.length; i++)
	opt.bg._[3].appendChild(opt.bg.smg.opt[i]);
for (let i = 0; i < opt.bg.smo.name1.length; i++)
	opt.bg._[4].appendChild(opt.bg.smo.opt[i]);
for (let i = 0; i < opt.bg.smp.name1.length; i++)
	opt.bg._[5].appendChild(opt.bg.smp.opt[i]);
for (let i = 0; i < opt.bg.name.length; i++)
	opt.sel._[2].appendChild(opt.bg._[i]);
opt.form.appendChild(opt.lbl._[3]);
opt.form.appendChild(opt.sel._[2]);
opt.form.appendChild(opt.br[3]);

// set, reset, random buttons
for (let i = 1; i < opt.inp.type.length; i++)
	opt.form.appendChild(opt.inp._[i]);

$(function () {
	if (opt.mus._sav.ss != null) {
		// opt.audSrc.src = "/assets/music/" + opt.mus._sav.ss + ".mp3";
		opt.audSrc.src = getData.ss + ".mp3";
		console.log("💾Retrieved the song you selected from session storage:", opt.mus._sav.ss);
	} else if (opt.mus._sav.param != null) {
		// opt.audSrc.src = "/assets/music/" + opt.mus._sav.param + ".mp3";
		opt.audSrc.src = getData.param + ".mp3";
		console.log("🔗Using song provided in url:", opt.mus._sav.param);
	} opt.aud.appendChild(opt.audSrc);

	if (opt.grass._sav.ss != null) {
		opt.grass._elem.style.backgroundImage = "url('/assets/grass/" + opt.grass._sav.ss + ".png')";
		console.log("💾Retrieved the grass you selected from session storage:", opt.grass._sav.ss);
	} else if (opt.grass._sav.param != null) {
		opt.grass._elem.style.backgroundImage = "url('/assets/grass/" + opt.grass._sav.param + ".png')";
		console.log("🔗Using grass provided in url for box styling:", opt.grass._sav.param);
	} else
		[opt.grass._elem.style.backgroundImage, opt.grass._elem.style.backgroundSize, opt.grass._elem.style.backgroundAttachment, opt.grass._elem.style.backgroundRepeat] = ["url('assets/grass/.png')", "cover", "fixed", "no-repeat"];

	if (opt.bg._sav.ss != null) {
		opt.bg._elem.style.backgroundImage = "url('/assets/background/" + opt.bg._sav.ss + ".jpg')";
		console.log("💾Retrieved the background you selected from session storage:", opt.bg._sav.ss);
	} else if (opt.bg._sav.param != null) {
		opt.bg._elem.style.backgroundImage = "url('/assets/background/" + opt.bg._sav.param + ".jpg')";
		console.log("🔗Using background provided in url:", opt.bg._sav.param);
	} else
		opt.bg._elem.style.backgroundImage = "url('/assets/background/.jpg')";
});