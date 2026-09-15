import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { MiniPlayer } from '../../src/components/MiniPlayer';
import { usePlayer } from '../../src/state/PlayerProvider';
import { useProfile } from '../../src/state/ProfileProvider';
import { colors } from '../../src/theme/tokens';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { onboardingDone } = useProfile();
  const { currentTrack } = usePlayer();

  if (!onboardingDone) {
    return <Redirect href="/welcome" />;
  }

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tintColor={colors.accent}
      iconColor={{ default: colors.textSecondary, selected: colors.accent }}
      labelStyle={{ default: { color: colors.textSecondary }, selected: { color: colors.accent } }}
    >
      {currentTrack ? (
        <NativeTabs.BottomAccessory>
          <MiniPlayer />
        </NativeTabs.BottomAccessory>
      ) : null}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <NativeTabs.Trigger.Label>{t('tabs.home')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Icon sf={{ default: 'books.vertical', selected: 'books.vertical.fill' }} />
        <NativeTabs.Trigger.Label>{t('tabs.library')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="playlists">
        <NativeTabs.Trigger.Icon sf={{ default: 'music.note.list', selected: 'music.note.list' }} />
        <NativeTabs.Trigger.Label>{t('tabs.playlists')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" />
        <NativeTabs.Trigger.Label>{t('tabs.search')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
