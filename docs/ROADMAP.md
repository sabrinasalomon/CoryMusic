# Roadmap

Estimates assume **part-time work (~10 hours/week)**. Development starts only after the analysis phase is approved; dates below are placeholders counted from that start.

## Timeline

```mermaid
gantt
    title CoryMusic roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section 0 · Foundations
    Swift and SwiftUI basics              :f1, 2026-10-05, 14d
    Xcode project, repo, icon             :f2, after f1, 3d
    Design system tokens and components   :f3, after f2, 4d

    section 1 · Library
    SwiftData models                      :l1, after f3, 5d
    Import from Files + duplicates        :l2, after l1, 7d
    Entrada auto-import                   :l3, after l2, 4d
    Artists, Albums, Songs views          :l4, after l3, 10d

    section 2 · Playback
    AudioPlayerService + Now Playing      :p1, after l4, 8d
    Background audio + Lock Screen        :p2, after p1, 5d
    Queue, shuffle, repeat, sleep timer   :p3, after p2, 7d

    section 3 · Playlists
    Normal playlists + covers + pinned    :pl1, after p3, 8d
    Smart playlist engine + rule editor   :pl2, after pl1, 10d

    section 4 · Search and metadata
    Search with scopes                    :s1, after pl2, 5d
    Suggestions + Por revisar + bulk edit :s2, after s1, 9d

    section 5 · Release v1.0
    Inicio screen + Liquid Glass polish   :r1, after s2, 6d
    Backup and restore + Ajustes          :r2, after r1, 5d
    Accessibility + tests + screenshots   :r3, after r2, 6d
    v1.0 tag                              :milestone, r4, after r3, 0d
```

## Milestones

| Version | Scope | Done when |
|---|---|---|
| **v0.1** | Foundations | App runs on iPhone with the tab bar, black/purple design system and icon |
| **v0.2** | Library | Songs from Files and Entrada appear by artist, album and song |
| **v0.3** | Playback | Music plays with the phone locked; queue and sleep timer work |
| **v0.4** | Playlists | Normal and smart playlists, including *Lo nuevo de [Artista]* |
| **v0.5** | Search & metadata | Search works; incomplete songs can be fixed with suggestions |
| **v1.0** | Release | Inicio, backup/restore, Ajustes, accessibility, tests, README screenshots |

## GitHub workflow
- One **issue** per requirement (FR IDs from [REQUIREMENTS.md](REQUIREMENTS.md)).
- **GitHub Project** board: *Backlog → In progress → Done*.
- Branch per feature (`feature/smart-playlists`), merge with a pull request.
- Tag milestones and attach screenshots or screen recordings to releases.

## After v1.0 (ideas, all on-device)
- On-device AI metadata suggestions (Foundation Models) if not done in v0.5
- Home Screen widget and Control Center control
- Siri / Shortcuts: "Reproducir mis favoritas"
- Equalizer presets
- Lyrics editor improvements
