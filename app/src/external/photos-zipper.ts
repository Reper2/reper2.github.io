import { compileZipFromDatabase } from '../zipper';
import { Background } from '../../lib/db-typings';
import { BackgroundDatabaseLoader } from '../core/';

/**
 * Attaches a ZIP generation and download workflow to an existing DOM anchor element.
 */
export function setupZipDownloadHandler(
  anchorElement: HTMLAnchorElement,
  database: Background.DatabaseStructure,
  fileBaseUrl: string = '/holiday-album/photos/'
): void {
  
  anchorElement.addEventListener('click', async (event) => {
    // 1. Prevent the default layout link execution (or page refreshes)
    event.preventDefault();

    // Visual feedback indicator to let the user know it's compiling
    const originalText = anchorElement.textContent;
    anchorElement.textContent = 'Compiling ZIP...';
    anchorElement.style.pointerEvents = 'none';

    try {
      // 2. Compile your tree JSON structure files into a ZIP binary stream
      const zipBlob = await compileZipFromDatabase(database, fileBaseUrl);

      // 3. Generate an internal DOM lifecycle URL pointing to the in-memory payload
      const downloadUrl = URL.createObjectURL(zipBlob);

      // 4. Create a separate virtual link to handle the hardware file stream safely
      // This bypasses the infinite loop bug entirely!
      const virtualLink = document.createElement('a');
      virtualLink.href = downloadUrl;
      virtualLink.download = 'photos-album-bundle.zip';
      
      // Append, execute, and discard immediately without triggering any events on anchorElement
      document.body.appendChild(virtualLink);
      virtualLink.click();
      document.body.removeChild(virtualLink);

      // 5. Clean up memory allocations smoothly
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 150);

    } catch (error) {
      console.error("Failed to process and build database package archive:", error);
      alert("An error occurred while preparing your download.");
    } finally {
      // Restore initial interactive properties to your anchor layout
      anchorElement.textContent = originalText;
      anchorElement.style.pointerEvents = 'auto';
    }
  });
}

// --- Lifecycle Orchestration ---
// Grab your HTML's pre-existing download anchor element
const downloadLink = document.getElementById("downloadLink") as HTMLAnchorElement | null;

if (downloadLink) {
  try {
    // Instantiate your loader to pull down the standalone holiday layout catalog
    const loader = new BackgroundDatabaseLoader();
    
    // fetchDB returns a Promise, so we resolve it natively using a then block
    loader.fetchDB<any>("photos").then((rawPhotosData) => {
      
      // Map it into a clean Background.DatabaseStructure structure matching zipper expectations
      const structureMap: Background.DatabaseStructure = {
        holidays: rawPhotosData
      };

      // Initialize the download listener block securely
      setupZipDownloadHandler(downloadLink, structureMap);
      console.log("📁 ZIP download handler securely mounted to the DOM layout.");
    });
  } catch (initError) {
    console.error("Initialization failure mounting zipper hooks:", initError);
  }
}