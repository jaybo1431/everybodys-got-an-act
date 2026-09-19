import { describe, expect, it } from 'vitest';
import type { Scene } from './types';
import {
  getAudioAssetIdForLine,
  getCharacterById,
  getCharacters,
  getDialogueForPlayer,
  getNextDialogueLine,
  getOrderedDialogue,
  getPartnerDialogue,
  isPartnerLine,
  isPlayerLine,
} from './dialogue';
import { SCENES } from './sceneCatalog';

// Deliberately stored out of array order so tests prove the helpers
// sort by the `order` field rather than trusting array position.
const fixtureScene: Scene = {
  id: 'fixture-scene',
  title: 'Fixture Scene',
  genre: 'drama',
  premise: 'A two-character test fixture.',
  durationSeconds: 30,
  characters: [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
  ],
  dialogueLines: [
    { id: 'l3', characterId: 'a', text: 'Third line, by order.', order: 3 },
    { id: 'l1', characterId: 'a', text: 'First line.', order: 1 },
    { id: 'l4', characterId: 'b', text: 'Fourth line.', order: 4 },
    { id: 'l2', characterId: 'b', text: 'Second line.', order: 2 },
  ],
  instructions: 'Test fixture — no performance notes.',
};

describe('dialogue helpers (fixture scene)', () => {
  it('1. a scene has two characters', () => {
    expect(getCharacters(fixtureScene)).toHaveLength(2);
  });

  it('2. dialogue order is preserved regardless of array position', () => {
    const ordered = getOrderedDialogue(fixtureScene);
    expect(ordered.map((l) => l.id)).toEqual(['l1', 'l2', 'l3', 'l4']);
    expect(ordered.map((l) => l.order)).toEqual([1, 2, 3, 4]);
  });

  it('3. player lines are correctly identified', () => {
    const playerLines = getDialogueForPlayer(fixtureScene, 'a');
    expect(playerLines.map((l) => l.id)).toEqual(['l1', 'l3']);
    playerLines.forEach((line) => expect(isPlayerLine(line, 'a')).toBe(true));
  });

  it('4. partner lines are correctly identified', () => {
    const partnerLines = getPartnerDialogue(fixtureScene, 'a');
    expect(partnerLines.map((l) => l.id)).toEqual(['l2', 'l4']);
    partnerLines.forEach((line) => expect(isPartnerLine(line, 'a')).toBe(true));
  });

  it('5. the same scene works when the other character is selected as the player', () => {
    // Swap which character is "the player" and every classification flips accordingly.
    expect(getDialogueForPlayer(fixtureScene, 'b').map((l) => l.id)).toEqual(['l2', 'l4']);
    expect(getPartnerDialogue(fixtureScene, 'b').map((l) => l.id)).toEqual(['l1', 'l3']);
  });

  it('6. no line is incorrectly classified — player/partner are mutually exclusive and exhaustive', () => {
    for (const playerCharacterId of ['a', 'b']) {
      for (const line of getOrderedDialogue(fixtureScene)) {
        expect(isPlayerLine(line, playerCharacterId)).toBe(!isPartnerLine(line, playerCharacterId));
      }
    }
  });

  it('getNextDialogueLine returns the following line by position, and undefined past the end', () => {
    expect(getNextDialogueLine(fixtureScene, 0)?.id).toBe('l2');
    expect(getNextDialogueLine(fixtureScene, 2)?.id).toBe('l4');
    expect(getNextDialogueLine(fixtureScene, 3)).toBeUndefined();
  });

  it('getCharacterById finds a known character and returns undefined for an unknown id', () => {
    expect(getCharacterById(fixtureScene, 'a')?.name).toBe('Alpha');
    expect(getCharacterById(fixtureScene, 'nobody')).toBeUndefined();
  });

  it('getAudioAssetIdForLine is undefined until a future phase attaches audio', () => {
    expect(getAudioAssetIdForLine(fixtureScene.dialogueLines[0])).toBeUndefined();
  });
});

describe('scene catalog content', () => {
  SCENES.forEach((scene) => {
    describe(`"${scene.title}" (${scene.genre})`, () => {
      it('has exactly two characters with unique ids', () => {
        expect(scene.characters).toHaveLength(2);
        const ids = scene.characters.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('has 6-10 dialogue lines', () => {
        expect(scene.dialogueLines.length).toBeGreaterThanOrEqual(6);
        expect(scene.dialogueLines.length).toBeLessThanOrEqual(10);
      });

      it('every line belongs to a character that actually exists in the scene', () => {
        const characterIds = new Set(scene.characters.map((c) => c.id));
        for (const line of scene.dialogueLines) {
          expect(characterIds.has(line.characterId)).toBe(true);
        }
      });

      it('order values are unique and strictly increasing once sorted', () => {
        const orders = getOrderedDialogue(scene).map((l) => l.order);
        expect(orders).toEqual([...orders].sort((a, b) => a - b));
        expect(new Set(orders).size).toBe(orders.length);
      });

      it('works with either character as the player, covering every line exactly once', () => {
        const [characterA, characterB] = scene.characters;
        const linesAsPlayerA = getDialogueForPlayer(scene, characterA.id);
        const linesAsPartnerOfA = getPartnerDialogue(scene, characterA.id);

        expect(linesAsPlayerA.length + linesAsPartnerOfA.length).toBe(scene.dialogueLines.length);
        // Swapping the player role should exactly swap the two sets.
        expect(getDialogueForPlayer(scene, characterB.id)).toEqual(linesAsPartnerOfA);
        expect(getPartnerDialogue(scene, characterB.id)).toEqual(linesAsPlayerA);
      });
    });
  });
});
