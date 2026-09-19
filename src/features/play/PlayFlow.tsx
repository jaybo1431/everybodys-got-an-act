import { useEffect } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import { useCameraRecorder } from '../../media/useCameraRecorder';
import type { GamePhase } from '../../domain/types';
import { GenreSelectScreen } from './GenreSelectScreen';
import { SceneSelectScreen } from './SceneSelectScreen';
import { ScriptPresentScreen } from './ScriptPresentScreen';
import { CameraPermissionScreen } from './CameraPermissionScreen';
import { CountdownScreen } from './CountdownScreen';
import { RecordingScreen } from './RecordingScreen';
import { ReviewScreen } from './ReviewScreen';
import { ParticipantNameScreen } from './ParticipantNameScreen';
import { PassPhoneScreen } from './PassPhoneScreen';
import { ResultsScreen } from './ResultsScreen';
import { PlaybackScreen } from './PlaybackScreen';

const CAMERA_ACTIVE_PHASES: GamePhase[] = ['camera-permission', 'countdown', 'recording', 'review'];

/**
 * Maps the current GamePhase to a screen. This is the only file that
 * knows the full phase sequence — every screen only knows how to
 * render itself and which actions to call next.
 */
export function PlayFlow() {
  const { session } = usePlaySession();
  const camera = useCameraRecorder();

  // Release the camera the moment we leave the recording-related
  // phases, so it's not left running in the background while names
  // are entered, the phone is passed, or results are shown.
  useEffect(() => {
    if (!CAMERA_ACTIVE_PHASES.includes(session.phase)) {
      camera.releaseCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.phase]);

  switch (session.phase) {
    case 'genre-select':
      return <GenreSelectScreen />;
    case 'scene-select':
      return <SceneSelectScreen />;
    case 'script-present':
      return <ScriptPresentScreen />;
    case 'camera-permission':
      return <CameraPermissionScreen camera={camera} />;
    case 'countdown':
      return <CountdownScreen camera={camera} />;
    case 'recording':
      return <RecordingScreen camera={camera} />;
    case 'review':
      return <ReviewScreen />;
    case 'participant-name':
      return <ParticipantNameScreen />;
    case 'pass-phone':
      return <PassPhoneScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'playback':
      return <PlaybackScreen />;
    default:
      return null;
  }
}
