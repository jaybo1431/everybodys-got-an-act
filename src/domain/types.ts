/**
 * Core domain model. Framework-agnostic on purpose: no React, no DOM,
 * no storage or networking concerns. Everything else in the app (UI,
 * storage, media capture, scoring) depends on this file; this file
 * depends on nothing.
 */

export type Genre = 'comedy' | 'drama' | 'horror' | 'action' | 'romance';

export interface Character {
  id: string;
  name: string;
  description?: string;
}

/**
 * One line of dialogue belonging to one character. `order` is the
 * authoritative sequencing field — helpers sort by it rather than
 * trusting array position, so a scene's dialogueLines can be stored,
 * generated, or merged in any order and still play back correctly.
 *
 * `audioAssetId` and the pause fields are forward-looking: nothing in
 * this phase populates or plays them. They exist so a future
 * pre-recorded "partner" audio track can be attached to a line
 * without another domain model change.
 */
export interface DialogueLine {
  id: string;
  characterId: string;
  text: string;
  order: number;
  pauseBeforeMs?: number;
  pauseAfterMs?: number;
  audioAssetId?: string;
}

/**
 * A Scene is structured data, not a page. Adding new scenes (tonight:
 * three predefined originals; later: generated, licensed, difficulty
 * tiers) never requires touching a UI component.
 *
 * A scene's dialogue is a flat, ordered sequence of lines addressed
 * to arbitrary character IDs — nothing in the model assumes exactly
 * two characters or hard-codes which one is "the player". Which
 * character a given participant is performing lives on the
 * GameSession (see `playerCharacterId` below), not on the Scene
 * itself, so the same scene works no matter which character is
 * chosen.
 */
export interface Scene {
  id: string;
  title: string;
  genre: Genre;
  premise: string;
  durationSeconds: number;
  characters: Character[];
  dialogueLines: DialogueLine[];
  instructions: string;
}

export interface Participant {
  id: string;
  name: string;
  joinedAt: number;
}

/**
 * A recorded video, decoupled from where it's actually stored. Today
 * it's always a local Blob persisted to IndexedDB. Later this same
 * shape can be backed by a cloud URL without changing anything that
 * consumes it.
 */
export interface MediaAsset {
  id: string;
  kind: 'video';
  mimeType: string;
  createdAt: number;
  blob: Blob;
}

/**
 * A pre-recorded partner line, resolved via AudioRepository. Unlike
 * MediaAsset (a user-generated Blob persisted to IndexedDB),
 * AudioAsset describes an app-bundled, read-only static file — `src`
 * is a URL the browser can play directly, not something stored per
 * session. The domain layer never knows or cares where that file
 * physically lives; only AudioRepository (src/data/audioRepository.ts)
 * resolves an id to one of these.
 */
export interface AudioAsset {
  id: string;
  src: string;
  characterId: string;
  durationMs?: number;
}

/** Fixed for the MVP: Expression, Delivery, Timing, Confidence. */
export interface ScoreBreakdown {
  label: string;
  value: number; // 0-100
}

export interface Score {
  id: string;
  takeId: string;
  overall: number; // 0-100
  breakdown: ScoreBreakdown[];
  tagline: string;
  scoredAt: number;
  /** Marks how the score was produced so a future AI scorer can coexist with the demo one. */
  method: 'demo' | 'ai';
}

/**
 * One player-performed line within a Take. Each player dialogue line
 * gets its own recording — Take does not hold one combined video.
 * Combining segments into a single rendered video is explicitly
 * future work, not part of this phase.
 */
export interface TakeSegment {
  id: string;
  lineId: string;
  characterId: string;
  mediaAssetId: string;
  durationMs?: number;
  order: number;
}

export interface Take {
  id: string;
  sceneId: string;
  participantId: string;
  takeNumber: number;
  createdAt: number;
  segments: TakeSegment[];
  score?: Score;
}

/**
 * Every screen in the "Play Together" flow, in the order a session
 * normally moves through them. The UI is a function of `phase`, not
 * a fixed sequence of pages.
 */
export type GamePhase =
  | 'genre-select'
  | 'scene-select'
  | 'scene-intro'
  | 'script'
  | 'camera-permission'
  | 'acting'
  | 'score'
  | 'pass-phone'
  | 'results'
  | 'playback';

/**
 * A GameSession does not assume a fixed number of participants —
 * it just tracks whoever has joined so far and whose turn it is.
 *
 * `playerCharacterId` records which of the current scene's
 * characters the participant is performing. It defaults to the
 * scene's first character when a scene is selected, but the model
 * itself places no constraint on which character ID goes here — any
 * scene works with any of its characters as the player.
 */
export interface GameSession {
  id: string;
  createdAt: number;
  selectedGenre?: Genre;
  sceneId?: string;
  playerCharacterId?: string;
  participants: Participant[];
  takeIds: string[];
  currentParticipantId?: string;
  phase: GamePhase;
}
