import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AuthSuccess } from "./pages/AuthSuccess";
import { useAuth } from "./context/AuthContext";

// Lazy-loaded page components for code splitting
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Employees = lazy(() =>
  import("./pages/Employees").then((m) => ({ default: m.Employees })),
);
const EmployeeProfile = lazy(() =>
  import("./pages/EmployeeProfile").then((m) => ({
    default: m.EmployeeProfile,
  })),
);
const Attendance = lazy(() =>
  import("./pages/Attendance").then((m) => ({ default: m.Attendance })),
);
const Payroll = lazy(() =>
  import("./pages/Payroll").then((m) => ({ default: m.Payroll })),
);
const Expenses = lazy(() =>
  import("./pages/ExpenseManagement").then((m) => ({ default: m.Expenses })),
);
const Recruitment = lazy(() =>
  import("./pages/Recruitment").then((m) => ({ default: m.Recruitment })),
);
const Offboarding = lazy(() =>
  import("./pages/Offboarding").then((m) => ({ default: m.Offboarding })),
);
const Performance = lazy(() =>
  import("./pages/Performance").then((m) => ({ default: m.Performance })),
);
const Reports = lazy(() =>
  import("./pages/Reports").then((m) => ({ default: m.Reports })),
);
const Settings = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Settings })),
);
const LeaveManagement = lazy(() =>
  import("./pages/LeaveManagement").then((m) => ({
    default: m.LeaveManagement,
  })),
);
const Departments = lazy(() =>
  import("./pages/Departments").then((m) => ({ default: m.Departments })),
);
const UserProfile = lazy(() =>
  import("./pages/UserProfile").then((m) => ({ default: m.UserProfile })),
);
const SmartSearch = lazy(() => import("./pages/SmartSearch"));
const ShiftSchedule = lazy(() =>
  import("./pages/ShiftSchedule").then((m) => ({ default: m.ShiftSchedule })),
);
const IncrementAppraisal = lazy(() =>
  import("./pages/IncrementAppraisal").then((m) => ({
    default: m.IncrementAppraisal,
  })),
);
const Onboarding = lazy(() =>
  import("./pages/Onboarding").then((m) => ({ default: m.Onboarding })),
);
const Training = lazy(() =>
  import("./pages/Training").then((m) => ({ default: m.Training })),
);
const Documents = lazy(() =>
  import("./pages/Documents").then((m) => ({ default: m.Documents })),
);
const Notifications = lazy(() =>
  import("./pages/Notifications").then((m) => ({ default: m.Notifications })),
);
const EmployeeSelfService = lazy(() =>
  import("./pages/EmployeeSelfService").then((m) => ({
    default: m.EmployeeSelfService,
  })),
);
const MyAssets = lazy(() =>
  import("./pages/MyAssets").then((m) => ({ default: m.MyAssets })),
);
const EmployeeHRRequests = lazy(() => import("./pages/EmployeeHRRequests"));
const ReimbursementHistory = lazy(() =>
  import("./pages/ReimbursementHistory").then((m) => ({
    default: m.ReimbursementHistory,
  })),
);
const ExpensePolicy = lazy(() =>
  import("./pages/ExpensePolicy").then((m) => ({ default: m.ExpensePolicy })),
);
const ExpenseSupport = lazy(() =>
  import("./pages/ExpenseSupport").then((m) => ({ default: m.ExpenseSupport })),
);
const EmployeeDocuments = lazy(() =>
  import("./pages/EmployeeDocuments").then((m) => ({
    default: m.EmployeeDocuments,
  })),
);
const EmployeePerformance = lazy(() =>
  import("./pages/EmployeePerformance").then((m) => ({
    default: m.EmployeePerformance,
  })),
);
const EmployeeSchedule = lazy(() =>
  import("./pages/EmployeeSchedule").then((m) => ({
    default: m.EmployeeSchedule,
  })),
);
const EmployeeTraining = lazy(() =>
  import("./pages/EmployeeTraining").then((m) => ({
    default: m.EmployeeTraining,
  })),
);
const EmployeeAnnouncements = lazy(() =>
  import("./pages/EmployeeAnnouncements").then((m) => ({
    default: m.EmployeeAnnouncements,
  })),
);
const EmployeeSupport = lazy(() =>
  import("./pages/EmployeeSupport").then((m) => ({
    default: m.EmployeeSupport,
  })),
);
const EmployeeRegularizationHistory = lazy(
  () => import("./pages/EmployeeRegularizationHistory"),
);
const EmployeeExit = lazy(() =>
  import("./pages/EmployeeExit").then((m) => ({ default: m.EmployeeExit })),
);
const MyOnboarding = lazy(() =>
  import("./pages/MyOnboarding").then((m) => ({ default: m.MyOnboarding })),
);
const EmployeeNotifications = lazy(
  () => import("./pages/EmployeeNotifications"),
);
const EmployeeDirectory = lazy(() =>
  import("./pages/EmployeeDirectory").then((m) => ({
    default: m.EmployeeDirectory,
  })),
);
const EmployeePayslips = lazy(() =>
  import("./pages/EmployeePayslips").then((m) => ({
    default: m.EmployeePayslips,
  })),
);
const EmployeeSettings = lazy(() =>
  import("./pages/EmployeeSettings")
);

