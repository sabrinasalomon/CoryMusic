import { createAudioPlayer, setAudioModeAsync, useAudioPlayerStatus } from 'expo-audio';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import type { Track } from '../library/db';
import { musicFile } from '../library/files';
import { useLibrary } from './LibraryProvider';

type PlayerContextValue = {
  currentTrackId: number | null;
  isPlaying: boolean;
  toggle: (track: Track) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { recordPlay } = useLibrary();
  const player = useMemo(() => createAudioPlayer(null), []);
  const status = useAudioPlayerStatus(player);
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(null);
  const countedTrackId = useRef<number | null>(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
    return () => player.remove();
  }, [player]);

  useEffect(() => {
    if (status.didJustFinish) countedTrackId.current = null;
    if (currentTrackId === null || countedTrackId.current === currentTrackId) return;
    if (status.duration > 0 && status.currentTime / status.duration >= 0.5) {
      countedTrackId.current = currentTrackId;
      recordPlay(currentTrackId);
    }
  }, [status.currentTime, status.duration, status.didJustFinish, currentTrackId, recordPlay]);

  const toggle = useCallback(
    (track: Track) => {
      if (currentTrackId === track.id) {
        if (status.playing) player.pause();
        else player.play();
        return;
      }
      countedTrackId.current = null;
      player.replace({ uri: musicFile(track.fileName).uri });
      player.play();
      setCurrentTrackId(track.id);
    },
    [currentTrackId, status.playing, player],
  );

  const value = useMemo(
    () => ({ currentTrackId, isPlaying: status.playing, toggle }),
    [currentTrackId, status.playing, toggle],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used inside PlayerProvider');
  return context;
}
