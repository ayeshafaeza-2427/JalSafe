import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface LocalTreatmentRecord {
  id: string;
  createdAt: string;
  /** IndexedDB keys cannot be booleans; 0 = pending, 1 = synced. */
  synced: 0 | 1;
  cycle: Record<string, unknown>;
}

interface JalSafeDB extends DBSchema {
  treatmentRecords: {
    key: string;
    value: LocalTreatmentRecord;
    indexes: { 'by-synced': 0 | 1; 'by-created': string };
  };
}

let dbPromise: Promise<IDBPDatabase<JalSafeDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<JalSafeDB>('jalsafe-offline', 1, {
      upgrade(db) {
        const store = db.createObjectStore('treatmentRecords', { keyPath: 'id' });
        store.createIndex('by-synced', 'synced');
        store.createIndex('by-created', 'createdAt');
      },
    });
  }
  return dbPromise;
}

export async function saveTreatmentRecord(record: LocalTreatmentRecord): Promise<void> {
  const db = await getDb();
  await db.put('treatmentRecords', record);
}

export async function getPendingTreatmentRecords(): Promise<LocalTreatmentRecord[]> {
  const db = await getDb();
  return db.getAllFromIndex('treatmentRecords', 'by-synced', 0);
}

export async function markTreatmentRecordSynced(id: string): Promise<void> {
  const db = await getDb();
  const record = await db.get('treatmentRecords', id);
  if (!record) return;
  await db.put('treatmentRecords', { ...record, synced: 1 });
}

export async function getAllLocalTreatmentRecords(): Promise<LocalTreatmentRecord[]> {
  const db = await getDb();
  return db.getAllFromIndex('treatmentRecords', 'by-created');
}

export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}
