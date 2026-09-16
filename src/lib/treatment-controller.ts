import { evaluateSafety, isReleaseAllowed } from './safety-engine';
import type { DeviceHealth } from '../types/device';
import type { SensorConnectivity, SensorReading } from '../types/sensor';
import type { SafetyDecision, SafetyThresholds } from '../types/safety';

export type TreatmentControllerState =
  | 'SOURCE_CHECK'
  | 'FILTRATION'
  | 'UF'
  | 'UV'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'LOCKED';

export interface TreatmentControllerInput {
  inlet: SensorReading;
  outlet: SensorReading | null;
  health: DeviceHealth;
  connectivity?: SensorConnectivity;
  thresholds?: SafetyThresholds;
  uvFlowInterlockOk?: boolean;
  recordWritable?: boolean;
}

export interface TreatmentControllerResult {
  state: TreatmentControllerState;
  decision: SafetyDecision;
  solenoid: 'LOCKED' | 'UNLOCKED';
  releaseAllowed: boolean;
  stages: Array<{ name: TreatmentControllerState; complete: boolean }>;
}

/** Runs the software treatment lifecycle. It never unlocks unless the final outlet gate is VERIFIED. */
export function runTreatmentController(input: TreatmentControllerInput): TreatmentControllerResult {
  const sourceDecision = evaluateSafety({
    ...input,
    treatmentCompleted: false,
  });

  if (!sourceDecision.passed) {
    return result('REJECTED', sourceDecision);
  }

  const verificationDecision = evaluateSafety({
    ...input,
    treatmentCompleted: true,
  });

  if (!verificationDecision.passed) {
    return result('LOCKED', verificationDecision);
  }

  return result('VERIFIED', verificationDecision);
}

function result(state: TreatmentControllerState, decision: SafetyDecision): TreatmentControllerResult {
  const releaseAllowed = isReleaseAllowed(decision);
  const locked = !releaseAllowed;
  return {
    state,
    decision,
    solenoid: locked ? 'LOCKED' : 'UNLOCKED',
    releaseAllowed,
    stages: [
      { name: 'SOURCE_CHECK', complete: true },
      { name: 'FILTRATION', complete: decision.passed },
      { name: 'UF', complete: decision.passed },
      { name: 'UV', complete: decision.passed },
      { name: 'VERIFYING', complete: decision.passed },
      { name: 'VERIFIED', complete: releaseAllowed },
      { name: 'REJECTED', complete: !decision.passed },
      { name: 'LOCKED', complete: !releaseAllowed },
    ],
  };
}
