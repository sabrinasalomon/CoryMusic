import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../src/i18n';
import { BackupProvider } from '../src/state/BackupProvider';
import { LibraryProvider } from '../src/state/LibraryProvider';
import { PlayerProvider } from '../src/state/PlayerProvider';
import { ProfileProvider } from '../src/state/ProfileProvider';
import { colors } from '../src/theme/tokens';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ CormorantGaramond_600SemiBold });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <LibraryProvider>
          <BackupProvider>
            <PlayerProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="welcome" options={{ gestureEnabled: false, animation: 'fade' }} />
                <Stack.Screen name="smart/[id]" />
                <Stack.Screen name="smart/edit" options={{ presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [1] }} />
                <Stack.Screen name="settings" options={{ presentation: 'formSheet', sheetGrabberVisible: true }} />
                <Stack.Screen name="profile" options={{ presentation: 'formSheet', sheetGrabberVisible: true }} />
                <Stack.Screen name="backup" options={{ presentation: 'formSheet', sheetGrabberVisible: true, sheetAllowedDetents: [1] }} />
              </Stack>
            </PlayerProvider>
          </BackupProvider>
        </LibraryProvider>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
