# Design

CoryMusic should feel **premium, calm and nocturnal**: pure black, purple light, elegant serif titles and Apple's native Liquid Glass on the floating controls.

> The layout takes common music-app patterns (large artwork rows, floating mini player) and gives them an original identity. No screens, artwork or branding from other apps are copied.

## 1. Brand

- **Name:** CoryMusic
- **Mark:** serif **CM** monogram — a purple C behind a light-purple M — on black, finished with Liquid Glass.
- **Personality:** elegant, private, nocturnal, personal.
- **Usage and license:** see [BRAND.md](../BRAND.md).

### App icon (built)

| Item | Detail |
|---|---|
| File | `design/icon/CoryMusic.icon` (Icon Composer package) |
| Background | Solid `#000000` fill defined in `icon.json` |
| Layer group "M" (front) | `cm-m.svg`, `#A98BFF`, glass, specular, chromatic shadow 0.5, translucency 0.2 |
| Layer group "C" (back) | `cm-c.svg`, `#8B5CF6`, glass, specular, chromatic shadow 0.35, translucency 0.2 |
| Tinted appearance | White mono layers `cm-c-mono.svg`, `cm-m-mono.svg` |
| Monogram size | ~72% of the canvas width, centered, no drawn rounded frame |
| Letterforms | Outlines from Cormorant Garamond SemiBold (SIL OFL 1.1) |
| Flat export | `design/icon/export/AppIcon-1024.png` |
| Final check | Open the `.icon` in Icon Composer on the Mac and review Default, Dark, Clear and Tinted |

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
| `danger` | `#FF8A8A` | Destructive actions (delete) only |
| `glassTint` | `#7C3AED` at low opacity | Tint for Liquid Glass surfaces |

### Contrast (WCAG)
| Pair | Ratio |
|---|---|
| `textPrimary` on black | 16.19:1 |
| `accent` on black | 7.82:1 |
| `textSecondary` on black | 5.80:1 |
| White on `primaryFill` | 5.70:1 |
| `warning` on black | 8.75:1 |

`#8B5CF6` is used only as a graphic color (icon), never behind text: white on it is 4.23:1.
Artwork on black gets a **0.5 pt `hairline` border** so dark covers don't disappear.

## 3. Typography

| Role | Font | Example |
|---|---|---|
| Large titles, artist and playlist names, section headers | **New York** (`.fontDesign(.serif)`) | "Your collection", "Artist Name" |
| Body, lists, buttons | **SF Pro** (system) | Song rows, controls |
| Overlines | SF Pro, wide letter spacing, `textSecondary` | "FAVORITE ARTIST" |
| File names | SF Mono | `track_07.mp3` |

All text supports **Dynamic Type**. Spanish strings run ~20% longer than English — layouts must wrap, not truncate, titles.

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
| Tab bar | `TabView` with **Home, Library, Playlists, Search** (search as a search-role tab) |
| Mini player | `.tabViewBottomAccessory` |
| Minimize on scroll | `.tabBarMinimizeBehavior(.onScrollDown)` |
| Settings | Glass gear button on Home (not a tab) |
| Artwork → detail | `.navigationTransition(.zoom)` |

## 7. Motion & feedback

| Moment | Effect |
|---|---|
| Play / pause | SF Symbol replace transition; artwork scales down slightly when paused |
| Now playing indicator | Animated audio bars |
| Favorite, add to playlist, import finished | `.sensoryFeedback` light haptic (can be turned off) |
| Sleep timer ends | Volume fades out over a few seconds |
| Reduce Motion enabled | Replace scale/zoom with fades |

## 8. Screens (approved mockups)

| Screen | Key elements |
|---|---|
| **Welcome** | CM mark, app name, "Get started"; name field with Skip; time-of-day greeting; import options |
| **Home** | CM mark, greeting overline, "Your collection", continue listening, *Recently added*, *More from [Artist]* (most played in the last 7 days), *Made for you* |
| **Artist** | Hero image with glass buttons, name in serif, play (primary) + shuffle (glass), *Latest*, *Most played*, *Discography* |
| **Album** | Large artwork, title, artist, year, count, duration, play + shuffle, song list with delete |
| **Delete confirmation** | Trash icon, song name, explanation (library, playlists and iPhone storage), *Delete anyway* (`danger`), *Cancel* (primary) |
| **Now Playing** | Source overline, large artwork, serif title, favorite, thin progress bar, primary play button, shuffle/repeat, volume, lyrics, sleep timer, output, queue |
| **Queue** | Now playing card with bars, *Added by you*, *From [source]*, reorder, remaining time |
| **Lyrics** | Empty state with write/paste; edit mode; current line large in `accent`, others dimmed |
| **Sleep timer** | Glass sheet: 15 / 30 / 60 min, end of song; countdown; turn off |
| **Library** | Summary, glass segmented control (Artists / Albums / Songs), Entrada notice, sort and import buttons |
| **Import** | Glass sheet: from Files, Entrada toggle, from Mac; progress with imported / duplicate / incomplete states |
| **Review song** | Original file name, suggestion card (accept / ignore), data fields, apply to folder |
| **To review** | Suggestions first, multi-select bulk edit, accept all |
| **Playlists** | Pinned playlist, smart row, your playlists grid, create sheet (normal / smart, name, cover) |
| **Playlist detail** | Cover, stats, primary play + glass shuffle, edit mode |
| **Add songs** | Search, scopes (songs, albums, artists), + / ✓ toggles, counter in the confirm button |
| **Rule editor** | Name, match all / any, rule rows, add rule, sort, limit, *Favorites only*, live preview |
| **Search** | Bottom glass search field, recents, favorite artists, library shortcuts, scoped results with highlights |
| **Settings** | Library (Entrada, To review, storage), Playback (default timer, continue with similar, haptics), Backup, About (privacy, version) |
| **Backup** | Status shield, what is saved / not saved, weekly automatic backup, folder outside the app, *Back up now* (primary), *Restore* (glass), restore report |
| **Empty states** | Library (CM mark + import), Playlists (create), Search (no results) |

## 9. Naming glossary (UI copy)

| Concept | English (base) | Spanish |
|---|---|---|
| Home tab | Home | Inicio |
| Library tab | Library | Biblioteca |
| Songs imported recently | Recently added | Recién llegadas |
| Latest additions on an artist page | Latest | Lo más reciente |
| Artist smart playlist | New from [Artist] | Lo nuevo de [Artista] |
| Most played on an artist page | Most played | Las que más suenan |
| Favorites playlist | My favorites | Mis favoritas |
| Automatic import folder | Entrada | Entrada |
| Incomplete songs | To review | Por revisar |
| Delete confirmation button | Delete anyway | Eliminar de todos modos |
| Continue playback option | Continue with similar songs | Continuar con similares |
| Greeting | Good morning / Good afternoon / Good evening | Buenos días / Buenas tardes / Buenas noches |

The folder name **Entrada** stays the same in both languages so files always go to one place.
