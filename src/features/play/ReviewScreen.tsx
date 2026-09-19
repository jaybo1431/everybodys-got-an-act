import { useEffect, useMemo } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import { VideoReview } from '../../components/VideoReview';

export function ReviewScreen() {
  const { pendingBlob, retake, acceptTake, isSaving } = usePlaySession();
  const url = useMemo(() => (pendingBlob ? URL.createObjectURL(pendingBlob) : null), [pendingBlob]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  if (!url) return null;

  return <VideoReview src={url} isSaving={isSaving} onRetake={retake} onAccept={acceptTake} />;
}