// Finance Components
const FinanceExpenses = lazy(() =>
  import("./pages/FinanceExpenses").then((m) => ({ default: m.FinanceExpenses })),
);
const FinancePayroll = lazy(() =>
  import("./pages/FinancePayroll").then((m) => ({ default: m.FinancePayroll })),
);
const FinanceReports = lazy(() =>
  import("./pages/FinanceReports").then((m) => ({ default: m.FinanceReports })),
);
const FinanceAssetCostReport = lazy(() =>
  import("./pages/FinanceAssetCostReport").then((m) => ({ default: m.FinanceAssetCostReport })),
);
const FinanceOnboarding = lazy(() =>
  import("./pages/FinanceOnboarding").then((m) => ({ default: m.FinanceOnboarding })),
);
const FinancePayrollSettings = lazy(() =>
  import("./pages/FinancePayrollSettings").then((m) => ({ default: m.FinancePayrollSettings })),
);
const FinanceSettlements = lazy(() =>
  import("./pages/FinanceSettlements").then((m) => ({ default: m.FinanceSettlements })),
);
const FinanceAttendance = lazy(() =>
  import("./pages/FinanceAttendance").then((m) => ({ default: m.FinanceAttendance })),
);
const FinanceDocuments = lazy(() =>
  import("./pages/FinanceDocuments").then((m) => ({ default: m.FinanceDocuments })),
);
const FinanceMyExpenses = lazy(() =>
  import("./pages/FinanceMyExpenses").then((m) => ({ default: m.FinanceMyExpenses })),
);
const FinancePayslips = lazy(() =>
  import("./pages/FinancePayslips").then((m) => ({ default: m.FinancePayslips })),
);
const FinanceProfile = lazy(() =>
  import("./pages/FinanceProfile").then((m) => ({ default: m.FinanceProfile })),
);
const FinancePerformance = lazy(() =>
  import("./pages/FinancePerformance").then((m) => ({ default: m.FinancePerformance })),
);
const FinanceGoals = lazy(() =>
  import("./pages/FinanceGoals").then((m) => ({ default: m.FinanceGoals })),
);
const FinanceSupport = lazy(() =>
  import("./pages/FinanceSupport").then((m) => ({ default: m.FinanceSupport })),
);
const FinanceEmployees = lazy(() =>
  import("./pages/FinanceEmployees").then((m) => ({ default: m.FinanceEmployees })),
);
const FinanceIncrement = lazy(() =>
  import("./pages/FinanceIncrement").then((m) => ({ default: m.FinanceIncrement })),
);
const FinanceDepartments = lazy(() =>
  import("./pages/FinanceDepartments").then((m) => ({ default: m.FinanceDepartments })),
);
const FinancePersonalDashboard = lazy(() =>
  import("./pages/FinancePersonalDashboard").then((m) => ({ default: m.FinancePersonalDashboard })),
);


