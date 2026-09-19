import { Button } from '../../components/Button';
import { ScreenShell } from '../../components/ScreenShell';

export function HomeScreen({ onPlayTogether }: { onPlayTogether: () => void }) {
  return (
    <ScreenShell>
      <div className="flex-1" />
      <div className="text-center">
        <h1 className="text-3xl font-black">Everybody&apos;s Got An Act</h1>
        <p className="text-white/60 mt-2">A local, pass-the-phone acting game.</p>
      </div>
      <div className="flex-1 flex items-center">
        <Button onClick={onPlayTogether}>Play Together</Button>
      </div>
      <div className="text-white/30 text-xs">No accounts. No uploads. Just your group.</div>
    </ScreenShell>
  );
}
