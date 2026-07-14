import type { ReactNode } from "react";
import { usePermissions } from "./PermissionContext";
import { permissionKey as makeKey } from "./permissions";

interface PermissionGateProps {
  module?: string;
  action?: string;
  permissionKey?: string;
  anyOf?: string[];
  allOf?: string[];
  fallback?: ReactNode;
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

  const allowed = (() => {
    if (permissionKey) return hasPermissionKey(permissionKey);
    if (module && action) return hasPermissionKey(makeKey(module, action));
    if (anyOf && anyOf.length > 0) return hasAnyPermission(anyOf);
    if (allOf && allOf.length > 0) return hasAllPermissions(allOf);
    return true;
  })();

  return <>{allowed ? children : fallback}</>;
}
