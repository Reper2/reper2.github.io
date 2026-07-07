import { Background, Database } from "../../lib/db-typings";
import { RandomPicker } from "./core";

let isLayerA = true;
let isInitialLoad = true;

// FALLBACK DESTINATION SETTINGS
const FALLBACK_CONFIG = {
  username: "reper2",
  repo: "switch-album", 
};

export function changeBackground(obj: Background.Config): void {
  const currentCategory = obj.elem.dataset["bg-force"] || obj.category || "games";
  const chosenGame = obj.specificGame;

  // Handler function to cycle image buffer swaps with automated status safeguards
  const renderImage = async (branch: string, file: Database.File) => {
    let targetUrl = "https://cdn.jsdelivr.net/gh/reper2/";
    let isFallbackActive = false;

    if (currentCategory === "holidays") {
      targetUrl += `holiday-album@master/photos/${file.name}`;
    } else {
      targetUrl += `switch-album@${branch}/${file.name}`;
    }

    try {
      // Pre-flight status verification checkpoint
      // A HEAD request checks response headers instantly without downloading any image data!
      const checkResponse = await fetch(targetUrl, { method: "HEAD" });
      
      // If jsDelivr fails due to sizing limits (403) or rate caps (429)
      if (checkResponse.status === 403 || checkResponse.status === 429) {
        console.warn(`[Background Guard] CDN rejected asset "${branch}/${file.name}" with status ${checkResponse.status}. Activating raw fallback.`);
        
        // Rewrite the resource mapping endpoint seamlessly on the fly
        if (currentCategory === "holidays") {
          targetUrl = `https://raw.githubusercontent.com/reper2/holiday-album/master/photos/${file.name}`;
        } else {
          targetUrl = `https://raw.githubusercontent.com/${FALLBACK_CONFIG.username}/${FALLBACK_CONFIG.repo}/${branch}/${file.name}`;
        }
        isFallbackActive = true;
      }
    } catch (netError) {
      // If the browser blocks the HEAD request entirely (CORS/offline quirks), fallback safely
      console.debug("[Background Guard] Pre-flight status query bypassed due to environmental network block.");
    }

    const imgCache = new Image();
    imgCache.src = targetUrl;

    imgCache.onload = () => {
      const urlValue = `url('${targetUrl}')`;

      if (isInitialLoad) {
        obj.elem.style.setProperty("--bg-before", urlValue);
        isInitialLoad = false;
      } else {
        if (isLayerA) {
          obj.elem.style.setProperty("--bg-after", urlValue);
          obj.elem.classList.add("bg-flip");
        } else {
          obj.elem.style.setProperty("--bg-before", urlValue);
          obj.elem.classList.remove("bg-flip");
        }
        isLayerA = !isLayerA;
      }
    };

    imgCache.onerror = () => {
      // Double-layered backup: If the HEAD request was normal but loading failed unexpectedly 
      if (!isFallbackActive) {
        console.warn(`[Background Guard] Post-load pipeline failure caught on primary URL. Redirecting secondary fallback cycle.`);
        if (currentCategory === "holidays") {
          targetUrl = `https://raw.githubusercontent.com/reper2/holiday-album/master/photos/${file.name}`;
        } else {
          targetUrl = `https://raw.githubusercontent.com/${FALLBACK_CONFIG.username}/${FALLBACK_CONFIG.repo}/${branch}/${file.name}`;
        }
        
        const secondaryCache = new Image();
        secondaryCache.src = targetUrl;
        secondaryCache.onload = imgCache.onload; 
      } else {
        console.error(`[Background Guard] Terminal load error. Both jsDelivr CDN and GitHub Raw targets failed for: ${file.name}`);
      }
    };
  };

  // Execution flow depending on configurations selected
  if (currentCategory === "holidays") {
    const holidayFiles = (obj.db && Array.isArray(obj.db)) 
      ? obj.db 
      : (obj.db as any)["holidays"]?.[0]?.contents || [];

    if (holidayFiles.length > 0) {
      const randomFile = holidayFiles[Math.floor(Math.random() * holidayFiles.length)];
      renderImage("holidays", randomFile);
    } else {
      const bgPicker = new RandomPicker(obj.game);
      bgPicker.pick(
        k => obj.db[k][0].contents,
        (k, file: Database.File) => renderImage(k as string, file)
      );
    }
  } else if (chosenGame) {
    const albumFiles = obj.db[chosenGame]?.[0]?.contents || [];
    if (albumFiles.length > 0) {
      const randomFile = albumFiles[Math.floor(Math.random() * albumFiles.length)];
      renderImage(chosenGame, randomFile);
    }
  } else {
    const bgPicker = new RandomPicker(obj.game);
    bgPicker.pick(
      k => obj.db[k][0].contents,
      (k, file: Database.File) => renderImage(k as string, file)
    );
  }
}