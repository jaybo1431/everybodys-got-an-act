import { usePlaySession } from '../../state/PlaySessionContext';
import { getGenres } from '../../domain/sceneCatalog';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

export function GenreSelectScreen() {
  const { selectGenre } = usePlaySession();
  const genres = getGenres();

  return (
    <ScreenShell>
      <h2 className="text-2xl font-bold mt-8">Pick a genre</h2>
      <div className="flex-1 flex flex-col gap-4 justify-center w-full max-w-sm">
        {genres.map((genre) => (
          <Button key={genre} variant="secondary" onClick={() => selectGenre(genre)} className="capitalize">
            {genre}
          </Button>
        ))}
      </div>
      <div />
    </ScreenShell>
  );
}
