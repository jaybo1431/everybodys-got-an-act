import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { ScoreCard } from '../../components/ScoreCard';

export function ScoreScreen() {
  const { lastAcceptedTake, goToPhase } = usePlaySession();
  if (!lastAcceptedTake?.score) return null;

  return (
    <ScreenShell className="items-stretch justify-center">
      <div className="flex-1 flex items-center justify-center w-full">
        <ScoreCard score={lastAcceptedTake.score} />
      </div>
      <Button onClick={() => goToPhase('pass-phone')} className="w-full max-w-sm">
        Continue
      </Button>
    </ScreenShell>
  );
}
