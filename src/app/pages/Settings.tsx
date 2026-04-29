import { useState } from "react";
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
  Lock,
  Shield,
  FileText,
  Link2,
  Key,
  Zap,
  Mail,
  Bell,
  Smartphone,
  Settings as GearIcon,
  ChevronRight,
  Plus,
  ChevronDown,
  Lock as LockIcon,
  Palette,
  Globe,
  Database,
  Download,
  GitPullRequest,
  CheckCircle,
  RefreshCw,
  Clock,
  RotateCcw,
  FileCode,
  GraduationCap,
  UserPlus,
  UserMinus,
  Users,

  CloudUpload,
  Upload,
  Check,
  AlertTriangle,
  Eye,
  Calendar,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import React from "react";

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
      { id: "attendance_policy", label: "Attendance Policy", icon: ClipboardCheck },
      { id: "leave_policy", label: "Leave Policy", icon: TreePalm },
      { id: "payroll_settings", label: "Payroll Settings", icon: IndianRupee },
      { id: "performance_settings", label: "Performance & Appraisal", icon: Star },
    ],
  },
  {
    title: "SECURITY & ACCESS",
    items: [
      { id: "user_management", label: "User Management", icon: User },
      { id: "roles", label: "Roles & Permissions", icon: Lock },
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
  { id: "super_admin", name: "Super Admin", members: 2, created: "2023-10-01", modified: "2026-04-15", isDefault: true, color: "#3B82F6" },
  { id: "hr_manager", name: "HR Manager", members: 5, created: "2023-10-01", modified: "2026-04-18", isDefault: true, color: "#8B5CF6" },
  { id: "finance", name: "Finance", members: 3, created: "2024-01-12", modified: "2026-03-22", isDefault: false, color: "#10B981" },
  { id: "manager", name: "Manager", members: 14, created: "2023-10-15", modified: "2026-04-20", isDefault: false, color: "#F59E0B" },
  { id: "employee", name: "Employee", members: 142, created: "2023-10-01", modified: "2026-01-01", isDefault: true, color: "#6B7280" },
];

const initialPermissions = {
  dashboard: { super_admin: "full", hr_manager: "full", finance: "full", manager: "full", employee: "view" },
  employees: { super_admin: "full", hr_manager: "full", finance: "view", manager: "view", employee: "view" },
  attendance: { super_admin: "full", hr_manager: "full", finance: "view", manager: "full", employee: "view" },
  leave: { super_admin: "full", hr_manager: "full", finance: "view", manager: "full", employee: "view" },
  payroll: { super_admin: "full", hr_manager: "view", finance: "full", manager: "view", employee: "no" },
  recruitment: { super_admin: "full", hr_manager: "full", finance: "no", manager: "view", employee: "no" },
  performance: { super_admin: "full", hr_manager: "full", finance: "no", manager: "full", employee: "view" },
  reports: { super_admin: "full", hr_manager: "full", finance: "full", manager: "view", employee: "no" },
  settings: { super_admin: "full", hr_manager: "view", finance: "no", manager: "no", employee: "no" },
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
    modules: [
      { id: "reports", name: "Reports" },
    ],
  },
];

/* ── Main Component ── */

