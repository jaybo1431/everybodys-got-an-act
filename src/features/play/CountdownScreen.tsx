import { useEffect, useRef, useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import type { useCameraRecorder } from '../../media/useCameraRecorder';
import { ScreenShell } from '../../components/ScreenShell';

interface Props {
  camera: ReturnType<typeof useCameraRecorder>;
}

export function CountdownScreen({ camera }: Props) {
  const { goToPhase } = usePlaySession();
  const [count, setCount] = useState(3);

  // Keep the latest camera/navigation callbacks in refs so the timer
  // effect only depends on `count` and never restarts because of an
  // unrelated re-render higher up the tree.
  const cameraRef = useRef(camera);
  cameraRef.current = camera;
  const goToPhaseRef = useRef(goToPhase);
  goToPhaseRef.current = goToPhase;

  useEffect(() => {
    if (count === 0) {
      cameraRef.current.startRecording();
      goToPhaseRef.current('recording');
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <ScreenShell className="items-center justify-center relative p-0">
      <video ref={camera.videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-10 text-8xl font-black drop-shadow-lg">{count > 0 ? count : 'Go!'}</div>
    </ScreenShell>
  );
}
