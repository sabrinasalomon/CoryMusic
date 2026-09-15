import { useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

import { formatDuration } from '../lib/format';
import { colors, spacing, type } from '../theme/tokens';

type ScrubberProps = {
  currentTime: number;
  duration: number;
  label: string;
  onSeek: (seconds: number) => void;
};

const THUMB = 14;

export function Scrubber({ currentTime, duration, label, onSeek }: ScrubberProps) {
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const width = useRef(0);
  const left = useRef(0);
  const durationRef = useRef(duration);
  const onSeekRef = useRef(onSeek);
  durationRef.current = duration;
  onSeekRef.current = onSeek;

  const ratioAt = (pageX: number) => (width.current > 0 ? Math.min(1, Math.max(0, (pageX - left.current) / width.current)) : 0);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => durationRef.current > 0,
      onMoveShouldSetPanResponder: () => durationRef.current > 0,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        left.current = event.nativeEvent.pageX - event.nativeEvent.locationX;
        setDragRatio(ratioAt(event.nativeEvent.pageX));
      },
      onPanResponderMove: (event) => setDragRatio(ratioAt(event.nativeEvent.pageX)),
      onPanResponderRelease: (event) => {
        const ratio = ratioAt(event.nativeEvent.pageX);
        setDragRatio(null);
        onSeekRef.current(ratio * durationRef.current);
      },
      onPanResponderTerminate: () => setDragRatio(null),
    }),
  ).current;

  const ratio = dragRatio ?? (duration > 0 ? Math.min(1, currentTime / duration) : 0);
  const shown = dragRatio !== null ? dragRatio * duration : currentTime;
  const percent = `${ratio * 100}%` as const;

  return (
    <View style={styles.root}>
      <View
        {...responder.panHandlers}
        onLayout={(event) => {
          width.current = event.nativeEvent.layout.width;
        }}
        style={styles.touch}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ text: `${formatDuration(shown)} / ${formatDuration(duration)}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => {
          const step = event.nativeEvent.actionName === 'increment' ? 10 : -10;
          onSeek(Math.min(duration, Math.max(0, currentTime + step)));
        }}
      >
        <View style={styles.track} pointerEvents="none">
          <View style={[styles.fill, { width: percent }]} />
        </View>
        <View pointerEvents="none" style={[styles.thumb, dragRatio !== null && styles.thumbActive, { left: percent }]} />
      </View>
      <View style={styles.times}>
        <Text style={styles.time}>{formatDuration(shown)}</Text>
        <Text style={styles.time}>-{formatDuration(Math.max(0, duration - shown))}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  touch: {
    height: 28,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.hairline,
  },
  fill: {
    height: 4,
    backgroundColor: colors.accent,
  },
  thumb: {
    position: 'absolute',
    top: (28 - THUMB) / 2,
    width: THUMB,
    height: THUMB,
    marginLeft: -THUMB / 2,
    borderRadius: THUMB / 2,
    backgroundColor: colors.text,
  },
  thumbActive: {
    transform: [{ scale: 1.4 }],
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    ...type.caption,
    fontVariant: ['tabular-nums'],
  },
});
