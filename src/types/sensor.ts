/**
 * Sensor-related type definitions for JalSafe Mini
 */

/** A single sensor reading from either inlet or outlet */
export interface SensorReading {
  /** pH level (0-14). null = sensor disconnected */
  ph: number | null;
  /** Total dissolved solids in mg/L. null = sensor disconnected */
  tds: number | null;
  /** Turbidity in NTU. null = sensor disconnected */
  turbidity: number | null;
  /** Temperature in °C. null = sensor disconnected */
  temperature: number | null;
  /** Flow rate in L/h. null = sensor disconnected */
  flowRate: number | null;
}

/** Where a sensor reading was taken */
export type ReadingPoint = 'INLET' | 'OUTLET';

/** Timestamped sensor reading */
export interface TimestampedReading extends SensorReading {
  recordedAt: string; // ISO 8601
  readingPoint: ReadingPoint;
  isValid: boolean;
}

/** Sensor connectivity status */
export interface SensorConnectivity {
  ph: boolean;
  tds: boolean;
  turbidity: boolean;
  temperature: boolean;
  flow: boolean;
}

/** Creates a default (all connected) sensor connectivity object */
export function defaultSensorConnectivity(): SensorConnectivity {
  return { ph: true, tds: true, turbidity: true, temperature: true, flow: true };
}

/** Checks if a sensor reading has any disconnected sensors */
export function hasDisconnectedSensors(reading: SensorReading): boolean {
  return (
    reading.ph === null ||
    reading.tds === null ||
    reading.turbidity === null ||
    reading.temperature === null ||
    reading.flowRate === null
  );
}
