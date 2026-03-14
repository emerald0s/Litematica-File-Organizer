/**
 * LITEMATIC FILE ORGANIZER
 *
 * ## ⚙️ CONFIGURATION
 * ---------------------------------------------------------
 * TARGET_FOLDER: Path relative to the browser's default 'Downloads' directory.
 * (e.g., "Minecraft/Schematics"). Default: "schematics"
 *
 * CONFLICT_ACTION: File collision behavior:
 * - "uniquify": (Default) Appends a counter (e.g., house(1).litematic).
 * - "overwrite": Replaces the existing file.
 * - "prompt": Prompts the user for action.
 *
 * FILE_EXTENSIONS: A list of file types to intercept and organize.
 * Format: [".type1", ".type2"] - must include the leading dot.
 */
const CONFIG = {
  TARGET_FOLDER: "schematics",
  CONFLICT_ACTION: "uniquify",
  FILE_EXTENSIONS: [".litematic"]
};

const api = typeof browser !== "undefined" ? browser : chrome;

/**
 * ## 🧠 CORE LOGIC & FALLBACK MECHANISM
 * ---------------------------------------------------------
 * Firefox-based browsers restrict extensions from pausing downloads
 * prior to initialization. To bypass this sandbox limitation, this
 * script utilizes an asynchronous "Catch or Cleanup" architecture:
 *
 * 1. Interception: Attempts to instantly cancel the native download
 * and trigger a rerouted request to the target directory.
 * 2. Cleanup Fallback: If the extension is suspended (idle) or the
 * file downloads too rapidly to intercept, a secondary copy is
 * routed correctly, and the stray original is silently purged.
 *
 * ## ⚠️ TECHNICAL LIMITATIONS
 * ---------------------------------------------------------
 * - Security Sandbox: Output is strictly confined within the default
 * `~/Downloads` directory. External absolute paths are blocked.
 * - Expiring Tokens: If a source URL utilizes single-use authentication
 * (e.g., Discord attachments) and the interception fails, the fallback
 * preserves the original file to prevent data loss.
 */
api.downloads.onCreated.addListener((item) => {
  // Bypass interception for downloads initiated by this script.
  if (item.byExtensionId === api.runtime.id) {
    return;
  }

  const downloadUrl = item.finalUrl || item.url;
  const filename = item.filename ? item.filename.split(/[\\/]/).pop() : "";
  const lowerFilename = filename.toLowerCase();

  // Check if the incoming file matches the specified target extensions.
  const isTargetFile = CONFIG.FILE_EXTENSIONS.some(ext => lowerFilename.endsWith(ext.toLowerCase()));

  if (isTargetFile) {
    const finalPath = CONFIG.TARGET_FOLDER ? `${CONFIG.TARGET_FOLDER}/${filename}` : filename;

    // Attempt to cancel the default download process immediately.
    api.downloads.cancel(item.id).then(() => {
      // Interception successful. Trigger the rerouted download.
      triggerReroute(downloadUrl, finalPath);

    }).catch(() => {
      // Triggered if the extension was suspended or the file downloaded too rapidly.
      console.warn("Litematic Organizer: Interception missed. Initializing cleanup fallback...");

      triggerReroute(downloadUrl, finalPath).then(() => {
        // Reroute successful. Purge the stray original file from disk and history.
        api.downloads.removeFile(item.id).catch(() => {});
        api.downloads.erase({ id: item.id }).catch(() => {});
      }).catch(err => {
        // Reroute failed (e.g., expired token). Preserve the original file safely.
        console.error("Litematic Organizer: Reroute failed. Preserving original file.", err);
      });
    });
  }
});

// Subroutine to initialize the modified download request
function triggerReroute(url, finalPath) {
  return api.downloads.download({
    url: url,
    filename: finalPath,
    conflictAction: CONFIG.CONFLICT_ACTION
  });
}