import { useState } from 'react';
import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

export function ParticipantNameScreen() {
  const { currentParticipant, nameParticipant } = usePlaySession();
  const [name, setName] = useState(currentParticipant?.name ?? '');

  return (
    <ScreenShell className="items-center justify-center text-center gap-6">
      <h2 className="text-2xl font-bold">Nice take! Who was that?</h2>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="bg-white/10 rounded-full px-6 py-3 text-center text-lg w-full max-w-xs outline-none focus:ring-2 focus:ring-fuchsia-500"
        maxLength={24}
      />
      <Button onClick={() => nameParticipant(name)} disabled={!name.trim()}>
        Save
      </Button>
    </ScreenShell>
  );
}
