# User Flows

UI labels follow the glossary in [DESIGN.md](DESIGN.md#9-naming-glossary-ui-copy). Diagrams use the English names. Flows marked *planned* are not implemented yet.

## 1. Screen map

```mermaid
flowchart LR
    Launch([App launch]) --> First{Welcome done?}
    First -- No --> Welcome[Welcome]
    Welcome --> Tabs
    First -- Yes --> Tabs

    subgraph Tabs["Native tab bar - Liquid Glass"]
        T1[Home]
        T2[Library]
        T3[Playlists]
        T4[Search]
    end

    Tabs --> Mini[Mini player]
    Mini --> Player[Now Playing]
    Player --> Queue[Queue]

    T1 --> Profile[Profile]
    T1 --> Settings[Settings]
    Settings --> Profile
    Settings --> Backup[Backup and restore]

    T2 --> Songs[Songs]
    T2 --> Artists[Artists]
    T2 --> Folder[Music folder card]
    T2 --> Import[Import from Files]

    T3 --> Suggestions[One-tap suggestions]
    T3 --> Detail[Smart playlist detail]
    T3 --> Editor[Smart playlist editor]
    Detail --> Editor
```

## 2. Welcome

```mermaid
flowchart TD
    A([First launch]) --> B[Welcome: CM mark + Get started]
    B --> C[What's your name?]
    C --> D{Name entered?}
    D -- Continue without name --> E[Inline error: enter a name or tap Skip]
    E --> C
    D -- Yes --> F[Save name]
    D -- Skip --> G[No name]
    F & G --> H[Greeting by time of day]
    H --> I{Import now?}
    I -- Import your music --> J[Files picker, then Home]
    I -- Maybe later --> K[Home]
```

## 3. Import from Files

```mermaid
flowchart TD
    A[Home, Library or Welcome] --> B[Import your music]
    B --> C[Files picker - choose several songs]
    C --> D{For each file}
    D -- ogg or other unsupported --> E[Count as not supported]
    D -- same name and size already imported --> F[Count as duplicate]
    D -- new --> G[Copy into the app and read artist - title from the name]
    G --> P[Apply pending favorites and plays from a backup, if any]
    E & F & P --> H[Summary alert]
    H --> I[Library, Recently added and smart playlists update]
```

## 4. Music folder sync

```mermaid
flowchart TD
    A[Music folder card in Library or Settings] --> B{Folder chosen?}
    B -- No --> C[Choose folder]
    C --> D[Folder picker, e.g. OneDrive - Music]
    B -- Yes --> E[Sync]
    E --> F{Opened in this session?}
    F -- Yes --> G[Scan folder and subfolders]
    F -- No --> H[Picker opens at the saved folder - confirm]
    H --> G
    D --> G
    G --> I[Copy new songs, skip duplicates, count unsupported]
    I --> J[Summary + last sync time]
    A --> K[Change - pick another folder]
    A --> L[Forget folder - songs stay in the library]
```

## 5. Smart playlists

```mermaid
flowchart TD
    A[Playlists] --> B{How?}
    B -- Suggestion --> C[Create instantly and open detail]
    B -- Plus button --> D[Editor]
    D --> E[Name]
    E --> F[Match all or any]
    F --> G[Rules: field, condition, value]
    G --> H[Sort and limit]
    H --> I[Live preview count]
    I --> J{Valid?}
    J -- Missing name or value --> K[Inline error]
    K --> E
    J -- Yes --> L[Save and open detail]
    L --> M[Detail: rules, Play, song list, Edit rules]
    M --> N[Delete from editor - confirmation, songs stay]
```

## 6. Favorites and plays

```mermaid
flowchart TD
    A[Any song row] --> B{Action}
    B -- Tap heart --> C[Toggle favorite]
    B -- Tap row --> D[Play or pause]
    D --> E{Half of the song heard?}
    E -- Yes --> F[Play count + 1 and last played now]
    C & F --> G[Smart playlists re-evaluate]
```

## 7. Now Playing

```mermaid
flowchart TD
    A[Tap a song, Play or Shuffle] --> B[Queue from that list - Playing from its name]
    B --> C[Mini player above the tab bar]
    C -- Tap --> D[Now Playing]
    D --> E{Action}
    E -- Drag the bar --> F[Jump to that position]
    E -- Next or previous --> G[Change song - previous restarts after 3 seconds]
    E -- Shuffle --> H[Current song first, the rest shuffled]
    E -- Repeat --> I[Off, all, this song]
    E -- Sleep timer --> J[15, 30, 45, 60 minutes or end of song]
    E -- Queue --> K[Jump to a song or remove it]
    J --> L[Playback pauses when the time is up]

    B --> M{Song ends}
    M -- Repeat this song --> N[Play it again]
    M -- More songs in the queue --> O[Next song]
    M -- End of queue with repeat all --> P[Back to the first song]
    M -- End of queue --> Q[Stop]
```

## 8. Backup and restore

```mermaid
flowchart TD
    A([App launch]) --> B{Weekly backup on and 7 days passed?}
    B -- Yes --> C[Automatic backup inside the app, keep 5]
    B -- No --> D[Continue]

    E[Settings - Backup and restore] --> F{Action}
    F -- Save backup --> G[Automatic backup + share sheet]
    G --> H[Save to Files or OneDrive]
    H --> I[Last saved date updates]
    F -- Restore from file --> J[Pick corymusic-backup file]
    F -- Tap an automatic backup --> K[Read backup]
    J --> L{Valid CoryMusic backup?}
    K --> L
    L -- No --> M[Error: not a CoryMusic backup]
    L -- Yes --> N[Confirmation with songs, playlists and profile]
    N -- Restore --> O[Safety backup of the current library]
    O --> P[Restore profile, playlists, favorites and plays]
    P --> Q[Report: playlists, songs updated, songs pending]
    Q --> R[Pending songs recover their data when imported]

    S{No backup saved outside the app in 7 days?} -- Yes --> T[Amber reminder on the Backup screen]
```

## 9. Planned flows

| Flow | Summary |
|---|---|
| Lyrics | Write or paste lyrics and read them from Now Playing |
| Delete a song | Confirmation, then remove from library, playlists and storage |
| To review | Complete missing song data with suggestions |
| Entrada folder | Automatic import from CoryMusic's own folder in Files |
