import { useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { EmployeeSelfService } from "./EmployeeSelfService";

import { HRDashboard } from "../components/dashboards/HRDashboard";
import { FinanceDashboard } from "../components/dashboards/FinanceDashboard";
import { ManagerDashboard } from "../components/dashboards/ManagerDashboard";

export function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();

  // If user is Employee, always show ESS
  if (user?.role === "Employee") {
    return <EmployeeSelfService />;
  }

  // Determine dashboard based on path
  const path = location.pathname;

  if (path.includes("/hr/dashboard")) {
    return <HRDashboard />;
  }

  if (path.includes("/finance/dashboard")) {
    return <FinanceDashboard />;
  }

  if (path.includes("/manager/dashboard")) {
    return <ManagerDashboard />;
  }

  // Fallback for root path or unexpected paths

  if (user?.role === "HR Manager") return <HRDashboard />;
  if (user?.role === "Finance") return <FinanceDashboard />;
  if (user?.role === "Manager") return <ManagerDashboard />;

  return <EmployeeSelfService />;
}
