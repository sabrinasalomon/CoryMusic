# Setup

Run CoryMusic on your iPhone with **Expo Go**, straight from Windows or macOS. Everything here is free.

## 1. Requirements

| Item | Details |
|---|---|
| Computer | Windows or macOS with **Node.js 20+** and **Git** |
| iPhone | iOS 26 (tested on iPhone 17) |
| Expo Go | Free on the App Store — must support **SDK 57** |
| Network | Computer and iPhone on the same Wi-Fi |

## 2. Get the code

```bash
git clone https://github.com/sabrinasalomon/CoryMusic.git
cd CoryMusic/mobile
npm install
```

## 3. Start the development server

```bash
npx expo start --lan
```

A QR code appears in the terminal. Keep this terminal open while you use the app.

**Windows with several network adapters** (VirtualBox, VPNs): tell Expo which IP to use before starting. Replace the address with your computer's Wi-Fi or Ethernet IP:

```bash
$env:REACT_NATIVE_PACKAGER_HOSTNAME="192.168.1.100"
```

## 4. Open it on the iPhone

1. Open the **Camera**, point at the QR code and tap the Expo Go banner — or open **Expo Go** and scan from there.
2. If iOS asks to find devices on your local network, tap **Allow** (**Settings → Privacy & Security → Local Network → Expo Go**).
3. The first load downloads the app bundle; later changes reload automatically.

## 5. Add music

| Method | How |
|---|---|
| **Import from Files** | Home or Library → **Import your music** → choose songs |
| **Music folder** | Library → **Music folder** card → **Choose folder** (for example OneDrive › Music) → **Sync** whenever you add songs |

Use MP3, M4A, AAC, WAV, AIFF or FLAC. `.ogg` files are not supported on iOS. For folders in OneDrive or iCloud, make the songs available offline before syncing.

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| *"You're signed in to Expo Go as … but not signed in to Expo CLI"* | Sign out in Expo Go, **or** run `npx expo login` with the same account |
| The iPhone never connects | Same Wi-Fi on both devices; allow Local Network for Expo Go; set `REACT_NATIVE_PACKAGER_HOSTNAME` to the right IP |
| `ConfigError: package.json does not exist` | Run Expo from the `mobile` folder, not the repository root |
| Changes don't appear | Stop the server with **Ctrl + C** and run `npx expo start --lan --clear`; make sure no other Expo server is using port 8081 |
| Folder asks again after reopening | Expected: iOS grants folder access for one app session; confirm the folder in the picker |
| A song won't import | Check the format and that the file is downloaded to the iPhone |

## 7. Checks before committing

```bash
cd mobile
npx tsc --noEmit
npx expo-doctor
```

Both must pass. Never add third-party attribution or watermarks to commits, code or docs.

## 8. Install it as a real app

To use CoryMusic without the computer or Expo Go — with background audio and Lock Screen controls — install the Release app from a Mac with Xcode and a free Apple ID. Follow [INSTALL_IPHONE.md](INSTALL_IPHONE.md).
