import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { colors } from '../theme/tokens';

export function AmbientGlow({ height = 380 }: { height?: number }) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[colors.glowStrong, colors.glowSoft, colors.transparent]}
      locations={[0, 0.45, 1]}
      style={[styles.glow, { height }]}
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
