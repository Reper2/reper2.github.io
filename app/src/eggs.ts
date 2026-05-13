type EggState = Record<string, {
  unlocked: boolean;
  path: string;
  titleLength: number;
}>;

const STORAGE_KEY = "eggs";
const TOTAL_EGGS = 36;

export const PAYLOAD = {
  iv: new Uint8Array([166,17,67,183,202,94,185,177,27,242,35,177]),
  data: new Uint8Array([1,8,99,209,157,239,177,182,153,225,109,4,231,80,87,169,8,25,98,245,217,68,84,139,185,91,5,192,220,10,111,245,84,19,113,185,146,84,191,156,170,144,5,86,26,48,43,25,151,197,183,237,142,212,112,207,89,196,72,4,192,110,72,73,196,211,67,222,143,84,199,17,117,2,163,171,225,214,135,143,137,56,143,169,203,121,119,146,246,183,14,17,248,54,171,151,18,164,41,60,234,9])
};

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
  const key = await deriveKey(state);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: PAYLOAD.iv },
      key,
      PAYLOAD.data
    );

    const text = new TextDecoder().decode(decrypted);

    if (text.startsWith("VALID_REWARD")) {
      showReward(text);
    }

  } catch { }
}

function initEggs(): void {
  const state = loadEggs();

  document.querySelectorAll<HTMLElement>(".egg").forEach(egg => {
    const id = egg.dataset.egg!;
    const box = egg.querySelector(".egg-box");

    if (state[id]?.unlocked) {
      egg.classList.add("unlocked");
    }

    box?.addEventListener("click", async () => {
      state[id] = {
        unlocked: true,
        path: resolvePath(location.pathname),
        titleLength: document.title.length
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
}

function updateCounter(state: EggState): void {
  const found = Object.values(state).filter(e => e.unlocked).length;
  document.getElementById("eggCounter")!.textContent =
    `Easter eggs found: ${found} / ${TOTAL_EGGS}`;
}

function showReward(text: string): void {
  const el = document.getElementById("egg-reward");
  if (el) el.textContent = text;
}

initEggs();

export { TOTAL_EGGS, EggState, saveEggs, loadEggs, sha256, updateCounter, showReward, resolvePath };