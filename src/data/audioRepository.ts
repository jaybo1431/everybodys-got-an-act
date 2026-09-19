import { getAudioAssetById } from '../domain/audioCatalog';
import type { AudioAsset } from '../domain/types';

/**
 * Resolves an audioAssetId into a playable AudioAsset. The UI never
 * knows where partner audio files physically live — it only ever
 * asks this repository to resolve an id, the same pattern
 * mediaRepository already uses for recorded video. Swapping static
 * bundled files for, say, a CDN URL later means changing only this
 * file.
 */
export interface AudioRepository {
  resolve(audioAssetId: string): AudioAsset | undefined;
}

class StaticAudioRepository implements AudioRepository {
  resolve(audioAssetId: string): AudioAsset | undefined {
    return getAudioAssetById(audioAssetId);
  }
}

export const audioRepository: AudioRepository = new StaticAudioRepository();
