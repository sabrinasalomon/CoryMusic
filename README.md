# 🎧 CoryMusic

> A free, offline-first music player for iOS — your playlists, your artists, zero cost.

![Platform](https://img.shields.io/badge/iOS-17%2B-000000?style=for-the-badge&logo=apple&logoColor=white)
![Swift](https://img.shields.io/badge/Swift-F05138?style=for-the-badge&logo=swift&logoColor=white)
![SwiftUI](https://img.shields.io/badge/SwiftUI-0D96F6?style=for-the-badge&logo=swift&logoColor=white)
![Cost](https://img.shields.io/badge/Cost-%240-2EA043?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-7F00FF?style=for-the-badge)

CoryMusic is a native iOS app built with **SwiftUI** that plays music stored on your device. It lets you build a library around the artists and playlists you love, keeps playing in the background, and never requires a paid subscription, a server, or an App Store developer account.

---

## ✨ Features

| Status | Feature |
|---|---|
| 🟡 Planned | Import songs from the **Files** app (MP3, M4A, AAC, WAV, AIFF, FLAC) |
| 🟡 Planned | Automatic metadata: title, artist, album, artwork |
| 🟡 Planned | Library views by **Songs**, **Artists** and **Albums** |
| 🟡 Planned | Create, edit and reorder **playlists** |
| 🟡 Planned | Background playback + **Lock Screen / Control Center** controls |
| 🟡 Planned | Shuffle, repeat, queue |
| 🟡 Planned | **Backup & restore** playlists as JSON |
| 🔵 Later | Discover free, legal music via the **Jamendo API** |

---

## 💸 What it costs

| Item | Cost |
|---|---|
| Xcode, Swift, SwiftUI | $0 |
| Running on your own iPhone (free Apple ID) | $0 |
| Backend / servers | $0 — everything is stored on the device |
| Music | $0 — see [Music Sources](docs/MUSIC_SOURCES.md) |
| App Store publishing | Not planned (would require the $99/year Apple Developer Program) |

---

## 🧱 Tech Stack

- **Language:** Swift
- **UI:** SwiftUI
- **Audio:** AVFoundation (`AVPlayer`, `AVAudioSession`)
- **System controls:** MediaPlayer (`MPNowPlayingInfoCenter`, `MPRemoteCommandCenter`)
- **Persistence:** SwiftData
- **Architecture:** MVVM + Services

---

## 📚 Documentation

| Document | Contents |
|---|---|
| [Requirements](docs/REQUIREMENTS.md) | What you need, functional & non-functional requirements, user stories |
| [Architecture](docs/ARCHITECTURE.md) | Layers, component & sequence diagrams |
| [Data Model](docs/DATA_MODEL.md) | Entity-relationship diagram, SwiftData models, backup format |
| [User Flows](docs/USER_FLOWS.md) | Screen map and main flows |
| [Music Sources](docs/MUSIC_SOURCES.md) | Where the music comes from — legally and for free |
| [Setup](docs/SETUP.md) | Create the Xcode project, run on iPhone, auto-renew every 7 days |
| [Roadmap](docs/ROADMAP.md) | Phases, milestones and timeline |

---

## 🗂️ Project Structure

```text
CoryMusic/
├── CoryMusic/                  # Xcode app target (created on Mac)
│   ├── App/                    # App entry point, dependency setup
│   ├── Models/                 # SwiftData models
│   ├── Services/               # Audio player, importer, metadata, backup
│   ├── ViewModels/             # Screen state and logic
│   ├── Views/                  # SwiftUI screens and components
│   └── Resources/              # Assets, Info.plist
├── docs/                       # Project documentation and diagrams
├── playlists/                  # Playlist metadata examples (no audio files)
└── scripts/                    # Auto-renew script for free provisioning
```

---

## 🚀 Getting Started

1. Install **Xcode** from the Mac App Store.
2. Clone this repository.
3. Follow [docs/SETUP.md](docs/SETUP.md) to create the Xcode project and run it on your iPhone.

---

## ⚖️ Music & Copyright

This repository contains **code and documentation only**. No audio files are committed — `.gitignore` blocks them. CoryMusic plays files that you have the right to use. See [Music Sources](docs/MUSIC_SOURCES.md).

---

## 📄 License

[MIT](LICENSE) © 2026 sabrinasalomon
