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
    phase: 'genre-select',
  };
}

export type GameAction =
  | { type: 'SELECT_GENRE'; genre: Genre }
  | { type: 'SELECT_SCENE'; sceneId: string }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'BEGIN_PARTICIPANT_TURN'; participant: Participant }
  | { type: 'ADD_TAKE'; takeId: string }
  | { type: 'RENAME_CURRENT_PARTICIPANT'; name: string }
  | { type: 'RESET_FOR_NEW_SCENE' }
  | { type: 'RESET_SESSION' };

export function gameSessionReducer(state: GameSession, action: GameAction): GameSession {
  switch (action.type) {
    case 'SELECT_GENRE':
      return { ...state, selectedGenre: action.genre, phase: 'scene-select' };

    case 'SELECT_SCENE':
      return { ...state, sceneId: action.sceneId, phase: 'script-present' };

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'BEGIN_PARTICIPANT_TURN':
      return {
        ...state,
        participants: [...state.participants, action.participant],
        currentParticipantId: action.participant.id,
        phase: 'script-present',
      };

    case 'ADD_TAKE':
      return { ...state, takeIds: [...state.takeIds, action.takeId], phase: 'participant-name' };

    case 'RENAME_CURRENT_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.id === state.currentParticipantId ? { ...p, name: action.name } : p,
        ),
        phase: 'pass-phone',
      };

    case 'RESET_FOR_NEW_SCENE':
      return {
        ...state,
        sceneId: undefined,
        selectedGenre: undefined,
        participants: [],
        takeIds: [],
        currentParticipantId: undefined,
        phase: 'genre-select',
      };

    case 'RESET_SESSION':
      return createSession();

    default:
      return state;
  }
}
