import type { Character } from '../domain/types';

export function CharacterCard({ character, onClick }: { character: Character; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface hover:bg-surface-2 border border-hairline/10 hover:border-gold/30 rounded-lg p-5 transition"
    >
      <div className="font-display font-bold text-xl">{character.name}</div>
      {character.description && (
        <div className="text-ink-dim text-sm mt-1.5 italic">&ldquo;{character.description}&rdquo;</div>
      )}
    </button>
  );
}
