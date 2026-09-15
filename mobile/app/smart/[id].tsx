import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../src/components/EmptyState';
import { GlassIconButton } from '../../src/components/GlassIconButton';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { TrackRow } from '../../src/components/TrackRow';
import { describeRule, evaluateSmartPlaylist } from '../../src/smart/rules';
import { useLibrary } from '../../src/state/LibraryProvider';
import { usePlayer } from '../../src/state/PlayerProvider';
import { colors, radius, spacing, type } from '../../src/theme/tokens';

export default function SmartPlaylistScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tracks, smartPlaylists } = useLibrary();
  const { toggle } = usePlayer();

  const playlist = smartPlaylists.find((item) => String(item.id) === id);

  if (!playlist) {
    return (
      <Screen title={t('playlists.title')} headerAccessory={<GlassIconButton symbol="chevron.left" accessibilityLabel={t('smart.back')} onPress={() => router.back()} />}>
        <EmptyState symbol="sparkles" title={t('smart.notFoundTitle')} body={t('smart.notFoundBody')} />
      </Screen>
    );
  }

  const songs = evaluateSmartPlaylist(playlist, tracks);
  const openEditor = () => router.push({ pathname: '/smart/edit', params: { id: String(playlist.id) } });

  return (
    <Screen
      overline={t('smart.overline', { count: songs.length })}
      title={playlist.name}
      headerAccessory={
        <View style={styles.headerButtons}>
          <GlassIconButton symbol="chevron.left" accessibilityLabel={t('smart.back')} onPress={() => router.back()} />
          <GlassIconButton symbol="slider.horizontal.3" accessibilityLabel={t('smart.edit')} onPress={openEditor} />
        </View>
      }
    >
      <View style={styles.rules}>
        {playlist.rules.map((rule, index) => (
          <Text key={`${rule.field}-${index}`} style={type.caption}>
            {index > 0 ? `${playlist.matchMode === 'all' ? t('smart.and') : t('smart.or')} ` : ''}
            {describeRule(rule, t)}
          </Text>
        ))}
      </View>

      {songs.length === 0 ? (
        <EmptyState symbol="sparkles" title={t('smart.emptyTitle')} body={t('smart.emptyBody')} actionLabel={t('smart.edit')} actionSymbol="slider.horizontal.3" onAction={openEditor} />
      ) : (
        <>
          <PrimaryButton label={t('smart.play')} symbol="play.fill" onPress={() => toggle(songs[0])} />
          <View style={styles.group}>
            {songs.map((track, index) => (
              <TrackRow key={track.id} track={track} last={index === songs.length - 1} />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rules: {
    gap: spacing.xs,
    marginTop: -spacing.lg,
  },
  group: {
    overflow: 'hidden',
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
});
