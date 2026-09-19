import { useEffect } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import type { useCameraRecorder } from '../../media/useCameraRecorder';
import { Button } from '../../components/Button';

interface Props {
  camera: ReturnType<typeof useCameraRecorder>;
}

export function RecordingScreen({ camera }: Props) {
  const { submitRecordedBlob } = usePlaySession();

  useEffect(() => {
    if (!camera.isRecording && camera.recordedBlob) {
      submitRecordedBlob(camera.recordedBlob);
    }
  }, [camera.isRecording, camera.recordedBlob, submitRecordedBlob]);

  return (
    <div className="min-h-screen w-full relative bg-black">
      <video ref={camera.videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500/90 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Recording
      </div>
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <Button variant="danger" onClick={() => camera.stopRecording()}>
          Stop
        </Button>
      </div>
    </div>
  );
}
