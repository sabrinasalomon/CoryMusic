import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientGlow } from '../../src/components/AmbientGlow';
import { Chip } from '../../src/components/Chip';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import {
  CONDITIONS_BY_FIELD,
  defaultRule,
  evaluateSmartPlaylist,
  isValidRule,
  LIMIT_OPTIONS,
  MATCH_MODES,
  RULE_FIELDS,
  SORT_OPTIONS,
  valueKind,
} from '../../src/smart/rules';
import type { MatchMode, RuleCondition, RuleField, SmartRule, SortBy } from '../../src/smart/rules';
import { useLibrary } from '../../src/state/LibraryProvider';
import { colors, layout, radius, spacing, type } from '../../src/theme/tokens';

export default function SmartPlaylistEditor() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { tracks, artists, smartPlaylists, saveSmartPlaylist, deleteSmartPlaylist } = useLibrary();

  const existing = smartPlaylists.find((item) => String(item.id) === id);
  const [name, setName] = useState(existing?.name ?? '');
  const [matchMode, setMatchMode] = useState<MatchMode>(existing?.matchMode ?? 'all');
  const [sortBy, setSortBy] = useState<SortBy>(existing?.sortBy ?? 'recentlyAdded');
  const [limit, setLimit] = useState<number | null>(existing?.limit ?? null);
  const [rules, setRules] = useState<SmartRule[]>(existing?.rules.length ? existing.rules : [defaultRule('artist')]);
  const [error, setError] = useState('');

  const preview = useMemo(
    () => evaluateSmartPlaylist({ id: existing?.id, matchMode, sortBy, limit, rules }, tracks),
    [existing?.id, matchMode, sortBy, limit, rules, tracks],
  );

  const updateRule = (index: number, next: SmartRule) => {
    setRules((current) => current.map((rule, i) => (i === index ? next : rule)));
    if (error) setError('');
  };

  const changeField = (index: number, field: RuleField) => updateRule(index, defaultRule(field));
  const changeCondition = (index: number, condition: RuleCondition) => updateRule(index, { ...rules[index], condition });
  const changeValue = (index: number, value: string) => updateRule(index, { ...rules[index], value });
  const addRule = () => setRules((current) => [...current, defaultRule('importedAt')]);
  const removeRule = (index: number) => setRules((current) => current.filter((_, i) => i !== index));

  const save = () => {
    if (!name.trim()) {
      setError(t('smart.errorName'));
      return;
    }
    if (rules.length === 0 || !rules.every(isValidRule)) {
      setError(t('smart.errorRules'));
      return;
    }
    const savedId = saveSmartPlaylist({ id: existing?.id, name: name.trim(), matchMode, sortBy, limit, rules });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
    if (!existing) router.push({ pathname: '/smart/[id]', params: { id: String(savedId) } });
  };

  const confirmDelete = () => {
    if (!existing) return;
    Alert.alert(t('smart.deleteTitle'), t('smart.deleteBody'), [
      { text: t('smart.cancel'), style: 'cancel' },
      {
        text: t('smart.deleteConfirm'),
        style: 'destructive',
        onPress: () => {
          deleteSmartPlaylist(existing.id);
          router.dismissTo('/playlists');
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AmbientGlow height={260} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={8}>
          <Text style={styles.headerAction}>{t('smart.cancel')}</Text>
        </Pressable>
        <Text style={type.headline}>{existing ? t('smart.editTitle') : t('smart.newTitle')}</Text>
        <Pressable onPress={save} accessibilityRole="button" hitSlop={8}>
          <Text style={[styles.headerAction, styles.headerSave]}>{t('smart.save')}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={[type.overline, styles.label]}>{t('smart.nameLabel')}</Text>
          <TextInput
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (error) setError('');
            }}
            placeholder={t('smart.namePlaceholder')}
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            keyboardAppearance="dark"
            returnKeyType="done"
            accessibilityLabel={t('smart.nameLabel')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[type.overline, styles.label]}>{t('smart.matchLabel')}</Text>
          <View style={styles.chips}>
            {MATCH_MODES.map((mode) => (
              <Chip key={mode} label={t(mode === 'all' ? 'smart.matchAll' : 'smart.matchAny')} selected={matchMode === mode} onPress={() => setMatchMode(mode)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[type.overline, styles.label]}>{t('smart.rulesLabel')}</Text>
          {rules.map((rule, index) => {
            const kind = valueKind(rule.field);
            return (
              <View key={index} style={styles.ruleCard}>
                <View style={styles.ruleHeader}>
                  <Text style={type.caption}>{t('smart.ruleNumber', { number: index + 1 })}</Text>
                  {rules.length > 1 ? (
                    <Pressable onPress={() => removeRule(index)} accessibilityRole="button" accessibilityLabel={t('smart.removeRule')} hitSlop={8}>
                      <SymbolView name="minus.circle" size={20} tintColor={colors.textSecondary} />
                    </Pressable>
                  ) : null}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                  {RULE_FIELDS.map((field) => (
                    <Chip key={field} label={t(`smart.fields.${field}`)} selected={rule.field === field} onPress={() => changeField(index, field)} />
                  ))}
                </ScrollView>

                <View style={styles.chips}>
                  {CONDITIONS_BY_FIELD[rule.field].map((condition) => (
                    <Chip key={condition} label={t(`smart.conditions.${condition}`)} selected={rule.condition === condition} onPress={() => changeCondition(index, condition)} />
                  ))}
                </View>

                {kind !== 'none' ? (
                  <View style={styles.valueRow}>
                    <TextInput
                      value={rule.value}
                      onChangeText={(value) => changeValue(index, kind === 'text' ? value : value.replace(/[^0-9]/g, ''))}
                      placeholder={t('smart.valuePlaceholder')}
                      placeholderTextColor={colors.textTertiary}
                      keyboardType={kind === 'text' ? 'default' : 'number-pad'}
                      keyboardAppearance="dark"
                      style={[styles.input, styles.valueInput]}
                      accessibilityLabel={t('smart.valuePlaceholder')}
                    />
                    {kind === 'days' ? <Text style={type.subhead}>{t('smart.unitDays')}</Text> : null}
                    {kind === 'number' ? <Text style={type.subhead}>{t('smart.unitPlays')}</Text> : null}
                  </View>
                ) : null}

                {rule.field === 'artist' && artists.some((artist) => artist.name) ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                    {artists
                      .filter((artist) => artist.name)
                      .map((artist) => (
                        <Chip key={artist.name as string} label={artist.name as string} selected={rule.value === artist.name} onPress={() => changeValue(index, artist.name as string)} />
                      ))}
                  </ScrollView>
                ) : null}
              </View>
            );
          })}
          <Pressable onPress={addRule} accessibilityRole="button" style={styles.addRule}>
            <SymbolView name="plus.circle.fill" size={20} tintColor={colors.accent} />
            <Text style={styles.addRuleText}>{t('smart.addRule')}</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[type.overline, styles.label]}>{t('smart.sortLabel')}</Text>
          <View style={styles.chips}>
            {SORT_OPTIONS.map((option) => (
              <Chip key={option} label={t(`smart.sort.${option}`)} selected={sortBy === option} onPress={() => setSortBy(option)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[type.overline, styles.label]}>{t('smart.limitLabel')}</Text>
          <View style={styles.chips}>
            {LIMIT_OPTIONS.map((option) => (
              <Chip key={String(option)} label={option === null ? t('smart.limitNone') : String(option)} selected={limit === option} onPress={() => setLimit(option)} />
            ))}
          </View>
        </View>

        <View style={styles.previewCard}>
          <SymbolView name="eye" size={20} tintColor={colors.accent} />
          <View style={styles.previewText}>
            <Text style={type.headline}>{t('smart.preview', { count: preview.length })}</Text>
            <Text style={type.caption} numberOfLines={2}>
              {preview.length ? preview.slice(0, 3).map((track) => track.title).join(' · ') : t('smart.previewEmpty')}
            </Text>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label={t('smart.save')} symbol="checkmark" onPress={save} />

        {existing ? (
          <Pressable onPress={confirmDelete} accessibilityRole="button" style={styles.delete}>
            <Text style={styles.deleteText}>{t('smart.delete')}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerAction: {
    fontSize: 17,
    color: colors.textSecondary,
  },
  headerSave: {
    color: colors.accent,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  label: {
    paddingHorizontal: spacing.xs,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.control,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
    color: colors.text,
    fontSize: 17,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  ruleCard: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  valueInput: {
    flex: 1,
  },
  addRule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.xs,
  },
  addRuleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  previewText: {
    flex: 1,
    gap: 2,
  },
  error: {
    fontSize: 14,
    color: colors.danger,
    paddingHorizontal: spacing.xs,
  },
  delete: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
});
