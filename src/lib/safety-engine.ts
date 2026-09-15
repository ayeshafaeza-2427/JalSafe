import type { DeviceHealth, FilterHealth } from '../types/device';
import type { SensorConnectivity, SensorReading } from '../types/sensor';
import {
  DEFAULT_THRESHOLDS,
  REJECTION_DESCRIPTIONS,
  createFailDecision,
  createPassDecision,
  type RejectionCode,
  type SafetyDecision,
  type SafetyState,
  type SafetyThresholds,
} from '../types/safety';

export interface SafetyEngineInput {
  inlet: SensorReading;
  outlet?: SensorReading | null;
  health: DeviceHealth;
  connectivity?: SensorConnectivity;
  uvFlowInterlockOk?: boolean;
  treatmentCompleted?: boolean;
  recordWritable?: boolean;
  thresholds?: SafetyThresholds;
}

const finite = (value: number | null | undefined): value is number =>
  value !== null && value !== undefined && Number.isFinite(value);

function fail(code: RejectionCode, parameter: string, value: number, threshold: number): SafetyDecision {
  return createFailDecision(code, parameter, value, threshold);
}

function checkReading(
  reading: SensorReading,
  point: 'inlet' | 'outlet',
  thresholds: SafetyThresholds,
): SafetyDecision | null {
  const t = thresholds[point];
  if (!finite(reading.ph)) return createFailDecision('SENSOR_DISCONNECTED', `${point}.ph`, 0, 0);
  if (!finite(reading.tds)) return createFailDecision('SENSOR_DISCONNECTED', `${point}.tds`, 0, 0);
  if (!finite(reading.turbidity)) return createFailDecision('SENSOR_DISCONNECTED', `${point}.turbidity`, 0, 0);
  if (!finite(reading.temperature)) return createFailDecision('SENSOR_DISCONNECTED', `${point}.temperature`, 0, 0);
  if (!finite(reading.flowRate)) return createFailDecision('SENSOR_DISCONNECTED', `${point}.flow`, 0, 0);

  if (reading.ph < t.ph.min || reading.ph > t.ph.max) {
    return fail(point === 'inlet' ? 'INLET_PH_OUT_OF_RANGE' : 'OUTLET_PH_OUT_OF_RANGE', `${point}.ph`, reading.ph, reading.ph < t.ph.min ? t.ph.min : t.ph.max);
  }
  if (reading.tds > t.tds.max) {
    return fail(point === 'inlet' ? 'INLET_TDS_HIGH' : 'OUTLET_TDS_HIGH', `${point}.tds`, reading.tds, t.tds.max);
  }
  if (reading.turbidity > t.turbidity.max) {
    return fail(point === 'inlet' ? 'INLET_TURBIDITY_HIGH' : 'OUTLET_TURBIDITY_HIGH', `${point}.turbidity`, reading.turbidity, t.turbidity.max);
  }
  if (reading.temperature < t.temperature.min || reading.temperature > t.temperature.max) {
    return fail(point === 'inlet' ? 'INLET_TEMPERATURE_OUT_OF_RANGE' : 'OUTLET_TEMPERATURE_OUT_OF_RANGE', `${point}.temperature`, reading.temperature, reading.temperature < t.temperature.min ? t.temperature.min : t.temperature.max);
  }
  if (reading.flowRate < t.flow.min || reading.flowRate > t.flow.max) {
    return fail(point === 'inlet' ? 'FLOW_OUT_OF_RANGE' : 'OUTLET_FLOW_OUT_OF_RANGE', `${point}.flow`, reading.flowRate, reading.flowRate < t.flow.min ? t.flow.min : t.flow.max);
  }
  return null;
}

function checkConnectivity(connectivity: SensorConnectivity): SafetyDecision | null {
  const missing = Object.entries(connectivity).find(([, connected]) => !connected);
  if (missing) return createFailDecision('SENSOR_DISCONNECTED', `sensor.${missing[0]}`, 0, 1);
  return null;
}

function checkFilters(filters: FilterHealth, minimum: number): SafetyDecision | null {
  const entries: Array<[string, number]> = [
    ['sediment', filters.sediment], ['carbon', filters.carbon], ['uf', filters.uf], ['uv', filters.uv],
  ];
  const blocked = entries.find(([, health]) => !finite(health) || health <= 0);
  if (blocked) return fail('FILTER_BLOCKED', `filter.${blocked[0]}`, blocked[1], 0);
  const degraded = entries.find(([, health]) => health < minimum);
  if (degraded) return fail('FILTER_DEGRADED', `filter.${degraded[0]}`, degraded[1], minimum);
  return null;
}

/** Pure, deterministic safety gate. Any unknown/failed critical condition rejects release. */
export function evaluateSafety(input: SafetyEngineInput): SafetyDecision {
  const thresholds = input.thresholds ?? DEFAULT_THRESHOLDS;
  const connectivity = input.connectivity ?? input.health.sensorConnectivity;

  const connectivityFailure = checkConnectivity(connectivity);
  if (connectivityFailure) return connectivityFailure;

  if (input.health.calibrationStatus === 'EXPIRED') {
    return createFailDecision('CALIBRATION_EXPIRED', 'calibration', 0, 1);
  }
  if (!finite(input.health.batteryLevel) || input.health.batteryLevel < thresholds.device.minBattery) {
    return fail('LOW_BATTERY', 'batteryLevel', input.health.batteryLevel ?? 0, thresholds.device.minBattery);
  }
  if (!finite(input.health.uvHealth) || input.health.uvHealth < thresholds.device.minUvHealth) {
    return fail('UV_FAULT', 'uvHealth', input.health.uvHealth ?? 0, thresholds.device.minUvHealth);
  }

  const filterFailure = checkFilters(input.health.filterHealth, thresholds.device.minFilterHealth);
  if (filterFailure) return filterFailure;

  if (input.recordWritable === false) return createFailDecision('RECORD_WRITE_FAILURE', 'recordWritable', 0, 1);

  const inletFailure = checkReading(input.inlet, 'inlet', thresholds);
  if (inletFailure) return inletFailure;

  if (input.uvFlowInterlockOk === false) {
    return createFailDecision('FLOW_OUT_OF_RANGE', 'uvFlowInterlock', 0, 1);
  }
  if (!input.treatmentCompleted) return createPassDecision('PRE_TREATMENT');

  if (!input.outlet) return createFailDecision('SENSOR_DISCONNECTED', 'outlet', 0, 1);
  const outletFailure = checkReading(input.outlet, 'outlet', thresholds);
  if (outletFailure) return outletFailure;

  return createPassDecision('VERIFIED');
}

export function isReleaseAllowed(decision: SafetyDecision): boolean {
  return decision.passed && decision.state === 'VERIFIED';
}

export function lockedState(decision: SafetyDecision): SafetyState {
  return decision.passed ? decision.state : 'HOLD';
}

export function explainDecision(decision: SafetyDecision): string {
  if (decision.passed) return 'Verified for the configured safety parameters.';
  return decision.rejectionCode
    ? REJECTION_DESCRIPTIONS[decision.rejectionCode]
    : decision.rejectionReason ?? 'Safety gate failed.';
}
