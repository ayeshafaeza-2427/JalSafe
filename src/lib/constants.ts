/**
 * Application-wide constants for JalSafe Mini
 */

/** Application metadata */
export const APP_NAME = 'JalSafe';
export const APP_TAGLINE = 'Purify Water. Prove Safety. Protect Communities.';
export const APP_VERSION = '1.0.0';

/** Simulator update interval */
export const SIMULATOR_UPDATE_INTERVAL_MS = 1000;

/** Demo mode stage durations (faster for presentations) */
export const DEMO_MODE_SPEED_MULTIPLIER = 0.4; // 40% of normal duration

/** Sync settings */
export const SYNC_RETRY_MAX = 10;
export const SYNC_RETRY_BASE_MS = 1000;
export const SYNC_RETRY_MAX_MS = 30000;

/** Heartbeat interval for online detection */
export const HEARTBEAT_INTERVAL_MS = 30000;

/** Calibration defaults */
export const CALIBRATION_INTERVAL_DAYS = 30;
export const CALIBRATION_WARNING_DAYS = 5;

/** Filter health thresholds for alerts */
export const FILTER_WARNING_THRESHOLD = 20;
export const FILTER_CRITICAL_THRESHOLD = 10;

/** Battery thresholds for alerts */
export const BATTERY_WARNING_THRESHOLD = 20;
export const BATTERY_CRITICAL_THRESHOLD = 10;

/** QR code settings */
export const QR_TOKEN_LENGTH = 12;

/** Genesis hash for the first record in a hash chain */
export const GENESIS_HASH = 'GENESIS_0000000000000000000000000000000000000000000000000000000000000000';

/** Disclaimer text for QR treatment records */
export const QR_DISCLAIMER = 
  'This is a treatment record from a JalSafe device. ' +
  'It records the device measurements at the time of treatment. ' +
  'It is NOT a substitute for accredited laboratory water testing.';

/** Sensor parameter display names and units */
export const SENSOR_PARAMS = {
  ph: { name: 'pH', unit: 'pH', precision: 1 },
  tds: { name: 'TDS', unit: 'mg/L', precision: 0 },
  turbidity: { name: 'Turbidity', unit: 'NTU', precision: 2 },
  temperature: { name: 'Temperature', unit: '°C', precision: 1 },
  flowRate: { name: 'Flow Rate', unit: 'L/h', precision: 1 },
} as const;
