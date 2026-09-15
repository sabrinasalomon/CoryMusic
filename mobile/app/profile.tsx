import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientGlow } from '../src/components/AmbientGlow';
import { Avatar } from '../src/components/Avatar';
import { GlassIconButton } from '../src/components/GlassIconButton';
import { SymbolBadge } from '../src/components/SymbolBadge';
import type { LanguagePreference } from '../src/i18n';
import { formatMegabytes } from '../src/lib/format';
import { useLibrary } from '../src/state/LibraryProvider';
import { useProfile } from '../src/state/ProfileProvider';
import { colors, layout, radius, spacing, type } from '../src/theme/tokens';

const LANGUAGES: { value: LanguagePreference; labelKey: string }[] = [
  { value: 'system', labelKey: 'profile.languageSystem' },
  { value: 'es', labelKey: 'profile.languageEs' },
  { value: 'en', labelKey: 'profile.languageEn' },
];

type Stat = { symbol: ComponentProps<typeof SymbolView>['name']; label: string; value: string };

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, photoUri, language, setName, setPhoto, removePhoto, setLanguage } = useProfile();
  const { tracks, artists, totalBytes } = useLibrary();
  const [draft, setDraft] = useState(name);

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled) return;
    try {
      await setPhoto(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert(t('profile.photoErrorTitle'), t('import.errorBody'));
    }
  };

  const stats: Stat[] = [
    { symbol: 'music.note', label: t('profile.statSongs'), value: String(tracks.length) },
    { symbol: 'person.2', label: t('profile.statArtists'), value: String(artists.length) },
    { symbol: 'music.note.list', label: t('profile.statPlaylists'), value: '0' },
    { symbol: 'internaldrive', label: t('profile.statStorage'), value: formatMegabytes(totalBytes) },
  ];

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AmbientGlow height={300} />
      <View style={styles.header}>
        <Text style={type.title} accessibilityRole="header">
          {t('profile.title')}
        </Text>
        <GlassIconButton symbol="xmark" accessibilityLabel={t('profile.close')} onPress={() => router.back()} size={38} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">
        <View style={styles.identity}>
          <Avatar name={draft || name} photoUri={photoUri} size={112} />
          <View style={styles.photoActions}>
            <Pressable onPress={choosePhoto} accessibilityRole="button" style={styles.pill}>
              <SymbolView name="photo" size={16} tintColor={colors.accent} />
              <Text style={styles.pillText}>{t('profile.changePhoto')}</Text>
            </Pressable>
            {photoUri ? (
              <Pressable onPress={removePhoto} accessibilityRole="button" style={styles.pill}>
                <SymbolView name="trash" size={16} tintColor={colors.danger} />
                <Text style={[styles.pillText, styles.danger]}>{t('profile.removePhoto')}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[type.overline, styles.label]}>{t('profile.nameLabel')}</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onBlur={() => setName(draft)}
            onSubmitEditing={() => setName(draft)}
            placeholder={t('welcome.namePlaceholder')}
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            returnKeyType="done"
            keyboardAppearance="dark"
            accessibilityLabel={t('profile.nameLabel')}
          />
          <Text style={[type.caption, styles.label]}>{t('profile.nameHint')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[type.overline, styles.label]}>{t('profile.language')}</Text>
          <View style={styles.segmented} accessibilityRole="radiogroup">
            {LANGUAGES.map((option) => {
              const selected = option.value === language;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    if (!selected) Haptics.selectionAsync();
                    setLanguage(option.value);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[styles.segment, selected && styles.segmentSelected]}
                >
                  <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{t(option.labelKey)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[type.overline, styles.label]}>{t('profile.stats')}</Text>
          <View style={styles.grid}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.tile}>
                <SymbolBadge symbol={stat.symbol} size={36} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={type.caption}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
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
    paddingBottom: spacing.sm,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.xl,
  },
  identity: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  danger: {
    color: colors.danger,
  },
  section: {
    gap: spacing.sm,
  },
  label: {
    paddingHorizontal: spacing.xs,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.control,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
    color: colors.text,
    fontSize: 17,
  },
  segmented: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surfaceRaised,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  segmentTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  statValue: {
    marginTop: spacing.sm,
    fontSize: 26,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
});
