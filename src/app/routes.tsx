import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";

// Lazy-loaded page components for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Employees = lazy(() => import("./pages/Employees").then(m => ({ default: m.Employees })));
const EmployeeProfile = lazy(() => import("./pages/EmployeeProfile").then(m => ({ default: m.EmployeeProfile })));
const Attendance = lazy(() => import("./pages/Attendance").then(m => ({ default: m.Attendance })));
const Payroll = lazy(() => import("./pages/Payroll").then(m => ({ default: m.Payroll })));
const Recruitment = lazy(() => import("./pages/Recruitment").then(m => ({ default: m.Recruitment })));
const Performance = lazy(() => import("./pages/Performance").then(m => ({ default: m.Performance })));
const Reports = lazy(() => import("./pages/Reports").then(m => ({ default: m.Reports })));
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })));
const LeaveManagement = lazy(() => import("./pages/LeaveManagement").then(m => ({ default: m.LeaveManagement })));
const Departments = lazy(() => import("./pages/Departments").then(m => ({ default: m.Departments })));
const UserProfile = lazy(() => import("./pages/UserProfile").then(m => ({ default: m.UserProfile })));
const SmartSearch = lazy(() => import("./pages/SmartSearch"));
const ShiftSchedule = lazy(() => import("./pages/ShiftSchedule").then(m => ({ default: m.ShiftSchedule })));
const IncrementAppraisal = lazy(() => import("./pages/IncrementAppraisal").then(m => ({ default: m.IncrementAppraisal })));

// Loading fallback displayed while lazy chunks are fetched
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minHeight: "200px",
      opacity: 0.6,
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: "3px solid rgba(99, 102, 241, 0.2)",
        borderTopColor: "rgb(99, 102, 241)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

// Wraps a lazy component in Suspense
function lazyRoute(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: lazyRoute(Dashboard) },
      { path: "employees", element: lazyRoute(Employees) },
      { path: "employees/:id", element: lazyRoute(EmployeeProfile) },
      { path: "attendance", element: lazyRoute(Attendance) },
      { path: "payroll", element: lazyRoute(Payroll) },
      { path: "recruitment", element: lazyRoute(Recruitment) },
      { path: "performance", element: lazyRoute(Performance) },
      { path: "reports", element: lazyRoute(Reports) },
      { path: "settings", element: lazyRoute(Settings) },
      { path: "leave", element: lazyRoute(LeaveManagement) },
      { path: "departments", element: lazyRoute(Departments) },
      { path: "profile", element: lazyRoute(UserProfile) },
      { path: "smart-search", element: lazyRoute(SmartSearch) },
      { path: "schedule", element: lazyRoute(ShiftSchedule) },
      { path: "appraisal", element: lazyRoute(IncrementAppraisal) },
    ],
  },
]);
