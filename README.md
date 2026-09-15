# CoryMusic

> A premium, offline music player for iOS — your music, your artists, your playlists. No ads, no accounts, no external services, zero cost.

![Platform](https://img.shields.io/badge/iOS-26%2B-000000?style=for-the-badge&logo=apple&logoColor=white)
![Swift](https://img.shields.io/badge/Swift-F05138?style=for-the-badge&logo=swift&logoColor=white)
![SwiftUI](https://img.shields.io/badge/SwiftUI-Liquid%20Glass-7C3AED?style=for-the-badge&logo=swift&logoColor=white)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20ES-7C3AED?style=for-the-badge)
![Cost](https://img.shields.io/badge/Cost-%240-2EA043?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-7C3AED?style=for-the-badge)

<p align="center"><img src="design/icon/export/AppIcon-1024.png" width="160" alt="CoryMusic icon"></p>

CoryMusic is a native iOS app built with **SwiftUI** and Apple's **Liquid Glass** design system. It plays audio files stored on your iPhone, organizes them around the artists you love, and keeps your playlists up to date automatically — entirely on-device, in English and Spanish.

> **Status:** analysis and design complete. Development has not started.

---

## Principles

| Principle | What it means |
|---|---|
| **Zero cost** | No paid services, no subscriptions, no Apple Developer Program |
| **No external services** | The app makes no network requests — no streaming, no metadata APIs, no analytics |
| **No ads** | Never |
| **Offline-first** | Everything works without internet |
| **Private** | Your library, name and backups never leave your devices |
| **Legal** | Plays only files you have the right to use; no audio in this repository |

---

## Planned features (v1.0)

| Area | Features |
|---|---|
| **Welcome** | Asks your name and greets you by time of day |
| **Library** | Import from Files, automatic import from the *Entrada* folder, Artists / Albums / Songs, sort, A–Z index, empty states |
| **Metadata** | Tags and artwork, filename and folder suggestions, on-device Apple Intelligence suggestions, *To review* queue, bulk edit |
| **Artists & albums** | Artist page with hero image and favorites, album page, discography, most played |
| **Playback** | Background audio, Lock Screen & Control Center, queue, shuffle, repeat, sleep timer, output picker, your own lyrics, continue with similar songs |
| **Playlists** | Normal and **smart playlists**, pinned playlist, mosaic / icon / photo / initials covers |
| **Search** | Instant on-device search with scopes and highlighted matches |
| **Safety** | Delete confirmation, weekly automatic backup to a folder you choose, restore with report |

---

## Design

Pure black background, purple accents and a glass purple **CM** monogram, built on Apple's native design system (Liquid Glass, SF Symbols, New York serif). See [docs/DESIGN.md](docs/DESIGN.md) and [BRAND.md](BRAND.md).

---

## Tech stack

| Layer | Technology |
|---|---|
| Language | Swift |
| UI | SwiftUI (iOS 26, Liquid Glass) |
| Audio | AVFoundation (`AVPlayer`, `AVAudioSession`) |
| System controls | MediaPlayer (`MPNowPlayingInfoCenter`, `MPRemoteCommandCenter`) |
| Persistence | SwiftData + `UserDefaults` for settings |
| Suggestions | Foundation Models framework (on-device), with a rules-based fallback |
| Localization | String Catalog — English (base) and Spanish |
| App icon | Icon Composer (`.icon`) |
| Architecture | MVVM + Services |
| Third-party dependencies | None |

---

## Documentation

| Document | Contents |
|---|---|
| [Requirements](docs/REQUIREMENTS.md) | Hardware, functional & non-functional requirements, estimate |
| [Design](docs/DESIGN.md) | Palette, typography, Liquid Glass rules, screens, icon |
| [Architecture](docs/ARCHITECTURE.md) | Layers, services, sequence and state diagrams |
| [Data Model](docs/DATA_MODEL.md) | Entities, smart rules, settings, backup format |
| [User Flows](docs/USER_FLOWS.md) | Screen map and main flows |
| [Music Sources](docs/MUSIC_SOURCES.md) | Where to find free, legal music and what was ruled out |
| [Setup](docs/SETUP.md) | Xcode project, icon, localization, run on iPhone, auto-renew |
| [Roadmap](docs/ROADMAP.md) | Phases, milestones and timeline |
| [Brand](BRAND.md) | Name, monogram and icon usage |

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
│   └── Resources/              # Localizable.xcstrings, Info.plist
├── design/
│   └── icon/                   # CoryMusic.icon, source SVG layers, PNG export
├── docs/                       # Documentation and diagrams
├── playlists/                  # Backup format example (no audio)
└── scripts/                    # Auto-renew script for free provisioning
```

---

## Music & copyright

This repository contains **code, documentation and brand assets only**. Audio files are blocked by `.gitignore`. CoryMusic plays files you have the right to use — see [Music Sources](docs/MUSIC_SOURCES.md).

## License

Code, documentation and brand assets (the CoryMusic name, CM monogram and app icon) are released under the [MIT License](LICENSE) © 2026 sabrinasalomon. See [BRAND.md](BRAND.md) for details.
