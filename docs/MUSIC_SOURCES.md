# Music Sources

CoryMusic has three rules: **free, legal, and no external services.** The app never connects to the internet. It plays audio files that are on your iPhone.

Getting the files happens **outside the app**, by you.

## ✅ Where the files can come from

| Source | Notes |
|---|---|
| **Files you already have** | Music on your computer, drives or old devices |
| **CDs you own** | Converted to audio files on a computer with a CD drive |
| **Free downloads offered by the artists** | Bandcamp *name your price* releases (enter 0), SoundCloud tracks with the download button enabled, official artist websites |
| **Creative Commons / public domain** | Internet Archive, Free Music Archive — respect each license (usually attribution) |

## 🔎 Where to find free, legal music

| Site | What you'll find | Check before downloading |
|---|---|---|
| **Free Music Archive** — freemusicarchive.org | Independent artists across many genres | License shown on each track |
| **Internet Archive — Netlabels** — archive.org | Full albums from independent labels | Creative Commons license of each release |
| **Bandcamp** — bandcamp.com | Artists offering *name your price* releases | Enter **0** as the price; choose MP3, FLAC or AAC |
| **SoundCloud** — soundcloud.com | Tracks where the artist enabled downloads | Only tracks with the download button |
| **Jamendo** — jamendo.com (website) | Independent music under free licenses | Personal use terms |
| **Musopen** — musopen.org | Public-domain classical recordings | Free |
| **Pixabay Music** — pixabay.com/music | Royalty-free instrumental music | Content license |
| **Official artist websites** | Free singles and fan gifts | Must be an official download |

## 🎧 Supported formats

| Supported | Not supported on iOS |
|---|---|
| MP3, M4A, AAC, WAV, AIFF, FLAC | OGG, OPUS, WMA, APE, MKA, WEBM |

When a site offers several formats, pick **MP3, AAC or FLAC**. CoryMusic counts unsupported files in the import summary.

## 📲 How songs get into CoryMusic

| Method | How | Available |
|---|---|---|
| **Import from Files** | **Import your music** → choose songs from On My iPhone, iCloud Drive, OneDrive or any Files location | ✅ Now |
| **Music folder** | Choose a folder once (for example OneDrive › Music) and tap **Sync** when you add songs; subfolders are included | ✅ Now |
| **Entrada folder** | Drop songs into CoryMusic's own folder in Files; they import automatically when the app opens | 🔜 Installed app |

Tips:
- Put your music in a **OneDrive** or **iCloud Drive** folder from your computer, then choose that folder in CoryMusic.
- Make the folder **available offline** on the iPhone before syncing.
- CoryMusic keeps its own copy, so removing songs from the folder doesn't remove them from your library.

## 🎯 Following your favorite artists

1. Tap the **heart** on their songs.
2. Create a smart playlist with **Artist is [name]** and **Imported in the last 30 days**.
3. When you add a new song from that artist to your music folder and sync, it appears in that playlist automatically.

The app **cannot discover** new releases by itself — that would require an external service.

## ❌ Ruled out

| Option | Reason |
|---|---|
| Spotify SDK | External service; Development Mode requires Spotify Premium and allows few test users |
| Apple Music (MusicKit) | External service; requires a paid developer membership and a subscription per user |
| YouTube (app, links or embedded player) | External service with ads; its policies forbid audio-only and background playback |
| Deezer, iTunes Search, MusicBrainz APIs | External services |
| ShazamKit recognition | Needs network access |
| Downloading from YouTube, stream rips or "free MP3" sites | Copyright infringement — not supported |

## 🗃️ What goes into Git

| Commit | Never commit |
|---|---|
| Code, docs, diagrams, brand assets | Audio files (`.mp3`, `.m4a`, `.wav`, `.flac`, `.aac`, `.aiff`, …) |
| Backup **format example** | Personal backups, photos |

## References
- [Spotify — Update on Developer Access and Platform Security (Feb 2026)](https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security)
- [YouTube API Services — Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
