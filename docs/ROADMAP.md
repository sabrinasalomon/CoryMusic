# Roadmap

Estimates assume **part-time work (~10 hours/week)**. Dates are targets, not promises.

## Timeline

```mermaid
gantt
    title CoryMusic roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section 0 · Foundations
    Swift & SwiftUI basics            :f1, 2026-09-21, 21d
    Xcode project + repo setup        :f2, after f1, 3d

    section 1 · Library
    SwiftData models                  :l1, after f2, 5d
    Import from Files + metadata      :l2, after l1, 10d
    Songs / Artists / Albums views    :l3, after l2, 10d

    section 2 · Playback
    AudioPlayerService + Now Playing  :p1, after l3, 10d
    Background audio + Lock Screen    :p2, after p1, 7d
    Shuffle, repeat, queue            :p3, after p2, 5d

    section 3 · Playlists
    Create / edit / reorder           :pl1, after p3, 10d
    Backup & restore JSON             :pl2, after pl1, 5d

    section 4 · Release v1.0
    Search, polish, accessibility     :r1, after pl2, 7d
    Unit tests + README screenshots   :r2, after r1, 5d
    v1.0 tag on GitHub                :milestone, r3, after r2, 0d

    section 5 · Later
    Discover tab (Jamendo)            :x1, after r3, 14d
```

## Milestones

| Version | Scope | Done when |
|---|---|---|
| **v0.1** | Project + models | App runs on iPhone with an empty library |
| **v0.2** | Library | Songs imported from Files appear by artist and album |
| **v0.3** | Playback | Music keeps playing with the phone locked; Lock Screen controls work |
| **v0.4** | Playlists | Your playlist of favorite artists is built and reordered in the app |
| **v1.0** | Release | Backup/restore, search, accessibility, tests, screenshots in README |
| **v1.1** | Discover | Browse and play Creative Commons music from Jamendo |

## GitHub workflow
- One **issue** per feature (use the FR IDs from [REQUIREMENTS.md](REQUIREMENTS.md)).
- A **GitHub Project** board: *Backlog → In progress → Done*.
- Branch per feature (`feature/import-files`), merge with a pull request.
- Tag each milestone (`v0.1`, `v0.2`, …) and add screenshots/GIFs to the release notes.

## Backlog (ideas)
- Sleep timer
- Equalizer presets
- Lyrics you write yourself, stored locally
- Home Screen widget (Now Playing)
- Siri Shortcuts: "Play my favorites"
- CarPlay-style large controls mode
