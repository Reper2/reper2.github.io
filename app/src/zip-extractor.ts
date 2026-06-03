import { HttpReader, ZipReader, BlobWriter } from "https://esm.unpkg.com/@zip.js/zip.js";

/**
 * Dynamically resolves the correct ZIP file from the /assets/music/ directory.
 * Fully type-safe configuration for @zip.js v2+
 * @param fullTrackPath Example: "01_Maniac_Zone/01-opening-theme.mp3"
 */
export async function fetchAudioFromZip(fullTrackPath: string): Promise<string> {
  // 1. Clean the path and split by the slash
  const cleanPath = fullTrackPath.replace(/^\.\//, "");
  const pathParts = cleanPath.split('/');

  if (pathParts.length < 2) {
    throw new Error(`Invalid track path structure: "${fullTrackPath}". It must include a directory.`);
  }

  // 2. Point directly to your /assets/music/ folder structure
  const targetZipName = pathParts[0];
  const targetZipUrl = `./assets/music/${targetZipName}.zip`;

  // 3. Initialize the reader for this specific album archive
  const reader = new HttpReader(targetZipUrl);
  const zipReader = new ZipReader(reader);
  let entries;

  try {
    entries = await zipReader.getEntries();
  } catch (netError) {
    throw new Error(`Could not read "${targetZipUrl}". Make sure the ZIP file exists in /assets/music/`);
  }

  // 4. Find the song inside the ZIP file
  const isolatedFileName = pathParts[pathParts.length - 1];
  const trackEntry = entries.find(entry =>
    entry.filename === cleanPath ||
    entry.filename === fullTrackPath ||
    entry.filename === isolatedFileName
  );

  if (!trackEntry) {
    throw new Error(`Track "${isolatedFileName}" not found inside music/${targetZipName}.zip`);
  }

  // 5. TypeScript Safe Check: Ensure it's a file entry with a getData method
  if ('getData' in trackEntry && typeof trackEntry.getData === 'function') {
    const blobWriter = new BlobWriter();
    const unzippedData = await trackEntry.getData(blobWriter);

    const audioBlob = unzippedData as Blob;

    // Generate and return a local browser runtime URL safely
    return URL.createObjectURL(audioBlob);
  } else {
    throw new Error(`Entry "${isolatedFileName}" inside the ZIP is a directory, not a playable file.`);
  }
}