// Manager Team & Personal Components
const ManagerAttendance = lazy(() =>
  import("./pages/manager/ManagerAttendance").then((m) => ({ default: m.ManagerAttendance })),
);
const ManagerTeamSchedule = lazy(() =>
  import("./pages/manager/ManagerTeamSchedule").then((m) => ({ default: m.ManagerTeamSchedule })),
);
const ManagerLeaveApprovals = lazy(() =>
  import("./pages/manager/ManagerLeaveApprovals").then((m) => ({ default: m.ManagerLeaveApprovals })),
);
const ManagerTeamPerformance = lazy(() =>
  import("./pages/manager/ManagerTeamPerformance").then((m) => ({ default: m.ManagerTeamPerformance })),
);
const ManagerTeamTraining = lazy(() =>
  import("./pages/manager/ManagerTeamTraining").then((m) => ({ default: m.ManagerTeamTraining })),
);
const ManagerExpenseApprovals = lazy(() =>
  import("./pages/manager/ManagerExpenseApprovals").then((m) => ({ default: m.ManagerExpenseApprovals })),
);
const ManagerTeam = lazy(() =>
  import("./pages/manager/ManagerTeam").then((m) => ({ default: m.ManagerTeam })),
);
const ManagerTeamAppraisal = lazy(() =>
  import("./pages/manager/ManagerTeamAppraisal").then((m) => ({ default: m.ManagerTeamAppraisal })),
);
const ManagerPersonalDashboard = lazy(() =>
  import("./pages/manager/ManagerPersonalDashboard").then((m) => ({ default: m.ManagerPersonalDashboard })),
);
const ManagerPersonalAttendance = lazy(() =>
  import("./pages/manager/ManagerPersonalAttendance").then((m) => ({ default: m.ManagerPersonalAttendance })),
);
const ManagerPersonalLeaves = lazy(() =>
  import("./pages/manager/ManagerPersonalLeaves").then((m) => ({ default: m.ManagerPersonalLeaves })),
);
const FinanceLeaves = lazy(() =>
  import("./pages/FinanceLeaves").then((m) => ({ default: m.FinanceLeaves })),
);
const FinanceSchedule = lazy(() =>
  import("./pages/FinanceSchedule").then((m) => ({ default: m.FinanceSchedule })),
);
const ManagerPersonalExpenses = lazy(() =>
  import("./pages/manager/ManagerPersonalExpenses").then((m) => ({ default: m.ManagerPersonalExpenses })),
);
const ManagerPersonalGoals = lazy(() =>
  import("./pages/manager/ManagerPersonalGoals").then((m) => ({ default: m.ManagerPersonalGoals })),
);
const ManagerPersonalPerformance = lazy(() =>
  import("./pages/manager/ManagerPersonalPerformance").then((m) => ({ default: m.ManagerPersonalPerformance })),
);
const ManagerPersonalPayslips = lazy(() =>
  import("./pages/manager/ManagerPersonalPayslips").then((m) => ({ default: m.ManagerPersonalPayslips })),
);
const ManagerPersonalDocuments = lazy(() =>
  import("./pages/manager/ManagerPersonalDocuments").then((m) => ({ default: m.ManagerPersonalDocuments })),
);
const ManagerProfile = lazy(() =>
  import("./pages/manager/ManagerProfile").then((m) => ({ default: m.ManagerProfile })), // Force reload
);
const ManagerNotifications = lazy(() =>
  import("./pages/manager/ManagerNotifications").then((m) => ({ default: m.ManagerNotifications })),
);
const ManagerAnnouncements = lazy(() =>
  import("./pages/manager/ManagerAnnouncements").then((m) => ({ default: m.ManagerAnnouncements })),
);
const ManagerTeamDirectory = lazy(() =>
  import("./pages/manager/ManagerTeamDirectory").then((m) => ({ default: m.ManagerTeamDirectory })),
);
const ManagerSupportTicket = lazy(() =>
  import("./pages/manager/ManagerSupportTicket").then((m) => ({ default: m.ManagerSupportTicket })),
);
const ManagerTeamAssets = lazy(() =>
  import("./pages/manager/ManagerTeamAssets").then((m) => ({ default: m.ManagerTeamAssets })),
);
const ManagerExitTasks = lazy(() =>
  import("./pages/manager/ManagerExitTasks").then((m) => ({ default: m.ManagerExitTasks })),
);
const ManagerSettings = lazy(() =>
  import("./pages/manager/ManagerSettings").then((m) => ({ default: m.ManagerSettings })),
);
const ManagerTeamOnboarding = lazy(() =>
  import("./pages/manager/ManagerTeamOnboarding").then((m) => ({ default: m.ManagerTeamOnboarding })),
);
const FinanceSettings = lazy(() =>
  import("./pages/FinanceSettings").then((m) => ({ default: m.FinanceSettings })),
);
const AuditLogs = lazy(() =>
  import("./pages/AuditLogs").then((m) => ({ default: m.AuditLogs })),
);
const HRAuditLogs = lazy(() =>
  import("./pages/HRAuditLogs").then((m) => ({ default: m.HRAuditLogs })),
);
const FinanceAuditLogs = lazy(() =>
  import("./pages/FinanceAuditLogs").then((m) => ({ default: m.FinanceAuditLogs })),
);
const AssetManagement = lazy(() =>
  import("./pages/AssetManagement").then((m) => ({ default: m.AssetManagement })),
);

