import { lazy, Suspense } from "react";
import { usePermissions } from "../../shared/permission-engine/PermissionContext";
import { P } from "../../shared/permission-engine/permissions";

const SuperAdminDashboard = lazy(() =>
  import("./SuperAdminDashboard").then((m) => ({
    default: m.SuperAdminDashboard,
  })),
);
const HRDashboard = lazy(() =>
  import("./HRDashboard").then((m) => ({ default: m.HRDashboard })),
);
const FinanceDashboard = lazy(() =>
  import("./FinanceDashboard").then((m) => ({
    default: m.FinancePersonalDashboard,
  })),
);
const ManagerDashboard = lazy(() =>
  import("./ManagerDashboard").then((m) => ({
    default: m.ManagerPersonalDashboard,
  })),
);
const EmployeeDashboard = lazy(() =>
  import("./EmployeeDashboard").then((m) => ({ default: m.Dashboard })),
);

export default function DashboardWrapper() {
  const { hasPermissionKey } = usePermissions();

  return (
    <Suspense
      fallback={
        <div className="p-8 flex justify-center h-full items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      {hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE) ||
      hasPermissionKey(P.SETTINGS_FULL) ? (
        <SuperAdminDashboard />
      ) : hasPermissionKey(P.EMPLOYEES_MANAGE) ||
        hasPermissionKey(P.RECRUITMENT_FULL) ? (
        <HRDashboard />
      ) : hasPermissionKey(P.PAYROLL_FULL) ? (
        <FinanceDashboard />
      ) : hasPermissionKey(P.ATTENDANCE_APPROVE_TEAM) ||
        hasPermissionKey(P.LEAVE_APPROVE_TEAM) ? (
        <ManagerDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </Suspense>
  );
}

