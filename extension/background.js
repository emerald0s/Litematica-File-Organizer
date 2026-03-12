/**
 * LITEMATIC FILE ORGANIZER - Background Script
 * * ## ⚙️ CONFIGURATION
 * ---------------------------------------------------------
 * TARGET_FOLDER: Path relative to your 'Downloads' folder.
 * (e.g., "Minecraft/Schematics"). Default: ~/Downloads/schematics/
 * * CONFLICT_ACTION: What to do if a file with the same name exists:
 * - "uniquify": (Default) Adds a number (e.g., house(1).litematic).
 * - "overwrite": Replaces the old file with the new one.
 * - "prompt": The browser will ask you what to do.
 * * FILE_EXTENSIONS: List of file types to organize.
 * Format: [".type1", ".type2"] - include dots and commas.
 */
const CONFIG = {
  TARGET_FOLDER: "schematics",
  CONFLICT_ACTION: "uniquify",
  FILE_EXTENSIONS: [".litematic"]
};

/**
 * ## 🧠 LOGIC
 * ---------------------------------------------------------
 * The Litematic File Organizer operates by intercepting the browser's
 * native download process in real-time. When a download is initiated,
 * the extension captures the event and scans the filename for targeted
 * extensions (such as `.litematic`).
 * * If a match is found, the extension immediately cancels the initial
 * download request before the file can be written to the default directory.
 * It then programmatically triggers a new download using the original
 * source URL, but with a modified destination path that includes your
 * specified subfolder.
 * * To ensure stability and prevent infinite loops, the extension checks
 * the `byExtensionId` property. If the download was triggered by this
 * extension, it bypasses the interceptor and completes successfully.
 * * ## ⚠️ KNOWN LIMITATIONS
 * ---------------------------------------------------------
 * - DUPLICATE FILES: If a download is too fast/small, the browser may
 * finish before the cancel triggers. You may see two copies.
 * - ONE-TIME LINKS: Single-use tokens may block the 2nd attempt.
 * - Security Limitations: Can ONLY move files INSIDE '~Downloads'.
 */

const api = typeof browser !== "undefined" ? browser : chrome;

api.downloads.onCreated.addListener((item) => {
  // 1. INFINITE LOOP PREVENTION
  // If OUR extension started this download, ignore it and let it save safely.
  if (item.byExtensionId === api.runtime.id) {
    return;
  }

  const downloadUrl = item.finalUrl || item.url;
  const filename = item.filename ? item.filename.split(/[\\/]/).pop() : "";
  const lowerFilename = filename.toLowerCase();

  // 2. CHECK FILE TYPE
  const isTargetFile = CONFIG.FILE_EXTENSIONS.some(ext => lowerFilename.endsWith(ext.toLowerCase()));

  if (isTargetFile) {

    // 3. CANCEL THE ORIGINAL DOWNLOAD
    api.downloads.cancel(item.id).then(() => {

      const finalPath = CONFIG.TARGET_FOLDER ? `${CONFIG.TARGET_FOLDER}/${filename}` : filename;

      // 4. TRIGGER THE REROUTED DOWNLOAD
      api.downloads.download({
        url: downloadUrl,
        filename: finalPath,
        conflictAction: CONFIG.CONFLICT_ACTION
      }).catch(err => {
        console.error("Litematic Organizer: Rerouted download failed.", err);
      });

    }).catch(err => {
      // If the file was incredibly small and finished before we could cancel it
      console.warn("Litematic Organizer: Original download finished too fast to cancel.");
    });
  }
});