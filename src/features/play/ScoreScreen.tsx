import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { ScoreCard } from '../../components/ScoreCard';

/**
 * The one-player flow's landing spot right after a scene: shows the
 * playful score, then two forward-only actions. Deliberately no path
 * to the pass-the-phone group screens from here — see
 * PlaySessionContext's playAgain()/startNewScene() for how the
 * one-player loop stays a closed cycle (score -> camera-permission |
 * scene-select), never touching 'pass-phone'/'results'/'playback'.
 */
export function ScoreScreen() {
  const { lastAcceptedTake, playAgain, startNewScene } = usePlaySession();
  if (!lastAcceptedTake?.score) return null;

  return (
    <ScreenShell className="items-stretch justify-center">
      <div className="text-center mt-2">
        <div className="text-[11px] tracking-[0.2em] uppercase text-gold-light/80 font-semibold">Your Score</div>
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <ScoreCard score={lastAcceptedTake.score} />
      </div>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Button onClick={playAgain} className="w-full uppercase">
          Play Again
        </Button>
        <Button variant="surface" onClick={startNewScene} className="w-full uppercase">
          New Scene
        </Button>
      </div>
    </ScreenShell>
  );
}
