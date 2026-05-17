type EggState = Record<string, {
  unlocked: boolean;
  path: string;
  titleLength: number;
}>;

const STORAGE_KEY = "eggs";
const TOTAL_EGGS = 24;

export const PAYLOAD = {
  iv: new Uint8Array([140,93,74,183,181,78,114,163,138,37,166,250]),
  data: new Uint8Array([40,12,157,242,156,244,142,77,202,130,86,231,240,210,78,121,6,207,182,51,96,94,235,102,135,204,242,107,73,188,187,64,42,177,182,151,60,12,96,243,49,172,64,113,181,117,130,194,102,36,237,133,242,26,253,170,204,116,228,105,113,114,31,98,114,170,11,184,4,107,214,109,142,188,147,131,242,58,27,196,116,102,36,194,89,41,56,201,167,152,227,255,133,17,115,157,55,229,122,74,174,165])
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
  const counterElem = document.getElementById("eggCounter");
  if (!counterElem) return;
  const found = Object.values(state).filter(e => e.unlocked).length;
  counterElem.textContent =
    `Easter eggs found: ${Math.round((found / TOTAL_EGGS) * 100)}% - ${found} / ${TOTAL_EGGS}`;
}

function showReward(text: string): void {
  const el = document.getElementById("egg-reward");
  if (el) el.textContent = text;
}

initEggs();

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