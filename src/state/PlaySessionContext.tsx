import { createContext, useContext, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { gameSessionReducer, createSession } from '../domain/gameSession';
import type { GameSession, GamePhase, Genre, Participant, Take, Scene } from '../domain/types';
import { getSceneById } from '../domain/sceneCatalog';
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
  pendingBlob: Blob | null;
  isSaving: boolean;
  lastAcceptedTake: Take | undefined;
  canGoBack: boolean;
  selectGenre: (genre: Genre) => void;
  selectScene: (sceneId: string) => void;
  goToPhase: (phase: GamePhase) => void;
  goBack: () => void;
  submitRecordedBlob: (blob: Blob) => void;
  retake: () => void;
  acceptTake: () => Promise<void>;
  startNextActor: (name: string) => void;
  finishSession: () => void;
  viewPlayback: () => void;
  startNewScene: () => void;
  resetSession: () => void;
}

const PlaySessionContext = createContext<PlaySessionContextValue | null>(null);

export function PlaySessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(gameSessionReducer, undefined, createSession);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
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
    dispatch({ type: 'SELECT_SCENE', sceneId });
    // First participant of the session defaults to "You" — every
    // participant from the second onward is named during the
    // pass-the-phone handoff instead (see startNextActor).
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

  const submitRecordedBlob = (blob: Blob) => {
    setPendingBlob(blob);
    dispatch({ type: 'SET_PHASE', phase: 'review' });
  };

  const retake = () => {
    setPendingBlob(null);
    dispatch({ type: 'SET_PHASE', phase: 'countdown' });
  };

  // The only function in the app that turns a raw recording into
  // persisted domain data: saves the MediaAsset, scores the take,
  // saves the Take, then advances the session.
  const acceptTake = async () => {
    if (!pendingBlob || !session.sceneId || !session.currentParticipantId) return;
    setIsSaving(true);
    try {
      const asset = await mediaRepository.save(pendingBlob);
      const takeNumber = takes.filter((t) => t.participantId === session.currentParticipantId).length + 1;
      const baseTake: Take = {
        id: crypto.randomUUID(),
        sceneId: session.sceneId,
        participantId: session.currentParticipantId,
        mediaAssetId: asset.id,
        takeNumber,
        createdAt: Date.now(),
      };
      const score = await scoringService.scoreTake(baseTake, { takeNumber });
      const scoredTake: Take = { ...baseTake, score };

      await takeRepository.save(scoredTake);
      setTakes((prev) => [...prev, scoredTake]);
      setPendingBlob(null);
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
    // Clear back-history so the new performer can't navigate back into
    // the previous participant's score screen.
    historyRef.current = [];
    setCanGoBack(false);
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
    setPendingBlob(null);
    historyRef.current = [];
    setCanGoBack(false);
    dispatch({ type: 'RESET_FOR_NEW_SCENE' });
  };

  const resetSession = () => {
    setTakes([]);
    setPendingBlob(null);
    historyRef.current = [];
    setCanGoBack(false);
    dispatch({ type: 'RESET_SESSION' });
  };

  const value: PlaySessionContextValue = {
    session,
    scene,
    currentParticipant,
    takes,
    pendingBlob,
    isSaving,
    lastAcceptedTake,
    canGoBack,
    selectGenre,
    selectScene,
    goToPhase,
    goBack,
    submitRecordedBlob,
    retake,
    acceptTake,
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
