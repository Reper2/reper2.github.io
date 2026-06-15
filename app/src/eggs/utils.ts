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