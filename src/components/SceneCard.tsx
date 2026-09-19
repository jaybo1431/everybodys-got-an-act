import type { Scene } from '../domain/types';

export function SceneCard({ scene, onClick }: { scene: Scene; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface hover:bg-surface-2 border border-hairline/10 hover:border-gold/30 rounded-lg p-5 transition"
    >
      <div className="text-[11px] tracking-[0.18em] uppercase text-gold-light/80 font-semibold">
        {scene.genre} · ~{scene.durationSeconds}s
      </div>
      <div className="font-display font-bold text-xl mt-1.5">{scene.title}</div>
      <div className="text-ink-dim text-sm mt-2 leading-relaxed">{scene.premise}</div>
      <div className="text-ink-dim text-xs mt-3">{scene.characters.length} characters</div>
    </button>
  );
}
