/**
 * ─────────────────────────────────────────────────────────────────
 *  Permission Engine — Barrel Export
 * ─────────────────────────────────────────────────────────────────
 */

// Permission catalog
export { MODULES, ACTIONS, P, permissionKey } from "./permissions";
export type { ModuleId, ActionId, PermissionKey } from "./permissions";

// Roles & assignments
export {
  ROLE_IDS,
  ROLE_TEMPLATES,
  ROLE_HIERARCHY,
  LEGACY_ROLE_MAP,
  resolvePermissions,
  createMockAssignment,
} from "./roles";
export type {
  ScopeType,
  RoleAssignment,
  RoleTemplate,
  SystemRoleId,
} from "./roles";

// Context & hooks
export { PermissionProvider, usePermissions } from "./PermissionContext";
export {
  usePermission,
  usePermissionKey,
  useHasAnyPermission,
  useHasAllPermissions,
  checkPermission,
} from "./usePermission";

// Declarative gate component
export { PermissionGate } from "./PermissionGate";

// Navigation
export {
  filterNavigation,
  hasRequiredPermission,
  FULL_NAVIGATION,
} from "./navigation";
export type { NavItem, NavGroup } from "./navigation";
