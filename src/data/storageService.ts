import { openDb, type StoreName } from './db';

/**
 * The one and only persistence abstraction in the app. MVP is backed
 * by IndexedDB (it's the only local option that can hold video Blobs).
 * If this ever becomes a backend/API instead, this is the only file
 * that changes — no component should ever import `db.ts` directly.
 */
export interface StorageService {
  put<T extends { id: string }>(store: StoreName, value: T): Promise<void>;
  get<T>(store: StoreName, id: string): Promise<T | undefined>;
  list<T>(store: StoreName): Promise<T[]>;
  remove(store: StoreName, id: string): Promise<void>;
  clear(store: StoreName): Promise<void>;
}

class IndexedDbStorageService implements StorageService {
  async put<T extends { id: string }>(store: StoreName, value: T): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async get<T>(store: StoreName, id: string): Promise<T | undefined> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const request = tx.objectStore(store).get(id);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error);
    });
  }

  async list<T>(store: StoreName): Promise<T[]> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const request = tx.objectStore(store).getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }

  async remove(store: StoreName, id: string): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear(store: StoreName): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const storageService: StorageService = new IndexedDbStorageService();
