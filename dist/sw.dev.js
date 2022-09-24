"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* eslint-disable no-undef */
if (!self.define) {
  var e,
      s = {};

  var a = function a(_a, i) {
    return _a = new URL(_a + ".js", i).href, s[_a] || new Promise(function (s) {
      if ("document" in self) {
        var _e = document.createElement("script");

        _e.src = _a, _e.onload = s, document.head.appendChild(_e);
      } else e = _a, importScripts(_a), s();
    }).then(function () {
      var e = s[_a];
      if (!e) throw new Error("Module ".concat(_a, " didn\u2019t register its module"));
      return e;
    });
  };

  self.define = function (i, r) {
    var c = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[c]) return;
    var d = {};

    var b = function b(e) {
      return a(e, c);
    },
        o = {
      module: {
        uri: c
      },
      exports: d,
      require: b
    };

    s[c] = Promise.all(i.map(function (e) {
      return o[e] || b(e);
    })).then(function (e) {
      return r.apply(void 0, _toConsumableArray(e)), d;
    });
  };
}

define(["./workbox-08e67d2d"], function (e) {
  "use strict";

  self.addEventListener("message", function (e) {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
  }), e.precacheAndRoute([{
    url: "404.html",
    revision: "760f1f2d93f64ea662efc294c53dc455"
  }, {
    url: "assets/back.png",
    revision: "5f35f42b26abcc9483c983705c10cc1b"
  }, {
    url: "assets/background/_def.png",
    revision: "11160acac07c7aa9b71b356d38372d9b"
  }, {
    url: "assets/background/acnh_fwShow_1.jpg",
    revision: "bf3519573fb9b043f716450d9b9b5862"
  }, {
    url: "assets/background/acnh_fwShow_2.jpg",
    revision: "5701c78da020a930d96b39662c2db3c3"
  }, {
    url: "assets/background/acnh_fwShow_3.jpg",
    revision: "de60ec2201c423782ddb987e17fc1869"
  }, {
    url: "assets/background/acnh_fwShow_4.jpg",
    revision: "7debb56091fb726352183856cca7b1ea"
  }, {
    url: "assets/background/acnh_fwShow-bowser.jpg",
    revision: "f8d9a2224ed48546ff5a7242acd4d1cf"
  }, {
    url: "assets/background/acnh_fwShow-luigi_1.jpg",
    revision: "6920ffbcad5f0a16ca83712201b662a4"
  }, {
    url: "assets/background/acnh_fwShow-luigi_2.jpg",
    revision: "80aa982e813f40a5ecb18c203f88a733"
  }, {
    url: "assets/background/acnh_fwShow-mario_1.jpg",
    revision: "5079dce9e088c3ef8e319b8d697193ee"
  }, {
    url: "assets/background/acnh_fwShow-mario_2.jpg",
    revision: "71857f0342f4edaf050d1e8aa432fe21"
  }, {
    url: "assets/background/acnh_fwShow-peach+bowser.jpg",
    revision: "a000ddf74e0dad87972fcfdc733bde0b"
  }, {
    url: "assets/background/acnh_fwShow-peach+luigi.jpg",
    revision: "0e3968bc5e169b2e5dcb83480d25b198"
  }, {
    url: "assets/background/acnh_fwShow-smoMario.jpg",
    revision: "360a713e0fa30407f0e876f2823976fc"
  }, {
    url: "assets/background/acnh_fwShow-smoMoon.jpg",
    revision: "127ab666086f854fcda69e670d18e0c0"
  }, {
    url: "assets/background/acnh_fwShow-starFrag.jpg",
    revision: "5e51bd9118ccb976071dd79c94ba7c4c"
  }, {
    url: "assets/background/acnh_hhp_curlysCodespace.jpg",
    revision: "5df9d7904dcf95d5ed13efa5c02e6666"
  }, {
    url: "assets/background/acnh_hhp_reper2+wardell-moonlight.jpg",
    revision: "df4e77836698be21e8cedd58c0bb48fa"
  }, {
    url: "assets/background/acnh_hhp_skyhighCityApartment.jpg",
    revision: "2e3cde52607bf16961dbd1dfc09db0b1"
  }, {
    url: "assets/background/bf_crispClimbCastle-lighthouse.jpg",
    revision: "10a7c2fe251b646775fb4619c4c70729"
  }, {
    url: "assets/background/bf_furyBowser-appearing.jpg",
    revision: "fb7b3ebf5c4e1b773fc3528feb740a04"
  }, {
    url: "assets/background/bf_furyBowser-shell-spinning_1.jpg",
    revision: "1c7c579eee63b79806ff4039ce3e0ef6"
  }, {
    url: "assets/background/bf_furyBowser-shell-spinning_2.jpg",
    revision: "6dd96667a0217f9974156fd6e8cee836"
  }, {
    url: "assets/background/bf_furyMode_1.jpg",
    revision: "71b1e36bd57c60ee25d54baede00f5ac"
  }, {
    url: "assets/background/bf_furyMode_2.jpg",
    revision: "e44bb0223b272fd86943cabab584fa1d"
  }, {
    url: "assets/background/bf_furyMode_3.jpg",
    revision: "cea80a8d66d008a0051606b91b4d2f70"
  }, {
    url: "assets/background/bf_furyMode_4.jpg",
    revision: "9b0c8c84fae196f6b0ca3c81cbd32091"
  }, {
    url: "assets/background/bf_furyMode_5.jpg",
    revision: "c3a430956853ac7b69ced2cc7280f282"
  }, {
    url: "assets/background/bf_furyMode_6.jpg",
    revision: "e498855fd5a74b044ef97de3cb6a9012"
  }, {
    url: "assets/background/bf_furyMode_7.jpg",
    revision: "acce66973d62d1704caef139932d9dc9"
  }, {
    url: "assets/background/bf_furyMode_furyBowser-glowing.jpg",
    revision: "294e6a26a3de414ca6a81aca7bea72bb"
  }, {
    url: "assets/background/bf_gigabell.jpg",
    revision: "771fa434a871218043da78ce9f9656e0"
  }, {
    url: "assets/background/bf_scamperShores-lighthouse.jpg",
    revision: "50fc6a4ad172f6f9cdf242ccb6d65bd5"
  }, {
    url: "assets/background/sm3dw_courseClear_1.jpg",
    revision: "5e96b70cb455c1489ac2018b559e5728"
  }, {
    url: "assets/background/sm3dw_courseClear_2.jpg",
    revision: "b215b61e643949f7fe47082471b9ef45"
  }, {
    url: "assets/background/sm3dw_courseClear_3.jpg",
    revision: "5c1c117aca93b756755a237f74c311ea"
  }, {
    url: "assets/background/sm3dw_underwater-clearPipes.jpg",
    revision: "9bc28d1991f1f8197715d1bfda5cc4e3"
  }, {
    url: "assets/background/smg_battlerockGalaxy_1.jpg",
    revision: "353d7cb6c8e459574b1116a1ad2e7dd9"
  }, {
    url: "assets/background/smg_battlerockGalaxy_2.jpg",
    revision: "1aeccd7e122797a2e3406af1bff2b5d2"
  }, {
    url: "assets/background/smg_battlerockGalaxy_3.jpg",
    revision: "583aac6ea8c75c84882deefee83e389d"
  }, {
    url: "assets/background/smg_battlerockGalaxy_4.jpg",
    revision: "e763d9c76c66c92d59286390968831ed"
  }, {
    url: "assets/background/smg_battlerockGalaxy_5.jpg",
    revision: "84adde1e851077e8042699e385faaec0"
  }, {
    url: "assets/background/smg_battlerockGalaxy_6.jpg",
    revision: "9d3ac81fcb2c3379dab0ab27d183c058"
  }, {
    url: "assets/background/smg_fieryStronghold-bowser.jpg",
    revision: "5d20b71044e36e367c91ec8f78d2c694"
  }, {
    url: "assets/background/smg_ghostlyGalaxy.jpg",
    revision: "1d419159992413124ec987c7cc93ccd8"
  }, {
    url: "assets/background/smg_rosalinaStorytime.jpg",
    revision: "c0e260242c6c392baf16b773d61cf8b6"
  }, {
    url: "assets/background/smo_bonneton-peach.jpg",
    revision: "8db80a9006de5fef2d500e757de17c9f"
  }, {
    url: "assets/background/smo_bowserBattle1_1.jpg",
    revision: "412d6682d58724179f88b3690e77d2c1"
  }, {
    url: "assets/background/smo_bowserBattle1_2.jpg",
    revision: "a3088cee7cf2b5120d4c0d3bf5bf9872"
  }, {
    url: "assets/background/smo_bowserBattle1_3.jpg",
    revision: "dbe371213bcf2ded356b85ba2efde1e1"
  }, {
    url: "assets/background/smo_honeyluneRidge-earth.jpg",
    revision: "fb145078e1a2e2885644eddf371de0cf"
  }, {
    url: "assets/background/smo_honeyluneRidge-starBit.jpg",
    revision: "53a173ceb84f0952216c435cc40943ab"
  }, {
    url: "assets/background/smo_lakeLamode-binoculars--sky.jpg",
    revision: "4594a52cb04326bbd2428a61ebe14585"
  }, {
    url: "assets/background/smo_map-moonKingdom.jpg",
    revision: "760ad18230bdc5672771179d93831b2e"
  }, {
    url: "assets/background/smo_mountVolbono-crazyCap.jpg",
    revision: "2712876c98122856dc18204d717b8ff5"
  }, {
    url: "assets/background/smo_mushroomKingdom-goombaTower.jpg",
    revision: "e1999003498998fc47f40dfa689f6202"
  }, {
    url: "assets/background/smo_mushroomKingdom-tailTree.jpg",
    revision: "2b5b92ff7e8e570066dbbe339aab02a9"
  }, {
    url: "assets/background/smo_ndc-cityHall.jpg",
    revision: "7fb7211b86a99be1b34f5a4346a1997e"
  }, {
    url: "assets/background/smo_ndc-fest--start.jpg",
    revision: "05991c71862bf1ed72746ac3658c7bf9"
  }, {
    url: "assets/background/smo_peachsCastle-throne-mario.jpg",
    revision: "ed8d1c63154f851d3e7688fda9506614"
  }, {
    url: "assets/background/smp_~yeah~.jpg",
    revision: "763d0bf95c6845382371446fa6968c17"
  }, {
    url: "assets/background/smp_actionHighlight.jpg",
    revision: "744dccf70ccf0f89e3bc623bc089dac1"
  }, {
    url: "assets/grass/_def.png",
    revision: "3deafa084bf59c0fc6514230057de9bd"
  }, {
    url: "assets/grass/fall1.png",
    revision: "2233fbe1795308a4b8e133ae807fc88a"
  }, {
    url: "assets/grass/fall2.png",
    revision: "95a632f01fd59281884ac81498d7b9ef"
  }, {
    url: "assets/grass/fall3.png",
    revision: "aabbade97c628b4a3b4e0e6e25b6b250"
  }, {
    url: "assets/grass/fall4.png",
    revision: "a6cdaf155879c195fbfda9cbe5a21973"
  }, {
    url: "assets/grass/fall5.png",
    revision: "11d43a5aae686a6829dcb3eec07d0a3a"
  }, {
    url: "assets/grass/fall6.png",
    revision: "10254acd7b41989faa523d25cf9dc410"
  }, {
    url: "assets/grass/spring.png",
    revision: "b745033aed0886450fd1171a35d6f93d"
  }, {
    url: "assets/grass/summer1.png",
    revision: "a2b959ef0d7d8fcad090805a068f3f7f"
  }, {
    url: "assets/grass/summer2.png",
    revision: "552e3822431c56b72820bb5f4eb8ac52"
  }, {
    url: "assets/grass/winter.png",
    revision: "d5f681bdb1d981102be6ae734bbb57c0"
  }, {
    url: "assets/main.css",
    revision: "f906118bfa738a8b994f3b1e7d9cc144"
  }, {
    url: "assets/music/3DS DK Jungle.mp3",
    revision: "063d3409a746fb0698c24d378c553058"
  }, {
    url: "assets/music/3DS Music Park.mp3",
    revision: "ea7b070db99354897b0e97a566e56e85"
  }, {
    url: "assets/music/3DS Neo Bowser City.mp3",
    revision: "c73ff7cf0a8ff4be7cc530e1362cecb2"
  }, {
    url: "assets/music/3DS Wuhu Town.mp3",
    revision: "f5888046b16d3d6b3d8dbc6e0dda5d73"
  }, {
    url: "assets/music/Above the Clouds Stage.mp3",
    revision: "05a0f3c58f5ab22cc882be23bfe81e8d"
  }, {
    url: "assets/music/Agent K.K..mp3",
    revision: "87275c44e85eeee47f04596b9381533b"
  }, {
    url: "assets/music/Airship Armada.mp3",
    revision: "82d43eaf719d9b45fc27e149e52d5b84"
  }, {
    url: "assets/music/Animal Crossing (Fall).mp3",
    revision: "a3172feffb4bc8b6c25c4c6f70cd4037"
  }, {
    url: "assets/music/Animal Crossing (Spring).mp3",
    revision: "d451d189727ab2e03daf937e2542a1a8"
  }, {
    url: "assets/music/Animal Crossing (Summer).mp3",
    revision: "0d824a27fa4f76f38b415e1249336590"
  }, {
    url: "assets/music/Animal Crossing (Winter).mp3",
    revision: "ad535522b779b0b17bce738b0a87cf59"
  }, {
    url: "assets/music/Animal Crossing Results.mp3",
    revision: "99fa5c8e624d018dd939d79a6c9c8f41"
  }, {
    url: "assets/music/Attack of the Airships.mp3",
    revision: "4bfc5bf20eb06632d6ee72c13983c65f"
  }, {
    url: "assets/music/Band Performance (Super Mario Brothers Above Ground).mp3",
    revision: "268984a7866d0062d3bc211b6bde227e"
  }, {
    url: "assets/music/Battlerock Galaxy.mp3",
    revision: "4c69d139bfdccd07cc458ccabe8bf203"
  }, {
    url: "assets/music/Beach Bowl Galaxy - Undersea.mp3",
    revision: "312b9a5cd03a37fb9abcb6052fbfa48c"
  }, {
    url: "assets/music/Beach Bowl Galaxy.mp3",
    revision: "8a0c28740aac4646f6becb66196d2cb8"
  }, {
    url: "assets/music/Birth.mp3",
    revision: "0a855dcdee67b6bd5acb8f0cecd2b7fb"
  }, {
    url: "assets/music/Blue Sky Athletic.mp3",
    revision: "19aca542ae08125de240c61168be9ea3"
  }, {
    url: "assets/music/Bonneton.mp3",
    revision: "4986c4824fba6e9b1be6203f3baddd65"
  }, {
    url: "assets/music/Bowser Castle Courtyard.mp3",
    revision: "186c743a637e9f51aaf7e253d5e8d235"
  }, {
    url: "assets/music/Bowser Castle.mp3",
    revision: "ed325f3416c0349f29a3a07983b9cda3"
  }, {
    url: "assets/music/Break Free (Lead the Way).mp3",
    revision: "87383e8d1ba8e4d37e7e9ff2bfc70802"
  }, {
    url: "assets/music/Bubblaine Underwater.mp3",
    revision: "ec3059e36dae5323f36ed0088ad9821a"
  }, {
    url: "assets/music/Bubblaine.mp3",
    revision: "1ec8c1a1cf4bc727103114b8be6542dc"
  }, {
    url: "assets/music/Bubblegum K.K..mp3",
    revision: "b4be95f81df9614382ead42c105f820c"
  }, {
    url: "assets/music/Buoy Base Galaxy - Undersea.mp3",
    revision: "74f3a4f17a4e87d91ca233c91f2c05d4"
  }, {
    url: "assets/music/Buoy Base Galaxy.mp3",
    revision: "44a75d74ff28a71c84e35dbbb659d10a"
  }, {
    url: "assets/music/Cloudtop Cruise.mp3",
    revision: "8fb1fafee79002f7a3b35c1556390aea"
  }, {
    url: "assets/music/Deep Dark Galaxy.mp3",
    revision: "3571394e08486aee6316122f6ab7d9b6"
  }, {
    url: "assets/music/Drip Drop Galaxy.mp3",
    revision: "2d7fb57db79f0b274394f0deb11901a0"
  }, {
    url: "assets/music/DS Cheep Cheep Beach.mp3",
    revision: "b2127c324ddfabcb6a2bfccd0dfbac23"
  }, {
    url: "assets/music/DS Shroom Ridge.mp3",
    revision: "7127dfe622b57d7b761fb0bc278b6085"
  }, {
    url: "assets/music/DS Tick-Tock Clock.mp3",
    revision: "a9df218676ac10681eff4d749005a455"
  }, {
    url: "assets/music/DS Wario Stadium.mp3",
    revision: "4be5588ede5b1966c30d758b8a2fcbd4"
  }, {
    url: "assets/music/Dusty Dune Galaxy.mp3",
    revision: "070e1fe14611a824e4a9c1e9f2215c48"
  }, {
    url: "assets/music/Electrodrome.mp3",
    revision: "8224c0ffa529219a84fba90e5add1430"
  }, {
    url: "assets/music/Enter Bowser Jr.!.mp3",
    revision: "213e379f8cb5afb810b6e3c0f0328073"
  }, {
    url: "assets/music/Enter the Galaxy.mp3",
    revision: "0b4cd0b7215a52c45755a0392e4d0ded"
  }, {
    url: "assets/music/Final Battle with Bowser.mp3",
    revision: "f088e5ecff4a41ba29082729bf0135dd"
  }, {
    url: "assets/music/Forgotten Isle.mp3",
    revision: "db42daad9b92618815881bb8951a337f"
  }, {
    url: "assets/music/Fossil Falls.mp3",
    revision: "7611b982088704bd7d52d9f9ae4596a2"
  }, {
    url: "assets/music/Gateway Galaxy.mp3",
    revision: "a89fc5dee7c22888bc60dd9054b75137"
  }, {
    url: "assets/music/GBA Sky Garden.mp3",
    revision: "d6684f6a3c843154701eafa08257e080"
  }, {
    url: "assets/music/GCN Luigi's Mansion.mp3",
    revision: "aa12fadcbcf18d6376e800e18be2b4b8"
  }, {
    url: "assets/music/GCN Sherbet Land.mp3",
    revision: "d944b04681ff8badd873b9de0ebf1ab8"
  }, {
    url: "assets/music/Go K.K. Rider!.mp3",
    revision: "b233fd86d1c1f519bf16a0a6daf03930"
  }, {
    url: "assets/music/Good Egg Galaxy.mp3",
    revision: "7686dbafaabf651a4c6d6edd82e9ad6e"
  }, {
    url: "assets/music/Gusty Garden Galaxy.mp3",
    revision: "215bd45523d9dd8337c7d56d359f7037"
  }, {
    url: "assets/music/Heavy Metal Mecha-Bowser.mp3",
    revision: "ac1b47e25c98754798c69de8bbe7e448"
  }, {
    url: "assets/music/Honeylune Ridge Collapse.mp3",
    revision: "6b11e2cec9afd0ff9580b3e88f512aad"
  }, {
    url: "assets/music/Honeylune Ridge.mp3",
    revision: "049f58526b0c014b73333460f7ba64fe"
  }, {
    url: "assets/music/Hyrule Circuit.mp3",
    revision: "5a729ad908ae777a5d2fab3551f719a5"
  }, {
    url: "assets/music/Ice Cave.mp3",
    revision: "19f4928e93fca39af962e23b2abe4404"
  }, {
    url: "assets/music/Ice Ice Outpost.mp3",
    revision: "5ee2a79ee0394e9858f325ae56797e10"
  }, {
    url: "assets/music/Jump Up, Super Star! NDC Festival Edition.mp3",
    revision: "8144537750a270bc0b32a2eb26528c71"
  }, {
    url: "assets/music/Jump Up, Super Star!.mp3",
    revision: "0a67211a8651d94a93e140fdeed3060e"
  }, {
    url: "assets/music/K.K. Dixie.mp3",
    revision: "0f33e939596c80f86d79a98486e6eee0"
  }, {
    url: "assets/music/K.K. Jazz.mp3",
    revision: "aa8e6a4800c2ffff418dee50a1267115"
  }, {
    url: "assets/music/King Bowser.mp3",
    revision: "6ae87222d5b75bb15ef45cee2dc58121"
  }, {
    url: "assets/music/Lake Lamode Above Ground.mp3",
    revision: "a055ffc55c6a0a5d09031d4e448df3f0"
  }, {
    url: "assets/music/Lake Lamode Underwater Passage.mp3",
    revision: "b32a6fc48dfbf7bfdfadf9aa47280103"
  }, {
    url: "assets/music/Lake Lamode.mp3",
    revision: "84f2f34ff29cb5706cac6afbb28c7d5a"
  }, {
    url: "assets/music/Lunar Colony.mp3",
    revision: "26861b891d11d24e462b350ed1fbd4f7"
  }, {
    url: "assets/music/Mario Circuit.mp3",
    revision: "547736eca1c964cc41e8644e2cb05cd3"
  }, {
    url: "assets/music/Mario Kart 8.mp3",
    revision: "20f57c2d71d1eb7d2aea743dafd186b5"
  }, {
    url: "assets/music/Mario Kart Stadium.mp3",
    revision: "b9806c91f08af110b8a6479595898fd6"
  }, {
    url: "assets/music/Melty Molten Galaxy.mp3",
    revision: "1e4e3bbfae28c68d271b23d459b66b6a"
  }, {
    url: "assets/music/Mount Volbono.mp3",
    revision: "6d195c78b11aa30ff4ad4d22e46a85d0"
  }, {
    url: "assets/music/Mount Wario.mp3",
    revision: "e9e95fbd98fcba4a3026314f58e13f4a"
  }, {
    url: "assets/music/Mute City.mp3",
    revision: "748113ed5c3ee106ffd07b5cb061bda2"
  }, {
    url: "assets/music/N64 Choco Mountain.mp3",
    revision: "b80916848005feb2a98be85677ee6e59"
  }, {
    url: "assets/music/N64 Rainbow Road.mp3",
    revision: "2839f62c31acd1cf4ad22569a2c92987"
  }, {
    url: "assets/music/N64 Royal Raceway.mp3",
    revision: "e7d79397c4715fadeb39d35fdb631cf1"
  }, {
    url: "assets/music/N64 Toad's Turnpike.mp3",
    revision: "611b71a0317e63ffe189e1b7e25af803"
  }, {
    url: "assets/music/New Donk City Night 1.mp3",
    revision: "08a3aa0b2657de02175d0b9fe709f64e"
  }, {
    url: "assets/music/New Donk City Night 2 ~City Hall~.mp3",
    revision: "db1036765ff1f5808e5f7c8497adba7a"
  }, {
    url: "assets/music/New Donk City.mp3",
    revision: "2b313bef15b98e19f66cfd6959abb17a"
  }, {
    url: "assets/music/New Years Event - 10 Minutes Left.mp3",
    revision: "4ab78f4ed2bde123ff6bf49dbffd8655"
  }, {
    url: "assets/music/New Years Event - 30 Minutes Left.mp3",
    revision: "7ff94dbbc78d1ce11d0bc0c3449d89c5"
  }, {
    url: "assets/music/New Years Event - 5 Minutes Left.mp3",
    revision: "b8bcc03652eb8a55f5af45e21d0f68fe"
  }, {
    url: "assets/music/New Years Event - New Years Eve! 200 a.m..mp3",
    revision: "4817af01d1bf12910c4f218fdf8815d8"
  }, {
    url: "assets/music/New Years Event - New Years Eve! Midnight.mp3",
    revision: "fe63851dfd65bb2495c0ae869ff70b4f"
  }, {
    url: "assets/music/New Years Event - One Hour Left.mp3",
    revision: "487b4b40e83661f3cd75faf6ef942530"
  }, {
    url: "assets/music/Overture.mp3",
    revision: "7f5dc3399a7ff5989de5c1aa84a247d0"
  }, {
    url: "assets/music/Peach's Castle.mp3",
    revision: "cc1c1202c8c12dcaa95874dff18464d8"
  }, {
    url: "assets/music/Peronza Plaza.mp3",
    revision: "b8becda5d297081c6c145d16de2d4b65"
  }, {
    url: "assets/music/Poolside Rest.mp3",
    revision: "be5341ffcdc7bd735661da6b69e850d1"
  }, {
    url: "assets/music/Purple Comet.mp3",
    revision: "a4d9bbe00cf57e2099cbf0cfb010edc3"
  }, {
    url: "assets/music/Rainbow Road.mp3",
    revision: "cbf6aa1d9a92a47b17bf900b6be244e0"
  }, {
    url: "assets/music/Shiveria Town.mp3",
    revision: "71ede2dd737d1ae18b18fd6482024d6f"
  }, {
    url: "assets/music/Shy Guy Falls.mp3",
    revision: "2d8b720c946a82a947a32f9f79250a08"
  }, {
    url: "assets/music/SNES Rainbow Road.mp3",
    revision: "f65903d678dfcb7d9cead5502647e4dd"
  }, {
    url: "assets/music/Snowline Circuit.mp3",
    revision: "249ea4fef5ed9a0be7e42ca6500d792f"
  }, {
    url: "assets/music/Space Athletic.mp3",
    revision: "96bc003d17f5818e2ff728473389ae0e"
  }, {
    url: "assets/music/Space Fantasy.mp3",
    revision: "99301218de74c45d3ebbb26efd9a050f"
  }, {
    url: "assets/music/Space Junk Road.mp3",
    revision: "b22158cf8eba3058320d8dcd75e020b0"
  }, {
    url: "assets/music/Space K.K..mp3",
    revision: "e355f8c54fcc40cbeac2acf8f19ae228"
  }, {
    url: "assets/music/Steam Gardens.mp3",
    revision: "b52c21b8fb9694e7e403635c1e4a6ea9"
  }, {
    url: "assets/music/Sunshine Airport.mp3",
    revision: "ab783fc868a4849b6e8c7ab1e9174300"
  }, {
    url: "assets/music/Super Bell Subway.mp3",
    revision: "20cfb714286af788bfdf13f2f39ee6f3"
  }, {
    url: "assets/music/Super Mario 2007.mp3",
    revision: "6f6718495692acbd4056a212c518b909"
  }, {
    url: "assets/music/Super Mario Galaxy -Credits Theme-.mp3",
    revision: "9cdded0600ca45a1244fe4446b18aed4"
  }, {
    url: "assets/music/Sweet Sweet Canyon.mp3",
    revision: "f5b061951e82e2dee8b6c89335686a82"
  }, {
    url: "assets/music/The Fiery Stronghold.mp3",
    revision: "8dd7fdd744f2f0333c7ca323e8b96885"
  }, {
    url: "assets/music/The Galaxy Reactor.mp3",
    revision: "4932ec31a577c4853345e12e169c061e"
  }, {
    url: "assets/music/The Honeyhive.mp3",
    revision: "19e81ba182cbd4a7b49b87ce83db8457"
  }, {
    url: "assets/music/The Star Festival.mp3",
    revision: "1f976547d41e2e916d6c7cdbf0f3aff7"
  }, {
    url: "assets/music/Thwomp Ruins.mp3",
    revision: "8ece7a4a21fb5ec280236623c87ac4bd"
  }, {
    url: "assets/music/Toad Harbor.mp3",
    revision: "59ded3f65e1f22c96be74b637e2b9fbd"
  }, {
    url: "assets/music/Top-Hat Tower.mp3",
    revision: "445c2e4fa46b82e6db2fe532b325c95d"
  }, {
    url: "assets/music/Tostarena Night.mp3",
    revision: "261b6c2d4a89f4e553b010945622d558"
  }, {
    url: "assets/music/Tostarena Ruins.mp3",
    revision: "e2ae471f9bfb9f64bf86fde788101e06"
  }, {
    url: "assets/music/Tostarena Town.mp3",
    revision: "4f30d0950f1e59e8e7d2bc6192776279"
  }, {
    url: "assets/music/Tour Ninja Hideaway.mp3",
    revision: "cd84bc713d3ab5568237e1d62b8159ab"
  }, {
    url: "assets/music/Tour Paris Promenade.mp3",
    revision: "0f17443d3d63c4508e95d753f8df867d"
  }, {
    url: "assets/music/Tour Tokyo Blur.mp3",
    revision: "1719016670591425b214f668c8e842e8"
  }, {
    url: "assets/music/Twisted Mansion.mp3",
    revision: "ff10434fb93f5c090a0faea8da88f4c8"
  }, {
    url: "assets/music/Underground Moon Caverns.mp3",
    revision: "cabf1ecb73509cfbfed3a9889c391592"
  }, {
    url: "assets/music/Underground Power Plant.mp3",
    revision: "655ff37cf4dc2342350b7c0b3f758b0e"
  }, {
    url: "assets/music/Waltz of the Boos.mp3",
    revision: "0f5d02188ddb86b1c4ff809eb143958e"
  }, {
    url: "assets/music/Water Park.mp3",
    revision: "1522721dc9f19d5bdf428bf33b489be8"
  }, {
    url: "assets/music/Wedding Hall.mp3",
    revision: "1231a43c0b3014a297a6cc2724418b00"
  }, {
    url: "assets/music/Wii Coconut Mall.mp3",
    revision: "5be36d8c728d687eabb8766dc4f73759"
  }, {
    url: "assets/music/Wii Grumble Volcano.mp3",
    revision: "25df89ccc53bd44f3779d910ff92fa23"
  }, {
    url: "assets/music/Wii Moo Moo Meadows.mp3",
    revision: "cdefc4933d04fdef616ad8741b716ce9"
  }, {
    url: "assets/music/Wii Wario's Gold Mine.mp3",
    revision: "f939fef8cfb922f256a1ac009d227138"
  }, {
    url: "assets/music/Wild World.mp3",
    revision: "45646eebf3ab2b8409fabf9608da26fb"
  }, {
    url: "assets/next.png",
    revision: "2accb92a5b50cfa1f8061da13b638269"
  }, {
    url: "assets/social-logos/autocode.png",
    revision: "3ecb1ff9fb3dda625b1f2fdda8b06058"
  }, {
    url: "assets/social-logos/dodocodes.png",
    revision: "6bc1e2950efcb8fc649c5e980f1ff51f"
  }, {
    url: "assets/social-logos/nookazon.png",
    revision: "742107188c7cb480f6f8437334aaa02f"
  }, {
    url: "assets/social-logos/youtube.svg",
    revision: "3deb922e4028cc0a16ea9ea732cd7b88"
  }, {
    url: "assets/SuperMario256.ttf",
    revision: "6c02f15fdbc9dd7c482b52b06d8e0a6c"
  }, {
    url: "dist/sw.dev.js",
    revision: "4a39e4c4c6533ddc974f3be264fdc0ef"
  }, {
    url: "dist/workbox-08e67d2d.dev.js",
    revision: "ba8c9c53938836380306742b55cd38e7"
  }, {
    url: "dist/workbox-config.dev.js",
    revision: "b5f04e6ef5be7d0734f2511e233171e7"
  }, {
    url: "favicon.ico",
    revision: "447b533c8ff4b3f40e494f03ab82acbb"
  }, {
    url: "icons/android-chrome-192x192.png",
    revision: "5c2aeb6a989a4290935d6deda4e57b17"
  }, {
    url: "icons/android-chrome-512x512.png",
    revision: "9562cd0f2224d14f1125512f97bc7132"
  }, {
    url: "icons/apple-touch-icon.png",
    revision: "160e38804f887c26619eb896406c96ad"
  }, {
    url: "icons/favicon-16x16.png",
    revision: "08e7286292eb62874ac3010f56a39aab"
  }, {
    url: "icons/favicon-32x32.png",
    revision: "1a9fdb87c6cee61954e13a9d6dcb659c"
  }, {
    url: "index.html",
    revision: "bdeeedd0b63c60d31e630906a4a5419b"
  }, {
    url: "keybinds.html",
    revision: "48c601123b388faa3090815fbe19ebbd"
  }, {
    url: "links.html",
    revision: "37439fffbe854b1223db40b49ab135f7"
  }, {
    url: "logo.png",
    revision: "cedc0c705a8223380dda642b7acea8c1"
  }, {
    url: "meta.png",
    revision: "11160acac07c7aa9b71b356d38372d9b"
  }, {
    url: "scripts/app.js",
    revision: "ca67b1a404605a0b5f541cc50605180b"
  }, {
    url: "scripts/audctrls.js",
    revision: "0da2dbb559b6755712f30aaa930b2429"
  }, {
    url: "scripts/back.js",
    revision: "14168782885bba46fe536fd83c12a74e"
  }, {
    url: "scripts/copyBtn.js",
    revision: "8ecfb7d103cf3e792449a80e64863deb"
  }, {
    url: "scripts/cr.js",
    revision: "cc99dee6b7e07e95dd150fa3dcf2c1be"
  }, {
    url: "scripts/dist/app.dev.js",
    revision: "9723c2cbfc2eb399cdabdf2e452e8c77"
  }, {
    url: "scripts/dist/audctrls.dev.js",
    revision: "6c9d51843f0828ae907a9ee1ec8853ea"
  }, {
    url: "scripts/dist/back.dev.js",
    revision: "5ba5ba65c975bb8d8e13a381ee2c586a"
  }, {
    url: "scripts/dist/copyBtn.dev.js",
    revision: "857818e8364a7c854a26e1210dab1aeb"
  }, {
    url: "scripts/dist/cr.dev.js",
    revision: "ebcd0b9c62ea9f965c862923ad6e4d08"
  }, {
    url: "scripts/dist/footer.dev.js",
    revision: "0d2b84c1ee17c077139948498c50e3e6"
  }, {
    url: "scripts/dist/iconify.min.dev.js",
    revision: "51a8670af963ea424e4fa8064d7b7d5f"
  }, {
    url: "scripts/dist/jquery.min.dev.js",
    revision: "95211e01252b3c3369554b064907d140"
  }, {
    url: "scripts/dist/kb.dev.js",
    revision: "30861b3c3fa80b112a029b9e3284b805"
  }, {
    url: "scripts/dist/sw-installer.dev.js",
    revision: "3dd31a43aa0efb8644cb941059288fda"
  }, {
    url: "scripts/footer.js",
    revision: "dd01b49767686e4d007dd8174fedf102"
  }, {
    url: "scripts/iconify.min.js",
    revision: "745c752804f5896ff4f06a0f4a1922e1"
  }, {
    url: "scripts/jquery.min.js",
    revision: "c1448034960f459c74b2660847a38fa9"
  }, {
    url: "scripts/kb.js",
    revision: "50609ae17be03f0057d1d34e20a37575"
  }, {
    url: "scripts/sw-installer.js",
    revision: "068ae058161417c768c1c4f0862be292"
  }, {
    url: "site.webmanifest",
    revision: "3ec78d1f196ba4b1fbad1414d292e908"
  }, {
    url: "software.html",
    revision: "b47bc62b7121e1f656cc637db7f0ffe5"
  }], {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/]
  });
});