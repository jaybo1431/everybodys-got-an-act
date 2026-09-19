import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

export function ResultsScreen() {
  const { session, takes, viewPlayback, startNewScene } = usePlaySession();
  const ranked = [...takes].sort((a, b) => (b.score?.overall ?? 0) - (a.score?.overall ?? 0));

  return (
    <ScreenShell>
      <h2 className="text-2xl font-bold mt-8">Leaderboard</h2>
      <div className="flex-1 w-full max-w-sm overflow-y-auto my-6 space-y-3">
        {ranked.map((take, i) => {
          const participant = session.participants.find((p) => p.id === take.participantId);
          return (
            <div key={take.id} className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-bold">
                  {i === 0 ? '👑 ' : `#${i + 1} `}
                  {participant?.name}
                </div>
                <div className="text-white/50 text-sm">{take.score?.tagline}</div>
              </div>
              <div className="text-2xl font-black text-fuchsia-400">{take.score?.overall}</div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 w-full max-w-sm">
        <Button variant="secondary" onClick={viewPlayback} className="flex-1">
          Watch takes
        </Button>
        <Button onClick={startNewScene} className="flex-1">
          New scene
        </Button>
      </div>
    </ScreenShell>
  );
}
