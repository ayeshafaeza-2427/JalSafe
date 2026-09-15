import { DEFAULT_THRESHOLDS, type SafetyDecision } from '../types';
import type { DeviceStatus, FilterHealth, SensorReading } from '../types';

export type SafetyViewState = 'SAFE' | 'TREATING' | 'VERIFYING' | 'REJECTED' | 'LOCKED' | 'FAULT';

export interface DemoAlert {
  id: string;
  title: string;
  message: string;
  type: 'SAFETY' | 'MAINTENANCE' | 'SENSOR' | 'BATTERY' | 'FILTER';
  priority: 'CRITICAL' | 'WARNING' | 'INFO';
  time: string;
  affectedComponent: string;
}

export interface DemoCycle {
  id: string;
  timestamp: string;
  result: 'VERIFIED' | 'REJECTED' | 'LOCKED';
  status: 'COMPLETE' | 'IN_PROGRESS' | 'FAILED';
  volume: string;
  reason: string;
  releaseStatus: 'RELEASED' | 'LOCKED' | 'NOT_RELEASED';
  recordStatus: 'LOGGED' | 'VERIFIED' | 'PENDING';
  recordHash: string;
}

export const demoThresholds = DEFAULT_THRESHOLDS;

export const demoSensorValues: Record<string, number | null> = {
  inletPh: 7.4,
  inletTds: 610,
  inletTurbidity: 22.3,
  inletTemperature: 28.2,
  inletFlow: 12.8,
  outletPh: 6.8,
  outletTds: 470,
  outletTurbidity: 2.4,
  outletTemperature: 26.8,
  outletFlow: 10.6,
};

export const demoInletReading: SensorReading = {
  ph: demoSensorValues.inletPh as number,
  tds: demoSensorValues.inletTds as number,
  turbidity: demoSensorValues.inletTurbidity as number,
  temperature: demoSensorValues.inletTemperature as number,
  flowRate: demoSensorValues.inletFlow as number,
};

export const demoOutletReading: SensorReading = {
  ph: demoSensorValues.outletPh as number,
  tds: demoSensorValues.outletTds as number,
  turbidity: demoSensorValues.outletTurbidity as number,
  temperature: demoSensorValues.outletTemperature as number,
  flowRate: demoSensorValues.outletFlow as number,
};

export const demoFilterHealth: FilterHealth = {
  sediment: 68,
  carbon: 74,
  uf: 81,
  uv: 72,
};

export const demoDeviceStatus: DeviceStatus = {
  deviceId: 'demo-device-01',
  serialNumber: 'JAL-DEV-014',
  name: 'Demo Device',
  firmwareVersion: '2.1.0',
  safetyState: 'REJECTED',
  solenoidState: 'LOCKED',
  pumpActive: false,
  networkStatus: 'ONLINE',
  health: {
    batteryLevel: 18,
    solarCharging: true,
    solarVoltage: 14.3,
    uvHealth: 74,
    calibrationStatus: 'VALID',
    calibrationExpiresAt: '2026-10-12T00:00:00.000Z',
    sensorConnectivity: {
      ph: true,
      tds: true,
      turbidity: true,
      temperature: true,
      flow: true,
    },
    filterHealth: demoFilterHealth,
  },
  inletReading: demoInletReading,
  outletReading: demoOutletReading,
  lastUpdated: new Date().toISOString(),
};

export const demoTreatmentStages = [
  { name: 'Source Check', status: 'COMPLETED', explanation: 'Inlet readings are available and within operating range.', timestamp: '08:32:04' },
  { name: 'Filtration', status: 'COMPLETED', explanation: 'Sediment and carbon stages completed.', timestamp: '08:32:28' },
  { name: 'UF', status: 'COMPLETED', explanation: 'Ultrafiltration stage completed.', timestamp: '08:32:51' },
  { name: 'UV', status: 'COMPLETED', explanation: 'UV module completed with sufficient health.', timestamp: '08:33:10' },
  { name: 'Outlet Verification', status: 'FAILED', explanation: 'Outlet turbidity is above the configured safe limit.', timestamp: '08:33:18' },
  { name: 'Safety Decision', status: 'FAILED', explanation: 'The safety gate rejected this output.', timestamp: '08:33:18' },
  { name: 'Release / Reject', status: 'FAILED', explanation: 'Simulated solenoid remains locked.', timestamp: '08:33:18' },
] as const;

