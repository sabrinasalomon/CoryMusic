# Architecture

CoryMusic is an **Expo** app (React Native + TypeScript) in the `mobile/` folder. Screens use **Expo Router** file-based routing, shared state lives in three **React context providers**, and all data stays on the device. **The app contains no networking code.**

## 1. Overview

```mermaid
flowchart TB
    subgraph Screens["Screens — mobile/app"]
        W[welcome.tsx]
        T1["(tabs)/index.tsx — Home"]
        T2["(tabs)/library.tsx"]
        T3["(tabs)/playlists.tsx"]
        T4["(tabs)/search.tsx"]
        P[profile.tsx]
        S[settings.tsx]
        SD["smart/[id].tsx"]
        SE[smart/edit.tsx]
    end

    subgraph State["Providers — mobile/src/state"]
        PP[ProfileProvider]
        LP[LibraryProvider]
        PL[PlayerProvider]
    end

    subgraph Modules["Modules — mobile/src"]
        DB[library/db.ts]
        IM[library/importer.ts]
        FO[library/folder.ts]
        FI[library/files.ts]
        RU[smart/rules.ts]
        KV[storage/kv.ts]
        I18N[i18n]
    end

    subgraph Device["On-device data"]
        SQL[(corymusic.db)]
        KVS[(Key-value store)]
        MUS[/Documents/music/]
        PRO[/Documents/profile/]
    end

    W & P --> PP
    T1 & T2 & T3 & SD & SE --> LP
    T1 & T2 & SD --> PL

    PP --> KV
    PP --> FI
    PP --> I18N
    LP --> DB
    LP --> IM
    LP --> FO
    LP --> RU
    PL --> FI

    IM --> DB
    IM --> FI
    FO --> IM
    DB --> SQL
    KV --> KVS
    FI --> MUS
    FI --> PRO
```

## 2. Providers

| Provider | Holds | Main actions |
|---|---|---|
| **ProfileProvider** | Name, photo, language preference, onboarding flag | `setName`, `setPhoto`, `removePhoto`, `setLanguage`, `completeOnboarding` |
| **LibraryProvider** | Tracks, artists, storage used, smart playlists, music folder, sync state | `importMusic`, `syncMusicFolder`, `chooseMusicFolder`, `forgetMusicFolder`, `toggleFavorite`, `recordPlay`, `saveSmartPlaylist`, `deleteSmartPlaylist` |
| **PlayerProvider** | Current track and play state | `toggle(track)`; records a play after 50% listened |

## 3. Modules

| Module | Responsibility |
|---|---|
| `library/db.ts` | Opens `corymusic.db`, creates and migrates tables, reads and writes tracks and smart playlists |
| `library/importer.ts` | Files picker, supported format check, duplicate detection, copy into `Documents/music`, file name parsing |
| `library/folder.ts` | Folder picker and recursive scan (up to 5 levels, 5,000 files), counts unsupported audio |
| `library/files.ts` | Paths for music and profile photo, supported extensions, safe delete |
| `smart/rules.ts` | Rule types, allowed conditions per field, validation, evaluation, sorting, presets, rule descriptions |
| `storage/kv.ts` | Typed keys over the SQLite key-value store |
| `i18n` | i18next setup with English and Spanish resources and the saved language preference |
| `theme/tokens.ts` | Colors, typography, radius, spacing |

## 4. Sequence — import from Files

```mermaid
sequenceDiagram
    actor U as User
    participant LP as LibraryProvider
    participant IM as importer.ts
    participant FS as Documents/music
    participant DB as corymusic.db

    U->>LP: Import your music
    LP->>IM: importFromFiles()
    IM->>U: Files picker, multiple audio files
    U-->>IM: selected files
    loop each file
        IM->>IM: supported format? duplicate?
        IM->>FS: copy file
        IM->>IM: parse artist and title from file name
        IM->>DB: insert track
    end
    IM-->>LP: summary
    LP->>DB: reload tracks
    LP-->>U: import summary alert
```

## 5. Sequence — music folder sync

```mermaid
sequenceDiagram
    actor U as User
    participant LP as LibraryProvider
    participant FO as folder.ts
    participant IM as importer.ts
    participant DB as corymusic.db

    U->>LP: Sync
    alt folder already opened in this session
        LP->>FO: scan saved directory
    else first sync after launching the app
        LP->>FO: pickMusicFolder(saved location)
        FO->>U: folder picker opens at the saved folder
        U-->>FO: confirm folder
        LP->>LP: remember folder name and location
        LP->>FO: scan directory
    end
    FO-->>LP: audio files found, unsupported count
    LP->>IM: importCandidates(files)
    IM->>DB: insert new tracks, skip duplicates
    LP->>LP: save last sync time
    LP-->>U: sync summary alert
```

iOS grants access to a picked folder **for the current app session only**, so after relaunching, the picker opens at the saved folder and the user confirms it.

## 6. Sequence — playback and smart playlists

```mermaid
sequenceDiagram
    actor U as User
    participant R as TrackRow
    participant PL as PlayerProvider
    participant A as expo-audio
    participant LP as LibraryProvider
    participant RU as rules.ts

    U->>R: tap song
    R->>PL: toggle(track)
    PL->>A: replace source and play
    A-->>PL: status updates
    PL->>PL: 50% of duration reached?
    PL->>LP: recordPlay(track)
    LP->>LP: reload tracks
    LP->>RU: evaluate each smart playlist
    RU-->>U: lists update automatically
```

## 7. Key technical decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Expo SDK 57, React Native, TypeScript | Preview on the iPhone from Windows with Expo Go |
| Navigation | Expo Router, `NativeTabs` | Real iOS 26 tab bar with Liquid Glass and a separate search tab |
| Glass | `expo-glass-effect` with fallback to a plain view | Native glass on iOS 26 |
| Icons | `expo-symbols` | Apple SF Symbols |
| Library data | `expo-sqlite` | Relational data for tracks, playlists and rules |
| Settings | SQLite key-value store | Simple synchronous reads at startup |
| Audio files | Copied into the app's documents folder | Always available offline, independent of the source |
| Smart playlists | Evaluated in memory from rules | Small libraries, always up to date, no stored results |
| Networking | None | No external services, privacy, zero cost |

## 8. Expo Go limitations

| Feature | In Expo Go | In the installed app |
|---|---|---|
| Background audio and Lock Screen | Not available | Available with the `expo-audio` background option |
| *Entrada* folder visible in Files | Not available | Available with file sharing enabled |
| Remembering folder access across launches | Not available | Possible with a custom native module |

## 9. App configuration

| Setting | Value |
|---|---|
| Name | CoryMusic |
| Bundle identifier | `com.sabrinasalomon.corymusic` |
| Appearance | Dark |
| Config plugins | expo-router, expo-localization, expo-font, expo-status-bar, expo-sqlite, expo-audio, expo-asset |
