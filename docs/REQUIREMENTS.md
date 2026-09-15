# Requirements

## 1. What you need

### Hardware
| Item | Details |
|---|---|
| **Mac** | MacBook Neo (A18 Pro, 8 GB RAM) running macOS Tahoe with the latest Xcode |
| **iPhone** | iPhone 17 with iOS 26 — supports Liquid Glass and Apple Intelligence (on-device suggestions) |
| USB cable (first time) | Pair the iPhone with Xcode; afterwards Wi-Fi works |

#### Working comfortably with 8 GB RAM
- Run and test on the **iPhone 17** instead of simulators.
- Keep only one Simulator runtime installed, if any.
- Close heavy apps (browsers with many tabs) while building.
- Keep at least **40 GB free** disk space for Xcode, DerivedData and device support files.
- The MacBook Neo is fanless; long builds may slow down slightly — this is expected.

### Software (all free)
| Tool | Purpose |
|---|---|
| Xcode (latest, iOS 26 SDK) | IDE, compiler, device install, String Catalogs |
| Icon Composer (included with Xcode) | Open and adjust `design/icon/CoryMusic.icon` |
| SF Symbols app | Browse and preview system icons |
| Git + GitHub | Version control; public repository |

### Accounts
| Account | Cost | Needed for |
|---|---|---|
| Apple ID | Free | Signing the app for your own iPhone (Personal Team) |
| GitHub | Free | Hosting the public repository |

No other accounts or services are used.

### Skills
| Skill | Starting point |
|---|---|
| Xcode | Already used |
| Swift | Familiar from C#, JavaScript and TypeScript |
| SwiftUI + Liquid Glass | Apple tutorials and developer documentation |
| SwiftData, AVFoundation, MediaPlayer | Apple developer documentation |
| Git | Already used |