export const demoSafetyDecision: SafetyDecision = {
  passed: false,
  state: 'REJECTED',
  rejectionCode: 'OUTLET_TURBIDITY_HIGH',
  rejectionReason: 'Outlet turbidity exceeds configured safe limit.',
  failedParameter: 'outlet.turbidity',
  failedValue: demoOutletReading.turbidity,
  threshold: demoThresholds.outlet.turbidity.max,
  timestamp: '2026-09-15T08:33:18.000Z',
};

export const demoSafetySummary = 'Output rejected: outlet turbidity is above the configured safe limit.';

export const demoAlerts: DemoAlert[] = [
  {
    id: 'A-201',
    title: 'Output rejected',
    message: 'Outlet turbidity is above the maximum configured threshold. Solenoid remains locked.',
    type: 'SAFETY',
    priority: 'CRITICAL',
    time: '2 min ago',
    affectedComponent: 'Outlet verification',
  },
  {
    id: 'A-202',
    title: 'Filter service reminder',
    message: 'Sediment cartridge health is below the recommended maintenance threshold.',
    type: 'FILTER',
    priority: 'WARNING',
    time: '18 min ago',
    affectedComponent: 'Sediment filter',
  },
  {
    id: 'A-203',
    title: 'Low battery',
    message: 'Battery reserve is below the safe operating threshold for a normal release cycle.',
    type: 'BATTERY',
    priority: 'WARNING',
    time: '24 min ago',
    affectedComponent: 'Power system',
  },
  {
    id: 'A-204',
    title: 'Maintenance scheduled',
    message: 'UV dose check due within 5 days.',
    type: 'MAINTENANCE',
    priority: 'INFO',
    time: 'Today, 07:45',
    affectedComponent: 'UV module',
  },
];

export const demoTreatmentRecords: DemoCycle[] = [
  {
    id: 'CYC-1028',
    timestamp: '2026-09-15 08:32',
    result: 'REJECTED',
    status: 'FAILED',
    volume: '0 L',
    reason: 'Outlet turbidity exceeds configured safe limit.',
    releaseStatus: 'LOCKED',
    recordStatus: 'LOGGED',
    recordHash: 'sha256:7e4a...a1028',
  },
  {
    id: 'CYC-1027',
    timestamp: '2026-09-15 08:05',
    result: 'VERIFIED',
    status: 'COMPLETE',
    volume: '12.4 L',
    reason: 'Parameters within configured limits',
    releaseStatus: 'RELEASED',
    recordStatus: 'VERIFIED',
    recordHash: 'sha256:19bc...a1027',
  },
  {
    id: 'CYC-1026',
    timestamp: '2026-09-14 21:12',
    result: 'LOCKED',
    status: 'FAILED',
    volume: '0 L',
    reason: 'Low battery reserve',
    releaseStatus: 'NOT_RELEASED',
    recordStatus: 'LOGGED',
    recordHash: 'sha256:5d91...a1026',
  },
];

export function evaluateDemoSafety(): SafetyDecision {
  const outletTurbidity = demoOutletReading.turbidity;
  if (outletTurbidity === null || outletTurbidity > demoThresholds.outlet.turbidity.max) {
    return demoSafetyDecision;
  }

  return {
    passed: true,
    state: 'VERIFIED',
    rejectionCode: null,
    rejectionReason: null,
    failedParameter: null,
    failedValue: null,
    threshold: null,
    timestamp: new Date().toISOString(),
  };
}
