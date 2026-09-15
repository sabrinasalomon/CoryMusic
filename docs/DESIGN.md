# Design

CoryMusic should feel **premium, calm and nocturnal**: pure black, purple light, elegant serif titles and Apple's Liquid Glass on the floating controls.

> The layout takes common music-app patterns (large lists, floating tab bar) and gives them an original identity. No screens, artwork or branding from other apps are copied.

<p align="center">
  <img src="../design/screenshots/home.png" width="22%" alt="Home">
  <img src="../design/screenshots/library.png" width="22%" alt="Library">
  <img src="../design/screenshots/smart-playlist.png" width="22%" alt="Smart playlist editor">
  <img src="../design/screenshots/profile.png" width="22%" alt="Profile">
</p>

## 1. Brand

- **Name:** CoryMusic
- **Mark:** serif **CM** monogram — a purple C behind a light-purple M — on black, finished with Liquid Glass.
- **Personality:** elegant, private, nocturnal, personal.
- **Usage and license:** see [BRAND.md](../BRAND.md).

### App icon

| Item | Detail |
|---|---|
| Layered icon | `design/icon/CoryMusic.icon` (Icon Composer package for the installed app) |
| Expo icon | `mobile/assets/icon.png` — flat 1024 × 1024 export |
| Background | Solid `#000000` |
| Layers | "M" in front (`#A98BFF`), "C" behind (`#8B5CF6`), white mono versions for tinted appearance |
| Letterforms | Outlines from Cormorant Garamond SemiBold (SIL OFL 1.1) |

## 2. Color

The app always uses **dark appearance** (`userInterfaceStyle: "dark"`). Tokens live in `mobile/src/theme/tokens.ts`.

| Token | Value | Use |
|---|---|---|
| `background` | `#000000` | Every screen background (true black on OLED) |
| `surface` | `#07040F` | Cards and grouped lists |
| `surfaceRaised` | `#0E0820` | Inputs, chips, segmented controls |
| `surfaceHighlight` | `#1A1030` | Selected segment, gradient tops |
| `hairline` | `#2A1F45` | Separators and card borders |
| `borderStrong` | `#3B2B66` | Chips, inputs, badges |
| `accent` | `#A98BFF` | Titles, active icons, selected states |
| `accentSoft` | `rgba(169,139,255,0.16)` | Icon badges, selected chips |
| `primary` | `#7C3AED` | The single filled primary button per screen (white label) |
| `primaryPressed` | `#6D28D9` | Pressed state |
| `text` | `#E6DEFA` | Body text |
| `textSecondary` | `#8A82A3` | Metadata and captions |
| `textTertiary` | `#5E5775` | Placeholders and inactive hearts |
| `danger` | `#FF8A8A` | Destructive actions and input errors |
| `glassTint` | `rgba(124,58,237,0.14)` | Tint for glass buttons |
| Ambient glow | `rgba(124,58,237,0.22)` → transparent | Soft purple light at the top of each screen |

### Contrast (WCAG)
| Pair | Ratio |
|---|---|
| `text` on black | 16.19:1 |
| `accent` on black | 7.82:1 |
| `textSecondary` on black | 5.80:1 |
| White on `primary` | 5.70:1 |
| `danger` on black | 9.25:1 |

## 3. Typography

| Role | Font | Size |
|---|---|---|
| Large titles | Cormorant Garamond SemiBold (`@expo-google-fonts/cormorant-garamond`) | 44 / 48 |
| Sheet and card titles | Cormorant Garamond SemiBold | 30 / 34 |
| Section titles | Cormorant Garamond SemiBold | 24 / 28 |
| Headline | System font (SF Pro), semibold | 17 |
| Body | System font | 16 / 22 |
| Subhead and captions | System font | 15 and 13 |
| Overlines | System font, semibold, letter spacing 2, uppercase | 12 |

Spanish strings run longer than English — titles wrap instead of truncating.

## 4. Shape & spacing

