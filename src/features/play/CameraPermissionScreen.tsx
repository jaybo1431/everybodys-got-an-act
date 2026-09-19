import { useEffect } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import type { useCameraRecorder } from '../../media/useCameraRecorder';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

interface Props {
  camera: ReturnType<typeof useCameraRecorder>;
}

export function CameraPermissionScreen({ camera }: Props) {
  const { goToPhase } = usePlaySession();

  useEffect(() => {
    if (camera.permissionState === 'granted') {
      goToPhase('countdown');
    }
  }, [camera.permissionState, goToPhase]);

  return (
    <ScreenShell className="items-center justify-center text-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Camera time</h2>
        <p className="text-white/60 max-w-xs">
          We need your front camera and mic to record this take. Nothing leaves this phone.
        </p>
        {camera.permissionState === 'denied' && (
          <p className="text-red-400 text-sm">
            {camera.error ?? 'Camera access was denied. Check your browser settings.'}
          </p>
        )}
        {camera.permissionState === 'unsupported' && (
          <p className="text-red-400 text-sm">This browser doesn&apos;t support camera recording.</p>
        )}
      </div>
      <Button onClick={() => camera.requestPermission()} disabled={camera.permissionState === 'requesting'}>
        {camera.permissionState === 'requesting' ? 'Requesting…' : 'Allow camera'}
      </Button>
    </ScreenShell>
  );
}
