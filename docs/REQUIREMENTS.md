# Requirements

## 1. What you need to build CoryMusic

### Hardware
| Item | Why |
|---|---|
| **Mac** (Apple silicon or Intel, running a macOS version supported by the latest Xcode) | Xcode only runs on macOS |
| **iPhone** (iOS 17 or later) | Real-device testing: background audio, Lock Screen controls, Files import |
| USB cable (first time) | Pairing the iPhone with Xcode; afterwards Wi-Fi works |

### Software (all free)
| Tool | Purpose |
|---|---|
| Xcode | IDE, compiler, simulator, device install |
| Git + GitHub | Version control and portfolio |
| SF Symbols app (optional) | Browse system icons used in the UI |

### Accounts
| Account | Cost | Needed for |
|---|---|---|
| Apple ID | Free | Signing the app for your own iPhone (Personal Team) |
| GitHub | Free | Hosting this repository |
| Jamendo developer account | Free (non-commercial) | Only for the optional *Discover* phase |

### Skills
| Skill | Level needed | Free resource |
|---|---|---|
| Swift basics | Beginner → Intermediate | *The Swift Programming Language* (swift.org) |
| SwiftUI | Beginner → Intermediate | Apple's *Develop in Swift* / SwiftUI tutorials |
| SwiftData | Beginner | Apple developer documentation |
| AVFoundation (audio) | Beginner | Apple developer documentation |
| Git | Basic | Already used in your projects |

### Free-provisioning limits (Apple ID without paid membership)
- Apps signed with a free Apple ID **expire after 7 days** and must be re-installed. Data is **kept** as long as the app is not deleted — see [SETUP.md](SETUP.md#6-auto-renew-every-7-days).
- Limited number of free-provisioned apps installed at the same time, and of new App IDs per week.
- No App Store, no TestFlight, no iCloud/CloudKit, no push notifications.

---

## 2. Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Import audio files from the Files app, copying them into the app sandbox | Must |
| FR-02 | Read title, artist, album, duration and artwork from file metadata | Must |
| FR-03 | Edit song metadata manually when it is missing or wrong | Should |
| FR-04 | Browse library by Songs, Artists, Albums | Must |
| FR-05 | Search the library by title, artist or album | Should |
| FR-06 | Create, rename, delete playlists | Must |
| FR-07 | Add/remove songs to playlists and reorder them | Must |
| FR-08 | Play, pause, next, previous, seek | Must |
| FR-09 | Shuffle and repeat (off / all / one) | Must |
| FR-10 | Play queue ("Up Next") | Should |
| FR-11 | Keep playing when the app is in background or the screen is locked | Must |
| FR-12 | Lock Screen & Control Center controls with artwork | Must |
| FR-13 | Handle interruptions (calls, alarms) and headphone unplug | Must |
| FR-14 | Export playlists + metadata as a JSON backup to Files | Must |
| FR-15 | Restore playlists from a JSON backup | Must |
| FR-16 | Mark favorite artists | Could |
| FR-17 | Discover and stream Creative Commons music via Jamendo | Could (later) |

## 3. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 | **Zero cost:** no paid services, subscriptions or servers |
| NFR-02 | **Offline-first:** every Must feature works without internet |
| NFR-03 | **Privacy:** no tracking, no analytics, no accounts; data never leaves the device |
| NFR-04 | **Legal:** only plays audio the user has the right to use; no audio committed to Git |
| NFR-05 | **Performance:** library of 2,000 songs scrolls smoothly; playback starts in < 1 s |
| NFR-06 | **Resilience:** data survives app re-installs (same bundle ID, app not deleted) |
| NFR-07 | **Accessibility:** VoiceOver labels, Dynamic Type, sufficient contrast |
| NFR-08 | **Maintainability:** MVVM, services behind protocols, unit tests for services |

## 4. User stories

- **As a listener**, I want to import my songs from Files so that all my music is in one place.
- **As a listener**, I want to open an artist and see all their songs so I can listen to my favorite artists quickly.
- **As a listener**, I want to build playlists in my own order so the music flows the way I like.
- **As a listener**, I want the music to keep playing when I lock my phone.
- **As a listener**, I want to back up my playlists so I never lose them, even if I delete the app.
- **As a listener**, I want to discover free music legally when I want something new.

## 5. Time estimate

| Phase | Estimated effort (part-time, ~10 h/week) |
|---|---|
| Learning Swift/SwiftUI basics | 2–3 weeks |
| MVP (import, library, playlists, playback) | 4–6 weeks |
| Background audio, Lock Screen, backup | 1–2 weeks |
| Polish, tests, accessibility | 1–2 weeks |
| **Total to a solid v1.0** | **~2–3 months** |

See [ROADMAP.md](ROADMAP.md) for details.
