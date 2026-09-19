import type { Score } from '../domain/types';

function ScoreRing({ value }: { value: number }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="relative w-40 h-40">
      <svg viewBox="0 0 144 144" className="w-40 h-40 -rotate-90">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="rgb(var(--color-surface-2))" strokeWidth="10" />
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="rgb(var(--color-gold))"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-extrabold text-shimmer-gold">{value}</span>
        <span className="text-[10px] tracking-[0.18em] uppercase text-ink-dim mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-ink-dim">{label}</span>
        <span className="text-ink font-semibold">{value}</span>
      </div>
      <div className="h-1.5 rounded-pill bg-surface-2 overflow-hidden">
        <div className="h-full rounded-pill bg-gold" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ScoreCard({ score }: { score: Score }) {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="text-[11px] tracking-[0.2em] uppercase text-gold-light/80 font-semibold">Playful MVP Score</div>
        <div className="text-ink-dim text-xs mt-1">Just for fun — not real performance analysis.</div>
      </div>
      <ScoreRing value={score.overall} />
      <div className="w-full max-w-xs space-y-3">
        {score.breakdown.map((b) => (
          <BreakdownBar key={b.label} label={b.label} value={b.value} />
        ))}
      </div>
      <p className="text-ink-dim text-sm text-center italic max-w-xs">&ldquo;{score.tagline}&rdquo;</p>
    </div>
  );
}
