import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../src/components/EmptyState';
import { FolderCard } from '../../src/components/FolderCard';
import { GlassIconButton } from '../../src/components/GlassIconButton';
import { Screen } from '../../src/components/Screen';
import { SymbolBadge } from '../../src/components/SymbolBadge';
import { TrackRow } from '../../src/components/TrackRow';
import { useLibrary } from '../../src/state/LibraryProvider';
import { colors, radius, spacing, type } from '../../src/theme/tokens';

type Segment = 'songs' | 'artists' | 'albums';
const SEGMENTS: Segment[] = ['songs', 'artists', 'albums'];

export default function LibraryScreen() {
  const { t } = useTranslation();
  const { tracks, artists, importMusic } = useLibrary();
  const [segment, setSegment] = useState<Segment>('songs');

  const select = (item: Segment) => {
    if (item !== segment) Haptics.selectionAsync();
    setSegment(item);
  };

  return (
    <Screen
      title={t('library.title')}
      overline={t('library.summary', { count: tracks.length })}
      headerAccessory={<GlassIconButton symbol="plus" accessibilityLabel={t('library.import')} onPress={importMusic} />}
    >
      <FolderCard />

      {tracks.length === 0 ? (
        <EmptyState
          symbol="music.note"
          title={t('library.emptyTitle')}
          body={t('library.emptyBody')}
          actionLabel={t('library.import')}
          actionSymbol="square.and.arrow.down"
          onAction={importMusic}
        />
      ) : (
        <>
          <View style={styles.segmented} accessibilityRole="tablist">
            {SEGMENTS.map((item) => {
              const selected = item === segment;
              return (
                <Pressable
                  key={item}
                  onPress={() => select(item)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  style={[styles.segment, selected && styles.segmentSelected]}
                >
                  <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{t(`library.${item}`)}</Text>
                </Pressable>
              );
            })}
          </View>

          {segment === 'songs' ? (
            <View style={styles.group}>
              {tracks.map((track, index) => (
                <TrackRow key={track.id} track={track} last={index === tracks.length - 1} />
              ))}
            </View>
          ) : null}

          {segment === 'artists' ? (
            <View style={styles.group}>
              {artists.map((artist, index) => (
                <View key={artist.name ?? 'unknown'} style={[styles.artistRow, index < artists.length - 1 && styles.divider]}>
                  <SymbolBadge symbol="person.fill" size={40} shape="circle" />
                  <View style={styles.artistText}>
                    <Text style={type.body} numberOfLines={1}>
                      {artist.name ?? t('common.unknownArtist')}
                    </Text>
                    <Text style={type.caption}>{t('library.artistSongs', { count: artist.count })}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {segment === 'albums' ? (
            <EmptyState symbol="square.stack" title={t('library.albumsEmptyTitle')} body={t('library.albumsEmptyBody')} />
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  segmented: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surfaceRaised,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  segmentTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
  group: {
    overflow: 'hidden',
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginLeft: spacing.lg,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    minHeight: 64,
  },
  artistText: {
    flex: 1,
    gap: 2,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
});
