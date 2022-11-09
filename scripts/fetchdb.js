/**
 * Copyright 2022 Reper2
 * 
 * Licensed under the MIT License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 		https://github.com/Reper2/reper2.github.io/LICENSE
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *   
 */

"use strict";
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const fetchdb = {
	arr0: opt.mus.smg.name.concat(opt.mus.mk8d.name, opt.mus.smo.name1),
	arr1: [
		"cesiiref/1-01 Overture",
		"ibjjbtkd/1-02 The Star Festival",
		"wsfviyzg/1-03 Attack of the Airships",
		"bndyddfz/1-06 Enter the Galaxy",
		"xwfxgcre/1-08 Rosalina in the Observatory 1",
		"zwpqednd/1-09 The Honeyhive",
		"dddwxgaa/1-10 Space Junk Road",
		"ufxvbjnp/1-11 Battlerock Galaxy",
		"wrwzhaip/1-12 Beach Bowl Galaxy",
		"djtcbxkv/1-13 Rosalina in the Observatory 2",
		"psvbcixu/1-14 Enter Bowser Jr.!",
		"nfwubywm/1-15 Waltz of the Boos",
		"hrgkmufk/1-16 Buoy Base Galaxy",
		"stiylbbr/1-17 Gusty Garden Galaxy",
		"llvkmlmb/1-18 Rosalina in the Observatory 3",
		"ijcfakri/1-19 King Bowser",
		"ptityeyx/1-20 Melty Molten Galaxy",
		"wjhaxpdd/1-21 The Galaxy Reactor",
		"vuhzysbm/1-22 Final Battle with Bowser",
		"tksglpjj/1-23 Daybreak - A New Dawn",
		"lgadiuym/1-24 Birth",
		"rzuvgkov/1-25 Super Mario Galaxy",
		"ktousmhz/1-26 Purple Comet",
		"dkgkekjg/1-27 Blue Sky Athletics",
		"okuatfee/1-28 Super Mario 2007",
		"pnvbaikv/2-02 Luma",
		"opikzhsw/2-03 Gateway Galaxy",
		"oiefiwxx/2-05 To the Observatory Grounds 1",
		"hzgfrova/2-06 Observation Dome",
		"smxinlgg/2-07 Course Select",
		"iupyupcd/2-13 The Toad Brigade",
		"xxfgjdka/2-14 Airship Armada",
		"yydqvdmd/2-16 Space Fantasy",
		"hrqhhgxx/2-18 To the Observatory Grounds 2",
		"jibgkthx/2-19 Space Athletic",
		"bkaoqoqw/2-21 Beach Bowl Galaxy - Undersea",
		"lptkiabr/2-24 The Fiery Stronghold",
		"sniayhnz/2-28 The Library",
		"rpihqtzg/2-29 Buoy Base Galaxy - Undersea",
		"egajqdwd/2-30 Rainbow Mario",
		"bcdfxwkl/2-35 Cosmic Comet",
		"hlwlefog/2-36 Drip Drop Galaxy",
		"jglzjjxt/2-43 Dusty Dune Galaxy",
		"dakbrxne/2-44 Heavy Metal Mecha-Bowser",
		"spocgpcl/2-46 Deep Dark Galaxy",
		"dieqqmuy/2-52 A Wish",
		"erreytus/2-53 Family",

		"ioftcjru/1-01 Mario Kart 8",
		"qnekghrc/1-02 Main Menu",
		"ldmgllih/1-05 Mario Kart Stadium",
		"bcrtyxlj/1-06 Water Park",
		"acatrshd/1-07 Sweet Sweet Canyon",
		"lkbqgazz/1-08 Thwomp Ruins",
		"bhpwczqa/1-09 Mario Circuit",
		"exklbvop/1-10 Toad Harbor",
		"eauqxnjb/1-11 Twisted Mansion",
		"pkoohegr/1-12 Shy Guy Falls",
		"hsysgcnl/1-13 Sunshine Airport",
		"lgilxaln/1-14 Dolphin Shoals",
		"nhzsfrks/1-15 Dolphin Shoals (In the Sea ~ Undersea)",
		"rdcjvfov/1-16 Electrodrome",
		"jauoorfe/1-17 Mount Wario",
		"xqspcjpi/1-19 Cloudtop Cruise",
		"igfgfdgg/1-20 Bone-Dry Dunes",
		"guwbxglc/1-21 Bowser's Castle",
		"jbrewomy/1-22 Rainbow Road",
		"pfkhnwas/2-02 Wii Moo Moo Meadows",
		"xmozeplu/2-03 GBA Mario Circuit",
		"imlxjvrw/2-04 DS Cheep Cheep Beach",
		"nbsmbvzt/2-05 N64 Toad's Turnpike",
		"boarpeku/2-06 GCN Dry Dry Desert",
		"rsacbnil/2-07 SNES Donut Plains 3",
		"iqrqiuqu/2-08 N64 Royal Raceway",
		"zuokyyrl/2-09 3DS DK Jungle",
		"weeywyfj/2-10 DS Wario Stadium",
		"akteotwt/2-11 GCN Sherbet Land",
		"odziipjk/2-12 3DS Music Park",
		"kbiktzlt/2-13 N64 Yoshi Valley",
		"uwjkmron/2-14 DS Tick-Tock Clock",
		"tgfstaev/2-15 3DS Piranha Plant Slide",
		"vqutjaac/2-16 Wii Grumble Volcano",
		"wtdzicoy/2-17 N64 Rainbow Road",
		"qzfrrfbp/2-21 GCN Yoshi Circuit",
		"rmolxtfu/2-22 Excitebike Arena",
		"csqxhhdf/2-23 Dragon Driftway",
		"ovtfjdyj/2-24 Mute City",
		"uvxopytt/2-25 Wii Wario's Gold Mine",
		"bmzbqxmf/2-26 SNES Rainbow Road",
		"tualofnt/2-27 Ice Ice Outpost",
		"vytdeyld/2-28 Hyrule Circuit",
		"huzsoncy/3-02 GCN Baby Park",
		"qcrlvzvj/3-03 GBA Cheese Land",
		"vangjeic/3-04 Wild Woods",
		"nzunqvbm/3-05 Animal Crossing (Spring)",
		"ndhxkytj/3-06 Animal Crossing (Summer)",
		"ulyjcgac/3-07 Animal Crossing (Fall)",
		"aldbcrfr/3-08 Animal Crossing (Winter)",
		"rpguztui/3-09 Animal Crossing Results",
		"eanudmhq/3-10 3DS Neo Bowser City",
		"liorlqvf/3-11 GBA Ribbon Road",
		"eohpuxxw/3-12 Super Bell Subway",
		"kqthzxrl/3-14 Big Blue",

		"mmiwpvadvm/1. Tour Paris Promenade",
		"vrjczojrac/5. 3DS Toad Circuit",
		"cynytstrbk/9. N64 Choco Mountain",
		"qzeonvyqej/13. Wii Coconut Mall",
		"pgyzbpjayu/17. Tour Tokyo Blur",
		"xezduziase/21. DS Shroom Ridge",
		"wubwkprnrv/25. GBA Sky Garden",
		"ffpsuczaiy/29. Tour Ninja Hideaway",

		"qdkzrwtffs/1. Tour New York Minute",
		"yhpvvshgwz/5. SNES Mario Circuit 3",
		"ignehedwqf/9. N64 Kalimari Desert",
		"osppngzbiu/13. Tour Sydney Sprint",
		"myrgglkfof/17. GBA Snow Land",
		"awodkicehm/21. Wii Mushroom Gorge",
		"bmeifaeghc/25. Sky High Sundae",
		"wzjponklbu/29. Waluigi Pinball",

		"rafhbnvp/3-17 Battle Stadium",
		"nlqjhrqc/3-18 Sweet Sweet Kingdom",
		"favzunft/3-19 Dragon Palace",
		"oirkygwd/3-20 Lunar Colony",
		"bmihazsb/3-21 3DS Wuhu Town",
		"oxmmneja/3-22 GCN Luigi's Mansion",
		"nwwurfwy/3-23 SNES Battle Course 1",
		"fixjgdfo/3-24 Urchin Underpass \"Splattack!\"",

		"crzmghomhn/1-04 Bonneton",
		"iboskfllnq/1-09 Fossil Falls",
		"wvqiwrtpao/4-01 Fossil Falls 8bit Version",
		"fkzifsuemq/1-11 Capturing Tyrannosaurus!",
		"oabtcnbzjw/1-15 Tostarena Ruins",
		"fecllwysup/4-02 Tostarena Ruins 8bit Version",
		"hjpunzjnru/1-17 Tostarena Night",
		"wdxicyuhcg/4-04 Tostarena Night 8bit Version",
		"mvsrwhbzux/1-20 Tostarena Town",
		"ddzjsakomm/1-18 Riding the Jaxi",
		"dlrdhbnyat/1-22 Steam Gardens",
		"zmunfieurt/4-05 Steam Gardens 8bit Version",
		"gfqsacwphs/1-23 Steam Gardens Sherm",
		"yyodxuwazl/1-26 Lake Lamode",
		"pxizyrwnfh/4-06 Lake Lamode 8bit Version",
		"qkliijqdec/1-27 Lake Lamode Above Ground",
		"teorhvyhzh/1-25 Lake Lamode Underwater Passage",
		"zvfqtirdgw/2-01 Cappy Gets Taken Away!",
		"yulrzezuax/2-02 Forgotten Isle",
		"cnknjkbika/4-07 Forgotten Isle 8bit Version",
		"bpccssupis/2-04 New Donk City Night 1",
		"kgwuyrvvtb/2-05 New Donk City Night 2 ~City Hall~",
		"czvltidyen/2-08 New Donk City",
		"exkmlatcps/2-10 Poolside Rest",
		"acurefmavj/2-09 Band Performance (Super Mario Brothers Above Ground)",
		"buhnausdko/2-12 Jump Up, Super Star! NDC Festival Edition",
		"ztmicfsbls/4-17 Jump Up, Super Star! NDC Festival Edition 8bit Version",
		"ijfjamebss/2-19 Bubblaine",
		"ueqccxcggi/2-20 Bubblaine Underwater",
		"vovsneomap/4-10 Bubblaine 8bit Version",
		"bqyvlrizqi/2-14 Shiveria Town",
		"gywsxoianu/2-16 Snowline Circuit",
		"rbjzygedun/2-23 Mount Volbono",
		"zqmjxeyjbj/4-12 Mount Volbono 8bit Version",
		"hekgqxmawj/2-24 Peronza Plaza",
		"kgxockpzma/2-28 Bowser Castle",
		"sbgueprqvo/4-13 Bowser Castle 8bit Version",
		"erpodxvopg/2-29 Bowser Castle Courtyard",
		"rljfujbavo/3-03 Honeylune Ridge",
		"etstneufda/4-14 Honeylune Ridge 8bit Version",
		"rmsytxvcfn/3-04 Underground Moon Caverns",
		"eyrhzdyzii/3-05 Wedding Hall",
		"yrhdluevmq/3-10 Honeylune Ridge Collapse",
		"uuphvyputj/4-15 Honeylune Ridge Collapse 8bit Version",
		"myosizlvwq/3-11 Break Free (Lead the Way)",
		"tygvsrcypg/3-28 Break Free (Lead the Way) Japanese Version",
		"jxebtfiohw/4-16 Break Free (Lead The Way) 8bit Version",
		"uekpzzpdwi/3-14 Peach's Castle",
		"abbyiwbusm/1-07 Broodals Battle",
		"mqmvchnsnm/1-12 Madam Broode Battle",
		"xjpvdqpokz/1-19 Tostarena Battle",
		"iimlllclop/1-24 Torkdrift Battle",
		"ekcgipcyuj/2-06 Mechawiggler Battle",
		"rkhkdnmpdr/2-21 Mollusque-Lanceur Battle",
		"yiyjvwgfhq/4-11 Mollusque-Lanceur Battle 8bit Version",
		"muiuvjxnlr/2-25 Cookatiel Battle",
		"dbbvephiwj/2-27 Ruined Dragon Battle",
		"fsadttoqdh/2-31 RoboBrood Battle",
		"xokypvhaue/1-30 Bowser Battle 1 ~Nimbus Arena Showdown~",
		"oogcbdgbxc/3-07 Bowser Battle 2 ~Final Battlefield~",
		"iztcgjkcgh/3-19 Run, Jump, Throw! Stage 1",
		"jxlbdyvyfq/3-20 Run, Jump, Throw! Stage 2",
		"whsinmdfms/4-08 Run, Jump, Throw! Stage 2 8bit Version",
		"fmetypzdmm/2-11 Underground Power Plant",
		"yoodphprbo/4-09 Underground Power Plant 8bit Version",
		"spcddldtkk/3-21 Caves Stage",
		"kbvhxjoihu/2-15 Ice Cave",
		"vedwodkxnf/3-22 Another World Stage",
		"eematefemx/1-16 Inside the Inverted Pyramid",
		"glwpujsiyf/4-03 Inside the Inverted Pyramid 8bit Version",
		"whflsnkwve/4-18 Projection Room Above Ground",
		"demamxkkez/4-19 Projection Room Underground",
		"qjarfdgcnr/3-23 Above the Clouds Stage",
		"howportpiu/3-01 To the Next Kingdom",
		"ngvwblxobg/3-15 Crazy Cap",
		"zhdbslwrzc/2-17 Bound Bowl GP",
		"anjcxrbyiv/3-17 RC Car Challenge",
		"iheqokvpgo/3-16 Let's Play Slots",
		"gpwirqulgq/3-18 Koopa Trace-Walking"
	]
};

