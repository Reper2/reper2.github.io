import { globalTheme } from "../themes";
import SavUtils from "../core/storage";
import { isLocalhost } from "../core/";
import { generateStarbitShower, constructStarbitScene } from "../starbits/";

import { EggState } from "./interfaces";
import { startCompSeq } from "./comp-seq";
import { getParsedState, resolvePath, sha256 } from "./utils";
import vault from "./vault";

// Update page style based on saved theme preference. This has been made portable for all pages linked to this script.
if (globalTheme.ls === "zelda") {
  const existingLink = document.getElementById("theme-link") as HTMLLinkElement | null;
  if (existingLink && existingLink.disabled === false) {
    existingLink.href = "/assets/zelda.css";
    console.warn("Zelda theme detected. Stylesheet link updated.");
  } else {
    console.warn("Zelda theme detected but no existing link found. Injecting new stylesheet link.");
    const link = document.createElement("link");
    link.id = "theme-link";
    link.rel = "stylesheet";
    link.href = "/assets/zelda.css";
    document.head.appendChild(link);
  }
} else if (!globalTheme.ls) {
  globalTheme.ls = "zelda";
  console.info("No theme preference found. Defaulting to Zelda theme.");
}

export const STORAGE_KEY = "eggs";
export const TOTAL_EGGS = 24;

// Global containers to store the stream values once fetched from the network
let payloadIv: BufferSource | null = null;
let payloadData: BufferSource | null = null;

const sfx = {
  korokYahaha: new Audio("/assets/zelda-theme/korok-appears.mp3"),
  shrineFanfare: new Audio("/assets/zelda-theme/shrine_fanfare.mp3"),

  playInstant(effect: 'korokYahaha' | 'shrineFanfare') {
    if (!isLocalhost) return;
    const audio = this[effect];
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(e => console.warn("Audio deferred by browser context:", e));
  }
};

/**
 * 🎨 Bundled Stylesheet Object for the dynamic Cucco swarm layout
 */
