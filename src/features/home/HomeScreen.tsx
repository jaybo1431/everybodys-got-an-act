import { useState } from 'react';
import { Button } from '../../components/Button';
import { ScreenShell } from '../../components/ScreenShell';

export function HomeScreen({ onPlayTogether }: { onPlayTogether: () => void }) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <ScreenShell>
      <div className="flex-1" />
      <div className="text-center">
        <h1 className="font-display font-extrabold text-3xl tracking-tight">Everyone&apos;s Got An Act</h1>
        <p className="text-ink-dim mt-2 text-sm">Same scene. Different people. Your take.</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full max-w-xs">
        <Button onClick={onPlayTogether} className="w-full">
          Play Together
        </Button>
        <Button variant="surface" onClick={() => setShowComingSoon(true)} className="w-full">
          Play Online
        </Button>
      </div>
      <div className="text-ink-dim/60 text-xs">No accounts. No uploads. Just your group.</div>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-6 pb-10 sm:pb-6">
          <div className="bg-surface border border-hairline/10 rounded-lg p-6 w-full max-w-sm text-center shadow-elevated">
            <div className="font-display font-bold text-xl">Coming Soon</div>
            <p className="text-ink-dim text-sm mt-2">
              Online battles are on the way. Tonight it&apos;s local, pass-the-phone only.
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
