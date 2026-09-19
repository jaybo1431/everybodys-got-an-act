import { describe, expect, it } from 'vitest';
import { createSession, gameSessionReducer } from './gameSession';

/**
 * The reducer that decides which flow a session is in and which
 * screen comes next — this is exactly what keeps the one-player MVP
 * flow and the preserved pass-the-phone group flow from stepping on
 * each other (see PlaySessionContext.selectCharacter's own doc
 * comment for the full reasoning this test suite locks in).
 */
describe('gameSessionReducer', () => {
  it('1. a freshly created session starts on scene-select in solo mode — no genre step by default', () => {
    const session = createSession();
    expect(session.phase).toBe('scene-select');
    expect(session.entryMode).toBe('solo');
    expect(session.selectedGenre).toBeUndefined();
  });

  it('2. SELECT_GENRE switches entryMode to group and moves to scene-select', () => {
    const session = createSession();
    const next = gameSessionReducer(session, { type: 'SELECT_GENRE', genre: 'comedy' });
    expect(next.entryMode).toBe('group');
    expect(next.selectedGenre).toBe('comedy');
    expect(next.phase).toBe('scene-select');
  });

  it('3. SELECT_SCENE moves to character-select without assuming a playerCharacterId', () => {
    const session = createSession();
    const next = gameSessionReducer(session, { type: 'SELECT_SCENE', sceneId: 'scene-1' });
    expect(next.phase).toBe('character-select');
    expect(next.sceneId).toBe('scene-1');
    expect(next.playerCharacterId).toBeUndefined();
  });

  it('4. SELECT_CHARACTER sets playerCharacterId and does not itself change phase', () => {
    const session = { ...createSession(), phase: 'character-select' as const };
    const next = gameSessionReducer(session, { type: 'SELECT_CHARACTER', characterId: 'jamie' });
    expect(next.playerCharacterId).toBe('jamie');
    expect(next.phase).toBe('character-select');
  });

  it('5. BEGIN_PARTICIPANT_TURN defaults to scene-intro when no phase is given — the group flow\'s exact, unchanged behavior', () => {
    const session = createSession();
    const next = gameSessionReducer(session, {
      type: 'BEGIN_PARTICIPANT_TURN',
      participant: { id: 'p1', name: 'You', joinedAt: 0 },
    });
    expect(next.phase).toBe('scene-intro');
    expect(next.currentParticipantId).toBe('p1');
    expect(next.participants).toHaveLength(1);
  });

  it('6. BEGIN_PARTICIPANT_TURN honors an explicit phase override — how the one-player flow reaches the demo instead', () => {
    const session = createSession();
    const next = gameSessionReducer(session, {
      type: 'BEGIN_PARTICIPANT_TURN',
      participant: { id: 'p1', name: 'You', joinedAt: 0 },
      phase: 'demo',
    });
    expect(next.phase).toBe('demo');
  });

  it('7. RESET_FOR_NEW_SCENE returns to scene-select and preserves entryMode across the reset', () => {
    const groupSession = gameSessionReducer(createSession(), { type: 'SELECT_GENRE', genre: 'drama' });
    const reset = gameSessionReducer(groupSession, { type: 'RESET_FOR_NEW_SCENE' });
    expect(reset.phase).toBe('scene-select');
    expect(reset.entryMode).toBe('group'); // still group — a mid-session "New Scene" must not silently become solo
    expect(reset.selectedGenre).toBeUndefined();
    expect(reset.sceneId).toBeUndefined();
    expect(reset.playerCharacterId).toBeUndefined();
    expect(reset.participants).toEqual([]);
  });

  it('8. RESET_SESSION creates an entirely fresh solo session, regardless of prior entryMode', () => {
    const groupSession = gameSessionReducer(createSession(), { type: 'SELECT_GENRE', genre: 'horror' });
    const reset = gameSessionReducer(groupSession, { type: 'RESET_SESSION' });
    expect(reset.phase).toBe('scene-select');
    expect(reset.entryMode).toBe('solo');
  });

  it('9. the full one-player path reaches "demo", never "scene-intro" or "script"', () => {
    let session = createSession();
    session = gameSessionReducer(session, { type: 'SELECT_SCENE', sceneId: 'scene-1' });
    session = gameSessionReducer(session, { type: 'SELECT_CHARACTER', characterId: 'jamie' });
    session = gameSessionReducer(session, {
      type: 'BEGIN_PARTICIPANT_TURN',
      participant: { id: 'p1', name: 'You', joinedAt: 0 },
      phase: 'demo',
    });
    expect(session.phase).toBe('demo');
  });
});
