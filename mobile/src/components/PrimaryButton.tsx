import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  symbol?: ComponentProps<typeof SymbolView>['name'];
};

export function PrimaryButton({ label, onPress, symbol }: PrimaryButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {symbol ? <SymbolView name={symbol} size={18} tintColor={colors.onPrimary} weight="semibold" /> : null}
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
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
  pressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.onPrimary,
  },
});
