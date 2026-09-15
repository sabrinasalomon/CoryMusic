import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { SymbolBadge } from '../../src/components/SymbolBadge';
import { colors, radius, spacing, type } from '../../src/theme/tokens';

type Shortcut = {
  symbol: ComponentProps<typeof SymbolView>['name'];
  label: string;
};

export default function SearchScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const shortcuts: Shortcut[] = [
    { symbol: 'calendar', label: t('search.byDecade') },
    { symbol: 'guitars', label: t('search.byGenre') },
    { symbol: 'eye.slash', label: t('search.unplayed') },
    { symbol: 'exclamationmark.triangle', label: t('search.toReview') },
  ];

  return (
    <Screen title={t('search.title')}>
      <View style={styles.field}>
        <SymbolView name="magnifyingglass" size={18} tintColor={colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('search.placeholder')}
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
          keyboardAppearance="dark"
          clearButtonMode="while-editing"
          accessibilityLabel={t('search.placeholder')}
        />
      </View>

      <View style={styles.section}>
        <Text style={type.sectionTitle}>{t('search.exploreTitle')}</Text>
        <View style={styles.grid}>
          {shortcuts.map((item) => (
            <View key={item.label} style={styles.tile}>
              <SymbolBadge symbol={item.symbol} size={38} />
              <Text style={type.headline}>{item.label}</Text>
            </View>
          ))}
        </View>
        <Text style={type.caption}>{t('search.exploreHint')}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    borderRadius: radius.control,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surfaceRaised,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  section: {
    gap: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
});
