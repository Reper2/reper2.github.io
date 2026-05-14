type EggState = Record<string, {
  unlocked: boolean;
  path: string;
  titleLength: number;
}>;

const STORAGE_KEY = "eggs";
const TOTAL_EGGS = 50;

export const PAYLOAD = {
  iv: new Uint8Array([213,104,49,253,101,152,81,140,20,242,151,37]),
  data: new Uint8Array([74,136,234,119,144,230,218,88,41,226,178,224,40,73,11,182,13,238,82,165,142,179,216,45,67,32,209,167,141,152,134,190,126,123,81,236,105,149,217,114,58,167,182,132,49,153,177,51,18,124,204,11,102,61,175,124,226,71,204,73,151,22,90,9,199,211,110,40,213,40,95,40,113,65,107,44,75,238,251,183,223,187,211,124,160,83,61,142,208,173,109,152,77,100,131,124,0,11,8,5,191,189])
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

resetBtn._.className = "tooltip";
[resetBtn.btn.innerHTML, resetBtn.btn.onclick] = ["🥚🗑️", (): void => { localStorage.setItem("eggs", "{}"), location.reload(); }];
[resetBtn.tt.innerHTML, resetBtn.tt.className] = ["Reset All Eggs (Ctrl+Z)", "tooltiptext"];

resetBtn.btn.appendChild(resetBtn.tt);
resetBtn._.appendChild(resetBtn.btn);

export { TOTAL_EGGS, EggState, saveEggs, loadEggs, sha256, updateCounter, showReward, resolvePath };