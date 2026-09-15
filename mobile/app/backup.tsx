import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientGlow } from '../src/components/AmbientGlow';
import { GlassIconButton } from '../src/components/GlassIconButton';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SymbolBadge } from '../src/components/SymbolBadge';
import { formatMegabytes } from '../src/lib/format';
import { useBackup } from '../src/state/BackupProvider';
import { useLibrary } from '../src/state/LibraryProvider';
import { colors, layout, radius, spacing, type } from '../src/theme/tokens';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

function formatDate(timestamp: number, language: string): string {
  try {
    return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[type.overline, styles.sectionTitle]}>{title}</Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

function Item({ symbol, tint, label, hint, trailing, last }: { symbol: SymbolName; tint: string; label: string; hint?: string; trailing?: ReactNode; last?: boolean }) {
  return (
    <View style={styles.row}>
      <SymbolView name={symbol} size={22} tintColor={tint} />
      <View style={[styles.rowBody, !last && styles.rowDivider]}>
        <View style={styles.rowText}>
          <Text style={type.body}>{label}</Text>
          {hint ? <Text style={type.caption}>{hint}</Text> : null}
        </View>
        {trailing}
      </View>
    </View>
  );
}

export default function BackupScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tracks, smartPlaylists } = useLibrary();
  const { snapshots, lastExportAt, autoWeekly, pendingSongs, needsExportReminder, busy, setAutoWeekly, saveBackup, restoreFromFile, restoreSnapshot } = useBackup();

  const track = { false: colors.borderStrong, true: colors.primary };
  const favorites = tracks.filter((item) => item.isFavorite).length;
  const withLyrics = tracks.filter((item) => item.lyrics).length;

  return (
    <View style={styles.root}>
      <AmbientGlow height={300} />
      <View style={styles.header}>
        <Text style={type.title} accessibilityRole="header">
          {t('backup.title')}
        </Text>
        <GlassIconButton symbol="xmark" accessibilityLabel={t('backup.close')} onPress={() => router.back()} size={38} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <View style={[styles.status, needsExportReminder && styles.statusWarning]}>
          <SymbolBadge symbol={needsExportReminder ? 'exclamationmark.shield' : 'checkmark.shield'} size={56} shape="circle" />
          <View style={styles.statusText}>
            <Text style={type.headline}>{needsExportReminder ? t('backup.statusReminder') : t('backup.statusSafe')}</Text>
            <Text style={type.caption}>
              {lastExportAt ? t('backup.lastExport', { date: formatDate(lastExportAt, i18n.language) }) : t('backup.neverExported')}
            </Text>
          </View>
          {busy ? <ActivityIndicator color={colors.accent} /> : null}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label={t('backup.save')} symbol="square.and.arrow.up" onPress={saveBackup} />
          <Pressable onPress={restoreFromFile} disabled={busy} accessibilityRole="button" style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
            <SymbolView name="arrow.counterclockwise" size={17} tintColor={colors.accent} weight="semibold" />
            <Text style={styles.secondaryText}>{t('backup.restoreFromFile')}</Text>
          </Pressable>
          <Text style={[type.caption, styles.center]}>{t('backup.saveHint')}</Text>
        </View>

        <Section title={t('backup.includedTitle')}>
          <Item symbol="checkmark.circle.fill" tint={colors.accent} label={t('backup.includedPlaylists')} trailing={<Text style={type.subhead}>{smartPlaylists.length}</Text>} />
          <Item symbol="checkmark.circle.fill" tint={colors.accent} label={t('backup.includedFavorites')} trailing={<Text style={type.subhead}>{favorites}</Text>} />
          <Item symbol="checkmark.circle.fill" tint={colors.accent} label={t('backup.includedLyrics')} trailing={<Text style={type.subhead}>{withLyrics}</Text>} />
          <Item symbol="checkmark.circle.fill" tint={colors.accent} label={t('backup.includedProfile')} />
          <Item symbol="xmark.circle" tint={colors.textSecondary} label={t('backup.excludedAudio')} hint={t('backup.excludedAudioHint')} last />
        </Section>

        <Section title={t('backup.autoTitle')}>
          <Item
            symbol="clock.arrow.circlepath"
            tint={colors.accent}
            label={t('backup.autoWeekly')}
            hint={t('backup.autoWeeklyHint')}
            trailing={<Switch value={autoWeekly} onValueChange={setAutoWeekly} trackColor={track} />}
            last
          />
        </Section>

        <Section title={t('backup.snapshotsTitle')}>
          {snapshots.length === 0 ? (
            <Item symbol="tray" tint={colors.textSecondary} label={t('backup.snapshotsEmpty')} last />
          ) : (
            snapshots.map((snapshot, index) => (
              <Pressable key={snapshot.uri} onPress={() => restoreSnapshot(snapshot)} disabled={busy} accessibilityRole="button">
                <Item
                  symbol="doc.text"
                  tint={colors.accent}
                  label={formatDate(snapshot.createdAt, i18n.language)}
                  hint={formatMegabytes(snapshot.sizeBytes)}
                  trailing={<Text style={styles.link}>{t('backup.restore')}</Text>}
                  last={index === snapshots.length - 1}
                />
              </Pressable>
            ))
          )}
        </Section>

        {pendingSongs > 0 ? (
          <View style={styles.pending}>
            <SymbolView name="hourglass" size={20} tintColor={colors.warning} />
            <Text style={[type.caption, styles.pendingText]}>{t('backup.pendingSongs', { count: pendingSongs })}</Text>
          </View>
        ) : null}
      </ScrollView>
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
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.xl,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  statusWarning: {
    borderColor: colors.warning,
  },
  statusText: {
    flex: 1,
    gap: 2,
  },
  actions: {
    gap: spacing.sm,
  },
  secondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 50,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
  },
  pressed: {
    opacity: 0.85,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  center: {
    textAlign: 'center',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    paddingHorizontal: spacing.xs,
  },
  group: {
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: spacing.lg,
  },
  rowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
    minHeight: 56,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  pending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  pendingText: {
    flex: 1,
  },
});
