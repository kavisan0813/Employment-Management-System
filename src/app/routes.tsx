import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AuthSuccess } from "./pages/AuthSuccess";
import { useAuth } from "./context/AuthContext";

// Lazy-loaded page components for code splitting
const Dashboard          = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Employees          = lazy(() => import("./pages/Employees").then(m => ({ default: m.Employees })));
const EmployeeProfile    = lazy(() => import("./pages/EmployeeProfile").then(m => ({ default: m.EmployeeProfile })));
const Attendance         = lazy(() => import("./pages/Attendance").then(m => ({ default: m.Attendance })));
const Payroll            = lazy(() => import("./pages/Payroll").then(m => ({ default: m.Payroll })));
const Expenses           = lazy(() => import("./pages/ExpenseManagement").then(m => ({ default: m.Expenses })));
const Recruitment        = lazy(() => import("./pages/Recruitment").then(m => ({ default: m.Recruitment })));
const Performance        = lazy(() => import("./pages/Performance").then(m => ({ default: m.Performance })));
const Reports            = lazy(() => import("./pages/Reports").then(m => ({ default: m.Reports })));
const Settings           = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })));
const LeaveManagement    = lazy(() => import("./pages/LeaveManagement").then(m => ({ default: m.LeaveManagement })));
const Departments        = lazy(() => import("./pages/Departments").then(m => ({ default: m.Departments })));
const UserProfile        = lazy(() => import("./pages/UserProfile").then(m => ({ default: m.UserProfile })));
const SmartSearch        = lazy(() => import("./pages/SmartSearch"));
const ShiftSchedule      = lazy(() => import("./pages/ShiftSchedule").then(m => ({ default: m.ShiftSchedule })));
const IncrementAppraisal = lazy(() => import("./pages/IncrementAppraisal").then(m => ({ default: m.IncrementAppraisal })));
const Onboarding         = lazy(() => import("./pages/Onboarding").then(m => ({ default: m.Onboarding })));
const Training           = lazy(() => import("./pages/Training").then(m => ({ default: m.Training })));
const Documents          = lazy(() => import("./pages/Documents").then(m => ({ default: m.Documents })));
const Notifications      = lazy(() => import("./pages/Notifications").then(m => ({ default: m.Notifications })));
const EmployeeSelfService = lazy(() => import("./pages/EmployeeSelfService").then(m => ({ default: m.EmployeeSelfService })));
const ReimbursementHistory = lazy(() => import("./pages/ReimbursementHistory").then(m => ({ default: m.ReimbursementHistory })));
const ExpensePolicy      = lazy(() => import("./pages/ExpensePolicy").then(m => ({ default: m.ExpensePolicy })));
const ExpenseSupport     = lazy(() => import("./pages/ExpenseSupport").then(m => ({ default: m.ExpenseSupport })));
const EmployeeDocuments  = lazy(() => import("./pages/EmployeeDocuments").then(m => ({ default: m.EmployeeDocuments })));
const EmployeePerformance = lazy(() => import("./pages/EmployeePerformance").then(m => ({ default: m.EmployeePerformance })));
const EmployeeSchedule    = lazy(() => import("./pages/EmployeeSchedule").then(m => ({ default: m.EmployeeSchedule })));
const EmployeeTraining    = lazy(() => import("./pages/EmployeeTraining").then(m => ({ default: m.EmployeeTraining })));
const EmployeeAnnouncements = lazy(() => import("./pages/EmployeeAnnouncements").then(m => ({ default: m.EmployeeAnnouncements })));
const EmployeeSupport     = lazy(() => import("./pages/EmployeeSupport").then(m => ({ default: m.EmployeeSupport })));
const EmployeeDirectory     = lazy(() => import("./pages/EmployeeDirectory").then(m => ({ default: m.EmployeeDirectory })));
const EmployeePayslips      = lazy(() => import("./pages/EmployeePayslips").then(m => ({ default: m.EmployeePayslips })));