// Loading spinner
function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "200px",
        opacity: 0.6,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid rgba(16,185,129,0.2)",
          borderTopColor: "#10B981",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function ProfileWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinanceProfile);
  } else if (user?.role === "Manager") {
    return lazyRoute(ManagerProfile);
  }
  return lazyRoute(UserProfile);
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
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 900,
          color: "var(--foreground)",
          letterSpacing: "-0.5px",
          marginBottom: "12px",
        }}
      >
        Access Denied
      </h2>
      <p
        style={{
          fontSize: "15px",
          color: "var(--muted-foreground)",
          maxWidth: "400px",
          lineHeight: 1.6,
        }}
      >
        Your role{" "}
        <strong style={{ color: "var(--foreground)" }}>{user?.role}</strong>{" "}
        does not have permission to view this page. Please contact your
        administrator if you believe this is a mistake.
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #10B981, #059669)",
          boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
        }}
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
      <RoleGuard>{children}</RoleGuard>
    </AuthGuard>
  );
}

// ── Helper for protected lazy routes ─────────────────────────
function protectedRoute(
  Component: React.LazyExoticComponent<React.ComponentType>,
) {
  return <Protected>{lazyRoute(Component)}</Protected>;
}

// ── Performance Wrapper: role-based view ──────────────────────
function PerformanceWrapper() {
  const { user } = useAuth();
  if (user?.role === "Manager") {
    return lazyRoute(ManagerTeamPerformance);
  }
  if (user?.role === "Finance") {
    return lazyRoute(FinancePerformance);
  }
  if (user?.role === "Employee") {
    return lazyRoute(EmployeePerformance);
  }
  return lazyRoute(Performance);
}

// ── Schedule Wrapper: role-based view ─────────────────────────
function ScheduleWrapper() {
  const { user } = useAuth();
  if (user?.role === "Manager") {
    return lazyRoute(ManagerTeamSchedule);
  }
  if (user?.role === "Finance") {
    return lazyRoute(FinanceSchedule);
  }
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeSchedule);
  }
  return lazyRoute(ShiftSchedule);
}

// ── Goals Wrapper: role-based view ────────────────────────────
function GoalsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinanceGoals);
  }
  return <PerformanceWrapper />;
}

// ── Training Wrapper: role-based view ─────────────────────────
function TrainingWrapper() {
  const { user } = useAuth();
  if (user?.role === "Manager") {
    return lazyRoute(ManagerTeamTraining);
  }
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeTraining);
  }
  return lazyRoute(Training);
}

function DepartmentsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinanceDepartments);
  }
  return lazyRoute(Departments);
}

function SupportWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinanceSupport);
  }
  return lazyRoute(EmployeeSupport);
}

function DocumentsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinanceDocuments);
  }
  return lazyRoute(EmployeeDocuments);
}

function AttendanceWrapper() {
  const { user } = useAuth();
  if (user?.role === "Manager") {
    return lazyRoute(ManagerAttendance);
  }
  if (user?.role === "Finance") {
    return lazyRoute(FinanceAttendance);
  }
  return lazyRoute(Attendance);
}

// ── Leave Wrapper: role-based view ────────────────────────────
function LeaveWrapper() {
  const { user } = useAuth();
  if (user?.role === "Manager") {
    return lazyRoute(ManagerLeaveApprovals);
  }
  if (user?.role === "Finance") {
    return lazyRoute(FinanceLeaves);
  }
  return lazyRoute(LeaveManagement);
}

// ── Notifications Wrapper: role-based view ────────────────────
function NotificationsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeAnnouncements);
  }
  return lazyRoute(Notifications);
}

function PayslipsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinancePayslips);
  }
  return lazyRoute(EmployeePayslips);
}

