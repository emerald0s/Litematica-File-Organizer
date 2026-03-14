# ⚠️ Critical Bug Notice

**The current published release contains a fatal bug that breaks the extension.**

**Please wait for a fix**

Status: Waiting on Mozilla signature.



# Litematica File Organizer 
### Note that this extension works only on firefox based browsers if you are looking for the Chromium browsers version (Chrome, Edge, Brave etc...) [Check this repo](https://github.com/MCodex-org/litematic-organizer)

#### A firefox extension that automatically sorts `.litematic` files into a specified subfolder.

While this guide specifically mentions Firefox, this extension is compatible with any firefox based browsers such as  zen and librewolf. 

# 🚀 Usage

![Litematic Organizer Demo](assets/working%20demonstration.gif)

Normally when you download `.litematic` files it is automatically saved into your **Downloads** folder unless spesifed otherwise.

what this extension does is that it detects all .`litematic` downloads and moves them to a spesifed subfolder. being `~/Downloads/schematics/` by default with an option to select a [custom directory](#custom-installation).

# 📥 Installation & Setup Guide
### The setup involves 2 steps:
#### 1. [Configuring litematica](#Litematica-Setup)
#### 2. [installing the extension](#Standard-Installation)


# Litematica setup
1. Open **Litematica settings menu**.
2. In the **generic tab** set `customSchematicBaseDirectoryEnabled` to **enabled**.
3. In the same tab set `customSchematicBaseDirectory` to `~/Downloads/schematics`.

---
This extension is currently not on the Firefox Add-on Store. You can install it by following the steps below.

## Standard Installation

Use this if you are happy with the default Configuration of the extension: sorting only ` .litematic` files, the directory being `~/Downloads/schematics/`, and renaming duplicate files.

1. Go to the [releases](https://github.com/emerald0s/Litematica-File-Organizer/releases) page and download the latest `.xpi` file.
2. In the top right a popup should appear with a **"Continue to Installation"** button simply click it to install.
3. If a popup did not appear you can type `about:addons` in the address bar. there you can drag and drop the `.xpi` file that should make the popup appear.

## Custom Installation

#### ⚙️ Possible Configurations

1. **Subfolder & Directory:** You can change the target folder name and path. While it must remain within the **~Downloads** directory, you can still set the path to be `downloads/minecraft/schematic` for example.

2. **Duplicate File Behavior:** You can choose how the extension handles files with the same name (e.g., overwriting, adding a number, or prompting).

3. **File Type Rerouting:** You can define exactly which file types (such as .litematic, .nbt, or .schem) are automatically moved to your specified folder.

## Important ⚠️
#### due to security reasons Firefox can only save to the `~/Downloads` folder. any subfolder that you specify will be in there. you should also know that unless you submit the modified extension to mozilla you have to reinstall the extension after every Firefox restart therefore its not recommended to use this installation.

Because the signed version isnt available for editing you have to modify the source code yourself to change these settings.


1. Download the source by clicking the green **<>Code** button on the top right.
2. Select **Download ZIP**.
3. Unzip the folder and open `extension/background.js`.
4. In there you will find the code as well as the configuration guide.
5. change your desired configurations and make sure to save them.
6. In Firefox address bar type `about:debugging#/runtime/this-firefox`.
7. Click on **"Load Temporary Add-on...".** and select the `manifest.json` file.

#### Note that if you are using this setup you have to change your litematica `customSchematicBaseDirectory` setting accordingly.

## 📌 Recommendations
It is recommended to remove any .litematic files from your `~/Downloads` folder to prevent any name mismatch.

it is also recommended to check if there is any folder in `~/Downloads` named **"schematics"**. if so the extension will place the litematic files in this pre-existing folder which might cause you some problems with file categorizing.

## ⚙️ How It Works

The Litematic File Organizer functions as an automated traffic controller for Firefox's download manager. When a download is initiated, the extension intercepts the request to analyze the file type. if it matches a targeted format like .litematic by default, the extension immediately cancels the original download. then automatically triggers a new download request for the same file, but redirected into your specified subfolder. This "cancel and restart" approach is necessary because Firefox has strict security rules that prevent extensions from simply moving a file while it is already in progress. By starting a fresh request, the extension can bypass these limits and ensure your files land exactly where they belong.

---
## ⚠️ Known Limitations
This extension is subject to the security and performance boundaries of Firefox. Due to security reasons, the extension is strictly limited to the `~Downloads` directory and cannot natively save files to external locations like your `.minecraft` folder. Users should also be aware that "single-use" download links may fail, as the server's security tokens may block the extension’s second attempt to route the file. Additionally, if a download is exceptionally small or your connection is very fast, a "race condition" can occur where the browser completes the initial download before the cancellation triggers, occasionally resulting in a duplicate copy in both your main folder and your targeted subfolder.

# Support
#### if you encounter any problems you can either [submit an issue through GitHub](https://github.com/emerald0s/Litematica-File-Organizer/issues) or contact me through discord: emerald0s
# Credits

---
### Concept by: [MCodex](https://github.com/MCodex-org)

### Shoutout to Gemini
