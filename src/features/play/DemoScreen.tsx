import { useEffect, useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/BackButton';

interface DemoBeat {
  speaker: 'partner' | 'you';
  text: string;
}

/**
 * A short, fixed, scene-agnostic script that teaches the LISTEN ->
 * YOUR TURN rhythm by demonstrating it, not explaining it — the same
 * beats every time, regardless of which real scene the player picked
 * (this is about the mechanic, not a preview of their actual scene).
 * No audio, no recording: see this screen's own doc comment.
 */
const DEMO_BEATS: DemoBeat[] = [
  { speaker: 'partner', text: 'Did you actually send that?' },
  { speaker: 'you', text: 'I might have.' },
  { speaker: 'partner', text: 'You WHAT?' },
  { speaker: 'you', text: "Don't make it worse." },
];

const BEAT_INTERVAL_MS = 1600;

/**
 * The "tiny interactive how-it-works demo" — plays out a tiny fake
 * exchange, one line at a time, so the player learns LISTEN -> ACT ->
 * LISTEN -> ACT by watching it happen rather than reading a rulebook.
 * No recording happens here (per spec); tapping the primary button is
 * always available, even before the sequence finishes animating, so
 * nobody is ever stuck waiting on it.
 */
export function DemoScreen() {
  const { goToPhase, goBack } = usePlaySession();
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= DEMO_BEATS.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), BEAT_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <ScreenShell className="items-stretch">
      <div className="w-full">
        <BackButton onClick={goBack} label="Character" />
        <h2 className="font-display font-bold text-2xl mt-4">How It Works</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4 w-full max-w-sm mx-auto py-4">
        {DEMO_BEATS.slice(0, visibleCount).map((beat, i) => (
          <div key={i} className={`flex flex-col ${beat.speaker === 'you' ? 'items-end' : 'items-start'}`}>
            <div className="text-[10px] tracking-[0.2em] uppercase text-gold-light/80 font-semibold mb-1">
              {beat.speaker === 'you' ? 'Your Turn' : 'Partner'}
            </div>
            <div
              className={`rounded-lg px-4 py-3 max-w-[85%] font-display font-semibold ${
                beat.speaker === 'you' ? 'bg-gold text-bg' : 'bg-surface border border-hairline/10 text-ink'
              }`}
            >
              &ldquo;{beat.text}&rdquo;
            </div>
          </div>
        ))}
      </div>

      <Button onClick={() => goToPhase('camera-permission')} className="w-full max-w-sm">
        Got It — Let&apos;s Play
      </Button>
    </ScreenShell>
  );
}
