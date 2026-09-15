#!/bin/bash
# Rebuilds the CoryMusic Release app and re-installs it on the iPhone before the
# free provisioning profile expires (7 days). Installing over the existing app
# keeps all songs, playlists and settings.
set -euo pipefail

APP_DIR="$HOME/Developer/CoryMusic/mobile"
UDID="YOUR_IPHONE_UDID"   # xcrun devicectl list devices
BUILD_DIR="$APP_DIR/build"

cd "$APP_DIR"

if [ ! -d ios ]; then
  echo "[$(date)] Generating the iOS project..."
  npx expo prebuild --platform ios
fi

echo "[$(date)] Building CoryMusic (Release)..."
xcodebuild -workspace ios/CoryMusic.xcworkspace -scheme CoryMusic -configuration Release \
  -destination "id=$UDID" -derivedDataPath "$BUILD_DIR" \
  -allowProvisioningUpdates build

echo "[$(date)] Installing on device $UDID..."
xcrun devicectl device install app --device "$UDID" \
  "$BUILD_DIR/Build/Products/Release-iphoneos/CoryMusic.app"

echo "[$(date)] Done."