### Free-provisioning limits (Apple ID without paid membership)
- Apps expire after **7 days** and must be re-installed. Data is **kept** if the app is not deleted and the bundle identifier never changes — see [SETUP.md](SETUP.md#7-auto-renew-every-7-days).
- Limited number of free-provisioned apps installed at once and of new App IDs per week.
- No App Store, TestFlight, iCloud/CloudKit or push notifications.

---

## 2. Functional requirements

### Welcome & localization
| ID | Requirement | Priority |
|---|---|---|
| FR-45 | First launch asks for the user's name (optional, stored on-device) | Must |
| FR-46 | Greeting by time of day: good morning 05:00–11:59, good afternoon 12:00–18:59, good evening 19:00–04:59 | Must |
| FR-47 | UI in **English (base)** and **Spanish**, following the device language and the per-app language setting; song data is never translated | Must |
| FR-48 | Empty states for library, playlists and search, each with a clear next action | Must |

### Library & import
| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Import audio files (MP3, M4A, AAC, WAV, AIFF, FLAC) from the Files app, copying them into the app sandbox | Must |
| FR-02 | Automatically import files placed in the app's *Entrada* folder when the app opens (can be turned off) | Must |
| FR-03 | Detect duplicates (file name + duration) and skip them | Must |
| FR-04 | Browse by Artists (grid), Albums (grid) and Songs (list with A–Z index) | Must |
| FR-05 | Sort views: A–Z, recently added, most played, year (albums) | Should |
| FR-06 | Show an import summary: imported, skipped duplicates, incomplete data | Must |
| FR-49 | **Delete a song**: always ask for confirmation with an explicit *Delete anyway* button; removes it from the library, from every playlist and deletes the audio file from the iPhone | Must |

### Metadata
| ID | Requirement | Priority |
|---|---|---|
| FR-07 | Read title, artist, album artist, album, year, track number, genre and artwork from file tags | Must |
| FR-08 | Suggest missing data from the file name (e.g. `Artist - Title`, track number prefixes) and clean noise such as `(Official Audio)` or `[320kbps]` | Must |
| FR-09 | Suggest artist and album from the folder structure | Should |
| FR-10 | Match suggestions to existing artists to avoid duplicates | Must |
| FR-11 | Keep incomplete songs playable and list them in a *To review* queue | Must |
| FR-12 | Edit song data manually, with artist autocomplete | Must |
| FR-13 | Apply album, artist and artwork to several songs at once (same folder or manual selection) | Should |
| FR-14 | Accept all pending suggestions in one action | Could |
| FR-15 | On-device Apple Intelligence suggestions (Foundation Models) for messy file names, falling back to rules when unavailable | **Must (v1.0)** |
| FR-16 | Store edits in the app database without modifying the original audio file | Must |

### Artists & albums
| ID | Requirement | Priority |
|---|---|---|
| FR-17 | Artist page: hero image, play, shuffle, favorite, latest additions, most played, discography | Must |
| FR-18 | Artist image priority: user photo → latest album artwork → initials monogram | Must |
| FR-19 | Mark artists and songs as favorites | Must |
| FR-50 | Album page: artwork, title, artist, year, song count, total duration, play, shuffle, song list | Must |

### Playback
| ID | Requirement | Priority |
|---|---|---|
| FR-20 | Play, pause, next, previous, seek | Must |
| FR-21 | Shuffle and repeat (off / all / one) | Must |
| FR-22 | Queue with "Play next" items first, then the source list; reorder and remove | Must |
| FR-23 | Background playback and Lock Screen / Control Center controls with artwork | Must |
| FR-24 | Handle interruptions (calls, alarms) and headphone unplug | Must |
| FR-25 | Sleep timer: 15 / 30 / 60 minutes or end of song, with a gentle fade-out; default duration set in Settings | Should |
| FR-26 | System audio output picker (Bluetooth, AirPlay) | Should |
| FR-27 | Lyrics written or pasted by the user, stored locally, current line highlighted | Could |
| FR-28 | Count a play when more than half of the song has been heard | Must |
| FR-51 | **Continue with similar songs**: when the queue ends, keep playing songs by the same artist; off by default | Should |

### Playlists
| ID | Requirement | Priority |
|---|---|---|
| FR-29 | Create, rename, duplicate, delete playlists (deleting never removes songs from the library) | Must |
| FR-30 | Add songs, whole albums or whole artists; reorder; remove with undo | Must |
| FR-31 | Playlist covers: automatic mosaic, SF Symbol, photo, or initials | Should |
| FR-32 | Pin one playlist to the top (default: *Favorites*) | Should |
| FR-33 | Smart playlists defined by rules (field + condition + value), match *all* or *any*, sort and limit, *favorites only* option | Must |
| FR-34 | Smart playlists update automatically on import, play, favorite and edit | Must |
| FR-35 | Live preview of matching songs while editing rules | Should |
| FR-36 | Convert a smart playlist into a normal one | Could |
| FR-37 | Marking an artist as favorite offers a *New from [Artist]* smart playlist | Should |

### Search
| ID | Requirement | Priority |
|---|---|---|
| FR-38 | Instant search as you type, case- and accent-insensitive | Must |
| FR-39 | Scopes: All, Artists, Songs, Albums, Playlists; top result | Must |
| FR-40 | Recent searches, favorite artists and library shortcuts (by decade, by genre, unplayed, to review) | Should |
| FR-41 | Dictation using the system keyboard | Could |

### Backup & settings
| ID | Requirement | Priority |
|---|---|---|
| FR-42 | Export playlists, smart rules, favorites, metadata edits and lyrics as JSON | Must |
| FR-43 | Restore from JSON, matching songs by file name + duration, with a report; missing songs stay pending and re-join their playlists when imported later | Must |
| FR-52 | **Weekly automatic backup** on app launch when 7 days have passed, saved to a user-chosen folder **outside the app** (persisted security-scoped bookmark); keeps the 5 most recent | Must |
| FR-44 | Settings: Entrada auto-import, To review shortcut, storage breakdown (music, artwork, backups), default sleep timer, continue with similar songs, haptics, backup and restore, privacy statement, version | Must |

---

## 3. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | **Zero cost:** no paid services or memberships |
| NFR-02 | **No external services:** the app performs no network requests |
| NFR-03 | **No ads, no tracking, no analytics, no accounts** |
| NFR-04 | **Offline-first:** every feature works without internet |
| NFR-05 | **Legal:** plays only files the user has the right to use; no audio committed to Git |
| NFR-06 | **Performance:** 2,000-song library scrolls smoothly on iPhone 17; playback starts in < 1 s; search results update in < 100 ms |
| NFR-07 | **Resilience:** data survives re-installs (same bundle ID, app not deleted); backups live outside the app |
| NFR-08 | **Accessibility:** VoiceOver labels, Dynamic Type, text contrast ≥ 4.5:1, Reduce Motion respected |
| NFR-09 | **Design consistency:** follows [DESIGN.md](DESIGN.md) |
| NFR-10 | **Localization:** no hard-coded user-facing strings; every string in the String Catalog with English and Spanish |
| NFR-11 | **Maintainability:** MVVM, services behind protocols, unit tests for import, suggestions, smart rules, search, deletion and backup |
| NFR-12 | **No third-party attribution or watermarks** in code, docs, commits or app UI |

---

## 4. User stories

- **As a listener**, I want the app to greet me by name so it feels personal.
- **As a listener**, I want to drop songs into a folder and find them organized without extra steps.
- **As a listener**, I want incomplete files fixed with suggestions I just confirm.
- **As a listener**, I want artist and album pages for the music I love.
- **As a listener**, I want a playlist that fills itself with the newest songs from an artist.
- **As a listener**, I want music to keep playing with my phone locked, and to stop by itself when I fall asleep.
- **As a listener**, I never want to delete a song by accident.
- **As a listener**, I want my playlists backed up automatically somewhere safe.

---

## 5. Time estimate

At **~24 hours per week**:

| Phase | Effort |
|---|---|
| Foundations, project, icon, design system, localization setup | ~1 week |
| Library, import, Entrada, delete | ~1.5 weeks |
| Playback, Lock Screen, queue, sleep timer, similar songs | ~1.5 weeks |
| Playlists and smart playlists | ~1.5 weeks |
| Search, metadata review, Apple Intelligence suggestions | ~1 week |
| Welcome, Home, Settings, backup, accessibility, tests | ~1.5 weeks |
| **Total to v1.0** | **~8 weeks** |

See [ROADMAP.md](ROADMAP.md).
