type EggState = Record<string, {
  unlocked: boolean;
  path: string;
  titleLength: number;
}>;

const STORAGE_KEY = "eggs";
const TOTAL_EGGS = 24;

export const PAYLOAD = {
  iv: new Uint8Array([25,124,137,153,221,105,151,146,241,233,249,108]),
  data: new Uint8Array([151,255,205,153,138,117,98,52,94,137,41,158,240,161,67,219,24,12,29,189,219,146,177,132,53,188,36,251,100,211,240,77,169,23,83,112,250,100,212,23,207,152,208,91,45,248,137,112,4,103,238,242,85,86,187,33,77,186,168,39,42,0,8,251,230,223,35,249,29,49,197,254,169,204,143,243,130,91,224,223,5,20,1,145,203,108,3,47,21,52,81,65,192,221,67,48,115,22,220,249,122,27])
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