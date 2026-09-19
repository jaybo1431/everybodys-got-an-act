import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

export function ScriptPresentScreen() {
  const { scene, currentParticipant, goToPhase } = usePlaySession();
  if (!scene) return null;

  return (
    <ScreenShell>
      <div className="w-full">
        <div className="text-white/50 text-sm">{currentParticipant?.name}&apos;s turn</div>
        <h2 className="text-2xl font-bold mt-1">{scene.title}</h2>
        <p className="text-white/60 mt-2">{scene.instructions}</p>
      </div>
      <div className="flex-1 w-full overflow-y-auto my-6 bg-white/5 rounded-2xl p-4 space-y-3">
        {scene.script.lines.map((line, i) => {
          const character = scene.characters.find((c) => c.id === line.characterId);
          return (
            <div key={i}>
              <div className="text-fuchsia-400 text-sm font-semibold">{character?.name ?? 'Narrator'}</div>
              <div className="text-white/90">{line.line}</div>
            </div>
          );
        })}
      </div>
      <Button onClick={() => goToPhase('camera-permission')} className="w-full max-w-sm">
        I&apos;m ready
      </Button>
    </ScreenShell>
  );
}