for (let i = 0; i < opt.mus.smg.name.length; i++)
	fetchdb.arr1[i] = "super-mario-galaxy/" + fetchdb.arr1[i];
for (let i = opt.mus.smg.name.length; i < opt.mus.smg.name.length + 56; i++)
	fetchdb.arr1[i] = "mario-kart-8/" + fetchdb.arr1[i];
for (let i = opt.mus.smg.name.length + 56; i < opt.mus.smg.name.length + 64; i++)
	fetchdb.arr1[i] = "mario-kart-8-deluxe-booster-course-pass-wave-1/" + fetchdb.arr1[i];
for (let i = opt.mus.smg.name.length + 64; i < opt.mus.smg.name.length + 72; i++)
	fetchdb.arr1[i] = "mario-kart-8-deluxe-booster-course-pass-wave-2-switch-gamerip-2022/" + fetchdb.arr1[i];
for (let i = opt.mus.smg.name.length + 72; i < opt.mus.smg.name.length + opt.mus.mk8d.name.length; i++)
	fetchdb.arr1[i] = "mario-kart-8/" + fetchdb.arr1[i];
for (let i = opt.mus.smg.name.length + opt.mus.mk8d.name.length; i < opt.mus.smg.name.length + opt.mus.mk8d.name.length + opt.mus.smo.name1.length; i++)
	fetchdb.arr1[i] = "super-mario-odyssey-original-soundtrack/" + fetchdb.arr1[i];
for (let i = 0; i < fetchdb.arr1.length; i++)
	fetchdb.arr1[i] = "https://vgmsite.com/soundtracks/" + fetchdb.arr1[i];

var getData_arr0 = {
	ss: fetchdb.arr0.indexOf(opt.mus._sav.ss),
	param: fetchdb.arr0.indexOf(opt.mus._sav.param)
}; const getData = {
	ss: fetchdb.arr1[getData_arr0.ss],
	param: fetchdb.arr1[getData_arr0.param]
};