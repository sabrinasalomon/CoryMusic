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

    T1 --> Profile[Profile]
    T1 --> Settings[Settings]
    Settings --> Profile

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
    E & F & G --> H[Summary alert]
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

## 7. Planned flows

| Flow | Summary |
|---|---|
| Now Playing | Full-screen player with queue, shuffle, repeat and sleep timer |
| Delete a song | Confirmation, then remove from library, playlists and storage |
| To review | Complete missing song data with suggestions |
| Backup | Weekly automatic JSON backup and restore report |
| Entrada folder | Automatic import on launch in the installed app |