function injectCuccoStyles(): void {
  if (document.getElementById("cucco-animation-styles")) return;

  const styleEl = document.createElement("style");
  styleEl.id = "cucco-animation-styles";
  styleEl.textContent = `
    .cucco-swarm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    .cucco-sprite {
      position: absolute;
      left: 50vw;
      top: 50vh;
      width: 64px;
      height: 64px;
      background-image: url('/assets/zelda-theme/cucco.webp');
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0;
      will-change: transform, opacity;
      /* Adjusted easing profile: smooth buildup, clean deceleration after bounce */
      animation: cucco-ricochet 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes cucco-ricochet {
      0% {
        transform: translate(var(--startX), var(--startY)) scale(0.7);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      /* Midpoint collision area */
      45% {
        transform: translate(var(--midX), var(--midY)) scale(1.1);
        opacity: 1;
      }
      /* Instant flip pivot */
      46% {
        transform: translate(var(--midX), var(--midY)) scale(1.1) scaleX(var(--flipX));
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translate(var(--endX), var(--endY)) scale(0.6) scaleX(var(--flipX));
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

/**
 * 🐔 Spawns a synchronised attack wave of 20 chickens moving frantically across the view.
 */
function triggerCuccoAttack(): void {
  injectCuccoStyles();

  const overlay = document.createElement("div");
  overlay.className = "cucco-swarm-overlay";
  document.body.appendChild(overlay);

  const TOTAL_CUCCOS = 20;

  for (let i = 0; i < TOTAL_CUCCOS; i++) {
    const cucco = document.createElement("div");
    cucco.className = "cucco-sprite";

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

    let initialFlip = endX < startX ? -1 : 1;
    const entryGoingLeft = midX < startX;
    const exitGoingLeft = endX < midX;
    let postBounceFlip = (entryGoingLeft !== exitGoingLeft) ? -1 : 1;

    cucco.style.setProperty("--startX", `${startX}px`);
    cucco.style.setProperty("--startY", `${startY}px`);
    cucco.style.setProperty("--midX", `${midX}px`);
    cucco.style.setProperty("--midY", `${midY}px`);
    cucco.style.setProperty("--endX", `${endX}px`);
    cucco.style.setProperty("--endY", `${endY}px`);
    cucco.style.setProperty("--flipX", `${postBounceFlip}`);

    if (initialFlip === -1) {
      cucco.style.transform = "scaleX(-1)";
    }

    // ⏳ Turn-Based Delay Mapping
    const dynamicDelay = Math.random() * 4.5;
    const dynamicDuration = 2.5 + Math.random() * 1.0;

    cucco.style.animationDelay = `${dynamicDelay}s`;
    cucco.style.animationDuration = `${dynamicDuration}s`;

    overlay.appendChild(cucco);
  }

  setTimeout(() => {
    overlay.remove();
    console.log("🐔 Staggered Ricochet Swarm cleared down successfully.");
  }, 9000);
}

/**
 * Downloads and parses the consolidated asset payload from the network.
 */
async function getBinPayload(): Promise<boolean> {
  try {
    const res = await fetch("/assets/egg-payload.bin");
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

/**
 * Getters and setters for the global egg state.
 */
export const eggsav = new SavUtils(STORAGE_KEY);

async function buildCanonicalState(state: EggState): Promise<string> {
  const ids = Object.keys(state).sort();

  const parts = await Promise.all(
    ids.map(async (id) => {
      const egg = state[id];
      const value = egg.unlocked ? "1" : "0";

      const context = [
        id,
        egg.path,
        egg.titleLength,
        egg.path.length
      ].join("|");

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

  return crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
}

async function tryUnlock(): Promise<void> {
  const state = getParsedState();
  const currentFoundCount = Object.values(state).filter(e => e.unlocked).length;

  if (currentFoundCount < TOTAL_EGGS || !payloadIv || !payloadData) {
    return;
  }

  try {
    const key = await deriveKey(state);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: payloadIv },
      key,
      payloadData
    );

    const text = new TextDecoder().decode(decrypted);

    if (text.startsWith("VALID_REWARD")) {
      showReward(text);
    }
  } catch { }
}

async function initEggs(): Promise<void> {
  const assetLoaded = await getBinPayload();
  if (!assetLoaded) return;

  const state = vault.fetch({});

  document.querySelectorAll<HTMLElement>(".egg").forEach(egg => {
    const id = egg.dataset.egg!;
    const box = egg.querySelector(".egg-box") as HTMLImageElement | null;
    const cracked = egg.querySelector(".egg-cracked") as HTMLImageElement | null;

    if (state[id]?.unlocked) {
      egg.classList.add("unlocked");
    }

    if (globalTheme.ls === "zelda") {
      if (box) box.src = "/assets/zelda-theme/cucco.webp";
      if (cracked) cracked.src = "/assets/zelda-theme/bird-egg.png";
    } else if (globalTheme.ls === "original") {
      if (box) box.src = "/images/hidden_block.png";
      if (cracked) cracked.src = "/images/moon.png";
    } else {
      throw new TypeError(`Unknown theme state: ${globalTheme.ls}`);
    }

    box?.addEventListener("click", async () => {
      if (state[id]?.unlocked) return;

      state[id] = {
        unlocked: true,
        path: resolvePath(location.pathname),
        titleLength: document.title.trim().length
      };
      vault.save(state);

      egg.classList.add("cracking");
      if (globalTheme.ls === "zelda") {
        sfx.playInstant('korokYahaha');
      }

      setTimeout(async () => {
        egg.classList.remove("cracking");
        egg.classList.add("unlocked");

        updateCounter(state);
        const totalUnlockedCount = Object.values(state).filter(e => e.unlocked).length;

        if (globalTheme.ls === "zelda") {
          // Triggers on intervals of 4 or 5 (e.g., 4, 5, 8, 10, 12, 15, 16, 20)
          if (totalUnlockedCount % 4 === 0 || totalUnlockedCount % 5 === 0) {
            triggerCuccoAttack();
          }
        } if (globalTheme.ls === "original") {
          if (totalUnlockedCount % 5 === 0 || totalUnlockedCount % 7 === 0) {
            const context = constructStarbitScene();
            if (context) {
              const moonImagesArray = Array(totalUnlockedCount).fill("/images/moon.png");
              const gltfModelUrl = "/assets/starbit.gltf";

              generateStarbitShower(gltfModelUrl, moonImagesArray, context, totalUnlockedCount, TOTAL_EGGS);
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

  const moonImagesArray = Array(totalUnlockedCount).fill("/images/moon.png");
  const gltfModelUrl = "/assets/starbit.gltf";

  const completedFlag = new SavUtils("completion-shown");
  const flag = (completedFlag.ss || completedFlag.ls) === "true";

  if (!flag) {
    startCompSeq(gltfModelUrl, moonImagesArray, totalUnlockedCount, TOTAL_EGGS);
    completedFlag.ss = completedFlag.ls = "true";
  }

  const cleanContent = content.replace(/^VALID_REWARD\s*:\s*/, "").trim();

  try {
    const reward = JSON.parse(cleanContent);
    if (reward && (reward.type === "stylesheet" || reward.type === "styleBlock")) {
      const alreadyInjected = document.getElementById("egg-reward-styles");

      if (!alreadyInjected && globalTheme.ls === "zelda") {
        sfx.playInstant('shrineFanfare');
      }

      const style = alreadyInjected || document.createElement("style");
      style.id = "egg-reward-styles";
      style.textContent = typeof reward.value === "string" ? reward.value : String(reward.value);

      if (!alreadyInjected) {
        document.head.appendChild(style);
      }
      if (globalTheme.ls === "zelda") {
        globalTheme.ls = "original";
      }
      return;
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