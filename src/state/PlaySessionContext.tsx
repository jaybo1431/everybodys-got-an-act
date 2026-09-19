import { createContext, useContext, useMemo, useReducer, useState, type ReactNode } from 'react';
import { gameSessionReducer, createSession } from '../domain/gameSession';
import type { GameSession, GamePhase, Genre, Participant, Take } from '../domain/types';
import { getSceneById } from '../domain/sceneCatalog';
import type { Scene } from '../domain/types';
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
  selectGenre: (genre: Genre) => void;
  selectScene: (sceneId: string) => void;
  goToPhase: (phase: GamePhase) => void;
  beginParticipantTurn: () => void;
  submitRecordedBlob: (blob: Blob) => void;
  retake: () => void;
  acceptTake: () => Promise<void>;
  nameParticipant: (name: string) => void;
  continueSameScene: () => void;
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

  const scene = useMemo(() => (session.sceneId ? getSceneById(session.sceneId) : undefined), [session.sceneId]);
  const currentParticipant = useMemo(
    () => session.participants.find((p) => p.id === session.currentParticipantId),
    [session.participants, session.currentParticipantId],
  );

  const selectGenre = (genre: Genre) => dispatch({ type: 'SELECT_GENRE', genre });
  const selectScene = (sceneId: string) => dispatch({ type: 'SELECT_SCENE', sceneId });
  const goToPhase = (phase: GamePhase) => dispatch({ type: 'SET_PHASE', phase });

  const beginParticipantTurn = () => {
    const participant: Participant = {
      id: crypto.randomUUID(),
      name: `Player ${session.participants.length + 1}`,
      joinedAt: Date.now(),
    };
    dispatch({ type: 'BEGIN_PARTICIPANT_TURN', participant });
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
      dispatch({ type: 'ADD_TAKE', takeId: scoredTake.id });
    } finally {
      setIsSaving(false);
    }
  };

  const nameParticipant = (name: string) =>
    dispatch({ type: 'RENAME_CURRENT_PARTICIPANT', name: name.trim() || 'Anonymous' });

  const continueSameScene = () => beginParticipantTurn();
  const finishSession = () => dispatch({ type: 'SET_PHASE', phase: 'results' });
  const viewPlayback = () => dispatch({ type: 'SET_PHASE', phase: 'playback' });

  const startNewScene = () => {
    setTakes([]);
    setPendingBlob(null);
    dispatch({ type: 'RESET_FOR_NEW_SCENE' });
  };

  const resetSession = () => {
    setTakes([]);
    setPendingBlob(null);
    dispatch({ type: 'RESET_SESSION' });
  };

  const value: PlaySessionContextValue = {
    session,
    scene,
    currentParticipant,
    takes,
    pendingBlob,
    isSaving,
    selectGenre,
    selectScene,
    goToPhase,
    beginParticipantTurn,
    submitRecordedBlob,
    retake,
    acceptTake,
    nameParticipant,
    continueSameScene,
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
