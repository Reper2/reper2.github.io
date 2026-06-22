import { globalTheme } from "../themes";
import SavUtils from "../core/storage";
import { isLocalhost } from "../core/";
import { generateStarbitShower, constructStarbitScene } from "../starbits/";

import { EggState } from "./interfaces";
import { startCompSeq } from "./comp-seq";
import { getParsedState, resolvePath, sha256 } from "./utils";
import { mountLocal3DBubble } from "./bubble";
import vault from "./vault";

const THEME_ASSETS = {
  alt: {
    stylesheet: "/assets/alt-theme.css",
    boxSrc: "/assets/alt-theme/chicken.png",
    boxAlt: "Egg - Hidden Chicken Box",
    crackedSrc: "/assets/alt-theme/bird-egg.png",
    crackedAlt: "Egg - Cracked Bird Egg",
    sfxKorok: "/assets/alt-theme/korok-appears.mp3",
    sfxFanfare: "/assets/alt-theme/shrine_fanfare.mp3",
    bgImage: "/assets/alt-theme/chicken.png"
  },
  original: {
    stylesheet: "/assets/original-theme.css",
    boxSrc: "/images/vecteezy_bubble.png",         // The bubble acts as the "cage" block!
    boxAlt: "Egg - Bubble Cage",
    crackedSrc: "/images/moon.png",                // The moon is the prize trapped inside!
    crackedAlt: "Egg - Revealed Moon",
    sfxKorok: "",
    sfxFanfare: "",
    bgImage: "/images/moon.png"
  }
};

const GLTF_MODEL_URL = "/assets/starbit.gltf";
const BIN_PAYLOAD_URL = "/assets/egg-payload.bin";

// Deterministic Strategy Lookup Anchor
const baseThemeCheck = globalTheme.ls || globalTheme.sp;
const activeThemeContext = (baseThemeCheck === "original") ? "original" : "alt";

// Update page style based on saved theme preference.
if (activeThemeContext === "alt") {
  const existingLink = document.getElementById("theme-link") as HTMLLinkElement | null;
  if (existingLink && existingLink.disabled === false) {
    existingLink.href = THEME_ASSETS.alt.stylesheet;
    console.warn("alt theme detected. Stylesheet link updated.");
  } else {
    console.warn("alt theme detected but no existing link found. Injecting new stylesheet link.");
    const link = document.createElement("link");
    link.id = "theme-link";
    link.rel = "stylesheet";
    link.href = THEME_ASSETS.alt.stylesheet;
    document.head.appendChild(link);
  }
} else if (!globalTheme.ls && !globalTheme.sp) {
  globalTheme.ls = "alt";
  console.info("No theme preference found. Defaulting to alt theme.");
}

export const STORAGE_KEY = "eggs";
export const TOTAL_EGGS = 30;

let payloadIv: BufferSource | null = null;
let payloadData: BufferSource | null = null;

// 1. Maintain isolated, uninstantiated pointers outside the scope definition
let korokInstance: HTMLAudioElement | null = null;
let fanfareInstance: HTMLAudioElement | null = null;

const sfx = {
  playInstant(effect: 'korokYahaha' | 'shrineFanfare') {
    // 2. STAGE 1 GUARD: Halt immediately before parsing path mappings or constructing elements
    if (!isLocalhost) return;

    // 3. LAZY LOAD: Construct the individual browser Audio nodes only when explicitly requested
    if (effect === 'korokYahaha') {
      if (!korokInstance && THEME_ASSETS.alt.sfxKorok) {
        korokInstance = new Audio(THEME_ASSETS.alt.sfxKorok);
      }

      if (korokInstance) {
        this.executePlayback(korokInstance);
      }
    }

    else if (effect === 'shrineFanfare') {
      if (!fanfareInstance && THEME_ASSETS.alt.sfxFanfare) {
        fanfareInstance = new Audio(THEME_ASSETS.alt.sfxFanfare);
      }

      if (fanfareInstance) {
        this.executePlayback(fanfareInstance);
      }
    }
  },

  // Helper method to keep duplicate playback properties dry and legible
  executePlayback(audio: HTMLAudioElement) {
    if (!audio.src) return;
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(e => console.warn("Audio deferred by browser context:", e));
  }
};

/**
 * 🎨 Bundled Stylesheet Object for the dynamic chicken swarm layout
 */
function injectChickenStyles(): void {
  if (document.getElementById("chicken-animation-styles")) return;

  const styleEl = document.createElement("style");
  styleEl.id = "chicken-animation-styles";
  styleEl.textContent = `
    .chicken-swarm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    .chicken-sprite {
      position: absolute;
      left: 50vw;
      top: 50vh;
      width: 64px;
      height: 64px;
      background-image: url('${THEME_ASSETS.alt.bgImage}');
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0;
      will-change: transform, opacity;
      animation: chicken-ricochet 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes chicken-ricochet {
      0% { transform: translate(var(--startX), var(--startY)) scale(0.7); opacity: 0; }
      10% { opacity: 1; }
      45% { transform: translate(var(--midX), var(--midY)) scale(1.1); opacity: 1; }
      46% { transform: translate(var(--midX), var(--midY)) scale(1.1) scaleX(var(--flipX)); }
      90% { opacity: 1; }
      100% { transform: translate(var(--endX), var(--endY)) scale(0.6) scaleX(var(--flipX)); opacity: 0; }
    }
  `;
  document.head.appendChild(styleEl);
}

