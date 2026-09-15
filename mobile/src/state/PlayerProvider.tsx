import { createAudioPlayer, setAudioModeAsync, useAudioPlayerStatus } from 'expo-audio';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import type { Track } from '../library/db';
import { musicFile } from '../library/files';
import { useLibrary } from './LibraryProvider';

type AudioPlayer = ReturnType<typeof createAudioPlayer>;
type PlaybackStatus = ReturnType<typeof useAudioPlayerStatus>;

export type RepeatMode = 'off' | 'all' | 'one';
export type SleepTimer = { endsAt: number | null; endOfTrack: boolean };
export type SleepTimerOption = number | 'endOfTrack' | null;
type PlayOptions = { shuffle?: boolean; source?: string };

type PlayerContextValue = {
  player: AudioPlayer;
  currentTrack: Track | null;
  currentTrackId: number | null;
  isPlaying: boolean;
  queue: Track[];
  queueIndex: number;
  source: string | null;
  shuffle: boolean;
  repeat: RepeatMode;
  sleepTimer: SleepTimer;
  toggle: (track: Track, list?: Track[], source?: string) => void;
  playTracks: (list: Track[], startIndex?: number, options?: PlayOptions) => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
  playQueueIndex: (index: number) => void;
  removeFromQueue: (index: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setSleepTimer: (option: SleepTimerOption) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

const TIMER_OFF: SleepTimer = { endsAt: null, endOfTrack: false };
const RESTART_THRESHOLD_SECONDS = 3;
const NEXT_REPEAT: Record<RepeatMode, RepeatMode> = { off: 'all', all: 'one', one: 'off' };

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { tracks, recordPlay } = useLibrary();
  const player = useMemo(() => createAudioPlayer(null), []);
  const status = useAudioPlayerStatus(player);

  const [baseIds, setBaseIds] = useState<number[]>([]);
  const [queueIds, setQueueIds] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [source, setSource] = useState<string | null>(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [sleepTimer, setSleepTimerState] = useState<SleepTimer>(TIMER_OFF);

  const tracksById = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);
  const currentTrackId = queueIds[index] ?? null;
  const currentTrack = currentTrackId !== null ? (tracksById.get(currentTrackId) ?? null) : null;

  const latest = useRef({ tracksById, baseIds, queueIds, index, shuffle, repeat, sleepTimer, status });
  latest.current = { tracksById, baseIds, queueIds, index, shuffle, repeat, sleepTimer, status };
  const countedTrackId = useRef<number | null>(null);
  const handledFinish = useRef(false);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' });
    return () => player.remove();
  }, [player]);

  const load = useCallback(
    (trackId: number, autoplay: boolean): boolean => {
      const track = latest.current.tracksById.get(trackId);
      if (!track) return false;
      const file = musicFile(track.fileName);
      if (!file.exists) {
        Alert.alert(t('player.unavailableTitle'), t('player.unavailableBody'));
        return false;
      }

      countedTrackId.current = null;
      handledFinish.current = false;
      player.replace({ uri: file.uri });
      if (autoplay) player.play();

      try {
        player.setActiveForLockScreen(
          true,
          { title: track.title, artist: track.artist ?? t('common.unknownArtist'), albumTitle: 'CoryMusic' },
          { showSeekForward: true, showSeekBackward: true },
        );
      } catch {
        // Lock Screen controls are only available in the installed app.
      }
      return true;
    },
    [player, t],
  );

  const goTo = useCallback(
    (nextIndex: number) => {
      const ids = latest.current.queueIds;
      if (nextIndex < 0 || nextIndex >= ids.length) return;
      setIndex(nextIndex);
      load(ids[nextIndex], true);
    },
    [load],
  );

  const restart = useCallback(
    (autoplay: boolean) => {
      player.seekTo(0).then(() => {
        if (autoplay) player.play();
      });
    },
    [player],
  );

  const playTracks = useCallback(
    (list: Track[], startIndex = 0, options: PlayOptions = {}) => {
      if (list.length === 0) return;
      const ids = list.map((track) => track.id);
      const startId = ids[Math.min(Math.max(0, startIndex), ids.length - 1)];
      const nextShuffle = options.shuffle ?? latest.current.shuffle;

      let order = ids;
      if (options.shuffle === true) order = shuffled(ids);
      else if (nextShuffle) order = [startId, ...shuffled(ids.filter((id) => id !== startId))];
      const nextIndex = options.shuffle === true ? 0 : order.indexOf(startId);

      latest.current.queueIds = order;
      setBaseIds(ids);
      setQueueIds(order);
      setIndex(nextIndex);
      setShuffle(nextShuffle);
      setSource(options.source ?? null);
      load(order[nextIndex], true);
    },
    [load],
  );

  const togglePlayPause = useCallback(() => {
    if (latest.current.queueIds.length === 0) return;
    const { playing, currentTime, duration } = latest.current.status;
    if (playing) {
      player.pause();
    } else if (duration > 0 && currentTime >= duration - 0.25) {
      restart(true);
    } else {
      player.play();
    }
  }, [player, restart]);

  const toggle = useCallback(
    (track: Track, list?: Track[], trackSource?: string) => {
      if (latest.current.queueIds[latest.current.index] === track.id) {
        togglePlayPause();
        return;
      }
      const context = list && list.some((item) => item.id === track.id) ? list : [track];
      playTracks(context, context.findIndex((item) => item.id === track.id), { source: trackSource });
    },
    [playTracks, togglePlayPause],
  );

  const next = useCallback(() => {
    const { queueIds: ids, index: position, repeat: mode } = latest.current;
    if (ids.length === 0) return;
    if (position + 1 < ids.length) goTo(position + 1);
    else if (mode === 'all') goTo(0);
    else {
      player.pause();
      restart(false);
    }
  }, [goTo, player, restart]);

  const previous = useCallback(() => {
    const { queueIds: ids, index: position, repeat: mode, status: current } = latest.current;
    if (ids.length === 0) return;
    if (current.currentTime > RESTART_THRESHOLD_SECONDS || (position === 0 && mode !== 'all')) {
      restart(current.playing);
      return;
    }
    goTo(position > 0 ? position - 1 : ids.length - 1);
  }, [goTo, restart]);

  const seekTo = useCallback((seconds: number) => {
    player.seekTo(Math.max(0, seconds));
  }, [player]);

  const playQueueIndex = useCallback(
    (queuePosition: number) => {
      const target = queueFromIds(latest.current.queueIds, latest.current.tracksById)[queuePosition];
      if (target) goTo(latest.current.queueIds.indexOf(target.id));
    },
    [goTo],
  );

  const removeFromQueue = useCallback((queuePosition: number) => {
    const { queueIds: ids, index: position, tracksById: byId } = latest.current;
    const target = queueFromIds(ids, byId)[queuePosition];
    if (!target || target.id === ids[position]) return;
    const removedAt = ids.indexOf(target.id);
    setQueueIds(ids.filter((id) => id !== target.id));
    setBaseIds((current) => current.filter((id) => id !== target.id));
    if (removedAt < position) setIndex(position - 1);
  }, []);

  const toggleShuffle = useCallback(() => {
    const { queueIds: ids, index: position, baseIds: base, shuffle: enabled } = latest.current;
    const currentId = ids[position];
    setShuffle(!enabled);
    if (currentId === undefined) return;
    if (enabled) {
      setQueueIds(base);
      setIndex(Math.max(0, base.indexOf(currentId)));
    } else {
      setQueueIds([currentId, ...shuffled(base.filter((id) => id !== currentId))]);
      setIndex(0);
    }
  }, []);

  const cycleRepeat = useCallback(() => setRepeat((mode) => NEXT_REPEAT[mode]), []);

  const setSleepTimer = useCallback((option: SleepTimerOption) => {
    if (option === null) setSleepTimerState(TIMER_OFF);
    else if (option === 'endOfTrack') setSleepTimerState({ endsAt: null, endOfTrack: true });
    else setSleepTimerState({ endsAt: Date.now() + option * 60_000, endOfTrack: false });
  }, []);

  // Count a play once half of the song has been heard.
  useEffect(() => {
    if (currentTrackId === null || countedTrackId.current === currentTrackId) return;
    if (status.duration > 0 && status.currentTime / status.duration >= 0.5) {
      countedTrackId.current = currentTrackId;
      recordPlay(currentTrackId);
    }
  }, [status.currentTime, status.duration, currentTrackId, recordPlay]);

  // Continue with the queue when a song ends.
  useEffect(() => {
    if (!status.didJustFinish) {
      handledFinish.current = false;
      return;
    }
    if (handledFinish.current) return;
    handledFinish.current = true;
    countedTrackId.current = null;

    const { queueIds: ids, index: position, repeat: mode, sleepTimer: timer } = latest.current;
    if (timer.endOfTrack) {
      setSleepTimerState(TIMER_OFF);
      restart(false);
    } else if (mode === 'one') {
      restart(true);
    } else if (position + 1 < ids.length) {
      goTo(position + 1);
    } else if (mode === 'all') {
      goTo(0);
    } else {
      restart(false);
    }
  }, [status.didJustFinish, goTo, restart]);

  // Sleep timer: a timeout, plus a check on every status update in case timers are paused in the background.
  useEffect(() => {
    if (sleepTimer.endsAt === null) return;
    const stop = () => {
      player.pause();
      setSleepTimerState(TIMER_OFF);
    };
    const remaining = sleepTimer.endsAt - Date.now();
    if (remaining <= 0) {
      stop();
      return;
    }
    const id = setTimeout(stop, remaining);
    return () => clearTimeout(id);
  }, [sleepTimer.endsAt, status.currentTime, player]);

  const queue = useMemo(() => queueFromIds(queueIds, tracksById), [queueIds, tracksById]);
  const queueIndex = currentTrackId !== null ? queue.findIndex((track) => track.id === currentTrackId) : -1;

  const value = useMemo<PlayerContextValue>(
    () => ({
      player,
      currentTrack,
      currentTrackId,
      isPlaying: status.playing,
      queue,
      queueIndex,
      source,
      shuffle,
      repeat,
      sleepTimer,
      toggle,
      playTracks,
      togglePlayPause,
      next,
      previous,
      seekTo,
      playQueueIndex,
      removeFromQueue,
      toggleShuffle,
      cycleRepeat,
      setSleepTimer,
    }),
    [
      player, currentTrack, currentTrackId, status.playing, queue, queueIndex, source, shuffle, repeat, sleepTimer,
      toggle, playTracks, togglePlayPause, next, previous, seekTo, playQueueIndex, removeFromQueue, toggleShuffle, cycleRepeat, setSleepTimer,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

function queueFromIds(ids: number[], byId: Map<number, Track>): Track[] {
  return ids.flatMap((id) => byId.get(id) ?? []);
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used inside PlayerProvider');
  return context;
}

export function usePlaybackStatus(): PlaybackStatus {
  const { player } = usePlayer();
  return useAudioPlayerStatus(player);
}
