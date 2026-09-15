import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientGlow } from '../src/components/AmbientGlow';
import { Artwork } from '../src/components/Artwork';
import { GlassIconButton } from '../src/components/GlassIconButton';
import type { Track } from '../src/library/db';
import { usePlayer } from '../src/state/PlayerProvider';
import { colors, layout, radius, spacing, type } from '../src/theme/tokens';

function QueueRow({ track, onPress, onRemove }: { track: Track; onPress: () => void; onRemove: () => void }) {
  const { t } = useTranslation();
  const artist = track.artist ?? t('common.unknownArtist');

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${track.title}, ${artist}`} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Artwork size={44} radius={8} />
      <View style={styles.rowText}>
        <Text style={type.body} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={type.caption} numberOfLines={1}>
          {artist}
        </Text>
      </View>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onRemove();
        }}
        accessibilityRole="button"
        accessibilityLabel={`${t('player.remove')}: ${track.title}`}
        hitSlop={10}
      >
        <SymbolView name="minus.circle" size={22} tintColor={colors.textSecondary} />
      </Pressable>
    </Pressable>
  );
}

export default function QueueScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentTrack, isPlaying, queue, queueIndex, source, playQueueIndex, removeFromQueue } = usePlayer();

  const upNext = queue.slice(queueIndex + 1);

  return (
    <View style={styles.root}>
      <AmbientGlow height={260} />
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={type.title} accessibilityRole="header">
            {t('player.queue')}
          </Text>
          {source ? <Text style={type.caption}>{t('player.playingFrom', { source })}</Text> : null}
        </View>
        <GlassIconButton symbol="xmark" accessibilityLabel={t('player.close')} onPress={() => router.back()} size={38} />
      </View>

      <FlatList
        data={upNext}
        keyExtractor={(track, index) => `${track.id}-${index}`}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {currentTrack ? (
              <View style={styles.current}>
                <Artwork size={56} radius={10} playing={isPlaying} />
                <View style={styles.rowText}>
                  <Text style={type.overline}>{t('player.nowPlaying')}</Text>
                  <Text style={[type.headline, styles.accent]} numberOfLines={1}>
                    {currentTrack.title}
                  </Text>
                  <Text style={type.caption} numberOfLines={1}>
                    {currentTrack.artist ?? t('common.unknownArtist')}
                  </Text>
                </View>
              </View>
            ) : null}
            <Text style={[type.overline, styles.sectionTitle]}>{t('player.upNext')}</Text>
            {upNext.length === 0 ? <Text style={[type.subhead, styles.sectionTitle]}>{t('player.queueEmpty')}</Text> : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <QueueRow
            track={item}
            onPress={() => {
              Haptics.selectionAsync();
              playQueueIndex(queueIndex + 1 + index);
            }}
            onRemove={() => removeFromQueue(queueIndex + 1 + index)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
  },
  listHeader: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  accent: {
    color: colors.accent,
  },
  sectionTitle: {
    paddingHorizontal: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.control,
  },
  rowPressed: {
    backgroundColor: colors.surfaceRaised,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});
