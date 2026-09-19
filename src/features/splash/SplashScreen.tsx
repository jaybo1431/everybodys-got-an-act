import { Button } from '../../components/Button';

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 bg-black text-white text-center px-6">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Everybody&apos;s Got An Act</h1>
        <p className="text-white/60 mt-2">Pass the phone. Steal the scene.</p>
      </div>
      <Button onClick={onEnter}>Enter</Button>
    </div>
  );
}
