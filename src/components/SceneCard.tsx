import type { Scene } from '../domain/types';

export function SceneCard({ scene, onClick }: { scene: Scene; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface hover:bg-surface-2 border border-hairline/10 hover:border-gold/30 rounded-lg p-5 transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] tracking-[0.18em] uppercase text-gold-light/80 font-semibold">{scene.genre}</div>
        <div className="text-[11px] tracking-[0.1em] uppercase text-ink-dim font-semibold shrink-0">
          {scene.durationSeconds} sec
        </div>
      </div>
      <div className="font-display font-bold text-xl mt-1.5">{scene.title}</div>
      <div className="text-ink-dim text-sm mt-2 leading-relaxed italic">&ldquo;{scene.hook ?? scene.premise}&rdquo;</div>
      <div className="mt-4 inline-flex items-center gap-1 text-gold-light text-xs font-semibold uppercase tracking-[0.1em]">
        Play This
        <span aria-hidden="true">&rsaquo;</span>
      </div>
    </button>
  );
}
