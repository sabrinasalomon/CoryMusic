# User Flows

UI labels follow the glossary in [DESIGN.md](DESIGN.md#9-naming-glossary-ui-copy).

## 1. Screen map

```mermaid
flowchart LR
    Launch([App launch]) --> Tabs

    subgraph Tabs["Tab bar - Liquid Glass"]
        T1[Inicio]
        T2[Biblioteca]
        T3[Playlists]
        T4[Buscar]
    end

    T1 --> Settings[Ajustes]
    T1 --> Recent[Recién llegadas]
    T1 --> MoreFrom[Más de artista]

    T2 --> Artists[Artistas]
    T2 --> Albums[Álbumes]
    T2 --> Songs[Canciones]
    T2 --> Import[Importar - hoja]
    T2 --> Review[Por revisar]
    Artists --> ArtistPage[Página de artista]
    Albums --> AlbumPage[Álbum]
    Review --> EditSong[Revisar canción]

    T3 --> Pinned[Playlist fijada]
    T3 --> Detail[Detalle de playlist]
    T3 --> Create[Nueva playlist - hoja]
    Create --> RuleEditor[Editor de reglas]

    T4 --> Results[Resultados con filtros]

    Settings --> Backup[Respaldo y restauración]

    Tabs -.-> Mini[Mini reproductor]
    Mini --> NowPlaying[Reproduciendo]
    NowPlaying --> Queue[Cola]
```

## 2. First launch

```mermaid
flowchart TD
    A([Open CoryMusic]) --> B{Library empty?}
    B -- Yes --> C[CM monogram + Importar tu música]
    C --> D{How?}
    D -- Files --> E[Files picker]
    D -- Mac or AirDrop --> F[Copy files to Entrada]
    E & F --> G[Import progress]
    G --> H[Summary: imported, duplicates, to review]
    H --> I[Inicio]
    B -- No --> J[Scan Entrada folder]
    J --> I
```

## 3. Automatic import from Entrada

```mermaid
flowchart TD
    A[User copies songs to Entrada via Finder, AirDrop or Files] --> B[User opens CoryMusic]
    B --> C{Inbox auto-import on?}
    C -- No --> Z[Files wait in Entrada]
    C -- Yes --> D[Import new files]
    D --> E{Tags complete?}
    E -- Yes --> F[Added to library]
    E -- No --> G[Added with suggestion to Por revisar]
    F & G --> H[Smart playlists update]
    H --> I[Notice in Biblioteca: N canciones nuevas desde Entrada]
```

## 4. Fix incomplete songs

```mermaid
flowchart TD
    A[Por revisar] --> B{Has suggestion?}
    B -- Yes --> C[Revisar canción: suggestion card]
    C --> D{Accept?}
    D -- Accept --> E[Fields filled, editable]
    D -- Ignore --> F[Fill manually with autocomplete]
    B -- No --> F
    E & F --> G{Apply to same folder?}
    G -- Yes --> H[Album, artist, artwork applied to group]
    G -- No --> I[Save]
    H --> I
    I --> J[Leaves Por revisar and joins matching smart playlists]
    A --> K[Select several songs] --> L[Bulk edit artist, album or artwork]
    A --> M[Accept all suggestions]
```

## 5. Create a playlist

```mermaid
flowchart TD
    A[Playlists] --> B[Glass plus button]
    B --> C[Nueva playlist sheet]
    C --> D{Type}
    D -- Normal --> E[Name + cover]
    E --> F[Agregar canciones: songs, albums or artists]
    F --> G[Detail: reorder, remove with undo]
    D -- Smart --> H[Name + cover]
    H --> I[Editor de reglas: match, rules, sort, limit]
    I --> J[Live preview count]
    J --> K[Save - updates automatically]
```

## 6. Favorite artist to smart playlist

```mermaid
flowchart TD
    A[Artist page] --> B[Tap heart]
    B --> C[Artist marked favorite]
    C --> D{Create Lo nuevo de artista?}
    D -- Yes --> E[Smart playlist: artist is X and imported in last 30 days]
    D -- No --> F[Done]
    E --> G[New songs from X appear automatically after import]
```

## 7. Backup & restore

```mermaid
flowchart TD
    A[Ajustes] --> B{Action}
    B -- Export --> C[Encode playlists, rules, favorites, edits]
    C --> D[Save JSON to Files]
    B -- Restore --> E[Pick JSON]
    E --> F{schemaVersion supported?}
    F -- No --> G[Error message]
    F -- Yes --> H[Match tracks by fileName + duration]
    H --> I[Recreate playlists and rules]
    I --> J[Report: restored and missing songs]
```
