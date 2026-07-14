/**
 * ─────────────────────────────────────────────────────────────────
 *  PERMISSION GATE — Declarative Permission-Based Rendering
 *
 *  Wraps children in a permission check. Renders children only
 *  if the current user has the required permission(s).
 *
 *  Replaces patterns like:
 *    if (role === "Finance") return <FinanceView />;
 *  with:
 *    <PermissionGate permissionKey={P.PAYROLL_FULL}>
 *      <FinanceView />
 *    </PermissionGate>
 * ─────────────────────────────────────────────────────────────────
 */

import type { ReactNode } from "react";
import { usePermissions } from "./PermissionContext";
import { permissionKey as makeKey } from "./permissions";

interface PermissionGateProps {
  /** Module to check (used with `action`) */
  module?: string;
  /** Action to check (used with `module`) */
  action?: string;
  /** Pre-built permission key (alternative to module+action) */
  permissionKey?: string;
  /** Multiple keys — user needs ANY of these */
  anyOf?: string[];
  /** Multiple keys — user needs ALL of these */
  allOf?: string[];
  /** What to render if permission is denied */
  fallback?: ReactNode;
  /** Children to render if permission is granted */
  children: ReactNode;
}

export function PermissionGate({
  module,
  action,
  permissionKey,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermissionKey, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let allowed = false;

  if (permissionKey) {
    allowed = hasPermissionKey(permissionKey);
  } else if (module && action) {
    allowed = hasPermissionKey(makeKey(module, action));
  } else if (anyOf && anyOf.length > 0) {
    allowed = hasAnyPermission(anyOf);
  } else if (allOf && allOf.length > 0) {
    allowed = hasAllPermissions(allOf);
  } else {
    // No permission specified → always render (fail-open for convenience)
    allowed = true;
  }

  return <>{allowed ? children : fallback}</>;
}
