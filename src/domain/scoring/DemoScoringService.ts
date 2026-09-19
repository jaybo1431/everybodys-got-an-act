import type { Take, Score } from '../types';
import type { ScoringService, ScoringContext } from './ScoringService';

/** Fixed category order for the MVP score card. */
const CATEGORIES = ['Expression', 'Delivery', 'Timing', 'Confidence'];

const TAGLINES = [
  'Great emotion and strong delivery — nice control in the quiet moments.',
  'Bold choices early on. Push the ending even further next time.',
  'Confident throughout. A few more beats of stillness would land harder.',
  'Strong commitment — dial the energy up through the middle.',
  'Clean timing. Let the pauses do more of the work.',
  'Big swing, and it paid off. Keep that energy.',
  'Solid take — the reactions sold it more than the lines did.',
  'Great instincts. Trust the silence a little more.',
];

/**
 * Playful, purely local scoring for the MVP — not a real performance
 * analysis. Swap this class out for an AIScoringService later; the
 * ScoringService interface it implements doesn't change.
 */
export class DemoScoringService implements ScoringService {
  async scoreTake(take: Take, _context: ScoringContext): Promise<Score> {
    const breakdown = CATEGORIES.map((label) => ({
      label,
      value: Math.round(Math.random() * 30 + 65), // 65-95
    }));
    const overall = Math.round(breakdown.reduce((sum, b) => sum + b.value, 0) / breakdown.length);

    return {
      id: crypto.randomUUID(),
      takeId: take.id,
      overall,
      breakdown,
      tagline: TAGLINES[Math.floor(Math.random() * TAGLINES.length)],
      scoredAt: Date.now(),
      method: 'demo',
    };
  }
}
