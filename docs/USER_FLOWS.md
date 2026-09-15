# User Flows

## 1. Screen map

```mermaid
flowchart LR
    Launch([App launch]) --> Tabs

    subgraph Tabs["Tab bar"]
        T1[🎵 Library]
        T2[📃 Playlists]
        T3[🔍 Search]
        T4[⚙️ Settings]
    end

    T1 --> Songs[Songs list]
    T1 --> Artists[Artists list]
    T1 --> Albums[Albums grid]
    Artists --> ArtistDetail[Artist detail]
    Albums --> AlbumDetail[Album detail]
    T1 --> Import[Import from Files]

    T2 --> PlaylistDetail[Playlist detail]
    T2 --> NewPlaylist[New playlist]
    PlaylistDetail --> AddSongs[Add songs sheet]
    PlaylistDetail --> Reorder[Edit / reorder]

    T3 --> Results[Results: songs · artists · albums]

    T4 --> Backup[Export backup]
    T4 --> Restore[Restore backup]
    T4 --> About[About & licenses]

    Songs & ArtistDetail & AlbumDetail & PlaylistDetail & Results --> Mini[Mini player]
    Mini --> NowPlaying[Now Playing]
    NowPlaying --> Queue[Up Next queue]
```

## 2. First launch

```mermaid
flowchart TD
    A([Open CoryMusic]) --> B{Library empty?}
    B -- Yes --> C[Empty state:<br/>'Import your music']
    C --> D[Tap Import]
    D --> E[Files picker]
    E --> F[Import progress]
    F --> G[Summary: added / skipped / failed]
    G --> H[Library by Artists]
    B -- No --> H
```

## 3. Build a playlist with your favorite artists

```mermaid
flowchart TD
    A[Playlists tab] --> B[Tap +]
    B --> C[Name + cover icon]
    C --> D[Empty playlist]
    D --> E[Add songs]
    E --> F{Browse by}
    F -- Artist --> G[Pick artist → select songs]
    F -- Search --> H[Type title → select songs]
    G & H --> I[Songs added at the end]
    I --> J[Edit → drag to reorder]
    J --> K[Play / Shuffle]
```

## 4. Backup & restore

```mermaid
flowchart TD
    A[Settings] --> B{Action}
    B -- Export --> C[BackupService encodes JSON]
    C --> D[Share sheet / save to Files]
    B -- Restore --> E[Pick JSON in Files]
    E --> F{schemaVersion supported?}
    F -- No --> G[Show error]
    F -- Yes --> H[Match tracks by fileName + duration]
    H --> I[Recreate playlists]
    I --> J[Report: restored / missing songs]
```

## 5. Screens checklist

| Screen | Main components |
|---|---|
| Library | Segmented control (Songs · Artists · Albums), Import button, list/grid |
| Artist detail | Header with name + favorite toggle, Play / Shuffle, songs list |
| Playlist detail | Cover, name, song count & total time, Play / Shuffle, editable list |
| Now Playing | Artwork, title/artist, progress slider, controls, shuffle/repeat, queue button |
| Mini player | Artwork thumbnail, title, play/pause, next — pinned above the tab bar |
| Settings | Backup, Restore, storage used, About |
