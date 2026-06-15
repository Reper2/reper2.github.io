import { Background, Database } from "../../lib/db-typings";
import { RandomPicker } from "./core";

let isLayerA = true;
let isInitialLoad = true;

export function changeBackground(obj: Background.Config): void {
  const bgPicker = new RandomPicker(obj.game);
  bgPicker.pick(
    k => obj.db[k][0].contents,
    (k, file: Database.File) => {
      const targetUrl = `https://raw.githubusercontent.com/reper2/switch-album/${k}/${file.name}`;
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
    },
  );
}