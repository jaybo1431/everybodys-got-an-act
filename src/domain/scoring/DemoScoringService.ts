import type { Take, Score } from '../types';
import type { ScoringService, ScoringContext } from './ScoringService';

const CATEGORIES = [
  'Commitment',
  'Comedic Timing',
  'Line Accuracy',
  'Drama Factor',
  'Chaos Energy',
  'Stage Presence',
  'Improv Bonus',
  'Vibes',
];

const TAGLINES = [
  'Oscar-worthy chaos',
  'Needs more jazz hands',
  'Certified scene stealer',
  'Bold choices, no regrets',
  'Main character energy',
  'Somebody call their agent',
  'A little wooden, a lot iconic',
  'The judges are confused (in a good way)',
];

function pickRandom<T>(items: T[], count: number): T[] {
  const pool = [...items];
  const picked: T[] = [];
  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

/**
 * Playful, purely local scoring for the MVP. Deliberately dumb:
 * random breakdown categories, random-ish values. Swap this class
 * out for an AIScoringService later — the ScoringService interface
 * doesn't change.
 */
export class DemoScoringService implements ScoringService {
  async scoreTake(take: Take, _context: ScoringContext): Promise<Score> {
    const breakdown = pickRandom(CATEGORIES, 3).map((label) => ({
      label,
      value: Math.round((Math.random() * 6 + 4) * 10) / 10,
    }));
    const average = breakdown.reduce((sum, b) => sum + b.value, 0) / breakdown.length;

    return {
      id: crypto.randomUUID(),
      takeId: take.id,
      overall: Math.min(100, Math.round(average * 10)),
      breakdown,
      tagline: TAGLINES[Math.floor(Math.random() * TAGLINES.length)],
      scoredAt: Date.now(),
      method: 'demo',
    };
  }
}
