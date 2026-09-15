# Install CoryMusic on your iPhone

This guide installs CoryMusic as a **real app** on your own iPhone. Once installed, it works **without a computer, without Expo Go and without internet**, and everything you add stays saved on the iPhone.

It uses a free Apple ID. The only catch: apps signed this way **expire after 7 days** and must be re-installed from the Mac. Re-installing keeps all your data.

## What you get

| Feature | Expo Go | Installed app |
|---|---|---|
| Works with the computer turned off | ❌ | ✅ |
| Music keeps playing with the iPhone locked | ❌ | ✅ |
| Song title and artist on the Lock Screen | ❌ | ✅ |
| Songs, playlists, favorites and profile saved | ✅ | ✅ |

## 1. Requirements

| Item | Details |
|---|---|
| Mac | MacBook Neo with macOS Tahoe |
| Xcode | Latest version from the Mac App Store, opened once to install components |
| Node.js | Version 20 or later |
| CocoaPods | `brew install cocoapods` (install Homebrew first from brew.sh if needed) |
| iPhone | iOS 26, USB-C cable |
| Apple ID | Your normal, free Apple ID |
| Disk space | At least 40 GB free |

## 2. Get the latest code

```bash
mkdir -p ~/Developer
git clone https://github.com/sabrinasalomon/CoryMusic.git ~/Developer/CoryMusic
```

If you already cloned it:

```bash
cd ~/Developer/CoryMusic && git pull
```

Then install the app's packages:

```bash
cd ~/Developer/CoryMusic/mobile && npm install
```

## 3. Prepare Xcode and the iPhone (first time only)

1. **Xcode → Settings → Accounts → +** → sign in with your Apple ID. A free *Personal Team* is created.
2. Connect the iPhone with the cable, unlock it and tap **Trust This Computer**.
3. On the iPhone: **Settings → Privacy & Security → Developer Mode → On**, then restart the iPhone.

## 4. Generate the iOS project

```bash
cd ~/Developer/CoryMusic/mobile && npx expo prebuild --platform ios
```

This creates the `ios` folder with the Xcode project. It is generated on your Mac and never committed to Git.

## 5. Choose your team for signing (first time only)

1. Open `ios/CoryMusic.xcworkspace` in Xcode.
2. Select **CoryMusic** in the left sidebar, then the **CoryMusic** target.
3. **Signing & Capabilities → Team:** choose *Your Name (Personal Team)*.
4. Check that **Bundle Identifier** is `com.sabrinasalomon.corymusic`. **Never change it** — a different identifier installs a new, empty app.
5. Close Xcode.

## 6. Build and install

With the iPhone connected and unlocked:

```bash
cd ~/Developer/CoryMusic/mobile && npx expo run:ios --configuration Release --device
```

Choose your iPhone from the list. The first build takes several minutes on the MacBook Neo.

The first time, the iPhone may block the app:
**Settings → General → VPN & Device Management →** your Apple ID **→ Trust**.

## 7. Check that it works on its own

1. Stop any Expo server on the computer and turn off Wi-Fi on the Mac if you want to be sure.
2. Open **CoryMusic** from the Home Screen.
3. Play a song, lock the iPhone: the music keeps playing and the song appears on the Lock Screen.

## 8. Bring your music and playlists into the installed app

The installed app and Expo Go keep **separate data**. Move everything with a backup:

1. **Before installing**, in Expo Go: **Settings → Backup and restore → Save backup** and save the file to Files or OneDrive.
2. In the installed app, complete the welcome screens.
3. **Settings → Backup and restore → Restore from file** and choose that backup — your profile, smart playlists, favorites and plays come back.
4. **Library → Music folder → Choose folder** and pick your music folder. As songs import, they recover their hearts and plays automatically.

## 9. Keep your data safe

| Rule | Why |
|---|---|
| **Save a backup outside the app every week** | Settings → Backup and restore → Save backup; the app reminds you after 7 days |
| **Never delete the app** from the iPhone | Deleting the app deletes its songs, playlists, profile and automatic backups |
| **Never change the bundle identifier** | Another identifier is a different app with no data |
| **Re-install before 7 days pass** | After 7 days the app won't open — your data is still there and comes back when you re-install |

## 10. Renew every 7 days

### Manual (2 minutes)

Connect the iPhone and run the same command as in step 6:

```bash
cd ~/Developer/CoryMusic/mobile && npx expo run:ios --configuration Release --device
```

### Automatic

The Mac can re-install the app twice a week while the iPhone is on the same Wi-Fi.

1. In Xcode: **Window → Devices and Simulators →** select the iPhone → **Connect via network**.
2. Find the iPhone identifier:

   ```bash
   xcrun devicectl list devices
   ```

3. Edit `scripts/renew-corymusic.sh` and replace `YOUR_IPHONE_UDID`.
4. Edit `scripts/com.sabrinasalomon.renew-corymusic.plist` and replace `YOUR_MAC_USER` with your Mac user name.
5. Install the schedule (Sundays and Thursdays at 10:00):

   ```bash
   chmod +x ~/Developer/CoryMusic/scripts/renew-corymusic.sh
   cp ~/Developer/CoryMusic/scripts/com.sabrinasalomon.renew-corymusic.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/com.sabrinasalomon.renew-corymusic.plist
   ```

At that time the Mac must be awake (or it runs when it wakes), the iPhone on the same Wi-Fi and unlocked or charging. Logs are in `/tmp/renew-corymusic.log`.

## 11. Update the app with new features

```bash
cd ~/Developer/CoryMusic && git pull
cd mobile && npm install
npx expo prebuild --platform ios
npx expo run:ios --configuration Release --device
```

Installing an update over the existing app keeps all your data.

## 12. Troubleshooting

| Problem | Fix |
|---|---|
| "No Account for Team" or signing error | Repeat step 5 and choose your Personal Team |
| "Untrusted Developer" on the iPhone | Settings → General → VPN & Device Management → Trust |
| The iPhone doesn't appear in the device list | Unlock it, reconnect the cable, confirm Developer Mode is on |
| `pod install` fails | Run `brew install cocoapods`, then repeat step 4 |
| "Maximum number of apps" or App ID limit | Free Apple IDs allow few sideloaded apps and new App IDs per week — remove other test apps or wait a few days |
| The app stopped opening | The 7 days passed — re-install with step 6; your data is kept |
| Build is very slow or fails for memory | Close other apps, keep 40 GB free, try again |
