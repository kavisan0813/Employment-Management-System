import { Navigate } from "react-router";
import { usePermissions } from "../../../shared/permission-engine/PermissionContext";
import { P } from "../../../shared/permission-engine/permissions";
import { SettingsProvider } from "./SettingsContext";
import { SettingsLayout } from "./SettingsLayout";

// Lazy-loaded settings pages for roles that use standalone forms
import { FinanceSettings } from "../../finance/workspace/FinanceSettings";
import { ManagerSettings } from "../../manager/workspace/ManagerSettings";

export function Settings() {
  const { hasPermissionKey } = usePermissions();

  // 1. Super Admin / Platform Admin with full settings permission
  if (hasPermissionKey(P.SETTINGS_FULL) || hasPermissionKey(P.PLATFORM_ADMIN_FULL)) {
    return (
      <SettingsProvider defaultTab="company">
        <SettingsLayout role="Super Admin" />
      </SettingsProvider>
    );
  }

  // 2. HR Manager — has manage settings permission
  if (hasPermissionKey(P.SETTINGS_MANAGE)) {
    return (
      <SettingsProvider defaultTab="schedules">
        <SettingsLayout role="HR Manager" />
      </SettingsProvider>
    );
  }

  // 3. Finance users with full payroll access get finance-specific settings
  if (hasPermissionKey(P.PAYROLL_FULL)) {
    return <FinanceSettings />;
  }

  // 4. Manager-level users who can approve team expenses get manager settings
  if (hasPermissionKey(P.EXPENSES_APPROVE_TEAM)) {
    return <ManagerSettings />;
  }

  // 5. Employee-only self-service settings
  if (hasPermissionKey(P.SETTINGS_SELF)) {
    return <SettingsLayout role="Employee" />;
  }

  // 6. User with no valid settings permission -> Access Denied / 403
  return <Navigate to="/403" replace />;
}

