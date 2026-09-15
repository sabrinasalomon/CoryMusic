# Design

CoryMusic should feel **premium, calm and nocturnal**: pure black, purple light, elegant serif titles and Apple's native Liquid Glass on the floating controls.

> The layout takes common music-app patterns (large artwork rows, floating mini player) and gives them an original identity. No screens, artwork or branding from other apps are copied.

## 1. Brand

- **Name:** CoryMusic
- **Mark:** serif **CM** monogram in glossy purple glass with a soft purple glow on black.
- **Personality:** elegant, private, nocturnal, personal.

### App icon checklist
| Requirement | Detail |
|---|---|
| Canvas | Square **1024 × 1024 px**, no transparency |
| Rounded frame | **Do not draw it** — iOS applies its own mask. Remove the drawn rounded border from the concept image |
| Composition | Monogram centered on full-bleed black, with safe margin |
| Layers | Build in **Icon Composer**: background layer (black) + foreground layer (CM monogram) so iOS 26 can render glass, dark, tinted and clear appearances |

## 2. Color

The app always uses **dark appearance** (`.preferredColorScheme(.dark)`).

| Token | Hex | Use |
|---|---|---|
| `background` | `#000000` | Every screen background (true black on OLED) |
| `surfaceSubtle` | `#07040F` | Cards and tiles that need a hint of separation |
| `hairline` | `#2A1F45` | 0.5 pt separators and borders |
| `borderStrong` | `#3B2B66` | Inactive chips, placeholders |
| `accent` | `#A98BFF` | Titles, active icons, selected states, highlighted search matches |
| `primaryFill` | `#7C3AED` | The single filled primary button per screen (white label) |
| `primaryFillPressed` | `#6D28D9` | Pressed state |
| `textPrimary` | `#E6DEFA` | Body text |
| `textSecondary` | `#8A82A3` | Metadata, captions |
| `warning` | `#C9A24A` | Incomplete-data indicator only |
| `glassTint` | `#7C3AED` at low opacity | Tint for Liquid Glass surfaces |

### Contrast
- `accent` and `textPrimary` on black exceed 4.5:1.
- White on `primaryFill` exceeds 4.5:1. (`#8B5CF6`, used in early mockups, did not — replaced.)
- Artwork on black gets a **0.5 pt `hairline` border** so dark covers don't disappear.

## 3. Typography

| Role | Font | Example |
|---|---|---|
| Large titles, artist and playlist names, section headers | **New York** (`.fontDesign(.serif)`) | "Tu colección", "Artist Name" |
| Body, lists, buttons | **SF Pro** (system) | Song rows, controls |
| Overlines | SF Pro, small caps style, wide letter spacing, `textSecondary` | "ARTISTA FAVORITO" |
| File names | SF Mono | `track_07.mp3` |

All text supports **Dynamic Type**.

## 4. Shape & spacing

| Element | Corner radius |
|---|---|
| Album / song artwork | 4 pt |
| Cards and tiles | 6–12 pt |
| Glass controls | Capsule / circle |
| Artist images | Circle |

Generous black space; one primary action per screen.

## 5. Liquid Glass rules

| Rule | Detail |
|---|---|
| Glass only on the **navigation layer** | Tab bar, mini player, floating buttons over images, sheets |
| **Never** glass on content | Artwork, rows, cards stay on pure black |
| **No glass on glass** | Don't stack glass controls on glass sheets |
| Purple tint | `.glassEffect(.regular.tint(...))` with a subtle `glassTint` |
| Group nearby controls | `GlassEffectContainer` so shapes merge smoothly |
| Buttons | `.buttonStyle(.glass)` for secondary, filled `primaryFill` for the single primary action |

## 6. Navigation

| Element | Implementation |
|---|---|
| Tab bar | `TabView` with **Inicio, Biblioteca, Playlists, Buscar** (search as a search-role tab) |
| Mini player | `.tabViewBottomAccessory` |
| Minimize on scroll | `.tabBarMinimizeBehavior(.onScrollDown)` |
| Settings | Glass gear button on Inicio (not a tab) |
| Artwork → detail | `.navigationTransition(.zoom)` |

## 7. Motion & feedback

| Moment | Effect |
|---|---|
| Play / pause | SF Symbol replace transition; artwork scales down slightly when paused |
| Now playing indicator | Animated audio bars |
| Favorite, add to playlist, import finished | `.sensoryFeedback` light haptic |
| Reduce Motion enabled | Replace scale/zoom with fades |

## 8. Screens (approved mockups)

| Screen | Key elements |
|---|---|
| **Inicio** | CM mark, overline greeting, "Tu colección", continue listening, *Recién llegadas*, *Más de [Artista]*, *Hechas a tu medida* |
| **Artista** | Hero image with glass buttons, name in serif, play (primary) + shuffle (glass), *Lo más reciente*, *Las que más suenan*, *Discografía* |
| **Reproduciendo** | Source overline, large artwork, serif title, favorite, thin progress bar, primary play button, shuffle/repeat, volume, lyrics, sleep timer, output, queue |
| **Cola** | Now playing card with bars, *Agregadas por ti*, *Desde [origen]*, reorder, remaining time |
| **Biblioteca** | Summary, glass segmented control (Artistas / Álbumes / Canciones), Inbox notice, sort and import buttons |
| **Importar** | Glass sheet: from Files, Inbox toggle, from Mac; progress with imported / duplicate / incomplete states |
| **Revisar canción** | Original file name, suggestion card (accept / ignore), data fields, apply to folder |
| **Por revisar** | Suggestions first, multi-select bulk edit, accept all |
| **Playlists** | Pinned playlist, smart row, your playlists grid, create sheet (normal / smart, name, cover) |
| **Detalle de playlist** | Cover, stats, primary play + glass shuffle, edit mode |
| **Editor de reglas** | Name, match all / any, rule rows, add rule, sort, limit, *Solo favoritas*, live preview |
| **Buscar** | Bottom glass search field, recents, favorite artists, library shortcuts, scoped results with highlights |
| **Ajustes** | *Pending analysis* |

## 9. Naming glossary (UI copy)

| Concept | UI label |
|---|---|
| Songs imported recently (home section and smart playlist) | **Recién llegadas** |
| Latest additions on an artist page | **Lo más reciente** |
| Artist smart playlist | **Lo nuevo de [Artista]** |
| Most played on an artist page | **Las que más suenan** |
| Favorites playlist | **Mis favoritas** |
| Automatic import folder | **Entrada** |
| Incomplete songs | **Por revisar** |
