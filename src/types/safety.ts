/**
 * Safety engine type definitions for JalSafe Mini
 * The safety engine is the most critical component — pure, deterministic, no side effects.
 */

/** All possible safety states in the state machine */
export type SafetyState =
  | 'IDLE'
  | 'SOURCE_CHECK'
  | 'PRE_TREATMENT'
  | 'PURIFYING'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'HOLD'
  | 'MAINTENANCE'
  | 'ERROR';

/** Machine-readable rejection codes */
export type RejectionCode =
  | 'OUTLET_TURBIDITY_HIGH'
  | 'OUTLET_PH_OUT_OF_RANGE'
  | 'OUTLET_TDS_HIGH'
  | 'OUTLET_TEMPERATURE_OUT_OF_RANGE'
  | 'OUTLET_FLOW_OUT_OF_RANGE'
  | 'INLET_OUT_OF_RANGE'
  | 'INLET_PH_OUT_OF_RANGE'
  | 'INLET_TDS_HIGH'
  | 'INLET_TURBIDITY_HIGH'
  | 'INLET_TEMPERATURE_OUT_OF_RANGE'
  | 'UV_FAULT'
  | 'FLOW_OUT_OF_RANGE'
  | 'SENSOR_DISCONNECTED'
  | 'CALIBRATION_EXPIRED'
  | 'FILTER_BLOCKED'
  | 'FILTER_DEGRADED'
  | 'LOW_BATTERY'
  | 'TREATMENT_FAILURE'
  | 'RECORD_WRITE_FAILURE';

/** Human-readable descriptions for each rejection code */
export const REJECTION_DESCRIPTIONS: Record<RejectionCode, string> = {
  OUTLET_TURBIDITY_HIGH: 'Outlet water turbidity exceeds the configured safety limit',
  OUTLET_PH_OUT_OF_RANGE: 'Outlet water pH is outside the configured safe range',
  OUTLET_TDS_HIGH: 'Outlet water TDS exceeds the configured safety limit',
  OUTLET_TEMPERATURE_OUT_OF_RANGE: 'Outlet water temperature is outside the safe range',
  OUTLET_FLOW_OUT_OF_RANGE: 'Outlet flow rate is outside the validated treatment range',
  INLET_OUT_OF_RANGE: 'Source water is outside the device validated operating range',
  INLET_PH_OUT_OF_RANGE: 'Source water pH is outside the device operating range',
  INLET_TDS_HIGH: 'Source water TDS exceeds the device operating limit',
  INLET_TURBIDITY_HIGH: 'Source water turbidity exceeds the device pre-treatment capacity',
  INLET_TEMPERATURE_OUT_OF_RANGE: 'Source water temperature is outside the operating range',
  UV_FAULT: 'UV disinfection module has reported a fault or insufficient health',
  FLOW_OUT_OF_RANGE: 'Flow rate is outside the validated UV treatment range',
  SENSOR_DISCONNECTED: 'One or more required sensors are disconnected or returning invalid data',
  CALIBRATION_EXPIRED: 'Sensor calibration has expired and readings may be unreliable',
  FILTER_BLOCKED: 'Filter blockage detected — flow rate has dropped below acceptable levels',
  FILTER_DEGRADED: 'One or more filters have degraded below the minimum health threshold',
  LOW_BATTERY: 'Battery level is insufficient to safely complete the treatment cycle',
  TREATMENT_FAILURE: 'A treatment stage has failed to complete successfully',
  RECORD_WRITE_FAILURE: 'Unable to write the treatment record — data integrity cannot be guaranteed',
};

/** The result of a safety engine evaluation */
export interface SafetyDecision {
  /** Whether all safety checks passed */
  passed: boolean;
  /** The recommended safety state to transition to */
  state: SafetyState;
  /** Machine-readable rejection code (null if passed) */
  rejectionCode: RejectionCode | null;
  /** Human-readable rejection reason */
  rejectionReason: string | null;
  /** The specific parameter that failed (e.g., 'outlet.turbidity') */
  failedParameter: string | null;
  /** The actual value of the failed parameter */
  failedValue: number | null;
  /** The threshold the value was compared against */
  threshold: number | null;
  /** When this decision was made */
  timestamp: string;
}

/** Verification result labels — what users see */
export type VerificationLabel =
  | 'VERIFIED_FOR_CONFIGURED_PARAMETERS'
  | 'OUTPUT_REJECTED'
  | 'LABORATORY_TESTING_REQUIRED';

/** Maps safety state to verification label */
export function getVerificationLabel(state: SafetyState): VerificationLabel {
  switch (state) {
    case 'VERIFIED':
      return 'VERIFIED_FOR_CONFIGURED_PARAMETERS';
    case 'HOLD':
      return 'LABORATORY_TESTING_REQUIRED';
    default:
      return 'OUTPUT_REJECTED';
  }
}

/** Safety threshold configuration for a single parameter */
export interface ParameterThreshold {
  min: number;
  max: number;
}

/** Complete safety threshold configuration */
export interface SafetyThresholds {
  inlet: {
    ph: ParameterThreshold;
    tds: { max: number };
    turbidity: { max: number };
    temperature: ParameterThreshold;
    flow: ParameterThreshold;
  };
  outlet: {
    ph: ParameterThreshold;
    tds: { max: number };
    turbidity: { max: number };
    temperature: ParameterThreshold;
    flow: ParameterThreshold;
  };
  device: {
    minBattery: number;
    minUvHealth: number;
    minFilterHealth: number;
  };
}

/** Default safety thresholds based on WHO/BIS guidelines */
export const DEFAULT_THRESHOLDS: SafetyThresholds = {
  inlet: {
    ph: { min: 4.0, max: 10.0 },
    tds: { max: 2000 },
    turbidity: { max: 50 },
    temperature: { min: 2, max: 50 },
    flow: { min: 2, max: 30 },
  },
  outlet: {
    ph: { min: 6.5, max: 8.5 },
    tds: { max: 500 },
    turbidity: { max: 1 },
    temperature: { min: 5, max: 45 },
    flow: { min: 5, max: 20 },
  },
  device: {
    minBattery: 15,
    minUvHealth: 30,
    minFilterHealth: 10,
  },
};

/** Creates a passing safety decision */
export function createPassDecision(state: SafetyState = 'VERIFIED'): SafetyDecision {
  return {
    passed: true,
    state,
    rejectionCode: null,
    rejectionReason: null,
    failedParameter: null,
    failedValue: null,
    threshold: null,
    timestamp: new Date().toISOString(),
  };
}

/** Creates a failing safety decision */
export function createFailDecision(
  code: RejectionCode,
  failedParameter: string,
  failedValue: number,
  threshold: number
): SafetyDecision {
  return {
    passed: false,
    state: 'REJECTED',
    rejectionCode: code,
    rejectionReason: REJECTION_DESCRIPTIONS[code],
    failedParameter,
    failedValue,
    threshold,
    timestamp: new Date().toISOString(),
  };
}
