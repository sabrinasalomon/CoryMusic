# Roadmap

Pace: about **24 hours per week**. Dates for upcoming phases are estimates.

## Done

| Milestone | Scope | Status |
|---|---|---|
| **Analysis & design** | Requirements, design system, icon, brand, documentation site | ✅ |
| **v0.1 Foundations** | Expo SDK 57 app, native Liquid Glass tabs, design tokens, English and Spanish | ✅ |
| **v0.2 Profile & library** | Welcome with greeting, profile (photo, name, language, stats), import from Files, SQLite library, songs and artists, play and pause | ✅ |
| **v0.3 Smart playlists** | Rules engine, editor with live preview, detail screen, four suggestions, favorites, play counting | ✅ |
| **v0.4 Music folder** | Choose, sync, change and forget a music folder, including subfolders | ✅ |

## Next

```mermaid
gantt
    title Upcoming work
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Playback
    Now Playing screen and queue           :p1, 2026-09-21, 5d
    Shuffle, repeat and sleep timer        :p2, after p1, 3d

    section Library
    File tags, albums and artwork          :l1, after p2, 5d
    To review queue and editing            :l2, after l1, 4d
    Search                                 :l3, after l2, 3d
    Delete with confirmation               :l4, after l3, 1d

    section Playlists
    Normal playlists and pinned playlist   :pl1, after l4, 4d

    section Safety
    Backup and restore                     :b1, after pl1, 4d

    section Installed app
    Development build on iPhone            :i1, after b1, 3d
    Background audio and Lock Screen       :i2, after i1, 3d
    Entrada folder                         :i3, after i2, 2d

    section Release
    Accessibility, tests and screenshots   :r1, after i3, 4d
    v1.0                                   :milestone, r2, after r1, 0d
```

| Version | Scope |
|---|---|
| **v0.5** | Now Playing, queue, shuffle, repeat, sleep timer |
| **v0.6** | Albums and artwork from tags, To review, search, delete |
| **v0.7** | Normal playlists, pinned playlist, backup and restore |
| **v0.8** | Installed app: background audio, Lock Screen, Entrada folder |
| **v1.0** | Accessibility pass, tests and final screenshots |

## GitHub workflow

- Public repository; every push to `main` also updates the [documentation site](https://sabrinasalomon.github.io/CoryMusic/).
- Run `npx tsc --noEmit` and `npx expo-doctor` in `mobile/` before each commit.
- Commits are authored only by sabrinasalomon, with no third-party attribution.
