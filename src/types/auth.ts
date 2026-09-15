/**
 * Authentication and authorization type definitions
 */

/** Application roles */
export type UserRole = 'ADMIN' | 'TECHNICIAN' | 'COMMUNITY_OPERATOR' | 'VIEWER';

/** User profile (extends Supabase auth.users) */
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string | null;
  communityId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Auth session state */
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/** Role-based permission check */
export function canModifyThresholds(role: UserRole): boolean {
  return role === 'ADMIN';
}

export function canPerformMaintenance(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'TECHNICIAN';
}

export function canStartTreatment(role: UserRole): boolean {
  return role !== 'VIEWER';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'ADMIN';
}

export function canManageDevices(role: UserRole): boolean {
  return role === 'ADMIN';
}

export function canAcknowledgeAlerts(role: UserRole): boolean {
  return role !== 'VIEWER';
}
