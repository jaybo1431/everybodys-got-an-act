import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { CharacterCard } from '../../components/CharacterCard';
import { BackButton } from '../../components/BackButton';

/**
 * "Who Are You?" — the one-player flow's character picker. Whichever
 * character the player taps is the one they'll perform; every other
 * character in the scene is voiced by pre-recorded partner audio.
 * Deliberately no mention of "playerCharacterId" or any other
 * internal term here — just a name and a one-line hint at who that
 * character is.
 */
export function CharacterSelectScreen() {
  const { scene, selectCharacter, goBack } = usePlaySession();
  if (!scene) return null;

  return (
    <ScreenShell className="items-stretch">
      <div className="w-full">
        <BackButton onClick={goBack} label="Scenes" />
        <h2 className="font-display font-bold text-2xl mt-4">Who Are You?</h2>
        <p className="text-ink-dim text-sm mt-1">Pick the character you&apos;ll play.</p>
      </div>
      <div className="flex-1 flex flex-col gap-3 justify-center w-full py-6">
        {scene.characters.map((character) => (
          <CharacterCard key={character.id} character={character} onClick={() => selectCharacter(character.id)} />
        ))}
      </div>
      <div />
    </ScreenShell>
  );
}
