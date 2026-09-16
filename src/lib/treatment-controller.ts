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

/** Runs the complete software treatment lifecycle. Release is only possible after final verification. */
export function runTreatmentController(input: TreatmentControllerInput): TreatmentControllerResult {
  const sourceDecision = evaluateSafety({ ...input, treatmentCompleted: false });

  if (!sourceDecision.passed) return result('REJECTED', sourceDecision);

  const verificationDecision = evaluateSafety({ ...input, treatmentCompleted: true });
  return verificationDecision.passed
    ? result('VERIFIED', verificationDecision)
    : result('LOCKED', verificationDecision);
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
      { name: 'SOURCE_CHECK', complete: decision.state !== 'REJECTED' || decision.failedParameter?.startsWith('inlet.') !== true },
      { name: 'FILTRATION', complete: decision.passed || decision.failedParameter?.startsWith('outlet.') === true },
      { name: 'UF', complete: decision.passed || decision.failedParameter?.startsWith('outlet.') === true },
      { name: 'UV', complete: decision.passed || decision.failedParameter?.startsWith('outlet.') === true },
      { name: 'VERIFYING', complete: decision.passed || decision.failedParameter?.startsWith('outlet.') === true },
      { name: 'VERIFIED', complete: releaseAllowed },
      { name: 'REJECTED', complete: !decision.passed },
      { name: 'LOCKED', complete: locked },
    ],
  };
}
