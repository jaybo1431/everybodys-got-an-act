import { useEffect, useMemo, useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import type { useCameraRecorder } from '../../media/useCameraRecorder';
import { useAudioPlayer } from '../../media/useAudioPlayer';
import { audioRepository } from '../../data/audioRepository';
import { getAudioAssetIdForTurn, getTotalLineCount, getTurnAt, type Turn } from '../../domain/turnEngine';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { Countdown } from '../../components/Countdown';
import { CameraRecorder } from '../../components/CameraRecorder';
import { VideoReview } from '../../components/VideoReview';
import { SceneProgress } from '../../components/SceneProgress';

type Stage =
  | 'partner'
  | 'partner-error'
  | 'ready'
  | 'countdown'
  | 'recording'
  | 'review'
  | 'saving-line'
  | 'finishing'
  | 'finish-error';

interface Props {
  camera: ReturnType<typeof useCameraRecorder>;
}

/**
 * Drives the turn-based acting flow for one participant's scene
 * performance: partner audio -> player turn -> partner audio -> ...,
 * advancing automatically, until the scene ends. The only manual
 * action required from the player is finishing their own line.
 *
 * Composes the pure turnEngine (what turn is this) with useAudioPlayer
 * (partner playback) and the existing useCameraRecorder (player
 * recording) — none of those know about each other.
 */
export function ActingScreen({ camera }: Props) {
  const { scene, session, acceptLineSegment, finalizeTake, goToPhase } = usePlaySession();
  const audioPlayer = useAudioPlayer();
  const playerCharacterId = session.playerCharacterId ?? '';

  const [turnIndex, setTurnIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('partner');
  const [countdownCount, setCountdownCount] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [reviewBlob, setReviewBlob] = useState<Blob | null>(null);
  const [lineSaveError, setLineSaveError] = useState<string | null>(null);

  const totalLines = scene ? getTotalLineCount(scene) : 0;
  const turn: Turn | null = scene ? getTurnAt(scene, playerCharacterId, turnIndex) : null;

  // The single source of truth for "what happens when we land on a
  // new line". Depends only on turnIndex (scene/playerCharacterId
  // are stable for the life of this screen) so it never re-fires
  // because of an unrelated re-render.
  useEffect(() => {
    if (!scene) return;
    const currentTurn = getTurnAt(scene, playerCharacterId, turnIndex);

    if (currentTurn.kind === 'END_OF_SCENE') {
      setStage('finishing');
      return;
    }

    if (currentTurn.kind === 'PLAYER_LINE') {
      // Wait for an explicit "Start" tap rather than auto-starting the
      // countdown — the player should never wonder whether recording
      // is about to begin on its own.
      setStage('ready');
      return;
    }

    // PARTNER_LINE: resolve and play audio, then auto-advance once it ends.
    setStage('partner');
    const audioAssetId = getAudioAssetIdForTurn(currentTurn);
    const asset = audioAssetId ? audioRepository.resolve(audioAssetId) : undefined;
    if (!asset) {
      setStage('partner-error');
      return;
    }

    let cancelled = false;
    audioPlayer
      .play(asset.src)
      .then(() => {
        if (!cancelled) setTurnIndex((i) => i + 1);
      })
      .catch(() => {
        if (!cancelled) setStage('partner-error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnIndex]);

  // Countdown ticker for a player line.
  useEffect(() => {
    if (stage !== 'countdown') return;
    if (countdownCount === 0) {
      camera.startRecording();
      setElapsedSeconds(0);
      setStage('recording');
      return;
    }
    const timer = setTimeout(() => setCountdownCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [stage, countdownCount]);

  // REC timer while recording.
  useEffect(() => {
    if (stage !== 'recording') return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  // Detect the recorder actually stopping (after "Finish Line" is tapped).
  useEffect(() => {
    if (stage !== 'recording') return;
    if (!camera.isRecording && camera.recordedBlob) {
      setReviewBlob(camera.recordedBlob);
      setStage('review');
    }
  }, [stage, camera.isRecording, camera.recordedBlob]);

  const reviewUrl = useMemo(() => (reviewBlob ? URL.createObjectURL(reviewBlob) : null), [reviewBlob]);
  useEffect(() => {
    return () => {
      if (reviewUrl) URL.revokeObjectURL(reviewUrl);
    };
  }, [reviewUrl]);

  // Finalize the take once every line has been performed.
  useEffect(() => {
    if (stage !== 'finishing') return;
    let cancelled = false;
    finalizeTake()
      .then(() => {
        if (!cancelled) goToPhase('score');
      })
      .catch(() => {
        if (!cancelled) setStage('finish-error');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (!scene || !session.playerCharacterId || !turn) return null;

  const handleStartLine = () => {
    setCountdownCount(3);
    setStage('countdown');
  };

  const handleRetakeLine = () => {
    setReviewBlob(null);
    camera.resetRecording();
    setCountdownCount(3);
    setStage('countdown');
  };

  const handleAcceptLine = async () => {
    if (turn.kind !== 'PLAYER_LINE' || !turn.line || !reviewBlob) return;
    setStage('saving-line');
    setLineSaveError(null);
    try {
      await acceptLineSegment(turn.line, reviewBlob);
      setReviewBlob(null);
      setTurnIndex((i) => i + 1);
    } catch (err) {
      setLineSaveError(err instanceof Error ? err.message : "Couldn't save that take. Try again.");
      setStage('review');
    }
  };

  const partnerName = turn.line ? scene.characters.find((c) => c.id === turn.line!.characterId)?.name : undefined;

  if (stage === 'partner' || stage === 'partner-error') {
    return (
      <ScreenShell className="items-center justify-center text-center gap-6">
        <SceneProgress total={totalLines} current={turnIndex} />
        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-gold-light/80 font-semibold">
            {partnerName ?? 'Partner'}
          </div>
          <div className="font-display font-extrabold text-3xl mt-2 uppercase">
            {stage === 'partner-error' ? "Couldn't Play" : 'Listen'}
          </div>
        </div>
        {stage === 'partner-error' && (
          <>
            <p className="text-ink-dim text-sm max-w-xs">This line's audio didn't load. You can keep going without it.</p>
            <Button onClick={() => setTurnIndex((i) => i + 1)}>Continue</Button>
          </>
        )}
      </ScreenShell>
    );
  }

  if (stage === 'ready') {
    return (
      <ScreenShell className="items-center justify-center text-center gap-6">
        <SceneProgress total={totalLines} current={turnIndex} />
        <div className="font-display font-extrabold text-3xl uppercase">Your Turn</div>
        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-gold-light/80 font-semibold">Your Line</div>
          <p className="font-display text-xl font-semibold mt-2 max-w-xs">&ldquo;{turn.line?.text}&rdquo;</p>
        </div>
        <Button onClick={handleStartLine} className="w-full max-w-xs">
          Start
        </Button>
      </ScreenShell>
    );
  }

  if (stage === 'countdown') {
    return (
      <div className="screen-height w-full relative flex flex-col bg-bg safe-top safe-bottom">
        <video ref={camera.videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex justify-center pt-2">
          <SceneProgress total={totalLines} current={turnIndex} />
        </div>
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-gold-light/80 font-semibold">Your Line</div>
            <p className="font-display text-xl font-semibold mt-2 max-w-xs">&ldquo;{turn.line?.text}&rdquo;</p>
          </div>
          <Countdown count={countdownCount} />
        </div>
      </div>
    );
  }

  if (stage === 'recording') {
    return (
      <CameraRecorder
        videoRef={camera.videoRef}
        isRecording={camera.isRecording}
        elapsedSeconds={elapsedSeconds}
        onStop={() => camera.stopRecording()}
        stopLabel="I'M DONE"
      >
        <div className="absolute top-16 left-0 right-0 flex flex-col items-center gap-3 px-6 safe-top">
          <SceneProgress total={totalLines} current={turnIndex} />
          <div className="text-center bg-black/50 backdrop-blur rounded-lg px-4 py-2 max-w-xs">
            <div className="text-[10px] tracking-[0.2em] uppercase text-gold-light/80 font-semibold">Your Line</div>
            <p className="text-white text-sm font-medium mt-1">&ldquo;{turn.line?.text}&rdquo;</p>
          </div>
        </div>
      </CameraRecorder>
    );
  }

  if (stage === 'review' || stage === 'saving-line') {
    if (!reviewUrl) return null;
    return (
      <div className="relative">
        <VideoReview
          src={reviewUrl}
          isSaving={stage === 'saving-line'}
          onRetake={handleRetakeLine}
          onAccept={handleAcceptLine}
        />
        {lineSaveError && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center px-6">
            <p className="text-red-400 text-sm text-center bg-black/70 backdrop-blur rounded-md px-4 py-2">{lineSaveError}</p>
          </div>
        )}
      </div>
    );
  }

  if (stage === 'finish-error') {
    return (
      <ScreenShell className="items-center justify-center text-center gap-6">
        <p className="text-red-400 text-sm max-w-xs">Couldn&apos;t save this scene&apos;s score. You can try again.</p>
        <Button onClick={() => setStage('finishing')}>Try Again</Button>
      </ScreenShell>
    );
  }

  // 'finishing' — a brief, satisfying beat while the score is
  // computed and saved, then the existing effect above (triggered by
  // this same stage) transitions to the Score screen automatically.
  return (
    <ScreenShell className="items-center justify-center text-center gap-4">
      <div className="text-5xl" aria-hidden="true">
        🎭
      </div>
      <div className="font-display font-extrabold text-3xl uppercase">Scene Complete</div>
    </ScreenShell>
  );
}
