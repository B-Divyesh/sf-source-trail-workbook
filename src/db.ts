import type { Workbook } from './types';

const DATABASE = 'source-trail-workbook';
const STORE = 'workbooks';
export type StorageMode = 'real' | 'demo';

const storageKey = (mode: StorageMode) => mode === 'demo' ? 'demo:current' : 'workbook:current';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Local storage could not open.'));
  });
}

export async function loadWorkbook(mode: StorageMode = 'real'): Promise<Workbook | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readonly');
    const request = transaction.objectStore(STORE).get(storageKey(mode));
    request.onsuccess = () => resolve((request.result as Workbook | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error('The local workbook could not be read.'));
    transaction.oncomplete = () => db.close();
  });
}

export async function saveWorkbook(workbook: Workbook, mode: StorageMode = 'real'): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).put(workbook, storageKey(mode));
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('The workbook could not be saved.')); };
  });
}

export async function clearWorkbook(mode: StorageMode): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).delete(storageKey(mode));
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('The workbook could not be cleared.')); };
  });
}
