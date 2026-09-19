import { storageService } from './storageService';
import type { MediaAsset } from '../domain/types';

/**
 * Only place in the app that turns a raw recorded Blob into a
 * persisted MediaAsset. The camera hook never calls this directly —
 * only the game session does, and only once a take is accepted.
 */
export const mediaRepository = {
  async save(blob: Blob): Promise<MediaAsset> {
    const asset: MediaAsset = {
      id: crypto.randomUUID(),
      kind: 'video',
      mimeType: blob.type || 'video/webm',
      createdAt: Date.now(),
      blob,
    };
    await storageService.put('media', asset);
    return asset;
  },

  async get(id: string): Promise<MediaAsset | undefined> {
    return storageService.get<MediaAsset>('media', id);
  },
};
