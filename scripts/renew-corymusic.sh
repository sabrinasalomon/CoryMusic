#!/bin/bash
# Rebuilds CoryMusic and re-installs it on the iPhone before the free
# provisioning profile expires (7 days). Installing over the existing app
# keeps its data and playlists.
set -euo pipefail

PROJECT="$HOME/Developer/CoryMusic/CoryMusic.xcodeproj"
SCHEME="CoryMusic"
UDID="YOUR_IPHONE_UDID"   # xcrun devicectl list devices
BUILD_DIR="$HOME/Developer/CoryMusic/build"

echo "[$(date)] Building $SCHEME..."
xcodebuild -project "$PROJECT" -scheme "$SCHEME" -configuration Debug \
  -destination "id=$UDID" -derivedDataPath "$BUILD_DIR" \
  -allowProvisioningUpdates build

echo "[$(date)] Installing on device $UDID..."
xcrun devicectl device install app --device "$UDID" \
  "$BUILD_DIR/Build/Products/Debug-iphoneos/$SCHEME.app"

echo "[$(date)] Done."
