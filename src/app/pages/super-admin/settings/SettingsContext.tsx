import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router";
import {
  Building2,
  FolderTree,
  MapPin,
  CalendarDays,
  PartyPopper,
  ClipboardCheck,
  TreePalm,
  IndianRupee,
  Star,
  User,
  Shield,
  FileText,
  Link2,
  Key,
  Zap,
  Mail,
  Bell,
  Smartphone,
  Palette,
  Globe,
  Database,
  Download,
  GitPullRequest,
  CheckCircle,
  RefreshCw,
  FileCode,
  GraduationCap,
  UserPlus,
} from "lucide-react";

/* ── Data Definition ── */

const sections = [
  {
    title: "ORGANIZATION",
    items: [
      { id: "company", label: "Company Profile", icon: Building2 },
      { id: "departments", label: "Departments", icon: FolderTree },
      { id: "locations", label: "Locations", icon: MapPin },
      { id: "schedules", label: "Work Schedules", icon: CalendarDays },
      { id: "holidays", label: "Holidays", icon: PartyPopper },
    ],
  },
  {
    title: "HR POLICIES",
    items: [
      {
        id: "attendance_policy",
        label: "Attendance Policy",
        icon: ClipboardCheck,
      },
      { id: "leave_policy", label: "Leave Policy", icon: TreePalm },
      { id: "payroll_settings", label: "Payroll Settings", icon: IndianRupee },
      {
        id: "performance_settings",
        label: "Performance & Appraisal",
        icon: Star,
      },
    ],
  },
  {
    title: "SECURITY & ACCESS",
    items: [
      { id: "user_management", label: "User Management", icon: User },
      { id: "security", label: "Security Settings", icon: Shield },
      { id: "audit_logs", label: "Audit Logs", icon: FileText },
    ],
  },
  {
    title: "INTEGRATIONS",
    items: [
      { id: "connected_apps", label: "Connected Apps", icon: Link2 },
      { id: "api", label: "API & Tokens", icon: Key },
      { id: "webhooks", label: "Webhooks", icon: Zap },
    ],
  },
  {
    title: "NOTIFICATIONS",
    items: [
      { id: "email_templates", label: "Email Templates", icon: Mail },
      { id: "notification_rules", label: "Notification Rules", icon: Bell },
      { id: "sms", label: "SMS Settings", icon: Smartphone },
    ],
  },
  {
    title: "SYSTEM PREFERENCES",
    items: [
      { id: "appearance", label: "Appearance", icon: Palette },
      { id: "language", label: "Language & Region", icon: Globe },
      { id: "backup", label: "Backup & Restore", icon: Database },
      { id: "import_export", label: "Data Import / Export", icon: Download },
    ],
  },
  {
    title: "WORKFLOW AUTOMATION",
    items: [
      { id: "workflows", label: "Approval Workflows", icon: GitPullRequest },
      { id: "leave_approvals", label: "Leave Approvals", icon: CheckCircle },
      { id: "shift_swaps", label: "Shift Swap Rules", icon: RefreshCw },
    ],
  },
  {
    title: "MODULE SETTINGS",
    items: [
      { id: "docs", label: "Document Settings", icon: FileCode },
      { id: "training", label: "Training Settings", icon: GraduationCap },
      { id: "onboarding", label: "Onboarding Settings", icon: UserPlus },
    ],
  },
];

const rolesData = [
  {
    id: "super_admin",
    name: "Super Admin",
    members: 2,
    created: "2023-10-01",
    modified: "2026-04-15",
    isDefault: true,
    color: "#3B82F6",
  },
  {
    id: "hr_manager",
    name: "HR Manager",
    members: 5,
    created: "2023-10-01",
    modified: "2026-04-18",
    isDefault: true,
    color: "#8B5CF6",
  },
  {
    id: "finance",
    name: "Finance",
    members: 3,
    created: "2024-01-12",
    modified: "2026-03-22",
    isDefault: false,
    color: "#10B981",
  },
  {
    id: "manager",
    name: "Manager",
    members: 14,
    created: "2023-10-15",
    modified: "2026-04-20",
    isDefault: false,
    color: "#F59E0B",
  },
  {
    id: "employee",
    name: "Employee",
    members: 142,
    created: "2023-10-01",
    modified: "2026-01-01",
    isDefault: true,
    color: "#6B7280",
  },
];

const initialPermissions = {
  dashboard: {
    super_admin: "full",
    hr_manager: "full",
    finance: "full",
    manager: "full",
    employee: "view",
  },
  employees: {
    super_admin: "full",
    hr_manager: "full",
    finance: "view",
    manager: "view",
    employee: "view",
  },
  attendance: {
    super_admin: "full",
    hr_manager: "full",
    finance: "view",
    manager: "full",
    employee: "view",
  },
  leave: {
    super_admin: "full",
    hr_manager: "full",
    finance: "view",
    manager: "full",
    employee: "view",
  },
  payroll: {
    super_admin: "full",
    hr_manager: "view",
    finance: "full",
    manager: "view",
    employee: "no",
  },
  recruitment: {
    super_admin: "full",
    hr_manager: "full",
    finance: "no",
    manager: "view",
    employee: "no",
  },
  performance: {
    super_admin: "full",
    hr_manager: "full",
    finance: "no",
    manager: "full",
    employee: "view",
  },
  reports: {
    super_admin: "full",
    hr_manager: "full",
    finance: "full",
    manager: "view",
    employee: "no",
  },
  settings: {
    super_admin: "full",
    hr_manager: "view",
    finance: "no",
    manager: "no",
    employee: "no",
  },
};

