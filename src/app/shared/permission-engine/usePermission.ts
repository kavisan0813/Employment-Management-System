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
import { permissionKey } from "./permissions";

/**
 * Check a single permission by module + action.
 *
 * @example
 * const canApproveLeave = usePermission("leave", "approve");
 * if (canApproveLeave) showApprovalButton();
 */
export function usePermission(module: string, action: string): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(module, action);
}

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

/**
 * Check if the user has ANY of the given permission keys.
 *
 * @example
 * const canSeeFinance = useHasAnyPermission([P.PAYROLL_VIEW, P.EXPENSES_VIEW]);
 */
export function useHasAnyPermission(keys: string[]): boolean {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(keys);
}

/**
 * Check if the user has ALL of the given permission keys.
 *
 * @example
 * const isFullAdmin = useHasAllPermissions([P.SETTINGS_FULL, P.MANAGE_ACCOUNT_MANAGE]);
 */
export function useHasAllPermissions(keys: string[]): boolean {
  const { hasAllPermissions } = usePermissions();
  return hasAllPermissions(keys);
}

/**
 * Non-hook version for use outside React components.
 * Takes the permission set directly instead of reading from context.
 *
 * @example
 * const perms = resolvePermissions(assignments);
 * if (checkPermission(perms, "leave", "approve")) { ... }
 */
export function checkPermission(
  permissions: Set<string>,
  module: string,
  action: string,
): boolean {
  return permissions.has(permissionKey(module, action));
}
