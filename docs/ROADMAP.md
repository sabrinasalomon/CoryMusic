# Roadmap

Estimates assume **~24 hours per week**. Development starts only after the analysis phase is approved; dates below are placeholders counted from that start.

## Timeline

```mermaid
gantt
    title CoryMusic roadmap - about 8 weeks
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section 0 · Foundations
    Xcode project, icon, repo              :f1, 2026-10-05, 2d
    Design system tokens and components    :f2, after f1, 3d
    Localization setup EN + ES             :f3, after f2, 1d

    section 1 · Library
    SwiftData models + settings store      :l1, after f3, 2d
    Import from Files + duplicates         :l2, after l1, 3d
    Entrada auto-import                    :l3, after l2, 2d
    Artists, Albums, Songs, Album page     :l4, after l3, 4d
    Delete with confirmation               :l5, after l4, 1d

    section 2 · Playback
    AudioPlayerService + Now Playing       :p1, after l5, 4d
    Background audio + Lock Screen         :p2, after p1, 2d
    Queue, shuffle, repeat                 :p3, after p2, 2d
    Sleep timer, similar songs, lyrics     :p4, after p3, 3d

    section 3 · Playlists
    Normal playlists, covers, pinned       :pl1, after p4, 4d
    Smart playlist engine + rule editor    :pl2, after pl1, 5d

    section 4 · Search and metadata
    Search with scopes                     :s1, after pl2, 3d
    Suggestions, To review, bulk edit      :s2, after s1, 3d
    Apple Intelligence suggestions         :s3, after s2, 2d

    section 5 · Release v1.0
    Welcome and Home                       :r1, after s3, 3d
    Settings, backup, weekly auto backup   :r2, after r1, 3d
    Accessibility, tests, screenshots      :r3, after r2, 4d
    v1.0 tag                               :milestone, r4, after r3, 0d
```

## Milestones

| Version | Scope | Done when |
|---|---|---|
| **v0.1** | Foundations | App runs on the iPhone 17 with tab bar, icon, black/purple design system, English and Spanish |
| **v0.2** | Library | Songs from Files and Entrada appear by artist, album and song; delete with confirmation works |
| **v0.3** | Playback | Music plays with the phone locked; queue, sleep timer, lyrics and similar songs work |
| **v0.4** | Playlists | Normal and smart playlists, including *New from [Artist]* |
| **v0.5** | Search & metadata | Search works; incomplete songs fixed with rules and Apple Intelligence suggestions |
| **v1.0** | Release | Welcome, Home, Settings, weekly backup and restore, accessibility, tests, README screenshots |

## GitHub workflow
- Public repository `sabrinasalomon/CoryMusic`, created when development starts.
- One **issue** per requirement (FR IDs from [REQUIREMENTS.md](REQUIREMENTS.md)).
- **GitHub Project** board: *Backlog → In progress → Done*.
- Branch per feature (`feature/smart-playlists`), merge with a pull request.
- Tag milestones and attach screenshots or screen recordings to releases.
- Commits authored only by sabrinasalomon, with no third-party attribution.

## After v1.0 (ideas, all on-device)
- Home Screen widget and Control Center control
- Siri / Shortcuts: "Play my favorites"
- Equalizer presets
- Lyrics editor improvements
