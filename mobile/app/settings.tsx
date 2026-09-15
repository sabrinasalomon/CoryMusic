import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientGlow } from '../src/components/AmbientGlow';
import { Avatar } from '../src/components/Avatar';
import { FolderCard } from '../src/components/FolderCard';
import { GlassIconButton } from '../src/components/GlassIconButton';
import { SymbolBadge } from '../src/components/SymbolBadge';
import { useProfile } from '../src/state/ProfileProvider';
import { colors, layout, radius, spacing, type } from '../src/theme/tokens';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={[type.overline, styles.sectionTitle]}>{title}</Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

function Row({ symbol, label, hint, trailing, last }: { symbol: SymbolName; label: string; hint?: string; trailing?: ReactNode; last?: boolean }) {
  return (
    <View style={styles.row}>
      <SymbolBadge symbol={symbol} size={32} />
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

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, photoUri } = useProfile();
  const [inboxImport, setInboxImport] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const track = { false: colors.borderStrong, true: colors.primary };

  return (
    <View style={styles.root}>
      <AmbientGlow height={260} />
      <View style={styles.header}>
        <Text style={type.title} accessibilityRole="header">
          {t('settings.title')}
        </Text>
        <GlassIconButton symbol="xmark" accessibilityLabel={t('settings.close')} onPress={() => router.back()} size={38} />
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <Pressable
          onPress={() => router.push('/profile')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.profileCard, pressed && styles.profilePressed]}
        >
          <Avatar name={name} photoUri={photoUri} size={56} />
          <View style={styles.rowText}>
            <Text style={type.headline}>{name || t('settings.profileNoName')}</Text>
            <Text style={type.caption}>{t('settings.profileHint')}</Text>
          </View>
          <SymbolView name="chevron.right" size={14} tintColor={colors.textSecondary} />
        </Pressable>

        <View style={styles.section}>
          <Text style={[type.overline, styles.sectionTitle]}>{t('settings.folder')}</Text>
          <FolderCard />
        </View>

        <Section title={t('settings.library')}>
          <Row
            symbol="tray.and.arrow.down"
            label={t('settings.inbox')}
            hint={t('settings.inboxHint')}
            trailing={<Switch value={inboxImport} onValueChange={setInboxImport} trackColor={track} />}
            last
          />
        </Section>
        <Section title={t('settings.playback')}>
          <Row
            symbol="hand.tap"
            label={t('settings.haptics')}
            trailing={<Switch value={haptics} onValueChange={setHaptics} trackColor={track} />}
            last
          />
        </Section>
        <Section title={t('settings.backup')}>
          <Pressable onPress={() => router.push('/backup')} accessibilityRole="button">
            <Row
              symbol="externaldrive.badge.checkmark"
              label={t('settings.backupRow')}
              hint={t('settings.backupHint')}
              trailing={<SymbolView name="chevron.right" size={13} tintColor={colors.textTertiary} />}
              last
            />
          </Pressable>
        </Section>

        <Section title={t('settings.about')}>
          <Row symbol="lock.shield" label={t('settings.privacy')} hint={t('settings.privacyHint')} />
          <Row
            symbol="info.circle"
            label={t('settings.version')}
            trailing={<Text style={type.subhead}>{Constants.expoConfig?.version ?? '0.1.0'}</Text>}
            last
          />
        </Section>
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
    paddingBottom: spacing.lg,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  profilePressed: {
    backgroundColor: colors.surfaceRaised,
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
});
