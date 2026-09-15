# Requirements

## 1. What you need

### Hardware
| Item | Why |
|---|---|
| **Mac** running a macOS version supported by the latest Xcode | Xcode only runs on macOS |
| **iPhone with iOS 26 or later** | Liquid Glass, real-device testing of background audio and Lock Screen |
| Apple Intelligence–capable iPhone *(optional)* | Only for on-device AI metadata suggestions; everything else works without it |
| USB cable (first time) | Pair the iPhone with Xcode; afterwards Wi-Fi works |

### Software (all free)
| Tool | Purpose |
|---|---|
| Xcode (latest, iOS 26 SDK) | IDE, compiler, simulator, device install |
| Icon Composer | Layered app icon for Liquid Glass |
| SF Symbols app | Browse and preview system icons |
| Git + GitHub | Version control and portfolio |

### Accounts
| Account | Cost | Needed for |
|---|---|---|
| Apple ID | Free | Signing the app for your own iPhone (Personal Team) |
| GitHub | Free | Hosting the repository |

No other accounts or services are used.

### Skills
| Skill | Level needed | Free resource |
|---|---|---|
| Swift | Beginner → Intermediate | *The Swift Programming Language* (swift.org) |
| SwiftUI + Liquid Glass | Beginner → Intermediate | Apple tutorials and developer documentation |
| SwiftData | Beginner | Apple developer documentation |
| AVFoundation / MediaPlayer | Beginner | Apple developer documentation |
| Git | Basic | Already used |

### Free-provisioning limits (Apple ID without paid membership)
- Apps expire after **7 days** and must be re-installed. Data is **kept** if the app is not deleted and the bundle identifier never changes — see [SETUP.md](SETUP.md#6-auto-renew-every-7-days).
- Limited number of free-provisioned apps installed at once and of new App IDs per week.
- No App Store, TestFlight, iCloud/CloudKit or push notifications.

---

## 2. Functional requirements

### Library & import
| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Import audio files (MP3, M4A, AAC, WAV, AIFF, FLAC) from the Files app, copying them into the app sandbox | Must |
| FR-02 | Automatically import files placed in the app's *Inbox* folder when the app opens (can be turned off) | Must |
| FR-03 | Detect duplicates (file name + duration) and skip them | Must |
| FR-04 | Browse by Artists (grid), Albums (grid) and Songs (list with A–Z index) | Must |
| FR-05 | Sort views: A–Z, recently added, most played, year (albums) | Should |
| FR-06 | Show an import summary: imported, skipped duplicates, incomplete data | Must |

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
| FR-15 | On-device AI suggestions for messy file names (Foundation Models), falling back to rules when unavailable | Could |
| FR-16 | Store edits in the app database without modifying the original audio file | Must |

### Artists
| ID | Requirement | Priority |
|---|---|---|
| FR-17 | Artist page: hero image, play, shuffle, favorite, latest additions, most played, discography | Must |
| FR-18 | Artist image priority: user photo → latest album artwork → initials monogram | Must |
| FR-19 | Mark artists and songs as favorites | Must |

### Playback
| ID | Requirement | Priority |
|---|---|---|
| FR-20 | Play, pause, next, previous, seek | Must |
| FR-21 | Shuffle and repeat (off / all / one) | Must |
| FR-22 | Queue with "Play next" items first, then the source list; reorder and remove | Must |
| FR-23 | Background playback and Lock Screen / Control Center controls with artwork | Must |
| FR-24 | Handle interruptions (calls, alarms) and headphone unplug | Must |
| FR-25 | Sleep timer: 15 / 30 / 60 minutes or end of song | Should |
| FR-26 | System audio output picker (Bluetooth, AirPlay) | Should |
| FR-27 | Lyrics written or pasted by the user, stored locally | Could |
| FR-28 | Count a play when more than half of the song has been heard | Must |

### Playlists
| ID | Requirement | Priority |
|---|---|---|
| FR-29 | Create, rename, duplicate, delete playlists (deleting never removes songs from the library) | Must |
| FR-30 | Add songs, whole albums or whole artists; reorder; remove with undo | Must |
| FR-31 | Playlist covers: automatic mosaic, SF Symbol, photo, or initials | Should |
| FR-32 | Pin one playlist to the top (default: *Favorites*) | Should |
| FR-33 | Smart playlists defined by rules (field + condition + value), match *all* or *any*, sort and limit | Must |
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
| FR-42 | Export playlists, smart rules, favorites and metadata edits as JSON to Files | Must |
| FR-43 | Restore from JSON, matching songs by file name + duration, with a report of missing songs | Must |
| FR-44 | Settings: Inbox auto-import toggle, storage used, backup/restore, about | Must |

---

## 3. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | **Zero cost:** no paid services or memberships |
| NFR-02 | **No external services:** the app performs no network requests |
| NFR-03 | **No ads, no tracking, no analytics, no accounts** |
| NFR-04 | **Offline-first:** every feature works without internet |
| NFR-05 | **Legal:** plays only files the user has the right to use; no audio committed to Git |
| NFR-06 | **Performance:** 2,000-song library scrolls smoothly; playback starts in < 1 s; search results update in < 100 ms |
| NFR-07 | **Resilience:** data survives re-installs (same bundle ID, app not deleted) |
| NFR-08 | **Accessibility:** VoiceOver labels, Dynamic Type, text contrast ≥ 4.5:1 (≥ 3:1 for large text and icons), Reduce Motion respected |
| NFR-09 | **Design consistency:** follows [DESIGN.md](DESIGN.md) — pure black, purple accents, glass only on the navigation layer |
| NFR-10 | **Maintainability:** MVVM, services behind protocols, unit tests for import, suggestions, smart rules, search and backup |

---

## 4. User stories

- **As a listener**, I want to drop songs into a folder and find them organized in the app without extra steps.
- **As a listener**, I want incomplete files to be fixed with suggestions I just confirm.
- **As a listener**, I want an artist page with everything from my favorite artists.
- **As a listener**, I want a playlist that fills itself with the newest songs from an artist.
- **As a listener**, I want music to keep playing with my phone locked.
- **As a listener**, I want to back up my playlists so I never lose them.

---

## 5. Time estimate

| Phase | Effort (part-time, ~10 h/week) |
|---|---|
| Swift / SwiftUI foundations + design system | 3 weeks |
| Library, import, Inbox, metadata | 4 weeks |
| Playback, Lock Screen, queue, sleep timer | 3 weeks |
| Playlists and smart playlists | 3 weeks |
| Search, metadata review, suggestions | 2 weeks |
| Home, polish, accessibility, backup, tests | 2 weeks |
| **Total to v1.0** | **~3–4 months** |

See [ROADMAP.md](ROADMAP.md).