// ── Payroll Wrapper: role-based view ──────────────────────────
function PayrollWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeePayslips);
  }
  if (user?.role === "Finance") {
    return lazyRoute(FinancePayroll);
  }
  return lazyRoute(Payroll);
}

// ── Expenses Wrapper: role-based view ─────────────────────────
function ExpensesWrapper() {
  const { user } = useAuth();
  if (user?.role === "Manager") {
    return lazyRoute(ManagerExpenseApprovals);
  }
  if (user?.role === "Finance") {
    return lazyRoute(FinanceExpenses);
  }
  return lazyRoute(Expenses);
}

// ── Directory Wrapper: role-based view ────────────────────────
function DirectoryWrapper() {
  const { user } = useAuth();
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeDirectory);
  }
  if (user?.role === "Finance") {
    return lazyRoute(FinanceEmployees);
  }
  if (user?.role === "Manager") {
    return lazyRoute(ManagerTeam);
  }
  return lazyRoute(Employees);
}

// ── Reports Wrapper: role-based view ─────────────────────────
function ReportsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinanceReports);
  }
  return lazyRoute(Reports);
}

// ── Appraisal Wrapper: role-based view ────────────────────────
function AppraisalWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinanceIncrement);
  }
  if (user?.role === "Manager") {
    return lazyRoute(ManagerTeamAppraisal);
  }
  return lazyRoute(IncrementAppraisal);
}


// ── Employee Dashboard Wrapper: role-based view ───────────────
function EmployeeDashboardWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinancePersonalDashboard);
  }
  return lazyRoute(EmployeeSelfService);
}

// ── Settings Wrapper: role-based view ─────────────────────────
function SettingsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Finance") {
    return lazyRoute(FinanceSettings);
  }
  if (user?.role === "Employee") {
    return lazyRoute(EmployeeSettings);
  }
  return lazyRoute(Settings);
}

function AuditLogsWrapper() {
  const { user } = useAuth();
  if (user?.role === "Super Admin") {
    return lazyRoute(AuditLogs);
  }
  if (user?.role === "Finance") {
    return lazyRoute(FinanceAuditLogs);
  }
  return lazyRoute(HRAuditLogs);
}

