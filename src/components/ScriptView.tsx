import type { Scene } from '../domain/types';

export function ScriptView({ scene }: { scene: Scene }) {
  return (
    <div className="space-y-4">
      {scene.script.lines.map((line, i) => {
        const speaker = scene.characters.find((c) => c.id === line.characterId);
        return (
          <div key={i}>
            <div className="text-gold-light text-xs font-semibold uppercase tracking-[0.14em]">{speaker?.name ?? 'Narrator'}</div>
            {line.direction && <div className="text-ink-dim text-xs italic mt-0.5">({line.direction})</div>}
            <div className="text-ink text-[15px] leading-relaxed mt-0.5">{line.line}</div>
          </div>
        );
      })}
    </div>
  );
}
