/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

import { isLocalhost } from "../core/core";
import { EggState, ProgressTransport } from "./interfaces";
import { SecureProgressVault } from "./secure-storage";

export class SecureLocalVault implements ProgressTransport {
  secretVault = new SecureProgressVault();

  save(state: EggState): void {
    this.secretVault.save(state);
  }

  fetch(fallback: EggState): EggState {
    return this.secretVault.fetch(fallback);
  }

  clear(): void {
    this.secretVault.clear();
  }

  importFromFile(binaryData: Uint8Array): EggState | null {
    const parsed = this.secretVault.importFromFile(binaryData);
    if (parsed) {
      this.save(parsed);
    }
    return parsed;
  }

  exportToFile(state: EggState): void {
    // Read directly from the authenticated secure jar layout context
    const livePersistedState = this.fetch({});

    // Merge any supplemental runtime parameters safely
    const compiledOutputState = { ...livePersistedState, ...state };

    console.log(`📦 [Production Vault] Compiling download payload for ${Object.keys(compiledOutputState).length} items.`);
    this.secretVault.exportToFile(compiledOutputState);
  }
}

export class VolatileMemoryVault implements ProgressTransport {
  private memoryCache: EggState = {};
  private persistenceBridge = new SecureProgressVault();

  private syncCache(): void {
    if (Object.keys(this.memoryCache).length === 0) {
      const persisted = this.persistenceBridge.fetch({});
      if (persisted && Object.keys(persisted).length > 0) {
        this.memoryCache = { ...persisted };
      }
    }
  }

  save(state: EggState): void {
    this.memoryCache = { ...state };
    this.persistenceBridge.save(state);
  }

  fetch(fallback: EggState): EggState {
    this.syncCache();
    if (Object.keys(this.memoryCache).length > 0) {
      return this.memoryCache;
    }
    return fallback;
  }

  clear(): void {
    this.memoryCache = {};
    this.persistenceBridge.clear();
  }

  importFromFile(binaryData: Uint8Array): EggState | null {
    const parsedState = this.persistenceBridge.importFromFile(binaryData);
    if (parsedState) {
      this.save(parsedState);
    }
    return parsedState;
  }

  exportToFile(state: EggState): void {
    this.syncCache();
    const livePersistedState = this.persistenceBridge.fetch({});
    const compiledOutputState = { ...livePersistedState, ...this.memoryCache, ...state };
    this.persistenceBridge.exportToFile(compiledOutputState);
  }
}

const vault: ProgressTransport = isLocalhost
  ? new VolatileMemoryVault()
  : new SecureLocalVault();

export default vault;