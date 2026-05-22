type EggState = Record<string, {
  unlocked: boolean;
  path: string;
  titleLength: number;
}>;

const STORAGE_KEY = "eggs";
const TOTAL_EGGS = 24;

// Global containers to store our stream values once fetched from the network
let payloadIv: BufferSource | null = null;
let payloadData: BufferSource | null = null;

/**
 * Downloads and parses the consolidated asset payload from the network.
 */
async function fetchBinaryPayload(): Promise<boolean> {
  try {
    // Adjust this path relative to where you drop the file in your public deployment
    const response = await fetch("/assets/egg-payload.bin");
    if (!response.ok) throw new Error("Network response was not stable.");

    const arrayBuffer = await response.arrayBuffer();
    const fullView = new Uint8Array(arrayBuffer);

    // Extract the first 12 bytes as our IV matching our encryption pipeline layout
    payloadIv = fullView.slice(0, 12);
    // Everything else following the header signature is our raw ciphertext data block
    payloadData = fullView.slice(12);

    return true;
  } catch (err) {
    console.error("Failed to load binary puzzle manifests:", err);
    return false;
  }
}

/**
 * 
 * @returns An EggState object with properties `unlocked` which only stores true as long as it exists,
 * `path` representing the relative directory path to the root
 */
function loadEggs(): EggState {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveEggs(state: EggState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resolvePath(pathname: string): string {
  return pathname
    .toLowerCase()
    .replace(/\/+$/, "")
    .replace(/^$/, "/");
}

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

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
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
  const state = loadEggs();
  const currentFoundCount = Object.values(state).filter(e => e.unlocked).length;

  // If they haven't finished, or the asset file hasn't loaded yet, early exit
  if (currentFoundCount < TOTAL_EGGS || !payloadIv || !payloadData) {
    return;
  }

  try {
    const key = await deriveKey(state);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: payloadIv }, // Using dynamic variable
      key,
      payloadData // Using dynamic variable
    );

    const text = new TextDecoder().decode(decrypted);

    if (text.startsWith("VALID_REWARD")) {
      showReward(text);
    }
  } catch { }
}

async function initEggs(): Promise<void> {
  // 1. Kick off the asynchronous asset stream fetch right away on boot
  const assetLoaded = await fetchBinaryPayload();
  if (!assetLoaded) return; // Halt script execution if payload can't be fetched

  const state = loadEggs();

  // Bind DOM elements and click listeners
  document.querySelectorAll<HTMLElement>(".egg").forEach(egg => {
    const id = egg.dataset.egg!;
    const box = egg.querySelector(".egg-box");

    if (state[id]?.unlocked) {
      egg.classList.add("unlocked");
    }

    box?.addEventListener("click", async () => {
      if (state[id]?.unlocked) return;

      state[id] = {
        unlocked: true,
        path: resolvePath(location.pathname),
        titleLength: document.title.trim().length
      };
      saveEggs(state);

      egg.classList.add("cracking");

      setTimeout(async () => {
        egg.classList.remove("cracking");
        egg.classList.add("unlocked");

        updateCounter(state);
        await tryUnlock();
      }, 800);
    });
  });

  updateCounter(state);

  // 2. Perform safe immediate validation now that assets are locally available
  await tryUnlock();
}

// Fire execution pipeline
initEggs();

function updateCounter(state: EggState): void {
  const counterElem = document.getElementById("eggCounter");
  if (!counterElem) return;
  const found = Object.values(state).filter(e => e.unlocked).length;
  counterElem.textContent =
    `Easter eggs found: ${Math.round((found / TOTAL_EGGS) * 100)}% - ${found} / ${TOTAL_EGGS}`;
}

function showReward(text: string): void {
  // Strip out prefix to parse reward data safely
  const cleanContent = text.replace(/^VALID_REWARD\s*:\s*/, "").trim();

  try {
    const reward = JSON.parse(cleanContent);
    if (reward && (reward.type === "stylesheet" || reward.type === "styleBlock")) {
      const style = document.createElement("style");
      style.textContent = typeof reward.value === "string" ? reward.value : String(reward.value);
      document.head.appendChild(style);
      return;
    }
  } catch { }
}

initEggs();
tryUnlock();

const resetBtn = {
  _: <HTMLDivElement>document.getElementById("resetEggs"),
  btn: document.createElement("button"),
  tt: document.createElement("span")
};

if (resetBtn._) {
  resetBtn._.className = "tooltip";
  [resetBtn.btn.innerHTML, resetBtn.btn.onclick] = ["🥚🗑️", (): void => { localStorage.setItem("eggs", "{}"), location.reload(); }];
  [resetBtn.tt.innerHTML, resetBtn.tt.className] = ["Reset All Eggs (Ctrl+Z)", "tooltiptext"];

  resetBtn.btn.appendChild(resetBtn.tt);
  resetBtn._.appendChild(resetBtn.btn);
}

export { TOTAL_EGGS, EggState, saveEggs, loadEggs, sha256, updateCounter, showReward, resolvePath };