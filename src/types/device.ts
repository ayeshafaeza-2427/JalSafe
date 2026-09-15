/**
 * Device-related type definitions for JalSafe Mini
 */

import type { SensorReading, SensorConnectivity } from './sensor';
import type { SafetyState } from './safety';

/** Solenoid valve states */
export type SolenoidState = 'LOCKED' | 'UNLOCKED' | 'FAULT';

/** Device operational status */
export type DeviceOperationalStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';

/** Network connectivity status */
export type NetworkStatus = 'ONLINE' | 'OFFLINE';

/** Calibration status */
export type CalibrationStatus = 'VALID' | 'EXPIRING' | 'EXPIRED';

/** Filter cartridge types (matching PRD color codes) */
export type CartridgeType = 'SEDIMENT' | 'CARBON' | 'UF' | 'UV' | 'TDS_MODULE';

/** Filter cartridge color codes from PRD */
export const CARTRIDGE_COLORS: Record<CartridgeType, string> = {
  SEDIMENT: 'RED',
  CARBON: 'BLACK',
  UF: 'BLUE',
  UV: 'VIOLET',
  TDS_MODULE: 'YELLOW',
};

/** Tailwind color classes for cartridge types */
export const CARTRIDGE_COLOR_CLASSES: Record<CartridgeType, string> = {
  SEDIMENT: 'bg-red-500',
  CARBON: 'bg-gray-800',
  UF: 'bg-blue-500',
  UV: 'bg-violet-500',
  TDS_MODULE: 'bg-yellow-500',
};

/** Filter health for each cartridge type */
export interface FilterHealth {
  sediment: number;   // 0-100
  carbon: number;     // 0-100
  uf: number;         // 0-100
  uv: number;         // 0-100
}

/** Complete device health information */
export interface DeviceHealth {
  batteryLevel: number;         // 0-100
  solarCharging: boolean;
  solarVoltage: number;
  uvHealth: number;             // 0-100
  calibrationStatus: CalibrationStatus;
  calibrationExpiresAt: string | null;
  sensorConnectivity: SensorConnectivity;
  filterHealth: FilterHealth;
}

/** Complete device status */
export interface DeviceStatus {
  deviceId: string;
  serialNumber: string;
  name: string;
  firmwareVersion: string;
  safetyState: SafetyState;
  solenoidState: SolenoidState;
  pumpActive: boolean;
  networkStatus: NetworkStatus;
  health: DeviceHealth;
  inletReading: SensorReading;
  outletReading: SensorReading;
  lastUpdated: string;
}

/** Device configuration */
export interface DeviceConfig {
  id: string;
  serialNumber: string;
  name: string;
  communityId: string | null;
  firmwareVersion: string;
}
