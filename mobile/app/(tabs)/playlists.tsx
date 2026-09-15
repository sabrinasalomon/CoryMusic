import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../src/components/EmptyState';
import { GlassIconButton } from '../../src/components/GlassIconButton';
import { Screen } from '../../src/components/Screen';
import { SymbolBadge } from '../../src/components/SymbolBadge';
import { describeRule, evaluateSmartPlaylist, presets } from '../../src/smart/rules';
import type { Preset } from '../../src/smart/rules';
import { useLibrary } from '../../src/state/LibraryProvider';
import { colors, radius, spacing, type } from '../../src/theme/tokens';

export default function PlaylistsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tracks, smartPlaylists, saveSmartPlaylist } = useLibrary();

  const openPlaylist = (id: number) => router.push({ pathname: '/smart/[id]', params: { id: String(id) } });
  const createFromPreset = (preset: Preset) => openPlaylist(saveSmartPlaylist(preset.draft));

  const existingNames = useMemo(() => new Set(smartPlaylists.map((playlist) => playlist.name)), [smartPlaylists]);
  const suggestions = presets(t).filter((preset) => !existingNames.has(preset.draft.name));

  return (
    <Screen
      title={t('playlists.title')}
      headerAccessory={
        <GlassIconButton symbol="plus" accessibilityLabel={t('playlists.create')} onPress={() => router.push('/smart/edit')} />
      }
    >
      {smartPlaylists.length === 0 ? (
        <EmptyState
          symbol="sparkles"
          title={t('playlists.emptyTitle')}
          body={t('playlists.emptyBody')}
          actionLabel={t('playlists.create')}
          actionSymbol="plus"
          onAction={() => router.push('/smart/edit')}
        />
      ) : (
        <View style={styles.section}>
          <Text style={type.sectionTitle}>{t('playlists.yoursTitle')}</Text>
          <View style={styles.group}>
            {smartPlaylists.map((playlist, index) => {
              const count = evaluateSmartPlaylist(playlist, tracks).length;
              return (
                <Pressable
                  key={playlist.id}
                  onPress={() => openPlaylist(playlist.id)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                >
                  <SymbolBadge symbol="sparkles" size={48} />
                  <View style={[styles.rowBody, index < smartPlaylists.length - 1 && styles.divider]}>
                    <View style={styles.rowText}>
                      <Text style={type.headline} numberOfLines={1}>
                        {playlist.name}
                      </Text>
                      <Text style={type.caption} numberOfLines={1}>
                        {playlist.rules[0] ? describeRule(playlist.rules[0], t) : ''}
                        {playlist.rules.length > 1 ? ` · +${playlist.rules.length - 1}` : ''}
                      </Text>
                    </View>
                    <Text style={styles.count}>{count}</Text>
                    <SymbolView name="chevron.right" size={13} tintColor={colors.textTertiary} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {suggestions.length > 0 ? (
        <View style={styles.section}>
          <Text style={type.sectionTitle}>{t('playlists.suggestionsTitle')}</Text>
          <View style={styles.grid}>
            {suggestions.map((preset) => (
              <Pressable
                key={preset.key}
                onPress={() => createFromPreset(preset)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
              >
                <SymbolBadge symbol={preset.symbol} size={40} />
                <Text style={type.headline}>{preset.draft.name}</Text>
                <Text style={type.caption}>{t(`smart.presets.${preset.key}Body`)}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.lg,
  },
  group: {
    overflow: 'hidden',
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceRaised,
  },
  rowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    minHeight: 72,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  count: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
});
