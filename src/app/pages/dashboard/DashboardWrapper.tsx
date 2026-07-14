import { lazy, Suspense } from "react";
import { useAuth } from "../../context/AuthContext";

const SuperAdminDashboard = lazy(() => import("./SuperAdminDashboard").then(m => ({ default: m.SuperAdminDashboard })));
const HRDashboard = lazy(() => import("./HRDashboard").then(m => ({ default: m.HRDashboard })));
const FinanceDashboard = lazy(() => import("./FinanceDashboard").then(m => ({ default: m.FinancePersonalDashboard })));
const ManagerDashboard = lazy(() => import("./ManagerDashboard").then(m => ({ default: m.ManagerPersonalDashboard })));
const EmployeeDashboard = lazy(() => import("./EmployeeDashboard").then(m => ({ default: m.Dashboard })));

export default function DashboardWrapper() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <Suspense
      fallback={
        <div className="p-8 flex justify-center h-full items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      { role === "Super Admin" ? (
        <SuperAdminDashboard />
      ) : role === "HR Manager" ? (
        <HRDashboard />
      ) : role === "Finance" ? (
        <FinanceDashboard />
      ) : role === "Manager" ? (
        <ManagerDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </Suspense>
  );
}
