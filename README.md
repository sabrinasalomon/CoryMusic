# CoryMusic

> A premium, offline music player for iOS — your music, your artists, your playlists. No ads, no accounts, no external services, zero cost.

![Platform](https://img.shields.io/badge/iOS-26%2B-000000?style=for-the-badge&logo=apple&logoColor=white)
![Swift](https://img.shields.io/badge/Swift-F05138?style=for-the-badge&logo=swift&logoColor=white)
![SwiftUI](https://img.shields.io/badge/SwiftUI-Liquid%20Glass-7C3AED?style=for-the-badge&logo=swift&logoColor=white)
![Cost](https://img.shields.io/badge/Cost-%240-2EA043?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-7C3AED?style=for-the-badge)

CoryMusic is a native iOS app built with **SwiftUI** and Apple's **Liquid Glass** design system. It plays audio files stored on your iPhone, organizes them around the artists you love, and keeps your playlists up to date automatically — entirely on-device.

> **Status:** analysis and design phase. No app code yet.

---

## Principles

| Principle | What it means |
|---|---|
| **Zero cost** | No paid services, no subscriptions, no Apple Developer Program |
| **No external services** | The app makes no network requests — no streaming, no metadata APIs, no analytics |
| **No ads** | Never |
| **Offline-first** | Everything works without internet |
| **Private** | Your library never leaves your iPhone |
| **Legal** | Plays only files you have the right to use; no audio in this repository |

---

## Planned features

| Area | Features |
|---|---|
| **Library** | Import from Files, automatic import from an *Inbox* folder, views by Artists / Albums / Songs, sort, A–Z index |
| **Metadata** | Read tags and artwork, filename and folder suggestions, review queue for incomplete songs, bulk edit |
| **Artists** | Artist page with hero image, favorites, latest additions, most played, discography |
| **Playback** | Background audio, Lock Screen & Control Center, queue, shuffle, repeat, sleep timer, output picker |
| **Playlists** | Normal playlists, **smart playlists** built from rules, pinned playlist, mosaic / icon / photo / initials covers |
| **Search** | Instant on-device search with scopes and highlighted matches |
| **Backup** | Export and restore playlists and edits as JSON |

---

## Design

Pure black background, purple accents and a glass purple **CM** monogram, built on Apple's native design system (Liquid Glass, SF Symbols, New York serif). See [docs/DESIGN.md](docs/DESIGN.md).

---

## Tech stack

| Layer | Technology |
|---|---|
| Language | Swift |
| UI | SwiftUI (iOS 26, Liquid Glass) |
| Audio | AVFoundation (`AVPlayer`, `AVAudioSession`) |
| System controls | MediaPlayer (`MPNowPlayingInfoCenter`, `MPRemoteCommandCenter`) |
| Persistence | SwiftData |
| Smart suggestions (optional) | Foundation Models framework, on-device, on Apple Intelligence–capable iPhones |
| Architecture | MVVM + Services |
| Third-party dependencies | None |

---

## Documentation

| Document | Contents |
|---|---|
| [Requirements](docs/REQUIREMENTS.md) | What you need, functional & non-functional requirements, estimate |
| [Design](docs/DESIGN.md) | Brand, palette, typography, Liquid Glass rules, screens |
| [Architecture](docs/ARCHITECTURE.md) | Layers, services, sequence and state diagrams |
| [Data Model](docs/DATA_MODEL.md) | Entities, smart playlist rules, backup format |
| [User Flows](docs/USER_FLOWS.md) | Screen map and main flows |
| [Music Sources](docs/MUSIC_SOURCES.md) | Where the music comes from and what was ruled out |
| [Setup](docs/SETUP.md) | Xcode project, run on iPhone, auto-renew every 7 days |
| [Roadmap](docs/ROADMAP.md) | Phases, milestones and timeline |

---

## Project structure

```text
CoryMusic/
├── CoryMusic/                  # Xcode app target (created on Mac)
│   ├── App/                    # Entry point, dependency setup
│   ├── DesignSystem/           # Colors, typography, glass styles, components
│   ├── Models/                 # SwiftData models
│   ├── Services/               # Player, import, metadata, smart playlists, search, backup
│   ├── ViewModels/             # Screen state and logic
│   ├── Views/                  # SwiftUI screens
│   └── Resources/              # Assets, app icon, Info.plist
├── docs/                       # Documentation and diagrams
├── playlists/                  # Backup format example (no audio)
└── scripts/                    # Auto-renew script for free provisioning
```

---

## Music & copyright

This repository contains **code and documentation only**. Audio files are blocked by `.gitignore`. CoryMusic plays files you have the right to use — see [Music Sources](docs/MUSIC_SOURCES.md).

## License

[MIT](LICENSE) © 2026 sabrinasalomon
