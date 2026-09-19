import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAudioPlayerResult {
  isPlaying: boolean;
  /** Resolves once playback finishes, rejects on load/playback failure or if stop() is called mid-play. */
  play: (src: string) => Promise<void>;
  stop: () => void;
}

/**
 * Wraps the browser's native Audio element only — no domain logic,
 * no knowledge of scenes or dialogue lines. Deliberately NOT the
 * Web Speech API (speechSynthesis): this plays real audio files
 * resolved via AudioRepository, which is the permanent architecture
 * even though today's files are placeholder recordings.
 */
export function useAudioPlayer(): UseAudioPlayerResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rejectRef = useRef<((reason: Error) => void) | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    audioRef.current = null;
    if (rejectRef.current) {
      rejectRef.current(new Error('Playback stopped.'));
      rejectRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(
    (src: string): Promise<void> => {
      stop();
      return new Promise<void>((resolve, reject) => {
        const audio = new Audio(src);
        audioRef.current = audio;
        rejectRef.current = reject;
        setIsPlaying(true);

        const finish = () => {
          rejectRef.current = null;
          setIsPlaying(false);
        };

        audio.addEventListener('ended', () => {
          finish();
          resolve();
        });
        audio.addEventListener('error', () => {
          finish();
          reject(new Error('Partner audio could not be played.'));
        });
        audio.play().catch((err) => {
          finish();
          reject(err instanceof Error ? err : new Error('Partner audio could not be played.'));
        });
      });
    },
    [stop],
  );

  useEffect(() => stop, [stop]);

  return { isPlaying, play, stop };
}
