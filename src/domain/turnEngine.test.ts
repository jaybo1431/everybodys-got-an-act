import { describe, expect, it } from 'vitest';
import type { Scene } from './types';
import {
  advanceTurn,
  getAudioAssetIdForTurn,
  getFirstTurn,
  getTotalLineCount,
  getTurnAt,
  isEndOfScene,
} from './turnEngine';
import { createTakeSegment } from './takeSegments';
import { SCENES } from './sceneCatalog';

const twoCharacterScene: Scene = {
  id: 'fixture-alternating',
  title: 'Fixture — Alternating',
  genre: 'drama',
  premise: 'Alternating two-character fixture.',
  durationSeconds: 20,
  characters: [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
  ],
  dialogueLines: [
    { id: 'l1', characterId: 'a', text: 'Line one.', order: 1, audioAssetId: 'audio-l1' },
    { id: 'l2', characterId: 'b', text: 'Line two.', order: 2, audioAssetId: 'audio-l2' },
    { id: 'l3', characterId: 'a', text: 'Line three.', order: 3, audioAssetId: 'audio-l3' },
    { id: 'l4', characterId: 'b', text: 'Line four.', order: 4, audioAssetId: 'audio-l4' },
  ],
  instructions: '',
};

const consecutivePartnerScene: Scene = {
  ...twoCharacterScene,
  id: 'fixture-consecutive-partner',
  dialogueLines: [
    { id: 'p1', characterId: 'b', text: 'Partner opens.', order: 1 }, // no audioAssetId — tests missing-audio handling
    { id: 'p2', characterId: 'b', text: 'Partner continues.', order: 2, audioAssetId: 'audio-p2' },
    { id: 'p3', characterId: 'a', text: 'Player replies.', order: 3 },
  ],
};

const consecutivePlayerScene: Scene = {
  ...twoCharacterScene,
  id: 'fixture-consecutive-player',
  dialogueLines: [
    { id: 'q1', characterId: 'a', text: 'Player line one.', order: 1 },
    { id: 'q2', characterId: 'a', text: 'Player line two.', order: 2 },
    { id: 'q3', characterId: 'b', text: 'Partner replies.', order: 3, audioAssetId: 'audio-q3' },
  ],
};

