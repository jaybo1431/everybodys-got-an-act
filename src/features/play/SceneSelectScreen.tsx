import { usePlaySession } from '../../state/PlaySessionContext';
import { getScenesByGenre } from '../../domain/sceneCatalog';
import { ScreenShell } from '../../components/ScreenShell';

export function SceneSelectScreen() {
  const { session, selectScene, beginParticipantTurn } = usePlaySession();
  const scenes = session.selectedGenre ? getScenesByGenre(session.selectedGenre) : [];

  const handlePick = (sceneId: string) => {
    selectScene(sceneId);
    beginParticipantTurn();
  };

  return (
    <ScreenShell>
      <h2 className="text-2xl font-bold mt-8">Pick a scene</h2>
      <div className="flex-1 flex flex-col gap-4 justify-center w-full max-w-sm overflow-y-auto">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => handlePick(scene.id)}
            className="text-left bg-white/10 hover:bg-white/20 rounded-2xl p-4 transition"
          >
            <div className="font-bold">{scene.title}</div>
            <div className="text-white/60 text-sm mt-1">{scene.premise}</div>
            <div className="text-white/40 text-xs mt-2">
              ~{scene.durationSeconds}s · {scene.characters.length} characters
            </div>
          </button>
        ))}
      </div>
      <div />
    </ScreenShell>
  );
}
