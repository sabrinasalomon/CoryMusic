import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Track } from '../library/db';
import { useLibrary } from '../state/LibraryProvider';
import { usePlayer } from '../state/PlayerProvider';
import { colors, radius, spacing, type } from '../theme/tokens';

type TrackRowProps = {
  track: Track;
  last?: boolean;
  queue?: Track[];
  source?: string;
};

export function TrackRow({ track, last, queue, source }: TrackRowProps) {
  const { t } = useTranslation();
  const { currentTrackId, isPlaying, toggle } = usePlayer();
  const { toggleFavorite } = useLibrary();
  const isCurrent = currentTrackId === track.id;
  const playing = isCurrent && isPlaying;

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        toggle(track, queue, source);
      }}
      accessibilityRole="button"
      accessibilityLabel={`${track.title}, ${track.artist ?? t('common.unknownArtist')}`}
      accessibilityState={{ selected: isCurrent }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.artwork, isCurrent && styles.artworkActive]}>
        <SymbolView name={playing ? 'waveform' : 'music.note'} size={20} tintColor={colors.accent} type="hierarchical" />
      </View>
      <View style={[styles.body, !last && styles.divider]}>
        <View style={styles.text}>
          <Text style={[type.body, isCurrent && styles.titleActive]} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={type.caption} numberOfLines={1}>
            {track.artist ?? t('common.unknownArtist')}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleFavorite(track);
          }}
          accessibilityRole="button"
          accessibilityLabel={track.isFavorite ? t('common.unfavorite') : t('common.favorite')}
          hitSlop={10}
        >
          <SymbolView
            name={track.isFavorite ? 'heart.fill' : 'heart'}
            size={20}
            tintColor={track.isFavorite ? colors.accent : colors.textTertiary}
          />
        </Pressable>
        <SymbolView name={playing ? 'pause.fill' : 'play.fill'} size={18} tintColor={isCurrent ? colors.accent : colors.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceRaised,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: radius.artwork + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  artworkActive: {
    borderColor: colors.primary,
    backgroundColor: colors.accentSoft,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    minHeight: 64,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  titleActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
