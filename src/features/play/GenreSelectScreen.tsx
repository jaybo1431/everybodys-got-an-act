import { usePlaySession } from '../../state/PlaySessionContext';
import { getGenres } from '../../domain/sceneCatalog';
import { ScreenShell } from '../../components/ScreenShell';
import { GenreCard } from '../../components/GenreCard';
import { BackButton } from '../../components/BackButton';

export function GenreSelectScreen({ onExit }: { onExit: () => void }) {
  const { selectGenre } = usePlaySession();
  const genres = getGenres();

  return (
    <ScreenShell className="items-stretch">
      <div className="w-full">
        <BackButton onClick={onExit} label="Home" />
        <h2 className="font-display font-bold text-2xl mt-4">Pick a Genre</h2>
        <p className="text-ink-dim text-sm mt-1">What&apos;s your mood?</p>
      </div>
      <div className="flex-1 flex flex-col gap-3 justify-center w-full py-6">
        {genres.map((genre) => (
          <GenreCard key={genre} genre={genre} onClick={() => selectGenre(genre)} />
        ))}
      </div>
      <div />
    </ScreenShell>
  );
}
