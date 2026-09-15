# Architecture

CoryMusic follows **MVVM + Services**. Views are thin, ViewModels hold screen state, and Services own side effects (audio, files, persistence). Everything runs on-device; there is no backend.

## 1. Layer overview

```mermaid
flowchart TB
    subgraph UI["Presentation — SwiftUI"]
        V1[LibraryView]
        V2[ArtistDetailView]
        V3[PlaylistDetailView]
        V4[NowPlayingView]
        V5[MiniPlayerView]
        V6[SettingsView]
    end

    subgraph VM["ViewModels — @Observable"]
        VM1[LibraryViewModel]
        VM2[PlaylistViewModel]
        VM3[PlayerViewModel]
        VM4[SettingsViewModel]
    end

    subgraph SV["Services"]
        S1[AudioPlayerService]
        S2[ImportService]
        S3[MetadataService]
        S4[NowPlayingService]
        S5[BackupService]
        S6[JamendoService<br/><i>later</i>]
    end

    subgraph DATA["Data"]
        D1[(SwiftData store)]
        D2[/App sandbox<br/>Documents/Music/]
    end

    subgraph IOS["iOS frameworks"]
        F1[AVFoundation]
        F2[MediaPlayer]
        F3[UniformTypeIdentifiers]
    end

    V1 & V2 --> VM1
    V3 --> VM2
    V4 & V5 --> VM3
    V6 --> VM4

    VM1 --> S2
    VM1 --> D1
    VM2 --> D1
    VM3 --> S1
    VM4 --> S5

    S1 --> F1
    S1 --> S4
    S4 --> F2
    S2 --> F3
    S2 --> S3
    S2 --> D2
    S3 --> F1
    S2 --> D1
    S5 --> D1
    S6 -.-> S1
```

## 2. Responsibilities

| Component | Responsibility |
|---|---|
| **AudioPlayerService** | Wraps `AVPlayer`; queue, play/pause/seek, shuffle/repeat; configures `AVAudioSession` (`.playback`); handles interruptions and route changes |
| **NowPlayingService** | Updates `MPNowPlayingInfoCenter` (title, artist, artwork, progress) and registers `MPRemoteCommandCenter` handlers |
| **ImportService** | Receives URLs from `.fileImporter`, copies files into `Documents/Music/`, avoids duplicates, creates `Track` records |
| **MetadataService** | Loads common metadata and artwork from `AVURLAsset` asynchronously |
| **BackupService** | Encodes playlists + track metadata to JSON and restores them, matching tracks by file name + duration |
| **JamendoService** *(later)* | Searches Creative Commons tracks and returns stream URLs for `AudioPlayerService` |

## 3. Sequence — importing songs

```mermaid
sequenceDiagram
    actor U as User
    participant LV as LibraryView
    participant VM as LibraryViewModel
    participant IS as ImportService
    participant MS as MetadataService
    participant FS as Documents/Music
    participant DB as SwiftData

    U->>LV: Tap "Import"
    LV->>U: Show Files picker (.fileImporter)
    U->>LV: Select audio files
    LV->>VM: importFiles(urls)
    VM->>IS: import(urls)
    loop each file
        IS->>IS: startAccessingSecurityScopedResource()
        IS->>FS: Copy file (skip if duplicate)
        IS->>MS: loadMetadata(localURL)
        MS-->>IS: title, artist, album, duration, artwork
        IS->>DB: Insert Track (+ Artist/Album if new)
        IS->>IS: stopAccessingSecurityScopedResource()
    end
    IS-->>VM: ImportResult (added, skipped, failed)
    VM-->>LV: Refresh library + show summary
```

## 4. Sequence — playback in background

```mermaid
sequenceDiagram
    actor U as User
    participant PV as PlaylistDetailView
    participant PVM as PlayerViewModel
    participant AP as AudioPlayerService
    participant AS as AVAudioSession
    participant NP as NowPlayingService
    participant LS as Lock Screen

    U->>PV: Tap a song
    PV->>PVM: play(track, queue)
    PVM->>AP: setQueue + play()
    AP->>AS: setCategory(.playback) + setActive(true)
    AP->>AP: AVPlayer.play()
    AP->>NP: update(nowPlaying)
    NP->>LS: Title, artist, artwork, progress
    U->>LS: Lock phone / press Next
    LS->>NP: remoteCommand(.nextTrack)
    NP->>AP: next()
    AP->>NP: update(nowPlaying)
```

## 5. Playback state machine

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: play(track)
    Loading --> Playing: ready
    Loading --> Failed: error
    Playing --> Paused: pause / interruption began
    Paused --> Playing: play / interruption ended (shouldResume)
    Playing --> Loading: next / previous
    Playing --> Idle: queue finished (repeat off)
    Playing --> Paused: headphones unplugged
    Failed --> Loading: skip to next
    Paused --> Idle: stop
```

## 6. Key technical decisions

| Decision | Choice | Reason |
|---|---|---|
| UI framework | SwiftUI | Modern, less code, great for portfolio |
| Persistence | SwiftData | Native, no server, survives re-installs |
| Audio storage | Copy into app sandbox | Files stay available after re-install; no broken bookmarks |
| Backend | None | Zero cost, privacy, offline-first |
| Minimum iOS | 17 | Required by SwiftData and `@Observable` |
| Third-party dependencies | None for MVP | Nothing to maintain or pay for |

## 7. Required capabilities & Info.plist

| Setting | Value | Why |
|---|---|---|
| Background Modes | **Audio, AirPlay, and Picture in Picture** | Keep playing when locked |
| `UIFileSharingEnabled` | `YES` | Show the app folder in Files |
| `LSSupportsOpeningDocumentsInPlace` | `YES` | Open/export backups in Files |
