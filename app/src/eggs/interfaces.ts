export interface ShieldedStorage {
  payload: EggState;
  signature: number;
}

export type EggState = Record<string, {
  unlocked: boolean;
  path: string;
  titleLength: number;
}>;

export interface ProgressVault {
  save(state: EggState): void;
  fetch(fallback?: EggState): EggState;
  clear(): void;
}

export interface ProgressTransport extends ProgressVault {
  importFromFile(binaryData: Uint8Array, currentState: EggState): EggState | null;
  exportToFile(state: EggState): void;
}