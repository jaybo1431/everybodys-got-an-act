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

export interface ScriptLine {
  characterId: string;
  line: string;
  direction?: string;
}

export interface Script {
  id: string;
  lines: ScriptLine[];
}

/**
 * A Scene is structured data, not a page. Adding new scenes (tonight:
 * three predefined originals; later: generated, licensed, difficulty
 * tiers) never requires touching a UI component.
 */
export interface Scene {
  id: string;
  title: string;
  genre: Genre;
  premise: string;
  durationSeconds: number;
  characters: Character[];
  script: Script;
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

export interface Take {
  id: string;
  sceneId: string;
  participantId: string;
  mediaAssetId: string;
  takeNumber: number;
  createdAt: number;
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
  | 'countdown'
  | 'recording'
  | 'review'
  | 'score'
  | 'pass-phone'
  | 'results'
  | 'playback';

/**
 * A GameSession does not assume a fixed number of participants —
 * it just tracks whoever has joined so far and whose turn it is.
 */
export interface GameSession {
  id: string;
  createdAt: number;
  selectedGenre?: Genre;
  sceneId?: string;
  participants: Participant[];
  takeIds: string[];
  currentParticipantId?: string;
  phase: GamePhase;
}
