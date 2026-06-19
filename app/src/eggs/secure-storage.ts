import SavUtils from "../core/storage";
import { EggState, ShieldedStorage, ProgressTransport } from "./interfaces";

function getTimestamp(date: Date = new Date()): string {
  const pad = (num: number, size: number = 2): string =>
    num.toString().padStart(size, '0');

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1); // Months are 0-indexed
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  const ms = pad(date.getMilliseconds(), 2).slice(0, 2); // Switch uses 2-digit milliseconds

  return `${yyyy}${mm}${dd}${hh}${min}${ss}${ms}`;
}

export class SecureProgressVault implements ProgressTransport {
  private readonly safeJar: SavUtils;
  private readonly legacyJar: SavUtils;
  private readonly integritySalt = 8675309;

  constructor(namespace: string = "fvs_egghunt_secure") {
    this.safeJar = new SavUtils(namespace);
    this.legacyJar = new SavUtils("eggs");
  }

  private calcIntSig(data: Uint8Array): number {
    let hash = 5381 + this.integritySalt;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) + hash) + data[i];
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * 🌟 Agnostic Deterministic Checksum Serializer
   */
  private stateToRawBytes(state: EggState): Uint8Array {
    const encoder = new TextEncoder();
    // Enforce predictable key sequencing via alphabetical sorting
    const sortedEntries = Object.entries(state).sort((a, b) => a[0].localeCompare(b[0]));
    const segments: Uint8Array[] = [];

    for (const [key, val] of sortedEntries) {
      if (!key) continue;
      segments.push(encoder.encode(`${key}:${val.unlocked}:${val.path}:${val.titleLength}`));
    }

    const totalLength = segments.reduce((acc, current) => acc + current.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const segment of segments) {
      result.set(segment, offset);
      offset += segment.length;
    }

    return result;
  }

  public fetch(fallback: EggState): EggState {
    const rawSecure = this.safeJar.ls;
    if (rawSecure) {
      try {
        const parsed = JSON.parse(rawSecure);
        if (parsed && typeof parsed === "object" && "payload" in parsed) {
          const envelope = parsed as ShieldedStorage;

          const dataBytes = this.stateToRawBytes(envelope.payload);
          const computedSignature = this.calcIntSig(dataBytes);

          if (computedSignature === envelope.signature) {
            return envelope.payload;
          }
          console.warn("🚨 [Secure Vault] Local storage signature verification failed.");
        }
      } catch (e) {
        console.error("❌ [Secure Vault] Parsing breakdown during fetch lifecycle:", e);
      }
    }
    const migratedState = this.attemptLegacyMigration();
    if (migratedState) return migratedState;
    return fallback;
  }

  private attemptLegacyMigration(): EggState | null {
    const rawLegacy = this.legacyJar.ls;
    if (!rawLegacy) return null;
    try {
      const legacyData = JSON.parse(rawLegacy);
      if (legacyData && typeof legacyData === "object" && Object.keys(legacyData).length > 0) {
        this.save(legacyData as EggState);
        return legacyData as EggState;
      }
    } catch (e) {
      console.error("⚠️ [Secure Vault] Legacy conversion failed:", e);
    }
    return null;
  }

  public save(state: EggState): void {
    try {
      const dataBytes = this.stateToRawBytes(state);
      const signature = this.calcIntSig(dataBytes);
      const securePackage: ShieldedStorage = { payload: state, signature: signature };
      this.safeJar.ls = JSON.stringify(securePackage);
    } catch (e) {
      console.error("❌ [Secure Vault] Persistent update rejected:", e);
    }
  }

  public clear(): void {
    this.safeJar.clear();
    this.legacyJar.clear();
  }

  /**
   * 📥 Diagnostic Importer: Parses file payloads, maps structures, and logs safe metrics
   */
  public importFromFile(binaryData: Uint8Array, currentState?: EggState): EggState | null {
    if (!(binaryData instanceof Uint8Array)) {
      throw new TypeError(`[SecureProgressVault] Expected an instance of Uint8Array for binary decoding, received: ${typeof binaryData}`);
    }
    console.group("🔍 [SYSTEM DIAGNOSTIC] - File Import Pipeline Initiated");
    console.log(`📦 Incoming Binary Array Size: ${binaryData.length} bytes.`);

    if (binaryData.length < 11) {
      console.error("🚨 System Reject: File data is shorter than the minimum 11-byte signature header preamble.");
      console.groupEnd();
      return null;
    }

    try {
      const headerView = new DataView(binaryData.buffer, binaryData.byteOffset, binaryData.byteLength);

      // Verify Preamble Headers
      if (headerView.getUint8(0) !== 0 || headerView.getUint8(1) !== 212 || headerView.getUint8(2) !== 255) {
        console.error("🚨 Validation Error: Magic Ice Header signature theme mismatch.");
        console.groupEnd();
        return null;
      }
      if (headerView.getUint8(3) !== 255 || headerView.getUint8(4) !== 0 || headerView.getUint8(5) !== 50) {
        console.error("🚨 Validation Error: Magic Fire Header signature theme mismatch.");
        console.groupEnd();
        return null;
      }

      const expectedFingerprint = headerView.getUint32(7, true);
      const payloadBytes = binaryData.subarray(11);
      const computedFingerprint = this.calcIntSig(payloadBytes);

      if (computedFingerprint !== expectedFingerprint) {
        console.error(`🚨 Cryptographic Error: File payload fingerprint altered or corrupted.\nExpected: ${expectedFingerprint} | Computed: ${computedFingerprint}`);
        console.groupEnd();
        return null;
      }

      console.log("✅ Encryption Check: File signatures authenticated successfully.");

      // --- 1. CAPTURE THE LIVE PRE-EXISTING BROWSER PROGRESS STATE ---
      console.group("📊 Dimension 1: Pre-Existing Browser Session Progress");
      let runningState: EggState = { ...currentState };
      const rawSecure = this.safeJar.ls;

      if (rawSecure) {
        try {
          const parsed = JSON.parse(rawSecure);
          if (parsed && typeof parsed === "object" && "payload" in parsed) {
            runningState = { ...runningState, ...parsed.payload };
          }
        } catch {
          console.warn("No structured profile could be loaded from local storage. Starting blank canvas mapping.");
        }
      }

      const originalBrowserKeys = Object.keys(runningState);
      console.log(`• Count: ${originalBrowserKeys.length} items currently initialized in this browser.`);
      console.log(`• Statuses:`, Object.entries(runningState).map(([k, v]) => `${k.substring(0, 4)}...: ${v.unlocked ? 'Unlocked' : 'Locked'}`));
      console.groupEnd();

      // --- 2. PARSE AND LOG THE ENCODED BACKUP FILE CONTENTS ---
      console.group("📂 Dimension 2: Decoding Binary Save File Packets");
      const decoder = new TextDecoder();
      const payloadView = new DataView(payloadBytes.buffer, payloadBytes.byteOffset, payloadBytes.byteLength);
      let offset = 0;
      let recordsParsedFromFileCount = 0;

      while (offset < payloadBytes.length) {
        const unlocked = payloadView.getUint8(offset + 0) === 1;
        const titleLength = payloadView.getUint32(offset + 1, true);
        const keyLen = payloadView.getUint16(offset + 5, true);
        const pathLen = payloadView.getUint16(offset + 7, true);

        const keyStart = offset + 9;
        const keyEnd = keyStart + keyLen;
        const pathStart = keyEnd;
        const pathEnd = pathStart + pathLen;

        const key = decoder.decode(payloadBytes.subarray(keyStart, keyEnd));
        const path = decoder.decode(payloadBytes.subarray(pathStart, pathEnd));

        if (key) {
          recordsParsedFromFileCount++;
          console.log(`[Packet #${recordsParsedFromFileCount}] Parsed key fingerprint token: "${key.substring(0, 5)}...[len: ${key.length}]" | Unlocked: ${unlocked} | Path: "${path}"`);

          // Merge file record directly on top of our live progress canvas tracker matrix
          runningState[key] = { unlocked, path, titleLength };
        }

        offset = pathEnd;
      }
      console.log(`📦 Parse looping concluded. Processed ${recordsParsedFromFileCount} total record blocks from the file.`);
      console.groupEnd();

      // --- 3. EVALUATE THE FINAL COMBINED UNION LAYOUT SHEET ---
      console.group("🎯 Dimension 3: Resulting Combined Union Layout Blueprint");
      const finalCombinedKeys = Object.keys(runningState);
      console.log(`• Final combined dataset contains: ${finalCombinedKeys.length} total tracking nodes.`);

      const newKeysAdded = finalCombinedKeys.filter(k => !originalBrowserKeys.includes(k));
      console.log(`• Brand new keys successfully injected via file: ${newKeysAdded.length}`);
      if (newKeysAdded.length > 0) {
        console.log(`• Injected items preview:`, newKeysAdded.map(k => `${k.substring(0, 5)}...`));
      } else {
        console.warn(`⚠️ Warning: 0 brand new tracking nodes were merged into your browser dataset. The keys in the file matched existing ones perfectly.`);
      }
      console.groupEnd();

      console.log("🚀 Mapping Complete. Passing data array out to execution saving pipeline.");
      console.groupEnd();
      return runningState;

    } catch (e) {
      console.error("❌ Diagnostic Pipeline Failure: Processing crashed inside loop mechanism:", e);
      console.groupEnd();
      return null;
    }
  }

  /**
   * 📤 Exporter
   */
  public exportToFile(state: EggState): void {
    const encoder = new TextEncoder();
    const recordBuffers: Uint8Array[] = [];

    for (const [key, val] of Object.entries(state)) {
      if (!key) continue;
      const keyBytes = encoder.encode(key);
      const pathBytes = encoder.encode(val.path);

      const recBuffer = new Uint8Array(9 + keyBytes.length + pathBytes.length);
      const recView = new DataView(recBuffer.buffer, recBuffer.byteOffset, recBuffer.byteLength);

      recView.setUint8(0, val.unlocked ? 1 : 0);
      recView.setUint32(1, val.titleLength, true);
      recView.setUint16(5, keyBytes.length, true);
      recView.setUint16(7, pathBytes.length, true);

      recBuffer.set(keyBytes, 9);
      recBuffer.set(pathBytes, 9 + keyBytes.length);

      recordBuffers.push(recBuffer);
    }

    const totalPayloadLen = recordBuffers.reduce((acc, b) => acc + b.length, 0);
    const payloadBytes = new Uint8Array(totalPayloadLen);
    let pOffset = 0;
    for (const buf of recordBuffers) {
      payloadBytes.set(buf, pOffset);
      pOffset += buf.length;
    }

    const fingerprint = this.calcIntSig(payloadBytes);
    const header = new Uint8Array(11);

    header[0] = 0;
    header[1] = 212;
    header[2] = 255;
    header[3] = 255;
    header[4] = 0;
    header[5] = 50;
    header[6] = 1;

    const hView = new DataView(header.buffer, header.byteOffset, header.byteLength);
    hView.setUint32(7, fingerprint, true);

    const binaryFile = new Uint8Array(header.length + payloadBytes.length);
    binaryFile.set(header, 0);
    binaryFile.set(payloadBytes, header.length);

    const blob = new Blob([binaryFile], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${getTimestamp()}-progress-sav.eggfvs`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}