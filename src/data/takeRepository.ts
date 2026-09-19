import { storageService } from './storageService';
import type { Take } from '../domain/types';

export const takeRepository = {
  async save(take: Take): Promise<void> {
    await storageService.put('takes', take);
  },

  async getMany(ids: string[]): Promise<Take[]> {
    const results = await Promise.all(ids.map((id) => storageService.get<Take>('takes', id)));
    return results.filter((take): take is Take => Boolean(take));
  },
};
