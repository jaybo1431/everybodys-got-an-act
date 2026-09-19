import { useEffect, useMemo } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

export function ReviewScreen() {
  const { pendingBlob, retake, acceptTake, isSaving } = usePlaySession();
  const url = useMemo(() => (pendingBlob ? URL.createObjectURL(pendingBlob) : null), [pendingBlob]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  if (!url) return null;

  return (
    <ScreenShell className="p-0">
      <video src={url} controls playsInline className="w-full flex-1 object-cover bg-black" />
      <div className="flex gap-4 py-6 w-full max-w-sm justify-center">
        <Button variant="ghost" onClick={retake} disabled={isSaving}>
          Retake
        </Button>
        <Button onClick={acceptTake} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Accept take'}
        </Button>
      </div>
    </ScreenShell>
  );
}
