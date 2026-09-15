import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, type } from '../theme/tokens';
import { PrimaryButton } from './PrimaryButton';

type EmptyStateProps = {
  title: string;
  body: string;
  symbol?: ComponentProps<typeof SymbolView>['name'];
  monogram?: boolean;
  actionLabel?: string;
  actionSymbol?: ComponentProps<typeof SymbolView>['name'];
  onAction?: () => void;
};

export function EmptyState({ title, body, symbol, monogram, actionLabel, actionSymbol, onAction }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <LinearGradient
        pointerEvents="none"
        colors={[colors.surfaceHighlight, colors.surface]}
        locations={[0, 0.7]}
        style={StyleSheet.absoluteFill}
      />
      {monogram ? (
        <View style={styles.mark}>
          <LinearGradient colors={[colors.surfaceHighlight, colors.background]} style={StyleSheet.absoluteFill} />
          <Text style={styles.markText}>CM</Text>
        </View>
      ) : symbol ? (
        <View style={styles.symbolRing}>
          <SymbolView name={symbol} size={34} tintColor={colors.accent} type="hierarchical" />
        </View>
      ) : null}
      <View style={styles.text}>
        <Text style={[type.title, styles.center]}>{title}</Text>
        <Text style={[type.subhead, styles.center]}>{body}</Text>
      </View>
      {actionLabel && onAction ? <PrimaryButton label={actionLabel} symbol={actionSymbol} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    alignItems: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  mark: {
    width: 96,
    height: 96,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  markText: {
    fontFamily: fonts.serif,
    fontSize: 46,
    lineHeight: 52,
    color: colors.accent,
    letterSpacing: -4,
  },
  symbolRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  text: {
    gap: spacing.sm,
    maxWidth: 310,
  },
  center: {
    textAlign: 'center',
  },
});
