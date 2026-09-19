import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';
import { ScriptView } from '../../components/ScriptView';

export function ScriptScreen() {
  const { scene, goToPhase, goBack } = usePlaySession();
  if (!scene) return null;

  return (
    <ScreenShell className="items-stretch">
      <div className="w-full">
        <BackButton onClick={goBack} label="Scene" />
        <h2 className="font-display font-bold text-2xl mt-4">{scene.title}</h2>
        <p className="text-ink-dim text-sm mt-1">{scene.instructions}</p>
      </div>
      <div className="flex-1 w-full overflow-y-auto my-5 bg-surface border border-hairline/10 rounded-lg p-5">
        <ScriptView scene={scene} />
      </div>
      <Button onClick={() => goToPhase('camera-permission')} className="w-full max-w-sm">
        I&apos;m Ready
      </Button>
    </ScreenShell>
  );
}
