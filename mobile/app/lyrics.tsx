import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientGlow } from '../src/components/AmbientGlow';
import { EmptyState } from '../src/components/EmptyState';
import { GlassIconButton } from '../src/components/GlassIconButton';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { SecondaryButton } from '../src/components/SecondaryButton';
import { activeLineIndex, parseLyrics } from '../src/lyrics/lrc';
import type { LyricLine } from '../src/lyrics/lrc';
import { useLibrary } from '../src/state/LibraryProvider';
import { usePlaybackStatus, usePlayer } from '../src/state/PlayerProvider';
import { colors, fonts, layout, radius, spacing, type } from '../src/theme/tokens';

const MANUAL_SCROLL_PAUSE_MS = 3000;

function SyncedLyrics({ lines, isCurrent, onSeek }: { lines: LyricLine[]; isCurrent: boolean; onSeek: (seconds: number) => void }) {
  const { t } = useTranslation();
  const status = usePlaybackStatus();
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<number[]>([]);
  const viewportHeight = useRef(0);
  const lastManualScroll = useRef(0);
  const active = isCurrent ? activeLineIndex(lines, status.currentTime) : -1;

  useEffect(() => {
    if (active < 0 || Date.now() - lastManualScroll.current < MANUAL_SCROLL_PAUSE_MS) return;
    const y = positions.current[active];
    if (y === undefined) return;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - viewportHeight.current * 0.3), animated: true });
  }, [active]);

  return (
    <ScrollView
      ref={scrollRef}
      onLayout={(event) => {
        viewportHeight.current = event.nativeEvent.layout.height;
      }}
      onScrollBeginDrag={() => {
        lastManualScroll.current = Date.now();
      }}
      contentContainerStyle={styles.syncedContent}
    >
      <Text style={type.caption}>{isCurrent ? t('lyrics.seekHint') : t('lyrics.synced')}</Text>
      {lines.map((line, index) => (
        <Pressable
          key={`${line.time}-${index}`}
          disabled={!isCurrent}
          onLayout={(event) => {
            positions.current[index] = event.nativeEvent.layout.y;
          }}
          onPress={() => {
            Haptics.selectionAsync();
            onSeek(line.time);
          }}
          accessibilityRole={isCurrent ? 'button' : 'text'}
        >
          <Text
            style={[
              styles.syncedLine,
              !isCurrent && styles.syncedPlain,
              isCurrent && index < active && styles.syncedPast,
              index === active && styles.syncedActive,
            ]}
          >
            {line.text || t('lyrics.instrumental')}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function LyricsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tracks, saveLyrics } = useLibrary();
  const { currentTrackId, seekTo } = usePlayer();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const track = tracks.find((item) => String(item.id) === id) ?? null;
  const parsed = useMemo(() => parseLyrics(track?.lyrics ?? ''), [track?.lyrics]);

  const startEditing = () => {
    setDraft(track?.lyrics ?? '');
    setEditing(true);
  };

  const save = () => {
    if (!track) return;
    saveLyrics(track.id, draft);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEditing(false);
  };

  const confirmDelete = () => {
    Alert.alert(t('lyrics.deleteTitle'), t('lyrics.deleteBody'), [
      { text: t('lyrics.cancel'), style: 'cancel' },
      {
        text: t('lyrics.deleteConfirm'),
        style: 'destructive',
        onPress: () => {
          if (track) saveLyrics(track.id, null);
          setDraft('');
          setEditing(false);
        },
      },
    ]);
  };

  let content;
  if (!track) {
    content = (
      <View style={styles.body}>
        <EmptyState symbol="music.note" title={t('lyrics.notFoundTitle')} body={t('lyrics.notFoundBody')} />
      </View>
    );
  } else if (editing) {
    content = (
      <View style={[styles.body, styles.editor, { paddingBottom: insets.bottom + spacing.lg }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          multiline
          autoFocus
          autoCorrect={false}
          placeholder={t('lyrics.placeholder')}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.accent}
          keyboardAppearance="dark"
          textAlignVertical="top"
          style={styles.input}
          accessibilityLabel={t('lyrics.placeholder')}
        />
        <Text style={type.caption}>{t('lyrics.syncedHint')}</Text>
        <View style={styles.actions}>
          <View style={styles.flex}>
            <SecondaryButton label={t('lyrics.cancel')} onPress={() => setEditing(false)} />
          </View>
          <View style={styles.flex}>
            <PrimaryButton label={t('lyrics.save')} symbol="checkmark" onPress={save} />
          </View>
        </View>
        {track.lyrics ? (
          <Pressable onPress={confirmDelete} accessibilityRole="button" hitSlop={8} style={styles.delete}>
            <Text style={styles.deleteText}>{t('lyrics.delete')}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  } else if (!track.lyrics) {
    content = (
      <View style={styles.body}>
        <EmptyState
          symbol="quote.bubble"
          title={t('lyrics.emptyTitle')}
          body={t('lyrics.emptyBody')}
          actionLabel={t('lyrics.add')}
          actionSymbol="plus"
          onAction={startEditing}
        />
      </View>
    );
  } else if (parsed.synced) {
    content = <SyncedLyrics lines={parsed.lines} isCurrent={currentTrackId === track.id} onSeek={seekTo} />;
  } else {
    content = (
      <ScrollView contentContainerStyle={[styles.plainContent, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <Text style={styles.plainText} selectable>
          {parsed.text}
        </Text>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <AmbientGlow height={260} />
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={type.title} accessibilityRole="header">
            {t('lyrics.title')}
          </Text>
          {track ? (
            <Text style={type.caption} numberOfLines={1}>
              {`${track.title} · ${track.artist ?? t('common.unknownArtist')}`}
            </Text>
          ) : null}
        </View>
        {track?.lyrics && !editing ? (
          <GlassIconButton symbol="pencil" accessibilityLabel={t('lyrics.edit')} onPress={startEditing} size={38} />
        ) : null}
        <GlassIconButton symbol="xmark" accessibilityLabel={t('lyrics.close')} onPress={() => router.back()} size={38} />
      </View>
      {content}
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
    gap: spacing.sm,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  editor: {
    gap: spacing.md,
  },
  input: {
    flex: 1,
    padding: spacing.lg,
    fontSize: 17,
    lineHeight: 26,
    color: colors.text,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  delete: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.danger,
  },
  syncedContent: {
    gap: spacing.lg,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: 320,
  },
  syncedLine: {
    fontFamily: fonts.serif,
    fontSize: 30,
    lineHeight: 36,
    color: colors.textSecondary,
  },
  syncedPlain: {
    color: colors.text,
  },
  syncedPast: {
    color: colors.textTertiary,
  },
  syncedActive: {
    color: colors.accent,
  },
  plainContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  plainText: {
    fontSize: 20,
    lineHeight: 32,
    color: colors.text,
  },
});
