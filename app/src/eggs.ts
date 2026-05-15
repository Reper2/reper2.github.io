type EggState = Record<string, {
  unlocked: boolean;
  path: string;
  titleLength: number;
}>;

const STORAGE_KEY = "eggs";
const TOTAL_EGGS = 50;

export const PAYLOAD = {
  iv: new Uint8Array([71,172,109,241,54,128,183,185,111,5,105,245]),
  data: new Uint8Array([243,51,109,100,80,91,104,166,221,209,216,16,73,208,48,130,248,121,28,25,115,90,228,238,5,166,38,174,194,82,216,217,187,222,98,131,49,154,191,185,242,98,15,50,210,104,44,178,165,4,141,241,197,225,159,118,228,95,191,212,118,210,232,178,182,15,180,101,45,87,67,172,224,38,23,161,29,94,244,207,223,254,203,203,210,254,72,139,47,8,97,205,222,92,49,166,198,41,187,182,166,154])
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
    `Easter eggs found: ${found} / ${TOTAL_EGGS}`;
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