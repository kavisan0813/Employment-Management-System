import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Employees } from "./pages/Employees";
import { EmployeeProfile } from "./pages/EmployeeProfile";
import { Attendance } from "./pages/Attendance";
import { Payroll } from "./pages/Payroll";
import { Recruitment } from "./pages/Recruitment";
import { Performance } from "./pages/Performance";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { LeaveManagement } from "./pages/LeaveManagement";
import { Departments } from "./pages/Departments";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "employees", Component: Employees },
      { path: "employees/:id", Component: EmployeeProfile },
      { path: "attendance", Component: Attendance },
      { path: "payroll", Component: Payroll },
      { path: "recruitment", Component: Recruitment },
      { path: "performance", Component: Performance },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
      { path: "leave", Component: LeaveManagement },
      { path: "departments", Component: Departments },
    ],
  },
]);
