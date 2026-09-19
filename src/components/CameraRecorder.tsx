import type { RefObject } from 'react';

interface CameraRecorderProps {
  videoRef: RefObject<HTMLVideoElement>;
  isRecording: boolean;
  elapsedSeconds: number;
  onStop: () => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Presentational only — the actual capture logic lives in useCameraRecorder. */
export function CameraRecorder({ videoRef, isRecording, elapsedSeconds, onStop }: CameraRecorderProps) {
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
      <div className="absolute bottom-0 left-0 right-0 safe-bottom flex justify-center pb-6">
        <button
          onClick={onStop}
          aria-label="Stop recording"
          className="w-20 h-20 rounded-full bg-red-600 border-4 border-white/80 shadow-elevated active:scale-95 transition"
        />
      </div>
    </div>
  );
}
