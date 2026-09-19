import { Button } from '../../components/Button';

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="screen-height w-full flex flex-col items-center justify-center gap-10 bg-bg text-ink text-center px-6 safe-top safe-bottom">
      <div>
        <h1 className="font-display leading-[0.95]">
          <span className="block text-4xl italic font-semibold text-shimmer-gold">Everyone&apos;s</span>
          <span className="block text-5xl font-extrabold tracking-tight mt-1">GOT AN ACT</span>
        </h1>
        <p className="text-ink-dim mt-5 text-sm tracking-wide">One scene. One partner. Your take.</p>
      </div>
      <Button onClick={onEnter} className="w-full max-w-xs">
        Let&apos;s Play
      </Button>
    </div>
  );
}
