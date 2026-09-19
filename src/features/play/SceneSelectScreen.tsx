import { usePlaySession } from '../../state/PlaySessionContext';
import { getScenesByGenre } from '../../domain/sceneCatalog';
import { ScreenShell } from '../../components/ScreenShell';
import { SceneCard } from '../../components/SceneCard';
import { BackButton } from '../../components/BackButton';

export function SceneSelectScreen() {
  const { session, selectScene, goBack } = usePlaySession();
  const scenes = session.selectedGenre ? getScenesByGenre(session.selectedGenre) : [];

  return (
    <ScreenShell className="items-stretch">
      <div className="w-full">
        <BackButton onClick={goBack} label="Genres" />
        <h2 className="font-display font-bold text-2xl mt-4">Your Scene</h2>
        <p className="text-ink-dim text-sm mt-1">Everyone performs the same one.</p>
      </div>
      <div className="flex-1 flex flex-col gap-3 justify-center w-full py-6 overflow-y-auto">
        {scenes.map((scene) => (
          <SceneCard key={scene.id} scene={scene} onClick={() => selectScene(scene.id)} />
        ))}
      </div>
      <div />
    </ScreenShell>
  );
}
