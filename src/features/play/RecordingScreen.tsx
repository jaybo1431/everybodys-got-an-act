import { useEffect, useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import type { useCameraRecorder } from '../../media/useCameraRecorder';
import { CameraRecorder } from '../../components/CameraRecorder';

interface Props {
  camera: ReturnType<typeof useCameraRecorder>;
}

export function RecordingScreen({ camera }: Props) {
  const { submitRecordedBlob } = usePlaySession();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!camera.isRecording && camera.recordedBlob) {
      submitRecordedBlob(camera.recordedBlob);
    }
  }, [camera.isRecording, camera.recordedBlob, submitRecordedBlob]);

  return (
    <CameraRecorder
      videoRef={camera.videoRef}
      isRecording={camera.isRecording}
      elapsedSeconds={elapsedSeconds}
      onStop={() => camera.stopRecording()}
    />
  );
}
