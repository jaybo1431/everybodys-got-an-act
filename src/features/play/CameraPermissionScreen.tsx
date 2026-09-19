import { useEffect } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import type { useCameraRecorder } from '../../media/useCameraRecorder';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';

interface Props {
  camera: ReturnType<typeof useCameraRecorder>;
}

export function CameraPermissionScreen({ camera }: Props) {
  const { goToPhase, goBack, canGoBack } = usePlaySession();

  useEffect(() => {
    if (camera.permissionState === 'granted') {
      goToPhase('acting');
    }
  }, [camera.permissionState, goToPhase]);

  return (
    <ScreenShell className="items-stretch">
      <div className="w-full">
        {/* No back history right after "Play Again" (it deliberately
            clears history — see PlaySessionContext.playAgain) — the
            button only appears when there's somewhere to actually go. */}
        {canGoBack && <BackButton onClick={goBack} label="Back" />}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-surface border border-hairline/10 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 8a2 2 0 012-2h5l1.5 2H18a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
              stroke="rgb(var(--color-gold-light))"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.2" stroke="rgb(var(--color-gold-light))" strokeWidth="1.4" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-2xl">Camera Time</h2>
        <p className="text-ink-dim max-w-xs text-sm">
          We need your front camera and mic to record this take. Nothing leaves this phone.
        </p>
        {camera.permissionState === 'denied' && (
          <p className="text-red-400 text-sm max-w-xs">
            {camera.error ?? 'Camera access was denied. Open Settings → Safari → Camera and allow access, then try again.'}
          </p>
        )}
        {camera.permissionState === 'unsupported' && (
          <p className="text-red-400 text-sm max-w-xs">This browser doesn&apos;t support camera recording.</p>
        )}
      </div>

      <Button
        onClick={() => camera.requestPermission()}
        disabled={camera.permissionState === 'requesting'}
        className="w-full max-w-sm"
      >
        {camera.permissionState === 'requesting' ? 'Requesting…' : 'Allow Camera'}
      </Button>
    </ScreenShell>
  );
}
