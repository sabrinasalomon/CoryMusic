import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/tokens';

type SymbolBadgeProps = {
  symbol: ComponentProps<typeof SymbolView>['name'];
  size?: number;
  shape?: 'circle' | 'square';
};

export function SymbolBadge({ symbol, size = 40, shape = 'square' }: SymbolBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: shape === 'circle' ? size / 2 : size * 0.28 },
      ]}
    >
      <SymbolView name={symbol} size={size * 0.5} tintColor={colors.accent} type="hierarchical" />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
});
