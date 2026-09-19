import type { Take, Score } from '../types';

export interface ScoringContext {
  takeNumber: number;
}

/**
 * The UI never knows how a score was calculated — it just calls
 * scoreTake() and gets a Score back. Tonight that's a playful demo
 * implementation; later it could be an AI performance analysis
 * service, swapped in without touching a single screen.
 */
export interface ScoringService {
  scoreTake(take: Take, context: ScoringContext): Promise<Score>;
}
