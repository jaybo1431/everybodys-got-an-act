import type { Scene } from '../domain/types';
import { getOrderedDialogue } from '../domain/dialogue';

export function ScriptView({ scene }: { scene: Scene }) {
  return (
    <div className="space-y-4">
      {getOrderedDialogue(scene).map((line) => {
        const speaker = scene.characters.find((c) => c.id === line.characterId);
        return (
          <div key={line.id}>
            <div className="text-gold-light text-xs font-semibold uppercase tracking-[0.14em]">{speaker?.name ?? 'Narrator'}</div>
            <div className="text-ink text-[15px] leading-relaxed mt-0.5">{line.text}</div>
          </div>
        );
      })}
    </div>
  );
}