/**
 * 🐔 Spawns a synchronised attack wave of 20 chickens moving frantically across the view.
 */
function triggerChickenAttack(): void {
  injectChickenStyles();

  const overlay = document.createElement("div");
  overlay.className = "chicken-swarm-overlay";
  document.body.appendChild(overlay);

  const TOTAL_CHICKENS = 20;

  for (let i = 0; i < TOTAL_CHICKENS; i++) {
    const chicken = document.createElement("div");
    chicken.className = "chicken-sprite";

    const incomingAngle = Math.random() * Math.PI * 2;
    const screenRadius = Math.max(window.innerWidth, window.innerHeight) * 0.8;

    const targetBox = 120;
    const midX = (Math.random() - 0.5) * targetBox;
    const midY = (Math.random() - 0.5) * targetBox;

    const startX = Math.cos(incomingAngle) * screenRadius + midX;
    const startY = Math.sin(incomingAngle) * screenRadius + midY;

    const bounceDeviation = Math.PI * 0.5 + Math.random() * Math.PI;
    const outgoingAngle = incomingAngle + bounceDeviation;

    const endX = Math.cos(outgoingAngle) * screenRadius + midX;
    const endY = Math.sin(outgoingAngle) * screenRadius + midY;

    const entryGoingLeft = midX < startX;
    const exitGoingLeft = endX < midX;
    let postBounceFlip = (entryGoingLeft !== exitGoingLeft) ? -1 : 1;

    chicken.style.setProperty("--startX", `${startX}px`);
    chicken.style.setProperty("--startY", `${startY}px`);
    chicken.style.setProperty("--midX", `${midX}px`);
    chicken.style.setProperty("--midY", `${midY}px`);
    chicken.style.setProperty("--endX", `${endX}px`);
    chicken.style.setProperty("--endY", `${endY}px`);
    chicken.style.setProperty("--flipX", `${postBounceFlip}`);

    if (endX < startX) {
      chicken.style.transform = "scaleX(-1)";
    }

    const dynamicDelay = Math.random() * 4.5;
    const dynamicDuration = 2.5 + Math.random() * 1.0;

    chicken.style.animationDelay = `${dynamicDelay}s`;
    chicken.style.animationDuration = `${dynamicDuration}s`;

    overlay.appendChild(chicken);
  }

  setTimeout(() => {
    overlay.remove();
    console.log("🐔 Staggered Ricochet Swarm cleared down successfully.");
  }, 9000);
}

async function getBinPayload(): Promise<boolean> {
  try {
    const res = await fetch(BIN_PAYLOAD_URL);
    if (!res.ok) throw new Error("Network response was not stable.");

    const arrayBuffer = await res.arrayBuffer();
    const fullView = new Uint8Array(arrayBuffer);
    payloadIv = fullView.slice(0, 12);
    payloadData = fullView.slice(12);

    return true;
  } catch (e) {
    console.error("Failed to load binary puzzle manifests:", e);
    return false;
  }
}

export const eggsav = new SavUtils(STORAGE_KEY);

async function buildCanonicalState(state: EggState): Promise<string> {
  const ids = Object.keys(state).sort();
  const parts = await Promise.all(
    ids.map(async (id) => {
      const egg = state[id];
      const value = egg.unlocked ? "1" : "0";
      const context = [id, egg.path, egg.titleLength, egg.path.length].join("|");
      const hash = await sha256(context);
      const fp = Array.from(new Uint8Array(hash))
        .slice(0, 4)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      return `${id}:${value}:${fp}`;
    })
  );
  return parts.join("|");
}

async function deriveKey(state: EggState): Promise<CryptoKey> {
  const canonical = await buildCanonicalState(state);
  const hash = await sha256(canonical);
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, ["decrypt"]);
}

async function tryUnlock(): Promise<void> {
  const state = getParsedState();
  const currentFoundCount = Object.values(state).filter(e => e.unlocked).length;

  if (currentFoundCount < TOTAL_EGGS || !payloadIv || !payloadData) return;

  try {
    const key = await deriveKey(state);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: payloadIv }, key, payloadData);
    const text = new TextDecoder().decode(decrypted);
    if (text.startsWith("VALID_REWARD")) {
      showReward(text);
    }
  } catch { }
}

