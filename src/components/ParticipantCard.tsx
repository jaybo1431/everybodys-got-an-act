interface ParticipantCardProps {
  rank: number;
  name: string;
  score: number;
  tagline?: string;
}

export function ParticipantCard({ rank, name, score, tagline }: ParticipantCardProps) {
  return (
    <div className="flex items-center gap-4 bg-surface border border-hairline/10 rounded-md px-4 py-3.5">
      <span
        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold font-display ${
          rank === 1 ? 'bg-gold text-bg' : 'bg-surface-2 text-ink-dim'
        }`}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-ink truncate">{name}</div>
        {tagline && <div className="text-ink-dim text-xs truncate mt-0.5">{tagline}</div>}
      </div>
      <div className="text-xl font-display font-extrabold text-shimmer-gold shrink-0">{score}</div>
    </div>
  );
}
