import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientGlow } from '../src/components/AmbientGlow';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { greetingKey } from '../src/lib/greeting';
import { useLibrary } from '../src/state/LibraryProvider';
import { useProfile } from '../src/state/ProfileProvider';
import { colors, fonts, layout, radius, spacing, type } from '../src/theme/tokens';

type Step = 'intro' | 'name' | 'ready';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name, setName, completeOnboarding } = useProfile();
  const { importMusic } = useLibrary();
  const [step, setStep] = useState<Step>('intro');
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState('');

  const finish = async (withImport: boolean) => {
    completeOnboarding();
    router.replace('/');
    if (withImport) await importMusic();
  };

  const continueWithName = () => {
    if (!draft.trim()) {
      setError(t('welcome.nameError'));
      return;
    }
    setName(draft);
    setStep('ready');
  };

  const skipName = () => {
    setName('');
    setStep('ready');
  };

  const greeting = name ? `${t(greetingKey())}, ${name}` : t(greetingKey());

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AmbientGlow height={480} />
      <View style={[styles.content, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
        {step === 'intro' ? (
          <>
            <View style={styles.center}>
              <View style={styles.mark}>
                <LinearGradient colors={[colors.surfaceHighlight, colors.background]} style={StyleSheet.absoluteFill} />
                <Text style={styles.markText}>CM</Text>
              </View>
              <Text style={[type.overline, styles.textCenter]}>{t('welcome.overline')}</Text>
              <Text style={[styles.brand, styles.textCenter]}>CoryMusic</Text>
              <Text style={[type.subhead, styles.textCenter, styles.narrow]}>{t('welcome.body')}</Text>
            </View>
            <PrimaryButton label={t('welcome.start')} symbol="arrow.right" onPress={() => setStep('name')} />
          </>
        ) : null}

        {step === 'name' ? (
          <>
            <View style={styles.top}>
              <Text style={type.overline}>{t('welcome.step', { current: 1, total: 2 })}</Text>
              <Text style={type.largeTitle}>{t('welcome.nameTitle')}</Text>
              <Text style={type.subhead}>{t('welcome.nameBody')}</Text>
              <TextInput
                value={draft}
                onChangeText={(value) => {
                  setDraft(value);
                  if (error) setError('');
                }}
                placeholder={t('welcome.namePlaceholder')}
                placeholderTextColor={colors.textTertiary}
                style={[styles.input, error ? styles.inputError : null]}
                autoFocus
                autoCapitalize="words"
                autoComplete="given-name"
                textContentType="givenName"
                returnKeyType="done"
                keyboardAppearance="dark"
                onSubmitEditing={continueWithName}
                accessibilityLabel={t('welcome.nameTitle')}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>
            <View style={styles.actions}>
              <PrimaryButton label={t('welcome.continue')} onPress={continueWithName} />
              <Pressable onPress={skipName} accessibilityRole="button" style={styles.secondary}>
                <Text style={styles.secondaryText}>{t('welcome.skip')}</Text>
              </Pressable>
            </View>
          </>
        ) : null}

        {step === 'ready' ? (
          <>
            <View style={styles.top}>
              <Text style={type.overline}>{t('welcome.step', { current: 2, total: 2 })}</Text>
              <Text style={type.largeTitle}>{greeting}</Text>
              <Text style={type.subhead}>{t('welcome.readyBody')}</Text>
            </View>
            <View style={styles.actions}>
              <PrimaryButton label={t('welcome.import')} symbol="square.and.arrow.down" onPress={() => finish(true)} />
              <Pressable onPress={() => finish(false)} accessibilityRole="button" style={styles.secondary}>
                <Text style={styles.secondaryText}>{t('welcome.later')}</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  top: {
    gap: spacing.md,
    paddingTop: spacing.xxl,
  },
  mark: {
    width: 120,
    height: 120,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.xl,
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
  markText: {
    fontFamily: fonts.serif,
    fontSize: 58,
    lineHeight: 66,
    color: colors.accent,
    letterSpacing: -5,
  },
  brand: {
    fontFamily: fonts.serif,
    fontSize: 52,
    lineHeight: 58,
    color: colors.accent,
  },
  textCenter: {
    textAlign: 'center',
  },
  narrow: {
    maxWidth: 300,
  },
  input: {
    marginTop: spacing.lg,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceRaised,
    color: colors.text,
    fontSize: 20,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontSize: 14,
    color: colors.danger,
  },
  actions: {
    gap: spacing.sm,
  },
  secondary: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
