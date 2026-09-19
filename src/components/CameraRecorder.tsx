import type { ReactNode, RefObject } from 'react';

interface CameraRecorderProps {
  videoRef: RefObject<HTMLVideoElement>;
  isRecording: boolean;
  elapsedSeconds: number;
  onStop: () => void;
  /** Button label — defaults to "Stop". ActingScreen passes "Finish Line" for the turn-based flow. */
  stopLabel?: string;
  /** Optional overlay content (e.g. the current line's text) rendered above the live preview. */
  children?: ReactNode;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Presentational only — the actual capture logic lives in useCameraRecorder. */
export function CameraRecorder({ videoRef, isRecording, elapsedSeconds, onStop, stopLabel, children }: CameraRecorderProps) {
  return (
    <div className="min-h-screen w-full relative bg-bg">
      <video ref={videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
      {isRecording && (
        <div className="absolute top-0 left-0 right-0 safe-top flex justify-center">
          <div className="bg-red-600/90 backdrop-blur px-4 py-1.5 rounded-pill text-sm font-bold flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            REC {formatTime(elapsedSeconds)}
          </div>
        </div>
      )}
      {children}
      <div className="absolute bottom-0 left-0 right-0 safe-bottom flex flex-col items-center gap-2 pb-6">
        <button
          onClick={onStop}
          aria-label={stopLabel ?? 'Stop recording'}
          className="w-20 h-20 rounded-full bg-red-600 border-4 border-white/80 shadow-elevated active:scale-95 transition"
        />
        {stopLabel && (
          <span className="text-white text-xs font-semibold tracking-wide bg-black/50 backdrop-blur px-3 py-1 rounded-pill">
            {stopLabel}
          </span>
        )}
      </div>
    </div>
  );
}
