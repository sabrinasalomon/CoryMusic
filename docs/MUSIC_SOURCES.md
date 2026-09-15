# Music Sources

CoryMusic has three rules: **free, legal, and no external services.** The app itself never connects to the internet. It plays audio files that are already on your iPhone.

Getting the files happens **outside the app**, once, by you.

## ✅ Where the files can come from

| Source | Notes |
|---|---|
| **Files you already have** | Music on your computer, drives, old devices |
| **CDs you own** | Converted to audio files on a computer with a CD drive |
| **Free downloads offered by the artists** | Bandcamp releases with *name your price* (enter 0), SoundCloud tracks with the download button enabled, official artist websites and promotions |
| **Creative Commons / public domain** | Internet Archive, Free Music Archive — respect each license (usually attribution) |

## 🔎 Where to find free, legal music

| Site | What you'll find | Check before downloading |
|---|---|---|
| **Free Music Archive** — freemusicarchive.org | Independent artists across many genres | License shown on each track |
| **Internet Archive — Netlabels** — archive.org | Full albums from independent labels | Creative Commons license of each release |
| **Bandcamp** — bandcamp.com | Artists offering *name your price* releases | Enter **0** as the price |
| **SoundCloud** — soundcloud.com | Tracks where the artist enabled downloads | Only tracks with the download button |
| **Jamendo** — jamendo.com (website) | Independent music under free licenses | Personal use terms |
| **Musopen** — musopen.org | Public-domain classical recordings | Free |
| **Pixabay Music** — pixabay.com/music | Royalty-free instrumental music | Content license |
| **Official artist websites** | Free singles and fan gifts | Must be an official download |

For testing the app, start with **20–30 songs** from several artists, mixing files with complete tags and files without them, so the *To review* flow can be tested too.

## 📲 How files get into CoryMusic (no services)

| Method | How |
|---|---|
| **Finder (cable)** | Mac → Finder → your iPhone → *Files* → CoryMusic → drop files into **Entrada** |
| **AirDrop** | Send from the Mac, save to CoryMusic → **Entrada** |
| **Files app** | Move files into *On My iPhone* → CoryMusic → **Entrada**, or use *Importar* inside the app |

With **Entrada** auto-import on, the songs appear in the library the next time you open the app.

## 🎯 Following your favorite artists

1. Mark the artist as **favorite** on the artist page.
2. Accept the **Lo nuevo de [Artista]** smart playlist.
3. When you obtain a new song from that artist and drop it into **Entrada**, it is imported and appears in that playlist automatically.

The app **cannot discover** new releases by itself — that would require an external service.

## ❌ Ruled out

| Option | Reason |
|---|---|
| Spotify SDK | External service; since February 2026 Development Mode requires Spotify Premium and allows few test users |
| Apple Music (MusicKit) | External service; requires the paid Apple Developer Program and a subscription per user |
| YouTube (app, links or embedded player) | External service with ads; its policies forbid audio-only and background playback |
| Deezer, iTunes Search, MusicBrainz APIs | External services (were considered for detecting new releases) |
| Jamendo API | External service |
| ShazamKit recognition | Needs network access to Apple's catalog |
| Downloading from YouTube, stream rips or "free MP3" sites | Copyright infringement — not supported |

## 🗃️ What goes into Git

| Commit | Never commit |
|---|---|
| Code, docs, diagrams | Audio files (`.mp3`, `.m4a`, `.wav`, `.flac`, `.aac`, `.aiff`, …) |
| Backup **format example** | Personal backups, artist photos, artwork |

`.gitignore` blocks audio files and personal backups automatically.

## References
- [Spotify — Update on Developer Access and Platform Security (Feb 2026)](https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security)
- [YouTube API Services — Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
- [YouTube API Services — Required Minimum Functionality](https://developers.google.com/youtube/terms/required-minimum-functionality)
