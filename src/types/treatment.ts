/**
 * Treatment cycle type definitions for JalSafe Mini
 */

import type { SensorReading } from './sensor';
import type { RejectionCode } from './safety';

/** Treatment cycle outcome */
export type CycleOutcome = 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED' | 'ABORTED';

/** Treatment stage types in execution order */
export type StageType = 'SENSING' | 'SEDIMENT' | 'CARBON' | 'UF' | 'UV' | 'VERIFICATION';

/** Treatment stage status */
export type StageStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

/** Ordered list of treatment stages */
export const TREATMENT_STAGES: StageType[] = [
  'SENSING',
  'SEDIMENT',
  'CARBON',
  'UF',
  'UV',
  'VERIFICATION',
];

/** Stage display names */
export const STAGE_DISPLAY_NAMES: Record<StageType, string> = {
  SENSING: 'Source Sensing',
  SEDIMENT: 'Sediment Filtration',
  CARBON: 'Carbon Filtration',
  UF: 'Ultrafiltration',
  UV: 'UV Disinfection',
  VERIFICATION: 'Final Verification',
};

/** Default stage durations in seconds (for simulation) */
export const STAGE_DURATIONS: Record<StageType, number> = {
  SENSING: 5,
  SEDIMENT: 8,
  CARBON: 8,
  UF: 10,
  UV: 10,
  VERIFICATION: 5,
};

/** Demo mode (faster) stage durations */
export const DEMO_STAGE_DURATIONS: Record<StageType, number> = {
  SENSING: 2,
  SEDIMENT: 3,
  CARBON: 3,
  UF: 4,
  UV: 4,
  VERIFICATION: 2,
};

/** A single treatment stage record */
export interface TreatmentStage {
  id: string;
  treatmentCycleId: string;
  stageType: StageType;
  stageOrder: number;
  status: StageStatus;
  startedAt: string | null;
  completedAt: string | null;
  durationSeconds: number | null;
  failureReason: string | null;
}

/** Sync status of a record */
export type SyncStatus = 'LOCAL' | 'SYNCING' | 'SYNCED' | 'FAILED';

/** Complete treatment cycle record */
export interface TreatmentCycle {
  id: string;
  deviceId: string;
  cycleNumber: number;
  startedAt: string;
  endedAt: string | null;
  outcome: CycleOutcome;
  rejectionReason: RejectionCode | null;
  rejectionDetail: string | null;
  volumeTreatedMl: number | null;
  inletReading: SensorReading;
  outletReading: SensorReading | null;
  uvHealthAtCycle: number | null;
  batteryAtStart: number;
  batteryAtEnd: number | null;
  firmwareVersion: string;
  previousHash: string;
  currentHash: string | null;
  hashVerified: boolean;
  syncStatus: SyncStatus;
  stages: TreatmentStage[];
  createdAt: string;
}

/** Input for creating a new treatment cycle */
export interface CreateCycleInput {
  deviceId: string;
  inletReading: SensorReading;
  batteryAtStart: number;
  firmwareVersion: string;
}
