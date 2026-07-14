import { usePermissions, P } from "../../../shared/permission-engine";
import { SettingsProvider } from "./SettingsContext";
import { SettingsLayout } from "./SettingsLayout";

// Lazy-loaded settings pages for roles that use standalone forms
import { FinanceSettings } from "../../finance/workspace/FinanceSettings";
import { ManagerSettings } from "../../manager/workspace/ManagerSettings";

export function Settings() {
  const { hasPermissionKey } = usePermissions();

  // Finance users with full payroll access get the finance-specific settings
  if (
    hasPermissionKey(P.PAYROLL_FULL) &&
    !hasPermissionKey(P.SETTINGS_MANAGE)
  ) {
    return <FinanceSettings />;
  }

  // Manager-level users who can manage teams but not org settings
  if (
    hasPermissionKey(P.EXPENSES_APPROVE_TEAM) &&
    !hasPermissionKey(P.SETTINGS_MANAGE)
  ) {
    return <ManagerSettings />;
  }

  // Employee-only (self settings)
  if (
    hasPermissionKey(P.SETTINGS_SELF) &&
    !hasPermissionKey(P.SETTINGS_MANAGE)
  ) {
    return <SettingsLayout role="Employee" />;
  }

  // HR Manager — has manage but not full
  if (
    hasPermissionKey(P.SETTINGS_SELF) &&
    !hasPermissionKey(P.SETTINGS_FULL)
  ) {
    return (
      <SettingsProvider defaultTab="schedules">
        <SettingsLayout role="HR Manager" />
      </SettingsProvider>
    );
  }

  // Default to Super Admin / full settings
  return (
    <SettingsProvider defaultTab="company">
      <SettingsLayout role="Super Admin" />
    </SettingsProvider>
  );
}
