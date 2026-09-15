import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { usePlayer } from '../state/PlayerProvider';
import { colors, spacing } from '../theme/tokens';
import { Artwork } from './Artwork';

function ControlButton({ symbol, label, onPress }: { symbol: ComponentProps<typeof SymbolView>['name']; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.control, pressed && styles.pressed]}
    >
      <SymbolView name={symbol} size={22} tintColor={colors.text} />
    </Pressable>
  );
}

export function MiniPlayer() {
  const { t } = useTranslation();
  const router = useRouter();
  const placement = NativeTabs.BottomAccessory.usePlacement();
  const { currentTrack, isPlaying, togglePlayPause, next } = usePlayer();

  if (!currentTrack) return null;

  const inline = placement === 'inline';
  const artist = currentTrack.artist ?? t('common.unknownArtist');

  return (
    <View style={styles.root}>
      <Pressable
        onPress={() => router.push('/player')}
        accessibilityRole="button"
        accessibilityLabel={`${t('player.open')}: ${currentTrack.title}, ${artist}`}
        style={styles.info}
      >
        <Artwork size={inline ? 28 : 36} radius={inline ? 6 : 8} playing={isPlaying} />
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          {inline ? null : (
            <Text style={styles.artist} numberOfLines={1}>
              {artist}
            </Text>
          )}
        </View>
      </Pressable>
      <ControlButton symbol={isPlaying ? 'pause.fill' : 'play.fill'} label={isPlaying ? t('player.pause') : t('player.play')} onPress={togglePlayPause} />
      {inline ? null : <ControlButton symbol="forward.fill" label={t('player.next')} onPress={next} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  artist: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  control: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
