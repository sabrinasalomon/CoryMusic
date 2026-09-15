# Music Sources

CoryMusic has one rule: **free for everyone, and legal.** This document explains where music can come from without paying — and which popular options were ruled out and why.

## ✅ Supported sources

### 1. Files you already have the right to use (MVP)
Songs already on your devices: music you bought or downloaded in the past, CDs you ripped, recordings of your own.
Import them through the **Files** app (iCloud Drive, "On My iPhone", a USB drive, AirDrop from your Mac).

### 2. Free downloads offered by the artists themselves (MVP)
Many artists legally give away their music. Look for:
| Where | What to look for |
|---|---|
| **Bandcamp** | Releases marked *"name your price"* — you can enter **0** |
| **SoundCloud** | Tracks where the artist enabled the **Download** button |
| **Artist websites / newsletters** | Free singles, EPs, live sessions |
| **Free Music Archive** / **Internet Archive** | Creative Commons and public-domain recordings |

Download the file, save it to Files, import it into CoryMusic.
> Creative Commons licenses usually require **attribution**. CoryMusic keeps the artist name on every track; check each license for extra conditions.

### 3. Jamendo API (later phase)
- Catalog of independent artists under Creative Commons.
- **Free for non-commercial apps**, requires a free developer registration (`client_id`), with a monthly request quota.
- Useful for a *Discover* tab — your specific commercial artists are unlikely to be there.

## ❌ Ruled out

| Option | Why it is not used |
|---|---|
| **Spotify SDK** | Since February 2026, Development Mode requires a **Spotify Premium** account for the developer and allows only a handful of test users. On-demand playback of a specific track also requires Premium. → Not free. |
| **Apple Music (MusicKit)** | Requires the paid Apple Developer Program and an Apple Music subscription for every user. → Not free. |
| **YouTube** | YouTube API policies forbid separating the audio from videos and forbid background playback. A music player built on YouTube would break its terms. |
| **Downloading from YouTube / streaming rips / "free MP3" sites** | Copyright infringement. Not supported, not documented. |

## 🎯 How to add your favorite artists

1. List your playlist in [`playlists/my-playlist.example.json`](../playlists/my-playlist.example.json) (title + artist only — no audio).
2. For each song, check in this order:
   1. Do I already have the file? → import it.
   2. Does the artist offer it for free (Bandcamp "name your price", SoundCloud download, official site)? → download and import.
   3. Is it under Creative Commons? → download, keep attribution, import.
3. Songs that are not available for free legally stay in the list as **"wanted"** — you can still listen to them in the official free tier of a streaming app.

## 🗃️ What goes into Git

| Commit | Never commit |
|---|---|
| Code, docs, diagrams | `.mp3`, `.m4a`, `.wav`, `.flac`, `.aac`, `.aiff` files |
| Playlist **metadata** (titles, artists) | Artwork scraped from the internet |
| Example backup JSON | Personal backups with private data |

The repository `.gitignore` blocks audio files automatically.

## References
- [Jamendo API](https://developer.jamendo.com/v3.0)
- [Spotify — Update on Developer Access and Platform Security (Feb 2026)](https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security)
- [YouTube API Services — Developer Policies](https://developers.google.com/youtube/terms/developer-policies)
