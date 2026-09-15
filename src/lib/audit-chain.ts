export interface AuditRecord {
  id: string;
  timestamp: string;
  type: string;
  payload: Record<string, unknown>;
  previousHash: string | null;
  currentHash: string;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(',')}}`;
}

async function sha256(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function appendAuditRecord(
  input: Omit<AuditRecord, 'currentHash' | 'previousHash'>,
  previousHash: string | null,
): Promise<AuditRecord> {
  const recordWithoutHash = { ...input, previousHash };
  const currentHash = await sha256(canonicalize(recordWithoutHash));
  return { ...recordWithoutHash, currentHash };
}

export async function verifyAuditChain(records: AuditRecord[]): Promise<boolean> {
  let previousHash: string | null = null;
  for (const record of records) {
    const expected = await appendAuditRecord(
      { id: record.id, timestamp: record.timestamp, type: record.type, payload: record.payload },
      previousHash,
    );
    if (expected.currentHash !== record.currentHash || record.previousHash !== previousHash) return false;
    previousHash = record.currentHash;
  }
  return true;
}
