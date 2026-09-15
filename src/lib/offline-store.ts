import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface LocalTreatmentRecord {
  id: string;
  createdAt: string;
  synced: boolean;
  cycle: Record<string, unknown>;
}

interface JalSafeDB extends DBSchema {
  treatmentRecords: {
    key: string;
    value: LocalTreatmentRecord;
    indexes: { 'by-synced': boolean; 'by-created': string };
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
  return db.getAllFromIndex('treatmentRecords', 'by-synced', false);
}

export async function markTreatmentRecordSynced(id: string): Promise<void> {
  const db = await getDb();
  const record = await db.get('treatmentRecords', id);
  if (!record) return;
  await db.put('treatmentRecords', { ...record, synced: true });
}

export async function getAllLocalTreatmentRecords(): Promise<LocalTreatmentRecord[]> {
  const db = await getDb();
  return db.getAllFromIndex('treatmentRecords', 'by-created');
}

export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}
