import { createContext, useContext, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { gameSessionReducer, createSession } from '../domain/gameSession';
import type { DialogueLine, GameSession, GamePhase, Genre, Participant, Take, TakeSegment, Scene } from '../domain/types';
import { getSceneById } from '../domain/sceneCatalog';
import { createTakeSegment } from '../domain/takeSegments';
import { mediaRepository } from '../data/mediaRepository';
import { takeRepository } from '../data/takeRepository';
import { DemoScoringService } from '../domain/scoring/DemoScoringService';

// Swap this line for an AIScoringService later. Nothing else in this
// file (or any screen) needs to change.
const scoringService = new DemoScoringService();

interface PlaySessionContextValue {
  session: GameSession;
  scene: Scene | undefined;
  currentParticipant: Participant | undefined;
  takes: Take[];
  isSaving: boolean;
  lastAcceptedTake: Take | undefined;
  canGoBack: boolean;
  selectGenre: (genre: Genre) => void;
  selectScene: (sceneId: string) => void;
  goToPhase: (phase: GamePhase) => void;
  goBack: () => void;
  /** Persists one player-recorded line as its own segment of the in-progress take. */
  acceptLineSegment: (line: DialogueLine, blob: Blob) => Promise<void>;
  /** Scores and saves the in-progress take once every line has been performed. */
  finalizeTake: () => Promise<void>;
  startNextActor: (name: string) => void;
  finishSession: () => void;
  viewPlayback: () => void;
  startNewScene: () => void;
  resetSession: () => void;
}

const PlaySessionContext = createContext<PlaySessionContextValue | null>(null);

export function PlaySessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(gameSessionReducer, undefined, createSession);
  const [segments, setSegments] = useState<TakeSegment[]>([]);
  const [takes, setTakes] = useState<Take[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const historyRef = useRef<GamePhase[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  const scene = useMemo(() => (session.sceneId ? getSceneById(session.sceneId) : undefined), [session.sceneId]);
  const currentParticipant = useMemo(
    () => session.participants.find((p) => p.id === session.currentParticipantId),
    [session.participants, session.currentParticipantId],
  );
  const lastAcceptedTake = useMemo(() => takes[takes.length - 1], [takes]);

  const pushHistory = (phase: GamePhase) => {
    historyRef.current = [...historyRef.current, phase];
    setCanGoBack(historyRef.current.length > 0);
  };

  const selectGenre = (genre: Genre) => {
    pushHistory(session.phase);
    dispatch({ type: 'SELECT_GENRE', genre });
  };

  const selectScene = (sceneId: string) => {
    pushHistory(session.phase);
    // Default the player to the scene's first listed character. The
    // model supports any character being the player (see dialogue.ts)
    // — this is just today's default until a role picker exists.
    const chosenScene = getSceneById(sceneId);
    const playerCharacterId = chosenScene?.characters[0]?.id ?? '';
    dispatch({ type: 'SELECT_SCENE', sceneId, playerCharacterId });
    // First participant of the session defaults to "You" — every
    // participant from the second onward is named during the
    // pass-the-phone handoff instead (see startNextActor).
    setSegments([]);
    const participant: Participant = { id: crypto.randomUUID(), name: 'You', joinedAt: Date.now() };
    dispatch({ type: 'BEGIN_PARTICIPANT_TURN', participant });
  };

  const goToPhase = (phase: GamePhase) => {
    pushHistory(session.phase);
    dispatch({ type: 'SET_PHASE', phase });
  };

  const goBack = () => {
    const previous = historyRef.current[historyRef.current.length - 1];
    if (!previous) return;
    historyRef.current = historyRef.current.slice(0, -1);
    setCanGoBack(historyRef.current.length > 0);
    dispatch({ type: 'SET_PHASE', phase: previous });
  };

  // Persists exactly one player line's recording. Called by
  // ActingScreen every time a line is accepted — never for a whole
  // scene at once, since each player dialogue line is its own take.
  const acceptLineSegment = async (line: DialogueLine, blob: Blob) => {
    const asset = await mediaRepository.save(blob);
    const segment = createTakeSegment(line, asset.id);
    setSegments((prev) => [...prev, segment]);
  };

  // Called once the turn engine reaches END_OF_SCENE: assembles the
  // accumulated segments into a Take, scores it, persists it, and
  // advances the session.
  const finalizeTake = async () => {
    if (!session.sceneId || !session.currentParticipantId) return;
    setIsSaving(true);
    try {
      const takeNumber = takes.filter((t) => t.participantId === session.currentParticipantId).length + 1;
      const baseTake: Take = {
        id: crypto.randomUUID(),
        sceneId: session.sceneId,
        participantId: session.currentParticipantId,
        takeNumber,
        createdAt: Date.now(),
        segments,
      };
      const score = await scoringService.scoreTake(baseTake, { takeNumber });
      const scoredTake: Take = { ...baseTake, score };

      await takeRepository.save(scoredTake);
      setTakes((prev) => [...prev, scoredTake]);
      setSegments([]);
      historyRef.current = [];
      setCanGoBack(false);
      dispatch({ type: 'ADD_TAKE', takeId: scoredTake.id });
    } finally {
      setIsSaving(false);
    }
  };

  const startNextActor = (name: string) => {
    const participant: Participant = {
      id: crypto.randomUUID(),
      name: name.trim() || `Player ${session.participants.length + 1}`,
      joinedAt: Date.now(),
    };
    // Clear back-history and any leftover segments so the new
    // performer can't navigate back into, or accidentally inherit,
    // the previous participant's recording.
    historyRef.current = [];
    setCanGoBack(false);
    setSegments([]);
    dispatch({ type: 'BEGIN_PARTICIPANT_TURN', participant });
  };

  const finishSession = () => {
    historyRef.current = [];
    setCanGoBack(false);
    dispatch({ type: 'SET_PHASE', phase: 'results' });
  };
  const viewPlayback = () => {
    pushHistory('results');
    dispatch({ type: 'SET_PHASE', phase: 'playback' });
  };

  const startNewScene = () => {
    setTakes([]);
    setSegments([]);
    historyRef.current = [];
    setCanGoBack(false);
    dispatch({ type: 'RESET_FOR_NEW_SCENE' });
  };

  const resetSession = () => {
    setTakes([]);
    setSegments([]);
    historyRef.current = [];
    setCanGoBack(false);
    dispatch({ type: 'RESET_SESSION' });
  };

  const value: PlaySessionContextValue = {
    session,
    scene,
    currentParticipant,
    takes,
    isSaving,
    lastAcceptedTake,
    canGoBack,
    selectGenre,
    selectScene,
    goToPhase,
    goBack,
    acceptLineSegment,
    finalizeTake,
    startNextActor,
    finishSession,
    viewPlayback,
    startNewScene,
    resetSession,
  };

  return <PlaySessionContext.Provider value={value}>{children}</PlaySessionContext.Provider>;
}

export function usePlaySession(): PlaySessionContextValue {
  const ctx = useContext(PlaySessionContext);
  if (!ctx) throw new Error('usePlaySession must be used within a PlaySessionProvider');
  return ctx;
}