describe('turn engine', () => {
  it('1. a partner line is classified as a partner turn', () => {
    const turn = getTurnAt(twoCharacterScene, 'a', 1); // line 2 belongs to 'b'
    expect(turn.kind).toBe('PARTNER_LINE');
    expect(turn.line?.id).toBe('l2');
  });

  it('2. a player line is classified as a player turn', () => {
    const turn = getTurnAt(twoCharacterScene, 'a', 0); // line 1 belongs to 'a'
    expect(turn.kind).toBe('PLAYER_LINE');
    expect(turn.line?.id).toBe('l1');
  });

  it('3. a partner turn resolves before the next turn — advanceTurn will not move on unresolved', () => {
    const stillWaiting = advanceTurn(twoCharacterScene, 'a', 1, false);
    expect(stillWaiting.index).toBe(1);
    expect(stillWaiting.line?.id).toBe('l2');

    const resolved = advanceTurn(twoCharacterScene, 'a', 1, true);
    expect(resolved.index).toBe(2);
    expect(resolved.line?.id).toBe('l3');
  });

  it('4. player role swap works — the same scene reclassifies every turn', () => {
    const asPlayerA = getTurnAt(twoCharacterScene, 'a', 1);
    const asPlayerB = getTurnAt(twoCharacterScene, 'b', 1);
    expect(asPlayerA.kind).toBe('PARTNER_LINE');
    expect(asPlayerB.kind).toBe('PLAYER_LINE');
    expect(asPlayerA.line?.id).toBe(asPlayerB.line?.id); // same underlying line either way
  });

  it('5. consecutive partner lines are supported without skipping or merging', () => {
    const first = getTurnAt(consecutivePartnerScene, 'a', 0);
    const second = getTurnAt(consecutivePartnerScene, 'a', 1);
    const third = getTurnAt(consecutivePartnerScene, 'a', 2);
    expect(first.kind).toBe('PARTNER_LINE');
    expect(second.kind).toBe('PARTNER_LINE');
    expect(third.kind).toBe('PLAYER_LINE');
    expect([first.line?.id, second.line?.id, third.line?.id]).toEqual(['p1', 'p2', 'p3']);
  });

  it('6. consecutive player lines are supported without skipping or merging', () => {
    const first = getTurnAt(consecutivePlayerScene, 'a', 0);
    const second = getTurnAt(consecutivePlayerScene, 'a', 1);
    const third = getTurnAt(consecutivePlayerScene, 'a', 2);
    expect(first.kind).toBe('PLAYER_LINE');
    expect(second.kind).toBe('PLAYER_LINE');
    expect(third.kind).toBe('PARTNER_LINE');
    expect([first.line?.id, second.line?.id, third.line?.id]).toEqual(['q1', 'q2', 'q3']);
  });

  it('7. end-of-scene is detected correctly, exactly at the line count and not before', () => {
    const total = getTotalLineCount(twoCharacterScene);
    const lastRealTurn = getTurnAt(twoCharacterScene, 'a', total - 1);
    const pastTheEnd = getTurnAt(twoCharacterScene, 'a', total);
    expect(isEndOfScene(lastRealTurn)).toBe(false);
    expect(isEndOfScene(pastTheEnd)).toBe(true);
    expect(pastTheEnd.line).toBeUndefined();
  });

  it('8. a missing audioAssetId is handled safely, never throws', () => {
    const turnWithoutAudio = getTurnAt(consecutivePartnerScene, 'a', 0); // 'p1' has no audioAssetId
    expect(() => getAudioAssetIdForTurn(turnWithoutAudio)).not.toThrow();
    expect(getAudioAssetIdForTurn(turnWithoutAudio)).toBeUndefined();

    const turnWithAudio = getTurnAt(consecutivePartnerScene, 'a', 1); // 'p2' has one
    expect(getAudioAssetIdForTurn(turnWithAudio)).toBe('audio-p2');

    // A player line and end-of-scene are also safe, always undefined.
    const playerTurn = getTurnAt(consecutivePartnerScene, 'a', 2);
    expect(getAudioAssetIdForTurn(playerTurn)).toBeUndefined();
    const endTurn = getTurnAt(consecutivePartnerScene, 'a', 99);
    expect(getAudioAssetIdForTurn(endTurn)).toBeUndefined();
  });

  it('9. a line recording can be associated with its dialogueLine id', () => {
    const line = twoCharacterScene.dialogueLines[0];
    const segment = createTakeSegment(line, 'media-asset-123', 4200);
    expect(segment.lineId).toBe(line.id);
    expect(segment.characterId).toBe(line.characterId);
    expect(segment.mediaAssetId).toBe('media-asset-123');
    expect(segment.order).toBe(line.order);
  });

  it('getFirstTurn matches getTurnAt(scene, player, 0)', () => {
    expect(getFirstTurn(twoCharacterScene, 'a')).toEqual(getTurnAt(twoCharacterScene, 'a', 0));
  });
});

describe('turn engine against the real scene catalog', () => {
  SCENES.forEach((scene) => {
    it(`"${scene.title}" — every line has an audioAssetId, walking the whole scene never throws, and it ends correctly`, () => {
      for (const line of scene.dialogueLines) {
        expect(line.audioAssetId).toBeTruthy();
      }

      const [playerCharacter] = scene.characters;
      let index = 0;
      let turn = getFirstTurn(scene, playerCharacter.id);
      let guard = 0;
      while (!isEndOfScene(turn) && guard < 100) {
        turn = advanceTurn(scene, playerCharacter.id, index, true);
        index = turn.index;
        guard += 1;
      }
      expect(isEndOfScene(turn)).toBe(true);
      expect(turn.index).toBe(getTotalLineCount(scene));
    });
  });
});