// ── Root Redirect ────────────────────────────────────────────
function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  const roleRoutes: Record<string, string> = {
    "Super Admin": "/admin/dashboard",
    "HR Manager": "/hr/dashboard",
    "Finance": "/finance/dashboard",
    "Manager": "/manager/dashboard",
    "Employee": "/employee/dashboard",
  };
  
  return <Navigate to={roleRoutes[user.role] || "/employee/dashboard"} replace />;
}

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/signup-success", Component: AuthSuccess },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { path: "403", element: <AccessDenied /> },
      { index: true, element: <RootRedirect /> },
      { path: "admin/dashboard", element: protectedRoute(Dashboard) },
      { path: "hr/dashboard", element: protectedRoute(Dashboard) },
      { path: "finance/dashboard", element: protectedRoute(Dashboard) },
      { path: "manager/dashboard", element: protectedRoute(Dashboard) },
      { path: "manager/my-dashboard", element: protectedRoute(ManagerPersonalDashboard) },
      { path: "manager/my-attendance", element: protectedRoute(ManagerPersonalAttendance) },
      { path: "manager/my-leaves", element: protectedRoute(ManagerPersonalLeaves) },
      { path: "manager/my-payslips", element: protectedRoute(ManagerPersonalPayslips) },
      { path: "manager/my-documents", element: protectedRoute(ManagerPersonalDocuments) },
      { path: "manager/my-expenses", element: protectedRoute(ManagerPersonalExpenses) },
      { path: "manager/my-goals", element: protectedRoute(ManagerPersonalGoals) },
      { path: "manager/my-performance", element: protectedRoute(ManagerPersonalPerformance) },
      { path: "manager/notifications", element: protectedRoute(ManagerNotifications) },
      { path: "manager/announcements", element: protectedRoute(ManagerAnnouncements) },
      { path: "manager/directory", element: protectedRoute(ManagerTeamDirectory) },
      { path: "manager/support", element: protectedRoute(ManagerSupportTicket) },
      { path: "manager/team-assets", element: protectedRoute(ManagerTeamAssets) },
      { path: "manager/exit-tasks", element: protectedRoute(ManagerExitTasks) },
      { path: "manager/settings", element: protectedRoute(ManagerSettings) },
      { path: "manager/team-onboarding", element: protectedRoute(ManagerTeamOnboarding) },
      { path: "employee/dashboard", element: <Protected><EmployeeDashboardWrapper /></Protected> },
      {
        path: "employees",
        element: (
          <Protected>
            <DirectoryWrapper />
          </Protected>
        ),
      },
      { path: "employees/:id", element: protectedRoute(EmployeeProfile) },
      { path: "profile", element: <Protected><ProfileWrapper /></Protected> },
      { path: "attendance", element: <Protected><AttendanceWrapper /></Protected> },
      {
        path: "payroll",
        element: (
          <Protected>
            <PayrollWrapper />
          </Protected>
        ),
      },
      { path: "payslips", element: <Protected><PayslipsWrapper /></Protected> },
      {
        path: "expenses",
        element: (
          <Protected>
            <ExpensesWrapper />
          </Protected>
        ),
      },
      {
        path: "finance/my-expenses",
        element: (
          <Protected>
            {lazyRoute(FinanceMyExpenses)}
          </Protected>
        ),
      },
      { path: "recruitment", element: protectedRoute(Recruitment) },
      { path: "offboarding", element: protectedRoute(Offboarding) },
      {
        path: "performance",
        element: (
          <Protected>
            <PerformanceWrapper />
          </Protected>
        ),
      },
      {
        path: "reports",
        element: (
          <Protected>
            <ReportsWrapper />
          </Protected>
        ),
      },
      {
        path: "finance/asset-cost-report",
        element: (
          <Protected>
            {lazyRoute(FinanceAssetCostReport)}
          </Protected>
        ),
      },
      {
        path: "finance/settlements",
        element: (
          <Protected>
            {lazyRoute(FinanceSettlements)}
          </Protected>
        ),
      },
      { path: "finance/onboarding", element: protectedRoute(FinanceOnboarding) },
      { path: "settings", element: <Protected><SettingsWrapper /></Protected> },
      { path: "settings/audit-logs", element: <Protected><AuditLogsWrapper /></Protected> },
      { path: "settings/payroll", element: protectedRoute(FinancePayrollSettings) },
      {
        path: "leave",
        element: (
          <Protected>
            <LeaveWrapper />
          </Protected>
        ),
      },
      {
        path: "departments",
        element: (
          <Protected>
            <DepartmentsWrapper />
          </Protected>
        ),
      },
      { path: "smart-search", element: protectedRoute(SmartSearch) },
      {
        path: "schedule",
        element: (
          <Protected>
            <ScheduleWrapper />
          </Protected>
        ),
      },
      {
        path: "appraisal",
        element: (
          <Protected>
            <AppraisalWrapper />
          </Protected>
        ),
      },
      { path: "onboarding", element: protectedRoute(Onboarding) },
      { path: "documents", element: protectedRoute(Documents) },
      {
        path: "training",
        element: (
          <Protected>
            <TrainingWrapper />
          </Protected>
        ),
      },
      {
        path: "notifications",
        element: (
          <Protected>
            <NotificationsWrapper />
          </Protected>
        ),
      },
      { path: "self-service", element: protectedRoute(EmployeeSelfService) },
      {
        path: "reimbursement-history",
        element: protectedRoute(ReimbursementHistory),
      },
      { path: "expense-policy", element: protectedRoute(ExpensePolicy) },
      { path: "expense-support", element: protectedRoute(ExpenseSupport) },
      { path: "support", element: <Protected><SupportWrapper /></Protected> },
      { path: "my-documents", element: <Protected><DocumentsWrapper /></Protected> },
      { path: "my-assets", element: protectedRoute(MyAssets) },
      { path: "my-exit", element: protectedRoute(EmployeeExit) },
      { path: "my-onboarding", element: protectedRoute(MyOnboarding) },
      { path: "hr-requests", element: protectedRoute(EmployeeHRRequests) },
      {
        path: "regularization-history",
        element: protectedRoute(EmployeeRegularizationHistory),
      },
      {
        path: "my-notifications",
        element: protectedRoute(EmployeeNotifications),
      },
      {
        path: "goals",
        element: (
          <Protected>
            <GoalsWrapper />
          </Protected>
        ),
      },
      { path: "asset-management", element: protectedRoute(AssetManagement) },
    ],
  },
]);
