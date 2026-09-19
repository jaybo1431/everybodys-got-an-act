import { useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import { mediaRepository } from '../../data/mediaRepository';
import { getOrderedSegments } from '../../domain/takeSegments';
import type { Scene, Take, TakeSegment } from '../../domain/types';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';
import { VideoPlayer } from '../../components/VideoPlayer';

function SegmentClip({ segment, label }: { segment: TakeSegment; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    if (url || loading) return;
    setLoading(true);
    const asset = await mediaRepository.get(segment.mediaAssetId);
    if (asset) setUrl(URL.createObjectURL(asset.blob));
    setLoading(false);
  };

  return (
    <div>
      <div className="text-ink-dim text-xs mb-1.5">{label}</div>
      {url ? (
        <VideoPlayer src={url} />
      ) : (
        <Button variant="surface" onClick={handlePlay} disabled={loading} className="w-full">
          {loading ? 'Loading…' : 'Play'}
        </Button>
      )}
    </div>
  );
}

function TakeCard({ take, participantName, scene }: { take: Take; participantName: string; scene: Scene | undefined }) {
  const orderedSegments = getOrderedSegments(take.segments);

  return (
    <div className="bg-surface border border-hairline/10 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-ink">{participantName}</div>
          <div className="text-ink-dim text-xs mt-0.5">{scene?.title ?? ''}</div>
        </div>
        <div className="text-xl font-display font-extrabold text-shimmer-gold">{take.score?.overall}</div>
      </div>
      <div className="space-y-3">
        {orderedSegments.map((segment, i) => {
          const line = scene?.dialogueLines.find((l) => l.id === segment.lineId);
          return <SegmentClip key={segment.id} segment={segment} label={line ? `"${line.text}"` : `Line ${i + 1}`} />;
        })}
      </div>
    </div>
  );
}

export function PlaybackScreen() {
  const { session, scene, takes, goBack, startNewScene } = usePlaySession();

  return (
    <ScreenShell className="items-stretch">
      <div className="w-full">
        <BackButton onClick={goBack} label="Results" />
        <h2 className="font-display font-extrabold text-2xl mt-4">All Takes</h2>
      </div>
      <div className="flex-1 w-full overflow-y-auto my-5 space-y-4">
        {takes.map((take) => {
          const participant = session.participants.find((p) => p.id === take.participantId);
          return <TakeCard key={take.id} take={take} participantName={participant?.name ?? 'Unknown'} scene={scene} />;
        })}
      </div>
      <Button onClick={startNewScene} className="w-full max-w-sm">
        New Scene
      </Button>
    </ScreenShell>
  );
}
