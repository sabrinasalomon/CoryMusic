import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/tokens';

type ArtworkProps = {
  size: number;
  radius?: number;
  playing?: boolean;
};

export function Artwork({ size, radius = 12, playing = false }: ArtworkProps) {
  return (
    <View style={[styles.frame, { width: size, height: size, borderRadius: radius }]}>
      <LinearGradient
        colors={[colors.surfaceHighlight, colors.surface, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SymbolView name={playing ? 'waveform' : 'music.note'} size={size * 0.4} tintColor={colors.accent} type="hierarchical" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
});
