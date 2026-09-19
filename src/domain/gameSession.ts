import type { GameSession, GamePhase, Participant, Genre } from './types';

/**
 * Pure session logic. No React, no storage — just how a GameSession's
 * state is allowed to change. This is what makes the game session
 * testable in isolation and reusable if the UI layer ever changes.
 */

export function createSession(): GameSession {
  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    participants: [],
    takeIds: [],
    entryMode: 'solo',
    // The one-player MVP is the default entry point: straight to
    // "choose a scene", no genre step. The group flow still starts
    // itself at 'genre-select' explicitly (see GenreSelectScreen's
    // own entry in PlayFlow) — that phase is preserved, just not the
    // default for a freshly created session.
    phase: 'scene-select',
  };
}

export type GameAction =
  | { type: 'SELECT_GENRE'; genre: Genre }
  | { type: 'SELECT_SCENE'; sceneId: string }
  | { type: 'SELECT_CHARACTER'; characterId: string }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'BEGIN_PARTICIPANT_TURN'; participant: Participant; phase?: GamePhase }
  | { type: 'ADD_TAKE'; takeId: string }
  | { type: 'RESET_FOR_NEW_SCENE' }
  | { type: 'RESET_SESSION' };

export function gameSessionReducer(state: GameSession, action: GameAction): GameSession {
  switch (action.type) {
    case 'SELECT_GENRE':
      // The only place entryMode ever becomes 'group' — genre
      // selection only exists in the pass-the-phone flow.
      return { ...state, entryMode: 'group', selectedGenre: action.genre, phase: 'scene-select' };

    case 'SELECT_SCENE':
      // Character is chosen next, on its own screen ("Who Are You?")
      // — see SELECT_CHARACTER below. This action no longer defaults
      // or assumes a playerCharacterId.
      return { ...state, sceneId: action.sceneId, phase: 'character-select' };

    case 'SELECT_CHARACTER':
      return { ...state, playerCharacterId: action.characterId };

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'BEGIN_PARTICIPANT_TURN':
      return {
        ...state,
        participants: [...state.participants, action.participant],
        currentParticipantId: action.participant.id,
        // Defaults to 'scene-intro' — the pass-the-phone group flow's
        // existing, unchanged behavior for every actor after the
        // first. The one-player flow explicitly passes 'demo' instead
        // (see PlaySessionContext.selectCharacter).
        phase: action.phase ?? 'scene-intro',
      };

    case 'ADD_TAKE':
      return { ...state, takeIds: [...state.takeIds, action.takeId], phase: 'score' };

    case 'RESET_FOR_NEW_SCENE':
      return {
        ...state,
        sceneId: undefined,
        playerCharacterId: undefined,
        selectedGenre: undefined,
        participants: [],
        takeIds: [],
        currentParticipantId: undefined,
        phase: 'scene-select',
      };

    case 'RESET_SESSION':
      return createSession();

    default:
      return state;
  }
}
