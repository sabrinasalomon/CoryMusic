# Setup

Everything here is free. Target hardware: **MacBook Neo** (macOS Tahoe) and **iPhone 17** (iOS 26).

## 1. Install tools
1. Install the latest **Xcode** (iOS 26 SDK or later) from the Mac App Store and open it once.
2. Sign in: **Xcode → Settings → Accounts → + → Apple ID**. A free *Personal Team* is created.
3. Optional: the **SF Symbols** app from Apple's developer site. Icon Composer is included with Xcode: **Xcode → Open Developer Tool → Icon Composer**.

### MacBook Neo tips (8 GB RAM)
- Prefer running on the iPhone 17 over simulators; avoid downloading extra simulator runtimes.
- Close memory-heavy apps while building.
- Keep 40 GB or more free; clear old DerivedData from **Xcode → Settings → Locations** if space runs low.

## 2. Clone the repository
Clone into `~/Developer` so the paths match the auto-renew script:
```bash
mkdir -p ~/Developer
git clone https://github.com/sabrinasalomon/CoryMusic.git ~/Developer/CoryMusic
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
3. Save it **inside** `~/Developer/CoryMusic` and uncheck *Create Git repository* (the repo already exists).
4. Create groups: `App`, `DesignSystem`, `Models`, `Services`, `ViewModels`, `Views`, `Resources`.
5. **Minimum Deployments → iOS 26.0**.

## 4. App icon
1. Drag `design/icon/CoryMusic.icon` into the Xcode project navigator (enable *Copy items if needed* only if you want a copy inside the target folder).
2. Target → **General → App Icons and Launch Screen → App Icon**: `CoryMusic`.
3. Optional: double-click `CoryMusic.icon` to open it in Icon Composer and review Default, Dark, Clear and Tinted.

## 5. Localization (English + Spanish)
1. Project → **Info → Localizations** → **+** → **Spanish (es)**. English stays the development language.
2. **File → New → File → String Catalog** → `Localizable.xcstrings` in `Resources`.
3. Write UI text in English in code (`Text("Your collection")`); Xcode collects the strings on build.
4. Fill in Spanish translations in the String Catalog using the glossary in [DESIGN.md](DESIGN.md#9-naming-glossary-ui-copy).
5. Test Spanish on the iPhone: **Settings → Apps → CoryMusic → Language → Español**.

## 6. Capabilities, Info.plist and appearance
1. **Signing & Capabilities → + Capability → Background Modes** → check **Audio, AirPlay, and Picture in Picture**.
2. **Info** tab → add:
   | Key | Type | Value |
   |---|---|---|
   | `UIFileSharingEnabled` | Boolean | YES |
   | `LSSupportsOpeningDocumentsInPlace` | Boolean | YES |
3. Force dark appearance at the root view with `.preferredColorScheme(.dark)` (see [DESIGN.md](DESIGN.md)).

## 7. Auto-renew every 7 days

Free-provisioned apps expire after 7 days. Re-installing over the existing app **keeps all data, playlists and imported music**.

> ⚠️ Never delete the app and never change the bundle identifier — either erases the app's data. Backups in your chosen folder outside the app are not affected.

### Option A — Script + launchd
1. Find your iPhone identifier:
   ```bash
   xcrun devicectl list devices
   ```
2. Edit [`scripts/renew-corymusic.sh`](../scripts/renew-corymusic.sh): set `UDID`.
3. Edit [`scripts/com.sabrinasalomon.renew-corymusic.plist`](../scripts/com.sabrinasalomon.renew-corymusic.plist): replace `YOUR_MAC_USER`.
4. Install:
   ```bash
   chmod +x ~/Developer/CoryMusic/scripts/renew-corymusic.sh
   cp ~/Developer/CoryMusic/scripts/com.sabrinasalomon.renew-corymusic.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/com.sabrinasalomon.renew-corymusic.plist
   ```
5. At run time the Mac must be awake (or it runs on wake), the iPhone on the same Wi-Fi and unlocked or charging, and your Apple ID signed in to Xcode. If the login keychain is locked, signing can fail — check `/tmp/renew-corymusic.log` and run the script manually once.

### Option B — AltStore
AltServer on the Mac + AltStore on the iPhone refresh the app in the background on the same Wi-Fi. Export the app as `.ipa` and install it through AltStore. It asks for an Apple ID — consider a secondary one.

## 8. Run on your iPhone
1. Connect the iPhone by cable, unlock it and tap **Trust**.
2. iPhone: **Settings → Privacy & Security → Developer Mode → On** (restart).
3. Select the iPhone 17 as run destination and press **⌘R**.
4. First run: **Settings → General → VPN & Device Management →** your Apple ID **→ Trust**.
5. Optional: **Window → Devices and Simulators → Connect via network** for Wi-Fi installs.

## 9. Habits
- Choose the **backup folder** the first time the app asks, outside the app (e.g. *On My iPhone › CoryMusic Backups*).
- Keep audio out of Git (`.gitignore` already does it).
- Never add third-party attribution or watermarks to commits, code or docs.