export function Settings() {
  const [activeSubTab, setActiveSubTab] = useState("roles");
  const [expandedGroups, setExpandedGroups] = useState({ core: true, hr: true, analytics: true });
  const [permissions, setPermissions] = useState<Record<string, Record<string, string>>>(initialPermissions);
  const [rolesList, setRolesList] = useState(rolesData);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<typeof rolesData[0] | null>(null);
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
      permissions: Object.keys(initialPermissions).reduce((acc, modId) => ({ ...acc, [modId]: "no" }), {}),
    });
    setActiveModal("create_role");
  };

  const openEditRoleModal = (role: typeof rolesData[0]) => {
    setSelectedRoleForEdit(role);
    setRoleForm({
      name: role.name,
      description: `${role.name} access level`,
      status: "Active",
      permissions: Object.keys(initialPermissions).reduce((acc, modId) => ({ 
        ...acc, 
        [modId]: permissions[modId][role.id] || "no" 
      }), {}),
    });
    setActiveModal("edit_role");
  };

  const handleRoleSubmit = () => {
    if (!roleForm.name.trim()) {
      showToast("Role Name is required", "error");
      return;
    }
    const duplicate = rolesList.find(r => r.name.toLowerCase() === roleForm.name.toLowerCase() && (!selectedRoleForEdit || r.id !== selectedRoleForEdit.id));
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
          id: roleForm.name.toLowerCase().replace(/\s+/g, '_'),
          name: roleForm.name,
          members: 0,
          created: new Date().toISOString().split('T')[0],
          modified: new Date().toISOString().split('T')[0],
          isDefault: false,
          color: "#8B5CF6"
        };
        setRolesList([...rolesList, newRole]);
        
        const newPerms = { ...permissions };
        Object.keys(roleForm.permissions).forEach(modId => {
          if (!newPerms[modId]) newPerms[modId] = {};
          newPerms[modId] = {
            ...newPerms[modId],
            [newRole.id]: roleForm.permissions[modId]
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
      const updatedList = rolesList.map(r => 
        r.id === selectedRoleForEdit.id ? { ...r, name: roleForm.name, modified: new Date().toISOString().split('T')[0] } : r
      );
      setRolesList(updatedList);
      
      const newPerms = { ...permissions };
      Object.keys(roleForm.permissions).forEach(modId => {
        if (!newPerms[modId]) newPerms[modId] = {};
        newPerms[modId] = {
          ...newPerms[modId],
          [selectedRoleForEdit.id]: roleForm.permissions[modId]
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
  const [activeOnboardingPhaseTab, setActiveOnboardingPhaseTab] = useState("pre");

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateExtraConfig = (key: string, value: any) => {
    setExtraConfig(prev => ({ ...prev, [key]: value }));
  };

  // Appearance & Preferences states
  const [themeMode, setThemeMode] = useState("dark");
  const [appLanguage, setAppLanguage] = useState("en");
  const [appTimezone, setAppTimezone] = useState("UTC");
  const [appDateFormat, setAppDateFormat] = useState("YYYY-MM-DD");


  // Company Profile states
  const [companyName, setCompanyName] = useState("NexusHR Technologies Pvt. Ltd.");
  const [legalName, setLegalName] = useState("NexusHR Technologies Private Limited");
  const [industry, setIndustry] = useState("Technology");
  const [foundedYear, setFoundedYear] = useState("2018");
  const [companyEmail, setCompanyEmail] = useState("hr@nexushr.com");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  interface DepartmentRecord {
    code: string;
    name: string;
    head: string;
    empCount: number;
    status: string;
    budget?: string;
    createdDate: string;
    description?: string;
  }

  const [deptsList, setDeptsList] = useState<DepartmentRecord[]>([
    { code: "EN", name: "Engineering", head: "Suresh Iyer", empCount: 820, status: "Active", budget: "₹1.2Cr", createdDate: "2022-04-10", description: "Technical" },
    { code: "SA", name: "Sales", head: "Vikram Singh", empCount: 540, status: "Active", budget: "₹85L", createdDate: "2022-06-15", description: "Commercial" },
    { code: "HR", name: "HR", head: "Meera Thomas", empCount: 180, status: "Active", budget: "₹40L", createdDate: "2022-01-20", description: "People" },
    { code: "FN", name: "Finance", head: "Ananya Das", empCount: 240, status: "Active", budget: "₹55L", createdDate: "2022-03-05", description: "Operations" },
    { code: "OP", name: "Operations", head: "Priya Nair", empCount: 757, status: "Active", budget: "₹95L", createdDate: "2023-01-12", description: "Logistics" },
    { code: "MK", name: "Marketing", head: "Sneha Patel", empCount: 310, status: "Active", budget: "₹60L", createdDate: "2023-05-18", description: "Brand" },
    { code: "UN", name: "Legal", head: "", empCount: 0, status: "Inactive", budget: "₹10L", createdDate: "2024-02-01", description: "Legal & Compliance" },
  ]);

  const [selectedDept, setSelectedDept] = useState<DepartmentRecord | null>(null);

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

  interface LocationRecord {
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

  const [locationsList, setLocationsList] = useState<LocationRecord[]>([
    { name: "Bengaluru HQ", code: "BLR-01", type: "Head Office", address: "42, Tech Park, Whitefield", city: "Bengaluru", state: "Karnataka", country: "India", pincode: "560066", manager: "Suresh Iyer", empCount: 1420, timezone: "IST (UTC+5:30)", status: "Active", createdDate: "2020-01-15" },
    { name: "Mumbai Branch", code: "MUM-02", type: "Branch", address: "BKC, Bandra East", city: "Mumbai", state: "Maharashtra", country: "India", pincode: "400051", manager: "Vikram Singh", empCount: 680, timezone: "IST (UTC+5:30)", status: "Active", createdDate: "2021-03-10" },
    { name: "US Remote", code: "USA-03", type: "Remote", address: "Work from home", city: "Various", state: "Various", country: "USA", pincode: "00000", manager: "Meera Thomas", empCount: 42, timezone: "PST (UTC-8)", status: "Active", createdDate: "2022-05-20" },
    { name: "Europe Remote", code: "EUR-04", type: "Remote", address: "Work from home", city: "Various", state: "Various", country: "UK/EU", pincode: "00000", manager: "Ananya Das", empCount: 18, timezone: "GMT (UTC+0)", status: "Partial", createdDate: "2023-02-11" },
    { name: "Delhi Warehouse", code: "DEL-05", type: "Warehouse", address: "Okhla Phase III", city: "Delhi", state: "Delhi", country: "India", pincode: "110020", manager: "Rahul Sharma", empCount: 0, timezone: "IST (UTC+5:30)", status: "Inactive", createdDate: "2024-06-01" },
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
 


  interface WorkScheduleRecord {
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

  const [schedulesList, setSchedulesList] = useState<WorkScheduleRecord[]>([
    { name: "Standard 5-Day", code: "SCH-STD", type: "General", startTime: "09:00", endTime: "18:00", breakDuration: 60, workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"], weekends: ["Sat", "Sun"], graceTime: 15, halfDayRule: "Under 4 hours", otEligible: true, dept: "All", location: "Bengaluru HQ", empCount: 1284, status: "Active" },
    { name: "Night Shift", code: "SCH-NIGHT", type: "Shift", startTime: "22:00", endTime: "06:00", breakDuration: 45, workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], weekends: ["Sun"], graceTime: 10, halfDayRule: "Under 3.5 hours", otEligible: true, dept: "Operations", location: "Mumbai Branch", empCount: 340, status: "Active" },
    { name: "Flexible Remote", code: "SCH-FLEX", type: "Flexible", startTime: "Flexible", endTime: "Flexible", breakDuration: 60, workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"], weekends: ["Sat", "Sun"], graceTime: 0, halfDayRule: "Under 4 hours", otEligible: false, dept: "Engineering", location: "US Remote", empCount: 223, status: "Active" },
    { name: "Weekend Support", code: "SCH-WKND", type: "Part Time", startTime: "10:00", endTime: "18:00", breakDuration: 60, workingDays: ["Sat", "Sun"], weekends: ["Mon", "Tue", "Wed", "Thu", "Fri"], graceTime: 15, halfDayRule: "Under 4 hours", otEligible: true, dept: "Customer Support", location: "Bengaluru HQ", empCount: 45, status: "Active" },
  ]);

  const [selectedSchedule, setSelectedSchedule] = useState<WorkScheduleRecord | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    code: "",
    type: "General" as "General" | "Shift" | "Flexible" | "Rotational" | "Part Time",
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

  interface HolidayRecord {
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

  const [holidaysList, setHolidaysList] = useState<HolidayRecord[]>([
    { name: "Republic Day", date: "2026-01-26", day: "Monday", type: "National", location: "All Locations", dept: "All", recurring: true, status: "Active", description: "Commemorates the adoption of the Constitution" },
    { name: "Holi", date: "2026-03-14", day: "Saturday", type: "Regional", location: "Mumbai Branch", dept: "All", recurring: false, status: "Active", description: "Festival of colors" },
    { name: "Company Foundation Day", date: "2026-04-15", day: "Wednesday", type: "Company", location: "All Locations", dept: "All", recurring: true, status: "Active", description: "Company annual milestone celebration" },
    { name: "Independence Day", date: "2026-08-15", day: "Saturday", type: "National", location: "All Locations", dept: "All", recurring: true, status: "Active", description: "Indian Independence Day" },
    {
      name: "Diwali", date: "2026-10-20", day: "Festival", location: "All Locations", dept: "All", recurring: false, status: "Active", description: "Festival of lights",
      type: "National"
    },
    { name: "Christmas", date: "2026-12-25", day: "Friday", type: "Optional", location: "Delhi Warehouse", dept: "All", recurring: true, status: "Active", description: "Christmas holiday" }
  ]);

  const [selectedHoliday, setSelectedHoliday] = useState<HolidayRecord | null>(null);

  const [holidayForm, setHolidayForm] = useState({
    name: "",
    date: "2026-01-01",
    type: "National" as "National" | "Company" | "Optional" | "Regional" | "Festival",
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
  const [holidayViewMode, setHolidayViewMode] = useState<"List" | "Calendar">("List");

  interface LeaveTypeRecord {
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

  const [leaveTypesList, setLeaveTypesList] = useState<LeaveTypeRecord[]>([
    { name: "Casual Leave", code: "CL", days: 12, type: "Paid", carryForward: false, maxCarryForward: 0, encashment: false, approvalRequired: true, attachmentRequired: false, minNoticePeriod: 1, maxConsecutiveLeave: 3, dept: "All", location: "All Locations", status: "Active", description: "Standard casual leaves" },
    { name: "Earned Leave", code: "EL", days: 24, type: "Paid", carryForward: true, maxCarryForward: 15, encashment: true, approvalRequired: true, attachmentRequired: false, minNoticePeriod: 7, maxConsecutiveLeave: 10, dept: "All", location: "All Locations", status: "Active", description: "Privilege leaves" },
    { name: "Sick Leave", code: "SL", days: 12, type: "Paid", carryForward: false, maxCarryForward: 0, encashment: false, approvalRequired: false, attachmentRequired: true, minNoticePeriod: 0, maxConsecutiveLeave: 5, dept: "All", location: "All Locations", status: "Active", description: "Medical leaves" },
  ]);

  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveTypeRecord | null>(null);

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
  const [lpAutoApprove, setLpAutoApprove] = useState(false);
  const [lpEncashmentLimit, setLpEncashmentLimit] = useState(30);
  const [lpCarryForwardLimit, setLpCarryForwardLimit] = useState(15);
  const [lpEligibilityMonths, setLpEligibilityMonths] = useState(3);
  
  const [lpLastUpdatedBy, setLpLastUpdatedBy] = useState("Ryan Park (Super Admin)");
  const [lpLastUpdatedTime, setLpLastUpdatedTime] = useState("2026-04-28 11:30 AM");
  const [lpPolicyVersion, setLpPolicyVersion] = useState("v2.4");

  interface UserManagementRecord {



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

  const [usersList, setUsersList] = useState<UserManagementRecord[]>([
    { name: "Ryan Park", email: "ryan@nexushr.com", initials: "RP", avatarBg: "#10B981", role: "Super Admin", dept: "HR", location: "New York", lastLogin: "Today, 9:02 AM", status: "Active" },
    { name: "Meera Thomas", email: "meera@nexushr.com", initials: "MT", avatarBg: "#0EA5E9", role: "HR Manager", dept: "HR", location: "London", lastLogin: "Today, 8:45 AM", status: "Active" },
    { name: "Suresh Iyer", email: "suresh@nexushr.com", initials: "SI", avatarBg: "#F59E0B", role: "Manager", dept: "Engineering", location: "Bangalore", lastLogin: "Yesterday", status: "Active" },
    { name: "Ananya Das", email: "ananya@nexushr.com", initials: "AD", avatarBg: "#EF4444", role: "Finance", dept: "Finance", location: "Mumbai", lastLogin: "Apr 4, 2026", status: "Active" },
    { name: "John Doe", email: "john@nexushr.com", initials: "JD", avatarBg: "#6B7280", role: "Manager", dept: "Sales", location: "Chicago", lastLogin: "Jan 10, 2026", status: "Inactive" },
    { name: "Priya Sharma", email: "priya.new@nexushr.com", initials: "PS", avatarBg: "#10B981", role: "HR Manager", dept: "HR", location: "Delhi", lastLogin: "Never", status: "Pending Invite" },
    { name: "Leo Martinez", email: "leo.m@nexushr.com", initials: "LM", avatarBg: "#F59E0B", role: "Manager", dept: "Engineering", location: "Austin", lastLogin: "Never", status: "Pending Invite" },
  ]);

  const [selectedUser, setSelectedUser] = useState<UserManagementRecord | null>(null);

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
  const [registeredAddress, setRegisteredAddress] = useState("42, Tech Park, Whitefield, Bengaluru 560066");

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

  // Attendance Policy states
  const [apGracePeriod, setApGracePeriod] = useState("15");
  const [apLateMark, setApLateMark] = useState("30");
  const [apHalfDay, setApHalfDay] = useState("4");
  const [apAbsentThreshold, setApAbsentThreshold] = useState("2");
  const [apMaxWorking, setApMaxWorking] = useState("10");
  const [apMinCheckIn, setApMinCheckIn] = useState("6");
  const [apAllowReg, setApAllowReg] = useState(true);
  const [apManagerApp, setApManagerApp] = useState(true);
  const [apAutoWfh, setApAutoWfh] = useState(false);
  const [apLimitReg, setApLimitReg] = useState(true);
  const [apLimitRegVal, setApLimitRegVal] = useState("3");
  const [apAllowBackdated, setApAllowBackdated] = useState(true);
  const [apAllowBackdatedVal, setApAllowBackdatedVal] = useState("7");
  const [apEscAlertMgr, setApEscAlertMgr] = useState("3");
  const [apEscAlertHr, setApEscAlertHr] = useState("2");
  const [apEscMD, setApEscMD] = useState("5");
  const [apEscDeduct, setApEscDeduct] = useState("3");


  // Holiday filter states



  const [payrollCycle, setPayrollCycle] = useState("Monthly");
  const [payrollCutoff, setPayrollCutoff] = useState("25");
  const [payrollPayout, setPayrollPayout] = useState("1st");
  const [prGrossStructure] = useState("₹45,000 Avg");
  const [prComponentsCount] = useState(6);
  const [prNextRun] = useState("May 01, 2026");

  const [prLastUpdatedBy, setPrLastUpdatedBy] = useState("Ryan Park (Super Admin)");
  const [prLastUpdatedTime, setPrLastUpdatedTime] = useState("2026-04-25 09:45 AM");

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

  interface SalaryComponent {
    name: string;
    type: "Earning" | "Deduction";
    amountType: "Percentage" | "Fixed";
    value: string;
    taxable: boolean;
  }

  const [salaryComponentsList] = useState<SalaryComponent[]>([
    { name: "Basic Pay", type: "Earning", amountType: "Percentage", value: "50% of CTC", taxable: true },
    { name: "HRA", type: "Earning", amountType: "Percentage", value: "40% of Basic", taxable: true },
    { name: "Conveyance", type: "Earning", amountType: "Fixed", value: "₹1,600", taxable: false },
    { name: "Medical", type: "Earning", amountType: "Fixed", value: "₹1,250", taxable: false },
    { name: "Special Allowance", type: "Earning", amountType: "Fixed", value: "Variable", taxable: true },
    { name: "Bonus", type: "Earning", amountType: "Fixed", value: "Variable", taxable: true },
    { name: "PF", type: "Deduction", amountType: "Percentage", value: "12% of Basic", taxable: false },
    { name: "ESI", type: "Deduction", amountType: "Percentage", value: "0.75% of Gross", taxable: false },
    { name: "Professional Tax", type: "Deduction", amountType: "Fixed", value: "₹200", taxable: false },
    { name: "Income Tax", type: "Deduction", amountType: "Percentage", value: "Slab based", taxable: false },
    { name: "Loan Recovery", type: "Deduction", amountType: "Fixed", value: "Based on Plan", taxable: false },
  ]);

  const handlePayrollSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setPrLastUpdatedBy("Ryan Park (Super Admin)");
      const now = new Date();
      setPrLastUpdatedTime(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
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
  const [perfHrFinalizationDeadline, setPerfHrFinalizationDeadline] = useState("35");
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
  const [secLockoutResetMethod, setSecLockoutResetMethod] = useState("Manual by Admin");

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
  const [emailFromAddress, setEmailFromAddress] = useState("no-reply@nexushr.com");
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
  const [secAllowedIpRanges, setSecAllowedIpRanges] = useState("192.168.1.0/24\n10.0.0.0/8");

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mt-6 mb-4">
      <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
      <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
        {title}
      </span>
    </div>
  );

  const toggleCell = (modId: string, roleId: string) => {
    setPermissions((prev) => {
      const current = prev[modId][roleId];
      const next = current === "full" ? "view" : current === "view" ? "no" : "full";

      return {
        ...prev,
        [modId]: {
          ...prev[modId],
          [roleId]: next,
        },
      };
    });
  };

  const renderWorkSchedules = () => {
    // Filter logic
    const filteredScheds = schedulesList.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(schedSearchQuery.toLowerCase()) ||
                          s.code.toLowerCase().includes(schedSearchQuery.toLowerCase());
      
      const matchesStatus = schedStatusFilter === "All" || s.status === schedStatusFilter;
      const matchesType = schedTypeFilter === "All" || s.type === schedTypeFilter;
      const matchesLoc = schedLocFilter === "All" || s.location === schedLocFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesLoc;
    });

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Work Schedules</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Work Schedule Management</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Configure team allocations and core shift rules</p>
          </div>
          <button
            onClick={() => {
              setScheduleForm({
                name: "",
                code: "",
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
                location: "All",
                status: "Active",
              });
              setSelectedSchedule(null);
              setActiveModal("add_schedule");
            }}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Schedule
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Schedules", value: schedulesList.length, icon: <Clock size={20} />, color: "#00B87C", bg: "rgba(0, 184, 124, 0.1)" },
            { label: "Active Schedules", value: schedulesList.filter(s => s.status === "Active").length, icon: <CheckCircle size={20} />, color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)" },
            { label: "Employees Assigned", value: schedulesList.reduce((acc, curr) => acc + curr.empCount, 0), icon: <Users size={20} />, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            { label: "Shift Based Schedules", value: schedulesList.filter(s => s.type === "Shift").length, icon: <RotateCcw size={20} />, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" },
          ].map((card, idx) => (
            <div key={idx} className="p-4 rounded-2xl flex items-center justify-between shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>{card.label}</p>
                <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", marginTop: "4px", marginBottom: 0 }}>{card.value}</p>
              </div>
              <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-xl flex flex-wrap items-center gap-3 mb-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <input
            type="text"
            placeholder="Search by name, code..."
            value={schedSearchQuery}
            onChange={(e) => setSchedSearchQuery(e.target.value)}
            className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
          <select
            value={schedStatusFilter}
            onChange={(e) => setSchedStatusFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={schedTypeFilter}
            onChange={(e) => setSchedTypeFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="All">All Types</option>
            <option value="General">General</option>
            <option value="Shift">Shift</option>
            <option value="Flexible">Flexible</option>
            <option value="Rotational">Rotational</option>
            <option value="Part Time">Part Time</option>
          </select>
          <select
            value={schedLocFilter}
            onChange={(e) => setSchedLocFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="All">All Locations</option>
            <option value="Bengaluru HQ">Bengaluru HQ</option>
            <option value="Mumbai Branch">Mumbai Branch</option>
            <option value="US Remote">US Remote</option>
            <option value="Delhi Warehouse">Delhi Warehouse</option>
          </select>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm mb-6">
          <table className="w-full border-collapse" style={{ minWidth: "1000px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", backgroundColor: "var(--muted)" }}>
                {["SCHEDULE", "CODE", "TYPE", "TIMINGS", "BREAK", "WORKING DAYS", "ASSIGNED", "LOCATION", "STATUS", "ACTION"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredScheds.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border)", height: "56px" }} className="hover:bg-[var(--muted)] transition-all">
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{s.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "var(--muted-foreground)" }}>
                    <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>{s.code}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{s.type}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>
                    {s.startTime === "Flexible" ? "Flexible" : `${s.startTime} - ${s.endTime}`}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{s.breakDuration} mins</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{s.workingDays.join(", ")}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ backgroundColor: "rgba(0, 184, 124, 0.1)", color: "#00B87C", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700 }}>
                      {s.empCount} Employees
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{s.location}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: s.status === "Active" ? "rgba(0, 184, 124, 0.1)" : "rgba(107, 114, 128, 0.1)",
                        color: s.status === "Active" ? "#00B87C" : "#6B7280",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedSchedule(s);
                          setActiveModal("view_schedule");
                        }}
                        style={{ backgroundColor: "transparent", border: "1px solid var(--border)", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, color: "var(--foreground)", cursor: "pointer" }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSchedule(s);
                          setScheduleForm({
                            name: s.name,
                            code: s.code,
                            type: s.type,
                            startTime: s.startTime,
                            endTime: s.endTime,
                            breakDuration: s.breakDuration,
                            workingDays: s.workingDays,
                            weekends: s.weekends,
                            graceTime: s.graceTime,
                            halfDayRule: s.halfDayRule,
                            otEligible: s.otEligible,
                            dept: s.dept,
                            location: s.location,
                            status: s.status,
                          });
                          setActiveModal("edit_schedule");
                        }}
                        style={{ backgroundColor: "transparent", border: "1px solid #00B87C", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, color: "#00B87C", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          const cloneCode = `${s.code}-COPY`;
                          const cloneSched: WorkScheduleRecord = { ...s, code: cloneCode, name: `${s.name} (Copy)`, empCount: 0 };
                          setSchedulesList([...schedulesList, cloneSched]);
                          showToast("Schedule cloned successfully", "success");
                        }}
                        style={{ backgroundColor: "transparent", border: "1px solid #8B5CF6", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, color: "#8B5CF6", cursor: "pointer" }}
                      >
                        Clone
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSchedule(s);
                          setActiveModal("delete_schedule");
                        }}
                        style={{ backgroundColor: "transparent", border: "1px solid #EF4444", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, color: "#EF4444", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section: DEFAULT RULES */}
        <SectionTitle title="Default Rules" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Grace Period (mins)", state: wsGracePeriod, setter: setWsGracePeriod },
              { label: "Weekly Hours Cap", state: wsWeeklyHours, setter: setWsWeeklyHours },
              { label: "OT Threshold (hrs/day)", state: wsOtThreshold, setter: setWsOtThreshold },
              { label: "Min Rest Between Shifts (hrs)", state: wsMinRest, setter: setWsMinRest },
              { label: "Half-Day Threshold (hrs)", state: wsHalfDay, setter: setWsHalfDay },
              { label: "Absent If Less Than (hrs)", state: wsAbsentThreshold, setter: setWsAbsentThreshold },
            ].map((f, idx) => (
              <div key={idx}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>{f.label}</label>
                <input
                  type="text"
                  value={f.state}
                  onChange={(e) => f.setter(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section: OVERTIME RULES */}
        <SectionTitle title="Overtime Rules" />
        <div className="space-y-4 mb-6">
          {[
            { label: "Auto-calculate Overtime", state: wsAutoOt, setter: setWsAutoOt },
            { label: "Require Manager Approval for OT", state: wsRequireOtApproval, setter: setWsRequireOtApproval },
            { label: "Send OT Alert at Threshold", state: wsOtAlert, setter: setWsOtAlert },
            { label: "Allow Comp-off in lieu of OT Pay", state: wsCompOff, setter: setWsCompOff },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>{row.label}</span>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => showToast("Work schedule updates saved successfully")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  const renderLeavePolicy = () => {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Leave Policy</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Leave Policy Configuration</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Version {lpPolicyVersion} • Last saved {lpLastUpdatedTime} by {lpLastUpdatedBy}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal("confirm_save_policy")}
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--foreground)",
                cursor: "pointer",
              }}
            >
              Save Policy
            </button>
            <button
              onClick={() => {
                setLeaveTypeForm({
                  name: "",
                  code: "",
                  days: 12,
                  type: "Paid",
                  carryForward: false,
                  maxCarryForward: 0,
                  encashment: false,
                  approvalRequired: true,
                  attachmentRequired: false,
                  minNoticePeriod: 1,
                  maxConsecutiveLeave: 5,
                  dept: "All",
                  location: "All Locations",
                  status: "Active",
                  description: "",
                });
                setSelectedLeaveType(null);
                setActiveModal("add_leave_type");
              }}
              style={{
                backgroundColor: "#00B87C",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add Leave Type
            </button>
          </div>
        </div>

        {/* SECTION 1: LEAVE TYPES */}
        <SectionTitle title="1. Leave Types" />
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm mb-6">
          <table className="w-full border-collapse" style={{ minWidth: "1000px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", backgroundColor: "var(--muted)" }}>
                {["LEAVE TYPE", "CODE", "ENTITLEMENT", "TYPE", "CARRY FORWARD", "APPROVAL", "ATTACHMENT", "STATUS", "ACTION"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaveTypesList.map((l, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border)", height: "56px" }} className="hover:bg-[var(--muted)] transition-all">
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{l.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{l.code}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{l.days} Days</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: l.type === "Paid" ? "rgba(0, 184, 124, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: l.type === "Paid" ? "#00B87C" : "#EF4444",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {l.type}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{l.carryForward ? `Yes (Max ${l.maxCarryForward}d)` : "No"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{l.approvalRequired ? "Required" : "Auto"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{l.attachmentRequired ? "Mandatory" : "Optional"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: l.status === "Active" ? "rgba(0, 184, 124, 0.1)" : "rgba(107, 114, 128, 0.1)",
                        color: l.status === "Active" ? "#00B87C" : "#6B7280",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedLeaveType(l);
                          setLeaveTypeForm({
                            name: l.name,
                            code: l.code,
                            days: l.days,
                            type: l.type,
                            carryForward: l.carryForward,
                            maxCarryForward: l.maxCarryForward,
                            encashment: l.encashment,
                            approvalRequired: l.approvalRequired,
                            attachmentRequired: l.attachmentRequired,
                            minNoticePeriod: l.minNoticePeriod,
                            maxConsecutiveLeave: l.maxConsecutiveLeave,
                            dept: l.dept,
                            location: l.location,
                            status: l.status,
                            description: l.description,
                          });
                          setActiveModal("edit_leave_type");
                        }}
                        style={{ backgroundColor: "transparent", border: "1px solid #00B87C", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, color: "#00B87C", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLeaveType(l);
                          setActiveModal("delete_leave_type");
                        }}
                        style={{ backgroundColor: "transparent", border: "1px solid #EF4444", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, color: "#EF4444", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 2: APPROVAL RULES */}
        <SectionTitle title="2. Approval Rules" />
        <div className="p-6 rounded-2xl border mb-6 space-y-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <div>
              <span style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600 }}>Approval Levels</span>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>Number of approval stages required per request</p>
            </div>
            <select
              value={lpApprovalLevels}
              onChange={(e) => setLpApprovalLevels(parseInt(e.target.value))}
              className="rounded-xl px-3 py-2 text-sm outline-none border"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value={1}>1 Level (Manager)</option>
              <option value={2}>2 Levels (Manager + HR)</option>
              <option value={3}>3 Levels (Manager + Dept Head + HR)</option>
            </select>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <span style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600 }}>Auto-Approve if no action taken</span>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>Automatically approves requests after 7 days</p>
            </div>
            <button
              onClick={() => setLpAutoApprove(!lpAutoApprove)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: lpAutoApprove ? "#00B87C" : "var(--switch-background)",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span style={{ position: "absolute", top: "2px", left: lpAutoApprove ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
            </button>
          </div>

          {/* Approval chain visual (horizontal stepper) */}
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <span className="block text-[11px] font-bold text-[var(--muted-foreground)] uppercase mb-4">Leave Approval Workflow</span>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
              {[
                { role: "Employee", label: "Applies" },
                { role: "Manager", label: "Level 1 (within 2 days)" },
                { role: "HR Manager", label: "Level 2 (within 2 days)" },
                { role: "Auto-Approved", label: "Complete" },
              ].map((step, idx) => (
                <React.Fragment key={idx}>
                  <div 
                    className="flex flex-col items-center text-center p-4 rounded-xl flex-1 bg-white dark:bg-neutral-800 border border-[#E5E7EB]"
                    style={{ minWidth: "160px" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{step.role}</span>
                    <span style={{ fontSize: "11px", color: "var(--muted-foreground)", marginTop: "4px" }}>{step.label}</span>
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block h-[2px] bg-[#00B87C] flex-1 mx-2" style={{ minWidth: "20px" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>


        {/* SECTION 3 & 4: CARRY FORWARD & ENCASHMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <SectionTitle title="3. Carry Forward Rules" />
            <div className="mt-4 space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Global Max Carry Forward Limit (Days)</label>
                <input
                  type="number"
                  value={lpCarryForwardLimit}
                  onChange={(e) => setLpCarryForwardLimit(parseInt(e.target.value))}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <SectionTitle title="4. Encashment Rules" />
            <div className="mt-4 space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Max Encashment Days per Year</label>
                <input
                  type="number"
                  value={lpEncashmentLimit}
                  onChange={(e) => setLpEncashmentLimit(parseInt(e.target.value))}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: ELIGIBILITY RULES */}
        <SectionTitle title="5. Eligibility Rules" />
        <div className="p-6 rounded-2xl border mb-6 space-y-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex justify-between items-center">
            <div>
              <span style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600 }}>Probation Lock-in Period</span>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>Minimum months an employee must complete before applying for leave</p>
            </div>
            <select
              value={lpEligibilityMonths}
              onChange={(e) => setLpEligibilityMonths(parseInt(e.target.value))}
              className="rounded-xl px-3 py-2 text-sm outline-none border"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value={0}>0 Months (Immediate)</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
            </select>
          </div>
        </div>

        {/* SECTION 6: POLICY SUMMARY */}
        <SectionTitle title="6. Policy Summary" />
        <div className="p-6 rounded-2xl border mb-6 shadow-sm" style={{ backgroundColor: "rgba(0, 184, 124, 0.05)", borderColor: "rgba(0, 184, 124, 0.2)" }}>
          <p className="text-sm font-semibold" style={{ color: "#00B87C", margin: "0 0 6px 0" }}>Leave Entitlements at a Glance</p>
          <div className="text-xs space-y-1" style={{ color: "var(--foreground)" }}>
            {leaveTypesList.map((l) => (
              <div key={l.code}>• {l.name} ({l.code}): <span className="font-bold">{l.days} Days</span> per year | Carryforward: {l.carryForward ? "Yes" : "No"}</div>
            ))}
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveModal("confirm_save_policy")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Policy Changes
          </button>
        </div>
      </div>
    );
  };




  const renderAttendancePolicy = () => {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Attendance Policy</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Attendance Policy</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Define rules for check-in, late marks and regularization</p>
          </div>
          <button
            onClick={() => showToast("Attendance protocols updated successfully")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Policy
          </button>
        </div>

        {/* Policy Block 1: CHECK-IN RULES */}
        <SectionTitle title="Check-In Rules" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Grace Period (mins)", state: apGracePeriod, setter: setApGracePeriod },
              { label: "Late Mark After (mins)", state: apLateMark, setter: setApLateMark },
              { label: "Half Day After (hours)", state: apHalfDay, setter: setApHalfDay },
              { label: "Absent If Less Than (hours)", state: apAbsentThreshold, setter: setApAbsentThreshold },
              { label: "Max Working Hours/Day", state: apMaxWorking, setter: setApMaxWorking },
              { label: "Minimum Check-in Hours", state: apMinCheckIn, setter: setApMinCheckIn },
            ].map((f, idx) => (
              <div key={idx}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>{f.label}</label>
                <input
                  type="text"
                  value={f.state}
                  onChange={(e) => f.setter(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Policy Block 2: REGULARIZATION RULES */}
        <SectionTitle title="Regularization Rules" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-4" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          {[
            { label: "Allow Attendance Regularization", desc: "Employees can request missed attendance correction", state: apAllowReg, setter: setApAllowReg },
            { label: "Manager Approval Required", desc: "Regularization needs manager sign-off before marking", state: apManagerApp, setter: setApManagerApp },
            { label: "Auto-Approve WFH Attendance", desc: "WFH days are marked present automatically", state: apAutoWfh, setter: setApAutoWfh },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div>
                <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", margin: 0 }}>{row.desc}</p>
              </div>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}

          {/* Limit Regularization with Inline Input */}
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 gap-3">
            <div>
              <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>Limit Regularization Requests per Month</p>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", margin: 0 }}>Set the ceiling for allowable updates</p>
            </div>
            <div className="flex items-center gap-3">
              {apLimitReg && (
                <input
                  type="text"
                  value={apLimitRegVal}
                  onChange={(e) => setApLimitRegVal(e.target.value)}
                  className="w-20 rounded-xl px-3 py-1.5 text-sm outline-none border text-center"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              )}
              <button
                onClick={() => setApLimitReg(!apLimitReg)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: apLimitReg ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: apLimitReg ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Backdated Regularization with Inline Input */}
          <div className="flex flex-col md:flex-row md:items-center justify-between py-2 gap-3">
            <div>
              <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>Allow Backdated Regularization</p>
              <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", margin: 0 }}>Maximum timeframe allowed for requests</p>
            </div>
            <div className="flex items-center gap-3">
              {apAllowBackdated && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={apAllowBackdatedVal}
                    onChange={(e) => setApAllowBackdatedVal(e.target.value)}
                    className="w-20 rounded-xl px-3 py-1.5 text-sm outline-none border text-center"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                  <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>days max</span>
                </div>
              )}
              <button
                onClick={() => setApAllowBackdated(!apAllowBackdated)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: apAllowBackdated ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: apAllowBackdated ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Policy Block 3: ESCALATION RULES */}
        <SectionTitle title="Escalation Rules" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Alert Manager After (consecutive late days)", state: apEscAlertMgr, setter: setApEscAlertMgr },
              { label: "Alert HR After (consecutive absent days)", state: apEscAlertHr, setter: setApEscAlertHr },
              { label: "Escalate to MD After (absent days)", state: apEscMD, setter: setApEscMD },
              { label: "Auto-deduct Leave After (absent without reason)", state: apEscDeduct, setter: setApEscDeduct },
            ].map((f, idx) => (
              <div key={idx}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>{f.label}</label>
                <input
                  type="text"
                  value={f.state}
                  onChange={(e) => f.setter(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center gap-4 pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveModal("reset_defaults")}
            style={{
              backgroundColor: "transparent",
              color: "var(--muted-foreground)",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset to Defaults
          </button>
          <button
            onClick={() => showToast("Attendance protocols updated successfully")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Policy
          </button>
        </div>
      </div>
    );
  };

  const renderPayrollSettings = () => {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Payroll Settings</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Payroll Configuration</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Version 3.1 • Last saved {prLastUpdatedTime} by {prLastUpdatedBy}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetPayroll}
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--foreground)",
                cursor: "pointer",
              }}
            >
              Reset to Default
            </button>
            <button
              onClick={() => setActiveModal("edit_payroll")}
              style={{
                backgroundColor: "#00B87C",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Edit Settings
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Payroll Cycle", value: payrollCycle, icon: <Calendar size={20} />, color: "#00B87C", bg: "rgba(0, 184, 124, 0.1)" },
            { label: "Default Gross Structure", value: prGrossStructure, icon: <DollarSign size={20} />, color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)" },
            { label: "Active Salary Components", value: `${prComponentsCount} Earnings + 5 Deductions`, icon: <FolderTree size={20} />, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            { label: "Next Payroll Run", value: prNextRun, icon: <ArrowRight size={20} />, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" },
          ].map((card, idx) => (
            <div key={idx} className="p-4 rounded-2xl flex items-center justify-between shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>{card.label}</p>
                <p style={{ fontSize: "16px", fontWeight: 800, color: "var(--foreground)", marginTop: "4px", marginBottom: 0 }}>{card.value}</p>
              </div>
              <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 1: SALARY COMPONENTS */}
        <SectionTitle title="1. Salary Components" />
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm mb-6">
          <table className="w-full border-collapse" style={{ minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", backgroundColor: "var(--muted)" }}>
                {["COMPONENT NAME", "TYPE", "CALCULATION TYPE", "VALUE / AMOUNT", "TAXABLE"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salaryComponentsList.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border)", height: "48px" }} className="hover:bg-[var(--muted)] transition-all">
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{c.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: c.type === "Earning" ? "rgba(0, 184, 124, 0.1)" : "rgba(245, 158, 11, 0.1)",
                        color: c.type === "Earning" ? "#00B87C" : "#F59E0B",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted-foreground)" }}>{c.amountType}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)", fontWeight: 600 }}>{c.value}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: c.taxable ? "rgba(239, 68, 68, 0.1)" : "rgba(107, 114, 128, 0.1)",
                        color: c.taxable ? "#EF4444" : "#6B7280",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {c.taxable ? "Taxable" : "Exempt"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* SECTION 3: PAYROLL CYCLE */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <SectionTitle title="3. Payroll Cycle Rules" />
            <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--foreground)" }}>
              <div className="flex justify-between"><span>Pay Frequency</span><span className="font-bold">{payrollCycle}</span></div>
              <div className="flex justify-between"><span>Cutoff Date</span><span className="font-bold">{payrollCutoff}th of month</span></div>
              <div className="flex justify-between"><span>Payout Date</span><span className="font-bold">{payrollPayout} of next month</span></div>
            </div>
          </div>

          {/* SECTION 4: ATTENDANCE RULES */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <SectionTitle title="4. Attendance Rules" />
            <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--foreground)" }}>
              <div className="flex justify-between"><span>LOP Deduction</span><span className="font-bold">{prLopEnabled ? "Enabled" : "Disabled"}</span></div>
              <div className="flex justify-between"><span>Overtime Pay</span><span className="font-bold">{prOtPay ? "Enabled" : "Disabled"}</span></div>
              <div className="flex justify-between"><span>Half-day trigger</span><span className="font-bold">{prHalfDayCalc}</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* SECTION 5: PAYSLIP SETTINGS */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <SectionTitle title="5. Payslip Settings" />
            <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--foreground)" }}>
              <div className="flex justify-between"><span>Payslip Template</span><span className="font-bold">{prPayslipTemplate}</span></div>
              <div className="flex justify-between"><span>Auto Email to Staff</span><span className="font-bold">{prAutoEmail ? "Yes" : "No"}</span></div>
              <div className="flex justify-between"><span>Company Logo on Slip</span><span className="font-bold">{prPayslipLogo ? "Yes" : "No"}</span></div>
            </div>
          </div>

          {/* SECTION 6: COMPLIANCE */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <SectionTitle title="6. Compliance" />
            <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--foreground)" }}>
              <div className="flex justify-between"><span>PF Contribution</span><span className="font-bold">{prPfRate}</span></div>
              <div className="flex justify-between"><span>ESI Contribution</span><span className="font-bold">{prEsiRate}</span></div>
              <div className="flex justify-between"><span>Tax Calculation Mode</span><span className="font-bold">{prTaxMode}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderPerformanceSettings = () => {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Performance Settings</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Performance Settings</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Configure review cycles, rating scales and KPI frameworks</p>
          </div>
          <button
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>

        {/* Policy Block 1: REVIEW CYCLE */}
        <SectionTitle title="Review Cycle" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Review Frequency</label>
              <select
                value={perfReviewFreq}
                onChange={(e) => setPerfReviewFreq(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="Annual">Annual ▾</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>FY Review Month</label>
              <select
                value={perfReviewMonth}
                onChange={(e) => setPerfReviewMonth(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="April">April ▾</option>
                <option value="December">December</option>
                <option value="March">March</option>
              </select>
            </div>
            {[
              { label: "Self-Review Window (days)", state: perfSelfReviewWin, setter: setPerfSelfReviewWin },
              { label: "Manager Review Window (days)", state: perfMgrReviewWin, setter: setPerfMgrReviewWin },
              { label: "Calibration Meeting Deadline", state: perfCalibrationDeadline, setter: setPerfCalibrationDeadline },
              { label: "HR Finalization Deadline", state: perfHrFinalizationDeadline, setter: setPerfHrFinalizationDeadline },
            ].map((f, idx) => (
              <div key={idx}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>{f.label}</label>
                <input
                  type="text"
                  value={f.state}
                  onChange={(e) => f.setter(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Policy Block 2: RATING SCALE */}
        <SectionTitle title="Rating Scale" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "12px" }}>Current Rating Scale</label>
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { label: "5 – Exceptional", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
              { label: "4 – Exceeds Expectations", color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)" },
              { label: "3 – Meets Expectations", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
              { label: "2 – Below Expectations", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
              { label: "1 – Unsatisfactory", color: "#6B7280", bg: "rgba(107, 114, 128, 0.1)" },
            ].map((chip, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: chip.bg,
                  color: chip.color,
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {chip.label}
              </span>
            ))}
          </div>
          <div className="w-full md:w-1/2">
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Change Rating Scale</label>
            <select
              value={perfRatingScale}
              onChange={(e) => setPerfRatingScale(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="5-Point Scale">5-Point Scale ▾</option>
              <option value="3-Point Scale">3-Point Scale</option>
              <option value="10-Point Scale">10-Point Scale</option>
            </select>
          </div>
        </div>

        {/* Policy Block 3: 360° FEEDBACK */}
        <SectionTitle title="360° Feedback" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-4" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          {[
            { label: "Enable Peer Feedback", state: perfPeerFeedback, setter: setPerfPeerFeedback },
            { label: "Anonymous Peer Feedback", desc: "Peer names are hidden from reviewee", state: perfAnonPeerFeedback, setter: setPerfAnonPeerFeedback },
            { label: "Enable Subordinate Feedback", state: perfSubFeedback, setter: setPerfSubFeedback },
            { label: "Enable Client Feedback", state: perfClientFeedback, setter: setPerfClientFeedback },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div>
                <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
                {"desc" in row && <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", margin: 0 }}>{row.desc}</p>}
              </div>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center py-2">
            <div>
              <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>Minimum Peers Required for Review</p>
            </div>
            <input
              type="text"
              value={perfMinPeers}
              onChange={(e) => setPerfMinPeers(e.target.value)}
              className="w-20 rounded-xl px-3 py-1.5 text-sm outline-none border text-center"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
        </div>

        {/* Policy Block 4: GOALS & KPIs */}
        <SectionTitle title="Goals & KPIs" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-4" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          {[
            { label: "Enable Goal Setting Module", state: perfGoalSetting, setter: setPerfGoalSetting },
            { label: "Link Goals to Performance Rating", state: perfLinkGoals, setter: setPerfLinkGoals },
            { label: "Require Manager Goal Approval", state: perfRequireGoalApp, setter: setPerfRequireGoalApp },
            { label: "Quarterly Goal Check-ins", state: perfQuarterlyCheckin, setter: setPerfQuarterlyCheckin },
            { label: "OKR Framework Support", state: perfOkrSupport, setter: setPerfOkrSupport },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div>
                <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
              </div>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Max Goals per Employee</label>
              <input
                type="text"
                value={perfMaxGoals}
                onChange={(e) => setPerfMaxGoals(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Goal Deadline (days before review)</label>
              <input
                type="text"
                value={perfGoalDeadline}
                onChange={(e) => setPerfGoalDeadline(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => showToast("Performance rubrics published")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  };

  const renderHolidayCalendar = () => {
    const filteredHols = holidaysList.filter((h) => {
      const matchesSearch = h.name.toLowerCase().includes(holSearchQuery.toLowerCase());
      const matchesYear = holYearFilter === "All" || h.date.startsWith(holYearFilter);
      const matchesMonth = holMonthFilter === "All" || (new Date(h.date).getMonth() + 1) === parseInt(holMonthFilter);
      const matchesType = holTypeFilter === "All" || h.type === holTypeFilter;
      const matchesLoc = holLocFilter === "All" || h.location === holLocFilter;
      const matchesStatus = holStatusFilter === "All" || h.status === holStatusFilter;
      return matchesSearch && matchesYear && matchesMonth && matchesType && matchesLoc && matchesStatus;
    });

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Holidays</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Holiday Management</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Manage global and regional business milestones</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const mockIndiaTemplate: HolidayRecord[] = [
                  { name: "Gandhi Jayanti", date: "2026-10-02", day: "Friday", type: "National", location: "All Locations", dept: "All", recurring: true, status: "Active", description: "Mahatma Gandhi Birthday" },
                  { name: "New Year's Day", date: "2026-01-01", day: "Thursday", type: "Festival", location: "All Locations", dept: "All", recurring: false, status: "Active", description: "New Year" }
                ];
                setHolidaysList([...holidaysList, ...mockIndiaTemplate]);
                showToast("Indian holidays template imported successfully", "success");
              }}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer transition-all"
              style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              Import Holidays
            </button>
            <button
              onClick={() => {
                setHolidayForm({
                  name: "",
                  date: "2026-01-01",
                  type: "National",
                  location: "All Locations",
                  dept: "All",
                  recurring: true,
                  status: "Active",
                  description: "",
                });
                setSelectedHoliday(null);
                setActiveModal("add_holiday");
              }}
              style={{
                backgroundColor: "#00B87C",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add Holiday
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Holidays", value: holidaysList.length, icon: <PartyPopper size={20} />, color: "#00B87C", bg: "rgba(0, 184, 124, 0.1)" },
            { label: "Upcoming Holidays", value: holidaysList.filter(h => new Date(h.date) >= new Date()).length, icon: <CalendarDays size={20} />, color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)" },
            { label: "Optional Holidays", value: holidaysList.filter(h => h.type === "Optional").length, icon: <Star size={20} />, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            { label: "Regional Holidays", value: holidaysList.filter(h => h.type === "Regional").length, icon: <MapPin size={20} />, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" },
          ].map((card, idx) => (
            <div key={idx} className="p-4 rounded-2xl flex items-center justify-between shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>{card.label}</p>
                <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", marginTop: "4px", marginBottom: 0 }}>{card.value}</p>
              </div>
              <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-xl flex flex-wrap items-center gap-3 mb-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={holSearchQuery}
            onChange={(e) => setHolSearchQuery(e.target.value)}
            className="rounded-xl px-4 py-2 text-sm outline-none border w-60 transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
          <select
            value={holYearFilter}
            onChange={(e) => setHolYearFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="All">All Years</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <select
            value={holMonthFilter}
            onChange={(e) => setHolMonthFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="All">All Months</option>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={holTypeFilter}
            onChange={(e) => setHolTypeFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="All">All Types</option>
            <option value="National">National</option>
            <option value="Company">Company</option>
            <option value="Optional">Optional</option>
            <option value="Regional">Regional</option>
            <option value="Festival">Festival</option>
          </select>
          <select
            value={holLocFilter}
            onChange={(e) => setHolLocFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="All">All Locations</option>
            <option value="All Locations">Global</option>
            <option value="Bengaluru HQ">Bengaluru HQ</option>
            <option value="Mumbai Branch">Mumbai Branch</option>
            <option value="Delhi Warehouse">Delhi Warehouse</option>
          </select>
          <select
            value={holStatusFilter}
            onChange={(e) => setHolStatusFilter(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="flex border rounded-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>

            <button
              onClick={() => setHolidayViewMode("List")}
              className={`px-4 py-2 text-xs font-bold ${holidayViewMode === "List" ? "text-white bg-[#00B87C]" : "bg-transparent text-[var(--foreground)]"} cursor-pointer transition-all`}
            >
              List
            </button>
            <button
              onClick={() => setHolidayViewMode("Calendar")}
              className={`px-4 py-2 text-xs font-bold ${holidayViewMode === "Calendar" ? "text-white bg-[#00B87C]" : "bg-transparent text-[var(--foreground)]"} cursor-pointer transition-all`}
            >
              Calendar
            </button>
          </div>
        </div>

        {holidayViewMode === "List" ? (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm mb-6">
            <table className="w-full border-collapse" style={{ minWidth: "1000px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", backgroundColor: "var(--muted)" }}>
                  {["HOLIDAY", "DATE", "DAY", "TYPE", "APPLICABLE TO", "DEPARTMENT", "RECURRING", "STATUS", "ACTION"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredHols.map((h, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--border)", height: "56px" }} className="hover:bg-[var(--muted)] transition-all">
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{h.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{h.date}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted-foreground)" }}>{h.day}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          backgroundColor: h.type === "National" ? "rgba(0, 184, 124, 0.1)" : h.type === "Optional" ? "rgba(245, 158, 11, 0.1)" : "rgba(14, 165, 233, 0.1)",
                          color: h.type === "National" ? "#00B87C" : h.type === "Optional" ? "#F59E0B" : "#0EA5E9",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {h.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{h.location}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{h.dept}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{h.recurring ? "Yearly" : "One-time"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          backgroundColor: h.status === "Active" ? "rgba(0, 184, 124, 0.1)" : "rgba(107, 114, 128, 0.1)",
                          color: h.status === "Active" ? "#00B87C" : "#6B7280",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedHoliday(h);
                            setHolidayForm({
                              name: h.name,
                              date: h.date,
                              type: h.type,
                              location: h.location,
                              dept: h.dept,
                              recurring: h.recurring,
                              status: h.status,
                              description: h.description,
                            });
                            setActiveModal("edit_holiday");
                          }}
                          style={{ backgroundColor: "transparent", border: "1px solid #00B87C", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, color: "#00B87C", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedHoliday(h);
                            setActiveModal("delete_holiday");
                          }}
                          style={{ backgroundColor: "transparent", border: "1px solid #EF4444", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: 600, color: "#EF4444", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 rounded-2xl border border-[var(--border)] shadow-sm mb-6" style={{ backgroundColor: "var(--card)" }}>
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase" }}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2" style={{ minHeight: "200px" }}>
              {filteredHols.map((h, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedHoliday(h);
                    setActiveModal("view_holiday");
                  }}
                  className="p-2 rounded-xl border flex flex-col justify-between hover:border-[#00B87C] cursor-pointer transition-all"
                  style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)", minHeight: "80px" }}
                >
                  <span className="font-bold text-xs" style={{ color: "var(--foreground)" }}>{h.date.split("-")[2]}</span>
                  <span className="text-[10px] font-semibold truncate mt-1 px-1 py-0.5 rounded" style={{ backgroundColor: "rgba(0, 184, 124, 0.1)", color: "#00B87C" }}>
                    {h.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: HOLIDAY SETTINGS */}
        <SectionTitle title="Holiday Settings" />
        <div className="space-y-4 mb-6">
          {[
            { label: "Auto-mark holidays in Attendance", state: holAutoMark, setter: setHolAutoMark },
            { label: "Include Optional/Restricted Holidays", state: holOptional, setter: setHolOptional },
            { label: "Region-specific Holiday Calendars", state: holRegionSpecific, setter: setHolRegionSpecific },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>{row.label}</span>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => showToast("Holiday schedule modified successfully")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  const renderCompanyProfile = () => (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Company Profile</span>
      </div>

      {/* Content Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)" }}>Company Profile</h2>
        <button
          onClick={() => showToast("Corporate profile definitions recorded")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>

      {/* Section: BASIC INFORMATION */}
      <SectionTitle title="Basic Information" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Legal Entity Name</label>
          <input
            type="text"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Founded Year</label>
          <input
            type="text"
            value={foundedYear}
            onChange={(e) => setFoundedYear(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Company Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
            <input
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Support Phone</label>
          <div className="relative">
            <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
        </div>
      </div>

      {/* Section: ADDRESS & REGION */}
      <SectionTitle title="Address & Region" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Registered Address</label>
          <input
            type="text"
            value={registeredAddress}
            onChange={(e) => setRegisteredAddress(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="UAE">UAE</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
            <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
            <option value="GMT (UTC+0:00)">GMT (UTC+0:00)</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Financial Year Start</label>
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="April 1">April 1</option>
            <option value="January 1">January 1</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="INR (₹)">INR (₹)</option>
            <option value="USD ($)">USD ($)</option>
            <option value="EUR (€)">EUR (€)</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Date Format</label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      {/* Section: BRANDING */}
      <SectionTitle title="Branding" />
      <div
        style={{
          backgroundColor: "var(--secondary)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#00B87C",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            N
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>Company Logo</p>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>PNG or SVG, max 2MB, min 200×200px</p>
          </div>
        </div>
        <button
          onClick={() => showToast("Upload logo handler mapped")}
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "6px 14px",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--foreground)",
            cursor: "pointer",
          }}
        >
          Upload Logo
        </button>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center gap-4 pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setActiveModal("reset_defaults")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "var(--muted-foreground)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset to Defaults
        </button>
        <button
          onClick={() => showToast("Corporate profile definitions recorded")}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderDepartments = () => {
    // Filter and sort logic
    const filteredDepts = deptsList.filter((d) => {

      const matchesSearch = d.name.toLowerCase().includes(deptSearchQuery.toLowerCase()) ||
                          d.code.toLowerCase().includes(deptSearchQuery.toLowerCase());
      
      const matchesStatus = deptStatusFilter === "All Status" || d.status === deptStatusFilter;
      
      return matchesSearch && matchesStatus;
    });

    if (deptSortBy === "Name") {
      filteredDepts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (deptSortBy === "Employees") {
      filteredDepts.sort((a, b) => b.empCount - a.empCount);
    } else if (deptSortBy === "Created Date") {
      filteredDepts.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    }

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Departments</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Department Configuration</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Manage corporate departments and structural definitions</p>
          </div>
          <button
            onClick={() => {
              setDeptForm({ name: "", code: "", head: "", status: "Active", budget: "", description: "" });
              setSelectedDept(null);
              setActiveModal("add_department");
            }}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Department
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Departments", value: deptsList.length, icon: <Building2 size={20} />, color: "#00B87C", bg: "rgba(0, 184, 124, 0.1)" },
            { label: "Active Departments", value: deptsList.filter(d => d.status === "Active").length, icon: <CheckCircle size={20} />, color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)" },
            { label: "Employees Assigned", value: deptsList.reduce((acc, curr) => acc + curr.empCount, 0), icon: <Users size={20} />, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            { label: "Without Head", value: deptsList.filter(d => !d.head).length, icon: <UserMinus size={20} />, color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
          ].map((card, idx) => (
            <div key={idx} className="p-4 rounded-2xl flex items-center justify-between shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>{card.label}</p>
                <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", marginTop: "4px", marginBottom: 0 }}>{card.value}</p>
              </div>
              <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div 
          className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search departments..."
              value={deptSearchQuery}
              onChange={(e) => setDeptSearchQuery(e.target.value)}
              className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <select
              value={deptStatusFilter}
              onChange={(e) => setDeptStatusFilter(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={deptSortBy}
              onChange={(e) => setDeptSortBy(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="Name">Sort by Name</option>
              <option value="Employees">Sort by Employees</option>
              <option value="Created Date">Sort by Date</option>
            </select>
          </div>
          <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Showing {filteredDepts.length} departments</span>
        </div>

        {/* Section: DEPARTMENTS TABLE */}
        <div className="overflow-x-auto mb-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <table className="w-full border-collapse" style={{ minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", backgroundColor: "var(--muted)" }}>
                {["DEPARTMENT", "CODE", "HEAD", "EMPLOYEES", "BUDGET", "STATUS", "CREATED", "ACTION"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDepts.map((d, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: "1px solid var(--border)", height: "56px" }}
                  className="hover:bg-[var(--muted)] transition-all"
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{d.name}</div>
                    {d.description && <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{d.description}</div>}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "var(--muted-foreground)" }}>
                    <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                      {d.code}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{d.head || <span style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>No Head Assigned</span>}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: "rgba(0, 184, 124, 0.1)",
                        color: "#00B87C",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {d.empCount} Employees
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{d.budget || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: d.status === "Active" ? "rgba(0, 184, 124, 0.1)" : "rgba(107, 114, 128, 0.1)",
                        color: d.status === "Active" ? "#00B87C" : "#6B7280",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--muted-foreground)" }}>{d.createdDate}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDept(d);
                          setActiveModal("view_department");
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDept(d);
                          setDeptForm({
                            name: d.name,
                            code: d.code,
                            head: d.head,
                            status: d.status,
                            budget: d.budget || "",
                            description: d.description || "",
                          });
                          setActiveModal("edit_department");
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #00B87C",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#00B87C",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDept(d);
                          setActiveModal("delete_department");
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #EF4444",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#EF4444",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Section: DEPARTMENT HIERARCHY SETTINGS */}
        <SectionTitle title="Department Hierarchy Settings" />
        <div className="space-y-4 mb-6">
          {[
            { label: "Allow Sub-departments", state: allowSubDepts, setter: setAllowSubDepts },
            { label: "Require Cost Center Code", state: requireCostCenter, setter: setRequireCostCenter },
            { label: "Enable Budget Tracking per Department", state: budgetTracking, setter: setBudgetTracking },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>{row.label}</span>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center py-2">
            <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>Alert at Budget Threshold (%)</span>
            <input
              type="text"
              value={budgetThreshold}
              onChange={(e) => setBudgetThreshold(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border w-20 text-center"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => showToast("Department hierarchies locked")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    );

  };

  const renderLocations = () => {
    // Filter and Sort Logic
    const filteredLocs = locationsList.filter((l) => {
      const matchesSearch = l.name.toLowerCase().includes(locSearchQuery.toLowerCase()) ||
                          l.code.toLowerCase().includes(locSearchQuery.toLowerCase()) ||
                          l.city.toLowerCase().includes(locSearchQuery.toLowerCase());
      
      const matchesStatus = locStatusFilter === "All" || l.status === locStatusFilter;
      const matchesType = locTypeFilter === "All" || l.type === locTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    if (locSortBy === "Name") {
      filteredLocs.sort((a, b) => a.name.localeCompare(b.name));
    } else if (locSortBy === "City") {
      filteredLocs.sort((a, b) => a.city.localeCompare(b.city));
    } else if (locSortBy === "Employees") {
      filteredLocs.sort((a, b) => b.empCount - a.empCount);
    }

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Locations</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Location Management</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Track geographical assets and structural deployment centers</p>
          </div>
          <button
            onClick={() => {
              setLocForm({
                name: "",
                code: "",
                type: "Branch",
                address: "",
                city: "",
                state: "",
                country: "",
                pincode: "",
                manager: "",
                timezone: "IST (UTC+5:30)",
                status: "Active",
                notes: "",
              });
              setSelectedLoc(null);
              setActiveModal("add_location");
            }}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Location
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Locations", value: locationsList.length, icon: <MapPin size={20} />, color: "#00B87C", bg: "rgba(0, 184, 124, 0.1)" },
            { label: "Active Locations", value: locationsList.filter(l => l.status === "Active").length, icon: <CheckCircle size={20} />, color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)" },
            { label: "Employees Assigned", value: locationsList.reduce((acc, curr) => acc + curr.empCount, 0), icon: <Users size={20} />, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            { label: "Branches & Offices", value: locationsList.filter(l => l.type === "Head Office" || l.type === "Branch").length, icon: <Building2 size={20} />, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" },
          ].map((card, idx) => (
            <div key={idx} className="p-4 rounded-2xl flex items-center justify-between shadow-sm" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>{card.label}</p>
                <p style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", marginTop: "4px", marginBottom: 0 }}>{card.value}</p>
              </div>
              <div style={{ padding: "10px", borderRadius: "12px", backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div 
          className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name, code, city..."
              value={locSearchQuery}
              onChange={(e) => setLocSearchQuery(e.target.value)}
              className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <select
              value={locStatusFilter}
              onChange={(e) => setLocStatusFilter(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Partial">Partial</option>
            </select>
            <select
              value={locTypeFilter}
              onChange={(e) => setLocTypeFilter(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="All">All Types</option>
              <option value="Head Office">Head Office</option>
              <option value="Branch">Branch</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Remote">Remote</option>
            </select>
            <select
              value={locSortBy}
              onChange={(e) => setLocSortBy(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="Name">Sort by Name</option>
              <option value="City">Sort by City</option>
              <option value="Employees">Sort by Employees</option>
            </select>
          </div>
          <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Showing {filteredLocs.length} locations</span>
        </div>

        {/* Locations Table */}
        <div className="overflow-x-auto mb-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <table className="w-full border-collapse" style={{ minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", backgroundColor: "var(--muted)" }}>
                {["LOCATION", "CODE", "TYPE", "CITY/STATE", "MANAGER", "EMPLOYEES", "TIMEZONE", "STATUS", "ACTION"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLocs.map((l, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: "1px solid var(--border)", height: "56px" }}
                  className="hover:bg-[var(--muted)] transition-all"
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{l.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{l.address}</div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "var(--muted-foreground)" }}>
                    <span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                      {l.code}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{l.type}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{l.city}, {l.state}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{l.manager || <span style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}>Unassigned</span>}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: "rgba(0, 184, 124, 0.1)",
                        color: "#00B87C",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {l.empCount} Employees
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--foreground)" }}>{l.timezone}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: l.status === "Active" ? "rgba(0, 184, 124, 0.1)" : l.status === "Partial" ? "rgba(245, 158, 11, 0.1)" : "rgba(107, 114, 128, 0.1)",
                        color: l.status === "Active" ? "#00B87C" : l.status === "Partial" ? "#F59E0B" : "#6B7280",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedLoc(l);
                          setActiveModal("view_location");
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLoc(l);
                          setLocForm({
                            name: l.name,
                            code: l.code,
                            type: l.type,
                            address: l.address,
                            city: l.city,
                            state: l.state,
                            country: l.country,
                            pincode: l.pincode,
                            manager: l.manager,
                            timezone: l.timezone,
                            status: l.status,
                            notes: l.notes || "",
                          });
                          setActiveModal("edit_location");
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #00B87C",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#00B87C",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLoc(l);
                          setActiveModal("delete_location");
                        }}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #EF4444",
                          borderRadius: "8px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#EF4444",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Section: LOCATION RULES */}
        <SectionTitle title="Location Rules" />
        <div className="space-y-4 mb-6">
          {[
            { label: "Enable Location-based Attendance (GPS)", state: gpsAttendance, setter: setGpsAttendance },
            { label: "Allow Remote Work Marking", state: allowRemoteWork, setter: setAllowRemoteWork },
            { label: "Require Geofence Verification", state: requireGeofence, setter: setRequireGeofence },
            { label: "Region-specific Holiday Calendars", state: regionHolidays, setter: setRegionHolidays },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>{row.label}</span>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Geofence Radius (meters)</label>
            <input
              type="text"
              value={geofenceRadius}
              onChange={(e) => setGeofenceRadius(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Default Country</label>
            <select
              value={defaultLocCountry}
              onChange={(e) => setDefaultLocCountry(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => showToast("Site constraints adjusted")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  const renderRolesAndPermissions = () => (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--primary)", cursor: "pointer" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "var(--muted-foreground)" }}>Roles & Permissions</span>
      </div>

      {/* Header row */}
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ color: "var(--foreground)", fontSize: "18px", fontWeight: 800 }}>Roles & Permissions</h2>
        <button
          onClick={openCreateRoleModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
          style={{
            backgroundColor: "#00B87C",
            fontSize: "13px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,184,124,0.2)",
          }}
        >
          <Plus size={16} /> Create Role
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <table className="w-full border-collapse text-left" style={{ minWidth: "600px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="pb-3" style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 700 }}>Role Name</th>
              <th className="pb-3" style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 700 }}>Members</th>
              <th className="pb-3" style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 700 }}>Created</th>
              <th className="pb-3" style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 700 }}>Modified</th>
              <th className="pb-3 text-right" style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 700 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rolesList.map((role) => (
              <tr
                key={role.id}
                style={{ borderBottom: "1px solid var(--border)", height: "56px" }}
                className="hover:bg-[var(--muted)] transition-colors"
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: role.color }}
                    >
                      {role.name.charAt(0)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{role.name}</span>
                      {role.isDefault && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
                        >
                          Default
                        </span>
                      )}
                      {role.isDefault && <LockIcon size={12} style={{ color: "var(--muted-foreground)" }} />}
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: "13px", color: "var(--foreground)" }}>{role.members}</td>
                <td style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{role.created}</td>
                <td style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{role.modified}</td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditRoleModal(role)}
                      className="px-3 py-1 rounded-lg text-[12px] font-semibold transition-all"
                      style={{
                        border: "1px solid #00B87C",
                        color: "#00B87C",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#00B87C";
                        (e.currentTarget as HTMLButtonElement).style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = "#00B87C";
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setActiveModal("delete_role")}
                      className="px-3 py-1 rounded-lg text-[12px] font-semibold transition-all"
                      style={{
                        border: "1px solid #EF4444",
                        color: "#EF4444",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        opacity: role.isDefault ? 0.4 : 1,
                      }}
                      disabled={role.isDefault}
                      onMouseEnter={(e) => {
                        if (!role.isDefault) {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EF4444";
                          (e.currentTarget as HTMLButtonElement).style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!role.isDefault) {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
                        }
                      }}
                    >
                      Delete
                    </button>
                    <ChevronRight onClick={() => openEditRoleModal(role)} size={16} style={{ color: "var(--muted-foreground)", cursor: "pointer" }} className="hover:text-[var(--primary)] transition-colors" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permission Matrix */}
      <div className="mt-6">
        <h3 style={{ color: "var(--foreground)", fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
          Module Permissions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left" style={{ minWidth: "600px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th
                  className="pb-3"
                  style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 700, width: "200px" }}
                >
                  Module Name
                </th>
                {rolesList.map((role) => (
                  <th
                    key={role.id}
                    className="pb-3 text-center"
                    style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 700 }}
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionGroups.map((group) => (
                <React.Fragment key={group.id}>
                  {/* Group Header Row */}
                  <tr
                    style={{ backgroundColor: "var(--secondary)", height: "40px" }}
                    className="cursor-pointer select-none"
                    onClick={() =>
                      setExpandedGroups((prev) => ({
                        ...prev,
                        [group.id]: !prev[group.id as keyof typeof prev],
                      }))
                    }
                  >
                    <td colSpan={6} className="px-3 font-bold text-[12px] text-var(--foreground)">
                      <div className="flex items-center gap-2">
                        {expandedGroups[group.id as keyof typeof expandedGroups] ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                        {group.name}
                      </div>
                    </td>
                  </tr>

                  {/* Module Rows */}
                  {expandedGroups[group.id as keyof typeof expandedGroups] &&
                    group.modules.map((mod) => (
                      <tr
                        key={mod.id}
                        style={{ borderBottom: "1px solid var(--border)", height: "48px" }}
                        className="hover:bg-[var(--muted)] transition-colors"
                      >
                        <td className="pl-8 text-[13px] font-medium text-var(--foreground)">{mod.name}</td>
                        {rolesList.map((role) => {
                          const cellState = permissions[mod.id][role.id];
                          return (
                            <td key={role.id} className="text-center">
                              <div
                                onClick={() => toggleCell(mod.id, role.id)}
                                className="inline-flex items-center justify-center rounded-lg cursor-pointer select-none transition-all"
                                style={{
                                  width: "80px",
                                  height: "32px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  backgroundColor:
                                    cellState === "full"
                                      ? "rgba(0, 184, 124, 0.1)"
                                      : cellState === "view"
                                      ? "rgba(14, 165, 233, 0.1)"
                                      : "var(--muted)",
                                  color:
                                    cellState === "full"
                                      ? "#00B87C"
                                      : cellState === "view"
                                      ? "#0EA5E9"
                                      : "var(--muted-foreground)",
                                }}
                              >
                                {cellState === "full" ? "Full" : cellState === "view" ? "View" : "—"}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => {
    const pendingInvites = [
      { email: "priya.new@nexushr.com", role: "HR Manager", roleColor: "#10B981", roleBg: "rgba(16, 185, 129, 0.1)", sent: "Sent Apr 1" },
      { email: "leo.m@nexushr.com", role: "Manager", roleColor: "#F59E0B", roleBg: "rgba(245, 158, 11, 0.1)", sent: "Sent Mar 28" },
      { email: "sarah.k@nexushr.com", role: "Finance", roleColor: "#0EA5E9", roleBg: "rgba(14, 165, 233, 0.1)", sent: "Sent Mar 25" }
    ];

    return (

      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>User Management</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>User Management</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Manage system access and user accounts</p>
          </div>
          <button
            onClick={() => {
              setInviteForm({
                name: "",
                email: "",
                role: "Employee",
                dept: "Engineering",
                location: "",
                sendEmail: true,
                tempPassword: "",
                notes: "",
              });
              setActiveModal("invite_user");
            }}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Invite User
          </button>
        </div>

        {/* Filter Bar */}
        <div 
          className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <select
              className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="All Roles">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Manager">Manager</option>
              <option value="Finance">Finance</option>
              <option value="Employee">Employee</option>
            </select>
            <select
              className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending Invite">Pending Invite</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
            <select
              className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="All Departments">All Departments</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>

          </div>
          <span style={{ fontSize: "13px", color: "#6B7280" }}>Showing {usersList.length} users</span>
        </div>

        {/* Section: SYSTEM USERS */}
        <SectionTitle title="System Users" />
        <div className="overflow-x-auto mb-8" style={{ maxWidth: "100%", overflowX: "auto" }}>
          <table className="w-full border-collapse" style={{ minWidth: "600px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                {["USER", "ROLE", "DEPARTMENT", "LAST LOGIN", "STATUS", "ACTION"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersList.map((u, idx) => {
                const roleStyle = getRoleStyles(u.role);
                const statusStyle = getStatusStyles(u.status);
                return (
                  <tr
                    key={idx}
                    style={{ borderBottom: "1px solid var(--border)", height: "56px" }}
                    className="hover:bg-[var(--muted)] transition-all"
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                          style={{ backgroundColor: u.avatarBg }}
                        >
                          {u.initials}
                        </div>
                        <div>
                          <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{u.name}</span>
                          <span style={{ display: "block", fontSize: "11px", color: "var(--muted-foreground)" }}>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          backgroundColor: roleStyle.bg,
                          color: roleStyle.color,
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>{u.dept}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted-foreground)" }}>{u.lastLogin}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div className="flex items-center gap-2">
                        {u.status === "Pending Invite" && (
                          <>
                            <button
                              onClick={() => showToast("Invitation sent successfully")}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #00B87C",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#00B87C",
                                cursor: "pointer",
                              }}
                            >
                              Resend
                            </button>
                            <button
                              onClick={() => {
                                setUsersList(usersList.filter((user) => user.email !== u.email));
                                showToast("Invitation cancelled successfully");
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #EF4444",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#EF4444",
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {u.status === "Active" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setEditForm({
                                  name: u.name,
                                  email: u.email,
                                  role: u.role,
                                  dept: u.dept,
                                  location: u.location || "",
                                  status: u.status,
                                  permissions: "",
                                });
                                setActiveModal("edit_user");
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "var(--foreground)",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setActiveModal("deactivate_user");
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #EF4444",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#EF4444",
                                cursor: "pointer",
                              }}
                            >
                              Deactivate
                            </button>
                          </>
                        )}
                        {(u.status === "Inactive" || u.status === "Suspended") && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setEditForm({
                                  name: u.name,
                                  email: u.email,
                                  role: u.role,
                                  dept: u.dept,
                                  location: u.location || "",
                                  status: u.status,
                                  permissions: "",
                                });
                                setActiveModal("edit_user");
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "var(--foreground)",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(u);
                                setReactivateConfirm({ sendEmail: true, confirmDetails: false });
                                setActiveModal("reactivate_user");
                              }}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #00B87C",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#00B87C",
                                cursor: "pointer",
                              }}
                            >
                              Reactivate
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section: INVITE PENDING */}
        <SectionTitle title="Invite Pending" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-4" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          {pendingInvites.map((p, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-4">
                <span style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600 }}>{p.email}</span>
                <span
                  style={{
                    backgroundColor: p.roleBg,
                    color: p.roleColor,
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {p.role}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{p.sent}</span>
                <button
                  onClick={() => showToast("Invitation credentials resubmitted successfully")}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#00B87C",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Resend
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[var(--border)]">
          <button
            onClick={() => showToast("Changes saved successfully")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    );

  };

  const renderSecuritySettings = () => {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Security</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Security Settings</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Authentication, session and access control</p>
          </div>
          <button
            onClick={() => showToast("Authentication schemas hardened securely")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>

        {/* Policy Block 1: AUTHENTICATION */}
        <SectionTitle title="Authentication" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-4" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          {[
            { label: "Enforce Multi-Factor Authentication (MFA)", desc: "All users must set up TOTP or SMS OTP on next login", state: secEnforceMfa, setter: setSecEnforceMfa },
            { label: "Allow Google SSO", desc: "Users can sign in with Google Workspace accounts", state: secGoogleSso, setter: setSecGoogleSso },
            { label: "Allow Microsoft / Azure AD SSO", desc: "Enterprise SSO via Microsoft identity platform", state: secMicrosoftSso, setter: setSecMicrosoftSso },
            { label: "Enforce SSO-only Login", desc: "Disable password login when SSO is connected", state: secSsoOnly, setter: setSecSsoOnly },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div>
                <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
                {"desc" in row && <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", margin: 0 }}>{row.desc}</p>}
              </div>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Policy Block 2: PASSWORD POLICY */}
        <SectionTitle title="Password Policy" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { label: "Minimum 8 characters", state: secPwMinLen, setter: setSecPwMinLen },
              { label: "Require uppercase letters (A–Z)", state: secPwUpper, setter: setSecPwUpper },
              { label: "Require numbers and special characters (!@#$)", state: secPwNumbers, setter: setSecPwNumbers },
              { label: "Prevent reuse of last 5 passwords", state: secPwPreventReuse, setter: setSecPwPreventReuse },
              { label: "Force password change on first login", state: secPwForceChange, setter: setSecPwForceChange },
            ].map((f, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => f.setter(!f.state)}
                  className="w-5 h-5 rounded flex items-center justify-center border transition-all"
                  style={{
                    backgroundColor: f.state ? "#00B87C" : "transparent",
                    borderColor: f.state ? "#00B87C" : "var(--border)",
                  }}
                >
                  {f.state && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 5" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>
                  {f.label}
                </span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Password Expiry (days)</label>
              <input
                type="text"
                value={secPwExpiry}
                onChange={(e) => setSecPwExpiry(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Max Failed Login Attempts</label>
              <input
                type="text"
                value={secMaxFailedAttempts}
                onChange={(e) => setSecMaxFailedAttempts(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Account Lockout Duration (mins)</label>
              <input
                type="text"
                value={secLockoutDuration}
                onChange={(e) => setSecLockoutDuration(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Lockout Reset Method</label>
              <select
                value={secLockoutResetMethod}
                onChange={(e) => setSecLockoutResetMethod(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="Manual by Admin">Manual by Admin ▾</option>
                <option value="Self-service via Email">Self-service via Email</option>
              </select>
            </div>
          </div>
        </div>

        {/* Policy Block 3: SESSION & IP CONTROL */}
        <SectionTitle title="Session & IP Control" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div>
            <div className="flex justify-between mb-2">
              <label style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 600 }}>
                Idle Timeout
              </label>
              <span style={{ color: "#00B87C", fontWeight: 700 }}>{secIdleTimeout} min</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={secIdleTimeout}
              onChange={(e) => setSecIdleTimeout(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: "#00B87C" }}
            />
            <div className="flex justify-between text-[11px] text-var(--muted-foreground) mt-1">
              <span>5 min</span>
              <span>120 min</span>
            </div>
          </div>

          {[
            { label: "Enable IP Whitelisting", desc: "Restrict login to specific IP address ranges", state: secIpWhitelisting, setter: setSecIpWhitelisting },
            { label: "Log All Login Attempts", state: secLogLogins, setter: setSecLogLogins },
            { label: "Alert on Suspicious Login (new device/location)", state: secAlertSuspicious, setter: setSecAlertSuspicious },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div>
                <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
                {"desc" in row && <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", margin: 0 }}>{row.desc}</p>}
              </div>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}

          {secIpWhitelisting && (
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Allowed IP Ranges</label>
              <textarea
                value={secAllowedIpRanges}
                onChange={(e) => setSecAllowedIpRanges(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none border font-mono"
                style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB", color: "#374151", height: "80px" }}
                placeholder={"192.168.1.0/24\n10.0.0.0/8"}
              />
            </div>
          )}
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center gap-4 pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveModal("reset_defaults")}
            style={{
              backgroundColor: "transparent",
              color: "#9CA3AF",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset to Defaults
          </button>
          <button
            onClick={() => showToast("Authentication schemas hardened securely")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };
  const renderAuditLogs = () => {
    const logs = [
      { text: "Ryan Park deleted employee record EMP-0421", time: "Today 10:42 AM", dotColor: "#EF4444" },
      { text: "Meera Thomas approved leave for Priya Sharma", time: "Today 10:15 AM", dotColor: "#10B981" },
      { text: "Ryan Park updated role permissions for HR Manager", time: "Today 9:58 AM", dotColor: "#0EA5E9" },
      { text: "Suresh Iyer ran payroll for March 2026", time: "Yesterday 6:30 PM", dotColor: "#F59E0B" },
      { text: "Ananya Das added new employee Leo Martinez", time: "Yesterday 3:12 PM", dotColor: "#10B981" },
      { text: "Ryan Park changed security policy — MFA enforced", time: "Apr 5, 2:00 PM", dotColor: "#8B5CF6" },
      { text: "Meera Thomas updated leave policy — EL carryforward 15 days", time: "Apr 4, 11:20 AM", dotColor: "#0EA5E9" },
      { text: "Suresh Iyer deleted shift template Engineering-Week-A", time: "Apr 3, 4:45 PM", dotColor: "#EF4444" },
    ];

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Audit Logs</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Audit Logs</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>System activity trail — who did what and when</p>
          </div>
          <button
            onClick={() => showToast("Audit trail extracted as corporate CSV bundle")}
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Export Logs
          </button>
        </div>

        {/* Filter Bar */}
        <div 
          className="p-4 rounded-xl flex flex-wrap items-center gap-3 mb-6"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <input
            type="text"
            placeholder="Search logs by user, action..."
            className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
          <select
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option>All Actions</option>
            <option>Login</option>
            <option>Edit</option>
            <option>Delete</option>
            <option>Create</option>
            <option>Export</option>
          </select>
          <select
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option>All Modules</option>
          </select>
          <select
            className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Custom</option>
          </select>
        </div>

        {/* Section: ACTIVITY LOG */}
        <SectionTitle title="Activity Log" />
        <div 
          className="rounded-xl overflow-hidden mb-6 p-2" 
          style={{ backgroundColor: "var(--input-background)", border: "1px solid var(--border)" }}
        >
          {logs.map((l, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center py-3 px-4"
              style={{ borderBottom: idx === logs.length - 1 ? "none" : "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div 
                  style={{ 
                    width: "8px", 
                    height: "8px", 
                    borderRadius: "50%", 
                    backgroundColor: l.dotColor,
                    flexShrink: 0, 
                  }} 
                />
                <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 600 }}>{l.text}</span>
              </div>
              <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{l.time}</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-2">
          <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Showing 1–8 of 1,248 logs</span>
          <div className="flex gap-2">
            <button style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>Previous</button>
            <button style={{ border: "1px solid var(--border)", background: "#00B87C", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}>1</button>
            <button style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>2</button>
            <button style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>3</button>
            <button style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>Next</button>
          </div>
        </div>
      </div>
    );
  };

  const renderConnectedApps = () => {
    const connected = [
      { name: "Google Workspace", desc: "Calendar, Drive and SSO sync", initials: "G", color: "#4285F4", sync: "Last sync: 2 mins ago" },
      { name: "Slack", desc: "Team notifications and alerts", initials: "S", color: "#611F69", sync: "Last sync: 1 hour ago" },
      { name: "Zoom", desc: "Meeting and interview scheduler", initials: "Z", color: "#00B9FF", sync: "Last sync: 5 hours ago" },
    ];

    const available = [
      { name: "Microsoft 365", desc: "Teams, Outlook and Azure AD", initials: "M", color: "#0078D4" },
      { name: "Jira", desc: "Project and task tracking sync", initials: "J", color: "#0052CC" },
      { name: "QuickBooks", desc: "Payroll and finance sync", initials: "Q", color: "#2CA01C" },
      { name: "DocuSign", desc: "E-signature for HR documents", initials: "D", color: "#FF6B00" },
      { name: "LinkedIn Talent", desc: "Recruitment and job posting", initials: "in", color: "#0A66C2" },
    ];

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Connected Apps</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Connected Apps</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Manage third-party integrations and OAuth connections</p>
          </div>
        </div>

        {/* Section: CONNECTED */}
        <div className="flex items-center gap-2 mt-6 mb-4">
          <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Connected
          </span>
          <span style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 700 }}>3 Active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {connected.map((app, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl flex flex-col justify-between transition-all hover:shadow-md" 
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0" 
                    style={{ backgroundColor: app.color }}
                  >
                    {app.initials}
                  </div>
                  <div>
                    <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{app.name}</span>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--muted-foreground)" }}>{app.desc}</span>
                  </div>
                </div>
                <span style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "2px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: 700 }}>Connected</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{app.sync}</span>
                <button
                  onClick={() => setActiveModal("manage_connected_app")}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Section: AVAILABLE INTEGRATIONS */}
        <div className="flex items-center gap-2 mt-6 mb-4">
          <div className="w-1 h-4 bg-[#00B87C] rounded-full" />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Available Integrations
          </span>
          <span style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 700 }}>Not Connected</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {available.map((app, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl flex flex-col justify-between transition-all hover:shadow-sm" 
              style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0" 
                    style={{ backgroundColor: app.color }}
                  >
                    {app.initials}
                  </div>
                  <div>
                    <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{app.name}</span>
                    <span style={{ display: "block", fontSize: "12px", color: "var(--muted-foreground)" }}>{app.desc}</span>
                  </div>
                </div>
                <span style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", padding: "2px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: 700 }}>Not Connected</span>
              </div>
              <div className="flex justify-end items-center mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  onClick={() => showToast("Connection established securely")}
                  style={{
                    backgroundColor: "#00B87C",
                    border: "none",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderApiSettings = () => {
    const keys = [
      { value: "nxhr_live_••••••••••••••••••••••3f9a", type: "Production", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", created: "Jan 1, 2026" },
      { value: "nxhr_test_••••••••••••••b2c4", type: "Sandbox", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", created: "Mar 1, 2026" },
    ];

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>API Settings</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>API Settings</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Manage API keys and developer access</p>
          </div>
          <button
            onClick={() => setActiveModal("generate_key")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Generate Key
          </button>
        </div>

        {/* Policy Block 1: ACTIVE API KEYS */}
        <SectionTitle title="Active API Keys" />
        <div className="space-y-3 mb-6">
          {keys.map((k, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4" 
              style={{ backgroundColor: "var(--input-background)", border: "1px solid var(--border)" }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-[var(--muted-foreground)]">{k.value}</span>
                <span
                  style={{
                    backgroundColor: k.bg,
                    color: k.color,
                    padding: "2px 8px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {k.type}
                </span>
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Created: {k.created}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => showToast("Token revealed dynamically")}
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  Reveal
                </button>
                <button
                  onClick={() => showToast("API secret hashed to clipboard buffer")}
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => setActiveModal("revoke_api_key")}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #EF4444",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#EF4444",
                    cursor: "pointer",
                  }}
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Policy Block 2: API CONFIGURATION */}
        <SectionTitle title="API Configuration" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-4" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          {[
            { label: "Enable REST API Access", state: apiRest, setter: setApiRest },
            { label: "Require IP Whitelisting for API", state: apiIpWhite, setter: setApiIpWhite },
            { label: "Enable Webhook Delivery", state: apiWebhook, setter: setApiWebhook },
            { label: "Log All API Requests", state: apiLog, setter: setApiLog },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Rate Limit (requests/min)</label>
              <input
                type="text"
                value={apiRateLimit}
                onChange={(e) => setApiRateLimit(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Token Expiry (hours)</label>
              <input
                type="text"
                value={apiTokenExp}
                onChange={(e) => setApiTokenExp(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Max Concurrent Connections</label>
              <input
                type="text"
                value={apiConcurrent}
                onChange={(e) => setApiConcurrent(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>API Version</label>
              <select
                value={apiVersion}
                onChange={(e) => setApiVersion(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="v2 (latest)">v2 (latest) ▾</option>
                <option value="v1">v1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Policy Block 3: ALLOWED IP RANGES (API) */}
        <SectionTitle title="Allowed IP Ranges (API)" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <textarea
            value={apiAllowedIp}
            onChange={(e) => setApiAllowedIp(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none border font-mono"
            style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)", height: "80px" }}
            placeholder="Enter IP ranges, one per line..."
          />
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => showToast("API policies enforced")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  };

  const renderWebhooks = () => {
    const rows = [
      { dot: "#10B981", url: "https://app.slack.com/webhooks/incoming/T04X...", event: "employee.joined", eventColor: "#10B981", eventBg: "rgba(16, 185, 129, 0.1)", status: "Active", statusColor: "#10B981" },
      { dot: "#10B981", url: "https://hooks.zapier.com/hooks/catch/123...", event: "payroll.processed", eventColor: "#F59E0B", eventBg: "rgba(245, 158, 11, 0.1)", status: "Active", statusColor: "#10B981" },
      { dot: "#EF4444", url: "https://api.crm.io/nexushr/events", event: "Failed — 502", eventColor: "#EF4444", eventBg: "rgba(239, 68, 68, 0.1)", status: "Failed — 502", statusColor: "#EF4444", failed: true },
      { dot: "#10B981", url: "https://api.slack.com/notify/leave...", event: "leave.approved", eventColor: "#0EA5E9", eventBg: "rgba(14, 165, 233, 0.1)", status: "Active", statusColor: "#10B981" },
    ];

    const availableEvents = [
      "employee.joined", "employee.left", "leave.applied",
      "leave.approved", "leave.rejected", "payroll.processed",
      "attendance.alert", "review.completed", "shift.changed",
      "role.updated", "document.uploaded", "onboarding.started"
    ];

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Webhooks</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Webhooks</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Push real-time event notifications to external systems</p>
          </div>
          <button
            onClick={() => setActiveModal("add_webhook")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Webhook
          </button>
        </div>

        {/* Section: ACTIVE WEBHOOKS */}
        <SectionTitle title="Active Webhooks" />
        <div className="space-y-3 mb-8">
          {rows.map((r, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4" 
              style={{ backgroundColor: "var(--input-background)", border: "1px solid var(--border)" }}
            >
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: r.dot }} />
                <span className="font-mono text-xs text-[#00B87C] w-64 truncate">{r.url}</span>
                <span
                  style={{
                    backgroundColor: r.eventBg,
                    color: r.eventColor,
                    padding: "2px 8px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {r.event}
                </span>
                <span style={{ fontSize: "12px", color: r.statusColor, fontWeight: 600 }}>{r.status}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {r.failed ? (
                  <button
                    onClick={() => showToast("Event notification resubmitted")}
                    style={{
                      backgroundColor: "#EF4444",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Retry
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => showToast("Ping delivered with HTTP 200 status code")}
                      style={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        cursor: "pointer",
                      }}
                    >
                      Test
                    </button>
                    <button
                      onClick={() => setActiveModal("edit_webhook")}
                      style={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setActiveModal("delete_webhook")}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #EF4444",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#EF4444",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section: AVAILABLE EVENTS */}
        <SectionTitle title="Available Events" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {availableEvents.map((ev, idx) => (
            <div 
              key={idx}
              className="p-2 rounded-xl border text-center text-[13px] font-medium transition-all cursor-pointer select-none"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#DCFCE7";
                e.currentTarget.style.color = "#00B87C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--card)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
            >
              {ev}
            </div>
          ))}
        </div>

        {/* Section: WEBHOOK SETTINGS */}
        <SectionTitle title="Webhook Settings" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-4" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          {[
            { label: "Retry Failed Webhooks (3 attempts)", state: webhookRetry, setter: setWebhookRetry },
            { label: "Include Payload Signature (HMAC)", state: webhookHmac, setter: setWebhookHmac },
            { label: "Enable Webhook Event Logs", state: webhookLogs, setter: setWebhookLogs },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => showToast("Webhook definitions cataloged successfully")}
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  };

  const renderEmailTemplates = () => {
    const templates = [
      { name: "Welcome Email", event: "employee.joined", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", subject: "Welcome to NexusHR, {{name}}!", edited: "Apr 1, 2026", status: "Active", statusColor: "#10B981", statusBg: "rgba(16, 185, 129, 0.1)" },
      { name: "Leave Approved", event: "leave.approved", color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)", subject: "Your leave from {{from}} to {{to}} is confirmed", edited: "Mar 15, 2026", status: "Active", statusColor: "#10B981", statusBg: "rgba(16, 185, 129, 0.1)" },
      { name: "Leave Rejected", event: "leave.rejected", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", subject: "Your leave request was not approved", edited: "Mar 15, 2026", status: "Active", statusColor: "#10B981", statusBg: "rgba(16, 185, 129, 0.1)" },
      { name: "Salary Slip Ready", event: "payroll.run", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)", subject: "Your salary slip for {{month}} is now available", edited: "Feb 28, 2026", status: "Active", statusColor: "#10B981", statusBg: "rgba(16, 185, 129, 0.1)" },
      { name: "Password Reset", event: "auth.reset", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", subject: "Reset your NexusHR password", edited: "Jan 10, 2026", status: "Active", statusColor: "#10B981", statusBg: "rgba(16, 185, 129, 0.1)" },
      { name: "Performance Review Due", event: "review.due", color: "#6B7280", bg: "rgba(107, 114, 128, 0.1)", subject: "Your performance review is due in {{days}} days", edited: "Dec 1, 2025", status: "Draft", statusColor: "#F59E0B", statusBg: "rgba(245, 158, 11, 0.1)" },
      { name: "Onboarding Welcome", event: "onboarding.start", color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.1)", subject: "Your first day at NexusHR is on {{date}}", edited: "Nov 20, 2025", status: "Active", statusColor: "#10B981", statusBg: "rgba(16, 185, 129, 0.1)" },
      { name: "Shift Change Alert", event: "shift.changed", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", subject: "Your shift on {{date}} has been updated", edited: "Oct 5, 2025", status: "Inactive", statusColor: "#6B7280", statusBg: "rgba(107, 114, 128, 0.1)" },
    ];

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Email Templates</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Email Templates</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Customize transactional and HR email content</p>
          </div>
          <button
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + New Template
          </button>
        </div>

        {/* Table */}
        <SectionTitle title="All Templates" />
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                {["TEMPLATE", "TRIGGER EVENT", "SUBJECT PREVIEW", "LAST EDITED", "STATUS", "ACTION"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "10px", fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.5px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {templates.map((t, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: "1px solid var(--border)", height: "56px" }}
                  className="hover:bg-[var(--muted)] transition-all"
                >
                  <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{t.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: t.bg,
                        color: t.color,
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {t.event}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", fontStyle: "italic", color: "var(--muted-foreground)" }}>{t.subject}</td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--muted-foreground)" }}>{t.edited}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor: t.statusBg,
                        color: t.statusColor,
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section: EMAIL SETTINGS */}
        <SectionTitle title="Email Settings" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>From Name</label>
              <input
                type="text"
                value={emailFromName}
                onChange={(e) => setEmailFromName(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>From Email</label>
              <input
                type="text"
                value={emailFromAddress}
                onChange={(e) => setEmailFromAddress(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Reply-To Email</label>
              <input
                type="text"
                value={emailReplyTo}
                onChange={(e) => setEmailReplyTo(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Email Provider</label>
              <select
                value={emailProvider}
                onChange={(e) => setEmailProvider(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="SendGrid">SendGrid ▾</option>
                <option value="Mailchimp">Mailchimp</option>
                <option value="Postmark">Postmark</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: "Add Company Logo to All Emails", state: emailAddLogo, setter: setEmailAddLogo },
              { label: "Add Footer Unsubscribe Link", state: emailAddUnsub, setter: setEmailAddUnsub },
              { label: "BCC HR on All Employee Emails", state: emailBccHr, setter: setEmailBccHr },
            ].map((row, idx) => (
              <div key={idx} className="flex justify-between items-center py-2">
                <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
                <button
                  onClick={() => row.setter(!row.state)}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: row.state ? "18px" : "2px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      transition: "all 0.2s",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  };

  const renderNotificationRules = () => {
    const cards = [
      { title: "🌴 Leave Requests", email: notifyLeaveEmail, setEmail: setNotifyLeaveEmail, push: notifyLeavePush, setPush: setNotifyLeavePush, sms: notifyLeaveSms, setSms: setNotifyLeaveSms },
      { title: "₹ Payroll Processed", email: notifyPayEmail, setEmail: setNotifyPayEmail, push: notifyPayPush, setPush: setNotifyPayPush, sms: notifyPaySms, setSms: setNotifyPaySms },
      { title: "⏰ Attendance Alerts", email: notifyAttEmail, setEmail: setNotifyAttEmail, push: notifyAttPush, setPush: setNotifyAttPush, sms: notifyAttSms, setSms: setNotifyAttSms },
      { title: "⭐ Performance Reviews", email: notifyPerfEmail, setEmail: setNotifyPerfEmail, push: notifyPerfPush, setPush: setNotifyPerfPush, sms: notifyPerfSms, setSms: setNotifyPerfSms },
      { title: "👤 New Employee Joining", email: notifyEmpEmail, setEmail: setNotifyEmpEmail, push: notifyEmpPush, setPush: setNotifyEmpPush, sms: notifyEmpSms, setSms: setNotifyEmpSms },
      { title: "📅 Shift Changes", email: notifyShiftEmail, setEmail: setNotifyShiftEmail, push: notifyShiftPush, setPush: setNotifyShiftPush, sms: notifyShiftSms, setSms: setNotifyShiftSms },
      { title: "📄 Document Uploads", email: notifyDocEmail, setEmail: setNotifyDocEmail, push: notifyDocPush, setPush: setNotifyDocPush, sms: notifyDocSms, setSms: setNotifyDocSms },
      { title: "🛡 System Alerts (Security)", email: notifySysEmail, setEmail: setNotifySysEmail, push: notifySysPush, setPush: setNotifySysPush, sms: notifySysSms, setSms: setNotifySysSms },
    ];

    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>Notification Rules</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Notification Rules</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Configure when and how notifications are sent</p>
          </div>
          <button
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Rules
          </button>
        </div>

        {/* Section: NOTIFICATION PREFERENCES */}
        <SectionTitle title="Notification Preferences" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {cards.map((c, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl flex flex-col justify-between" 
              style={{ backgroundColor: "var(--input-background)", border: "1px solid var(--border)" }}
            >
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", display: "block", marginBottom: "12px" }}>{c.title}</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Email", state: c.email, setter: c.setEmail },
                  { label: "Push", state: c.push, setter: c.setPush },
                  { label: "SMS", state: c.sms, setter: c.setSms },
                ].map((ch, cIdx) => (
                  <div key={cIdx} className="flex flex-col items-center bg-[var(--card)] p-2 rounded-lg border border-[var(--border)]">
                    <span style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "6px" }}>{ch.label}</span>
                    <button
                      onClick={() => ch.setter(!ch.state)}
                      style={{
                        width: "32px",
                        height: "18px",
                        borderRadius: "18px",
                        backgroundColor: ch.state ? "#00B87C" : "var(--switch-background)",
                        position: "relative",
                        transition: "all 0.2s",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "2px",
                          left: ch.state ? "16px" : "2px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: "white",
                          transition: "all 0.2s",
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Section: NOTIFICATION TIMING */}
        <SectionTitle title="Notification Timing" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Digest Email Frequency</label>
              <select
                value={notifyDigestFreq}
                onChange={(e) => setNotifyDigestFreq(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="Daily at 9 AM">Daily at 9 AM ▾</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Reminder Before Leave (days)</label>
              <input
                type="text"
                value={notifyLeaveDays}
                onChange={(e) => setNotifyLeaveDays(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Review Due Reminder (days before)</label>
              <input
                type="text"
                value={notifyPerfDays}
                onChange={(e) => setNotifyPerfDays(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Payroll Alert Time</label>
              <input
                type="text"
                value={notifyPayTime}
                onChange={(e) => setNotifyPayTime(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: "Send Weekend Notifications", state: notifyWeekend, setter: setNotifyWeekend },
              { label: "Quiet Hours (11 PM – 7 AM)", state: notifyQuiet, setter: setNotifyQuiet },
            ].map((row, idx) => (
              <div key={idx} className="flex justify-between items-center py-2">
                <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
                <button
                  onClick={() => row.setter(!row.state)}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "2px",
                      left: row.state ? "18px" : "2px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      transition: "all 0.2s",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Rules
          </button>
        </div>
      </div>
    );
  };

  const renderSmsSettings = () => {
    return (
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "#00B87C" }}>SMS Settings</span>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>SMS Settings</h2>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginTop: "2px" }}>Configure SMS gateway and notification messages</p>
          </div>
          <button
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>

        {/* POLICY BLOCK 1: SMS GATEWAY */}
        <SectionTitle title="SMS Gateway" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Provider</label>
              <select
                value={smsProvider}
                onChange={(e) => setSmsProvider(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="Twilio">Twilio ▾</option>
                <option value="AWS SNS">AWS SNS</option>
                <option value="MSG91">MSG91</option>
                <option value="Exotel">Exotel</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Sender ID</label>
              <input
                type="text"
                value={smsSenderId}
                onChange={(e) => setSmsSenderId(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>API Key</label>
              <input
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Auth Token</label>
              <input
                type="password"
                value={smsAuthToken}
                onChange={(e) => setSmsAuthToken(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Country Code Default</label>
              <select
                value={smsCountryCode}
                onChange={(e) => setSmsCountryCode(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="+91 (India)">+91 (India) ▾</option>
                <option value="+1 (US)">+1 (US)</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>DLT Principal Entity ID</label>
              <input
                type="text"
                value={smsDltId}
                onChange={(e) => setSmsDltId(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
          </div>
        </div>

        {/* POLICY BLOCK 2: SMS TRIGGERS */}
        <SectionTitle title="SMS Triggers" />
        <div 
          className="p-6 rounded-xl mb-6 space-y-4" 
          style={{ 
            backgroundColor: "var(--card)", 
            border: "1px solid var(--border)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          {[
            { label: "Salary Credited Alert", desc: "Sent after payroll disbursement", state: smsTriggerPay, setter: setSmsTriggerPay },
            { label: "Leave Approval / Rejection", desc: "Employee notified on status change", state: smsTriggerLeave, setter: setSmsTriggerLeave },
            { label: "OTP for MFA Login", desc: "One-time password for two-factor login", state: smsTriggerOtp, setter: setSmsTriggerOtp },
            { label: "Shift Change Notification", desc: "Alert when employee schedule is modified", state: smsTriggerShift, setter: setSmsTriggerShift },
            { label: "Attendance Irregularity Alert", desc: "Notify manager of 3+ consecutive absences", state: smsTriggerAtt, setter: setSmsTriggerAtt },
            { label: "Onboarding Welcome SMS", desc: "Sent to new employee on joining day", state: smsTriggerOnboard, setter: setSmsTriggerOnboard },
            { label: "Performance Review Reminder", desc: "Alert for review tasks", state: smsTriggerPerf, setter: setSmsTriggerPerf },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center py-2">
              <div>
                <p style={{ fontSize: "14px", color: "var(--foreground)", fontWeight: 600, margin: 0 }}>{row.label}</p>
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px", margin: 0 }}>{row.desc}</p>
              </div>
              <button
                onClick={() => row.setter(!row.state)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: row.state ? "#00B87C" : "var(--switch-background)",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: row.state ? "18px" : "2px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    transition: "all 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* POLICY BLOCK 3: SMS USAGE */}
        <SectionTitle title="SMS Usage" />
        <div 
          className="p-6 rounded-xl mb-6" 
          style={{ 
            backgroundColor: "rgba(0, 184, 124, 0.05)", 
            border: "1px solid rgba(0, 184, 124, 0.2)",
            borderLeft: "4px solid #00B87C" 
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
              <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#00B87C", textTransform: "uppercase" }}>Sent This Month</span>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "#00B87C" }}>1,248</span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Remaining Credits</span>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)" }}>8,752</span>
            </div>
            <div>
              <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#00B87C", textTransform: "uppercase" }}>Delivery Rate</span>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "#00B87C" }}>98.2%</span>
            </div>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#00B87C" }}>1,248 / 10,000 monthly plan</span>
              <a href="#" style={{ fontSize: "12px", fontWeight: 700, color: "#00B87C", textDecoration: "none" }}>Upgrade Plan</a>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-[#DCFCE7]">
              <div style={{ width: "12.48%", backgroundColor: "#00B87C" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"></div>
            </div>
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center gap-4 pt-4 mt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            style={{
              backgroundColor: "transparent",
              color: "#9CA3AF",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
          <button
            style={{
              backgroundColor: "#00B87C",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  };

  const renderAppearance = () => {
    const accentColors = [
      { hex: "#00B87C", name: "Emerald Green" },
      { hex: "#6366F1", name: "Indigo" },
      { hex: "#8B5CF6", name: "Purple" },
      { hex: "#0EA5E9", name: "Sky Blue" },
      { hex: "#F59E0B", name: "Amber" },
      { hex: "#EF4444", name: "Red" },
    ];

    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>System Preferences</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Appearance</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Appearance</h2>
          <button onClick={() => showToast("Appearance preferences saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
        </div>

        {/* POLICY BLOCK 1: THEME */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "#F0FDF4", borderColor: "rgba(0,184,124,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[3px] h-4 bg-[#00B87C] rounded-full" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.5px" }}>THEME</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "light", label: "Light", bg: "#FFFFFF", sidebar: "#00B87C" },
              { id: "dark", label: "Dark", bg: "#1F2937", sidebar: "#1F2937" },
              { id: "system", label: "System Default", bg: "linear-gradient(135deg, #FFFFFF 50%, #1F2937 50%)", sidebar: "#00B87C" }
            ].map((t) => {
              const selected = themeMode === t.id;
              return (
                <div 
                  key={t.id} 
                  onClick={() => setThemeMode(t.id)}
                  className="rounded-xl border cursor-pointer relative transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: selected ? "#00B87C" : "#E5E7EB",
                    borderWidth: selected ? "2px" : "1px",
                    padding: "12px"
                  }}
                >
                  {selected && <CheckCircle size={16} className="text-[#00B87C] absolute top-2 right-2" />}
                  <div className="w-full h-[60px] rounded-lg mb-2 border flex overflow-hidden" style={{ background: t.bg, borderColor: "#E5E7EB" }}>
                    <div className="w-4 h-full" style={{ backgroundColor: t.sidebar }} />
                  </div>
                  <div className="text-center font-bold text-[13px]" style={{ color: selected ? "#111827" : "#374151" }}>{t.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* POLICY BLOCK 2: COLOR ACCENT */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">ACCENT COLOR</span>
          <div className="flex items-center gap-3 mb-3">
            {accentColors.map((c) => {
              const selected = extraConfig.accentColor === c.hex;
              return (
                <button 
                  key={c.hex}
                  onClick={() => updateExtraConfig("accentColor", c.hex)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border-none"
                  style={{ backgroundColor: c.hex, boxShadow: selected ? `0 0 0 2px white, 0 0 0 4px ${c.hex}` : "none" }}
                >
                  {selected && <Check size={14} className="text-white" />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#00B87C] cursor-pointer font-medium">Custom Color</span>
            <input 
              type="color" 
              value={extraConfig.accentColor} 
              onChange={(e) => updateExtraConfig("accentColor", e.target.value)}
              className="w-6 h-6 border-none bg-transparent cursor-pointer"
            />
          </div>
        </div>

        {/* POLICY BLOCK 3: TYPOGRAPHY & DENSITY */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <div className="mb-4">
            <span className="block text-[11px] font-bold text-[#9CA3AF] mb-2 uppercase">FONT SIZE</span>
            <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-xl p-1 w-fit">
              {["Small", "Medium", "Large"].map((size) => {
                const active = extraConfig.fontSize === size;
                return (
                  <button 
                    key={size}
                    onClick={() => updateExtraConfig("fontSize", size)}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg border-none cursor-pointer transition-all"
                    style={{ backgroundColor: active ? "#00B87C" : "transparent", color: active ? "white" : "var(--foreground)" }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <span className="block text-[11px] font-bold text-[#9CA3AF] mb-2 uppercase">SIDEBAR DENSITY</span>
            <div className="space-y-3">
              {[
                { key: "compactSidebar", label: "Compact Sidebar", desc: "Reduce sidebar item height to 32px" },
                { key: "showSidebarIconsOnly", label: "Show Sidebar Icons Only (Collapsed)", desc: "Display only icons when collapsed" }
              ].map((item) => (
                <div key={item.key} className="flex justify-between items-center">
                  <div>
                    <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                    <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>
                  </div>
                  <button
                    onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                    style={{
                      width: "36px",
                      height: "20px",
                      borderRadius: "20px",
                      backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#9CA3AF] mb-2 uppercase">CONTENT DENSITY</span>
            <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-xl p-1 w-fit">
              {["Comfortable", "Compact", "Spacious"].map((d) => {
                const active = extraConfig.contentDensity === d;
                return (
                  <button 
                    key={d}
                    onClick={() => updateExtraConfig("contentDensity", d)}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg border-none cursor-pointer transition-all"
                    style={{ backgroundColor: active ? "#00B87C" : "transparent", color: active ? "white" : "var(--foreground)" }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* POLICY BLOCK 4: DASHBOARD PREFERENCES */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">DASHBOARD PREFERENCES</span>
          <div className="space-y-3 mb-4">
            {[
              { key: "showWelcomeMessage", label: "Show Welcome Message on Dashboard", desc: "" },
              { key: "enableAnimatedCharts", label: "Enable Animated Charts", desc: "Charts animate on page load" },
              { key: "showQuickActionButtons", label: "Show Quick Action Buttons", desc: "" },
              { key: "enableRealTimeRefresh", label: "Enable Real-time Data Refresh", desc: "Data refreshes every 30 seconds automatically" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Dashboard Refresh Interval</label>
            <select 
              value={extraConfig.dashboardRefreshInterval} 
              onChange={(e) => updateExtraConfig("dashboardRefreshInterval", e.target.value)}
              className="rounded-xl px-3 py-2 text-sm border bg-white dark:bg-neutral-800" 
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>15 seconds</option>
              <option>30 seconds</option>
              <option>1 minute</option>
              <option>5 minutes</option>
            </select>
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
          <button onClick={() => showToast("Settings reset to default", "error")} style={{ backgroundColor: "transparent", color: "#9CA3AF", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Reset to Defaults</button>
          <button onClick={() => showToast("Appearance preferences saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
        </div>
      </div>
    );
  };

  const renderLanguageRegion = () => {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>System Preferences</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Language & Region</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Language & Region</h2>
          <button onClick={() => showToast("Locale preferences saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
        </div>

        {/* POLICY BLOCK 1: LANGUAGE */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">LANGUAGE</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">System Language</label>
              <select value={appLanguage} onChange={(e) => setAppLanguage(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option value="en">English (US)</option>
                <option value="en-uk">English (UK)</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Secondary Language</label>
              <select value={extraConfig.secondaryLanguage} onChange={(e) => updateExtraConfig("secondaryLanguage", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>English (US)</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Employee Portal Language</label>
              <select value={extraConfig.employeePortalLanguage} onChange={(e) => updateExtraConfig("employeePortalLanguage", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Follow System</option>
                <option>English (US)</option>
                <option>Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Email Language</label>
              <select value={extraConfig.emailLanguage} onChange={(e) => updateExtraConfig("emailLanguage", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">Allow Employees to Set Their Own Language</span>
              <span className="text-[11px] text-[#9CA3AF]">Each employee can choose their preferred UI language</span>
            </div>
            <button
              onClick={() => updateExtraConfig("allowEmployeeLanguage", !extraConfig.allowEmployeeLanguage)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: extraConfig.allowEmployeeLanguage ? "#00B87C" : "#E5E7EB",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span style={{ position: "absolute", top: "2px", left: extraConfig.allowEmployeeLanguage ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
            </button>
          </div>
        </div>

        {/* POLICY BLOCK 2: DATE, TIME & NUMBERS */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">DATE, TIME & NUMBERS</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Date Format</label>
              <select value={appDateFormat} onChange={(e) => setAppDateFormat(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Time Format</label>
              <select value={extraConfig.timeFormat} onChange={(e) => updateExtraConfig("timeFormat", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>12-hour (AM/PM)</option>
                <option>24-hour</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Week Starts On</label>
              <select value={extraConfig.weekStartsOn} onChange={(e) => updateExtraConfig("weekStartsOn", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Monday</option>
                <option>Sunday</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Fiscal Year Start</label>
              <select value={extraConfig.fiscalYearStart} onChange={(e) => updateExtraConfig("fiscalYearStart", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>April 1</option>
                <option>January 1</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Number Format</label>
              <select value={extraConfig.numberFormat} onChange={(e) => updateExtraConfig("numberFormat", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>1,00,000 (Indian)</option>
                <option>100,000 (International)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Decimal Separator</label>
              <select value={extraConfig.decimalSeparator} onChange={(e) => updateExtraConfig("decimalSeparator", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Dot (1,000.00)</option>
                <option>Comma (1.000,00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* POLICY BLOCK 3: TIMEZONE & CURRENCY */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">TIMEZONE & CURRENCY</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Default Timezone</label>
              <select value={appTimezone} onChange={(e) => setAppTimezone(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option value="IST">Asia/Kolkata (IST UTC+5:30)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Currency Symbol</label>
              <select value={extraConfig.currencySymbol} onChange={(e) => updateExtraConfig("currencySymbol", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>₹ — Indian Rupee (INR)</option>
                <option>$ — US Dollar (USD)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Currency Position</label>
              <select value={extraConfig.currencyPosition} onChange={(e) => updateExtraConfig("currencyPosition", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Before Amount (₹1,00,000)</option>
                <option>After Amount (1,00,000 ₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Salary Display Format</label>
              <select value={extraConfig.salaryDisplayFormat} onChange={(e) => updateExtraConfig("salaryDisplayFormat", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>In Lakhs (₹12L)</option>
                <option>Full Amount (₹1,200,000)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">Show Currency Conversion for International Employees</span>
              <span className="text-[11px] text-[#9CA3AF]">Display equivalent amount in employee's local currency</span>
            </div>
            <button
              onClick={() => updateExtraConfig("showCurrencyConversion", !extraConfig.showCurrencyConversion)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: extraConfig.showCurrencyConversion ? "#00B87C" : "#E5E7EB",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span style={{ position: "absolute", top: "2px", left: extraConfig.showCurrencyConversion ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
            </button>
          </div>
        </div>

        {/* POLICY BLOCK 4: REGIONAL COMPLIANCE */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">REGIONAL COMPLIANCE</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option value="India">India</option>
                <option value="USA">USA</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">State / Province</label>
              <select value={extraConfig.state} onChange={(e) => updateExtraConfig("state", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Karnataka</option>
                <option>Maharashtra</option>
                <option>Tamil Nadu</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Applicable Labor Law</label>
              <input type="text" readOnly value={extraConfig.applicableLaborLaw} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-gray-100 dark:bg-neutral-800 text-gray-500" style={{ borderColor: "#E5E7EB" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Tax Regime</label>
              <select value={extraConfig.taxRegime} onChange={(e) => updateExtraConfig("taxRegime", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>New Tax Regime</option>
                <option>Old Tax Regime</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "applyLabourLaw", label: "Apply Indian Labour Law Rules" },
              { key: "pfEsiCompliance", label: "PF/ESI Compliance Auto-checks" },
              { key: "showRegionalHoliday", label: "Show Regional Holiday Calendar by Default" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
          <button onClick={() => showToast("Settings reset to default", "error")} style={{ backgroundColor: "transparent", color: "#9CA3AF", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Reset</button>
          <button onClick={() => showToast("Locale preferences saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
        </div>
      </div>
    );
  };

  const renderBackupRestore = () => {
    const backupHistory = [
      { date: "Today, Apr 6 — 3:00 AM", size: "2.4 GB", type: "Auto", status: "Success" },
      { date: "Apr 5, 3:00 AM", size: "2.3 GB", type: "Auto", status: "Success" },
      { date: "Apr 4, 3:00 AM", size: "2.3 GB", type: "Auto", status: "Success" },
      { date: "Apr 3, 11:42 AM", size: "2.2 GB", type: "Manual", status: "Success" },
      { date: "Apr 2, 3:00 AM", size: "2.1 GB", type: "Auto", status: "Failed" },
    ];

    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>System Preferences</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Backup & Restore</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Backup & Restore</h2>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>Protect your data with automated backups</p>
          </div>
          <button onClick={() => showToast("Backup process initiated")} className="flex items-center gap-2" style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            <CloudUpload size={16} />
            Run Backup Now
          </button>
        </div>

        {/* POLICY BLOCK 1: BACKUP STATUS */}
        <div className="p-5 rounded-xl mb-6 border flex justify-between items-center" style={{ backgroundColor: "#F0FDF4", borderColor: "rgba(0,184,124,0.2)" }}>
          <div className="flex items-center gap-4 flex-1 justify-center border-r border-gray-200 pr-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DCFCE7] text-[#00B87C]">
              <CheckCircle size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase">LAST BACKUP</span>
              <span className="block text-[16px] font-bold text-[#111827]">Today, 3:00 AM</span>
              <span className="inline-block text-[10px] bg-[#DCFCE7] text-[#00B87C] font-bold px-2 py-0.5 rounded-full mt-1">Successful</span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-center border-r border-gray-200 px-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DCFCE7] text-[#00B87C]">
              <Database size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase">BACKUP SIZE</span>
              <span className="block text-[16px] font-bold text-[#111827]">2.4 GB</span>
              <span className="inline-block text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full mt-1">Compressed</span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-center pl-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#DCFCE7] text-[#00B87C]">
              <RefreshCw size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase">NEXT SCHEDULED</span>
              <span className="block text-[16px] font-bold text-[#111827]">Tomorrow, 3:00 AM</span>
              <span className="inline-block text-[10px] bg-[#FEF3C7] text-[#D97706] font-bold px-2 py-0.5 rounded-full mt-1">Scheduled</span>
            </div>
          </div>
        </div>

        {/* POLICY BLOCK 2: BACKUP SETTINGS */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">BACKUP SETTINGS</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Backup Frequency</label>
              <select value={extraConfig.backupFrequency} onChange={(e) => updateExtraConfig("backupFrequency", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Manual</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Backup Time</label>
              <input type="time" value={extraConfig.backupTime} onChange={(e) => updateExtraConfig("backupTime", e.target.value)} className="w-full rounded-xl px-3 py-2 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Retention Period (days)</label>
              <input type="number" value={extraConfig.retentionPeriod} onChange={(e) => updateExtraConfig("retentionPeriod", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Storage Location</label>
              <select value={extraConfig.storageLocation} onChange={(e) => updateExtraConfig("storageLocation", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Google Drive</option>
                <option>AWS S3</option>
                <option>Azure</option>
                <option>Local</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Max Backup Copies</label>
              <input type="number" value={extraConfig.maxBackupCopies} onChange={(e) => updateExtraConfig("maxBackupCopies", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Encryption</label>
              <select value={extraConfig.encryption} onChange={(e) => updateExtraConfig("encryption", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>AES-256</option>
                <option>None</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "includeDocsInBackup", label: "Include Attached Documents in Backup" },
              { key: "compressBackup", label: "Compress Backup Files" },
              { key: "sendBackupReport", label: "Send Backup Report via Email" }
            ].map((item) => (
              <div key={item.key}>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                  <button
                    onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                    style={{
                      width: "36px",
                      height: "20px",
                      borderRadius: "20px",
                      backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                  </button>
                </div>
                {item.key === "sendBackupReport" && extraConfig.sendBackupReport && (
                  <input 
                    type="email" 
                    value={extraConfig.backupReportEmail} 
                    onChange={(e) => updateExtraConfig("backupReportEmail", e.target.value)}
                    className="mt-2 rounded-xl px-3 py-2 text-sm border w-full md:w-64 bg-white dark:bg-neutral-800" 
                    style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 3: BACKUP HISTORY */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">BACKUP HISTORY</span>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  {["BACKUP DATE", "SIZE", "TYPE", "STATUS", "ACTION"].map((h) => (
                    <th key={h} className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {backupHistory.map((b, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-[#F0FDF4] transition-all text-[13px]">
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{b.date}</td>
                    <td className="py-3 px-4 text-gray-600">{b.size}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${b.type === "Auto" ? "bg-[#DCFCE7] text-[#00B87C]" : "bg-purple-100 text-purple-700"}`}>{b.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${b.status === "Success" ? "bg-[#DCFCE7] text-[#00B87C]" : "bg-red-100 text-red-700"}`}>{b.status}</span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      {b.status === "Success" ? (
                        <>
                          <button className="px-2 py-1 text-[11px] font-bold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">Download</button>
                          <button className="px-2 py-1 text-[11px] font-bold border border-[#D97706] rounded-lg text-[#D97706] bg-white hover:bg-amber-50 cursor-pointer">Restore</button>
                        </>
                      ) : (
                        <button className="px-2 py-1 text-[11px] font-bold border border-red-500 rounded-lg text-red-500 bg-white hover:bg-red-50 cursor-pointer">Retry</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* POLICY BLOCK 4: RESTORE */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-[#D97706]" size={24} />
            <span className="text-[13px] font-bold text-[#92400E]">Restoring will overwrite current data. This action cannot be undone.</span>
          </div>
          <button className="w-full py-3 border border-[#E5E7EB] bg-white hover:bg-gray-50 rounded-xl text-[13px] text-gray-700 font-semibold flex items-center justify-center gap-2 cursor-pointer">
            <Upload size={16} />
            Upload backup file (.zip or .sql)
          </button>
        </div>

        <div className="flex justify-end items-center pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
          <button onClick={() => showToast("Backup settings saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>
      </div>
    );
  };

  const renderDataImportExport = () => {
    const [activeTab, setActiveTab] = useState("import");
    const [selectedType, setSelectedType] = useState("employees");

    const importHistory = [
      { name: "employees_march.xlsx", type: "Employees", records: "142 added, 3 failed", status: "Success", by: "Ryan Park", date: "Apr 1, 2026" },
      { name: "attendance_q1.csv", type: "Attendance", records: "4,860 records", status: "Success", by: "Meera Thomas", date: "Mar 31" },
      { name: "leave_balances.xlsx", type: "Leave", records: "248 updated", status: "Success", by: "Ryan Park", date: "Apr 1" },
      { name: "payroll_feb.csv", type: "Payroll", records: "12 errors", status: "Failed", by: "Suresh Iyer", date: "Mar 5" },
    ];

    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>System Preferences</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Data Import / Export</span>
        </div>

        <div className="mb-6">
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Data Import / Export</h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>Bulk manage employee and HR data</p>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {[
            { id: "import", label: "Import Data" },
            { id: "export", label: "Export Data" },
            { id: "import_history", label: "Import History" },
            { id: "export_history", label: "Export History" }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="pb-3 font-bold text-[13px] border-b-2 bg-transparent cursor-pointer transition-all"
                style={{ 
                  borderColor: active ? "#00B87C" : "transparent", 
                  color: active ? "#00B87C" : "#6B7280"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "import" && (
          <div>
            {/* POLICY BLOCK 1: SELECT DATA TYPE */}
            <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">SELECT DATA TYPE</span>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { id: "employees", label: "Employees", desc: "Bulk add or update", icon: UserPlus },
                { id: "attendance", label: "Attendance", desc: "Upload records", icon: ClipboardCheck },
                { id: "payroll", label: "Payroll", desc: "Salary & deduction", icon: IndianRupee },
                { id: "leave", label: "Leave Balances", desc: "Opening balances", icon: TreePalm },
              ].map((t) => {
                const selected = selectedType === t.id;
                const Icon = t.icon;
                return (
                  <div 
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className="p-4 rounded-xl border cursor-pointer relative transition-all hover:shadow-md text-center flex flex-col items-center"
                    style={{ 
                      backgroundColor: selected ? "#DCFCE7" : "var(--card)", 
                      borderColor: selected ? "#00B87C" : "#E5E7EB",
                      borderWidth: selected ? "2px" : "1px"
                    }}
                  >
                    {selected && <CheckCircle size={16} className="text-[#00B87C] absolute top-2 right-2" />}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(0,184,124,0.1)] mb-2 text-[#00B87C]">
                      <Icon size={20} />
                    </div>
                    <span className="block font-bold text-[13px] text-[#111827]">{t.label}</span>
                    <span className="block text-[11px] text-[#9CA3AF] mt-1">{t.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* POLICY BLOCK 2: UPLOAD FILE */}
            <div className="p-6 rounded-xl border-2 border-dashed text-center mb-6" style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}>
              <CloudUpload size={32} className="text-[#00B87C] mx-auto mb-2" />
              <span className="block font-bold text-[14px] text-[#374151]">Drag & drop your CSV or Excel file here</span>
              <span className="text-[13px] text-[#00B87C] cursor-pointer font-medium">or Browse</span>
              <span className="block text-[12px] text-[#9CA3AF] mt-2">Accepted formats: .CSV, .XLSX — max 10MB</span>
            </div>

            {/* POLICY BLOCK 3: IMPORT OPTIONS */}
            <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
              <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">IMPORT OPTIONS</span>
              <div className="space-y-3 mb-4">
                {[
                  { key: "importSkipDuplicates", label: "Skip Duplicate Records", desc: "Existing records with same ID will be ignored" },
                  { key: "importUpdateExisting", label: "Update Existing Records", desc: "Overwrite matching records with new data" },
                  { key: "importSendWelcome", label: "Send Welcome Email to New Employees", desc: "" },
                  { key: "importValidate", label: "Validate Before Import (Dry Run)", desc: "Preview errors without making changes" }
                ].map((item) => (
                  <div key={item.key} className="flex justify-between items-center">
                    <div>
                      <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                      {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                    </div>
                    <button
                      onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                      style={{
                        width: "36px",
                        height: "20px",
                        borderRadius: "20px",
                        backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                        position: "relative",
                        transition: "all 0.2s",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[#00B87C] font-medium cursor-pointer">
                <Download size={16} />
                Download Sample Template
              </div>
            </div>

            <button onClick={() => showToast("Import started")} className="w-full py-3 border-none bg-[#00B87C] text-white font-bold rounded-xl cursor-pointer">Start Import</button>
          </div>
        )}

        {activeTab === "export" && (
          <div>
            {/* POLICY BLOCK 1: SELECT DATA TO EXPORT */}
            <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
              <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">SELECT DATA TO EXPORT</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "exportEmployeeData", label: "Employee Master Data" },
                  { key: "exportAttendance", label: "Attendance Records" },
                  { key: "exportLeave", label: "Leave Records" },
                  { key: "exportPayroll", label: "Payroll Data" },
                  { key: "exportPerformance", label: "Performance Reviews" },
                  { key: "exportDocs", label: "Documents & Attachments" },
                  { key: "exportAuditLogs", label: "Audit Logs" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={extraConfig[item.key as keyof typeof extraConfig] as boolean} 
                      onChange={(e) => updateExtraConfig(item.key, e.target.checked)}
                      className="w-4 h-4 rounded text-[#00B87C] focus:ring-[#00B87C] border-gray-300"
                    />
                    <span className="text-[13px] text-gray-800 dark:text-gray-200">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* POLICY BLOCK 2: EXPORT SETTINGS */}
            <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
              <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">EXPORT SETTINGS</span>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Export Format</label>
                  <select value={extraConfig.exportFormat} onChange={(e) => updateExtraConfig("exportFormat", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                    <option>Excel (.xlsx)</option>
                    <option>CSV (.csv)</option>
                    <option>PDF (.pdf)</option>
                    <option>JSON (.json)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Date Range</label>
                  <input type="text" value={extraConfig.exportDateRange} onChange={(e) => updateExtraConfig("exportDateRange", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Department Filter</label>
                  <select value={extraConfig.exportDeptFilter} onChange={(e) => updateExtraConfig("exportDeptFilter", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                    <option>All Departments</option>
                    <option>Engineering</option>
                    <option>HR</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">Include Inactive Employees</span>
                  </div>
                  <button
                    onClick={() => updateExtraConfig("exportIncludeInactive", !extraConfig.exportIncludeInactive)}
                    style={{
                      width: "36px",
                      height: "20px",
                      borderRadius: "20px",
                      backgroundColor: extraConfig.exportIncludeInactive ? "#00B87C" : "#E5E7EB",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    <span style={{ position: "absolute", top: "2px", left: extraConfig.exportIncludeInactive ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                  </button>
                </div>
              </div>
              <button onClick={() => showToast("Export initiated")} className="w-full py-3 border-none bg-[#00B87C] text-white font-bold rounded-xl cursor-pointer">Export Now</button>
            </div>
          </div>
        )}

        {activeTab === "import_history" && (
          <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
            <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">IMPORT HISTORY</span>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["FILE NAME", "DATA TYPE", "RECORDS", "STATUS", "IMPORTED BY", "DATE"].map((h) => (
                      <th key={h} className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importHistory.map((h, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-[#F0FDF4] transition-all text-[13px]">
                      <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{h.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${h.type === "Employees" ? "bg-[#DCFCE7] text-[#00B87C]" : h.type === "Attendance" ? "bg-teal-100 text-teal-700" : h.type === "Leave" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"}`}>{h.type}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {h.records}
                        {h.status === "Failed" && <span className="text-red-500 cursor-pointer ml-2 underline flex items-center gap-1"><Eye size={12} />View Errors</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${h.status === "Success" ? "bg-[#DCFCE7] text-[#00B87C]" : "bg-red-100 text-red-700"}`}>{h.status}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{h.by}</td>
                      <td className="py-3 px-4 text-gray-600">{h.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderApprovalWorkflows = () => {
    const workflows = [
      { name: "Leave Approval", desc: "When leave is requested", trigger: "leave.applied", steps: "3 steps", applies: "All Employees", status: "Active", color: "#00B87C" },
      { name: "Expense Reimbursement", desc: "When expense is submitted", trigger: "expense.submitted", steps: "2 steps", applies: "All Employees", status: "Active", color: "#F59E0B" },
      { name: "Payroll Approval", desc: "Before payroll is processed", trigger: "payroll.pre-run", steps: "3 steps", applies: "Finance + HR", status: "Active", color: "#8B5CF6" },
      { name: "Increment Approval", desc: "When increment is proposed", trigger: "increment.proposed", steps: "4 steps", applies: "Managers", status: "Active", color: "#F59E0B" },
      { name: "Offboarding Checklist", desc: "When resignation is submitted", trigger: "employee.resigned", steps: "5 steps", applies: "HR + IT + Finance", status: "Active", color: "#EF4444" },
    ];

    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>Workflow Automation</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Approval Workflows</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Approval Workflows</h2>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>Configure multi-step approval chains for HR processes</p>
          </div>
          <button onClick={() => setActiveModal("create_workflow")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>+ Create Workflow</button>
        </div>

        {/* SECTION: ACTIVE WORKFLOWS */}
        <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">ACTIVE WORKFLOWS</span>
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  {["WORKFLOW NAME", "TRIGGER", "STEPS", "APPLIES TO", "STATUS", "ACTION"].map((h) => (
                    <th key={h} className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workflows.map((w, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-[#F0FDF4] transition-all text-[13px]">
                    <td className="py-3 px-4">
                      <span className="block font-bold text-gray-800 dark:text-gray-200">{w.name}</span>
                      <span className="text-[11px] text-[#9CA3AF]">{w.desc}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${w.color}20`, color: w.color }}>{w.trigger}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">{w.steps}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{w.applies}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C]">{w.status}</span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button className="px-2 py-1 text-[11px] font-bold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION: WORKFLOW BUILDER PREVIEW */}
        <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">WORKFLOW BUILDER PREVIEW</span>
        <div className="p-6 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between gap-4 overflow-x-auto py-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-4 relative bg-white dark:bg-neutral-900" style={{ borderColor: "#E5E7EB" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#00B87C] font-bold text-xs mb-2">1</div>
              <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase">Employee</span>
              <span className="block font-bold text-[13px] text-[#111827] mt-1">Submits Request</span>
              <span className="inline-block text-[10px] bg-[#DCFCE7] text-[#00B87C] font-bold px-2 py-0.5 rounded-full mt-2">Trigger</span>
            </div>

            <div className="flex items-center flex-1 min-w-[30px] justify-center">
              <div className="h-[2px] bg-[#00B87C] flex-1" />
              <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-4 relative bg-white dark:bg-neutral-900" style={{ borderColor: "#E5E7EB" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#00B87C] font-bold text-xs mb-2">2</div>
              <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase">Direct Manager</span>
              <span className="block font-bold text-[13px] text-[#111827] mt-1">Reviews & Approves</span>
              <span className="block text-[10px] text-[#9CA3AF] mt-1">Within 2 days</span>
              <span className="inline-block text-[10px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full mt-2">Level 1</span>
            </div>

            <div className="flex items-center flex-1 min-w-[30px] justify-center">
              <div className="h-[2px] bg-[#00B87C] flex-1" />
              <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-4 relative bg-white dark:bg-neutral-900" style={{ borderColor: "#E5E7EB" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#00B87C] font-bold text-xs mb-2">3</div>
              <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase">HR Manager</span>
              <span className="block font-bold text-[13px] text-[#111827] mt-1">Final Approval</span>
              <span className="block text-[10px] text-[#9CA3AF] mt-1">Within 1 day</span>
              <span className="inline-block text-[10px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full mt-2">Level 2</span>
            </div>

            <div className="flex items-center flex-1 min-w-[30px] justify-center">
              <div className="h-[2px] bg-[#00B87C] flex-1" />
              <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-4 relative bg-white dark:bg-neutral-900" style={{ borderColor: "#E5E7EB" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#00B87C] text-white font-bold text-xs mb-2">✓</div>
              <span className="block text-[10px] font-bold text-[#9CA3AF] uppercase">Employee</span>
              <span className="block font-bold text-[13px] text-[#111827] mt-1">Notified</span>
              <span className="block text-[10px] text-[#9CA3AF] mt-1">Email + Push</span>
              <span className="inline-block text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full mt-2">Auto</span>
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <button className="px-4 py-2 text-[12px] font-bold border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">Edit Workflow</button>
            <span className="text-[12px] text-[#00B87C] cursor-pointer font-bold">+ Add Step</span>
          </div>
        </div>

        {/* POLICY BLOCK: GLOBAL WORKFLOW RULES */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">GLOBAL WORKFLOW RULES</span>
          <div className="space-y-3">
            {[
              { key: "workflowAutoEscalate", label: "Auto-escalate if not approved within deadline", desc: "Moves to next level if approver is inactive for set duration" },
              { key: "workflowReminder", label: "Send reminder before deadline expires", desc: "" },
              { key: "workflowDelegation", label: "Allow Delegation of Approval", desc: "Approvers can temporarily delegate to another manager" },
              { key: "workflowParallel", label: "Parallel Approvals (all approvers simultaneously)", desc: "All approvers notified at once instead of sequentially" },
              { key: "workflowCcHr", label: "CC HR on all approval decisions", desc: "" }
            ].map((item) => (
              <div key={item.key}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                    {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                  </div>
                  <button
                    onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                    style={{
                      width: "36px",
                      height: "20px",
                      borderRadius: "20px",
                      backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                  </button>
                </div>
                {item.key === "workflowReminder" && extraConfig.workflowReminder && (
                  <input 
                    type="text" 
                    value={extraConfig.workflowReminderTime} 
                    onChange={(e) => updateExtraConfig("workflowReminderTime", e.target.value)}
                    className="mt-2 rounded-xl px-3 py-2 text-sm border w-full md:w-64 bg-white dark:bg-neutral-800" 
                    style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end items-center pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
          <button onClick={() => showToast("Workflow policies saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>
      </div>
    );
  };

  const renderLeaveApprovals = () => {
    const leaveRules = [
      { type: "Casual Leave", levels: "1 — Manager", max: "1 day", deadline: "2 days", escalation: "HR after 2 days" },
      { type: "Earned Leave", levels: "2 — Mgr + HR", max: "None", deadline: "3 days", escalation: "Skip to HR" },
      { type: "Sick Leave", levels: "1 — Manager", max: "3 days", deadline: "1 day", escalation: "Auto-approve" },
      { type: "Maternity", levels: "2 — Mgr + HR", max: "None", deadline: "5 days", escalation: "MD escalation" },
      { type: "Comp Off", levels: "1 — Manager", max: "2 days", deadline: "1 day", escalation: "Auto-approve" },
    ];

    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>Workflow Automation</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Leave Approvals</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Leave Approvals</h2>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>Configure leave approval workflow and escalation rules</p>
          </div>
          <button onClick={() => showToast("Leave approval policies saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>

        {/* POLICY BLOCK 1: APPROVAL CHAIN */}
        <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">APPROVAL CHAIN</span>
        <div className="p-6 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between overflow-x-auto py-2">
            <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
              <span className="block text-[12px] font-bold text-gray-800">Employee</span>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <div className="h-[2px] bg-[#00B87C] flex-1" />
              <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
            </div>
            <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
              <span className="block text-[12px] font-bold text-gray-800">Direct Manager</span>
            </div>
            <div className="flex items-center flex-1 justify-center relative">
              <div className="h-[2px] border-t-2 border-dashed border-[#F59E0B] flex-1" />
              <span className="absolute -top-3 text-[9px] bg-[#FEF3C7] text-[#D97706] font-bold px-1.5 py-0.5 rounded">If &gt; 5 days</span>
              <ChevronRight className="text-[#F59E0B]" size={16} style={{ marginLeft: "-10px" }} />
            </div>
            <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
              <span className="block text-[12px] font-bold text-gray-800">HR Manager</span>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <div className="h-[2px] bg-[#00B87C] flex-1" />
              <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
            </div>
            <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
              <span className="block text-[12px] font-bold text-gray-800">Notified</span>
            </div>
          </div>
        </div>

        {/* POLICY BLOCK 2: APPROVAL RULES BY LEAVE TYPE */}
        <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">APPROVAL RULES BY LEAVE TYPE</span>
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  {["LEAVE TYPE", "APPROVER LEVELS", "MAX AUTO-APPROVE", "DEADLINE", "ESCALATION", "ACTION"].map((h) => (
                    <th key={h} className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaveRules.map((r, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-[#F0FDF4] transition-all text-[13px]">
                    <td className="py-3 px-4 font-medium">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${idx===0?'bg-[#DCFCE7] text-[#00B87C]':idx===1?'bg-teal-100 text-teal-700':idx===2?'bg-red-100 text-red-700':idx===3?'bg-purple-100 text-purple-700':'bg-amber-100 text-amber-700'}`}>{r.type}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-800">{r.levels}</td>
                    <td className="py-3 px-4 text-gray-600">{r.max}</td>
                    <td className="py-3 px-4 text-gray-600">{r.deadline}</td>
                    <td className="py-3 px-4 text-gray-600">{r.escalation}</td>
                    <td className="py-3 px-4">
                      <button className="px-2 py-1 text-[11px] font-bold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* POLICY BLOCK 3: AUTO-APPROVAL RULES */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">AUTO-APPROVAL RULES</span>
          <div className="space-y-3">
            {[
              { key: "leaveAutoApproveShort", label: "Enable Auto-Approval for Short Leaves (1 day)", desc: "Single-day leaves approved automatically if balance available" },
              { key: "leaveAutoApproveMgrOnLeave", label: "Auto-approve if Manager is On Leave", desc: "Escalates to next level or auto-approves based on type" },
              { key: "leaveBlockCritical", label: "Block Leave During Critical Periods", desc: "HR can lock leave requests during quarter-end / appraisals" },
              { key: "leaveAllowRetroactive", label: "Allow Retroactive Leave Application", desc: "Employees cannot apply leave for dates already passed" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 4: NOTIFICATION SETTINGS */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">NOTIFICATION SETTINGS</span>
          <div className="space-y-3">
            {[
              { key: "leaveNotifyMgr", label: "Notify Manager Immediately on Application" },
              { key: "leaveNotifyEmp", label: "Notify Employee on Every Status Change" },
              { key: "leaveDigest", label: "Send Daily Digest of Pending Approvals" }
            ].map((item) => (
              <div key={item.key}>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                  <button
                    onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                    style={{
                      width: "36px",
                      height: "20px",
                      borderRadius: "20px",
                      backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                  </button>
                </div>
                {item.key === "leaveDigest" && extraConfig.leaveDigest && (
                  <div className="mt-2">
                    <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1">Digest Time</label>
                    <select value={extraConfig.leaveDigestTime} onChange={(e) => updateExtraConfig("leaveDigestTime", e.target.value)} className="rounded-xl px-3 py-1.5 text-xs border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                      <option>9:00 AM</option>
                      <option>5:00 PM</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">Escalation Reminder After (hours)</span>
              <input 
                type="number" 
                value={extraConfig.leaveEscalationHours} 
                onChange={(e) => updateExtraConfig("leaveEscalationHours", e.target.value)}
                className="rounded-xl px-3 py-2 text-sm border w-24 text-center bg-white dark:bg-neutral-800" 
                style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
          <button onClick={() => showToast("Leave policies saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>
      </div>
    );
  };

  const renderShiftSwapRules = () => {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>Workflow Automation</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Shift Swap Rules</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Shift Swap Rules</h2>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>Define rules and approval flow for employee shift swaps</p>
          </div>
          <button onClick={() => showToast("Shift swap rules saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Rules</button>
        </div>

        {/* POLICY BLOCK 1: SWAP ELIGIBILITY */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">SWAP ELIGIBILITY</span>
          <div className="space-y-3">
            {[
              { key: "swapAllow", label: "Allow Shift Swaps Between Employees", desc: "Employees can request to exchange shifts with colleagues" },
              { key: "swapSameDept", label: "Restrict Swaps to Same Department Only", desc: "Employees can only swap with same-department colleagues" },
              { key: "swapSameShift", label: "Restrict Swaps to Same Shift Type Only", desc: "Morning can only swap with Morning, etc." },
              { key: "swapCrossLoc", label: "Allow Swaps Across Locations", desc: "Employees from different offices can swap shifts" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">Minimum Notice Period for Swap (hours)</span>
              <input 
                type="number" 
                value={extraConfig.swapMinNotice} 
                onChange={(e) => updateExtraConfig("swapMinNotice", e.target.value)}
                className="rounded-xl px-3 py-2 text-sm border w-24 text-center bg-white dark:bg-neutral-800" 
                style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
              />
            </div>
          </div>
        </div>

        {/* POLICY BLOCK 2: APPROVAL WORKFLOW */}
        <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">APPROVAL WORKFLOW</span>
        <div className="p-6 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <div className="flex items-center justify-between overflow-x-auto py-2 mb-4">
            <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
              <span className="block text-[11px] font-bold text-[#9CA3AF]">Employee A</span>
              <span className="block text-[12px] font-bold text-gray-800 mt-1">Initiates Swap</span>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <div className="h-[2px] bg-[#00B87C] flex-1" />
              <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
            </div>
            <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
              <span className="block text-[11px] font-bold text-[#9CA3AF]">Employee B</span>
              <span className="block text-[12px] font-bold text-gray-800 mt-1">Accepts/Declines</span>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <div className="h-[2px] bg-[#00B87C] flex-1" />
              <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
            </div>
            <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
              <span className="block text-[11px] font-bold text-[#9CA3AF]">Direct Manager</span>
              <span className="block text-[12px] font-bold text-gray-800 mt-1">Final Approval</span>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <div className="h-[2px] bg-[#00B87C] flex-1" />
              <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
            </div>
            <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
              <span className="block text-[12px] font-bold text-gray-800">✓ Updated</span>
              <span className="block text-[10px] text-[#9CA3AF]">Both notified</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">Skip Manager Approval for Same-Day Swaps</span>
            <button
              onClick={() => updateExtraConfig("swapSkipMgrSameDay", !extraConfig.swapSkipMgrSameDay)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: extraConfig.swapSkipMgrSameDay ? "#00B87C" : "#E5E7EB",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span style={{ position: "absolute", top: "2px", left: extraConfig.swapSkipMgrSameDay ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
            </button>
          </div>
        </div>

        {/* POLICY BLOCK 3: SWAP LIMITS */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">SWAP LIMITS</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Max Swaps per Employee per Month</label>
              <input type="number" value={extraConfig.swapMaxPerMonth} onChange={(e) => updateExtraConfig("swapMaxPerMonth", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Swap Request Expiry (hours)</label>
              <input type="number" value={extraConfig.swapExpiryHours} onChange={(e) => updateExtraConfig("swapExpiryHours", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
              <span className="text-[10px] text-[#9CA3AF]">If Employee B does not respond, request expires</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Manager Approval Deadline (hours)</label>
              <input type="number" value={extraConfig.swapMgrDeadlineHours} onChange={(e) => updateExtraConfig("swapMgrDeadlineHours", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Max Advance Booking (days)</label>
              <input type="number" value={extraConfig.swapMaxAdvanceDays} onChange={(e) => updateExtraConfig("swapMaxAdvanceDays", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "swapEnforceLimit", label: "Enforce Monthly Swap Limit" },
              { key: "swapAutoDecline", label: "Auto-decline Expired Requests" },
              { key: "swapAllowCancel", label: "Allow Cancellation After Approval", desc: "Once both parties and manager approve, swap is locked" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 4: OT & COMPLIANCE CHECKS */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">OT & COMPLIANCE CHECKS</span>
          <div className="space-y-3">
            {[
              { key: "swapBlockOtViolation", label: "Block Swap if it Causes Overtime Violation", desc: "Prevent swaps that push employee over weekly OT limit" },
              { key: "swapBlockRestViolation", label: "Block Swap if Rest Period < 8 Hours", desc: "Enforce minimum rest between back-to-back shifts" },
              { key: "swapAutoCalcOt", label: "Auto-calculate OT Impact Before Approval", desc: "Show OT impact to manager during approval" },
              { key: "swapNotifyCompliance", label: "Notify HR if Swap Causes Compliance Issue", desc: "" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 5: NOTIFICATIONS */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">NOTIFICATIONS</span>
          <div className="space-y-3">
            {[
              { key: "swapNotifyB", label: "Notify Employee B Immediately on Swap Request" },
              { key: "swapNotifyMgr", label: "Notify Manager on Employee Acceptance" },
              { key: "swapSmsConfirmation", label: "Send Confirmation SMS After Approval" },
              { key: "swapRealTimeCalendar", label: "Update Shift Calendar in Real-time" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
          <button onClick={() => showToast("Settings reset to default", "error")} style={{ backgroundColor: "transparent", color: "#9CA3AF", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Reset to Defaults</button>
          <button onClick={() => showToast("Shift swap rules saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Rules</button>
        </div>
      </div>
    );
  };

  const renderDocumentSettings = () => {
    const categories = [
      { name: "Identity Documents", desc: "Aadhar, PAN, Passport", req: "3 required", expiry: "30 days before" },
      { name: "Employment Documents", desc: "Offer letter, NDA, Contract", req: "2 required", expiry: "No expiry" },
      { name: "Educational Certificates", desc: "Degree, Transcripts", req: "1 required", expiry: "No expiry" },
      { name: "Professional Certifications", desc: "AWS, PMP, CFA etc.", req: "Optional", expiry: "60 days before" },
      { name: "Medical Records", desc: "Insurance, fitness certificate", req: "Optional", expiry: "30 days before" },
      { name: "Bank Documents", desc: "Cancelled cheque, passbook", req: "1 required", expiry: "No expiry" },
    ];

    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>Module Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Document Settings</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Document Settings</h2>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>Configure document storage, access and expiry rules</p>
          </div>
          <button onClick={() => showToast("Document settings saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>

        {/* POLICY BLOCK 1: STORAGE CONFIGURATION */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">STORAGE CONFIGURATION</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Storage Provider</label>
              <select value={extraConfig.docStorageProvider} onChange={(e) => updateExtraConfig("docStorageProvider", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>AWS S3</option>
                <option>Google Drive</option>
                <option>Azure Blob</option>
                <option>Local</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Max File Size (MB)</label>
              <input type="number" value={extraConfig.docMaxFileSize} onChange={(e) => updateExtraConfig("docMaxFileSize", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Total Storage Quota (GB)</label>
              <input type="number" value={extraConfig.docTotalQuota} onChange={(e) => updateExtraConfig("docTotalQuota", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Accepted File Types</label>
              <input type="text" value={extraConfig.docAcceptedTypes} onChange={(e) => updateExtraConfig("docAcceptedTypes", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-[12px] text-gray-600 mb-1">
              <span>Storage Used</span>
              <span className="font-bold">142 GB of 500 GB</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#00B87C]" style={{ width: "28.4%" }} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">Backup to Secondary Storage</span>
            <button
              onClick={() => updateExtraConfig("docBackupSecondary", !extraConfig.docBackupSecondary)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: extraConfig.docBackupSecondary ? "#00B87C" : "#E5E7EB",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span style={{ position: "absolute", top: "2px", left: extraConfig.docBackupSecondary ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
            </button>
          </div>
        </div>

        {/* POLICY BLOCK 2: DOCUMENT CATEGORIES */}
        <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">DOCUMENT CATEGORIES</span>
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  {["CATEGORY", "DESCRIPTION", "REQUIRED DOCS", "EXPIRY ALERT", "ACTION"].map((h) => (
                    <th key={h} className="py-3 px-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((c, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-[#F0FDF4] transition-all text-[13px]">
                    <td className="py-3 px-4 font-bold text-gray-800 dark:text-gray-200">{c.name}</td>
                    <td className="py-3 px-4 text-gray-600">{c.desc}</td>
                    <td className="py-3 px-4 text-gray-600">{c.req}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${c.expiry==='No expiry'?'bg-[#DCFCE7] text-[#00B87C]':'bg-amber-100 text-amber-700'}`}>{c.expiry}</span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button className="px-2 py-1 text-[11px] font-bold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-[13px] text-[#00B87C] font-bold cursor-pointer">+ Add Category</div>
        </div>

        {/* POLICY BLOCK 3: ACCESS & PERMISSIONS */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">ACCESS & PERMISSIONS</span>
          <div className="space-y-3">
            {[
              { key: "docEmpUpload", label: "Employees Can Upload Their Own Documents" },
              { key: "docRequireHrVerify", label: "Documents Require HR Verification", desc: "Uploaded docs are marked pending until HR reviews them" },
              { key: "docExpiryTracking", label: "Enable Document Expiry Tracking" },
              { key: "docEmpDownload", label: "Allow Document Download by Employee" },
              { key: "docWatermark", label: "Watermark Downloaded Documents", desc: "Add employee name and date watermark on downloaded files" },
              { key: "docAutoDeleteRejected", label: "Auto-Delete Rejected Documents" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 4: EXPIRY NOTIFICATIONS */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">EXPIRY NOTIFICATIONS</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">First Alert (days before)</label>
              <input type="number" value={extraConfig.docExpiryAlert1} onChange={(e) => updateExtraConfig("docExpiryAlert1", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Second Alert (days before)</label>
              <input type="number" value={extraConfig.docExpiryAlert2} onChange={(e) => updateExtraConfig("docExpiryAlert2", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Final Alert (days before)</label>
              <input type="number" value={extraConfig.docExpiryAlert3} onChange={(e) => updateExtraConfig("docExpiryAlert3", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Notify</label>
              <select value={extraConfig.docExpiryNotify} onChange={(e) => updateExtraConfig("docExpiryNotify", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Employee + HR Manager</option>
                <option>Employee Only</option>
                <option>HR Manager Only</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "docBlockCriticalExpired", label: "Block Employee Actions if Critical Doc Expired" },
              { key: "docAutoNotifyRejection", label: "Auto-notify on Document Rejection" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end items-center pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
          <button onClick={() => showToast("Document settings saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>
      </div>
    );
  };

  const renderTrainingSettings = () => {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>Module Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Training Settings</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: 0 }}>Training Settings</h2>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>Configure the LMS, course access and completion rules</p>
          </div>
          <button onClick={() => showToast("Training settings saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>

        {/* POLICY BLOCK 1: LMS CONFIGURATION */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">LMS CONFIGURATION</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">LMS Mode</label>
              <select value={extraConfig.lmsMode} onChange={(e) => updateExtraConfig("lmsMode", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Internal (Built-in)</option>
                <option>External LMS</option>
                <option>Both</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">External LMS URL</label>
              <input 
                type="url" 
                value={extraConfig.lmsExternalUrl} 
                onChange={(e) => updateExtraConfig("lmsExternalUrl", e.target.value)} 
                disabled={extraConfig.lmsMode === "Internal (Built-in)"}
                className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800 disabled:bg-gray-100 disabled:text-gray-400" 
                style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Default Course Language</label>
              <select value={extraConfig.lmsDefaultLanguage} onChange={(e) => updateExtraConfig("lmsDefaultLanguage", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Video Hosting</label>
              <select value={extraConfig.lmsVideoHosting} onChange={(e) => updateExtraConfig("lmsVideoHosting", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Internal Storage</option>
                <option>YouTube</option>
                <option>Vimeo</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Certificate Provider</label>
              <select value={extraConfig.lmsCertificateProvider} onChange={(e) => updateExtraConfig("lmsCertificateProvider", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>NexusHR</option>
                <option>External</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Max Video Size (MB)</label>
              <input type="number" value={extraConfig.lmsMaxVideoSize} onChange={(e) => updateExtraConfig("lmsMaxVideoSize", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
          </div>
        </div>

        {/* POLICY BLOCK 2: MANDATORY TRAINING RULES */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">MANDATORY TRAINING RULES</span>
          <div className="space-y-3">
            {[
              { key: "lmsMandatoryEnabled", label: "Enable Mandatory Training Module", desc: "Set required courses that all or specific employees must complete" },
              { key: "lmsBlockAccess", label: "Block System Access Until Mandatory Training Done", desc: "New employees cannot use EMS until onboarding training is complete" },
              { key: "lmsAutoAssign", label: "Auto-assign Role-based Training on Joining", desc: "New employees automatically enrolled in role-specific courses" },
              { key: "lmsSetDeadline", label: "Set Training Completion Deadline", desc: "" }
            ].map((item) => (
              <div key={item.key}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                    {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                  </div>
                  <button
                    onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                    style={{
                      width: "36px",
                      height: "20px",
                      borderRadius: "20px",
                      backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                  </button>
                </div>
                {item.key === "lmsSetDeadline" && extraConfig.lmsSetDeadline && (
                  <input 
                    type="text" 
                    value={extraConfig.lmsDeadlineDays} 
                    onChange={(e) => updateExtraConfig("lmsDeadlineDays", e.target.value)}
                    className="mt-2 rounded-xl px-3 py-2 text-sm border w-full md:w-64 bg-white dark:bg-neutral-800" 
                    style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 3: COMPLETION & CERTIFICATION */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">COMPLETION & CERTIFICATION</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Passing Score (%)</label>
              <input type="number" value={extraConfig.lmsPassingScore} onChange={(e) => updateExtraConfig("lmsPassingScore", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Max Attempts per Quiz</label>
              <input type="number" value={extraConfig.lmsMaxAttempts} onChange={(e) => updateExtraConfig("lmsMaxAttempts", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Certificate Valid For</label>
              <select value={extraConfig.lmsCertValidFor} onChange={(e) => updateExtraConfig("lmsCertValidFor", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>1 Year</option>
                <option>6 months</option>
                <option>2 years</option>
                <option>Lifetime</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Reminder Before Expiry (days)</label>
              <input type="number" value={extraConfig.lmsReminderBeforeExpiry} onChange={(e) => updateExtraConfig("lmsReminderBeforeExpiry", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "lmsIssueCert", label: "Issue Digital Certificate on Completion" },
              { key: "lmsShowCertProfile", label: "Show Certificate on Employee Profile" },
              { key: "lmsRequireSignOff", label: "Require Manager Sign-off for Course Completion" },
              { key: "lmsTrackProgress", label: "Track Course Progress in Real-time" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 4: TRAINING BUDGET */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">TRAINING BUDGET</span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Annual Training Budget per Employee (₹)</label>
              <input type="text" value={extraConfig.lmsAnnualBudget} onChange={(e) => updateExtraConfig("lmsAnnualBudget", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Department Training Budget Allocation</label>
              <select value={extraConfig.lmsDeptAllocation} onChange={(e) => updateExtraConfig("lmsDeptAllocation", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}>
                <option>Proportional to Headcount</option>
                <option>Fixed Equal</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">External Training Reimbursement</span>
              <button
                onClick={() => updateExtraConfig("lmsExternalReimbursement", !extraConfig.lmsExternalReimbursement)}
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: extraConfig.lmsExternalReimbursement ? "#00B87C" : "#E5E7EB",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span style={{ position: "absolute", top: "2px", left: extraConfig.lmsExternalReimbursement ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Reimbursement Cap per Course (₹)</label>
              <input type="text" value={extraConfig.lmsReimbursementCap} onChange={(e) => updateExtraConfig("lmsReimbursementCap", e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: "lmsRequirePreApproval", label: "Require Pre-approval for External Training", desc: "Employees must get HR + manager approval before external course" },
              { key: "lmsTrackRoi", label: "Track Training ROI (Performance Impact)", desc: "" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 5: GAMIFICATION */}
        <div className="p-4 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-3 uppercase">GAMIFICATION</span>
          <div className="space-y-3">
            {[
              { key: "lmsLeaderboard", label: "Enable Learning Leaderboard", desc: "Top learners visible on employee dashboard" },
              { key: "lmsAwardPoints", label: "Award Points for Course Completion", desc: "" },
              { key: "lmsBadges", label: "Enable Badges & Achievements", desc: "" },
              { key: "lmsShowTeamProgress", label: "Show Team Learning Progress", desc: "" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF]">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end items-center pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
          <button onClick={() => showToast("Settings reset to default", "error")} style={{ backgroundColor: "transparent", color: "#9CA3AF", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Reset to Defaults</button>
          <button onClick={() => showToast("Training settings saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>
      </div>
    );
  };

  const renderOnboardingSettings = () => {

    return (
      <div>
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
          <span style={{ color: "#9CA3AF" }}>Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#9CA3AF" }}>Module Settings</span>
          <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
          <span style={{ color: "#00B87C", fontWeight: 700 }}>Onboarding Settings</span>
        </div>

        {/* CONTENT HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Onboarding Settings</h2>
            <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px", margin: 0 }}>Configure the new hire onboarding journey and checklists</p>
          </div>
          <button onClick={() => showToast("Onboarding configurations saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>

        {/* POLICY BLOCK 1: ONBOARDING WORKFLOW */}
        <div className="p-6 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-4 uppercase">ONBOARDING WORKFLOW</span>
          
          <div className="flex items-center justify-between py-2 mb-4 gap-2 overflow-x-auto">
            {/* Phase 1 */}
            <div 
              className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-3 relative" 
              style={{ 
                backgroundColor: "#DCFCE7", 
                borderColor: "#00B87C",
                borderWidth: "1px" 
              }}
            >
              <span className="block font-bold text-[13px] text-[#111827]">Pre-joining</span>
              <span className="block text-[11px] text-[#6B7280] mt-1">Before Day 1</span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-[#00B87C] text-white">4 tasks</span>
            </div>
            
            <ChevronRight size={18} style={{ color: "#00B87C" }} />

            {/* Phase 2 */}
            <div 
              className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-3 relative bg-white dark:bg-neutral-800" 
              style={{ 
                borderColor: "#E5E7EB" 
              }}
            >
              <span className="block font-bold text-[13px] text-gray-800 dark:text-gray-200">Day 1</span>
              <span className="block text-[11px] text-[#9CA3AF] mt-1">First day at office</span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2" style={{ backgroundColor: "#E6FFFA", color: "#319795" }}>6 tasks</span>
            </div>

            <ChevronRight size={18} style={{ color: "#00B87C" }} />

            {/* Phase 3 */}
            <div 
              className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-3 relative bg-white dark:bg-neutral-800" 
              style={{ 
                borderColor: "#E5E7EB" 
              }}
            >
              <span className="block font-bold text-[13px] text-gray-800 dark:text-gray-200">Week 1</span>
              <span className="block text-[11px] text-[#9CA3AF] mt-1">First 7 days</span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2" style={{ backgroundColor: "#E6FFFA", color: "#319795" }}>8 tasks</span>
            </div>

            <ChevronRight size={18} style={{ color: "#00B87C" }} />

            {/* Phase 4 */}
            <div 
              className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-3 relative bg-white dark:bg-neutral-800" 
              style={{ 
                borderColor: "#E5E7EB" 
              }}
            >
              <span className="block font-bold text-[13px] text-gray-800 dark:text-gray-200">Month 1</span>
              <span className="block text-[11px] text-[#9CA3AF] mt-1">First 30 days</span>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2" style={{ backgroundColor: "#E6FFFA", color: "#319795" }}>5 tasks</span>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-4">
            <button 
              className="px-4 py-2 text-[12px] font-bold border rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)", backgroundColor: "var(--card)" }}
            >
              Edit Phases
            </button>
            <span className="text-[12px] text-[#00B87C] cursor-pointer font-bold hover:underline">+ Add Phase</span>
          </div>
        </div>

        {/* POLICY BLOCK 2: ONBOARDING TASKS BY PHASE */}
        <div className="p-6 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-4 uppercase">ONBOARDING TASKS BY PHASE</span>
          
          {/* TABS */}
          <div className="flex gap-6 border-b mb-4" style={{ borderColor: "var(--border)" }}>
            {[
              { id: "pre", label: "Pre-joining" },
              { id: "day1", label: "Day 1" },
              { id: "week1", label: "Week 1" },
              { id: "month1", label: "Month 1" }
            ].map((tab) => {
              const active = activeOnboardingPhaseTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveOnboardingPhaseTab(tab.id)}
                  className="pb-2 font-bold text-[13px] bg-transparent cursor-pointer transition-all"
                  style={{ 
                    borderBottom: active ? "2px solid #00B87C" : "2px solid transparent", 
                    color: active ? "#00B87C" : "#6B7280" 
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TASK LIST */}
          <div className="divide-y divide-gray-100 dark:divide-neutral-800 mb-4">
            {[
              { name: "Send welcome email", dept: "HR", due: "-7", req: true },
              { name: "Collect required documents", dept: "HR", due: "-5", req: true },
              { name: "Create employee system account", dept: "IT", due: "-3", req: true },
              { name: "Order laptop and equipment", dept: "IT", due: "-5", req: true },
              { name: "Send office location & parking info", dept: "HR", due: "-1", req: false }
            ].map((t, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 h-[40px] text-[13px] py-1">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-gray-400 select-none cursor-grab">⋮⋮</span>
                  <input 
                    type="checkbox" 
                    checked={t.req} 
                    readOnly 
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "#00B87C" }}
                  />
                  <span className="font-bold truncate text-gray-800 dark:text-gray-200">{t.name}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Assigned To Dropdown Chip */}
                  <select 
                    value={t.dept}
                    onChange={() => {}}
                    className="text-[11px] bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border-0 font-medium outline-none cursor-pointer"
                  >
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Ops">Ops</option>
                  </select>

                  {/* Due Days Input */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[#9CA3AF]">Day</span>
                    <input 
                      type="number" 
                      defaultValue={t.due} 
                      className="w-12 text-center rounded border bg-white dark:bg-neutral-800 text-xs p-1" 
                      style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
                    />
                  </div>

                  {/* Required Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-[#9CA3AF]">{t.req ? "Required" : "Optional"}</span>
                    <button
                      onClick={() => {}}
                      style={{
                        width: "30px",
                        height: "16px",
                        borderRadius: "16px",
                        backgroundColor: t.req ? "#00B87C" : "#E5E7EB",
                        position: "relative",
                        transition: "all 0.2s",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      <span style={{ position: "absolute", top: "1px", left: t.req ? "15px" : "1px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <span className="text-[13px] text-[#00B87C] font-bold cursor-pointer hover:underline">+ Add Task</span>
        </div>

        {/* POLICY BLOCK 3: ONBOARDING RULES */}
        <div className="p-6 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-4 uppercase">ONBOARDING RULES</span>
          <div className="space-y-4">
            {[
              { key: "onboardingPreJoiningEmail", label: "Send Pre-joining Welcome Email Automatically", desc: "Triggered when employee record is created and joining date set" },
              { key: "onboardingAutoBuddy", label: "Assign Buddy/Mentor Automatically", desc: "System assigns a buddy from same department on joining" },
              { key: "onboardingDigitalSign", label: "Enable Digital Document Signing on Onboarding", desc: "New hire signs NDA, offer letter digitally via portal" },
              { key: "onboardingBlockPayroll", label: "Block Payroll Until Onboarding Completion", desc: "Salary is held until all mandatory tasks are marked complete" },
              { key: "onboardingNotifyOverdue", label: "Notify HR if Onboarding Task Overdue", desc: "" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center py-1">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF] mt-0.5 block">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POLICY BLOCK 4: OFFBOARDING SETTINGS */}
        <div className="p-6 rounded-xl mb-6 border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <span className="block text-[11px] font-bold text-[#9CA3AF] mb-4 uppercase">OFFBOARDING SETTINGS</span>
          <div className="space-y-4 mb-6">
            {[
              { key: "offboardingEnabled", label: "Enable Offboarding Workflow" },
              { key: "offboardingAutoTrigger", label: "Auto-trigger on Resignation Submission" },
              { key: "offboardingRequireExitInterview", label: "Require Exit Interview" },
              { key: "offboardingRevokeAccess", label: "Revoke System Access on Last Working Day" },
              { key: "offboardingAutoFf", label: "Auto-generate Full & Final Settlement" },
              { key: "offboardingAlumniAccess", label: "Enable Alumni Portal Access After Exit", desc: "Ex-employees can access limited portal for documents" }
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center py-1">
                <div>
                  <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">{item.label}</span>
                  {item.desc && <span className="text-[11px] text-[#9CA3AF] mt-0.5 block">{item.desc}</span>}
                </div>
                <button
                  onClick={() => updateExtraConfig(item.key, !extraConfig[item.key as keyof typeof extraConfig])}
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[item.key as keyof typeof extraConfig] ? "#00B87C" : "#E5E7EB",
                    position: "relative",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <span style={{ position: "absolute", top: "2px", left: extraConfig[item.key as keyof typeof extraConfig] ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "white", transition: "all 0.2s" }} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">Notice Period Default (days)</label>
              <input 
                type="number" 
                value={extraConfig.offboardingNoticePeriod} 
                onChange={(e) => updateExtraConfig("offboardingNoticePeriod", e.target.value)} 
                className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" 
                style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">F&F Settlement Deadline (days after exit)</label>
              <input 
                type="number" 
                value={extraConfig.offboardingFfDeadline} 
                onChange={(e) => updateExtraConfig("offboardingFfDeadline", e.target.value)} 
                className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800" 
                style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }} 
              />
            </div>
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="flex justify-end items-center gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button onClick={() => showToast("Settings reset to default", "error")} style={{ backgroundColor: "transparent", color: "#9CA3AF", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Reset to Defaults</button>
          <button onClick={() => showToast("Onboarding configurations saved")} style={{ backgroundColor: "#00B87C", color: "white", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save Settings</button>
        </div>
      </div>
    );
  };



  const renderModal = () => {
    if (!activeModal) return null;
    
    const closeModal = () => setActiveModal(null);

    const handleScheduleSubmit = () => {
      if (!scheduleForm.name.trim()) {
        showToast("Schedule Name is required", "error");
        return;
      }
      if (!scheduleForm.code.trim()) {
        showToast("Schedule Code is required", "error");
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        if (activeModal === "add_schedule") {
          const newSched: WorkScheduleRecord = {
            name: scheduleForm.name,
            code: scheduleForm.code,
            type: scheduleForm.type,
            startTime: scheduleForm.startTime,
            endTime: scheduleForm.endTime,
            breakDuration: scheduleForm.breakDuration,
            workingDays: scheduleForm.workingDays,
            weekends: scheduleForm.weekends,
            graceTime: scheduleForm.graceTime,
            halfDayRule: scheduleForm.halfDayRule,
            otEligible: scheduleForm.otEligible,
            dept: scheduleForm.dept,
            location: scheduleForm.location,
            empCount: 0,
            status: scheduleForm.status,
          };
          setSchedulesList([...schedulesList, newSched]);
          showToast("Schedule created successfully", "success");
        } else {
          setSchedulesList(
            schedulesList.map((s) =>
              s.code === selectedSchedule?.code
                ? {
                    ...s,
                    name: scheduleForm.name,
                    code: scheduleForm.code,
                    type: scheduleForm.type,
                    startTime: scheduleForm.startTime,
                    endTime: scheduleForm.endTime,
                    breakDuration: scheduleForm.breakDuration,
                    workingDays: scheduleForm.workingDays,
                    weekends: scheduleForm.weekends,
                    graceTime: scheduleForm.graceTime,
                    halfDayRule: scheduleForm.halfDayRule,
                    otEligible: scheduleForm.otEligible,
                    dept: scheduleForm.dept,
                    location: scheduleForm.location,
                    status: scheduleForm.status,
                  }
                : s
            )
          );
          showToast("Schedule updated successfully", "success");
        }
        setIsSubmitting(false);
        closeModal();
      }, 1000);
    };

    const handleDeleteScheduleSubmit = () => {
      if (selectedSchedule && selectedSchedule.empCount > 0) {
        showToast("Cannot delete a schedule with assigned employees", "error");
        closeModal();
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setSchedulesList(schedulesList.filter((s) => s.code !== selectedSchedule?.code));
        setIsSubmitting(false);
        showToast("Schedule deleted successfully", "success");
        closeModal();
      }, 1000);
    };


    const handleLeaveTypeSubmit = () => {

      if (!leaveTypeForm.name.trim()) {
        showToast("Leave Type Name is required", "error");
        return;
      }
      if (!leaveTypeForm.code.trim()) {
        showToast("Leave Code is required", "error");
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        if (activeModal === "add_leave_type") {
          const newLT: LeaveTypeRecord = {
            name: leaveTypeForm.name,
            code: leaveTypeForm.code,
            days: leaveTypeForm.days,
            type: leaveTypeForm.type,
            carryForward: leaveTypeForm.carryForward,
            maxCarryForward: leaveTypeForm.maxCarryForward,
            encashment: leaveTypeForm.encashment,
            approvalRequired: leaveTypeForm.approvalRequired,
            attachmentRequired: leaveTypeForm.attachmentRequired,
            minNoticePeriod: leaveTypeForm.minNoticePeriod,
            maxConsecutiveLeave: leaveTypeForm.maxConsecutiveLeave,
            dept: leaveTypeForm.dept,
            location: leaveTypeForm.location,
            status: leaveTypeForm.status,
            description: leaveTypeForm.description,
          };
          setLeaveTypesList([...leaveTypesList, newLT]);
          showToast("Leave type created successfully", "success");
        } else {
          setLeaveTypesList(
            leaveTypesList.map((l) =>
              l.code === selectedLeaveType?.code
                ? {
                    ...l,
                    name: leaveTypeForm.name,
                    code: leaveTypeForm.code,
                    days: leaveTypeForm.days,
                    type: leaveTypeForm.type,
                    carryForward: leaveTypeForm.carryForward,
                    maxCarryForward: leaveTypeForm.maxCarryForward,
                    encashment: leaveTypeForm.encashment,
                    approvalRequired: leaveTypeForm.approvalRequired,
                    attachmentRequired: leaveTypeForm.attachmentRequired,
                    minNoticePeriod: leaveTypeForm.minNoticePeriod,
                    maxConsecutiveLeave: leaveTypeForm.maxConsecutiveLeave,
                    dept: leaveTypeForm.dept,
                    location: leaveTypeForm.location,
                    status: leaveTypeForm.status,
                    description: leaveTypeForm.description,
                  }
                : l
            )
          );
          showToast("Leave type updated successfully", "success");
        }
        setIsSubmitting(false);
        closeModal();
      }, 1000);
    };

    const handleDeleteLeaveType = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setLeaveTypesList(leaveTypesList.filter((l) => l.code !== selectedLeaveType?.code));
        setIsSubmitting(false);
        showToast("Leave type removed successfully", "success");
        closeModal();
      }, 1000);
    };

    const handleSaveLeavePolicy = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setLpLastUpdatedBy("Ryan Park (Super Admin)");
        const now = new Date();
        setLpLastUpdatedTime(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
        const vNum = parseFloat(lpPolicyVersion.replace("v", ""));
        setLpPolicyVersion(`v${(vNum + 0.1).toFixed(1)}`);
        setIsSubmitting(false);
        showToast("Leave policy updated successfully", "success");
        closeModal();
      }, 1500);
    };

    const handleHolidaySubmit = () => {

      if (!holidayForm.name.trim()) {
        showToast("Holiday Name is required", "error");
        return;
      }
      if (!holidayForm.date) {
        showToast("Date is required", "error");
        return;
      }

      const parsedDate = new Date(holidayForm.date);
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = daysOfWeek[parsedDate.getDay()];

      setIsSubmitting(true);
      setTimeout(() => {
        if (activeModal === "add_holiday") {
          const newHol: HolidayRecord = {
            name: holidayForm.name,
            date: holidayForm.date,
            day: dayName,
            type: holidayForm.type,
            location: holidayForm.location,
            dept: holidayForm.dept,
            recurring: holidayForm.recurring,
            status: holidayForm.status,
            description: holidayForm.description,
          };
          setHolidaysList([...holidaysList, newHol]);
          showToast("Holiday created successfully", "success");
        } else {
          setHolidaysList(
            holidaysList.map((h) =>
              h.date === selectedHoliday?.date && h.name === selectedHoliday?.name
                ? {
                    ...h,
                    name: holidayForm.name,
                    date: holidayForm.date,
                    day: dayName,
                    type: holidayForm.type,
                    location: holidayForm.location,
                    dept: holidayForm.dept,
                    recurring: holidayForm.recurring,
                    status: holidayForm.status,
                    description: holidayForm.description,
                  }
                : h
            )
          );
          showToast("Holiday updated successfully", "success");
        }
        setIsSubmitting(false);
        closeModal();
      }, 1000);
    };

    const handleDeleteHolidaySubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setHolidaysList(holidaysList.filter((h) => !(h.date === selectedHoliday?.date && h.name === selectedHoliday?.name)));
        setIsSubmitting(false);
        showToast("Holiday removed successfully", "success");
        closeModal();
      }, 1000);
    };

    const handleLocSubmit = () => {


      if (!locForm.name.trim()) {
        showToast("Location Name is required", "error");
        return;
      }
      if (!locForm.code.trim()) {
        showToast("Location Code is required", "error");
        return;
      }
      if (!locForm.city.trim()) {
        showToast("City is required", "error");
        return;
      }
      if (!locForm.country.trim()) {
        showToast("Country is required", "error");
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        if (activeModal === "add_location") {
          const newLoc: LocationRecord = {
            name: locForm.name,
            code: locForm.code,
            type: locForm.type,
            address: locForm.address,
            city: locForm.city,
            state: locForm.state,
            country: locForm.country,
            pincode: locForm.pincode,
            manager: locForm.manager,
            timezone: locForm.timezone,
            status: locForm.status,
            notes: locForm.notes,
            empCount: 0,
            createdDate: new Date().toISOString().split('T')[0],
          };
          setLocationsList([...locationsList, newLoc]);
          showToast("Location created successfully", "success");
        } else {
          setLocationsList(
            locationsList.map((l) =>
              l.code === selectedLoc?.code
                ? {
                    ...l,
                    name: locForm.name,
                    code: locForm.code,
                    type: locForm.type,
                    address: locForm.address,
                    city: locForm.city,
                    state: locForm.state,
                    country: locForm.country,
                    pincode: locForm.pincode,
                    manager: locForm.manager,
                    timezone: locForm.timezone,
                    status: locForm.status,
                    notes: locForm.notes,
                    lastUpdated: new Date().toISOString().split('T')[0],
                  }
                : l
            )
          );
          showToast("Location updated successfully", "success");
        }
        setIsSubmitting(false);
        closeModal();
      }, 1000);
    };

    const handleDeleteLocSubmit = () => {
      if (selectedLoc && selectedLoc.empCount > 0) {
        showToast("Transfer employees before deleting.", "error");
        closeModal();
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setLocationsList(locationsList.filter((l) => l.code !== selectedLoc?.code));
        setIsSubmitting(false);
        showToast("Location deleted successfully", "success");
        closeModal();
      }, 1000);
    };

    const handleDeptSubmit = () => {

      if (!deptForm.name.trim()) {
        showToast("Department Name is required", "error");
        return;
      }
      if (!deptForm.code.trim()) {
        showToast("Department Code is required", "error");
        return;
      }
      
      setIsSubmitting(true);
      setTimeout(() => {
        if (activeModal === "add_department") {
          const newDept: DepartmentRecord = {
            name: deptForm.name,
            code: deptForm.code,
            head: deptForm.head,
            status: deptForm.status,
            budget: deptForm.budget,
            description: deptForm.description,
            empCount: 0,
            createdDate: new Date().toISOString().split('T')[0],
          };
          setDeptsList([...deptsList, newDept]);
          showToast("Department created successfully", "success");
        } else {
          setDeptsList(
            deptsList.map((d) =>
              d.code === selectedDept?.code
                ? {
                    ...d,
                    name: deptForm.name,
                    code: deptForm.code,
                    head: deptForm.head,
                    status: deptForm.status,
                    budget: deptForm.budget,
                    description: deptForm.description,
                  }
                : d
            )
          );
          showToast("Department updated successfully", "success");
        }
        setIsSubmitting(false);
        closeModal();
      }, 1000);
    };

    const handleDeleteDeptSubmit = () => {
      if (selectedDept && selectedDept.empCount > 0) {
        showToast("Transfer employees before deleting.", "error");
        closeModal();
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setDeptsList(deptsList.filter((d) => d.code !== selectedDept?.code));
        setIsSubmitting(false);
        showToast("Department deleted successfully", "success");
        closeModal();
      }, 1000);
    };


    const handleInviteSubmit = () => {
      if (!inviteForm.name.trim()) {
        showToast("Full Name is required", "error");
        return;
      }
      if (!inviteForm.email.trim() || !/\S+@\S+\.\S+/.test(inviteForm.email)) {
        showToast("A valid email address is required", "error");
        return;
      }
      if (!inviteForm.role) {
        showToast("Role is required", "error");
        return;
      }
      if (!inviteForm.dept) {
        showToast("Department is required", "error");
        return;
      }
      
      setIsSubmitting(true);
      setTimeout(() => {
        const initials = inviteForm.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
          
        const newUser = {
          name: inviteForm.name,
          email: inviteForm.email,
          initials: initials || "U",
          avatarBg: "#00B87C",
          role: inviteForm.role,
          dept: inviteForm.dept,
          location: inviteForm.location || "N/A",
          lastLogin: "Never",
          status: "Pending Invite",
        };
        
        setUsersList([...usersList, newUser]);
        setIsSubmitting(false);
        showToast("Invitation sent successfully", "success");
        setInviteForm({
          name: "",
          email: "",
          role: "Employee",
          dept: "Engineering",
          location: "",
          sendEmail: true,
          tempPassword: "",
          notes: "",
        });
        closeModal();
      }, 1000);
    };

    const handleEditSubmit = () => {
      if (!editForm.name.trim()) {
        showToast("Full Name is required", "error");
        return;
      }
      if (!editForm.email.trim() || !/\S+@\S+\.\S+/.test(editForm.email)) {
        showToast("A valid email address is required", "error");
        return;
      }
      
      setIsSubmitting(true);
      setTimeout(() => {
        setUsersList(
          usersList.map((u) =>
            u.email === selectedUser?.email
              ? {
                  ...u,
                  name: editForm.name,
                  email: editForm.email,
                  role: editForm.role,
                  dept: editForm.dept,
                  location: editForm.location,
                  status: editForm.status,
                }
              : u
          )
        );
        setIsSubmitting(false);
        showToast("User updated successfully", "success");
        closeModal();
      }, 1000);
    };

    const handleReactivateSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setUsersList(
          usersList.map((u) =>
            u.email === selectedUser?.email ? { ...u, status: "Active" } : u
          )
        );
        setIsSubmitting(false);
        showToast("User reactivated successfully", "success");
        closeModal();
      }, 1000);
    };

    const handleDeactivateSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setUsersList(
          usersList.map((u) =>
            u.email === selectedUser?.email ? { ...u, status: "Inactive" } : u
          )
        );
        setIsSubmitting(false);
        showToast("User deactivated successfully", "success");
        closeModal();
      }, 1000);
    };


    if (activeModal === "add_leave_type" || activeModal === "edit_leave_type") {
      const isEdit = activeModal === "edit_leave_type";
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{isEdit ? "Edit Leave Type" : "Add Leave Type"}</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Leave Type Name *</label>
                  <input
                    type="text"
                    value={leaveTypeForm.name}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, name: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Leave Code *</label>
                  <input
                    type="text"
                    value={leaveTypeForm.code}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, code: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Annual Entitlement (Days) *</label>
                  <input
                    type="number"
                    value={leaveTypeForm.days}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, days: parseInt(e.target.value) })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Type</label>
                  <select
                    value={leaveTypeForm.type}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, type: e.target.value as "Paid" | "Unpaid" })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="cfAllowed"
                    checked={leaveTypeForm.carryForward}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, carryForward: e.target.checked })}
                    className="rounded accent-[#00B87C]"
                  />
                  <label htmlFor="cfAllowed" style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>Carry Forward Allowed</label>
                </div>
                {leaveTypeForm.carryForward && (
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Max Carry Forward Days</label>
                    <input
                      type="number"
                      value={leaveTypeForm.maxCarryForward}
                      onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, maxCarryForward: parseInt(e.target.value) })}
                      className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="encAllowed"
                    checked={leaveTypeForm.encashment}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, encashment: e.target.checked })}
                    className="rounded accent-[#00B87C]"
                  />
                  <label htmlFor="encAllowed" style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>Encashment Allowed</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="appReq"
                    checked={leaveTypeForm.approvalRequired}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, approvalRequired: e.target.checked })}
                    className="rounded accent-[#00B87C]"
                  />
                  <label htmlFor="appReq" style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>Approval Required</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="attReq"
                    checked={leaveTypeForm.attachmentRequired}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, attachmentRequired: e.target.checked })}
                    className="rounded accent-[#00B87C]"
                  />
                  <label htmlFor="attReq" style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>Attachment Required</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Min Notice Period (Days)</label>
                  <input
                    type="number"
                    value={leaveTypeForm.minNoticePeriod}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, minNoticePeriod: parseInt(e.target.value) })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Max Consecutive Leave (Days)</label>
                  <input
                    type="number"
                    value={leaveTypeForm.maxConsecutiveLeave}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, maxConsecutiveLeave: parseInt(e.target.value) })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Applicable Departments</label>
                  <select
                    value={leaveTypeForm.dept}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, dept: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Applicable Locations</label>
                  <select
                    value={leaveTypeForm.location}
                    onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, location: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="All Locations">All Locations</option>
                    <option value="Bengaluru HQ">Bengaluru HQ</option>
                    <option value="Mumbai Branch">Mumbai Branch</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Status</label>
                <select
                  value={leaveTypeForm.status}
                  onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, status: e.target.value as "Active" | "Inactive" })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer transition-all"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveTypeSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Leave Type"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "delete_leave_type") {
      const isUsed = selectedLeaveType?.code === "CL" || selectedLeaveType?.code === "SL";
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#EF4444", margin: 0 }}>Delete Leave Type?</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "var(--foreground)", margin: "0 0 12px 0" }}>
              Are you sure you want to delete <span className="font-bold">{selectedLeaveType?.name}</span>?
            </p>
            {isUsed && (
              <div className="p-3 rounded-xl mb-4 text-xs font-medium" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#D97706", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                ⚠️ This leave type is already used in employee records. Consider deactivating instead of deleting.
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLeaveType}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#EF4444", opacity: isSubmitting ? 0.5 : 1 }}
              >
                {isSubmitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "edit_payroll") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Edit Payroll Settings</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6 space-y-6">
              {/* TAB 1: PAY CYCLE */}
              <div className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
                <span className="block text-xs font-bold text-[#00B87C] uppercase mb-3">Payroll Cycle</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Pay Frequency</label>
                    <select
                      value={payrollCycle}
                      onChange={(e) => setPayrollCycle(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm border"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Biweekly">Biweekly</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Cutoff Date</label>
                    <input
                      type="text"
                      value={payrollCutoff}
                      onChange={(e) => setPayrollCutoff(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm border"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Payout Date</label>
                    <input
                      type="text"
                      value={payrollPayout}
                      onChange={(e) => setPayrollPayout(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm border"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    />
                  </div>
                </div>
              </div>

              {/* TAB 2: ATTENDANCE RULES */}
              <div className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
                <span className="block text-xs font-bold text-[#00B87C] uppercase mb-3">Attendance Integration Rules</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                    <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Enable LOP Deduction</span>
                    <input
                      type="checkbox"
                      checked={prLopEnabled}
                      onChange={(e) => setPrLopEnabled(e.target.checked)}
                      className="rounded accent-[#00B87C]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                    <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Overtime Pay Enabled</span>
                    <input
                      type="checkbox"
                      checked={prOtPay}
                      onChange={(e) => setPrOtPay(e.target.checked)}
                      className="rounded accent-[#00B87C]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                    <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Late Deduction Toggle</span>
                    <input
                      type="checkbox"
                      checked={prLateDeduct}
                      onChange={(e) => setPrLateDeduct(e.target.checked)}
                      className="rounded accent-[#00B87C]"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Half-day calculation</label>
                    <select
                      value={prHalfDayCalc}
                      onChange={(e) => setPrHalfDayCalc(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm border"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                      <option value="Under 4 hours">Under 4 hours</option>
                      <option value="Under 3.5 hours">Under 3.5 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* TAB 3: PAYSLIP & COMPLIANCE */}
              <div>
                <span className="block text-xs font-bold text-[#00B87C] uppercase mb-3">Payslip & Compliance</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Payslip Template</label>
                    <select
                      value={prPayslipTemplate}
                      onChange={(e) => setPrPayslipTemplate(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm border"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                      <option value="Classic Green">Classic Green</option>
                      <option value="Modern Blue">Modern Blue</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Tax Mode</label>
                    <select
                      value={prTaxMode}
                      onChange={(e) => setPrTaxMode(e.target.value)}
                      className="w-full rounded-xl px-3 py-2 text-sm border"
                      style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                      <option value="New Regime (Default)">New Regime (Default)</option>
                      <option value="Old Regime">Old Regime</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setActiveModal("confirm_save_payroll")}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer"
                style={{ backgroundColor: "#00B87C" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "confirm_save_payroll") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Confirm Payroll Changes</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: "0 0 16px 0" }}>
              These changes may affect future payroll calculations and employee payslips.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActiveModal("edit_payroll")}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handlePayrollSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Saving..." : "Confirm Save"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "confirm_save_policy") {

      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Confirm Policy Changes</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: "0 0 16px 0" }}>
              These changes may affect employee leave balances, approval workflows, and future leave requests.
            </p>

            <div className="space-y-3 mb-6 p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
              <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Summary of changes</span>
              <div className="text-xs space-y-1 font-semibold" style={{ color: "var(--foreground)" }}>
                <div>• Updated active Leave Types list</div>
                <div>• Altered entitlement parameters & validations</div>
                <div>• Revised approval workflows ({lpApprovalLevels} Level)</div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLeavePolicy}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Saving..." : "Confirm Save"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "add_holiday" || activeModal === "edit_holiday") {

      const isEdit = activeModal === "edit_holiday";
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{isEdit ? "Edit Holiday" : "Add Holiday"}</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Holiday Name *</label>
                <input
                  type="text"
                  value={holidayForm.name}
                  onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Date *</label>
                  <input
                    type="date"
                    value={holidayForm.date}
                    onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Holiday Type</label>
                  <select
                    value={holidayForm.type}
                    onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value as "National" | "Company" | "Optional" | "Regional" | "Festival" })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="National">National</option>
                    <option value="Company">Company</option>
                    <option value="Optional">Optional</option>
                    <option value="Regional">Regional</option>
                    <option value="Festival">Festival</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Location Access</label>
                  <select
                    value={holidayForm.location}
                    onChange={(e) => setHolidayForm({ ...holidayForm, location: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="All Locations">Global (All Locations)</option>
                    <option value="Bengaluru HQ">Bengaluru HQ</option>
                    <option value="Mumbai Branch">Mumbai Branch</option>
                    <option value="Delhi Warehouse">Delhi Warehouse</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Department Access</label>
                  <select
                    value={holidayForm.dept}
                    onChange={(e) => setHolidayForm({ ...holidayForm, dept: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="recHol"
                  checked={holidayForm.recurring}
                  onChange={(e) => setHolidayForm({ ...holidayForm, recurring: e.target.checked })}
                  className="rounded accent-[#00B87C]"
                />
                <label htmlFor="recHol" style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>Recurring Yearly</label>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Description</label>
                <textarea
                  value={holidayForm.description}
                  onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)", resize: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Status</label>
                <select
                  value={holidayForm.status}
                  onChange={(e) => setHolidayForm({ ...holidayForm, status: e.target.value as "Active" | "Inactive" })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer transition-all"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleHolidaySubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Holiday"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "delete_holiday") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#EF4444", margin: 0 }}>Delete Holiday?</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "var(--foreground)", margin: "0 0 16px 0" }}>
              Are you sure you want to delete the holiday <span className="font-bold">{selectedHoliday?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHolidaySubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
                style={{ backgroundColor: "#EF4444", opacity: isSubmitting ? 0.5 : 1 }}
              >
                {isSubmitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "view_holiday") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{selectedHoliday?.name}</h3>
                <span
                  style={{
                    backgroundColor: "rgba(0, 184, 124, 0.1)",
                    color: "#00B87C",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    display: "inline-block",
                    marginTop: "6px"
                  }}
                >
                  {selectedHoliday?.type}
                </span>
              </div>
              <button onClick={closeModal} className="text-2xl hover:opacity-70 cursor-pointer" style={{ color: "var(--muted-foreground)", border: "none", background: "none" }}>&times;</button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Date & Day</span>
                <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>
                  {selectedHoliday?.date} ({selectedHoliday?.day})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Location</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedHoliday?.location}</span>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Department</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedHoliday?.dept}</span>
                </div>
              </div>
              {selectedHoliday?.description && (
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Description</span>
                  <p className="text-sm mt-1 font-medium" style={{ color: "var(--foreground)" }}>{selectedHoliday.description}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }


    if (activeModal === "add_schedule" || activeModal === "edit_schedule") {

      const isEdit = activeModal === "edit_schedule";
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{isEdit ? "Edit Work Schedule" : "Add Work Schedule"}</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Schedule Name *</label>
                  <input
                    type="text"
                    value={scheduleForm.name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Schedule Code *</label>
                  <input
                    type="text"
                    value={scheduleForm.code}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, code: e.target.value.toUpperCase() })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Schedule Type</label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value as "General" | "Shift" | "Flexible" | "Rotational" | "Part Time" })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="General">General</option>
                    <option value="Shift">Shift</option>
                    <option value="Flexible">Flexible</option>
                    <option value="Rotational">Rotational</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Break Duration (mins)</label>
                  <input
                    type="number"
                    value={scheduleForm.breakDuration}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, breakDuration: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Start Time</label>
                  <input
                    type="text"
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                    placeholder="09:00"
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>End Time</label>
                  <input
                    type="text"
                    value={scheduleForm.endTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                    placeholder="18:00"
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                    const isSelected = scheduleForm.workingDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const next = isSelected 
                            ? scheduleForm.workingDays.filter(d => d !== day)
                            : [...scheduleForm.workingDays, day];
                          setScheduleForm({ ...scheduleForm, workingDays: next });
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded-lg border transition-all"
                        style={{
                          backgroundColor: isSelected ? "rgba(0, 184, 124, 0.1)" : "transparent",
                          borderColor: isSelected ? "#00B87C" : "var(--border)",
                          color: isSelected ? "#00B87C" : "var(--foreground)"
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Grace Time (mins)</label>
                  <input
                    type="number"
                    value={scheduleForm.graceTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, graceTime: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Half-Day Rule</label>
                  <input
                    type="text"
                    value={scheduleForm.halfDayRule}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, halfDayRule: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Department Assignment</label>
                  <select
                    value={scheduleForm.dept}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, dept: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Location Assignment</label>
                  <select
                    value={scheduleForm.location}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="All">All Locations</option>
                    <option value="Bengaluru HQ">Bengaluru HQ</option>
                    <option value="Mumbai Branch">Mumbai Branch</option>
                    <option value="US Remote">US Remote</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="otEligible"
                  checked={scheduleForm.otEligible}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, otEligible: e.target.checked })}
                  className="rounded accent-[#00B87C]"
                />
                <label htmlFor="otEligible" style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>Overtime Eligible Schedule</label>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Status</label>
                <select
                  value={scheduleForm.status}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value as "Active" | "Inactive" })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer transition-all"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Schedule"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "delete_schedule") {
      const hasEmployees = selectedSchedule ? selectedSchedule.empCount > 0 : false;
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#EF4444", margin: 0 }}>Delete Schedule?</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "var(--foreground)", margin: "0 0 16px 0" }}>
              Are you sure you want to delete the <span className="font-bold">{selectedSchedule?.name}</span> constraint rule?
            </p>
            {hasEmployees && (
              <div className="p-4 rounded-xl mb-6 text-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444" }}>
                <span className="font-bold block mb-1">Warning:</span> Currently assigned to {selectedSchedule?.empCount} employees.
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteScheduleSubmit}
                disabled={isSubmitting || hasEmployees}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
                style={{ backgroundColor: "#EF4444", opacity: (isSubmitting || hasEmployees) ? 0.5 : 1 }}
              >
                {isSubmitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "view_schedule") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[85vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{selectedSchedule?.name}</h3>
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>Code: {selectedSchedule?.code} | Type: {selectedSchedule?.type}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none" }}
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 mb-6">
              <div className="p-4 rounded-xl border grid grid-cols-2 gap-4" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                <div>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Timings</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>
                    {selectedSchedule?.startTime === "Flexible" ? "Flexible Hours" : `${selectedSchedule?.startTime} - ${selectedSchedule?.endTime}`}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Break Duration</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedSchedule?.breakDuration} minutes</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Working Days</span>
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--foreground)' }}>
                  {selectedSchedule?.workingDays.join(", ")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Grace Period</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedSchedule?.graceTime} mins</span>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Overtime Status</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: selectedSchedule?.otEligible ? "#00B87C" : "#6B7280" }}>
                    {selectedSchedule?.otEligible ? "Eligible" : "Not Eligible"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Assigned Department</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedSchedule?.dept}</span>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Location Access</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedSchedule?.location}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "add_location" || activeModal === "edit_location") {

      const isEdit = activeModal === "edit_location";
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{isEdit ? "Edit Location" : "Add Location"}</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Location Name *</label>
                  <input
                    type="text"
                    value={locForm.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      let newCode = locForm.code;
                      if (!isEdit && (!locForm.code || locForm.code === locForm.name.slice(0, 3).toUpperCase())) {
                        newCode = newName.slice(0, 3).toUpperCase();
                      }
                      setLocForm({ ...locForm, name: newName, code: newCode });
                    }}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Location Code *</label>
                  <input
                    type="text"
                    value={locForm.code}
                    onChange={(e) => setLocForm({ ...locForm, code: e.target.value.toUpperCase() })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Location Type</label>
                  <select
                    value={locForm.type}
                    onChange={(e) => setLocForm({ ...locForm, type: e.target.value as "Head Office" | "Branch" | "Warehouse" | "Remote" })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="Head Office">Head Office</option>
                    <option value="Branch">Branch</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Location Manager</label>
                  <select
                    value={locForm.manager}
                    onChange={(e) => setLocForm({ ...locForm, manager: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="">Select Manager</option>
                    <option value="Suresh Iyer">Suresh Iyer</option>
                    <option value="Vikram Singh">Vikram Singh</option>
                    <option value="Meera Thomas">Meera Thomas</option>
                    <option value="Ananya Das">Ananya Das</option>
                    <option value="Rahul Sharma">Rahul Sharma</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Address</label>
                <input
                  type="text"
                  value={locForm.address}
                  onChange={(e) => setLocForm({ ...locForm, address: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>City *</label>
                  <input
                    type="text"
                    value={locForm.city}
                    onChange={(e) => setLocForm({ ...locForm, city: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>State</label>
                  <input
                    type="text"
                    value={locForm.state}
                    onChange={(e) => setLocForm({ ...locForm, state: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Country *</label>
                  <input
                    type="text"
                    value={locForm.country}
                    onChange={(e) => setLocForm({ ...locForm, country: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Pincode</label>
                  <input
                    type="text"
                    value={locForm.pincode}
                    onChange={(e) => setLocForm({ ...locForm, pincode: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Timezone</label>
                  <select
                    value={locForm.timezone}
                    onChange={(e) => setLocForm({ ...locForm, timezone: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                    <option value="PST (UTC-8)">PST (UTC-8)</option>
                    <option value="EST (UTC-5)">EST (UTC-5)</option>
                    <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Status</label>
                  <select
                    value={locForm.status}
                    onChange={(e) => setLocForm({ ...locForm, status: e.target.value as "Active" | "Inactive" | "Partial" })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Notes</label>
                <textarea
                  value={locForm.notes}
                  onChange={(e) => setLocForm({ ...locForm, notes: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none border transition-all resize-none h-20"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleLocSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
                style={{ backgroundColor: "#00B87C", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Location"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "delete_location") {
      const hasEmployees = selectedLoc ? selectedLoc.empCount > 0 : false;
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#EF4444", margin: 0 }}>Delete Location?</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "var(--foreground)", margin: "0 0 16px 0" }}>
              Are you sure you want to delete the <span className="font-bold">{selectedLoc?.name}</span> location asset?
            </p>
            {hasEmployees && (
              <div className="p-4 rounded-xl mb-6 text-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444" }}>
                <span className="font-bold block mb-1">Warning:</span> Transfer employees before deleting. (Current: {selectedLoc?.empCount} Employees)
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLocSubmit}
                disabled={isSubmitting || hasEmployees}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
                style={{ backgroundColor: "#EF4444", opacity: (isSubmitting || hasEmployees) ? 0.5 : 1 }}
              >
                {isSubmitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "view_location") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[85vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{selectedLoc?.name}</h3>
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>Code: {selectedLoc?.code} | Type: {selectedLoc?.type}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none" }}
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 mb-6">
              <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Full Address</span>
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--foreground)' }}>
                  {selectedLoc?.address}, {selectedLoc?.city}, {selectedLoc?.state}, {selectedLoc?.country} - {selectedLoc?.pincode}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Location Manager</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedLoc?.manager || "Not Assigned"}</span>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Timezone</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedLoc?.timezone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Assigned Employees</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "#00B87C" }}>{selectedLoc?.empCount} People</span>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Created Date</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedLoc?.createdDate}</span>
                </div>
              </div>

              {selectedLoc?.notes && (
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "8px" }}>Notes</h4>
                  <p className="text-sm p-3 rounded-xl border" style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                    {selectedLoc.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "add_department" || activeModal === "edit_department") {
      const isEdit = activeModal === "edit_department";
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{isEdit ? "Edit Department" : "Add Department"}</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Department Name *</label>
                <input
                  type="text"
                  value={deptForm.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    let newCode = deptForm.code;
                    if (!isEdit && (!deptForm.code || deptForm.code === deptForm.name.slice(0, 2).toUpperCase())) {
                      newCode = newName.slice(0, 2).toUpperCase();
                    }
                    setDeptForm({ ...deptForm, name: newName, code: newCode });
                  }}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Department Code *</label>
                <input
                  type="text"
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Department Head</label>
                <select
                  value={deptForm.head}
                  onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="">Select Head (Optional)</option>
                  <option value="Suresh Iyer">Suresh Iyer</option>
                  <option value="Vikram Singh">Vikram Singh</option>
                  <option value="Meera Thomas">Meera Thomas</option>
                  <option value="Ananya Das">Ananya Das</option>
                  <option value="Priya Nair">Priya Nair</option>
                  <option value="Sneha Patel">Sneha Patel</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Status</label>
                <select
                  value={deptForm.status}
                  onChange={(e) => setDeptForm({ ...deptForm, status: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Budget (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹50L"
                  value={deptForm.budget}
                  onChange={(e) => setDeptForm({ ...deptForm, budget: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Description</label>
                <textarea
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none border transition-all resize-none h-20"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeptSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
                style={{ backgroundColor: "#00B87C", opacity: isSubmitting ? 0.6 : 1 }}
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Department"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "delete_department") {
      const hasEmployees = selectedDept ? selectedDept.empCount > 0 : false;

      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#EF4444", margin: 0 }}>Delete Department?</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "14px", color: "var(--foreground)", margin: "0 0 16px 0" }}>
              Are you sure you want to delete the <span className="font-bold">{selectedDept?.name}</span> department?
            </p>
            {hasEmployees && (
              <div className="p-4 rounded-xl mb-6 text-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#EF4444" }}>
                <span className="font-bold block mb-1">Warning:</span> Transfer employees before deleting. (Current: {selectedDept?.empCount} Employees)
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
                style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDeptSubmit}
                disabled={isSubmitting || hasEmployees}
                className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
                style={{ backgroundColor: "#EF4444", opacity: (isSubmitting || hasEmployees) ? 0.5 : 1 }}
              >
                {isSubmitting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "view_department") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[85vh] overflow-y-auto" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{selectedDept?.name}</h3>
                <p style={{ fontSize: "12px", color: "var(--muted-foreground)", margin: 0 }}>Code: {selectedDept?.code} | Created on: {selectedDept?.createdDate}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none" }}
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Department Head</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedDept?.head || "Not Assigned"}</span>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span className="block text-[10px] font-bold text-var(--muted-foreground) uppercase">Budget allocation</span>
                  <span className="font-semibold text-sm block mt-1" style={{ color: "var(--foreground)" }}>{selectedDept?.budget || "None"}</span>
                </div>
              </div>
              
              <div>
                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "8px" }}>Description</h4>
                <p className="text-sm p-3 rounded-xl border" style={{ backgroundColor: "var(--input-background)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                  {selectedDept?.description || "No description available for this department."}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "8px" }}>Attendance Summary</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10B981", fontWeight: 700 }}>94% Present</div>
                  <div className="p-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", fontWeight: 700 }}>4% Late</div>
                  <div className="p-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", fontWeight: 700 }}>2% Absent</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "8px" }}>Performance Metrics</h4>
                <div className="p-3 rounded-xl border flex justify-between items-center" style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 600 }}>Average Performance Rating</span>
                  <span className="text-white text-xs font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: "#00B87C" }}>
                    4.2 / 5.0
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
                style={{ backgroundColor: "#00B87C" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "invite_user") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Invite New User</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Full Name *</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  placeholder="First Last"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Email Address *</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  placeholder="name@nexushr.com"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Role *</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Manager">Manager</option>
                    <option value="Finance">Finance</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Department *</label>
                  <select
                    value={inviteForm.dept}
                    onChange={(e) => setInviteForm({ ...inviteForm, dept: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Location (Optional)</label>
                <select
                  value={inviteForm.location}
                  onChange={(e) => setInviteForm({ ...inviteForm, location: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="">Select Location</option>
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Austin">Austin</option>
                </select>
              </div>
              <div className="flex items-center gap-3 select-none mt-2">
                <div
                  onClick={() => setInviteForm({ ...inviteForm, sendEmail: !inviteForm.sendEmail })}
                  className="w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer"
                  style={{
                    backgroundColor: inviteForm.sendEmail ? "#00B87C" : "transparent",
                    borderColor: inviteForm.sendEmail ? "#00B87C" : "var(--border)",
                  }}
                >
                  {inviteForm.sendEmail && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 5" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>
                  Send invitation email
                </span>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Temporary Password (Optional)</label>
                <input
                  type="password"
                  value={inviteForm.tempPassword}
                  onChange={(e) => setInviteForm({ ...inviteForm, tempPassword: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Notes (Optional)</label>
                <textarea
                  value={inviteForm.notes}
                  onChange={(e) => setInviteForm({ ...inviteForm, notes: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)", height: "60px", resize: "none" }}
                  placeholder="Additional context..."
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: "none", backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleInviteSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                style={{ border: "none", backgroundColor: "#00B87C" }}
              >
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "edit_user") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Edit User</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Full Name *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Email Address *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Manager">Manager</option>
                    <option value="Finance">Finance</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Department</label>
                  <select
                    value={editForm.dept}
                    onChange={(e) => setEditForm({ ...editForm, dept: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Location</label>
                  <select
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="">Select Location</option>
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Austin">Austin</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Invite">Pending Invite</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Permissions (Optional)</label>
                <input
                  type="text"
                  value={editForm.permissions}
                  onChange={(e) => setEditForm({ ...editForm, permissions: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  placeholder="e.g. View-only Reports"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: "none", backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                style={{ border: "none", backgroundColor: "#00B87C" }}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "reactivate_user") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Reactivate User</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--input-background)", border: "1px solid var(--border)" }}>
                <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{selectedUser?.name}</span>
                <span style={{ display: "block", fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>{selectedUser?.email}</span>
                <div className="flex items-center gap-2 mt-3">
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Current Status:</span>
                  <span
                    style={{
                      backgroundColor: selectedUser ? getStatusStyles(selectedUser.status).bg : "transparent",
                      color: selectedUser ? getStatusStyles(selectedUser.status).color : "transparent",
                      padding: "2px 8px",
                      borderRadius: "8px",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    {selectedUser?.status}
                  </span>
                </div>
              </div>
              
              <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>
                This user will regain access to the EMS system.
              </p>
              
              <div className="flex items-center gap-3 select-none mt-2">
                <div
                  onClick={() => setReactivateConfirm({ ...reactivateConfirm, sendEmail: !reactivateConfirm.sendEmail })}
                  className="w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer"
                  style={{
                    backgroundColor: reactivateConfirm.sendEmail ? "#00B87C" : "transparent",
                    borderColor: reactivateConfirm.sendEmail ? "#00B87C" : "var(--border)",
                  }}
                >
                  {reactivateConfirm.sendEmail && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 5" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "13px", color: "var(--foreground)", fontWeight: 500 }}>
                  Send reactivation email
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: "none", backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleReactivateSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                style={{ border: "none", backgroundColor: "#00B87C" }}
              >
                {isSubmitting ? "Reactivating..." : "Reactivate User"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeModal === "deactivate_user") {
      return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]" style={{ backgroundColor: "var(--card)" }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Deactivate User</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="mb-6 space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--input-background)", border: "1px solid var(--border)" }}>
                <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{selectedUser?.name}</span>
                <span style={{ display: "block", fontSize: "12px", color: "var(--muted-foreground)", marginTop: "2px" }}>{selectedUser?.email}</span>
              </div>
              
              <p style={{ fontSize: "13px", color: "#EF4444", fontWeight: 600, margin: 0 }}>
                This user will lose access to the EMS system.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: "none", backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                style={{ border: "none", backgroundColor: "#EF4444" }}
              >
                {isSubmitting ? "Deactivating..." : "Deactivate User"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    let title: string;
    let content: React.ReactNode;
    
    switch (activeModal) {

      case "add_schedule":
      case "edit_schedule":
        title = activeModal === "add_schedule" ? "Add Work Schedule" : "Edit Work Schedule";
        content = (
          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Schedule Name</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="e.g. Standard 5-Day" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Working Days</label>
                <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="Mon–Fri" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Hours/Day</label>
                <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="8h" />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Shift Time</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="09:00–18:00" />
            </div>
          </div>
        );
        break;
      case "add_leave_type":
      case "edit_leave_type":
        title = activeModal === "add_leave_type" ? "Add Leave Type" : "Edit Leave Type";
        content = (
          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Leave Type Name</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="e.g. Sick Leave" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Days per Year</label>
                <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="12" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Accrual</label>
                <select className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <option>Monthly</option>
                  <option>Yearly</option>
                  <option>One-time</option>
                </select>
              </div>
            </div>
          </div>
        );
        break;
      case "reset_defaults":
        title = "Reset to Defaults";
        content = (
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>Are you absolutely sure you want to reset all configurations back to factory defaults? This action cannot be undone.</p>
        );
        break;
      case "add_payroll_component":
      case "edit_payroll_component":
        title = activeModal === "add_payroll_component" ? "Add Payroll Component" : "Edit Payroll Component";
        content = (
          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Component Name</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Type</label>
                <select className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <option>Fixed</option>
                  <option>Variable</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Taxable</label>
                <select className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <option>Yes</option>
                  <option>No</option>
                  <option>Partial</option>
                </select>
              </div>
            </div>
          </div>
        );
        break;
      case "add_holiday":
        title = "Add Holiday Event";
        content = (
          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Holiday Label</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="e.g. Diwali" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Date</label>
                <input type="date" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Category</label>
                <select className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <option>National</option>
                  <option>Regional</option>
                  <option>Company</option>
                </select>
              </div>
            </div>
          </div>
        );
        break;
      case "remove_holiday":
      case "delete_role":
      case "revoke_api_key":
      case "delete_webhook":
        title = "Delete Configuration";
        content = (
          <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>This destructive action will permanently purge the target parameter. Continue?</p>
        );
        break;
      case "add_department":
      case "edit_department":
        title = activeModal === "add_department" ? "Provision Department" : "Update Department";
        content = (
          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Department Name</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Lead Entity</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
          </div>
        );
        break;
      case "add_location":
      case "edit_location":
        title = activeModal === "add_location" ? "Provision Office Cluster" : "Update Office Coordinates";
        content = (
          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Site Name</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Timezone Designation</label>
              <input type="text" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
            </div>
          </div>
        );
        break;
      case "create_role":
      case "edit_role":
        title = activeModal === "create_role" ? "Create Role" : "Edit Role";
        content = (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Role Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all focus:border-[var(--primary)]" 
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} 
                  placeholder="e.g. HR Administrator" 
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Status</label>
                <select 
                  value={roleForm.status}
                  onChange={(e) => setRoleForm({...roleForm, status: e.target.value})}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all focus:border-[var(--primary)]" 
                  style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Description</label>
              <textarea 
                value={roleForm.description}
                onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all focus:border-[var(--primary)] resize-none" 
                style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)", minHeight: "80px" }} 
                placeholder="Describe the responsibilities of this role..." 
              />
            </div>
            
            {activeModal === "edit_role" && selectedRoleForEdit && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                <Users size={14} style={{ color: "var(--muted-foreground)" }} />
                <span style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 500 }}>
                  Assigned to <strong style={{ color: "var(--foreground)" }}>{selectedRoleForEdit.members}</strong> users
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--foreground)", textTransform: "none" }}>Module Permissions</label>
                <button 
                  onClick={() => {
                    const newPerms = { ...roleForm.permissions };
                    Object.keys(newPerms).forEach(k => newPerms[k] = "no");
                    setRoleForm({...roleForm, permissions: newPerms});
                  }}
                  className="text-[12px] font-semibold hover:underline transition-colors" 
                  style={{ color: "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer" }}
                >
                  Clear All
                </button>
              </div>
              
              <div className="border rounded-xl overflow-hidden" style={{ borderColor: "var(--border)", maxHeight: "40vh", overflowY: "auto" }}>
                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 z-10" style={{ backgroundColor: "var(--muted)" }}>
                    <tr>
                      <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Module</th>
                      <th className="py-3 px-2 text-center text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)", width: "60px" }}>View</th>
                      <th className="py-3 px-2 text-center text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)", width: "60px" }}>Create</th>
                      <th className="py-3 px-2 text-center text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)", width: "60px" }}>Edit</th>
                      <th className="py-3 px-2 text-center text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)", width: "60px" }}>Delete</th>
                      <th className="py-3 px-4 text-right text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)", width: "90px" }}>Select All</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionGroups.map(group => (
                      <React.Fragment key={group.id}>
                        <tr>
                          <td colSpan={6} className="px-4 py-2 text-[12px] font-bold" style={{ backgroundColor: "var(--card)", color: "var(--foreground)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                            {group.name}
                          </td>
                        </tr>
                        {group.modules.map(mod => {
                          const p = roleForm.permissions[mod.id] || "no";
                          const isView = p === "view" || p === "full";
                          const isFull = p === "full";
                          
                          const handleCheck = (type: string, checked: boolean) => {
                            let next = p;
                            if (type === "view") {
                              next = checked ? "view" : "no";
                            } else if (type === "full") {
                              next = checked ? "full" : "view";
                            }
                            setRoleForm(prev => ({
                              ...prev,
                              permissions: { ...prev.permissions, [mod.id]: next }
                            }));
                          };
                          
                          return (
                            <tr key={mod.id} className="hover:bg-[var(--muted)] transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                              <td className="px-4 py-3 text-[13px] font-medium" style={{ color: "var(--foreground)" }}>{mod.name}</td>
                              <td className="text-center">
                                <input type="checkbox" checked={isView} onChange={(e) => handleCheck("view", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer" />
                              </td>
                              <td className="text-center">
                                <input type="checkbox" checked={isFull} onChange={(e) => handleCheck("full", e.target.checked)} disabled={!isView} className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] disabled:opacity-50 cursor-pointer" />
                              </td>
                              <td className="text-center">
                                <input type="checkbox" checked={isFull} onChange={(e) => handleCheck("full", e.target.checked)} disabled={!isView} className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] disabled:opacity-50 cursor-pointer" />
                              </td>
                              <td className="text-center">
                                <input type="checkbox" checked={isFull} onChange={(e) => handleCheck("full", e.target.checked)} disabled={!isView} className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] disabled:opacity-50 cursor-pointer" />
                              </td>
                              <td className="text-right px-4">
                                <button 
                                  onClick={() => handleCheck("full", !isFull)}
                                  className="text-[11px] font-semibold transition-colors" 
                                  style={{ color: isFull ? "#00B87C" : "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer" }}
                                >
                                  {isFull ? "Selected" : "Select All"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        break;
      case "confirm_edit_role":
        title = "Confirm Permission Changes";
        content = (
          <div className="space-y-4">
            <p style={{ fontSize: "14px", color: "var(--foreground)", margin: 0 }}>
              Changes to this role may affect users assigned to it.
            </p>
          </div>
        );
        break;
      case "invite_user":
      case "edit_user":
        title = activeModal === "invite_user" ? "Invite Authorized Specialist" : "Adjust User Authority";
        content = (
          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Email Credentials</label>
              <input type="email" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="name@nexushr.com" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Authorization Level</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                <option>Super Admin</option>
                <option>HR Manager</option>
                <option>Manager</option>
                <option>Employee</option>
              </select>
            </div>
          </div>
        );
        break;
      case "manage_integration":
        title = "Manage Application Synchronization";
        content = (
          <div className="space-y-4">
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>Configure API mappings securely for this enterprise integration flow.</p>
          </div>
        );
        break;
      case "generate_api_key":
        title = "Issue Cryptographic API Tokens";
        content = (
          <div className="space-y-4">
            <p style={{ fontSize: "13px", color: "var(--muted-foreground)", margin: 0 }}>Generate secure background access keys granting immediate server verification.</p>
          </div>
        );
        break;
      case "add_webhook":
      case "edit_webhook":
        title = activeModal === "add_webhook" ? "Hook Service Callback" : "Modify Callback Bindings";
        content = (
          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "6px" }}>Target End-point URL</label>
              <input type="url" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all" style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }} placeholder="https://" />
            </div>
          </div>
        );
        break;
      default:
        return null;
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[2000]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <div className={`w-full ${activeModal === 'create_role' || activeModal === 'edit_role' ? 'max-w-2xl' : 'max-w-md'} rounded-2xl p-6 shadow-2xl border border-[var(--border)] relative`} style={{ backgroundColor: "var(--card)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
          <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{title}</h3>
              <button
                onClick={closeModal}
                className="text-2xl hover:opacity-70 transition-all cursor-pointer"
                style={{ color: "var(--muted-foreground)", background: "none", border: "none", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
          <div className="mb-6 overflow-y-auto pr-2" style={{ flexGrow: 1 }}>{content}</div>
          <div className="flex justify-end gap-3 flex-wrap mt-auto pt-4 border-t border-[var(--border)]">
            <button onClick={closeModal} className="px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer w-full sm:w-auto" style={{ border: "none", backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>Cancel</button>
            {(activeModal === "create_role" || activeModal === "edit_role") ? (
              <button onClick={handleRoleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto" style={{ border: "none", backgroundColor: "#00B87C" }}>
                {isSubmitting ? "Processing..." : (activeModal === "create_role" ? "Create Role" : "Save Changes")}
              </button>
            ) : activeModal === "confirm_edit_role" ? (
              <button onClick={confirmEditRoleSubmit} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto" style={{ border: "none", backgroundColor: "#00B87C" }}>
                {isSubmitting ? "Processing..." : "Confirm Save"}
              </button>
            ) : (
              <button onClick={() => { showToast("Parameters updated successfully"); closeModal(); }} className="px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer w-full sm:w-auto" style={{ border: "none", backgroundColor: "#00B87C" }}>Confirm</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderToast = () => {
    if (!toast) return null;
    return (
      <div className="fixed bottom-6 right-6 px-4 py-3 rounded-xl text-white shadow-2xl z-[2000] flex items-center gap-2 font-medium text-sm" style={{ backgroundColor: toast.type === "success" ? "#00B87C" : "#EF4444" }}>
        <CheckCircle size={16} />
        {toast.message}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
      {renderModal()}
      {renderToast()}
      {/* PAGE HEADER */}
      <div 
        className="sticky top-0 bg-[var(--background)] flex items-center gap-4 py-4 mb-6 border-b border-[var(--border)]"
        style={{ zIndex: 60 }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: "#DCFCE7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#00B87C",
          }}
        >
          <GearIcon size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.5px", margin: 0 }}>
            System Settings
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px", margin: 0 }}>
            System configuration and preferences
          </p>
        </div>
      </div>

      {/* MOBILE DRAWER TOGGLE */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 rounded-xl cursor-pointer transition-all border select-none"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        <GearIcon size={16} className="text-[#00B87C]" />
        <span style={{ fontSize: "13px", fontWeight: 600 }}>
          {isSidebarOpen ? "Close Menu" : "Settings Menu"}
        </span>
      </button>

      {/* 2-COLUMN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden relative">
        {/* LEFT COLUMN (Sub-nav) */}
        <div
          style={{
            width: "220px",
            backgroundColor: "var(--card)",
            borderRadius: "1rem",
            padding: "16px",
            border: "1px solid var(--border)",
            position: "sticky",
            top: "10px",
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
            alignSelf: "flex-start",
            zIndex: 40,
          }}
          className={`w-full md:w-[220px] flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? "block" : "hidden md:block"}`}
        >
          {/* Search Settings Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search settings..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-xs outline-none border transition-all"
              style={{ backgroundColor: "var(--input-background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          {sections
            .map((section) => {
              const filteredItems = section.items.filter((item) =>
                item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
              );
              return { ...section, items: filteredItems };
            })
            .filter((section) => section.items.length > 0)
            .map((section, idx) => {
              const isCollapsed = collapsedCategories.includes(section.title);
              return (
                <div key={section.title} className={idx > 0 ? "mt-4" : ""}>
                  <div
                    className="flex items-center justify-between cursor-pointer select-none mb-2"
                    onClick={() => {
                      setCollapsedCategories((prev) =>
                        isCollapsed
                          ? prev.filter((t) => t !== section.title)
                          : [...prev, section.title]
                      );
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {section.title}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`text-[#9CA3AF] transition-transform duration-200 ${isCollapsed ? "rotate-[-90deg]" : ""}`}
                    />
                  </div>

                  {!isCollapsed && (
                    <div className="flex flex-col gap-1">
                      {section.items.map((item) => {
                        const active = activeSubTab === item.id;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveSubTab(item.id);
                              setIsSidebarOpen(false); // Auto-close drawer on selection
                            }}
                            className="flex items-center gap-3 px-3 transition-all cursor-pointer select-none text-left"
                            style={{
                              backgroundColor: active ? "#00B87C" : "transparent",
                              color: active ? "white" : "var(--foreground)",
                              border: "none",
                              width: "100%",
                              height: "40px",
                              borderRadius: active ? "10px" : "8px",
                              fontFamily: "Inter, sans-serif",
                            }}
                            onMouseEnter={(e) => {
                              if (!active) {
                                e.currentTarget.style.backgroundColor = "#F0FDF4";
                                e.currentTarget.style.borderRadius = "8px";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!active) {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }
                            }}
                          >
                            <Icon size={14} style={{ color: active ? "white" : "var(--muted-foreground)" }} />
                            <span style={{ fontSize: "13px", fontWeight: active ? 700 : 500 }}>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* RIGHT COLUMN (Content) */}
        <div
          style={{
            flex: 1,
            backgroundColor: "var(--card)",
            borderRadius: "1rem",
            padding: "24px",
            border: "1px solid var(--border)",
            height: "calc(100vh - 180px)",
            overflowY: "auto",
          }}
          className="w-full"
        >
          {activeSubTab === "company" && renderCompanyProfile()}
          {activeSubTab === "departments" && renderDepartments()}
          {activeSubTab === "locations" && renderLocations()}
          {activeSubTab === "schedules" && renderWorkSchedules()}
          {activeSubTab === "holidays" && renderHolidayCalendar()}
          {activeSubTab === "attendance_policy" && renderAttendancePolicy()}
          {activeSubTab === "leave_policy" && renderLeavePolicy()}
          {activeSubTab === "payroll_settings" && renderPayrollSettings()}
          {activeSubTab === "performance_settings" && renderPerformanceSettings()}
          {activeSubTab === "user_management" && renderUserManagement()}
          {activeSubTab === "roles" && renderRolesAndPermissions()}
          {activeSubTab === "security" && renderSecuritySettings()}
          {activeSubTab === "audit_logs" && renderAuditLogs()}
          {activeSubTab === "connected_apps" && renderConnectedApps()}
          {activeSubTab === "api" && renderApiSettings()}
          {activeSubTab === "webhooks" && renderWebhooks()}
          {activeSubTab === "email_templates" && renderEmailTemplates()}
          {activeSubTab === "notification_rules" && renderNotificationRules()}
          {activeSubTab === "sms" && renderSmsSettings()}
          
          {activeSubTab === "appearance" && renderAppearance()}
          {activeSubTab === "language" && renderLanguageRegion()}
          {activeSubTab === "backup" && renderBackupRestore()}
          {activeSubTab === "import_export" && renderDataImportExport()}
          {activeSubTab === "workflows" && renderApprovalWorkflows()}
          {activeSubTab === "leave_approvals" && renderLeaveApprovals()}
          {activeSubTab === "shift_swaps" && renderShiftSwapRules()}
          {activeSubTab === "docs" && renderDocumentSettings()}
          {activeSubTab === "training" && renderTrainingSettings()}
          {activeSubTab === "onboarding" && renderOnboardingSettings()}
        </div>
      </div>
    </div>
  );
}