// =========================================================================
// 🛠️ LAYERED ENGINE INITIALISATION LOOP
// =========================================================================
async function initEggs(): Promise<void> {
  const assetLoaded = await getBinPayload();
  if (!assetLoaded) return;

  const state = vault.fetch({});
  
  // Clean runtime selection pointer fallback layer
  const activeValue = globalTheme.ls || globalTheme.sp;
  const currentTheme = (activeValue === "original") ? "original" : "alt";
  const assets = THEME_ASSETS[currentTheme];

  if (!assets) {
    throw new TypeError(`Unknown theme state: ${activeValue}`);
  }

  document.querySelectorAll<HTMLElement>(".egg").forEach(egg => {
    const id = egg.dataset.egg!;

    // Wipe stale DOM structures across theme reloads
    egg.innerHTML = "";

    if (state[id]?.unlocked) {
      egg.classList.add("unlocked");
    }

    // LAYER 1: The Outer Target / Protective Cage Wrapper (.egg-box)
    if (currentTheme === "original") {
      // Original theme instantiates our floating 3D procedural bubble cage!
      mountLocal3DBubble(egg, THEME_ASSETS);
    } else {
      // Alternative theme creates the static 2D chicken block element
      const box = document.createElement("img");
      box.className = "egg-box";
      box.src = assets.boxSrc;
      box.alt = assets.boxAlt;
      egg.appendChild(box);
    }

    // LAYER 2: The Inner Asset Prize Payload (.egg-cracked)
    const cracked = document.createElement("img");
    cracked.className = "egg-cracked";
    cracked.src = assets.crackedSrc;
    cracked.alt = assets.crackedAlt;
    egg.appendChild(cracked);

    // Bind interaction triggers straight onto the target container layer
    const triggerTarget = egg.querySelector(".egg-box") as HTMLElement | null;

    triggerTarget?.addEventListener("click", async () => {
      if (state[id]?.unlocked) return;

      state[id] = {
        unlocked: true,
        path: resolvePath(location.pathname),
        titleLength: document.title.trim().length
      };
      vault.save(state);

      egg.classList.add("cracking");
      if (currentTheme === "alt") {
        sfx.playInstant('korokYahaha');
      }

      setTimeout(async () => {
        egg.classList.remove("cracking");
        egg.classList.add("unlocked");

        updateCounter(state);
        const totalUnlockedCount = Object.values(state).filter(e => e.unlocked).length;

        if (currentTheme === "alt") {
          if (totalUnlockedCount % 4 === 0 || totalUnlockedCount % 5 === 0) {
            triggerChickenAttack();
          }
        } else if (currentTheme === "original") {
          if (totalUnlockedCount % 5 === 0 || totalUnlockedCount % 7 === 0) {
            const context = constructStarbitScene();
            if (context) {
              const moonImagesArray = Array(totalUnlockedCount).fill(THEME_ASSETS.original.crackedSrc);
              generateStarbitShower(GLTF_MODEL_URL, moonImagesArray, context, totalUnlockedCount, TOTAL_EGGS);
            }
          }
        }

        await tryUnlock();
      }, 800);
    });
  });

  updateCounter(state);
  await tryUnlock();
}

export function showReward(content: string): void {
  const totalUnlockedCount = Object.values(getParsedState()).filter(e => e.unlocked).length;
  const moonImagesArray = Array(totalUnlockedCount).fill(THEME_ASSETS.original.crackedSrc);

  const completedFlag = new SavUtils("completion-shown");
  const flag = (completedFlag.ss || completedFlag.ls) === "true";

  if (!flag) {
    startCompSeq(GLTF_MODEL_URL, moonImagesArray, totalUnlockedCount, TOTAL_EGGS);
    completedFlag.ss = completedFlag.ls = "true";
  }

  const cleanContent = content.replace(/^VALID_REWARD\s*:\s*/, "").trim();

  try {
    const reward = JSON.parse(cleanContent);
    if (reward && typeof reward === "object" && "type" in reward) {
      if (reward && (reward.type === "stylesheet" || reward.type === "styleBlock")) {
        const alreadyInjected = document.getElementById("egg-reward-styles");

        const dynamicThemeCheck = globalTheme.ls || globalTheme.sp || "alt";
        if (!alreadyInjected && dynamicThemeCheck === "alt") {
          sfx.playInstant('shrineFanfare');
        }

        const style = alreadyInjected || document.createElement("style");
        style.id = "egg-reward-styles";
        style.textContent = typeof reward.value === "string" ? reward.value : String(reward.value);

        if (!alreadyInjected) {
          document.head.appendChild(style);
        }
        if (dynamicThemeCheck === "alt") {
          globalTheme.ls = "original";
        }
        return;
      }
    } else {
      console.error("`Reward` is not an object or `type` does not exist on `reward`");
    }
  } catch (e) {
    console.error("Reward parsing crashed:", e);
  }
}

// Fire execution pipeline
initEggs();

export function updateCounter(state: EggState): void {
  const counterElem = document.getElementById("eggCounter");
  if (!counterElem) return;
  const found = Object.values(state).filter(e => e.unlocked).length;
  counterElem.textContent =
    `Easter eggs found: ${Math.round((found / TOTAL_EGGS) * 100)}% - ${found} / ${TOTAL_EGGS}`;
}

tryUnlock();
updateCounter(getParsedState());