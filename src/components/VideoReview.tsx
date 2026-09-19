import { Button } from './Button';
import { VideoPlayer } from './VideoPlayer';

interface VideoReviewProps {
  src: string;
  isSaving: boolean;
  onRetake: () => void;
  onAccept: () => void;
}

export function VideoReview({ src, isSaving, onRetake, onAccept }: VideoReviewProps) {
  return (
    <div className="screen-height w-full flex flex-col bg-bg safe-top safe-bottom">
      <VideoPlayer src={src} className="flex-1 w-full rounded-none border-0 object-cover" />
      <div className="flex gap-3 py-6 px-6 justify-center">
        <Button variant="ghost" onClick={onRetake} disabled={isSaving} className="flex-1 uppercase">
          Retake
        </Button>
        <Button onClick={onAccept} disabled={isSaving} className="flex-1 uppercase">
          {isSaving ? 'Saving…' : 'Use It'}
        </Button>
      </div>
    </div>
  );
}
