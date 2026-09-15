# Requirements

## 1. What you need

### To develop and try the app
| Item | Details |
|---|---|
| **Computer** | Windows or macOS with Node.js 20+ and Git (current development happens on Windows) |
| **iPhone** | iPhone 17 with iOS 26 — Liquid Glass and native tabs |
| **Expo Go** | Free app from the App Store, same SDK version as the project (SDK 57) |
| **Network** | Computer and iPhone on the same Wi-Fi |

### For the installed app (later)
| Item | Why |
|---|---|
| **Mac with Xcode** (MacBook Neo) | Build and install the Release app, which works without a computer and unlocks background audio and Lock Screen controls — see [INSTALL_IPHONE.md](INSTALL_IPHONE.md) |
| **Apple ID** | Free signing for your own iPhone; apps expire every 7 days and must be re-installed (data is kept) |

### Software (all free)
| Tool | Purpose |
|---|---|
| Node.js + npm | Run Expo and install packages |
| Git + GitHub | Version control, public repository and documentation site |
| Expo Go | Preview the app on the iPhone by scanning a QR code |
| Code editor | Any editor; VS Code works well |

### Accounts
| Account | Cost | Needed for |
|---|---|---|
| GitHub | Free | Repository and documentation site |
| Expo | Free, optional | Only if Expo Go is signed in — the Expo CLI must use the same account, or sign out of Expo Go |
| Apple ID | Free | Only for the installed app later |

### Skills
| Skill | Starting point |
|---|---|
| TypeScript and React | Already used |
| React Native and Expo | Expo documentation for SDK 57 |
| SQLite | Basic SQL |
| Git | Already used |

---

## 2. Implementation status

| Status | Meaning |
|---|---|
| ✅ | Implemented and working in Expo Go |
| 🧪 | Implemented, needs the installed app to work fully |
| 🔜 | Planned |

---

## 3. Functional requirements

### Welcome and profile
| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-45 | First launch asks for the user's name (optional, stored on-device) | Must | ✅ |
| FR-46 | Greeting by time of day: good morning 05:00–11:59, good afternoon 12:00–18:59, good evening 19:00–04:59 | Must | ✅ |
| FR-47 | UI in English and Spanish, following the device language, with an in-app override (System, Español, English) | Must | ✅ |
| FR-53 | Profile photo from the gallery with square crop, or initials when there is no photo | Should | ✅ |
| FR-54 | Profile stats: songs, artists, playlists and storage used | Should | ✅ |
| FR-48 | Empty states for library, playlists and search, each with a clear next action | Must | ✅ |

### Library and import
| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-01 | Import audio files (MP3, M4A, AAC, WAV, AIFF, FLAC) from the Files app, copying them into the app | Must | ✅ |
| FR-55 | Music folder: choose a folder, scan it and its subfolders, copy new songs; change or forget it | Must | ✅ |
| FR-02 | Automatically import files placed in the app's *Entrada* folder when the app opens | Must | 🔜 installed app |
| FR-03 | Detect duplicates (file name + size) and skip them | Must | ✅ |
| FR-04 | Browse by Songs and Artists | Must | ✅ |
| FR-04b | Browse by Albums | Must | 🔜 needs file tags |
| FR-05 | Sort views: A–Z, recently added, most played, year | Should | 🔜 |
| FR-06 | Import summary: imported, duplicates, not supported, failed | Must | ✅ |
| FR-49 | Delete a song with confirmation, removing it from the library, playlists and storage | Must | 🔜 |

### Metadata
| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-08 | Read artist and title from the file name and clean noise such as `(Official Audio)` or `[320kbps]` | Must | ✅ |
| FR-07 | Read title, artist, album, year, track number, genre and artwork from file tags | Must | 🔜 |
| FR-11 | *To review* queue for songs with incomplete data | Must | 🔜 |
| FR-12 | Edit song data manually | Must | 🔜 |
| FR-15 | On-device suggestions for messy file names | Must | 🔜 |
| FR-16 | Edits stored in the database without modifying the audio file | Must | 🔜 |

