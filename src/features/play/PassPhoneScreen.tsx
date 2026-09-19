import { usePlaySession } from '../../state/PlaySessionContext';
import { ScreenShell } from '../../components/ScreenShell';
import { Button } from '../../components/Button';

export function PassPhoneScreen() {
  const { continueSameScene, finishSession, scene } = usePlaySession();

  return (
    <ScreenShell className="items-center justify-center text-center gap-6">
      <h2 className="text-3xl font-black">Pass the phone</h2>
      <p className="text-white/60 max-w-xs">
        Hand it to the next person to try &quot;{scene?.title}&quot; — or wrap up and see the results.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={continueSameScene}>Next player, same scene</Button>
        <Button variant="secondary" onClick={finishSession}>
          Finish &amp; see results
        </Button>
      </div>
    </ScreenShell>
  );
}
