import { Database, Background, Music, Grass } from "../../lib/db-typings";
import { VersionData } from "./interfaces";

/**
 * Reusable abstract layer for loading terminal-generated tree JSON structures.
 * T represents the final storage format (e.g., an Array or a Dictionary Map).
 */
abstract class AbstractDatabaseLoader<T> {
  protected basePath: string;

  constructor(basePath: string = "/app/databases") {
    this.basePath = basePath.replace(/\/+$/, ""); // Trim trailing slashes safely
  }

  /**
   * Primary network engine: Fetches any singular JSON artifact matching strict generic constraints.
   */
  public async fetchDB<R>(filename: string): Promise<R> {
    const cleanFilename = filename.replace(/\.json$/i, "");
    const response = await fetch(`${this.basePath}/${cleanFilename}.json`);

    if (!response.ok) {
      throw new Error(`[DatabaseLoader] HTTP Exception matching target resource "${cleanFilename}": ${response.statusText}`);
    }

    return response.json() as Promise<R>;
  }

  /**
   * Abstract contract forcing sub-classes to choose how they process and bundle their records.
   */
  public abstract loadRegistry(): Promise<T>;
}


export class BackgroundDatabaseLoader extends AbstractDatabaseLoader<Background.DatabaseStructure> {
  /**
   * Compiles the full background catalog registry map.
   */
  public override async loadRegistry(): Promise<Background.DatabaseStructure> {
    const composite = await this.loadWithMetadata();
    return composite.db;
  }
  /**
   * Fetches the catalog and returns both the structured database mapping 
   * AND the array of game keys extracted dynamically from the master file list.
   */
  public async loadWithMetadata(): Promise<{ db: Background.DatabaseStructure; game: string[] }> {
    // 1. Fetch the master catalog layout index (bg.json)
    // Master tree acts as a tuple: [Obj1 (contents array), Obj2 (report counts)]
    const masterCatalog = await this.fetchDB<any>("bg");

    // Check if the payload returned is actually structural data
    if (!masterCatalog || typeof masterCatalog !== "object" || !Array.isArray(masterCatalog)) {
      throw new Error("[BackgroundDatabaseLoader] Unexpected flat or malformed schema parsing index.");
    }
    const fileEntries = masterCatalog[0].contents;

    // 2. Generate your dynamic 'game' names array by trimming out extensions
    const dynamicGameKeys = fileEntries.map((fileObj: Database.File) => {
      return fileObj.name.replace(/\.[^/.]+$/, ""); // Converts "acnh.json" -> "acnh"
    });

    // 3. Batch dispatch network stream operations concurrently for games
    const dispatchRequests = fileEntries.map(async (fileObj: Database.File) => {
      const gameKey = fileObj.name.replace(/\.[^/.]+$/, "");
      try {
        const payload = await this.fetchDB<[Database.Obj1, Database.Obj2]>(`backgrounds/${gameKey}`);
        return { key: gameKey, data: payload };
      } catch (err) {
        console.error(`[BackgroundDatabaseLoader] Skipping tree file "backgrounds/${gameKey}":`, err);
        return null;
      }
    });

    // 🌟 Fetch the flat photos.json for holidays concurrently alongside your games
    const holidayRequest = this.fetchDB<[Database.Obj1, Database.Obj2]>("photos")
      .then((payload) => ({ key: "holidays", data: payload }))
      .catch((err) => {
        console.error(`[BackgroundDatabaseLoader] Skipping standalone holiday "photos.json":`, err);
        return null;
      });

    const resolvedPayloads = await Promise.all([...dispatchRequests, holidayRequest]);

    // 4. Reduce payloads into the Background.DatabaseStructure map
    const mappedDatabase: Background.DatabaseStructure = {};
    for (const item of resolvedPayloads) {
      if (item !== null) {
        mappedDatabase[item.key] = item.data;
      }
    }

    return {
      db: mappedDatabase,
      game: dynamicGameKeys // Fully dynamic tracking string array compiled from the filesystem index!
    };
  }
}

/**
 * Dedicated Loader for the Music catalog array matrix
 */
export class MusicDatabaseLoader extends AbstractDatabaseLoader<Music.DatabaseStructure> {
  public override async loadRegistry(): Promise<Music.DatabaseStructure> {
    return this.fetchDB<Music.DatabaseStructure>("music");
  }
}

/**
 * Dedicated Loader for the Grass asset directory files
 */
export class GrassDatabaseLoader extends AbstractDatabaseLoader<Grass.Config["db"]> {
  public override async loadRegistry(): Promise<Grass.Config["db"]> {
    return this.fetchDB<Grass.Config["db"]>("grass");
  }
}

export class VersionLoader extends AbstractDatabaseLoader<VersionData> {
  /**
   * Fetches the absolute latest deployment metadata utilising the core engine path.
   */
  public override async loadRegistry(): Promise<VersionData> {
    try {
      // 1. Manually build the correct cache-busting URL string using the inherited basePath
      const cleanUrl = `${this.basePath}/version.json?cb=${Date.now()}`;
      
      // 2. Fetch directly here to guarantee the query parameter stays at the absolute end
      const response = await fetch(cleanUrl);

      if (!response.ok) {
        throw new Error(`[VersionLoader] HTTP Exception matching target resource: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn("Could not retrieve live network build timestamp. Defaulting fallback setup.");
      return { timestamp: "Offline/Unknown" };
    }
  }
}