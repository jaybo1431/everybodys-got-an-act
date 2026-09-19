export function SceneProgress({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[10px] tracking-[0.22em] uppercase text-ink-dim">Scene</div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition ${
              i < current ? 'bg-gold' : i === current ? 'bg-gold-light' : 'bg-ink/15'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
