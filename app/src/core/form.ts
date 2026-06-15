import { Grass, Music } from "../../lib/db-typings";
import { pickNextTrack } from "./music";
import SavUtils from "./storage";

export function submit(obj: Music.Config, input?: HTMLInputElement[], selector?: HTMLSelectElement[]) {
  // 1. Safely extract values only if the arrays have elements at index 0
  const musicInputValue = (input && input.length > 0) ? input[0].value : undefined;
  const musicSelectValue = (selector && selector.length > 0) ? selector[0].value : undefined;

  // Use whichever music input source is available
  const inputValue = musicInputValue || musicSelectValue;
  const currentSaved = sessionStorage.getItem("music");

  // 2. Handle Music Logic Safely
  if (inputValue && inputValue === currentSaved) {
    pickNextTrack(obj);
  } else if (inputValue) {
    new SavUtils("music").ss = inputValue;
  }

  // 3. Handle Grass Logic Safely (Check if index 1 actually exists)
  if (selector && selector.length > 1 && selector[1]) {
    new SavUtils("grass").ss = selector[1].value;
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
