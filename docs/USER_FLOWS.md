# User Flows

UI labels follow the glossary in [DESIGN.md](DESIGN.md#9-naming-glossary-ui-copy). Diagrams use the English (base) names.

## 1. Screen map

```mermaid
flowchart LR
    Launch([App launch]) --> First{First launch?}
    First -- Yes --> Welcome[Welcome]
    Welcome --> Tabs
    First -- No --> Tabs

    subgraph Tabs["Tab bar - Liquid Glass"]
        T1[Home]
        T2[Library]
        T3[Playlists]
        T4[Search]
    end

    T1 --> Settings[Settings]
    T1 --> Recent[Recently added]
    T1 --> MoreFrom[More from artist]

    T2 --> Artists[Artists]
    T2 --> Albums[Albums]
    T2 --> Songs[Songs]
    T2 --> Import[Import sheet]
    T2 --> Review[To review]
    Artists --> ArtistPage[Artist page]
    Albums --> AlbumPage[Album page]
    AlbumPage --> Delete[Delete confirmation]
    Songs --> Delete
    Review --> EditSong[Review song]

    T3 --> Pinned[Pinned playlist]
    T3 --> Detail[Playlist detail]
    T3 --> Create[New playlist sheet]
    Detail --> AddSongs[Add songs sheet]
    Create --> RuleEditor[Rule editor]

    T4 --> Results[Scoped results]

    Settings --> Backup[Backup and restore]

    Tabs -.-> Mini[Mini player]
    Mini --> NowPlaying[Now Playing]
    NowPlaying --> Queue[Queue]
    NowPlaying --> Lyrics[Lyrics]
    NowPlaying --> Timer[Sleep timer sheet]
```

## 2. Welcome (first launch)

```mermaid
flowchart TD
    A([Open CoryMusic for the first time]) --> B[Welcome: CM mark + Get started]
    B --> C[What's your name?]
    C --> D{Name entered?}
    D -- Continue without name --> E[Inline error: enter a name or tap Skip]
    E --> C
    D -- Yes --> F[Save userName]
    D -- Skip --> G[No name]
    F & G --> H{Current hour}
    H -- 05 to 11 --> I1[Good morning]
    H -- 12 to 18 --> I2[Good afternoon]
    H -- 19 to 04 --> I3[Good evening]
    I1 & I2 & I3 --> J[Greeting with name if any + import options]
    J --> K{Import now?}
    K -- Files --> L[Files picker]
    K -- Mac or AirDrop --> M[Explain Entrada folder]
    K -- Later --> N[Home with empty state]
    L & M --> O[Import progress and summary]
    O --> P[Home]
```

## 3. Automatic import from Entrada

```mermaid
flowchart TD
    A[User copies songs to Entrada via Finder, AirDrop or Files] --> B[User opens CoryMusic]
    B --> C{Entrada auto-import on?}
    C -- No --> Z[Files wait in Entrada]
    C -- Yes --> D[Import new files]
    D --> E{Tags complete?}
    E -- Yes --> F[Added to library]
    E -- No --> G[Added with suggestion to To review]
    F & G --> H[Smart playlists and pending restored songs update]
    H --> I[Notice in Library: N new songs from Entrada]
```

## 4. Fix incomplete songs

```mermaid
flowchart TD
    A[To review] --> B{Has suggestion?}
    B -- Yes --> C[Review song: suggestion card]
    C --> D{Accept?}
    D -- Accept --> E[Fields filled, editable]
    D -- Ignore --> F[Fill manually with autocomplete]
    B -- No --> F
    E & F --> G{Apply to same folder?}
    G -- Yes --> H[Album, artist, artwork applied to group]
    G -- No --> I[Save]
    H --> I
    I --> J[Leaves To review and joins matching smart playlists]
    A --> K[Select several songs] --> L[Bulk edit artist, album or artwork]
    A --> M[Accept all suggestions]
```

## 5. Delete a song

```mermaid
flowchart TD
    A[Album page, song list or song menu] --> B[Tap delete]
    B --> C[Confirmation: removed from library, all playlists and iPhone storage]
    C --> D{Choice}
    D -- Cancel --> E[Nothing changes]
    D -- Delete anyway --> F[Remove playlist entries and track]
    F --> G[Delete audio file]
    G --> H[Remove empty album or artist]
    H --> I[Toast: Song deleted]
```

## 6. Create a playlist

```mermaid
flowchart TD
    A[Playlists] --> B[Glass plus button]
    B --> C[New playlist sheet]
    C --> D{Type}
    D -- Normal --> E[Name + cover]
    E --> F[Add songs: songs, albums or artists]
    F --> G[Detail: reorder, remove with undo]
    D -- Smart --> H[Name + cover]
    H --> I[Rule editor: match, rules, sort, limit, favorites only]
    I --> J[Live preview count]
    J --> K[Save - updates automatically]
```

## 7. Favorite artist to smart playlist

```mermaid
flowchart TD
    A[Artist page] --> B[Tap heart]
    B --> C[Artist marked favorite]
    C --> D{Create New from artist?}
    D -- Yes --> E[Smart playlist: artist is X and imported in last 30 days]
    D -- No --> F[Done]
    E --> G[New songs from X appear automatically after import]
```

## 8. Backup & restore

```mermaid
flowchart TD
    A[App launch] --> B{Weekly backup on and 7 days passed?}
    B -- Yes --> C{Backup folder available?}
    C -- Yes --> D[Write JSON, keep 5 most recent]
    C -- No --> E[Ask to choose the folder again]
    B -- No --> F[Continue]

    G[Settings - Backup] --> H{Action}
    H -- Back up now --> D
    H -- Change folder --> I[Folder picker outside the app]
    H -- Restore --> J[Pick JSON]
    J --> K{schemaVersion supported?}
    K -- No --> L[Error message]
    K -- Yes --> M[Match tracks by fileName + duration]
    M --> N[Recreate playlists, rules, favorites, edits, lyrics]
    N --> O[Report: restored and missing songs]
    O --> P[Missing songs stay pending until imported]
```
