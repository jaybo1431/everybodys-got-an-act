import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export type CameraPermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';

export interface UseCameraRecorderResult {
  videoRef: RefObject<HTMLVideoElement>;
  permissionState: CameraPermissionState;
  isRecording: boolean;
  recordedBlob: Blob | null;
  error: string | null;
  requestPermission: () => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
  releaseCamera: () => void;
}

/**
 * Wraps getUserMedia + MediaRecorder only. It knows nothing about
 * game sessions, takes, or storage — it just requests a front camera,
 * records, and hands back a Blob. Whoever calls startRecording() /
 * stopRecording() decides what to do with the result.
 */
export function useCameraRecorder(): UseCameraRecorderResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [permissionState, setPermissionState] = useState<CameraPermissionState>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState('unsupported');
      return;
    }
    setPermissionState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setError(null);
      setPermissionState('granted');
    } catch (err) {
      setPermissionState('denied');
      setError(err instanceof Error ? err.message : 'Camera permission was denied.');
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];

    const preferredMimeType = ['video/webm;codecs=vp9,opus', 'video/webm'].find((type) =>
      MediaRecorder.isTypeSupported(type),
    );

    const recorder = new MediaRecorder(streamRef.current, preferredMimeType ? { mimeType: preferredMimeType } : undefined);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
      setRecordedBlob(blob);
    };

    recorder.start();
    recorderRef.current = recorder;
    setRecordedBlob(null);
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  const resetRecording = useCallback(() => {
    setRecordedBlob(null);
  }, []);

  const releaseCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setPermissionState('idle');
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return {
    videoRef,
    permissionState,
    isRecording,
    recordedBlob,
    error,
    requestPermission,
    startRecording,
    stopRecording,
    resetRecording,
    releaseCamera,
  };
}
