import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useLibrary } from '../state/LibraryProvider';
import { colors, radius, spacing, type } from '../theme/tokens';
import { SymbolBadge } from './SymbolBadge';

type ActionProps = {
  label: string;
  symbol: ComponentProps<typeof SymbolView>['name'];
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
};

function Action({ label, symbol, onPress, primary, disabled }: ActionProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.action, primary ? styles.actionPrimary : styles.actionSecondary, pressed && styles.pressed]}
    >
      <SymbolView name={symbol} size={16} tintColor={primary ? colors.onPrimary : colors.accent} weight="semibold" />
      <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

function formatDate(timestamp: number, language: string): string {
  try {
    return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

export function FolderCard() {
  const { t, i18n } = useTranslation();
  const { musicFolder, syncing, syncMusicFolder, chooseMusicFolder, forgetMusicFolder } = useLibrary();

  const subtitle = !musicFolder
    ? t('folder.noneBody')
    : musicFolder.lastSyncAt
      ? t('folder.lastSync', { date: formatDate(musicFolder.lastSyncAt, i18n.language) })
      : t('folder.neverSynced');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SymbolBadge symbol={musicFolder ? 'folder.fill' : 'folder.badge.plus'} size={44} />
        <View style={styles.headerText}>
          <Text style={type.overline}>{t('folder.title')}</Text>
          <Text style={type.headline} numberOfLines={1}>
            {musicFolder ? musicFolder.name : t('folder.none')}
          </Text>
          <Text style={type.caption}>{subtitle}</Text>
        </View>
        {syncing ? <ActivityIndicator color={colors.accent} /> : null}
      </View>

      {musicFolder ? (
        <>
          <View style={styles.actions}>
            <Action
              primary
              label={syncing ? t('folder.syncing') : t('folder.sync')}
              symbol="arrow.triangle.2.circlepath"
              onPress={syncMusicFolder}
              disabled={syncing}
            />
            <Action label={t('folder.change')} symbol="folder" onPress={chooseMusicFolder} disabled={syncing} />
          </View>
          <Text style={type.caption}>{t('folder.sessionHint')}</Text>
          <Pressable onPress={forgetMusicFolder} accessibilityRole="button" hitSlop={8} disabled={syncing}>
            <Text style={styles.forget}>{t('folder.forget')}</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.actions}>
          <Action primary label={t('folder.choose')} symbol="folder.badge.plus" onPress={chooseMusicFolder} disabled={syncing} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 44,
    borderRadius: radius.pill,
  },
  actionPrimary: {
    backgroundColor: colors.primary,
  },
  actionSecondary: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
  },
  pressed: {
    opacity: 0.85,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  actionTextPrimary: {
    color: colors.onPrimary,
  },
  forget: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
