export interface ButtonObj {
  _: HTMLDivElement;
  btn: {
    _: HTMLButtonElement[];
    id: string[];
    disp: string[];
    name: string[];
    log: string[];
  };
  tt: {
    _: HTMLSpanElement[];
    name: string[];
  };
  playback?: {
    _: HTMLButtonElement[];
    ids: string[];
    labels: string[];
    tooltips: string[];
  };
  alt?: {
    btn_name: string[];
    playback_labels: string[];
  };
}

export interface AppPanel {
  readonly elementId: string;
  isOpen: boolean;
  render(): void;
  toggleVisibility(forceState?: boolean): void;
}

export type Name = string | number;

export interface MarioKartStems {
  base: string;
  prelude?: string;
  finalLap?: string;
  frontrunning?: string;
  medley?: string;
  sections?: string[]; // Holds the ordered path array
}

export interface VersionData {
  timestamp: string;
}
