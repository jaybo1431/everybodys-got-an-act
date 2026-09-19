import type { DialogueLine, TakeSegment } from './types';

/** Ties a freshly recorded MediaAsset to the exact dialogue line the player was performing. */
export function createTakeSegment(line: DialogueLine, mediaAssetId: string, durationMs?: number): TakeSegment {
  return {
    id: crypto.randomUUID(),
    lineId: line.id,
    characterId: line.characterId,
    mediaAssetId,
    durationMs,
    order: line.order,
  };
}

export function getSegmentForLine(segments: TakeSegment[], lineId: string): TakeSegment | undefined {
  return segments.find((segment) => segment.lineId === lineId);
}

export function getOrderedSegments(segments: TakeSegment[]): TakeSegment[] {
  return [...segments].sort((a, b) => a.order - b.order);
}