// Loading spinner
function PageLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "200px", opacity: 0.6 }}>
      <div style={{ width: 32, height: 32, border: "3px solid rgba(16,185,129,0.2)", borderTopColor: "#10B981", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function lazyRoute(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ── AuthGuard: redirect to login if not authenticated ────────
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

// ── RoleGuard: redirect to /403 if user lacks access ─────────
const RoleGuard = ({ children }: { children: React.ReactNode }) => {
  const { hasAccess } = useAuth();
  const location = useLocation();

  if (!hasAccess(location.pathname)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
};

// ── 403 Access Denied page ───────────────────────────────────
function AccessDenied() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div
        className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl"
        style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)" }}
      >
        <span style={{ fontSize: "40px" }}>🔒</span>
      </div>
      <h2 style={{ fontSize: "28px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.5px", marginBottom: "12px" }}>
        Access Denied
      </h2>
      <p style={{ fontSize: "15px", color: "var(--muted-foreground)", maxWidth: "400px", lineHeight: 1.6 }}>
        Your role <strong style={{ color: "var(--foreground)" }}>{user?.role}</strong> does not have permission to view this page.
        Please contact your administrator if you believe this is a mistake.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}
      >
        Return to Dashboard
      </a>
    </div>
  );
}

// ── Wrap with both guards ────────────────────────────────────
function Protected({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard>
        {children}
      </RoleGuard>
    </AuthGuard>
  );
}

// ── Helper for protected lazy routes ─────────────────────────
function protectedRoute(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Protected>
      {lazyRoute(Component)}
    </Protected>
  );
}

// ── Performance Wrapper: role-based view ──────────────────────
function PerformanceWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeePerformance);
  }
  return lazyRoute(Performance);
}

// ── Schedule Wrapper: role-based view ─────────────────────────
function ScheduleWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeSchedule);
  }
  return lazyRoute(ShiftSchedule);
}

// ── Training Wrapper: role-based view ─────────────────────────
function TrainingWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeTraining);
  }
  return lazyRoute(Training);
}

// ── Notifications Wrapper: role-based view ────────────────────
function NotificationsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeAnnouncements);
  }
  return lazyRoute(Notifications);
}

// ── Directory Wrapper: role-based view ────────────────────────
function DirectoryWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeDirectory);
  }
  return lazyRoute(Employees);
}

// ── Payroll Wrapper: role-based view ──────────────────────────
function PayrollWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeePayslips);
  }
  return lazyRoute(Payroll);
}

export const router = createBrowserRouter([
  { path: "/login",          Component: Login },
  { path: "/signup",         Component: Signup },
  { path: "/signup-success", Component: AuthSuccess },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { path: "403",             element: <AccessDenied /> },
      { index: true,             element: protectedRoute(Dashboard) },
      { path: "employees",       element: <Protected><DirectoryWrapper /></Protected> },
      { path: "employees/:id",   element: protectedRoute(EmployeeProfile) },
      { path: "attendance",      element: protectedRoute(Attendance) },
      { path: "payroll",         element: <Protected><PayrollWrapper /></Protected> },
      { path: "payslips",        element: protectedRoute(EmployeePayslips) },
      { path: "expenses",        element: protectedRoute(Expenses) },
      { path: "recruitment",     element: protectedRoute(Recruitment) },
      { path: "performance",     element: <Protected><PerformanceWrapper /></Protected> },
      { path: "reports",         element: protectedRoute(Reports) },
      { path: "settings",        element: protectedRoute(Settings) },
      { path: "leave",           element: protectedRoute(LeaveManagement) },
      { path: "departments",     element: protectedRoute(Departments) },
      { path: "profile",         element: protectedRoute(UserProfile) },
      { path: "smart-search",    element: protectedRoute(SmartSearch) },
      { path: "schedule",        element: <Protected><ScheduleWrapper /></Protected> },
      { path: "appraisal",       element: protectedRoute(IncrementAppraisal) },
      { path: "onboarding",      element: protectedRoute(Onboarding) },
      { path: "documents",       element: protectedRoute(Documents) },
      { path: "training",        element: <Protected><TrainingWrapper /></Protected> },
      { path: "notifications",   element: <Protected><NotificationsWrapper /></Protected> },
      { path: "self-service",    element: protectedRoute(EmployeeSelfService) },
      { path: "reimbursement-history", element: protectedRoute(ReimbursementHistory) },
      { path: "expense-policy",  element: protectedRoute(ExpensePolicy) },
      { path: "expense-support", element: protectedRoute(ExpenseSupport) },
      { path: "support",         element: protectedRoute(EmployeeSupport) },
      { path: "my-documents",    element: protectedRoute(EmployeeDocuments) },
      { path: "goals",           element: <Protected><PerformanceWrapper /></Protected> },
    ],
  },
]);
