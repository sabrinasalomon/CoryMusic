import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionSheetIOS, Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientGlow } from '../src/components/AmbientGlow';
import { Artwork } from '../src/components/Artwork';
import { EmptyState } from '../src/components/EmptyState';
import { GlassIconButton } from '../src/components/GlassIconButton';
import { Scrubber } from '../src/components/Scrubber';
import { formatDuration } from '../src/lib/format';
import { useLibrary } from '../src/state/LibraryProvider';
import { usePlaybackStatus, usePlayer } from '../src/state/PlayerProvider';
import { colors, layout, radius, spacing, type } from '../src/theme/tokens';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

const SLEEP_MINUTES = [15, 30, 45, 60];

function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

function ToggleControl({ symbol, label, active, onPress }: { symbol: SymbolName; label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={8}
      style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
    >
      <SymbolView name={symbol} size={22} tintColor={active ? colors.accent : colors.textSecondary} weight="semibold" />
      <View style={[styles.dot, active && styles.dotActive]} />
    </Pressable>
  );
}

function SkipControl({ symbol, label, onPress }: { symbol: SymbolName; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.skip, pressed && styles.pressed]}
    >
      <SymbolView name={symbol} size={34} tintColor={colors.text} />
    </Pressable>
  );
}

function PillButton({ symbol, label, active, onPress }: { symbol: SymbolName; label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      style={({ pressed }) => [styles.pill, active && styles.pillActive, pressed && styles.pressed]}
    >
      <SymbolView name={symbol} size={17} tintColor={colors.accent} weight="semibold" />
      <Text style={styles.pillText} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function PlayerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { toggleFavorite } = useLibrary();
  const player = usePlayer();
  const status = usePlaybackStatus();
  const { currentTrack, isPlaying, source, shuffle, repeat, sleepTimer } = player;
  const now = useNow(sleepTimer.endsAt !== null);
  const scale = useRef(new Animated.Value(isPlaying ? 1 : 0.88)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: isPlaying ? 1 : 0.88, speed: 14, bounciness: 6, useNativeDriver: true }).start();
  }, [isPlaying, scale]);

  const header = (
    <View style={styles.header}>
      <GlassIconButton symbol="chevron.down" accessibilityLabel={t('player.close')} onPress={() => router.back()} size={40} />
      <View style={styles.headerText}>
        <Text style={type.overline} numberOfLines={1}>
          {t('player.nowPlaying')}
        </Text>
        {source ? (
          <Text style={[type.caption, styles.center]} numberOfLines={1}>
            {t('player.playingFrom', { source })}
          </Text>
        ) : null}
      </View>
      {currentTrack ? (
        <GlassIconButton
          symbol={currentTrack.lyrics ? 'quote.bubble.fill' : 'quote.bubble'}
          accessibilityLabel={t('lyrics.open')}
          onPress={() => router.push({ pathname: '/lyrics', params: { id: String(currentTrack.id) } })}
          size={40}
        />
      ) : (
        <View style={styles.headerSpacer} />
      )}
    </View>
  );

  if (!currentTrack) {
    return (
      <View style={[styles.root, { paddingTop: spacing.lg }]}>
        <AmbientGlow />
        {header}
        <View style={styles.content}>
          <EmptyState symbol="music.note" title={t('player.nothingTitle')} body={t('player.nothingBody')} />
        </View>
      </View>
    );
  }

  const artist = currentTrack.artist ?? t('common.unknownArtist');
  const artworkSize = Math.min(width - layout.screenPadding * 2, height * 0.4, 380);
  const timerActive = sleepTimer.endsAt !== null || sleepTimer.endOfTrack;
  const timerLabel = sleepTimer.endOfTrack
    ? t('player.sleepEndOfTrack')
    : sleepTimer.endsAt !== null
      ? formatDuration((sleepTimer.endsAt - now) / 1000)
      : t('player.sleepTimer');
  const repeatLabel = repeat === 'one' ? t('player.repeatOne') : repeat === 'all' ? t('player.repeatAll') : t('player.repeatOff');

  const openSleepTimer = () => {
    const options = [...SLEEP_MINUTES.map((count) => t('player.sleepMinutes', { count })), t('player.sleepEndOfTrack')];
    if (timerActive) options.push(t('player.sleepTurnOff'));
    options.push(t('player.cancel'));

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: t('player.sleepTitle'),
        options,
        cancelButtonIndex: options.length - 1,
        destructiveButtonIndex: timerActive ? options.length - 2 : undefined,
        userInterfaceStyle: 'dark',
        tintColor: colors.accent,
      },
      (index) => {
        if (index < SLEEP_MINUTES.length) player.setSleepTimer(SLEEP_MINUTES[index]);
        else if (index === SLEEP_MINUTES.length) player.setSleepTimer('endOfTrack');
        else if (timerActive && index === SLEEP_MINUTES.length + 1) player.setSleepTimer(null);
      },
    );
  };

  return (
    <View style={[styles.root, { paddingTop: spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}>
      <AmbientGlow height={height * 0.6} />
      {header}

      <View style={styles.content}>
        <View style={styles.artworkArea}>
          <Animated.View style={[styles.artworkShadow, { transform: [{ scale }] }]}>
            <Artwork size={artworkSize} radius={radius.card} playing={isPlaying} />
          </Animated.View>
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <Text style={type.title} numberOfLines={2} accessibilityRole="header">
              {currentTrack.title}
            </Text>
            <Text style={type.subhead} numberOfLines={1}>
              {artist}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFavorite(currentTrack);
            }}
            accessibilityRole="button"
            accessibilityLabel={currentTrack.isFavorite ? t('common.unfavorite') : t('common.favorite')}
            hitSlop={10}
          >
            <SymbolView name={currentTrack.isFavorite ? 'heart.fill' : 'heart'} size={26} tintColor={currentTrack.isFavorite ? colors.accent : colors.textSecondary} />
          </Pressable>
        </View>

        <Scrubber currentTime={status.currentTime} duration={status.duration} label={t('player.position')} onSeek={player.seekTo} />

        <View style={styles.controls}>
          <ToggleControl symbol="shuffle" label={t('player.shuffle')} active={shuffle} onPress={player.toggleShuffle} />
          <SkipControl symbol="backward.fill" label={t('player.previous')} onPress={player.previous} />
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              player.togglePlayPause();
            }}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? t('player.pause') : t('player.play')}
            style={({ pressed }) => [styles.play, pressed && styles.playPressed]}
          >
            <SymbolView name={isPlaying ? 'pause.fill' : 'play.fill'} size={32} tintColor={colors.onPrimary} />
          </Pressable>
          <SkipControl symbol="forward.fill" label={t('player.next')} onPress={player.next} />
          <ToggleControl symbol={repeat === 'one' ? 'repeat.1' : 'repeat'} label={repeatLabel} active={repeat !== 'off'} onPress={player.cycleRepeat} />
        </View>

        <View style={styles.pills}>
          <PillButton symbol="moon.zzz" label={timerLabel} active={timerActive} onPress={openSleepTimer} />
          <PillButton symbol="list.bullet" label={t('player.queue')} onPress={() => router.push('/queue')} />
        </View>
      </View>
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
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerSpacer: {
    width: 40,
  },
  center: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  artworkArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkShadow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 14 },
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  titleText: {
    flex: 1,
    gap: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.transparent,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
  skip: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
  },
  playPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.95 }],
  },
  pressed: {
    opacity: 0.6,
  },
  pills: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
  },
  pillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.accentSoft,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
    fontVariant: ['tabular-nums'],
  },
});