| Element | Value |
|---|---|
| Song artwork placeholder | 6 pt radius |
| Inputs | 12 pt radius |
| Cards and grouped lists | 20 pt radius |
| Buttons, chips, segmented controls | Capsule |
| Avatars and glass icon buttons | Circle |
| Screen padding | 20 pt |
| Spacing scale | 4 · 8 · 12 · 16 · 24 · 32 · 44 |

One filled primary button per screen; everything else is glass, outlined or text.

## 5. Liquid Glass

| Where | Implementation |
|---|---|
| Tab bar | `NativeTabs` from `expo-router/unstable-native-tabs` — the real iOS 26 floating tab bar, minimizes on scroll |
| Search | Separate search-role tab |
| Icon buttons (settings, close, add, back, edit) | `GlassView` from `expo-glass-effect` with a subtle purple tint; plain surface fallback when glass isn't available |
| Content | Never glass — cards and lists stay on pure black |

## 6. Components

| Component | File | Notes |
|---|---|---|
| Screen | `src/components/Screen.tsx` | Ambient glow, overline, large serif title, header accessory |
| Glass icon button | `src/components/GlassIconButton.tsx` | SF Symbol, haptic tick |
| Primary button | `src/components/PrimaryButton.tsx` | Purple capsule with glow and light impact haptic |
| Empty state | `src/components/EmptyState.tsx` | Monogram or symbol, serif title, action |
| Track row | `src/components/TrackRow.tsx` | Artwork placeholder, title, artist, heart, play or pause |
| Folder card | `src/components/FolderCard.tsx` | Music folder name, last sync, Sync and Change |
| Chip | `src/components/Chip.tsx` | Rule fields, conditions, sort and limit |
| Avatar | `src/components/Avatar.tsx` | Photo or initials on a purple gradient |
| Symbol badge | `src/components/SymbolBadge.tsx` | SF Symbol on a soft purple square or circle |

Icons are **SF Symbols** through `expo-symbols`.

## 7. Motion & feedback

| Moment | Effect |
|---|---|
| Buttons and chips | Selection or light impact haptic (`expo-haptics`) |
| Import or sync with new songs | Success haptic |
| Pressed buttons | Slight scale down |
| Playing song | Waveform symbol and purple title |
| Sheets (Settings, Profile, rule editor) | Native form sheets with grabber |

## 8. Screens

| Screen | Status | Key elements |
|---|---|---|
| **Welcome** | ✅ | CM mark, "Welcome to CoryMusic", name step with inline validation, time-of-day greeting, import or later |
| **Home** | ✅ | Greeting with name, "Your collection", settings and profile buttons, Recently added, empty state with How it works |
| **Library** | ✅ | Song count, add button, Music folder card, Songs / Artists / Albums segments |
| **Playlists** | ✅ | Your smart playlists with live counts, one-tap suggestions |
| **Smart playlist detail** | ✅ | Rules summary, Play, matching songs, Edit rules |
| **Smart playlist editor** | ✅ | Name, match all / any, rule cards with chips, sort, limit, live preview, delete |
| **Profile** | ✅ | Photo, name, language, stats |
| **Settings** | ✅ | Profile card, music folder, library, playback, privacy, version |
| **Search** | 🟡 Layout | Search field and library shortcuts; results are planned |
| **Now Playing, Queue, Lyrics, Sleep timer** | 🔜 | Approved in mockups |
| **Album, Delete confirmation, To review, Backup** | 🔜 | Approved in mockups |

## 9. Naming glossary (UI copy)

| Concept | English | Spanish |
|---|---|---|
| Home tab | Home | Inicio |
| Library tab | Library | Biblioteca |
| Songs imported recently | Recently added | Recién llegadas |
| Most played suggestion | Most played | Las que más suenan |
| Favorites suggestion | My favorites | Mis favoritas |
| Not played for a while | Forgotten | Olvidadas |
| Music folder | Music folder | Carpeta de música |
| Automatic import folder | Entrada | Entrada |
| Incomplete songs | To review | Por revisar |
| Greeting | Good morning / Good afternoon / Good evening | Buenos días / Buenas tardes / Buenas noches |
