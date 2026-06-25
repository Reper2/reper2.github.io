// No flying high, this zipper stays up
import { zipSync } from 'https://cdn.jsdelivr.net/npm/fflate@0.8.2/+esm';
import { Database, Background } from '../lib/db-typings';

type TraversableNode = Database.ParentObj | Database.Obj1 | Database.File;

/**
 * Recursively parses individual database node objects into a flat key-value registry.
 * Key: "zip/internal/path/filename.ext"
 * Value: "absolute/or/relative/fetch/endpoint/filename.ext"
 */
export function flattenDatabaseTree(
  node: TraversableNode,
  currentPath = '',
  baseUrl = '/'
): Record<string, string> {
  const flatMap: Record<string, string> = {};

  // Clean up directory root names (like '.' or empty strings) so they don't break the ZIP root path
  const folderSegment = node.name === '.' ? '' : node.name;
  const newPath = currentPath 
    ? (folderSegment ? `${currentPath}/${folderSegment}` : currentPath)
    : folderSegment;

  // 1. Handle folders (Database.ParentObj or Database.Obj1) containing further nested arrays
  if ('contents' in node && Array.isArray(node.contents)) {
    for (const child of node.contents) {
      Object.assign(flatMap, flattenDatabaseTree(child, newPath, baseUrl));
    }
  } 
  // 2. Handle leaf elements (Database.File)
  else if (node.type === 'file') {
    // 💡 FIX: Restored the proper filename appending layout structure
    const fileZipPath = currentPath ? `${currentPath}/${node.name}` : node.name;
    flatMap[fileZipPath] = `${baseUrl}${node.name}`;
  }

  return flatMap;
}

/**
 * Orchestrator that accepts a complete Background database mapping object,
 * verifies count integrity, fetches the targets concurrently, and generates a client-side ZIP Blob.
 */
export async function compileZipFromDatabase(
  db: Background.DatabaseStructure,
  fileBaseUrl: string
): Promise<Blob> {
  const fileRegistry: Record<string, string> = {};

  // Loop through each game album key within the DatabaseStructure map
  for (const gameKey in db) {
    const tuple = db[gameKey] as unknown; // Cast dynamically to inspect individual entry arrays

    if (!Array.isArray(tuple)) continue;

    const directoryData = tuple[0] as TraversableNode | undefined;
    if (!directoryData) continue;

    // 💡 FIX: Safely guard against flat layouts (like photos.json) that have no report block at tuple[1]
    const metadataReport = tuple[1] as Database.Obj2 | undefined;

    if (metadataReport && typeof metadataReport === 'object' && 'files' in metadataReport) {
      // If metadata report is present, validate file count consistency
      if ('contents' in directoryData && Array.isArray(directoryData.contents)) {
        if (metadataReport.files !== directoryData.contents.length) {
          console.warn(`File count mismatch skipped for key: ${gameKey}`);
          continue;
        }
      }
    }

    // Process the individual directory contents using the recursive flattener
    Object.assign(fileRegistry, flattenDatabaseTree(directoryData, gameKey, fileBaseUrl));
  }

  const zipData: Record<string, Uint8Array> = {};

  // Fire all network asset downloads concurrently to maximize browser pipeline efficiency
  await Promise.all(
    Object.entries(fileRegistry).map(async ([zipPath, fetchUrl]) => {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file asset: ${fetchUrl} (${response.statusText})`);
      }
      const buffer = await response.arrayBuffer();
      zipData[zipPath] = new Uint8Array(buffer);
    })
  );

  // Compress the fully prepared in-memory assets into standard ZIP architecture
  const zippedBuffer = zipSync(zipData);
  return new Blob([zippedBuffer], { type: 'application/zip' });
}