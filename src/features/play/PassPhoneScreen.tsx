import { useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

type Step = 'name' | 'ready';

export function PassPhoneScreen() {
  const { scene, startNextActor, finishSession } = usePlaySession();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');

  if (step === 'ready') {
    return (
      <ScreenShell className="items-center justify-center text-center gap-6">
        <h2 className="font-display font-extrabold text-3xl">Ready for {name}?</h2>
        <p className="text-ink-dim max-w-xs text-sm">
          Same scene, same script: &ldquo;{scene?.title}&rdquo;. They won&apos;t see anyone else&apos;s take first.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={() => startNextActor(name)}>Next Actor</Button>
          <Button variant="surface" onClick={finishSession}>
            Finish Session
          </Button>
        </div>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell className="items-center justify-center text-center gap-6">
      <div>
        <h2 className="font-display font-extrabold text-3xl">Your Take Is In.</h2>
        <p className="text-gold-light font-semibold mt-1 tracking-wide">Pass the phone.</p>
      </div>
      <p className="text-ink-dim max-w-xs text-sm">Who&apos;s next?</p>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        maxLength={24}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) setStep('ready');
        }}
        className="bg-surface border border-hairline/10 rounded-pill px-6 py-4 text-center text-lg w-full max-w-xs outline-none focus:border-gold/50"
      />
      <Button onClick={() => setStep('ready')} disabled={!name.trim()} className="w-full max-w-xs">
        Continue
      </Button>
    </ScreenShell>
  );
}
