/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

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
  submix?: string; // Captures environmental layers like Movie Screen / Water Section
  sections?: string[];
}

export interface VersionData {
  timestamp: string;
}