/**
 * Application error codes for consistent error handling
 */

export type ErrorCode =
  // Network
  | 'NET_OFFLINE'
  | 'NET_TIMEOUT'
  | 'NET_SERVER_ERROR'
  // Auth
  | 'AUTH_EXPIRED'
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_INVALID_CREDENTIALS'
  // Safety
  | 'SAFETY_ENGINE_FAILURE'
  // Sensor
  | 'SENSOR_DISCONNECTED'
  | 'SENSOR_INVALID_READING'
  // Database
  | 'DB_WRITE_FAILURE'
  | 'DB_READ_FAILURE'
  | 'DB_CONFLICT'
  // Sync
  | 'SYNC_CONFLICT'
  | 'SYNC_HASH_MISMATCH'
  | 'SYNC_QUEUE_FULL'
  // Input
  | 'INPUT_INVALID_THRESHOLD'
  | 'INPUT_VALIDATION_FAILED'
  // QR
  | 'QR_NOT_FOUND'
  | 'QR_GENERATION_FAILED'
  // Treatment
  | 'TREATMENT_ALREADY_ACTIVE'
  | 'TREATMENT_STAGE_FAILED';

/** Error metadata */
export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  recoverable: boolean;
}

/** Error definitions with user-friendly messages */
export const ERROR_DEFINITIONS: Record<ErrorCode, Omit<AppError, 'code'>> = {
  NET_OFFLINE: {
    message: 'Network connection lost',
    userMessage: "You're offline. Changes will sync when connected.",
    recoverable: true,
  },
  NET_TIMEOUT: {
    message: 'Network request timed out',
    userMessage: 'Request timed out. Please try again.',
    recoverable: true,
  },
  NET_SERVER_ERROR: {
    message: 'Server returned an error',
    userMessage: 'Server error. Please try again later.',
    recoverable: true,
  },
  AUTH_EXPIRED: {
    message: 'Authentication token expired',
    userMessage: 'Your session has expired. Please sign in again.',
    recoverable: true,
  },
  AUTH_UNAUTHORIZED: {
    message: 'Unauthorized access attempt',
    userMessage: 'You do not have permission to perform this action.',
    recoverable: false,
  },
  AUTH_INVALID_CREDENTIALS: {
    message: 'Invalid login credentials',
    userMessage: 'Invalid email or password. Please try again.',
    recoverable: true,
  },
  SAFETY_ENGINE_FAILURE: {
    message: 'Safety engine evaluation failed',
    userMessage: 'Safety system error. Water output has been locked for safety.',
    recoverable: false,
  },
  SENSOR_DISCONNECTED: {
    message: 'Sensor disconnected',
    userMessage: 'A sensor is disconnected. Check hardware connection.',
    recoverable: true,
  },
  SENSOR_INVALID_READING: {
    message: 'Invalid sensor reading received',
    userMessage: 'Sensor returned an invalid reading. Check calibration.',
    recoverable: true,
  },
  DB_WRITE_FAILURE: {
    message: 'Database write operation failed',
    userMessage: 'Unable to save record. It has been queued for later sync.',
    recoverable: true,
  },
  DB_READ_FAILURE: {
    message: 'Database read operation failed',
    userMessage: 'Unable to load data. Showing cached version.',
    recoverable: true,
  },
  DB_CONFLICT: {
    message: 'Database conflict detected',
    userMessage: 'A data conflict was detected. Please refresh.',
    recoverable: true,
  },
  SYNC_CONFLICT: {
    message: 'Synchronization conflict',
    userMessage: 'A sync conflict occurred. Server version has been kept.',
    recoverable: true,
  },
  SYNC_HASH_MISMATCH: {
    message: 'Hash chain integrity check failed',
    userMessage: 'Data integrity check failed. Contact administrator.',
    recoverable: false,
  },
  SYNC_QUEUE_FULL: {
    message: 'Sync queue is full',
    userMessage: 'Offline storage is nearly full. Please connect to sync.',
    recoverable: true,
  },
  INPUT_INVALID_THRESHOLD: {
    message: 'Invalid threshold value',
    userMessage: 'The threshold value is outside the acceptable range.',
    recoverable: true,
  },
  INPUT_VALIDATION_FAILED: {
    message: 'Input validation failed',
    userMessage: 'Please check your input and try again.',
    recoverable: true,
  },
  QR_NOT_FOUND: {
    message: 'QR record not found',
    userMessage: 'This QR code is invalid or the record was not found.',
    recoverable: false,
  },
  QR_GENERATION_FAILED: {
    message: 'QR code generation failed',
    userMessage: 'Unable to generate QR code. Please try again.',
    recoverable: true,
  },
  TREATMENT_ALREADY_ACTIVE: {
    message: 'Treatment cycle already in progress',
    userMessage: 'A treatment cycle is already running. Please wait for it to complete.',
    recoverable: false,
  },
  TREATMENT_STAGE_FAILED: {
    message: 'Treatment stage failed',
    userMessage: 'A treatment stage has failed. Water output has been locked.',
    recoverable: false,
  },
};

/** Creates a typed application error */
export function createAppError(code: ErrorCode): AppError {
  return { code, ...ERROR_DEFINITIONS[code] };
}
