import { ZipReader, HttpRangeReader, BlobWriter } from 'https://esm.unpkg.com/@zip.js/zip.js';

// Use a type alias instead of an interface to handle the flexible shape safely
type CustomZipEntry = {
  filename: string;
  getData: (writer: BlobWriter) => Promise<Blob>;
};

let zipReaderInstance: ZipReader<unknown> | null = null;
const ZIP_URL = '/assets/music.zip'; 

/**
 * Initializes and caches the single ZipReader instance using true HTTP Range Slicing.
 * This tells the browser to request exact byte coordinates rather than streaming the full file.
 */
async function getZipReader(): Promise<ZipReader<unknown>> {
  if (!zipReaderInstance) {
    // 🔑 THE BYTE-SLICE FIX: Swapped HttpReader for HttpRangeReader
    const httpRangeReader = new HttpRangeReader(ZIP_URL);
    zipReaderInstance = new ZipReader(httpRangeReader);
  }
  return zipReaderInstance;
}

/**
 * Surgically extracts a single track from the 1.49GB zip file on demand.
 * Integrates an instant cache layer to bypass extraction logic on repeat plays.
 */
export async function fetchAudioFromZip(albumName: string, trackName: string): Promise<string> {
  try {
    const targetPath = `${albumName}/${trackName}`;
    const fakeUrl = `/assets/music/${targetPath}`; // Unique structural key for our Cache storage

    // 1. APPLICATION CACHE LOOKUP: Check if this track was already extracted
    const musicCache = await caches.open('app-music-cache');
    const cachedResponse = await musicCache.match(fakeUrl);
    
    if (cachedResponse) {
      const cachedBlob = await cachedResponse.blob();
      console.log(`⚡ Instant Cache Hit: Serving ${trackName} instantly.`);
      return URL.createObjectURL(cachedBlob); 
    }

    // 2. EXTRACTION FALLBACK: Fetch only the specific song data slices over the network
    const reader = await getZipReader();
    
    // Cast entries to any first, then to our strict shape to bypass library type bugs
    const entries = (await reader.getEntries() as any) as CustomZipEntry[];
    
    const targetEntry = entries.find(entry => entry.filename && entry.filename.endsWith(targetPath));

    if (!targetEntry) {
      throw new Error(`Target track layout missing in zip matrix: ${targetPath}`);
    }

    if (typeof targetEntry.getData !== 'function') {
      throw new Error(`Target entry is not an extractable file: ${targetPath}`);
    }

    console.log(`🎯 Cache Miss: Querying precise byte fragments for: ${targetPath}`);
    const audioBlob = await targetEntry.getData(new BlobWriter());

    // 3. CACHE HYDRATION: Save the freshly extracted standalone audio blob for next time
    const responseToCache = new Response(audioBlob, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBlob.size.toString()
      }
    });
    await musicCache.put(fakeUrl, responseToCache);
    
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("🚨 Zip Stream Interface Extraction Error:", error);
    throw error;
  }
}