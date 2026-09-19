import { useState } from 'react';
import { Button } from '../../components/Button';
import { ScreenShell } from '../../components/ScreenShell';

/**
 * The first real choice in the app. One obvious primary action — Play
 * — and nothing else competing for attention. Group/pass-the-phone
 * play (the previous primary flow) is still fully implemented
 * (see PlayFlow.tsx's genre-select/pass-phone/results/playback
 * phases) but deliberately not wired to a working entry point here
 * yet — it's a later mode, not a deleted one.
 */
export function HomeScreen({ onPlay }: { onPlay: () => void }) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <ScreenShell>
      <div className="flex-1" />
      <div className="text-center">
        <h1 className="font-display font-extrabold text-3xl tracking-tight">Everyone&apos;s Got An Act</h1>
        <p className="text-ink-dim mt-2 text-sm">One scene. One partner. Your take.</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full max-w-xs">
        <Button onClick={onPlay} className="w-full text-lg">
          🎬 Play
        </Button>
        <Button variant="surface" onClick={() => setShowComingSoon(true)} className="w-full">
          👥 Play Together
        </Button>
      </div>
      <div className="text-ink-dim/60 text-xs">No accounts. No uploads. Just you and the scene.</div>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-6 pb-10 sm:pb-6">
          <div className="bg-surface border border-hairline/10 rounded-lg p-6 w-full max-w-sm text-center shadow-elevated">
            <div className="font-display font-bold text-xl">Coming Soon</div>
            <p className="text-ink-dim text-sm mt-2">
              Pass-the-phone group play is on the way. Tonight it&apos;s just you and your scene partner.
            </p>
            <Button variant="surface" onClick={() => setShowComingSoon(false)} className="w-full mt-5">
              Got it
            </Button>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
