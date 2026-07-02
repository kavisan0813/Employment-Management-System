import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { SettingsProvider } from "./SettingsContext";
import { SettingsLayout } from "./SettingsLayout";

// Lazy-loaded settings pages for roles that use standalone forms
import { FinanceSettings } from "../../finance/workspace/FinanceSettings";
import { ManagerSettings } from "../../manager/workspace/ManagerSettings";

export function Settings() {
  const { user } = useAuth();
  const role = user?.role || "Super Admin";

  if (role === "Finance") {
    return <FinanceSettings />;
  }

  if (role === "Manager") {
    return <ManagerSettings />;
  }

  if (role === "Employee") {
    return <SettingsLayout role="Employee" />;
  }

  if (role === "HR Manager") {
    return (
      <SettingsProvider defaultTab="schedules">
        <SettingsLayout role="HR Manager" />
      </SettingsProvider>
    );
  }

  // Default to Super Admin
  return (
    <SettingsProvider defaultTab="company">
      <SettingsLayout role="Super Admin" />
    </SettingsProvider>
  );
}
