import { Grass, Music } from "../../lib/db-typings";
import { pickNextTrack } from "./music";
import SavUtils from "./storage";

export function submit(obj: Music.Config, input?: HTMLInputElement[], selector?: HTMLSelectElement[]) {
  const musicInputValue = (input && input[0] instanceof HTMLInputElement) ? input[0].value : undefined;
  const musicSelectValue = (selector && selector[0] instanceof HTMLSelectElement) ? selector[0].value : undefined;
  const inputValue = musicInputValue || musicSelectValue;
  const currentSavedCompound = new SavUtils("music");

  if (inputValue) {
    // Determine the album layout context for this track target string
    const matchedAlbum = obj.db[0].contents.find(album => 
      album.contents.some(track => track.name.replace(/\.[^/.]+$/, "") === inputValue)
    );

    const packedValue = matchedAlbum ? `${matchedAlbum.name}: ${inputValue}` : inputValue;

    if (packedValue === currentSavedCompound.ss) {
      pickNextTrack(obj);
    } else {
      // 🌟 SavUtils continues tracking a single identifier, saving "album:track" cleanly
      currentSavedCompound.ss = packedValue;
    }
  }

  if (selector && selector.length > 1 && selector[1]) {
    new SavUtils("grass").ss = selector[1].value;
  }

  // 4. Handle Background Picker Submissions
  if (selector && selector.length > 3) {
    const categoryVal = selector[2].value;     // games or holidays
    const specificGameVal = selector[3].value; // game choice or ""

    const bgSav = {
      cat: new SavUtils("bg_cat"),
      game: new SavUtils("bg_game")
    }
    bgSav.cat.ss = bgSav.cat.sp = categoryVal;
    bgSav.game.ss = bgSav.game.sp = specificGameVal ?? "";
  }
}


export function pushOptGroups(elems: HTMLOptGroupElement[], labels: string[]): void {
  for (let i = 0; i < labels.length; i++) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = labels[i];
    elems.push(optgroup);
  }
}

export function pushGrassOpts(obj: HTMLOptionElement[], data: Grass.Config["db"]): void {
  for (let i = 0; i < data.src.length; i++) {
    const option = document.createElement("option");
    option.value = data.src[i];
    option.innerHTML = data.name[i];
    obj.push(option);
  }
}
