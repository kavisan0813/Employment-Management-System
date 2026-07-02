import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/shared/Login";
import { Signup } from "./pages/shared/Signup";
import { AuthSuccess } from "./pages/shared/AuthSuccess";
import { useAuth } from "./context/AuthContext";
import {
  Mail,
  Bell,
  DatabaseBackup,
  Palette,
  Lock,
  BrainCircuit,
} from "lucide-react";

// Lazy-loaded Admin Panel Components
const AdminLayout = lazy(() =>
  import("./admin/layout/AdminLayout").then((m) => ({
    default: m.AdminLayout,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("./admin/features/dashboard/DashboardView").then((m) => ({
    default: m.default,
  })),
);
const SuperAdminDashboardPage = lazy(() =>
  import("./pages/super-admin/home/SuperAdminDashboard").then((m) => ({
    default: m.SuperAdminDashboard,
  })),
);
const AdminOrganizationsPage = lazy(() =>
  import("./admin/features/organizations/OrganizationManagementView").then(
    (m) => ({
      default: m.OrganizationManagementView,
    }),
  ),
);
const AdminGlobalUsersPage = lazy(() =>
  import("./admin/features/userManagement/UserManagementView").then((m) => ({
    default: m.default,
  })),
);
const AdminSubscriptionsPage = lazy(() =>
  import("./admin/features/subscription-billing/SubscriptionBillingView").then(
    (m) => ({
      default: m.default,
    }),
  ),
);
const AdminReportsPage = lazy(() =>
  import("./admin/features/reports/ReportsView").then((m) => ({
    default: m.default,
  })),
);
/* const AdminAuditLogsPage = lazy(() =>
  import("./admin/features/auditLogs/AuditLogsView").then((m) => ({
    default: m.default,
  })),
); */
const AdminSupportTicketsPage = lazy(() =>
  import("./admin/features/supportTickets/SupportTicketsView").then((m) => ({
    default: m.default,
  })),
);
// const AdminAnnouncementsPage = lazy(() =>
//   import("./admin/features/announcements/announcements.page").then((m) => ({
//     default: m.default,
//   })),
// );
const AdminFeatureManagementPage = lazy(() =>
  import("./admin/features/featureManagement/FeatureManagementView")
);
const AdminRoleTemplatesPage = lazy(() =>
  import("./admin/features/roleTemplates/RoleTemplatesView")
);
const AdminPlatformSettingsPage = lazy(() =>
  import("./admin/features/platformSettings/PlatformSettingsView").then(
    (m) => ({ default: m.PlatformSettingsView }),
  ),
);
const AdminNotificationsPage = lazy(() =>
  import("./admin/features/notifications/NotificationsView").then((m) => ({
    default: m.NotificationsView,
  })),
);
const AdminCommunicationPage = lazy(() =>
  import("./admin/features/communication/CommunicationView").then((m) => ({
    default: m.CommunicationView,
  })),
);
const AdminComingSoonPage = lazy(() =>
  import("./admin/components/common/coming-soon-page").then((m) => ({
    default: m.ComingSoonPage,
  })),
);

// Lazy-loaded page components for code splitting
const Dashboard = lazy(() =>
  import("./pages/shared/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Employees = lazy(() =>
  import("./pages/hr/team-management/Employees").then((m) => ({ default: m.Employees })),
);
const EmployeeProfile = lazy(() =>
  import("./pages/employee/EmployeeProfile").then((m) => ({
    default: m.EmployeeProfile,
  })),
);
const Attendance = lazy(() =>
  import("./pages/hr/hr-operations/Attendance").then((m) => ({ default: m.Attendance })),
);
const Payroll = lazy(() =>
  import("./pages/hr/finance-payroll/Payroll").then((m) => ({ default: m.Payroll })),
);
const Expenses = lazy(() =>
  import("./pages/hr/finance-payroll/ExpenseManagement").then((m) => ({ default: m.Expenses })),
);
const Recruitment = lazy(() =>
  import("./pages/hr/team-management/Recruitment").then((m) => ({ default: m.Recruitment })),
);
const Offboarding = lazy(() =>
  import("./pages/hr/team-management/Offboarding").then((m) => ({ default: m.Offboarding })),
);
const Performance = lazy(() =>
  import("./pages/hr/hr-operations/Performance").then((m) => ({ default: m.Performance })),
);
const Reports = lazy(() =>
  import("./pages/hr/reports/Reports").then((m) => ({ default: m.Reports })),
);
const Settings = lazy(() =>
  import("./pages/super-admin/settings/Settings").then((m) => ({ default: m.Settings })),
);
const HRSettings = lazy(() =>
  import("./pages/hr/settings/HRSettings").then((m) => ({ default: m.HRSettings })),
);
const LeaveManagement = lazy(() =>
  import("./pages/hr/hr-operations/LeaveManagement").then((m) => ({
    default: m.LeaveManagement,
  })),
);
const Departments = lazy(() =>
  import("./pages/hr/team-management/Departments").then((m) => ({ default: m.Departments })),
);
const UserProfile = lazy(() =>
  import("./pages/shared/UserProfile").then((m) => ({ default: m.UserProfile })),
);
const SmartSearch = lazy(() => import("./pages/shared/SmartSearch"));
const ShiftSchedule = lazy(() =>
  import("./pages/hr/hr-operations/ShiftSchedule").then((m) => ({ default: m.ShiftSchedule })),
);
const IncrementAppraisal = lazy(() =>
  import("./pages/hr/finance-payroll/IncrementAppraisal").then((m) => ({
    default: m.IncrementAppraisal,
  })),
);
const Onboarding = lazy(() =>
  import("./pages/hr/team-management/Onboarding").then((m) => ({ default: m.Onboarding })),
);
const Training = lazy(() =>
  import("./pages/hr/hr-operations/Training").then((m) => ({ default: m.Training })),
);
const Documents = lazy(() =>
  import("./pages/hr/hr-operations/Documents").then((m) => ({ default: m.Documents })),
);
const Notifications = lazy(() =>
  import("./pages/hr/settings/Notifications").then((m) => ({ default: m.Notifications })),
);
const EmployeeSelfService = lazy(() =>
  import("./pages/employee/EmployeeSelfService").then((m) => ({
    default: m.EmployeeSelfService,
  })),
);
const MyAssets = lazy(() =>
  import("./pages/employee/MyAssets").then((m) => ({ default: m.MyAssets })),
);
const EmployeeHRRequests = lazy(() => import("./pages/employee/EmployeeHRRequests"));
const ReimbursementHistory = lazy(() =>
  import("./pages/employee/ReimbursementHistory").then((m) => ({
    default: m.ReimbursementHistory,
  })),
);
const ExpensePolicy = lazy(() =>
  import("./pages/employee/ExpensePolicy").then((m) => ({ default: m.ExpensePolicy })),
);
const ExpenseSupport = lazy(() =>
  import("./pages/employee/ExpenseSupport").then((m) => ({ default: m.ExpenseSupport })),
);
const EmployeeDocuments = lazy(() =>
  import("./pages/employee/EmployeeDocuments").then((m) => ({
    default: m.EmployeeDocuments,
  })),
);
const EmployeePerformance = lazy(() =>
  import("./pages/employee/EmployeePerformance").then((m) => ({
    default: m.EmployeePerformance,
  })),
);
const EmployeeSchedule = lazy(() =>
  import("./pages/employee/EmployeeSchedule").then((m) => ({
    default: m.EmployeeSchedule,
  })),
);
const EmployeeTraining = lazy(() =>
  import("./pages/employee/EmployeeTraining").then((m) => ({
    default: m.EmployeeTraining,
  })),
);
const EmployeeAnnouncements = lazy(() =>
  import("./pages/employee/EmployeeAnnouncements").then((m) => ({
    default: m.EmployeeAnnouncements,
  })),
);
const EmployeeSupport = lazy(() =>
  import("./pages/employee/EmployeeSupport").then((m) => ({
    default: m.EmployeeSupport,
  })),
);
const EmployeeRegularizationHistory = lazy(
  () => import("./pages/employee/EmployeeRegularizationHistory"),
);
const EmployeeExit = lazy(() =>
  import("./pages/employee/EmployeeExit").then((m) => ({ default: m.EmployeeExit })),
);
const MyOnboarding = lazy(() =>
  import("./pages/employee/MyOnboarding").then((m) => ({ default: m.MyOnboarding })),
);
const EmployeeNotifications = lazy(
  () => import("./pages/employee/EmployeeNotifications"),
);
const EmployeeDirectory = lazy(() =>
  import("./pages/employee/EmployeeDirectory").then((m) => ({
    default: m.EmployeeDirectory,
  })),
);
const EmployeePayslips = lazy(() =>
  import("./pages/employee/EmployeePayslips").then((m) => ({
    default: m.EmployeePayslips,
  })),
);
const EmployeeSettings = lazy(() => import("./pages/employee/EmployeeSettings"));
const EmployeeAttendance = lazy(() =>
  import("./pages/employee/EmployeeAttendance").then((m) => ({
    default: m.EmployeeAttendance,
  })),
);
const EmployeeLeaves = lazy(() =>
  import("./pages/employee/EmployeeLeaves").then((m) => ({
    default: m.EmployeeLeaves,
  })),
);
const EmployeeSelfProfile = lazy(() =>
  import("./pages/employee/EmployeeSelfProfile").then((m) => ({
    default: m.EmployeeSelfProfile,
  })),
);

// Finance Components
const FinanceExpenses = lazy(() =>
  import("./pages/finance/ops/FinanceExpenses").then((m) => ({
    default: m.FinanceExpenses,
  })),
);
const FinancePayroll = lazy(() =>
  import("./pages/finance/ops/FinancePayroll").then((m) => ({ default: m.FinancePayroll })),
);
const FinanceReports = lazy(() =>
  import("./pages/finance/reports/FinanceReports").then((m) => ({ default: m.FinanceReports })),
);
const FinanceAssetCostReport = lazy(() =>
  import("./pages/finance/reports/FinanceAssetCostReport").then((m) => ({
    default: m.FinanceAssetCostReport,
  })),
);
const FinanceOnboarding = lazy(() =>
  import("./pages/finance/ops/FinanceOnboarding").then((m) => ({
    default: m.FinanceOnboarding,
  })),
);
const FinancePayrollSettings = lazy(() =>
  import("./pages/finance/workspace/FinancePayrollSettings").then((m) => ({
    default: m.FinancePayrollSettings,
  })),
);
const FinanceSettlements = lazy(() =>
  import("./pages/finance/ops/FinanceSettlements").then((m) => ({
    default: m.FinanceSettlements,
  })),
);
const FinanceAttendance = lazy(() =>
  import("./pages/finance/workspace/FinanceAttendance").then((m) => ({
    default: m.FinanceAttendance,
  })),
);
const FinanceDocuments = lazy(() =>
  import("./pages/finance/workspace/FinanceDocuments").then((m) => ({
    default: m.FinanceDocuments,
  })),
);
const FinanceMyExpenses = lazy(() =>
  import("./pages/finance/workspace/FinanceMyExpenses").then((m) => ({
    default: m.FinanceMyExpenses,
  })),
);
const FinancePayslips = lazy(() =>
  import("./pages/finance/workspace/FinancePayslips").then((m) => ({
    default: m.FinancePayslips,
  })),
);
const FinanceProfile = lazy(() =>
  import("./pages/finance/workspace/FinanceProfile").then((m) => ({ default: m.FinanceProfile })),
);
const FinancePerformance = lazy(() =>
  import("./pages/finance/workspace/FinancePerformance").then((m) => ({
    default: m.FinancePerformance,
  })),
);
const FinanceGoals = lazy(() =>
  import("./pages/finance/workspace/FinanceGoals").then((m) => ({ default: m.FinanceGoals })),
);
const FinanceSupport = lazy(() =>
  import("./pages/finance/workspace/FinanceSupport").then((m) => ({ default: m.FinanceSupport })),
);
const FinanceEmployees = lazy(() =>
  import("./pages/finance/ops/FinanceEmployees").then((m) => ({
    default: m.FinanceEmployees,
  })),
);
const FinanceIncrement = lazy(() =>
  import("./pages/finance/ops/FinanceIncrement").then((m) => ({
    default: m.FinanceIncrement,
  })),
);
const FinanceDepartments = lazy(() =>
  import("./pages/finance/ops/FinanceDepartments").then((m) => ({
    default: m.FinanceDepartments,
  })),
);
const FinancePersonalDashboard = lazy(() =>
  import("./pages/finance/home/FinancePersonalDashboard").then((m) => ({
    default: m.FinancePersonalDashboard,
  })),
);

// Manager Team & Personal Components
const ManagerAttendance = lazy(() =>
  import("./pages/manager/team/ManagerAttendance").then((m) => ({
    default: m.ManagerAttendance,
  })),
);
const ManagerTeamSchedule = lazy(() =>
  import("./pages/manager/team/ManagerTeamSchedule").then((m) => ({
    default: m.ManagerTeamSchedule,
  })),
);
const ManagerLeaveApprovals = lazy(() =>
  import("./pages/manager/team/ManagerLeaveApprovals").then((m) => ({
    default: m.ManagerLeaveApprovals,
  })),
);
const ManagerTeamPerformance = lazy(() =>
  import("./pages/manager/team/ManagerTeamPerformance").then((m) => ({
    default: m.ManagerTeamPerformance,
  })),
);
const ManagerTeamTraining = lazy(() =>
  import("./pages/manager/team/ManagerTeamTraining").then((m) => ({
    default: m.ManagerTeamTraining,
  })),
);
const ManagerExpenseApprovals = lazy(() =>
  import("./pages/manager/team/ManagerExpenseApprovals").then((m) => ({
    default: m.ManagerExpenseApprovals,
  })),
);
const ManagerTeam = lazy(() =>
  import("./pages/manager/team/ManagerTeam").then((m) => ({
    default: m.ManagerTeam,
  })),
);
const ManagerTeamAppraisal = lazy(() =>
  import("./pages/manager/team/ManagerTeamAppraisal").then((m) => ({
    default: m.ManagerTeamAppraisal,
  })),
);
const ManagerPersonalDashboard = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalDashboard").then((m) => ({
    default: m.ManagerPersonalDashboard,
  })),
);
const ManagerPersonalAttendance = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalAttendance").then((m) => ({
    default: m.ManagerPersonalAttendance,
  })),
);
const ManagerPersonalLeaves = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalLeaves").then((m) => ({
    default: m.ManagerPersonalLeaves,
  })),
);
const FinanceLeaves = lazy(() =>
  import("./pages/finance/workspace/FinanceLeaves").then((m) => ({ default: m.FinanceLeaves })),
);
const FinanceSchedule = lazy(() =>
  import("./pages/finance/workspace/FinanceSchedule").then((m) => ({
    default: m.FinanceSchedule,
  })),
);
const ManagerPersonalExpenses = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalExpenses").then((m) => ({
    default: m.ManagerPersonalExpenses,
  })),
);
const ManagerPersonalGoals = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalGoals").then((m) => ({
    default: m.ManagerPersonalGoals,
  })),
);
const ManagerPersonalPerformance = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalPerformance").then((m) => ({
    default: m.ManagerPersonalPerformance,
  })),
);
const ManagerPersonalSchedule = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalSchedule").then((m) => ({
    default: m.ManagerPersonalSchedule,
  })),
);
const ManagerPersonalPayslips = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalPayslips").then((m) => ({
    default: m.ManagerPersonalPayslips,
  })),
);
const ManagerPersonalDocuments = lazy(() =>
  import("./pages/manager/workspace/ManagerPersonalDocuments").then((m) => ({
    default: m.ManagerPersonalDocuments,
  })),
);
const ManagerProfile = lazy(
  () =>
    import("./pages/manager/workspace/ManagerProfile").then((m) => ({
      default: m.ManagerProfile,
    })), // Force reload
);
const ManagerNotifications = lazy(() =>
  import("./pages/manager/workspace/ManagerNotifications").then((m) => ({
    default: m.ManagerNotifications,
  })),
);
const ManagerAnnouncements = lazy(() =>
  import("./pages/manager/workspace/ManagerAnnouncements").then((m) => ({
    default: m.ManagerAnnouncements,
  })),
);
const ManagerTeamDirectory = lazy(() =>
  import("./pages/manager/team/ManagerTeamDirectory").then((m) => ({
    default: m.ManagerTeamDirectory,
  })),
);
const ManagerSupportTicket = lazy(() =>
  import("./pages/manager/workspace/ManagerSupportTicket").then((m) => ({
    default: m.ManagerSupportTicket,
  })),
);
const ManagerTeamAssets = lazy(() =>
  import("./pages/manager/team/ManagerTeamAssets").then((m) => ({
    default: m.ManagerTeamAssets,
  })),
);
const ManagerExitTasks = lazy(() =>
  import("./pages/manager/workspace/ManagerExitTasks").then((m) => ({
    default: m.ManagerExitTasks,
  })),
);
const ManagerSettings = lazy(() =>
  import("./pages/manager/workspace/ManagerSettings").then((m) => ({
    default: m.ManagerSettings,
  })),
);
const ManagerReports = lazy(() =>
  import("./pages/manager/reports/ManagerReports").then((m) => ({ default: m.ManagerReports })),
);
const ManagerTeamOnboarding = lazy(() =>
  import("./pages/manager/team/ManagerTeamOnboarding").then((m) => ({
    default: m.ManagerTeamOnboarding,
  })),
);
const FinanceSettings = lazy(() =>
  import("./pages/finance/workspace/FinanceSettings").then((m) => ({
    default: m.FinanceSettings,
  })),
);
const AuditLogs = lazy(() =>
  import("./pages/super-admin/settings/AuditLogs").then((m) => ({ default: m.AuditLogs })),
);
const HRAuditLogs = lazy(() =>
  import("./pages/hr/settings/HRAuditLogs").then((m) => ({ default: m.HRAuditLogs })),
);
const FinanceAuditLogs = lazy(() =>
  import("./pages/finance/workspace/FinanceAuditLogs").then((m) => ({
    default: m.FinanceAuditLogs,
  })),
);
const AssetManagement = lazy(() =>
  import("./pages/hr/finance-payroll/AssetManagement").then((m) => ({
    default: m.AssetManagement,
  })),
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

// ── 404 Not Found page ────────────────────────────────────────
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 animate-in fade-in duration-500">
      <div
        className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl animate-bounce"
        style={{
          background: "linear-gradient(135deg, #10B981, #059669)",
          boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
        }}
      >
        <span style={{ fontSize: "42px" }}>🔍</span>
      </div>
      <h1
        style={{
          fontSize: "80px",
          fontWeight: 950,
          background: "linear-gradient(135deg, #10B981, #059669)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-2px",
          lineHeight: 1,
          marginBottom: "16px",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 800,
          color: "var(--foreground)",
          letterSpacing: "-0.5px",
          marginBottom: "12px",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: "15px",
          color: "var(--muted-foreground)",
          maxWidth: "450px",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}
      >
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3.5 rounded-2xl border border-border text-sm font-bold text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95 cursor-pointer"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          }}
        >
          Return to Dashboard
        </button>
      </div>
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
  if (user?.role === "Manager") {
    return lazyRoute(ManagerNotifications);
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
  if (user?.role === "Manager") {
    return lazyRoute(ManagerReports);
  }
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
    Finance: "/finance/dashboard",
    Manager: "/manager/dashboard",
    Employee:
      user?.name === "Priya Sharma" ? "/my-onboarding" : "/employee/dashboard",
  };

  return (
    <Navigate to={roleRoutes[user.role] || "/employee/dashboard"} replace />
  );
}

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/signup-success", Component: AuthSuccess },
  {
    path: "/platform-admin",
    element: (
      <Protected>
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      </Protected>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: lazyRoute(AdminDashboardPage) },
      { path: "organizations", element: lazyRoute(AdminOrganizationsPage) },
      { path: "users", element: lazyRoute(AdminGlobalUsersPage) },
      { path: "subscriptions", element: lazyRoute(AdminSubscriptionsPage) },
      { path: "reports", element: lazyRoute(AdminReportsPage) },
      { path: "support-tickets", element: lazyRoute(AdminSupportTicketsPage) },
//       { path: "announcements", element: lazyRoute(AdminAnnouncementsPage) },
      { path: "features", element: lazyRoute(AdminFeatureManagementPage) },
      { path: "roles", element: lazyRoute(AdminRoleTemplatesPage) },
      { path: "settings", element: lazyRoute(AdminPlatformSettingsPage) },
      { path: "notifications", element: lazyRoute(AdminNotificationsPage) },
      { path: "communication", element: lazyRoute(AdminCommunicationPage) },
      {
        path: "settings/email-templates",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminComingSoonPage title="Email Templates" icon={Mail} />
          </Suspense>
        ),
      },
      {
        path: "settings/notifications",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminComingSoonPage title="Notifications" icon={Bell} />
          </Suspense>
        ),
      },
      {
        path: "settings/backup",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminComingSoonPage
              title="Backup & Restore"
              icon={DatabaseBackup}
            />
          </Suspense>
        ),
      },
      {
        path: "settings/branding",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminComingSoonPage title="Branding" icon={Palette} />
          </Suspense>
        ),
      },
      {
        path: "settings/security",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminComingSoonPage title="Security" icon={Lock} />
          </Suspense>
        ),
      },
      {
        path: "settings/ai",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminComingSoonPage title="AI Settings" icon={BrainCircuit} />
          </Suspense>
        ),
      },
    ],
  },
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
      { path: "admin/dashboard", element: protectedRoute(SuperAdminDashboardPage) },
      { path: "hr/dashboard", element: protectedRoute(Dashboard) },
      { path: "finance/dashboard", element: protectedRoute(Dashboard) },
      { path: "manager/dashboard", element: protectedRoute(Dashboard) },
      {
        path: "manager/my-dashboard",
        element: protectedRoute(ManagerPersonalDashboard),
      },
      {
        path: "manager/my-attendance",
        element: protectedRoute(ManagerPersonalAttendance),
      },
      {
        path: "manager/my-leaves",
        element: protectedRoute(ManagerPersonalLeaves),
      },
      {
        path: "manager/my-payslips",
        element: protectedRoute(ManagerPersonalPayslips),
      },
      {
        path: "manager/my-documents",
        element: protectedRoute(ManagerPersonalDocuments),
      },
      {
        path: "manager/my-expenses",
        element: protectedRoute(ManagerPersonalExpenses),
      },
      {
        path: "manager/my-goals",
        element: protectedRoute(ManagerPersonalGoals),
      },
      {
        path: "manager/my-schedule",
        element: protectedRoute(ManagerPersonalSchedule),
      },
      {
        path: "manager/my-performance",
        element: protectedRoute(ManagerPersonalPerformance),
      },
      {
        path: "manager/notifications",
        element: protectedRoute(ManagerNotifications),
      },
      {
        path: "manager/announcements",
        element: protectedRoute(ManagerAnnouncements),
      },
      {
        path: "manager/directory",
        element: protectedRoute(ManagerTeamDirectory),
      },
      {
        path: "manager/support",
        element: protectedRoute(ManagerSupportTicket),
      },
      {
        path: "manager/team-assets",
        element: protectedRoute(ManagerTeamAssets),
      },
      { path: "manager/exit-tasks", element: protectedRoute(ManagerExitTasks) },
      { path: "manager/settings", element: protectedRoute(Settings) },
      {
        path: "manager/team-onboarding",
        element: protectedRoute(ManagerTeamOnboarding),
      },
      {
        path: "employee/dashboard",
        element: (
          <Protected>
            <EmployeeDashboardWrapper />
          </Protected>
        ),
      },
      {
        path: "employee/attendance",
        element: protectedRoute(EmployeeAttendance),
      },
      {
        path: "employee/leave",
        element: protectedRoute(EmployeeLeaves),
      },
      {
        path: "employee/payslip",
        element: protectedRoute(EmployeePayslips),
      },
      {
        path: "employee/schedule",
        element: protectedRoute(EmployeeSchedule),
      },
      {
        path: "employee/performance",
        element: protectedRoute(EmployeePerformance),
      },
      {
        path: "employee/notifications",
        element: protectedRoute(EmployeeNotifications),
      },
      {
        path: "employee/profile",
        element: protectedRoute(EmployeeSelfProfile),
      },
      {
        path: "employees",
        element: (
          <Protected>
            <DirectoryWrapper />
          </Protected>
        ),
      },
      { path: "employees/:id", element: protectedRoute(EmployeeProfile) },
      {
        path: "profile",
        element: (
          <Protected>
            <ProfileWrapper />
          </Protected>
        ),
      },
      {
        path: "attendance",
        element: (
          <Protected>
            <AttendanceWrapper />
          </Protected>
        ),
      },
      {
        path: "payroll",
        element: (
          <Protected>
            <PayrollWrapper />
          </Protected>
        ),
      },
      {
        path: "payslips",
        element: (
          <Protected>
            <PayslipsWrapper />
          </Protected>
        ),
      },
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
        element: <Protected>{lazyRoute(FinanceMyExpenses)}</Protected>,
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
        element: <Protected>{lazyRoute(FinanceAssetCostReport)}</Protected>,
      },
      {
        path: "finance/settlements",
        element: <Protected>{lazyRoute(FinanceSettlements)}</Protected>,
      },
      {
        path: "finance/onboarding",
        element: protectedRoute(FinanceOnboarding),
      },
      {
        path: "settings",
        element: (
          <Protected>
            <SettingsWrapper />
          </Protected>
        ),
      },
      {
        path: "settings/audit-logs",
        element: (
          <Protected>
            <AuditLogsWrapper />
          </Protected>
        ),
      },
      {
        path: "settings/payroll",
        element: protectedRoute(FinancePayrollSettings),
      },
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
      {
        path: "support",
        element: (
          <Protected>
            <SupportWrapper />
          </Protected>
        ),
      },
      {
        path: "my-documents",
        element: (
          <Protected>
            <DocumentsWrapper />
          </Protected>
        ),
      },
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
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