const permissionGroups = [
  {
    id: "core",
    name: "Core Modules",
    modules: [
      { id: "dashboard", name: "Dashboard" },
      { id: "employees", name: "Employees" },
      { id: "settings", name: "Settings" },
    ],
  },
  {
    id: "hr",
    name: "HR Workspace",
    modules: [
      { id: "attendance", name: "Attendance" },
      { id: "leave", name: "Leave" },
      { id: "payroll", name: "Payroll" },
      { id: "recruitment", name: "Recruitment" },
      { id: "performance", name: "Performance" },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    modules: [{ id: "reports", name: "Reports" }],
  },
];

export interface DepartmentRecord {
  code: string;
  name: string;
  head: string;
  empCount: number;
  status: string;
  budget?: string;
  createdDate: string;
  description?: string;
}

export interface LocationRecord {
  name: string;
  code: string;
  type: "Head Office" | "Branch" | "Warehouse" | "Remote";
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  manager: string;
  empCount: number;
  timezone: string;
  status: "Active" | "Inactive" | "Partial";
  notes?: string;
  createdDate: string;
  lastUpdated?: string;
}

export interface WorkScheduleRecord {
  name: string;
  code: string;
  type: "General" | "Shift" | "Flexible" | "Rotational" | "Part Time";
  startTime: string;
  endTime: string;
  breakDuration: number;
  workingDays: string[];
  weekends: string[];
  graceTime: number;
  halfDayRule: string;
  otEligible: boolean;
  dept: string;
  location: string;
  empCount: number;
  status: "Active" | "Inactive";
}

export interface HolidayRecord {
  name: string;
  date: string;
  day: string;
  type: "National" | "Company" | "Optional" | "Regional" | "Festival";
  location: string;
  dept: string;
  recurring: boolean;
  status: "Active" | "Inactive";
  description: string;
}

export interface LeaveTypeRecord {
  name: string;
  code: string;
  days: number;
  type: "Paid" | "Unpaid";
  carryForward: boolean;
  maxCarryForward: number;
  encashment: boolean;
  approvalRequired: boolean;
  attachmentRequired: boolean;
  minNoticePeriod: number;
  maxConsecutiveLeave: number;
  dept: string;
  location: string;
  status: "Active" | "Inactive";
  description: string;
}

export interface UserManagementRecord {
  name: string;
  email: string;
  initials: string;
  avatarBg: string;
  role: string;
  dept: string;
  location?: string;
  lastLogin: string;
  status: string;
}

export interface SalaryComponent {
  name: string;
  type: "Earning" | "Deduction";
  amountType: "Percentage" | "Fixed";
  value: string;
  taxable: boolean;
}

export function useSettingsProviderValue(defaultTab: string = "company") {
  const [searchParams] = useSearchParams();
  const [activeSubTab, setActiveSubTab] = useState(
    searchParams.get("tab") || defaultTab,
  );
  const [expandedGroups, setExpandedGroups] = useState({
    core: true,
    hr: true,
    analytics: true,
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveSubTab(tab);
  }, [searchParams]);

  const [permissions, setPermissions] =
    useState<Record<string, Record<string, string>>>(initialPermissions);
  const [rolesList, setRolesList] = useState(rolesData);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<
    (typeof rolesData)[0] | null
  >(null);
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    status: "Active",
    permissions: {} as Record<string, string>,
  });

  const openCreateRoleModal = () => {
    setSelectedRoleForEdit(null);
    setRoleForm({
      name: "",
      description: "",
      status: "Active",
      permissions: Object.keys(initialPermissions).reduce(
        (acc, modId) => ({ ...acc, [modId]: "no" }),
        {},
      ),
    });
    setActiveModal("create_role");
  };

  const openEditRoleModal = (role: (typeof rolesData)[0]) => {
    setSelectedRoleForEdit(role);
    setRoleForm({
      name: role.name,
      description: `${role.name} access level`,
      status: "Active",
      permissions: Object.keys(initialPermissions).reduce(
        (acc, modId) => ({
          ...acc,
          [modId]: permissions[modId][role.id] || "no",
        }),
        {},
      ),
    });
    setActiveModal("edit_role");
  };

  const handleRoleSubmit = () => {
    if (!roleForm.name.trim()) {
      showToast("Role Name is required", "error");
      return;
    }
    const duplicate = rolesList.find(
      (r) =>
        r.name.toLowerCase() === roleForm.name.toLowerCase() &&
        (!selectedRoleForEdit || r.id !== selectedRoleForEdit.id),
    );
    if (duplicate) {
      showToast("A role with this name already exists", "error");
      return;
    }

    if (activeModal === "edit_role") {
      setActiveModal("confirm_edit_role");
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        const newRole = {
          id: roleForm.name.toLowerCase().replace(/\s+/g, "_"),
          name: roleForm.name,
          members: 0,
          created: new Date().toISOString().split("T")[0],
          modified: new Date().toISOString().split("T")[0],
          isDefault: false,
          color: "#8B5CF6",
        };
        setRolesList([...rolesList, newRole]);

        const newPerms = { ...permissions };
        Object.keys(roleForm.permissions).forEach((modId) => {
          if (!newPerms[modId]) newPerms[modId] = {};
          newPerms[modId] = {
            ...newPerms[modId],
            [newRole.id]: roleForm.permissions[modId],
          };
        });
        setPermissions(newPerms);

        setIsSubmitting(false);
        showToast("Role created successfully", "success");
        setActiveModal(null);
      }, 1000);
    }
  };

  const confirmEditRoleSubmit = () => {
    if (!selectedRoleForEdit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const updatedList = rolesList.map((r) =>
        r.id === selectedRoleForEdit.id
          ? {
              ...r,
              name: roleForm.name,
              modified: new Date().toISOString().split("T")[0],
            }
          : r,
      );
      setRolesList(updatedList);

      const newPerms = { ...permissions };
      Object.keys(roleForm.permissions).forEach((modId) => {
        if (!newPerms[modId]) newPerms[modId] = {};
        newPerms[modId] = {
          ...newPerms[modId],
          [selectedRoleForEdit.id]: roleForm.permissions[modId],
        };
      });
      setPermissions(newPerms);

      setIsSubmitting(false);
      showToast("Role updated successfully", "success");
      setActiveModal(null);
    }, 1000);
  };

  const [sidebarSearch, setSidebarSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeOnboardingPhaseTab, setActiveOnboardingPhaseTab] =
    useState("pre");

  const [extraConfig, setExtraConfig] = useState({
    accentColor: "#00B87C",
    fontSize: "Medium",
    compactSidebar: false,
    showSidebarIconsOnly: false,
    contentDensity: "Comfortable",
    showWelcomeMessage: true,
    enableAnimatedCharts: true,
    showQuickActionButtons: true,
    enableRealTimeRefresh: true,
    dashboardRefreshInterval: "30 seconds",
    secondaryLanguage: "Hindi",
    employeePortalLanguage: "Follow System",
    emailLanguage: "English (US)",
    allowEmployeeLanguage: true,
    timeFormat: "12-hour (AM/PM)",
    weekStartsOn: "Monday",
    fiscalYearStart: "April 1",
    numberFormat: "1,00,000 (Indian)",
    decimalSeparator: "Dot (1,000.00)",
    currencySymbol: "₹ — Indian Rupee (INR)",
    currencyPosition: "Before Amount (₹1,00,000)",
    salaryDisplayFormat: "In Lakhs (₹12L)",
    showCurrencyConversion: false,
    country: "India",
    state: "Karnataka",
    applicableLaborLaw: "Indian Labour Code 2020",
    taxRegime: "New Tax Regime",
    applyLabourLaw: true,
    pfEsiCompliance: true,
    showRegionalHoliday: true,
    backupFrequency: "Daily",
    backupTime: "03:00 AM",
    retentionPeriod: "30",
    storageLocation: "Google Drive",
    maxBackupCopies: "10",
    encryption: "AES-256",
    includeDocsInBackup: true,
    compressBackup: true,
    sendBackupReport: true,
    backupReportEmail: "admin@nexushr.com",
    importSkipDuplicates: true,
    importUpdateExisting: false,
    importSendWelcome: true,
    importValidate: true,
    exportEmployeeData: true,
    exportAttendance: true,
    exportLeave: true,
    exportPayroll: false,
    exportPerformance: true,
    exportDocs: false,
    exportAuditLogs: false,
    exportFormat: "Excel (.xlsx)",
    exportDateRange: "Apr 1, 2025 – Apr 6, 2026",
    exportDeptFilter: "All Departments",
    exportIncludeInactive: false,
    workflowAutoEscalate: true,
    workflowReminder: true,
    workflowReminderTime: "24 hours before",
    workflowDelegation: true,
    workflowParallel: false,
    workflowCcHr: false,
    leaveAutoApproveShort: true,
    leaveAutoApproveMgrOnLeave: true,
    leaveBlockCritical: true,
    leaveAllowRetroactive: false,
    leaveNotifyMgr: true,
    leaveNotifyEmp: true,
    leaveDigest: true,
    leaveDigestTime: "9:00 AM",
    leaveEscalationHours: "48",
    swapAllow: true,
    swapSameDept: true,
    swapSameShift: false,
    swapCrossLoc: false,
    swapMinNotice: "24",
    swapSkipMgrSameDay: false,
    swapMaxPerMonth: "4",
    swapExpiryHours: "48",
    swapMgrDeadlineHours: "24",
    swapMaxAdvanceDays: "14",
    swapEnforceLimit: true,
    swapAutoDecline: true,
    swapAllowCancel: false,
    swapBlockOtViolation: true,
    swapBlockRestViolation: true,
    swapAutoCalcOt: true,
    swapNotifyCompliance: true,
    swapNotifyB: true,
    swapNotifyMgr: true,
    swapSmsConfirmation: false,
    swapRealTimeCalendar: true,
    docStorageProvider: "AWS S3",
    docMaxFileSize: "25",
    docTotalQuota: "500",
    docAcceptedTypes: "PDF, DOC, DOCX, XLS, XLSX, PNG, JPG",
    docBackupSecondary: true,
    docEmpUpload: true,
    docRequireHrVerify: true,
    docExpiryTracking: true,
    docEmpDownload: true,
    docWatermark: false,
    docAutoDeleteRejected: false,
    docExpiryAlert1: "60",
    docExpiryAlert2: "30",
    docExpiryAlert3: "7",
    docExpiryNotify: "Employee + HR Manager",
    docBlockCriticalExpired: false,
    docAutoNotifyRejection: true,
    lmsMode: "Internal (Built-in)",
    lmsExternalUrl: "https://lms.nexushr.com",
    lmsDefaultLanguage: "English",
    lmsVideoHosting: "Internal Storage",
    lmsCertificateProvider: "NexusHR",
    lmsMaxVideoSize: "500",
    lmsMandatoryEnabled: true,
    lmsBlockAccess: false,
    lmsAutoAssign: true,
    lmsSetDeadline: true,
    lmsDeadlineDays: "30 days from joining",
    lmsPassingScore: "70",
    lmsMaxAttempts: "3",
    lmsCertValidFor: "1 Year",
    lmsReminderBeforeExpiry: "30",
    lmsIssueCert: true,
    lmsShowCertProfile: true,
    lmsRequireSignOff: false,
    lmsTrackProgress: true,
    lmsAnnualBudget: "15,000",
    lmsDeptAllocation: "Proportional to Headcount",
    lmsExternalReimbursement: true,
    lmsReimbursementCap: "10,000",
    lmsRequirePreApproval: true,
    lmsTrackRoi: true,
    lmsLeaderboard: true,
    lmsAwardPoints: true,
    lmsBadges: true,
    lmsShowTeamProgress: false,
    onboardingPreJoiningEmail: true,
    onboardingAutoBuddy: false,
    onboardingDigitalSign: true,
    onboardingBlockPayroll: false,
    onboardingNotifyOverdue: true,
    offboardingEnabled: true,
    offboardingAutoTrigger: true,
    offboardingRequireExitInterview: true,
    offboardingRevokeAccess: true,
    offboardingAutoFf: false,
    offboardingAlumniAccess: false,
    offboardingNoticePeriod: "30",
    offboardingFfDeadline: "45",
  });

  const updateExtraConfig = (key: string, value: string | boolean) => {
    setExtraConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Appearance & Preferences states
  const [themeMode, setThemeMode] = useState("dark");
  const [appLanguage, setAppLanguage] = useState("en");
  const [appTimezone, setAppTimezone] = useState("UTC");
  const [appDateFormat, setAppDateFormat] = useState("YYYY-MM-DD");

  // Company Profile states
  const [companyName, setCompanyName] = useState(
    "NexusHR Technologies Pvt. Ltd.",
  );
  const [legalName, setLegalName] = useState(
    "NexusHR Technologies Private Limited",
  );
  const [industry, setIndustry] = useState("Technology");
  const [foundedYear, setFoundedYear] = useState("2018");
  const [companyEmail, setCompanyEmail] = useState("hr@nexushr.com");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // DepartmentRecord is exported at module scope

  const [deptsList, setDeptsList] = useState<DepartmentRecord[]>([
    {
      code: "EN",
      name: "Engineering",
      head: "Suresh Iyer",
      empCount: 820,
      status: "Active",
      budget: "₹1.2Cr",
      createdDate: "2022-04-10",
      description: "Technical",
    },
    {
      code: "SA",
      name: "Sales",
      head: "Vikram Singh",
      empCount: 540,
      status: "Active",
      budget: "₹85L",
      createdDate: "2022-06-15",
      description: "Commercial",
    },
    {
      code: "HR",
      name: "HR",
      head: "Meera Thomas",
      empCount: 180,
      status: "Active",
      budget: "₹40L",
      createdDate: "2022-01-20",
      description: "People",
    },
    {
      code: "FN",
      name: "Finance",
      head: "Ananya Das",
      empCount: 240,
      status: "Active",
      budget: "₹55L",
      createdDate: "2022-03-05",
      description: "Operations",
    },
    {
      code: "OP",
      name: "Operations",
      head: "Priya Nair",
      empCount: 757,
      status: "Active",
      budget: "₹95L",
      createdDate: "2023-01-12",
      description: "Logistics",
    },
    {
      code: "MK",
      name: "Marketing",
      head: "Sneha Patel",
      empCount: 310,
      status: "Active",
      budget: "₹60L",
      createdDate: "2023-05-18",
      description: "Brand",
    },
    {
      code: "UN",
      name: "Legal",
      head: "",
      empCount: 0,
      status: "Inactive",
      budget: "₹10L",
      createdDate: "2024-02-01",
      description: "Legal & Compliance",
    },
  ]);

  const [selectedDept, setSelectedDept] = useState<DepartmentRecord | null>(
    null,
  );

  const [deptForm, setDeptForm] = useState({
    name: "",
    code: "",
    head: "",
    status: "Active",
    budget: "",
    description: "",
  });

  const [deptSearchQuery, setDeptSearchQuery] = useState("");
  const [deptStatusFilter, setDeptStatusFilter] = useState("All Status");
  const [deptSortBy, setDeptSortBy] = useState("Name");

  // LocationRecord is exported at module scope

  const [locationsList, setLocationsList] = useState<LocationRecord[]>([
    {
      name: "Bengaluru HQ",
      code: "BLR-01",
      type: "Head Office",
      address: "42, Tech Park, Whitefield",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      pincode: "560066",
      manager: "Suresh Iyer",
      empCount: 1420,
      timezone: "IST (UTC+5:30)",
      status: "Active",
      createdDate: "2020-01-15",
    },
    {
      name: "Mumbai Branch",
      code: "MUM-02",
      type: "Branch",
      address: "BKC, Bandra East",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400051",
      manager: "Vikram Singh",
      empCount: 680,
      timezone: "IST (UTC+5:30)",
      status: "Active",
      createdDate: "2021-03-10",
    },
    {
      name: "US Remote",
      code: "USA-03",
      type: "Remote",
      address: "Work from home",
      city: "Various",
      state: "Various",
      country: "USA",
      pincode: "00000",
      manager: "Meera Thomas",
      empCount: 42,
      timezone: "PST (UTC-8)",
      status: "Active",
      createdDate: "2022-05-20",
    },
    {
      name: "Europe Remote",
      code: "EUR-04",
      type: "Remote",
      address: "Work from home",
      city: "Various",
      state: "Various",
      country: "UK/EU",
      pincode: "00000",
      manager: "Ananya Das",
      empCount: 18,
      timezone: "GMT (UTC+0)",
      status: "Partial",
      createdDate: "2023-02-11",
    },
    {
      name: "Delhi Warehouse",
      code: "DEL-05",
      type: "Warehouse",
      address: "Okhla Phase III",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110020",
      manager: "Rahul Sharma",
      empCount: 0,
      timezone: "IST (UTC+5:30)",
      status: "Inactive",
      createdDate: "2024-06-01",
    },
  ]);

  const [selectedLoc, setSelectedLoc] = useState<LocationRecord | null>(null);

  const [locForm, setLocForm] = useState({
    name: "",
    code: "",
    type: "Branch" as "Head Office" | "Branch" | "Warehouse" | "Remote",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    manager: "",
    timezone: "IST (UTC+5:30)",
    status: "Active" as "Active" | "Inactive" | "Partial",
    notes: "",
  });

  const [locSearchQuery, setLocSearchQuery] = useState("");
  const [locStatusFilter, setLocStatusFilter] = useState("All");
  const [locTypeFilter, setLocTypeFilter] = useState("All");
  const [locSortBy, setLocSortBy] = useState("Name");

  // WorkScheduleRecord is exported at module scope

  const [schedulesList, setSchedulesList] = useState<WorkScheduleRecord[]>([
    {
      name: "Standard 5-Day",
      code: "SCH-STD",
      type: "General",
      startTime: "09:00",
      endTime: "18:00",
      breakDuration: 60,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      weekends: ["Sat", "Sun"],
      graceTime: 15,
      halfDayRule: "Under 4 hours",
      otEligible: true,
      dept: "All",
      location: "Bengaluru HQ",
      empCount: 1284,
      status: "Active",
    },
    {
      name: "Night Shift",
      code: "SCH-NIGHT",
      type: "Shift",
      startTime: "22:00",
      endTime: "06:00",
      breakDuration: 45,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      weekends: ["Sun"],
      graceTime: 10,
      halfDayRule: "Under 3.5 hours",
      otEligible: true,
      dept: "Operations",
      location: "Mumbai Branch",
      empCount: 340,
      status: "Active",
    },
    {
      name: "Flexible Remote",
      code: "SCH-FLEX",
      type: "Flexible",
      startTime: "Flexible",
      endTime: "Flexible",
      breakDuration: 60,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      weekends: ["Sat", "Sun"],
      graceTime: 0,
      halfDayRule: "Under 4 hours",
      otEligible: false,
      dept: "Engineering",
      location: "US Remote",
      empCount: 223,
      status: "Active",
    },
    {
      name: "Weekend Support",
      code: "SCH-WKND",
      type: "Part Time",
      startTime: "10:00",
      endTime: "18:00",
      breakDuration: 60,
      workingDays: ["Sat", "Sun"],
      weekends: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      graceTime: 15,
      halfDayRule: "Under 4 hours",
      otEligible: true,
      dept: "Customer Support",
      location: "Bengaluru HQ",
      empCount: 45,
      status: "Active",
    },
  ]);

  const [selectedSchedule, setSelectedSchedule] =
    useState<WorkScheduleRecord | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    code: "",
    type: "General" as
      | "General"
      | "Shift"
      | "Flexible"
      | "Rotational"
      | "Part Time",
    startTime: "09:00",
    endTime: "18:00",
    breakDuration: 60,
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    weekends: ["Sat", "Sun"],
    graceTime: 15,
    halfDayRule: "Under 4 hours",
    otEligible: true,
    dept: "All",
    location: "All",
    status: "Active" as "Active" | "Inactive",
  });

  const [schedSearchQuery, setSchedSearchQuery] = useState("");
  const [schedStatusFilter, setSchedStatusFilter] = useState("All");
  const [schedTypeFilter, setSchedTypeFilter] = useState("All");
  const [schedLocFilter, setSchedLocFilter] = useState("All");

  // HolidayRecord is exported at module scope

  const [holidaysList, setHolidaysList] = useState<HolidayRecord[]>([
    {
      name: "Republic Day",
      date: "2026-01-26",
      day: "Monday",
      type: "National",
      location: "All Locations",
      dept: "All",
      recurring: true,
      status: "Active",
      description: "Commemorates the adoption of the Constitution",
    },
    {
      name: "Holi",
      date: "2026-03-14",
      day: "Saturday",
      type: "Regional",
      location: "Mumbai Branch",
      dept: "All",
      recurring: false,
      status: "Active",
      description: "Festival of colors",
    },
    {
      name: "Company Foundation Day",
      date: "2026-04-15",
      day: "Wednesday",
      type: "Company",
      location: "All Locations",
      dept: "All",
      recurring: true,
      status: "Active",
      description: "Company annual milestone celebration",
    },
    {
      name: "Independence Day",
      date: "2026-08-15",
      day: "Saturday",
      type: "National",
      location: "All Locations",
      dept: "All",
      recurring: true,
      status: "Active",
      description: "Indian Independence Day",
    },
    {
      name: "Diwali",
      date: "2026-10-20",
      day: "Festival",
      location: "All Locations",
      dept: "All",
      recurring: false,
      status: "Active",
      description: "Festival of lights",
      type: "National",
    },
    {
      name: "Christmas",
      date: "2026-12-25",
      day: "Friday",
      type: "Optional",
      location: "Delhi Warehouse",
      dept: "All",
      recurring: true,
      status: "Active",
      description: "Christmas holiday",
    },
  ]);

  const [selectedHoliday, setSelectedHoliday] = useState<HolidayRecord | null>(
    null,
  );

  const [holidayForm, setHolidayForm] = useState({
    name: "",
    date: "2026-01-01",
    type: "National" as
      | "National"
      | "Company"
      | "Optional"
      | "Regional"
      | "Festival",
    location: "All Locations",
    dept: "All",
    recurring: true,
    status: "Active" as "Active" | "Inactive",
    description: "",
  });

  const [holSearchQuery, setHolSearchQuery] = useState("");
  const [holYearFilter, setHolYearFilter] = useState("2026");
  const [holMonthFilter, setHolMonthFilter] = useState("All");
  const [holTypeFilter, setHolTypeFilter] = useState("All");
  const [holLocFilter, setHolLocFilter] = useState("All");
  const [holStatusFilter, setHolStatusFilter] = useState("All");
  const [holidayViewMode, setHolidayViewMode] = useState<"List" | "Calendar">(
    "List",
  );

  // LeaveTypeRecord is exported at module scope

  const [leaveTypesList, setLeaveTypesList] = useState<LeaveTypeRecord[]>([
    {
      name: "Casual Leave",
      code: "CL",
      days: 12,
      type: "Paid",
      carryForward: false,
      maxCarryForward: 0,
      encashment: false,
      approvalRequired: true,
      attachmentRequired: false,
      minNoticePeriod: 1,
      maxConsecutiveLeave: 3,
      dept: "All",
      location: "All Locations",
      status: "Active",
      description: "Standard casual leaves",
    },
    {
      name: "Earned Leave",
      code: "EL",
      days: 24,
      type: "Paid",
      carryForward: true,
      maxCarryForward: 15,
      encashment: true,
      approvalRequired: true,
      attachmentRequired: false,
      minNoticePeriod: 7,
      maxConsecutiveLeave: 10,
      dept: "All",
      location: "All Locations",
      status: "Active",
      description: "Privilege leaves",
    },
    {
      name: "Sick Leave",
      code: "SL",
      days: 12,
      type: "Paid",
      carryForward: false,
      maxCarryForward: 0,
      encashment: false,
      approvalRequired: false,
      attachmentRequired: true,
      minNoticePeriod: 0,
      maxConsecutiveLeave: 5,
      dept: "All",
      location: "All Locations",
      status: "Active",
      description: "Medical leaves",
    },
  ]);

  const [selectedLeaveType, setSelectedLeaveType] =
    useState<LeaveTypeRecord | null>(null);

  const [leaveTypeForm, setLeaveTypeForm] = useState({
    name: "",
    code: "",
    days: 12,
    type: "Paid" as "Paid" | "Unpaid",
    carryForward: false,
    maxCarryForward: 0,
    encashment: false,
    approvalRequired: true,
    attachmentRequired: false,
    minNoticePeriod: 1,
    maxConsecutiveLeave: 5,
    dept: "All",
    location: "All Locations",
    status: "Active" as "Active" | "Inactive",
    description: "",
  });

  const [lpApprovalLevels, setLpApprovalLevels] = useState(2);

  const [lpLastUpdatedBy, setLpLastUpdatedBy] = useState(
    "Ryan Park (Super Admin)",
  );
  const [lpLastUpdatedTime, setLpLastUpdatedTime] = useState(
    "2026-04-28 11:30 AM",
  );
  const [lpPolicyVersion, setLpPolicyVersion] = useState("v2.4");

  // UserManagementRecord is exported at module scope

  const [usersList, setUsersList] = useState<UserManagementRecord[]>([
    {
      name: "Ryan Park",
      email: "ryan@nexushr.com",
      initials: "RP",
      avatarBg: "#10B981",
      role: "Super Admin",
      dept: "HR",
      location: "New York",
      lastLogin: "Today, 9:02 AM",
      status: "Active",
    },
    {
      name: "Meera Thomas",
      email: "meera@nexushr.com",
      initials: "MT",
      avatarBg: "#0EA5E9",
      role: "HR Manager",
      dept: "HR",
      location: "London",
      lastLogin: "Today, 8:45 AM",
      status: "Active",
    },
    {
      name: "Suresh Iyer",
      email: "suresh@nexushr.com",
      initials: "SI",
      avatarBg: "#F59E0B",
      role: "Manager",
      dept: "Engineering",
      location: "Bangalore",
      lastLogin: "Yesterday",
      status: "Active",
    },
    {
      name: "Ananya Das",
      email: "ananya@nexushr.com",
      initials: "AD",
      avatarBg: "#EF4444",
      role: "Finance",
      dept: "Finance",
      location: "Mumbai",
      lastLogin: "Apr 4, 2026",
      status: "Active",
    },
    {
      name: "John Doe",
      email: "john@nexushr.com",
      initials: "JD",
      avatarBg: "#6B7280",
      role: "Manager",
      dept: "Sales",
      location: "Chicago",
      lastLogin: "Jan 10, 2026",
      status: "Inactive",
    },
    {
      name: "Priya Sharma",
      email: "priya.new@nexushr.com",
      initials: "PS",
      avatarBg: "#10B981",
      role: "HR Manager",
      dept: "HR",
      location: "Delhi",
      lastLogin: "Never",
      status: "Pending Invite",
    },
    {
      name: "Leo Martinez",
      email: "leo.m@nexushr.com",
      initials: "LM",
      avatarBg: "#F59E0B",
      role: "Manager",
      dept: "Engineering",
      location: "Austin",
      lastLogin: "Never",
      status: "Pending Invite",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<UserManagementRecord | null>(
    null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "Employee",
    dept: "Engineering",
    location: "",
    sendEmail: true,
    tempPassword: "",
    notes: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    dept: "",
    location: "",
    status: "",
    permissions: "",
  });

  const [reactivateConfirm, setReactivateConfirm] = useState({
    sendEmail: true,
    confirmDetails: false,
  });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" };
      case "Pending Invite":
        return { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" };
      case "Inactive":
        return { color: "#6B7280", bg: "rgba(107, 114, 128, 0.1)" };
      case "Suspended":
        return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" };
      default:
        return { color: "#6B7280", bg: "rgba(107, 114, 128, 0.1)" };
    }
  };

  const getRoleStyles = (role: string) => {
    switch (role) {
      case "Super Admin":
        return { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" };
      case "HR Manager":
        return { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" };
      case "Manager":
        return { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" };
      case "Finance":
        return { color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)" };
      case "Employee":
      default:
        return { color: "#6B7280", bg: "rgba(107, 114, 128, 0.1)" };
    }
  };

  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [registeredAddress, setRegisteredAddress] = useState(
    "42, Tech Park, Whitefield, Bengaluru 560066",
  );

  const [country, setCountry] = useState("India");
  const [timezone, setTimezone] = useState("IST (UTC+5:30)");
  const [financialYear, setFinancialYear] = useState("April 1");
  const [currency, setCurrency] = useState("INR (₹)");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");

  // Department states
  const [allowSubDepts, setAllowSubDepts] = useState(true);
  const [requireCostCenter, setRequireCostCenter] = useState(true);
  const [budgetTracking, setBudgetTracking] = useState(true);
  const [budgetThreshold, setBudgetThreshold] = useState("85");

  // Location states
  const [gpsAttendance, setGpsAttendance] = useState(true);
  const [allowRemoteWork, setAllowRemoteWork] = useState(true);
  const [requireGeofence, setRequireGeofence] = useState(false);
  const [regionHolidays, setRegionHolidays] = useState(true);
  const [geofenceRadius, setGeofenceRadius] = useState("200");
  const [defaultLocCountry, setDefaultLocCountry] = useState("India");

  // Work Schedule states
  const [wsGracePeriod, setWsGracePeriod] = useState("15");
  const [wsWeeklyHours, setWsWeeklyHours] = useState("48");
  const [wsOtThreshold, setWsOtThreshold] = useState("8");
  const [wsMinRest, setWsMinRest] = useState("8");
  const [wsHalfDay, setWsHalfDay] = useState("4");
  const [wsAbsentThreshold, setWsAbsentThreshold] = useState("2");
  const [wsAutoOt, setWsAutoOt] = useState(true);
  const [wsRequireOtApproval, setWsRequireOtApproval] = useState(true);
  const [wsOtAlert, setWsOtAlert] = useState(true);
  const [wsCompOff, setWsCompOff] = useState(false);

  // Holiday states
  const [holAutoMark, setHolAutoMark] = useState(true);
  const [holOptional, setHolOptional] = useState(true);
  const [holRegionSpecific, setHolRegionSpecific] = useState(true);

  // Holiday filter states

  const [payrollCycle, setPayrollCycle] = useState("Monthly");
  const [payrollCutoff, setPayrollCutoff] = useState("25");
  const [payrollPayout, setPayrollPayout] = useState("1st");
  const [prGrossStructure] = useState("₹45,000 Avg");
  const [prComponentsCount] = useState(6);
  const [prNextRun] = useState("May 01, 2026");

  const [prLastUpdatedBy, setPrLastUpdatedBy] = useState(
    "Ryan Park (Super Admin)",
  );
  const [prLastUpdatedTime, setPrLastUpdatedTime] = useState(
    "2026-04-25 09:45 AM",
  );

  // Attendance Rules
  const [prLopEnabled, setPrLopEnabled] = useState(true);
  const [prHalfDayCalc, setPrHalfDayCalc] = useState("Under 4 hours");
  const [prOtPay, setPrOtPay] = useState(true);
  const [prLateDeduct, setPrLateDeduct] = useState(false);

  // Payslip Settings
  const [prPayslipLogo, setPrPayslipLogo] = useState(true);
  const [prPayslipTemplate, setPrPayslipTemplate] = useState("Classic Green");
  const [prAutoEmail, setPrAutoEmail] = useState(true);

  // Compliance
  const [prPfRate, setPrPfRate] = useState("12%");
  const [prEsiRate, setPrEsiRate] = useState("0.75%");
  const [prTaxMode, setPrTaxMode] = useState("New Regime (Default)");

  // SalaryComponent is exported at module scope

  const [salaryComponentsList] = useState<SalaryComponent[]>([
    {
      name: "Basic Pay",
      type: "Earning",
      amountType: "Percentage",
      value: "50% of CTC",
      taxable: true,
    },
    {
      name: "HRA",
      type: "Earning",
      amountType: "Percentage",
      value: "40% of Basic",
      taxable: true,
    },
    {
      name: "Conveyance",
      type: "Earning",
      amountType: "Fixed",
      value: "₹1,600",
      taxable: false,
    },
    {
      name: "Medical",
      type: "Earning",
      amountType: "Fixed",
      value: "₹1,250",
      taxable: false,
    },
    {
      name: "Special Allowance",
      type: "Earning",
      amountType: "Fixed",
      value: "Variable",
      taxable: true,
    },
    {
      name: "Bonus",
      type: "Earning",
      amountType: "Fixed",
      value: "Variable",
      taxable: true,
    },
    {
      name: "PF",
      type: "Deduction",
      amountType: "Percentage",
      value: "12% of Basic",
      taxable: false,
    },
    {
      name: "ESI",
      type: "Deduction",
      amountType: "Percentage",
      value: "0.75% of Gross",
      taxable: false,
    },
    {
      name: "Professional Tax",
      type: "Deduction",
      amountType: "Fixed",
      value: "₹200",
      taxable: false,
    },
    {
      name: "Income Tax",
      type: "Deduction",
      amountType: "Percentage",
      value: "Slab based",
      taxable: false,
    },
    {
      name: "Loan Recovery",
      type: "Deduction",
      amountType: "Fixed",
      value: "Based on Plan",
      taxable: false,
    },
  ]);

  const handlePayrollSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setPrLastUpdatedBy("Ryan Park (Super Admin)");
      const now = new Date();
      setPrLastUpdatedTime(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
      setIsSubmitting(false);
      showToast("Payroll settings updated successfully", "success");
      setActiveModal(null);
    }, 1500);
  };

  const handleResetPayroll = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setPayrollCycle("Monthly");
      setPayrollCutoff("25");
      setPayrollPayout("1st");
      setPrLopEnabled(true);
      setPrHalfDayCalc("Under 4 hours");
      setPrOtPay(true);
      setPrLateDeduct(false);
      setPrPayslipLogo(true);
      setPrPayslipTemplate("Classic Green");
      setPrAutoEmail(true);

      setPrPfRate("12%");
      setPrEsiRate("0.75%");
      setPrTaxMode("New Regime (Default)");
      setIsSubmitting(false);
      showToast("Payroll settings reset to default", "success");
    }, 1000);
  };

  // Performance Settings states

  const [perfReviewFreq, setPerfReviewFreq] = useState("Annual");
  const [perfReviewMonth, setPerfReviewMonth] = useState("April");
  const [perfSelfReviewWin, setPerfSelfReviewWin] = useState("14");
  const [perfMgrReviewWin, setPerfMgrReviewWin] = useState("21");
  const [perfCalibrationDeadline, setPerfCalibrationDeadline] = useState("28");
  const [perfHrFinalizationDeadline, setPerfHrFinalizationDeadline] =
    useState("35");
  const [perfRatingScale, setPerfRatingScale] = useState("5-Point Scale");

  const [perfPeerFeedback, setPerfPeerFeedback] = useState(true);
  const [perfAnonPeerFeedback, setPerfAnonPeerFeedback] = useState(true);
  const [perfSubFeedback, setPerfSubFeedback] = useState(false);
  const [perfClientFeedback, setPerfClientFeedback] = useState(false);
  const [perfMinPeers, setPerfMinPeers] = useState("3");

  const [perfGoalSetting, setPerfGoalSetting] = useState(true);
  const [perfLinkGoals, setPerfLinkGoals] = useState(true);
  const [perfRequireGoalApp, setPerfRequireGoalApp] = useState(true);
  const [perfQuarterlyCheckin, setPerfQuarterlyCheckin] = useState(true);
  const [perfOkrSupport, setPerfOkrSupport] = useState(false);
  const [perfMaxGoals, setPerfMaxGoals] = useState("8");
  const [perfGoalDeadline, setPerfGoalDeadline] = useState("30");

  // Security Settings states (New)
  const [secEnforceMfa, setSecEnforceMfa] = useState(true);
  const [secGoogleSso, setSecGoogleSso] = useState(true);
  const [secMicrosoftSso, setSecMicrosoftSso] = useState(false);
  const [secSsoOnly, setSecSsoOnly] = useState(false);

  const [secPwMinLen, setSecPwMinLen] = useState(true);
  const [secPwUpper, setSecPwUpper] = useState(true);
  const [secPwNumbers, setSecPwNumbers] = useState(true);
  const [secPwPreventReuse, setSecPwPreventReuse] = useState(false);
  const [secPwForceChange, setSecPwForceChange] = useState(false);

  const [secPwExpiry, setSecPwExpiry] = useState("90");
  const [secMaxFailedAttempts, setSecMaxFailedAttempts] = useState("5");
  const [secLockoutDuration, setSecLockoutDuration] = useState("30");
  const [secLockoutResetMethod, setSecLockoutResetMethod] =
    useState("Manual by Admin");

  // API Settings states
  const [apiRest, setApiRest] = useState(true);
  const [apiIpWhite, setApiIpWhite] = useState(false);
  const [apiWebhook, setApiWebhook] = useState(true);
  const [apiLog, setApiLog] = useState(true);
  const [apiRateLimit, setApiRateLimit] = useState("100");
  const [apiTokenExp, setApiTokenExp] = useState("24");
  const [apiConcurrent, setApiConcurrent] = useState("50");
  const [apiVersion, setApiVersion] = useState("v2 (latest)");
  const [apiAllowedIp, setApiAllowedIp] = useState("");

  // Webhook state triggers
  const [webhookRetry, setWebhookRetry] = useState(true);
  const [webhookHmac, setWebhookHmac] = useState(true);
  const [webhookLogs, setWebhookLogs] = useState(true);

  // Email Template state triggers
  const [emailFromName, setEmailFromName] = useState("NexusHR EMS");
  const [emailFromAddress, setEmailFromAddress] = useState(
    "no-reply@nexushr.com",
  );
  const [emailReplyTo, setEmailReplyTo] = useState("hr@nexushr.com");
  const [emailProvider, setEmailProvider] = useState("SendGrid");
  const [emailAddLogo, setEmailAddLogo] = useState(true);
  const [emailAddUnsub, setEmailAddUnsub] = useState(true);
  const [emailBccHr, setEmailBccHr] = useState(false);

  // Notification state triggers
  const [notifyLeaveEmail, setNotifyLeaveEmail] = useState(true);
  const [notifyLeavePush, setNotifyLeavePush] = useState(true);
  const [notifyLeaveSms, setNotifyLeaveSms] = useState(false);
  const [notifyPayEmail, setNotifyPayEmail] = useState(true);
  const [notifyPayPush, setNotifyPayPush] = useState(true);
  const [notifyPaySms, setNotifyPaySms] = useState(true);
  const [notifyAttEmail, setNotifyAttEmail] = useState(false);
  const [notifyAttPush, setNotifyAttPush] = useState(true);
  const [notifyAttSms, setNotifyAttSms] = useState(false);
  const [notifyPerfEmail, setNotifyPerfEmail] = useState(true);
  const [notifyPerfPush, setNotifyPerfPush] = useState(false);
  const [notifyPerfSms, setNotifyPerfSms] = useState(false);
  const [notifyEmpEmail, setNotifyEmpEmail] = useState(true);
  const [notifyEmpPush, setNotifyEmpPush] = useState(true);
  const [notifyEmpSms, setNotifyEmpSms] = useState(false);
  const [notifyShiftEmail, setNotifyShiftEmail] = useState(false);
  const [notifyShiftPush, setNotifyShiftPush] = useState(true);
  const [notifyShiftSms, setNotifyShiftSms] = useState(true);
  const [notifyDocEmail, setNotifyDocEmail] = useState(false);
  const [notifyDocPush, setNotifyDocPush] = useState(true);
  const [notifyDocSms, setNotifyDocSms] = useState(false);
  const [notifySysEmail, setNotifySysEmail] = useState(true);
  const [notifySysPush, setNotifySysPush] = useState(true);
  const [notifySysSms, setNotifySysSms] = useState(true);

  const [notifyDigestFreq, setNotifyDigestFreq] = useState("Daily at 9 AM");
  const [notifyLeaveDays, setNotifyLeaveDays] = useState("2");
  const [notifyPerfDays, setNotifyPerfDays] = useState("5");
  const [notifyPayTime, setNotifyPayTime] = useState("6:00 AM");
  const [notifyWeekend, setNotifyWeekend] = useState(false);
  const [notifyQuiet, setNotifyQuiet] = useState(true);

  // SMS Settings state triggers
  const [smsProvider, setSmsProvider] = useState("Twilio");
  const [smsSenderId, setSmsSenderId] = useState("NEXUHR");
  const [smsApiKey, setSmsApiKey] = useState("sk_live_••••••••••••••••");
  const [smsAuthToken, setSmsAuthToken] = useState("••••••••••••••••••••");
  const [smsCountryCode, setSmsCountryCode] = useState("+91 (India)");
  const [smsDltId, setSmsDltId] = useState("1234567890123456");

  const [smsTriggerPay, setSmsTriggerPay] = useState(true);
  const [smsTriggerLeave, setSmsTriggerLeave] = useState(true);
  const [smsTriggerOtp, setSmsTriggerOtp] = useState(true);
  const [smsTriggerShift, setSmsTriggerShift] = useState(false);
  const [smsTriggerAtt, setSmsTriggerAtt] = useState(false);
  const [smsTriggerOnboard, setSmsTriggerOnboard] = useState(true);
  const [smsTriggerPerf, setSmsTriggerPerf] = useState(false);

  const [secIdleTimeout, setSecIdleTimeout] = useState(30);
  const [secIpWhitelisting, setSecIpWhitelisting] = useState(false);
  const [secLogLogins, setSecLogLogins] = useState(true);
  const [secAlertSuspicious, setSecAlertSuspicious] = useState(true);
  const [secAllowedIpRanges, setSecAllowedIpRanges] = useState(
    "192.168.1.0/24\n10.0.0.0/8",
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mt-6 mb-4">
      <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#9CA3AF",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </div>
  );

  const toggleCell = (modId: string, roleId: string) => {
    setPermissions((prev) => {
      const current = prev[modId][roleId];
      const next =
        current === "full" ? "view" : current === "view" ? "no" : "full";

      return {
        ...prev,
        [modId]: {
          ...prev[modId],
          [roleId]: next,
        },
      };
    });
  };

  const contextValue = {
    // Sidebar / navigation
    sections,
    activeSubTab,
    setActiveSubTab,
    sidebarSearch,
    setSidebarSearch,
    collapsedCategories,
    setCollapsedCategories,
    isSidebarOpen,
    setIsSidebarOpen,

    // Roles & Permissions
    permissions,
    setPermissions,
    rolesList,
    setRolesList,
    selectedRoleForEdit,
    setSelectedRoleForEdit,
    roleForm,
    setRoleForm,
    expandedGroups,
    setExpandedGroups,
    permissionGroups,
    openCreateRoleModal,
    openEditRoleModal,
    handleRoleSubmit,
    confirmEditRoleSubmit,
    toggleCell,

    // Modals
    activeModal,
    setActiveModal,
    isSubmitting,
    setIsSubmitting,

    // Toast
    toast,
    setToast,
    showToast,

    // Company Profile
    companyName,
    setCompanyName,
    legalName,
    setLegalName,
    industry,
    setIndustry,
    foundedYear,
    setFoundedYear,
    companyEmail,
    setCompanyEmail,
    supportPhone,
    setSupportPhone,
    registeredAddress,
    setRegisteredAddress,
    country,
    setCountry,
    timezone,
    setTimezone,
    financialYear,
    setFinancialYear,
    currency,
    setCurrency,
    dateFormat,
    setDateFormat,

    // Departments
    deptsList,
    setDeptsList,
    selectedDept,
    setSelectedDept,
    deptForm,
    setDeptForm,
    deptSearchQuery,
    setDeptSearchQuery,
    deptStatusFilter,
    setDeptStatusFilter,
    deptSortBy,
    setDeptSortBy,
    allowSubDepts,
    setAllowSubDepts,
    requireCostCenter,
    setRequireCostCenter,
    budgetTracking,
    setBudgetTracking,
    budgetThreshold,
    setBudgetThreshold,

    // Locations
    locationsList,
    setLocationsList,
    selectedLoc,
    setSelectedLoc,
    locForm,
    setLocForm,
    locSearchQuery,
    setLocSearchQuery,
    locStatusFilter,
    setLocStatusFilter,
    locTypeFilter,
    setLocTypeFilter,
    locSortBy,
    setLocSortBy,
    gpsAttendance,
    setGpsAttendance,
    allowRemoteWork,
    setAllowRemoteWork,
    requireGeofence,
    setRequireGeofence,
    regionHolidays,
    setRegionHolidays,
    geofenceRadius,
    setGeofenceRadius,
    defaultLocCountry,
    setDefaultLocCountry,

    // Work Schedules
    schedulesList,
    setSchedulesList,
    selectedSchedule,
    setSelectedSchedule,
    scheduleForm,
    setScheduleForm,
    wsGracePeriod,
    setWsGracePeriod,
    wsWeeklyHours,
    setWsWeeklyHours,
    wsOtThreshold,
    setWsOtThreshold,
    wsMinRest,
    setWsMinRest,
    wsHalfDay,
    setWsHalfDay,
    wsAbsentThreshold,
    setWsAbsentThreshold,
    wsAutoOt,
    setWsAutoOt,
    wsRequireOtApproval,
    setWsRequireOtApproval,
    wsOtAlert,
    setWsOtAlert,
    wsCompOff,
    setWsCompOff,
    schedSearchQuery,
    setSchedSearchQuery,
    schedStatusFilter,
    setSchedStatusFilter,
    schedTypeFilter,
    setSchedTypeFilter,
    schedLocFilter,
    setSchedLocFilter,

    // Holidays
    holidaysList,
    setHolidaysList,
    selectedHoliday,
    setSelectedHoliday,
    holidayForm,
    setHolidayForm,
    holAutoMark,
    setHolAutoMark,
    holOptional,
    setHolOptional,
    holRegionSpecific,
    setHolRegionSpecific,
    holSearchQuery,
    setHolSearchQuery,
    holYearFilter,
    setHolYearFilter,
    holMonthFilter,
    setHolMonthFilter,
    holTypeFilter,
    setHolTypeFilter,
    holLocFilter,
    setHolLocFilter,
    holStatusFilter,
    setHolStatusFilter,
    holidayViewMode,
    setHolidayViewMode,

    // Leave Policy
    leaveTypesList,
    setLeaveTypesList,
    selectedLeaveType,
    setSelectedLeaveType,
    leaveTypeForm,
    setLeaveTypeForm,
    lpApprovalLevels,
    setLpApprovalLevels,
    lpPolicyVersion,
    setLpPolicyVersion,
    lpLastUpdatedBy,
    setLpLastUpdatedBy,
    lpLastUpdatedTime,
    setLpLastUpdatedTime,

    // Payroll
    payrollCycle,
    setPayrollCycle,
    payrollCutoff,
    setPayrollCutoff,
    payrollPayout,
    setPayrollPayout,
    prGrossStructure,
    prComponentsCount,
    prNextRun,
    prLastUpdatedBy,
    setPrLastUpdatedBy,
    prLastUpdatedTime,
    setPrLastUpdatedTime,
    prLopEnabled,
    setPrLopEnabled,
    prHalfDayCalc,
    setPrHalfDayCalc,
    prOtPay,
    setPrOtPay,
    prLateDeduct,
    setPrLateDeduct,
    prPayslipLogo,
    setPrPayslipLogo,
    prPayslipTemplate,
    setPrPayslipTemplate,
    prAutoEmail,
    setPrAutoEmail,
    prPfRate,
    setPrPfRate,
    prEsiRate,
    setPrEsiRate,
    prTaxMode,
    setPrTaxMode,
    salaryComponentsList,
    handlePayrollSubmit,
    handleResetPayroll,

    // Performance
    perfReviewFreq,
    setPerfReviewFreq,
    perfReviewMonth,
    setPerfReviewMonth,
    perfSelfReviewWin,
    setPerfSelfReviewWin,
    perfMgrReviewWin,
    setPerfMgrReviewWin,
    perfCalibrationDeadline,
    setPerfCalibrationDeadline,
    perfHrFinalizationDeadline,
    setPerfHrFinalizationDeadline,
    perfRatingScale,
    setPerfRatingScale,
    perfPeerFeedback,
    setPerfPeerFeedback,
    perfAnonPeerFeedback,
    setPerfAnonPeerFeedback,
    perfSubFeedback,
    setPerfSubFeedback,
    perfClientFeedback,
    setPerfClientFeedback,
    perfMinPeers,
    setPerfMinPeers,
    perfGoalSetting,
    setPerfGoalSetting,
    perfLinkGoals,
    setPerfLinkGoals,
    perfRequireGoalApp,
    setPerfRequireGoalApp,
    perfQuarterlyCheckin,
    setPerfQuarterlyCheckin,
    perfOkrSupport,
    setPerfOkrSupport,
    perfMaxGoals,
    setPerfMaxGoals,
    perfGoalDeadline,
    setPerfGoalDeadline,

    // Security
    secEnforceMfa,
    setSecEnforceMfa,
    secGoogleSso,
    setSecGoogleSso,
    secMicrosoftSso,
    setSecMicrosoftSso,
    secSsoOnly,
    setSecSsoOnly,
    secPwMinLen,
    setSecPwMinLen,
    secPwUpper,
    setSecPwUpper,
    secPwNumbers,
    setSecPwNumbers,
    secPwPreventReuse,
    setSecPwPreventReuse,
    secPwForceChange,
    setSecPwForceChange,
    secPwExpiry,
    setSecPwExpiry,
    secMaxFailedAttempts,
    setSecMaxFailedAttempts,
    secLockoutDuration,
    setSecLockoutDuration,
    secLockoutResetMethod,
    setSecLockoutResetMethod,
    secIdleTimeout,
    setSecIdleTimeout,
    secIpWhitelisting,
    setSecIpWhitelisting,
    secLogLogins,
    setSecLogLogins,
    secAlertSuspicious,
    setSecAlertSuspicious,
    secAllowedIpRanges,
    setSecAllowedIpRanges,

    // API & Integrations
    apiRest,
    setApiRest,
    apiIpWhite,
    setApiIpWhite,
    apiWebhook,
    setApiWebhook,
    apiLog,
    setApiLog,
    apiRateLimit,
    setApiRateLimit,
    apiTokenExp,
    setApiTokenExp,
    apiConcurrent,
    setApiConcurrent,
    apiVersion,
    setApiVersion,
    apiAllowedIp,
    setApiAllowedIp,
    webhookRetry,
    setWebhookRetry,
    webhookHmac,
    setWebhookHmac,
    webhookLogs,
    setWebhookLogs,

    // Email & Notifications
    emailFromName,
    setEmailFromName,
    emailFromAddress,
    setEmailFromAddress,
    emailReplyTo,
    setEmailReplyTo,
    emailProvider,
    setEmailProvider,
    emailAddLogo,
    setEmailAddLogo,
    emailAddUnsub,
    setEmailAddUnsub,
    emailBccHr,
    setEmailBccHr,
    notifyLeaveEmail,
    setNotifyLeaveEmail,
    notifyLeavePush,
    setNotifyLeavePush,
    notifyLeaveSms,
    setNotifyLeaveSms,
    notifyPayEmail,
    setNotifyPayEmail,
    notifyPayPush,
    setNotifyPayPush,
    notifyPaySms,
    setNotifyPaySms,
    notifyAttEmail,
    setNotifyAttEmail,
    notifyAttPush,
    setNotifyAttPush,
    notifyAttSms,
    setNotifyAttSms,
    notifyPerfEmail,
    setNotifyPerfEmail,
    notifyPerfPush,
    setNotifyPerfPush,
    notifyPerfSms,
    setNotifyPerfSms,
    notifyEmpEmail,
    setNotifyEmpEmail,
    notifyEmpPush,
    setNotifyEmpPush,
    notifyEmpSms,
    setNotifyEmpSms,
    notifyShiftEmail,
    setNotifyShiftEmail,
    notifyShiftPush,
    setNotifyShiftPush,
    notifyShiftSms,
    setNotifyShiftSms,
    notifyDocEmail,
    setNotifyDocEmail,
    notifyDocPush,
    setNotifyDocPush,
    notifyDocSms,
    setNotifyDocSms,
    notifySysEmail,
    setNotifySysEmail,
    notifySysPush,
    setNotifySysPush,
    notifySysSms,
    setNotifySysSms,
    notifyDigestFreq,
    setNotifyDigestFreq,
    notifyLeaveDays,
    setNotifyLeaveDays,
    notifyPerfDays,
    setNotifyPerfDays,
    notifyPayTime,
    setNotifyPayTime,
    notifyWeekend,
    setNotifyWeekend,
    notifyQuiet,
    setNotifyQuiet,

    // SMS
    smsProvider,
    setSmsProvider,
    smsSenderId,
    setSmsSenderId,
    smsApiKey,
    setSmsApiKey,
    smsAuthToken,
    setSmsAuthToken,
    smsCountryCode,
    setSmsCountryCode,
    smsDltId,
    setSmsDltId,
    smsTriggerPay,
    setSmsTriggerPay,
    smsTriggerLeave,
    setSmsTriggerLeave,
    smsTriggerOtp,
    setSmsTriggerOtp,
    smsTriggerShift,
    setSmsTriggerShift,
    smsTriggerAtt,
    setSmsTriggerAtt,
    smsTriggerOnboard,
    setSmsTriggerOnboard,
    smsTriggerPerf,
    setSmsTriggerPerf,

    // Appearance & Preferences
    themeMode,
    setThemeMode,
    appLanguage,
    setAppLanguage,
    appTimezone,
    setAppTimezone,
    appDateFormat,
    setAppDateFormat,
    extraConfig,
    updateExtraConfig,

    // Onboarding
    activeOnboardingPhaseTab,
    setActiveOnboardingPhaseTab,

    // User Management
    usersList,
    setUsersList,
    selectedUser,
    setSelectedUser,
    inviteForm,
    setInviteForm,
    editForm,
    setEditForm,
    reactivateConfirm,
    setReactivateConfirm,
    getStatusStyles,
    getRoleStyles,

    // UI helpers
    SectionTitle,
  };

  return contextValue;
}

export type SettingsContextType = ReturnType<typeof useSettingsProviderValue>;

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettingsContext must be used within SettingsProvider");
  return ctx;
}

export function SettingsProvider({
  children,
  defaultTab = "company",
}: {
  children: ReactNode;
  defaultTab?: string;
}) {
  const contextValue = useSettingsProviderValue(defaultTab);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}
