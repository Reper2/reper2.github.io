/**
 * @author Ethan Graham
 * @license MIT
 * @copyright 2021-2026 Ethan Graham
 * @see https://github.com/fire-ethan/fire-ethan.github.io/blob/master/LICENSE
 * License information in LICENSE file overrides any other license information in this file.
 */

import { EggState } from "./interfaces";
import vault from "./vault"; // 🌟 Route directly through the vault module instance

export async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
}

export function getParsedState(): EggState {
  try {
    return vault.fetch({});
  } catch {
    return {};
  }
}

export function resolvePath(pathname: string): string {
  return pathname
    .toLowerCase()
    .replace(/\/+$/, "")
    .replace(/^$/, "/");
}