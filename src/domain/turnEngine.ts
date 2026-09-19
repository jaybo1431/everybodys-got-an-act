import type { DialogueLine, Scene } from './types';
import { getOrderedDialogue, isPlayerLine } from './dialogue';

/**
 * Turn-based scene playback/recording orchestration — the pure part
 * only. No React, no audio playback, no MediaRecorder: this file
 * just answers "what kind of turn is at this position, and what
 * comes next", deterministically, given a scene and who the player
 * is. The actual driving (playing audio, running the camera) lives
 * in the ActingScreen feature and the media/* hooks.
 *
 * Dialogue is never assumed to alternate — a turn is just "whatever
 * the line at this position belongs to". Consecutive partner lines
 * or consecutive player lines are simply consecutive positions with
 * the same classification.
 */

export type TurnKind = 'PARTNER_LINE' | 'PLAYER_LINE' | 'END_OF_SCENE';

export interface Turn {
  kind: TurnKind;
  /** Position in the scene's ordered dialogue (0-based). Equals the scene's total line count once it has ended. */
  index: number;
  /** Present for PARTNER_LINE and PLAYER_LINE; absent for END_OF_SCENE. */
  line?: DialogueLine;
}

function classify(line: DialogueLine, playerCharacterId: string): 'PARTNER_LINE' | 'PLAYER_LINE' {
  return isPlayerLine(line, playerCharacterId) ? 'PLAYER_LINE' : 'PARTNER_LINE';
}

/** The turn at a given position in the scene's ordered dialogue. */
export function getTurnAt(scene: Scene, playerCharacterId: string, index: number): Turn {
  const ordered = getOrderedDialogue(scene);
  const line = ordered[index];
  if (!line) return { kind: 'END_OF_SCENE', index: ordered.length };
  return { kind: classify(line, playerCharacterId), index, line };
}

export function getFirstTurn(scene: Scene, playerCharacterId: string): Turn {
  return getTurnAt(scene, playerCharacterId, 0);
}

/**
 * Moves to the next turn — but only once the current one has
 * actually resolved (partner audio finished playing, or the player
 * pressed Done/Finish Line). Passing `resolved: false` intentionally
 * returns the SAME turn unchanged. This is what stops the engine
 * from racing ahead while partner audio is still playing or a player
 * is still recording — the caller can only advance by explicitly
 * confirming resolution, not by calling this repeatedly.
 */
export function advanceTurn(scene: Scene, playerCharacterId: string, currentIndex: number, resolved: boolean): Turn {
  if (!resolved) return getTurnAt(scene, playerCharacterId, currentIndex);
  return getTurnAt(scene, playerCharacterId, currentIndex + 1);
}

export function isEndOfScene(turn: Turn): boolean {
  return turn.kind === 'END_OF_SCENE';
}

export function getTotalLineCount(scene: Scene): number {
  return scene.dialogueLines.length;
}

/**
 * Safe accessor for a partner turn's audio id. Returns undefined for
 * a player line, end-of-scene, or a partner line that simply has no
 * audio attached — callers must treat "no audio" as a normal,
 * handleable case, never a crash.
 */
export function getAudioAssetIdForTurn(turn: Turn): string | undefined {
  if (turn.kind !== 'PARTNER_LINE' || !turn.line) return undefined;
  return turn.line.audioAssetId;
}
