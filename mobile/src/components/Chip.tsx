import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={() => {
        if (!selected) Haptics.selectionAsync();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
});
