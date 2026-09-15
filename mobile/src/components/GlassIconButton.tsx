import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '../theme/tokens';

type GlassIconButtonProps = {
  symbol: ComponentProps<typeof SymbolView>['name'];
  accessibilityLabel: string;
  onPress: () => void;
  size?: number;
};

export function GlassIconButton({ symbol, accessibilityLabel, onPress, size = 44 }: GlassIconButtonProps) {
  const shape = { width: size, height: size, borderRadius: size / 2 };
  const icon = <SymbolView name={symbol} size={size * 0.46} tintColor={colors.accent} type="hierarchical" />;

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [shape, pressed && styles.pressed]}
    >
      {isLiquidGlassAvailable() ? (
        <GlassView style={[shape, styles.center]} glassEffectStyle="regular" tintColor={colors.glassTint} colorScheme="dark" isInteractive>
          {icon}
        </GlassView>
      ) : (
        <View style={[shape, styles.center, styles.fallback]}>{icon}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});
