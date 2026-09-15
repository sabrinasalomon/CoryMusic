import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../../src/components/Avatar';
import { EmptyState } from '../../src/components/EmptyState';
import { GlassIconButton } from '../../src/components/GlassIconButton';
import { Screen } from '../../src/components/Screen';
import { SymbolBadge } from '../../src/components/SymbolBadge';
import { TrackRow } from '../../src/components/TrackRow';
import { greetingKey } from '../../src/lib/greeting';
import { useLibrary } from '../../src/state/LibraryProvider';
import { useProfile } from '../../src/state/ProfileProvider';
import { colors, radius, spacing, type } from '../../src/theme/tokens';

type Step = {
  symbol: ComponentProps<typeof SymbolView>['name'];
  title: string;
  body: string;
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { name, photoUri } = useProfile();
  const { tracks, importMusic } = useLibrary();

  const greeting = name ? `${t(greetingKey())}, ${name}` : t(greetingKey());
  const recent = tracks.slice(0, 5);

  const steps: Step[] = [
    { symbol: 'square.and.arrow.down', title: t('home.step1Title'), body: t('home.step1Body') },
    { symbol: 'sparkles', title: t('home.step2Title'), body: t('home.step2Body') },
    { symbol: 'headphones', title: t('home.step3Title'), body: t('home.step3Body') },
  ];

  return (
    <Screen
      overline={greeting}
      title={t('home.title')}
      headerAccessory={
        <View style={styles.headerButtons}>
          <GlassIconButton symbol="gearshape" accessibilityLabel={t('home.openSettings')} onPress={() => router.push('/settings')} />
          <Pressable onPress={() => router.push('/profile')} accessibilityRole="button" accessibilityLabel={t('home.openProfile')} hitSlop={8}>
            <Avatar name={name} photoUri={photoUri} size={44} />
          </Pressable>
        </View>
      }
    >
      {recent.length === 0 ? (
        <>
          <EmptyState
            monogram
            title={t('home.emptyTitle')}
            body={t('home.emptyBody')}
            actionLabel={t('home.emptyAction')}
            actionSymbol="square.and.arrow.down"
            onAction={importMusic}
          />
          <View style={styles.section}>
            <Text style={type.sectionTitle}>{t('home.stepsTitle')}</Text>
            <View style={styles.group}>
              {steps.map((step, index) => (
                <View key={step.title} style={[styles.step, index < steps.length - 1 && styles.divider]}>
                  <SymbolBadge symbol={step.symbol} size={44} />
                  <View style={styles.stepText}>
                    <Text style={type.headline}>{step.title}</Text>
                    <Text style={type.caption}>{step.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={type.sectionTitle}>{t('home.recentTitle')}</Text>
            <Pressable onPress={() => router.navigate('/library')} accessibilityRole="button" hitSlop={8}>
              <Text style={styles.link}>{t('home.seeAll')}</Text>
            </Pressable>
          </View>
          <View style={[styles.group, styles.listGroup]}>
            {recent.map((track, index) => (
              <TrackRow key={track.id} track={track} last={index === recent.length - 1} />
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  section: {
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  group: {
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  listGroup: {
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  stepText: {
    flex: 1,
    gap: 2,
  },
});
