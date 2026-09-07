/**
 * ─────────────────────────────────────────────────────────────────
 *  usePermission() — The Core Hook
 *
 *  This hook is the ONLY way to check permissions in the UI.
 *  It replaces every `if (role === "HR Manager")` check.
 *
 *  Usage:
 *    const canManageEmployees = usePermission("employees", "manage");
 *    const canViewPayroll = usePermissionKey(P.PAYROLL_VIEW);
 * ─────────────────────────────────────────────────────────────────
 */

import { usePermissions } from "./PermissionContext";

/**
 * Check a single permission by its pre-built key.
 *
 * @example
 * import { P } from "./permissions";
 * const canViewPayroll = usePermissionKey(P.PAYROLL_VIEW);
 */
export function usePermissionKey(key: string): boolean {
  const { hasPermissionKey } = usePermissions();
  return hasPermissionKey(key);
}

export function usePermission(module: string, action: string): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(module, action);
}

export function useHasAnyPermission(keys: string[]): boolean {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(keys);
}

export function useHasAllPermissions(keys: string[]): boolean {
  const { hasAllPermissions } = usePermissions();
  return hasAllPermissions(keys);
}

export function checkPermission(
  userPermissions: Set<string>,
  key: string,
): boolean {
  return userPermissions.has(key);
}
