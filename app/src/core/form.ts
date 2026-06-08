import { Grass, Music } from "../../lib/db-typings";
import { pickNextTrack } from "./music";

export function submit(obj: Music.Config, input?: HTMLInputElement[], selector?: HTMLSelectElement[]) {
  const inputValue = input?.[0].value || selector?.[0].value;
  const currentSaved = sessionStorage.getItem("music");

  if (inputValue === currentSaved && inputValue !== "") {
    pickNextTrack(obj);
  } else if (inputValue) {
    sessionStorage.setItem("music", inputValue);
  }
  if (selector) {
    sessionStorage.setItem("grass", selector[1].value);
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
