import type { Character, DialogueLine, Scene } from './types';

/**
 * Pure helpers over Scene/DialogueLine. No React, no audio playback,
 * no MediaRecorder — just answering questions about who says what,
 * in what order, and to whom a line belongs. Deterministic and
 * side-effect free, so they're trivial to unit test and safe to call
 * from any layer (UI, future audio playback, future AI generation).
 *
 * "Player" and "partner" are never hard-coded character IDs — every
 * function here takes the player's character ID as a parameter, so
 * the same scene works no matter which character the participant is
 * performing.
 */

/** The scene's dialogue, sorted by `order` (never assumes array order). */
export function getOrderedDialogue(scene: Scene): DialogueLine[] {
  return [...scene.dialogueLines].sort((a, b) => a.order - b.order);
}

/** Every character who appears in this scene. */
export function getCharacters(scene: Scene): Character[] {
  return scene.characters;
}

export function getCharacterById(scene: Scene, characterId: string): Character | undefined {
  return scene.characters.find((c) => c.id === characterId);
}

/** True if this line belongs to the character the participant is performing. */
export function isPlayerLine(line: DialogueLine, playerCharacterId: string): boolean {
  return line.characterId === playerCharacterId;
}

/** True if this line belongs to any character other than the player's. */
export function isPartnerLine(line: DialogueLine, playerCharacterId: string): boolean {
  return line.characterId !== playerCharacterId;
}

/** The player's own lines, in scene order. */
export function getDialogueForPlayer(scene: Scene, playerCharacterId: string): DialogueLine[] {
  return getOrderedDialogue(scene).filter((line) => isPlayerLine(line, playerCharacterId));
}

/** Every other character's lines, in scene order. */
export function getPartnerDialogue(scene: Scene, playerCharacterId: string): DialogueLine[] {
  return getOrderedDialogue(scene).filter((line) => isPartnerLine(line, playerCharacterId));
}

/**
 * The line immediately after `currentLineIndex` in scene order.
 * `currentLineIndex` is a position in the ordered dialogue array
 * (0-based), not a DialogueLine's `order` value. Returns undefined
 * once the sequence is exhausted.
 */
export function getNextDialogueLine(scene: Scene, currentLineIndex: number): DialogueLine | undefined {
  return getOrderedDialogue(scene)[currentLineIndex + 1];
}

/** The pre-recorded audio asset id for a line, if one has been attached. Not yet populated or played anywhere. */
export function getAudioAssetIdForLine(line: DialogueLine): string | undefined {
  return line.audioAssetId;
}
