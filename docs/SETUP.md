# Setup

Everything here is free. You need a Mac, an iPhone (iOS 17+) and an Apple ID.

## 1. Install tools
1. Install **Xcode** from the Mac App Store and open it once to install components.
2. Sign in: **Xcode → Settings → Accounts → +  → Apple ID**. A *Personal Team* is created for free.

## 2. Clone the repository
```bash
git clone https://github.com/sabrinasalomon/CoryMusic.git
cd CoryMusic
```

## 3. Create the Xcode project
1. **File → New → Project → iOS → App**.
2. Fill in:
   | Field | Value |
   |---|---|
   | Product Name | `CoryMusic` |
   | Team | *Your Name (Personal Team)* |
   | Organization Identifier | `com.sabrinasalomon` |
   | Bundle Identifier | `com.sabrinasalomon.corymusic` ← **never change it** |
   | Interface | SwiftUI |
   | Language | Swift |
   | Storage | SwiftData |
3. Save it **inside the cloned `CoryMusic` folder**, uncheck *Create Git repository* (the repo already exists).
4. Create groups matching the structure: `App`, `Models`, `Services`, `ViewModels`, `Views`, `Resources`.
5. Set **Minimum Deployments → iOS 17.0**.

## 4. Capabilities & Info.plist
1. Target → **Signing & Capabilities → + Capability → Background Modes** → check **Audio, AirPlay, and Picture in Picture**.
2. Target → **Info** → add:
   | Key | Type | Value |
   |---|---|---|
   | `UIFileSharingEnabled` (Application supports iTunes file sharing) | Boolean | YES |
   | `LSSupportsOpeningDocumentsInPlace` (Supports opening documents in place) | Boolean | YES |

## 5. Run on your iPhone
1. Connect the iPhone by cable, unlock it and tap **Trust**.
2. On the iPhone: **Settings → Privacy & Security → Developer Mode → On** (restart required).
3. Select the iPhone as run destination and press **⌘R**.
4. First run only: **Settings → General → VPN & Device Management →** your Apple ID **→ Trust**.
5. Optional: **Window → Devices and Simulators →** select the iPhone **→ Connect via network** to install over Wi-Fi.

## 6. Auto-renew every 7 days

Free-provisioned apps expire after 7 days. Re-installing over the existing app **keeps all data and playlists**.

> ⚠️ Never delete the app from the iPhone and never change the bundle identifier — either one erases the app's data.

### Option A — Script + launchd (no extra software)
1. Find your iPhone identifier:
   ```bash
   xcrun devicectl list devices
   ```
2. Edit [`scripts/renew-corymusic.sh`](../scripts/renew-corymusic.sh): set `UDID` and paths.
3. Make it executable and install the schedule:
   ```bash
   chmod +x scripts/renew-corymusic.sh
   cp scripts/com.sabrinasalomon.renew-corymusic.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/com.sabrinasalomon.renew-corymusic.plist
   ```
4. Requirements at run time: Mac awake (or it runs on wake), iPhone on the same Wi-Fi and unlocked or charging, Apple ID signed in to Xcode.
5. Logs: `/tmp/renew-corymusic.log`.

### Option B — AltStore
Install **AltServer** on the Mac and **AltStore** on the iPhone; export the app as `.ipa` and install it through AltStore. It refreshes apps in the background when both devices share Wi-Fi. It asks for an Apple ID — consider a secondary one.

## 7. Recommended habits
- Export a **backup** from *Settings* after big playlist changes.
- Keep audio files out of Git (`.gitignore` already does it).
