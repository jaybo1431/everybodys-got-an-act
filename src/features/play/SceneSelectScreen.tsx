import { usePlaySession } from '../../state/PlaySessionContext';
import { getAllScenes, getScenesByGenre } from '../../domain/sceneCatalog';
import { ScreenShell } from '../../components/ScreenShell';
import { SceneCard } from '../../components/SceneCard';
import { BackButton } from '../../components/BackButton';

/**
 * The one-player MVP's entry screen — "Choose A Scene" (see the
 * top-level flow in README/spec). With only a handful of scenes, a
 * separate genre-picker screen was pure friction, so this shows every
 * scene with its genre as a badge on the card instead of filtering by
 * genre first. `onExit` is optional and used only when this screen is
 * the very first one in the session (the normal one-player case) —
 * the pass-the-phone group flow still reaches this screen with a
 * genre already selected (via GenreSelectScreen) and a real back
 * history to return to instead.
 */
export function SceneSelectScreen({ onExit }: { onExit?: () => void }) {
  const { session, selectScene, goBack, canGoBack } = usePlaySession();
  const scenes = session.selectedGenre ? getScenesByGenre(session.selectedGenre) : getAllScenes();

  const handleBack = canGoBack ? goBack : onExit;

  return (
    <ScreenShell className="items-stretch">
      <div className="w-full">
        {handleBack && <BackButton onClick={handleBack} label={canGoBack ? 'Genres' : 'Home'} />}
        <h2 className="font-display font-bold text-2xl mt-4">Choose A Scene</h2>
        <p className="text-ink-dim text-sm mt-1">Pick one to play.</p>
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
