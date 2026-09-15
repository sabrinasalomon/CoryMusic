import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  symbol?: ComponentProps<typeof SymbolView>['name'];
};

export function SecondaryButton({ label, onPress, symbol }: SecondaryButtonProps) {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button" style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      {symbol ? <SymbolView name={symbol} size={17} tintColor={colors.accent} weight="semibold" /> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.accent,
  },
});
