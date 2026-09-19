import { useEffect, useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import { mediaRepository } from '../../data/mediaRepository';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

export function PlaybackScreen() {
  const { session, takes, goToPhase, startNewScene } = usePlaySession();
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    (async () => {
      const entries = await Promise.all(
        takes.map(async (take) => {
          const asset = await mediaRepository.get(take.mediaAssetId);
          if (!asset) return null;
          const url = URL.createObjectURL(asset.blob);
          objectUrls.push(url);
          return [take.id, url] as const;
        }),
      );
      if (!cancelled) {
        setUrls(Object.fromEntries(entries.filter((entry): entry is [string, string] => Boolean(entry))));
      }
    })();

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [takes]);

  return (
    <ScreenShell>
      <h2 className="text-2xl font-bold mt-8">All takes</h2>
      <div className="flex-1 w-full max-w-sm overflow-y-auto my-6 space-y-6">
        {takes.map((take) => {
          const participant = session.participants.find((p) => p.id === take.participantId);
          const url = urls[take.id];
          return (
            <div key={take.id}>
              <div className="flex justify-between text-sm text-white/60 mb-1">
                <span>{participant?.name}</span>
                <span>{take.score?.overall}</span>
              </div>
              {url && <video src={url} controls playsInline className="w-full rounded-xl bg-black" />}
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 w-full max-w-sm">
        <Button variant="secondary" onClick={() => goToPhase('results')} className="flex-1">
          Back
        </Button>
        <Button onClick={startNewScene} className="flex-1">
          New scene
        </Button>
      </div>
    </ScreenShell>
  );
}
