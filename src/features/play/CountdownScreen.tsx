import { useEffect, useRef, useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import type { useCameraRecorder } from '../../media/useCameraRecorder';
import { Countdown } from '../../components/Countdown';

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
    <div className="screen-height w-full relative flex items-center justify-center bg-bg">
      <video ref={camera.videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10">
        <Countdown count={count} />
      </div>
    </div>
  );
}
