import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { Leaderboard, type LeaderboardEntry } from '../../components/Leaderboard';

export function ResultsScreen() {
  const { session, takes, viewPlayback, startNewScene } = usePlaySession();

  const entries: LeaderboardEntry[] = takes.map((take) => {
    const participant = session.participants.find((p) => p.id === take.participantId);
    return {
      id: take.id,
      name: participant?.name ?? 'Unknown',
      score: take.score?.overall ?? 0,
      tagline: take.score?.tagline,
    };
  });

  return (
    <ScreenShell className="items-stretch">
      <h2 className="font-display font-extrabold text-2xl text-center mt-2">Who&apos;s Got The Act?</h2>
      <div className="flex-1 w-full overflow-y-auto my-6">
        <Leaderboard entries={entries} />
      </div>
      <div className="flex gap-3 w-full">
        <Button variant="surface" onClick={viewPlayback} className="flex-1">
          Watch The Takes
        </Button>
        <Button onClick={startNewScene} className="flex-1">
          New Scene
        </Button>
      </div>
    </ScreenShell>
  );
}
