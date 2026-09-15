/**
 * Alert system type definitions
 */

import type { RejectionCode } from './safety';

/** Alert severity levels */
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

/** Alert categories */
export type AlertCategory = 'SAFETY' | 'MAINTENANCE' | 'SENSOR' | 'BATTERY' | 'NETWORK' | 'CALIBRATION';

/** Alert lifecycle status */
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

/** Complete alert record */
export interface Alert {
  id: string;
  deviceId: string;
  treatmentCycleId: string | null;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  rejectionCode: RejectionCode | null;
  status: AlertStatus;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

/** Severity display config */
export const SEVERITY_CONFIG: Record<AlertSeverity, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  CRITICAL: { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50', icon: 'AlertTriangle' },
  WARNING: { label: 'Warning', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: 'AlertCircle' },
  INFO: { label: 'Info', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: 'Info' },
};
