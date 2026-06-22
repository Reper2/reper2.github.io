import { Background, Database } from "../../lib/db-typings";
import { RandomPicker } from "./core";

let isLayerA = true;
let isInitialLoad = true;

export function changeBackground(obj: Background.Config): void {
  const currentCategory = obj.elem.dataset["bg-force"] || obj.category || "games";
  const chosenGame = obj.specificGame;

  // Handler function to cycle image buffer swaps
  const renderImage = (repoKey: string, file: Database.File) => {
    let targetUrl = "";
    if (currentCategory === "holidays") {
      // Pulls directly from the photos repository layout
      targetUrl = `https://raw.githubusercontent.com/reper2/holiday-album/master/photos/${file.name}`;
    } else {
      targetUrl = `https://raw.githubusercontent.com/reper2/switch-album/${repoKey}/${file.name}`;
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
  };

  // Execution flow depending on configurations selected
  if (currentCategory === "holidays") {
    // 🌟 Handle flat holiday photos array safely without using the multi-nested game dictionary
    // We assume your holiday loader maps 'obj.db' differently or you have a top-level array property
    const holidayFiles = (obj.db && Array.isArray(obj.db)) 
      ? obj.db 
      : (obj.db as any)["holidays"]?.[0]?.contents || [];

    if (holidayFiles.length > 0) {
      const randomFile = holidayFiles[Math.floor(Math.random() * holidayFiles.length)];
      renderImage("holidays", randomFile);
    } else {
      // Safety Fallback to game picker if database loading state isn't populated yet
      const bgPicker = new RandomPicker(obj.game);
      bgPicker.pick(
        k => obj.db[k][0].contents,
        (k, file: Database.File) => renderImage(k as string, file)
      );
    }
  } else if (chosenGame) {
    // A specific game was selected -> Pick a random photo matching only that specific game key
    const albumFiles = obj.db[chosenGame]?.[0]?.contents || [];
    if (albumFiles.length > 0) {
      const randomFile = albumFiles[Math.floor(Math.random() * albumFiles.length)];
      renderImage(chosenGame, randomFile);
    }
  } else {
    // Standard Behavior: Category is games and no specific game is locked
    const bgPicker = new RandomPicker(obj.game);
    bgPicker.pick(
      k => obj.db[k][0].contents,
      (k, file: Database.File) => renderImage(k as string, file)
    );
  }
}