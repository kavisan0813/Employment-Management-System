/**
 * ─────────────────────────────────────────────────────────────────
 *  PERMISSION GATE COMPONENT
 *
 *  Declarative wrapper component for conditional permission rendering.
 *  Uses the canonical `usePermissions()` hook.
 *
 *  Usage:
 *    <PermissionGate requires={P.EMPLOYEES_MANAGE} fallback={<ReadOnlyNotice />}>
 *      <AddEmployeeButton />
 *    </PermissionGate>
 * ─────────────────────────────────────────────────────────────────
 */

import { ReactNode } from "react";
import { usePermissions } from "./PermissionContext";

export interface PermissionGateProps {
  /** Single permission key required */
  requires?: string;
  /** Array of permission keys - user must hold ALL */
  requiresAll?: string[];
  /** Array of permission keys - user must hold ANY */
  requiresAny?: string[];
  /** Fallback content rendered if permission check fails (default: null) */
  fallback?: ReactNode;
  /** Content rendered if permission check passes */
  children: ReactNode;
}

export function PermissionGate({
  requires,
  requiresAll,
  requiresAny,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermissionKey, hasAllPermissions, hasAnyPermission } =
    usePermissions();

  if (requires && !hasPermissionKey(requires)) {
    return <>{fallback}</>;
  }

  if (requiresAll && requiresAll.length > 0 && !hasAllPermissions(requiresAll)) {
    return <>{fallback}</>;
  }

  if (requiresAny && requiresAny.length > 0 && !hasAnyPermission(requiresAny)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default PermissionGate;
