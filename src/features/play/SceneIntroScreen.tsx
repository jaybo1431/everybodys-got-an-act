import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';

export function SceneIntroScreen() {
  const { scene, currentParticipant, goToPhase, goBack, canGoBack } = usePlaySession();
  if (!scene) return null;

  return (
    <ScreenShell className="items-stretch text-center">
      <div className="w-full text-left">{canGoBack && <BackButton onClick={goBack} label="Scenes" />}</div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 w-full">
        <div className="text-[11px] tracking-[0.2em] uppercase text-gold-light/80 font-semibold">
          {scene.genre} · ~{scene.durationSeconds} seconds
        </div>
        <h2 className="font-display font-extrabold text-3xl leading-tight">{scene.title}</h2>
        <p className="text-ink-dim text-sm max-w-xs">{scene.premise}</p>
        <div className="text-ink text-sm font-semibold mt-2">
          {currentParticipant ? `${currentParticipant.name}'s turn` : 'Your turn'}
        </div>
      </div>

      <Button onClick={() => goToPhase('script')} className="w-full max-w-sm">
        View Scene
      </Button>
    </ScreenShell>
  );
}