### Playback
| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-20 | Play a song from any list, with the rest of that list as the queue; Play and Shuffle buttons in Library and smart playlists | Must | ✅ |
| FR-19 | Mark songs as favorites | Must | ✅ |
| FR-28 | Count a play when more than half of the song has been heard | Must | ✅ |
| FR-20b | Full Now Playing screen: play or pause, next, previous (restarts the song after 3 seconds), draggable progress bar, favorite | Must | ✅ |
| FR-58 | Mini player above the tab bar that opens Now Playing | Must | ✅ |
| FR-21 | Shuffle (current song first, the rest shuffled) and repeat (off, all, this song) | Must | ✅ |
| FR-22 | Queue: see what's up next, jump to a song, remove songs | Must | ✅ |
| FR-23 | Background playback and Lock Screen controls: play or pause, position and 10-second skips | Must | 🧪 configured, works in the installed app |
| FR-25 | Sleep timer: 15, 30, 45 or 60 minutes, or at the end of the song | Should | ✅ |
| FR-59 | Fade-out when the sleep timer ends | Could | 🔜 |
| FR-27 | Lyrics written or pasted by the user; synced when they include LRC times: current line highlighted, auto-scroll, tap a line to jump; included in backups | Could | ✅ |
| FR-51 | Continue with similar songs when the queue ends | Should | 🔜 |

### Playlists
| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-33 | Smart playlists by rules (artist, title, imported, plays, last played, favorite), match all or any, sort and limit | Must | ✅ |
| FR-34 | Smart playlists update automatically on import, play and favorite | Must | ✅ |
| FR-35 | Live preview of matching songs while editing | Should | ✅ |
| FR-56 | One-tap suggestions: Recently added, My favorites, Most played, Forgotten | Should | ✅ |
| FR-29 | Normal playlists: create, rename, reorder, delete | Must | 🔜 |
| FR-32 | Pinned playlist | Should | 🔜 |

### Search, backup and settings
| ID | Requirement | Priority | Status |
|---|---|---|---|
| FR-38 | Instant search as you type | Must | 🔜 |
| FR-42 | Save a JSON backup (profile, smart playlists, favorites, plays) through the iOS share sheet to Files or OneDrive | Must | ✅ |
| FR-43 | Restore from a file or from an automatic backup, with confirmation, a safety backup first and a report | Must | ✅ |
| FR-57 | Songs in a backup that aren't imported yet stay pending and get their favorites and plays back when imported | Should | ✅ |
| FR-52 | Weekly automatic backup inside the app, keeping the 5 most recent, plus a reminder when no backup was saved outside the app in 7 days | Must | ✅ |
| FR-44 | Settings: profile card, music folder, library, playback, backup, privacy, version | Must | ✅ (library and playback toggles are visual for now) |

---

## 4. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | **Zero cost:** no paid services or memberships |
| NFR-02 | **No external services:** the app performs no network requests |
| NFR-03 | **No ads, no tracking, no analytics, no in-app accounts** |
| NFR-04 | **Offline-first:** every feature works without internet |
| NFR-05 | **Legal:** plays only files the user has the right to use; no audio committed to Git |
| NFR-06 | **Performance:** smooth scrolling for a 2,000-song library on iPhone 17 |
| NFR-08 | **Accessibility:** VoiceOver labels, Dynamic Type, text contrast ≥ 4.5:1 |
| NFR-09 | **Design consistency:** follows [DESIGN.md](DESIGN.md) |
| NFR-10 | **Localization:** every user-facing string lives in the English and Spanish locale files |
| NFR-11 | **Quality:** TypeScript strict mode and `expo-doctor` checks pass before each commit |
| NFR-12 | **No third-party attribution or watermarks** in code, docs, commits or app UI |

---

## 5. Pace

About **24 hours per week**. Progress and next steps are tracked in [ROADMAP.md](ROADMAP.md).
