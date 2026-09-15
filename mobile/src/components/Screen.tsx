import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing, type } from '../theme/tokens';
import { AmbientGlow } from './AmbientGlow';

type ScreenProps = {
  title: string;
  overline?: string;
  headerAccessory?: ReactNode;
  children: ReactNode;
};

export function Screen({ title, overline, headerAccessory, children }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <AmbientGlow />
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + layout.tabBarClearance },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            {overline ? <Text style={type.overline}>{overline}</Text> : null}
            <Text style={type.largeTitle} accessibilityRole="header">
              {title}
            </Text>
          </View>
          {headerAccessory}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.sm,
  },
});
