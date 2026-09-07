import React, { useState, useMemo, useCallback, useReducer } from "react";
import { useNavigate } from "react-router";

interface ShiftTemplateFormState {
  showShiftTemplateModal: boolean;
  editingTemplate: ShiftTemplate | null;
  tmplName: string;
  tmplDesc: string;
  tmplDept: string;
  tmplRotation: "Weekly Rotation" | "Bi-weekly" | "Weekend Only" | "Custom Rotation";
  tmplStatus: "Active" | "Disabled";
  tmplShifts: ShiftDefinition[];
  tmplWeeklySchedule: Record<string, string>;
}

type ShiftTemplateFormAction =
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; template: ShiftTemplate }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FIELD"; field: keyof ShiftTemplateFormState; value: any };

const initialShiftTemplateFormState: ShiftTemplateFormState = {
  showShiftTemplateModal: false,
  editingTemplate: null,
  tmplName: "",
  tmplDesc: "",
  tmplDept: "Engineering",
  tmplRotation: "Weekly Rotation",
  tmplStatus: "Active",
  tmplShifts: [
    { id: "s-1", code: "MOR-01", name: "Morning Shift", startTime: "06:00 AM", endTime: "02:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 1 },
    { id: "s-2", code: "EVE-01", name: "Evening Shift", startTime: "02:00 PM", endTime: "10:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 2 },
  ],
  tmplWeeklySchedule: {
    Mon: "Morning",
    Tue: "Morning",
    Wed: "Morning",
    Thu: "Morning",
    Fri: "Morning",
    Sat: "Off Day",
    Sun: "Off Day",
  },
};

function shiftTemplateFormReducer(state: ShiftTemplateFormState, action: ShiftTemplateFormAction): ShiftTemplateFormState {
  switch (action.type) {
    case "OPEN_CREATE":
      return {
        ...initialShiftTemplateFormState,
        showShiftTemplateModal: true,
      };
    case "OPEN_EDIT":
      return {
        showShiftTemplateModal: true,
        editingTemplate: action.template,
        tmplName: action.template.name,
        tmplDesc: action.template.description || "",
        tmplDept: action.template.department,
        tmplRotation: action.template.rotationType,
        tmplStatus: action.template.status,
        tmplShifts: action.template.shifts || initialShiftTemplateFormState.tmplShifts,
        tmplWeeklySchedule: action.template.weeklySchedule || initialShiftTemplateFormState.tmplWeeklySchedule,
      };
    case "CLOSE_MODAL":
      return { ...state, showShiftTemplateModal: false };
    case "SET_FIELD":
      return { ...state, [action.field]: typeof action.value === "function" ? action.value(state[action.field]) : action.value };
    default:
      return state;
  }
}

interface OtTemplateFormState {
  showOtModal: boolean;
  editingOtTemplate: OvertimeTemplate | null;
  otName: string;
  otDesc: string;
  otMaxDaily: number;
  otMaxWeekly: number;
  otMinDuration: number;
  otApprovalRequired: boolean;
  otMultiplier: number;
  otEligibleShifts: string[];
  otEffectiveFrom: string;
  otEffectiveTo: string;
  otStatus: "Active" | "Disabled";
}

type OtTemplateFormAction =
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; template: OvertimeTemplate }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FIELD"; field: keyof OtTemplateFormState; value: any };

const initialOtTemplateFormState: OtTemplateFormState = {
  showOtModal: false,
  editingOtTemplate: null,
  otName: "",
  otDesc: "",
  otMaxDaily: 4,
  otMaxWeekly: 16,
  otMinDuration: 30,
  otApprovalRequired: true,
  otMultiplier: 1.5,
  otEligibleShifts: ["Morning", "Evening", "Night"],
  otEffectiveFrom: "2026-01-01",
  otEffectiveTo: "",
  otStatus: "Active",
};

function otTemplateFormReducer(state: OtTemplateFormState, action: OtTemplateFormAction): OtTemplateFormState {
  switch (action.type) {
    case "OPEN_CREATE":
      return {
        ...initialOtTemplateFormState,
        showOtModal: true,
      };
    case "OPEN_EDIT":
      return {
        showOtModal: true,
        editingOtTemplate: action.template,
        otName: action.template.name,
        otDesc: action.template.description || "",
        otMaxDaily: action.template.maxDailyOvertimeHours,
        otMaxWeekly: action.template.maxWeeklyOvertimeHours,
        otMinDuration: action.template.minOvertimeDurationMinutes,
        otApprovalRequired: action.template.overtimeApprovalRequired,
        otMultiplier: action.template.overtimeRateMultiplier,
        otEligibleShifts: action.template.eligibleShiftTypes || ["Morning", "Evening", "Night"],
        otEffectiveFrom: action.template.effectiveFrom || "2026-01-01",
        otEffectiveTo: action.template.effectiveTo || "",
        otStatus: action.template.status,
      };
    case "CLOSE_MODAL":
      return { ...state, showOtModal: false };
    case "SET_FIELD":
      return { ...state, [action.field]: typeof action.value === "function" ? action.value(state[action.field]) : action.value };
    default:
      return state;
  }
}

interface ApplyTemplateState {
  showApplyModal: boolean;
  applyStep: 1 | 2 | 3 | 4 | 5;
  applySelectedTemplateId: string;
  applyScopeType: "Department" | "Team" | "Employees";
  applyScopeDept: string;
  applySelectedEmpIds: string[];
  applyStartDate: string;
  applyEndDate: string;
  applyOverrideConflicts: boolean;
  applyPreviewData: {
    template: ShiftTemplate;
    targetEmployees: any[];
    dates: string[];
    conflicts: ConflictItem[];
    affectedEmployeesCount: number;
    affectedDaysCount: number;
  } | null;
}

type ApplyTemplateAction =
  | { type: "OPEN_MODAL" }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FIELD"; field: keyof ApplyTemplateState; value: any };

const initialApplyTemplateState: ApplyTemplateState = {
  showApplyModal: false,
  applyStep: 1,
  applySelectedTemplateId: "",
  applyScopeType: "Department",
  applyScopeDept: "All Departments",
  applySelectedEmpIds: [],
  applyStartDate: "2026-04-06",
  applyEndDate: "2026-04-12",
  applyOverrideConflicts: true,
  applyPreviewData: null,
};

function applyTemplateReducer(state: ApplyTemplateState, action: ApplyTemplateAction): ApplyTemplateState {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...initialApplyTemplateState,
        showApplyModal: true,
      };
    case "CLOSE_MODAL":
      return { ...state, showApplyModal: false };
    case "SET_FIELD":
      return { ...state, [action.field]: typeof action.value === "function" ? action.value(state[action.field]) : action.value };
    default:
      return state;
  }
}

interface AddShiftModalState {
  modalEmployeeName: string;
  modalShiftType: string;
  modalDate: string;
  modalNotes: string;
  showConflictConfirmation: boolean;
  validationError: string | null;
}

type AddShiftModalAction =
  | { type: "OPEN_MODAL"; employeeName: string; dateStr: string }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_FIELD"; field: keyof AddShiftModalState; value: any };

const initialAddShiftModalState: AddShiftModalState = {
  modalEmployeeName: "",
  modalShiftType: "Morning",
  modalDate: "2026-04-06",
  modalNotes: "",
  showConflictConfirmation: false,
  validationError: null,
};

function addShiftModalReducer(state: AddShiftModalState, action: AddShiftModalAction): AddShiftModalState {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...initialAddShiftModalState,
        modalEmployeeName: action.employeeName,
        modalDate: action.dateStr,
      };
    case "CLOSE_MODAL":
      return initialAddShiftModalState;
    case "SET_FIELD":
      return { ...state, [action.field]: typeof action.value === "function" ? action.value(state[action.field]) : action.value };
    default:
      return state;
  }
}

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Users,
  Clock,
  ArrowLeftRight,
  CalendarPlus,
  X,
  Search,
  Check,
  Calendar as CalendarIcon,
  Filter,
  Download,
  CalendarDays,
  Activity,
  UserCheck,
  MoreVertical as MoreIcon,
  AlertCircle,
  CheckCircle2,
  FileText,
  ShieldAlert,
  SlidersHorizontal,
  Trash2,
  Copy,
  Eye,
  Edit3,
  Power,
  Zap,
} from "lucide-react";
import { employees as globalEmployees } from "../../../data/mockData";
import { useAuth } from "../../../context/AuthContext";
import { usePermissions } from "../../../shared/permission-engine/PermissionContext";
import { P } from "../../../shared/permission-engine/permissions";
import { showToast } from "../../../components/workflow/ToastNotification";
import {
  ScheduleService,
  ShiftSwapRequest,
  ShiftTemplate,
  ShiftDefinition,
  OvertimeTemplate,
  ConflictItem,
} from "./scheduleService";

interface Shift {
  type: "Morning" | "Evening" | "Night" | "Full Day" | "Off Day";
  time: string;
  isOT?: boolean;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getDateString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const ShiftSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermissionKey } = usePermissions();

  const orgId = user?.organizationId || "org-nexus-01";
  const userDept = (user as any)?.department || "Engineering";

  // Canonical RBAC Permission Checks
  const hasGlobalManage =
    hasPermissionKey(P.SCHEDULE_MANAGE) || hasPermissionKey(P.SCHEDULE_FULL);
  const hasTeamView = hasPermissionKey(P.SCHEDULE_VIEW_TEAM);
  const canApprove = hasGlobalManage || hasTeamView;
  const canManageTemplates = hasGlobalManage;

  // Top-level tab state
  const [activeTab, setActiveTab] = useState<"schedule" | "requests" | "templates">("schedule");

  // Template Tab Sub-Toggle: Shift Templates vs Overtime Rules
  const [templateSubTab, setTemplateSubTab] = useState<"shift_templates" | "overtime_templates">("shift_templates");

  // Filter & Navigation State
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [showExportModal, setShowExportModal] = useState(false);
  const [view, setView] = useState<"Week" | "Month" | "Day">("Week");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 3, 6)); // Apr 6, 2026 (Monday)

  // Shift Overrides Map (Atomic schedule updates after approved swaps or applied templates)
  const [shiftOverrides, setShiftOverrides] = useState<Record<string, Shift>>({});

  // ── TEMPLATES STATE (BACKED BY SERVICE) ──────────────────────────────
  const [templates, setTemplates] = useState<ShiftTemplate[]>(() => {
    return ScheduleService.getShiftTemplates(orgId);
  });
  const [templateDeptFilter, setTemplateDeptFilter] = useState("All Departments");
  const [templateSearch, setTemplateSearch] = useState("");
  const [showTemplateMenu, setShowTemplateMenu] = useState<string | null>(null);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<ShiftTemplate | null>(null);

  // Shift Template Form Modal State (using useReducer)
  const [shiftTmplState, dispatchShiftTmpl] = useReducer(shiftTemplateFormReducer, initialShiftTemplateFormState);
  const {
    showShiftTemplateModal, editingTemplate, tmplName, tmplDesc, tmplDept,
    tmplRotation, tmplStatus, tmplShifts, tmplWeeklySchedule
  } = shiftTmplState;
  const setShowShiftTemplateModal = (v: boolean) => dispatchShiftTmpl({ type: "SET_FIELD", field: "showShiftTemplateModal", value: v });
  const setEditingTemplate = (v: any) => dispatchShiftTmpl({ type: "SET_FIELD", field: "editingTemplate", value: v });
  const setTmplName = (v: any) => dispatchShiftTmpl({ type: "SET_FIELD", field: "tmplName", value: v });
  const setTmplDesc = (v: any) => dispatchShiftTmpl({ type: "SET_FIELD", field: "tmplDesc", value: v });
  const setTmplDept = (v: any) => dispatchShiftTmpl({ type: "SET_FIELD", field: "tmplDept", value: v });
  const setTmplRotation = (v: any) => dispatchShiftTmpl({ type: "SET_FIELD", field: "tmplRotation", value: v });
  const setTmplStatus = (v: any) => dispatchShiftTmpl({ type: "SET_FIELD", field: "tmplStatus", value: v });
  const setTmplShifts = (v: any) => dispatchShiftTmpl({ type: "SET_FIELD", field: "tmplShifts", value: v });
  const setTmplWeeklySchedule = (v: any) => dispatchShiftTmpl({ type: "SET_FIELD", field: "tmplWeeklySchedule", value: v });

  // ── OVERTIME TEMPLATES STATE (BACKED BY SERVICE) ──────────────────────
  const [overtimeTemplates, setOvertimeTemplates] = useState<OvertimeTemplate[]>(() => {
    return ScheduleService.getOvertimeTemplates(orgId);
  });
  const [showOtMenu, setShowOtMenu] = useState<string | null>(null);
  const [selectedOtDetails, setSelectedOtDetails] = useState<OvertimeTemplate | null>(null);

  // Overtime Template Form Modal State (using useReducer)
  const [otTmplState, dispatchOtTmpl] = useReducer(otTemplateFormReducer, initialOtTemplateFormState);
  const {
    showOtModal, editingOtTemplate, otName, otDesc, otMaxDaily, otMaxWeekly,
    otMinDuration, otApprovalRequired, otMultiplier, otEligibleShifts, otEffectiveFrom, otEffectiveTo, otStatus
  } = otTmplState;
  const setShowOtModal = (v: boolean) => dispatchOtTmpl({ type: "SET_FIELD", field: "showOtModal", value: v });
  const setEditingOtTemplate = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "editingOtTemplate", value: v });
  const setOtName = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otName", value: v });
  const setOtDesc = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otDesc", value: v });
  const setOtMaxDaily = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otMaxDaily", value: v });
  const setOtMaxWeekly = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otMaxWeekly", value: v });
  const setOtMinDuration = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otMinDuration", value: v });
  const setOtApprovalRequired = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otApprovalRequired", value: v });
  const setOtMultiplier = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otMultiplier", value: v });
  const setOtEligibleShifts = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otEligibleShifts", value: v });
  const setOtEffectiveFrom = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otEffectiveFrom", value: v });
  const setOtEffectiveTo = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otEffectiveTo", value: v });
  const setOtStatus = (v: any) => dispatchOtTmpl({ type: "SET_FIELD", field: "otStatus", value: v });

  // ── APPLY SHIFT TEMPLATE MULTI-STEP MODAL STATE (using useReducer) ────
  const [applyState, dispatchApply] = useReducer(applyTemplateReducer, initialApplyTemplateState);
  const {
    showApplyModal, applyStep, applySelectedTemplateId, applyScopeType, applyScopeDept,
    applySelectedEmpIds, applyStartDate, applyEndDate, applyOverrideConflicts, applyPreviewData
  } = applyState;
  const setShowApplyModal = (v: boolean) => dispatchApply({ type: "SET_FIELD", field: "showApplyModal", value: v });
  const setApplyStep = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applyStep", value: v });
  const setApplySelectedTemplateId = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applySelectedTemplateId", value: v });
  const setApplyScopeType = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applyScopeType", value: v });
  const setApplyScopeDept = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applyScopeDept", value: v });
  const setApplySelectedEmpIds = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applySelectedEmpIds", value: v });
  const setApplyStartDate = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applyStartDate", value: v });
  const setApplyEndDate = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applyEndDate", value: v });
  const setApplyOverrideConflicts = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applyOverrideConflicts", value: v });
  const setApplyPreviewData = (v: any) => dispatchApply({ type: "SET_FIELD", field: "applyPreviewData", value: v });

  // Constant-time membership lookup for selected employee IDs (used in Apply modal scope selection)
  const applySelectedEmpIdsSet = useMemo(() => new Set(applySelectedEmpIds), [applySelectedEmpIds]);

  // Quick Assign Brush State
  const [activeBrush, setActiveBrush] = useState<string | null>(null);

  // Shift Swap Requests State (Backed by ScheduleService)
  const [requests, setRequests] = useState<ShiftSwapRequest[]>(() => {
    return ScheduleService.getShiftSwapRequests(orgId);
  });
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>("All Statuses");
  const [requestSearch, setRequestSearch] = useState("");
  const [requestDeptFilter, setRequestDeptFilter] = useState("All Departments");
  const [selectedSwapDetails, setSelectedSwapDetails] = useState<ShiftSwapRequest | null>(null);

  // Modals for Workflow Actions
  const [showCreateSwapModal, setShowCreateSwapModal] = useState(false);
  const [createTargetEmpId, setCreateTargetEmpId] = useState(globalEmployees[1]?.id || "");
  const [createDate, setCreateDate] = useState("2026-04-07");
  const [createCurrentShift, setCreateCurrentShift] = useState("Morning (06:00 - 14:00)");
  const [createRequestedShift, setCreateRequestedShift] = useState("Evening (14:00 - 22:00)");
  const [createReason, setCreateReason] = useState("");

  const [requestToApprove, setRequestToApprove] = useState<ShiftSwapRequest | null>(null);
  const [approvalComment, setApprovalComment] = useState("Approved for team coverage.");

  const [requestToReject, setRequestToReject] = useState<ShiftSwapRequest | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  const [requestToCancel, setRequestToCancel] = useState<ShiftSwapRequest | null>(null);

  // Add Shift Modal State & Hardening (using useReducer)
  const [addModalState, dispatchAddModal] = useReducer(addShiftModalReducer, initialAddShiftModalState);
  const { modalEmployeeName, modalShiftType, modalDate, modalNotes, showConflictConfirmation, validationError } = addModalState;

  // Dynamic Shift Options derived from Active Configured Templates & Standard Defaults
  const availableShiftOptions = useMemo(() => {
    const optionsMap = new Map<string, { type: string; label: string; time: string }>();

    // Standard default shifts
    optionsMap.set("Morning", { type: "Morning", label: "Morning (06:00 - 14:00)", time: "06:00 - 14:00" });
    optionsMap.set("Evening", { type: "Evening", label: "Evening (14:00 - 22:00)", time: "14:00 - 22:00" });
    optionsMap.set("Night", { type: "Night", label: "Night (22:00 - 06:00)", time: "22:00 - 06:00" });
    optionsMap.set("Full Day", { type: "Full Day", label: "Full Day (09:00 - 18:00)", time: "09:00 - 18:00" });
    optionsMap.set("Off Day", { type: "Off Day", label: "Off Day (Rest Day)", time: "Rest" });

    // Augment with configured shifts from active shift templates
    const activeTemplates = templates.filter((t) => t.status === "Active");
    activeTemplates.forEach((t) => {
      t.shifts.forEach((s) => {
        if (!optionsMap.has(s.name)) {
          optionsMap.set(s.name, {
            type: s.name,
            label: `${s.name} (${s.startTime} - ${s.endTime})`,
            time: `${s.startTime} - ${s.endTime}`,
          });
        }
      });
    });

    return Array.from(optionsMap.values());
  }, [templates]);

  // Dates for current week
  const dates = useMemo(() => {
    return days.map((_, i) => {
      const d = new Date(currentDate);
      d.setDate(currentDate.getDate() + i);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });
  }, [currentDate]);

  const weekDateStrings = useMemo(() => {
    return days.map((_, i) => {
      const d = new Date(currentDate);
      d.setDate(currentDate.getDate() + i);
      return getDateString(d);
    });
  }, [currentDate]);

  // Generate base schedule rows from global employees
  const [scheduleData, setScheduleData] = useState(() => {
    return globalEmployees.map((emp) => {
      return {
        id: emp.id,
        name: emp.name,
        dept: emp.department,
        initials: emp.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
        avatar: emp.avatar,
      };
    });
  });

  // Get shift for employee on specific date with Atomic Shift Override lookup
  const getShiftForDate = useCallback(
    (empName: string, dateStr: string): Shift | null => {
      const overrideKey = `${empName}_${dateStr}`;
      if (shiftOverrides[overrideKey] !== undefined) {
        return shiftOverrides[overrideKey];
      }
      const emp = scheduleData.find((e) => e.name === empName);
      if (!emp) return null;
      const hash = (empName + dateStr).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const shiftTypes: ("Morning" | "Evening" | "Night" | "Full Day" | null)[] = [
        "Morning",
        "Morning",
        "Evening",
        "Night",
        null,
        "Full Day",
        "Morning",
      ];
      const type = shiftTypes[hash % shiftTypes.length];
      if (!type) return null;
      let time = "09:00 - 18:00";
      if (type === "Morning") time = "06:00 - 14:00";
      if (type === "Evening") time = "14:00 - 22:00";
      if (type === "Night") time = "22:00 - 06:00";
      return {
        type,
        time,
        isOT: hash % 7 === 0,
      };
    },
    [scheduleData, shiftOverrides],
  );

  const departments = useMemo(() => {
    const set = new Set(globalEmployees.map((e) => e.department));
    return ["All Departments", ...Array.from(set)];
  }, []);

  const filteredSchedule = useMemo(() => {
    if (selectedDept === "All Departments") return scheduleData;
    return scheduleData.filter((e) => e.dept.toLowerCase() === selectedDept.toLowerCase());
  }, [scheduleData, selectedDept]);

  // Dynamic Shift Counts calculation (Responsive to applied templates, approved swaps, & date filters)
  const shiftCounts = useMemo(() => {
    let morning = 0;
    let evening = 0;
    let night = 0;
    let off = 0;
    const currentWeekDateStr = weekDateStrings[0];
    filteredSchedule.forEach((emp) => {
      const shift = getShiftForDate(emp.name, currentWeekDateStr);
      if (!shift || shift.type === "Off Day") {
        off++;
      } else if (shift.type === "Morning" || shift.type === "Full Day") {
        morning++;
      } else if (shift.type === "Evening") {
        evening++;
      } else if (shift.type === "Night") {
        night++;
      }
    });
    return { morning, evening, night, off, total: filteredSchedule.length };
  }, [filteredSchedule, weekDateStrings, getShiftForDate]);

  // Day breakdown
  const dayBreakdown = useMemo(() => {
    const morning: typeof scheduleData = [];
    const evening: typeof scheduleData = [];
    const night: typeof scheduleData = [];
    const off: typeof scheduleData = [];
    const dateStr = getDateString(currentDate);

    filteredSchedule.forEach((emp) => {
      const shift = getShiftForDate(emp.name, dateStr);
      if (!shift || shift.type === "Off Day") {
        off.push(emp);
      } else if (shift.type === "Morning" || shift.type === "Full Day") {
        morning.push(emp);
      } else if (shift.type === "Evening") {
        evening.push(emp);
      } else if (shift.type === "Night") {
        night.push(emp);
      } else {
        off.push(emp);
      }
    });
    return { morning, evening, night, off };
  }, [filteredSchedule, currentDate, getShiftForDate]);

  // Filtered Requests for Requests Tab
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = requestStatusFilter === "All Statuses" || r.status === requestStatusFilter;
      const matchesDept =
        requestDeptFilter === "All Departments" ||
        r.requesterDepartment.toLowerCase() === requestDeptFilter.toLowerCase() ||
        r.targetDepartment.toLowerCase() === requestDeptFilter.toLowerCase();
      const matchesSearch =
        !requestSearch.trim() ||
        r.id.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.requesterName.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.targetEmployeeName.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.reason.toLowerCase().includes(requestSearch.toLowerCase());
      return matchesStatus && matchesDept && matchesSearch;
    });
  }, [requests, requestStatusFilter, requestDeptFilter, requestSearch]);

  // Dynamic Pending count for KPI badge
  const pendingCount = useMemo(() => {
    return requests.filter((r) => r.status === "Pending" || r.status === "Manager Review").length;
  }, [requests]);

  // Filtered Templates for Templates Tab
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesDept = templateDeptFilter === "All Departments" || t.department.toLowerCase() === templateDeptFilter.toLowerCase();
      const matchesSearch = !templateSearch.trim() || t.name.toLowerCase().includes(templateSearch.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [templates, templateDeptFilter, templateSearch]);

  // Handlers for Date & Views
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "Week") newDate.setDate(currentDate.getDate() - 7);
    if (view === "Month") newDate.setMonth(currentDate.getMonth() - 1);
    if (view === "Day") newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "Week") newDate.setDate(currentDate.getDate() + 7);
    if (view === "Month") newDate.setMonth(currentDate.getMonth() + 1);
    if (view === "Day") newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 3, 6));
  };

  const handleDrop = (empId: string, dateStr: string, shiftType: string) => {
    const emp = scheduleData.find((e) => e.id === empId);
    if (!emp) return;
    const matchedOpt = availableShiftOptions.find((opt) => opt.type === shiftType);
    let time = matchedOpt ? matchedOpt.time : "09:00 - 18:00";
    if (shiftType === "Morning") time = "06:00 - 14:00";
    if (shiftType === "Evening") time = "14:00 - 22:00";
    if (shiftType === "Night") time = "22:00 - 06:00";

    setShiftOverrides((prev) => ({
      ...prev,
      [`${emp.name}_${dateStr}`]: {
        type: shiftType as any,
        time,
      },
    }));
    showToast(`Assigned ${shiftType} shift to ${emp.name} for ${dateStr}.`, "success");
  };

  // Hardened Add New Shift Form Submit Handler with Conflict Detection & Validation
  const handleAddShiftConfirm = (isConfirmedOverwrite = false) => {
    dispatchAddModal({ type: "SET_FIELD", field: "validationError", value: null });

    if (!modalEmployeeName) {
      dispatchAddModal({ type: "SET_FIELD", field: "validationError", value: "Employee selection is required." });
      return;
    }
    if (!modalShiftType) {
      dispatchAddModal({ type: "SET_FIELD", field: "validationError", value: "Shift type selection is required." });
      return;
    }
    if (!modalDate) {
      dispatchAddModal({ type: "SET_FIELD", field: "validationError", value: "Shift date selection is required." });
      return;
    }

    // Lookup existing shift for conflict detection
    const existingShift = getShiftForDate(modalEmployeeName, modalDate);
    const hasConflict = existingShift && existingShift.type !== "Off Day";

    if (hasConflict && !isConfirmedOverwrite) {
      dispatchAddModal({ type: "SET_FIELD", field: "showConflictConfirmation", value: true });
      return;
    }

    // Determine timing from configured options or defaults
    const matchedOption = availableShiftOptions.find((opt) => opt.type === modalShiftType);
    let time = matchedOption ? matchedOption.time : "09:00 - 18:00";
    if (modalShiftType === "Morning") time = "06:00 - 14:00";
    if (modalShiftType === "Evening") time = "14:00 - 22:00";
    if (modalShiftType === "Night") time = "22:00 - 06:00";
    if (modalShiftType === "Full Day") time = "09:00 - 18:00";
    if (modalShiftType === "Off Day") time = "Rest";

    // Atomically update schedule overrides
    setShiftOverrides((prev) => ({
      ...prev,
      [`${modalEmployeeName}_${modalDate}`]: {
        type: modalShiftType as any,
        time,
      },
    }));

    // Log audit trail event
    try {
      ScheduleService.logAuditEvent(
        {
          action: "SHIFT_ASSIGNED",
          actorId: user?.email || "admin",
          actorName: user?.name || "Admin",
          targetName: modalEmployeeName,
          details: `Assigned ${modalShiftType} shift (${time}) for ${modalDate}`,
        },
        orgId
      );
    } catch (e) {
      // Non-blocking log write
    }

    // Reset modal state & provide clear feedback
    dispatchAddModal({ type: "CLOSE_MODAL" });
    setShowAddModal(false);
    showToast("Shift assigned successfully.", "success");
  };

  const changeView = (v: "Week" | "Month" | "Day") => {
    setView(v);
  };

  const navLabel = useMemo(() => {
    if (view === "Week") {
      const start = dates[0];
      const end = dates[6];
      return `${start} - ${end}, ${currentDate.getFullYear()}`;
    }
    if (view === "Month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    return currentDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [view, dates, currentDate]);

  const handleExport = () => {
    setShowExportModal(true);
    setTimeout(() => {
      setShowExportModal(false);
      showToast("Schedule export completed.", "success");
    }, 1500);
  };

  // ── WORKFLOW ACTIONS (TASK 9.3) ───────────────────────────────────

  const handleCreateSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmp = globalEmployees.find((e) => e.id === createTargetEmpId);
    if (!targetEmp) {
      showToast("Please select a valid target employee.", "error");
      return;
    }

    try {
      ScheduleService.createSwapRequest(
        {
          requesterId: user?.email || "emp-sarah",
          requesterName: user?.name || "Sarah Johnson",
          requesterDepartment: userDept,
          targetEmployeeId: targetEmp.id,
          targetEmployeeName: targetEmp.name,
          targetDepartment: targetEmp.department,
          date: createDate,
          currentShiftName: createCurrentShift,
          requestedShiftName: createRequestedShift,
          reason: createReason,
        },
        orgId,
      );

      setRequests(ScheduleService.getShiftSwapRequests(orgId));
      setShowCreateSwapModal(false);
      setCreateReason("");
      showToast("Shift swap request submitted successfully.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to submit swap request.", "error");
    }
  };

  const handleApproveConfirm = () => {
    if (!requestToApprove) return;

    const result = ScheduleService.approveSwapRequest(
      requestToApprove.id,
      user?.email || "usr-alex-mgr",
      user?.name || "Alex Turner (Manager)",
      userDept,
      hasGlobalManage,
      approvalComment,
      orgId,
    );

    if (!result.success) {
      showToast(result.errorMessage || "Approval failed.", "error");
      return;
    }

    const reqName = requestToApprove.requesterName;
    const targetName = requestToApprove.targetEmployeeName;
    const dateStr = requestToApprove.date;

    const reqCurrentShift = getShiftForDate(reqName, dateStr) || { type: "Morning", time: "06:00 - 14:00" };
    const targetCurrentShift = getShiftForDate(targetName, dateStr) || { type: "Evening", time: "14:00 - 22:00" };

    setShiftOverrides((prev) => ({
      ...prev,
      [`${reqName}_${dateStr}`]: targetCurrentShift,
      [`${targetName}_${dateStr}`]: reqCurrentShift,
    }));

    setRequests(ScheduleService.getShiftSwapRequests(orgId));
    setRequestToApprove(null);
    if (selectedSwapDetails?.id === requestToApprove.id) {
      setSelectedSwapDetails(result.request);
    }

    showToast("Shift swap approved and schedule updated.", "success");
  };

  const handleRejectConfirm = () => {
    if (!requestToReject) return;
    if (!rejectionReasonInput.trim()) {
      showToast("Rejection reason is required.", "error");
      return;
    }

    const result = ScheduleService.rejectSwapRequest(
      requestToReject.id,
      user?.email || "usr-alex-mgr",
      user?.name || "Alex Turner (Manager)",
      userDept,
      hasGlobalManage,
      rejectionReasonInput,
      orgId,
    );

    if (!result.success) {
      showToast(result.errorMessage || "Rejection failed.", "error");
      return;
    }

    setRequests(ScheduleService.getShiftSwapRequests(orgId));
    setRequestToReject(null);
    setRejectionReasonInput("");
    if (selectedSwapDetails?.id === requestToReject.id) {
      setSelectedSwapDetails(result.request);
    }

    showToast("Shift swap request rejected.", "info");
  };

  const handleCancelConfirm = () => {
    if (!requestToCancel) return;

    const result = ScheduleService.cancelSwapRequest(
      requestToCancel.id,
      user?.email || "usr-emp-01",
      user?.name || "Employee",
      orgId,
    );

    if (!result.success) {
      showToast(result.errorMessage || "Cancellation failed.", "error");
      return;
    }

    setRequests(ScheduleService.getShiftSwapRequests(orgId));
    setRequestToCancel(null);
    if (selectedSwapDetails?.id === requestToCancel.id) {
      setSelectedSwapDetails(result.request);
    }

    showToast("Shift swap request cancelled.", "info");
  };

  // ── SHIFT TEMPLATE HANDLERS (TASK 9.4) ───────────────────────────────

  const openCreateTemplateModal = () => {
    if (!canManageTemplates) {
      showToast("Permission denied: Template management requires Admin rights.", "error");
      return;
    }
    setEditingTemplate(null);
    setTmplName("");
    setTmplDesc("");
    setTmplDept("Engineering");
    setTmplRotation("Weekly Rotation");
    setTmplStatus("Active");
    setTmplShifts([
      { id: "s-1", code: "MOR-01", name: "Morning Shift", startTime: "06:00 AM", endTime: "02:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 1 },
      { id: "s-2", code: "EVE-01", name: "Evening Shift", startTime: "02:00 PM", endTime: "10:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 2 },
    ]);
    setShowShiftTemplateModal(true);
  };

  const openEditTemplateModal = (tmpl: ShiftTemplate) => {
    if (!canManageTemplates) {
      showToast("Permission denied: Template management requires Admin rights.", "error");
      return;
    }
    setEditingTemplate(tmpl);
    setTmplName(tmpl.name);
    setTmplDesc(tmpl.description || "");
    setTmplDept(tmpl.department);
    setTmplRotation(tmpl.rotationType);
    setTmplStatus(tmpl.status);
    setTmplShifts(tmpl.shifts.length > 0 ? tmpl.shifts : [
      { id: "s-1", code: "MOR-01", name: "Morning Shift", startTime: "06:00 AM", endTime: "02:00 PM", breakDurationMinutes: 45, workingHours: 8, displayOrder: 1 },
    ]);
    setTmplWeeklySchedule(tmpl.weeklySchedule || {
      Mon: "Morning", Tue: "Morning", Wed: "Morning", Thu: "Morning", Fri: "Morning", Sat: "Off Day", Sun: "Off Day"
    });
    setShowShiftTemplateModal(true);
  };

  const handleSaveShiftTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        ScheduleService.updateShiftTemplate(
          editingTemplate.id,
          {
            name: tmplName,
            description: tmplDesc,
            department: tmplDept,
            rotationType: tmplRotation,
            status: tmplStatus,
            shifts: tmplShifts,
            weeklySchedule: tmplWeeklySchedule,
          },
          user?.email || "admin",
          user?.name || "Admin",
          orgId,
        );
        showToast(`Template '${tmplName}' updated successfully.`, "success");
      } else {
        ScheduleService.createShiftTemplate(
          {
            name: tmplName,
            description: tmplDesc,
            department: tmplDept,
            rotationType: tmplRotation,
            status: tmplStatus,
            shifts: tmplShifts,
            weeklySchedule: tmplWeeklySchedule,
          },
          user?.email || "admin",
          user?.name || "Admin",
          orgId,
        );
        showToast(`Template '${tmplName}' created successfully.`, "success");
      }
      setTemplates(ScheduleService.getShiftTemplates(orgId));
      setShowShiftTemplateModal(false);
    } catch (err: any) {
      showToast(err.message || "Failed to save template.", "error");
    }
  };

  const handleDuplicateTemplate = (tmpl: ShiftTemplate) => {
    try {
      const dup = ScheduleService.duplicateShiftTemplate(
        tmpl.id,
        `${tmpl.name} (Copy)`,
        user?.email || "admin",
        user?.name || "Admin",
        orgId,
      );
      setTemplates(ScheduleService.getShiftTemplates(orgId));
      showToast(`Duplicated '${tmpl.name}' as '${dup.name}'.`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to duplicate template.", "error");
    }
  };

  const handleToggleTemplateStatus = (tmpl: ShiftTemplate) => {
    try {
      const newStatus = tmpl.status === "Active" ? "Disabled" : "Active";
      ScheduleService.toggleTemplateStatus(
        tmpl.id,
        newStatus,
        user?.email || "admin",
        user?.name || "Admin",
        orgId,
      );
      setTemplates(ScheduleService.getShiftTemplates(orgId));
      showToast(`Template '${tmpl.name}' status set to ${newStatus}.`, "info");
    } catch (err: any) {
      showToast(err.message || "Failed to change template status.", "error");
    }
  };

  // ── OVERTIME TEMPLATE HANDLERS (TASK 9.4) ─────────────────────────────

  const openCreateOtModal = () => {
    if (!canManageTemplates) {
      showToast("Permission denied: Overtime configuration requires Admin rights.", "error");
      return;
    }
    setEditingOtTemplate(null);
    setOtName("");
    setOtDesc("");
    setOtMaxDaily(4);
    setOtMaxWeekly(16);
    setOtMinDuration(30);
    setOtApprovalRequired(true);
    setOtMultiplier(1.5);
    setOtEligibleShifts(["Morning", "Evening", "Night"]);
    setOtEffectiveFrom("2026-01-01");
    setOtEffectiveTo("");
    setOtStatus("Active");
    setShowOtModal(true);
  };

  const openEditOtModal = (ot: OvertimeTemplate) => {
    if (!canManageTemplates) {
      showToast("Permission denied: Overtime configuration requires Admin rights.", "error");
      return;
    }
    setEditingOtTemplate(ot);
    setOtName(ot.name);
    setOtDesc(ot.description || "");
    setOtMaxDaily(ot.maxDailyOvertimeHours);
    setOtMaxWeekly(ot.maxWeeklyOvertimeHours);
    setOtMinDuration(ot.minOvertimeDurationMinutes);
    setOtApprovalRequired(ot.overtimeApprovalRequired);
    setOtMultiplier(ot.overtimeRateMultiplier);
    setOtEligibleShifts(ot.eligibleShiftTypes);
    setOtEffectiveFrom(ot.effectiveFrom);
    setOtEffectiveTo(ot.effectiveTo || "");
    setOtStatus(ot.status);
    setShowOtModal(true);
  };

  const handleSaveOtTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOtTemplate) {
        ScheduleService.updateOvertimeTemplate(
          editingOtTemplate.id,
          {
            name: otName,
            description: otDesc,
            maxDailyOvertimeHours: Number(otMaxDaily),
            maxWeeklyOvertimeHours: Number(otMaxWeekly),
            minOvertimeDurationMinutes: Number(otMinDuration),
            overtimeApprovalRequired: otApprovalRequired,
            overtimeRateMultiplier: Number(otMultiplier),
            eligibleShiftTypes: otEligibleShifts,
            effectiveFrom: otEffectiveFrom,
            effectiveTo: otEffectiveTo || undefined,
            status: otStatus,
          },
          user?.email || "admin",
          user?.name || "Admin",
          orgId,
        );
        showToast(`Overtime template '${otName}' updated successfully.`, "success");
      } else {
        ScheduleService.createOvertimeTemplate(
          {
            name: otName,
            description: otDesc,
            maxDailyOvertimeHours: Number(otMaxDaily),
            maxWeeklyOvertimeHours: Number(otMaxWeekly),
            minOvertimeDurationMinutes: Number(otMinDuration),
            overtimeApprovalRequired: otApprovalRequired,
            overtimeRateMultiplier: Number(otMultiplier),
            eligibleShiftTypes: otEligibleShifts,
            effectiveFrom: otEffectiveFrom,
            effectiveTo: otEffectiveTo || undefined,
            status: otStatus,
          },
          user?.email || "admin",
          user?.name || "Admin",
          orgId,
        );
        showToast(`Overtime template '${otName}' created successfully.`, "success");
      }
      setOvertimeTemplates(ScheduleService.getOvertimeTemplates(orgId));
      setShowOtModal(false);
    } catch (err: any) {
      showToast(err.message || "Failed to save overtime template.", "error");
    }
  };

  const handleDuplicateOtTemplate = (ot: OvertimeTemplate) => {
    try {
      const dup = ScheduleService.duplicateOvertimeTemplate(
        ot.id,
        `${ot.name} (Copy)`,
        user?.email || "admin",
        user?.name || "Admin",
        orgId,
      );
      setOvertimeTemplates(ScheduleService.getOvertimeTemplates(orgId));
      showToast(`Duplicated '${ot.name}' as '${dup.name}'.`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to duplicate overtime template.", "error");
    }
  };

  const handleToggleOtStatus = (ot: OvertimeTemplate) => {
    try {
      const newStatus = ot.status === "Active" ? "Disabled" : "Active";
      ScheduleService.toggleOvertimeTemplateStatus(
        ot.id,
        newStatus,
        user?.email || "admin",
        user?.name || "Admin",
        orgId,
      );
      setOvertimeTemplates(ScheduleService.getOvertimeTemplates(orgId));
      showToast(`Overtime template '${ot.name}' status set to ${newStatus}.`, "info");
    } catch (err: any) {
      showToast(err.message || "Failed to change status.", "error");
    }
  };

  // ── APPLY SHIFT TEMPLATE WORKFLOW HANDLERS (TASK 9.4) ─────────────────

  const openApplyTemplateWorkflow = (tmpl?: ShiftTemplate) => {
    const activeTemplates = templates.filter((t) => t.status === "Active");
    if (activeTemplates.length === 0) {
      showToast("No active shift templates available to apply.", "error");
      return;
    }
    const target = tmpl && tmpl.status === "Active" ? tmpl : activeTemplates[0];
    setApplySelectedTemplateId(target.id);
    setApplyScopeType("Department");
    setApplyScopeDept(target.department === "All Departments" ? "Engineering" : target.department);
    setApplySelectedEmpIds(globalEmployees.map((e) => e.id));
    setApplyStartDate("2026-04-06");
    setApplyEndDate("2026-04-12");
    setApplyOverrideConflicts(true);
    setApplyStep(1);
    setShowApplyModal(true);
  };

  const handleApplyNextStep = () => {
    if (applyStep === 3) {
      try {
        const scopeVals =
          applyScopeType === "Department"
            ? [applyScopeDept]
            : applyScopeType === "Employees"
              ? applySelectedEmpIds
              : [];

        const preview = ScheduleService.previewApplyTemplate(
          {
            templateId: applySelectedTemplateId,
            scopeType: applyScopeType,
            scopeValues: scopeVals,
            startDate: applyStartDate,
            endDate: applyEndDate,
            overrideConflicts: applyOverrideConflicts,
          },
          globalEmployees,
          shiftOverrides,
          orgId,
        );
        setApplyPreviewData(preview);
        setApplyStep(4);
      } catch (err: any) {
        showToast(err.message || "Preview calculation failed.", "error");
      }
    } else if (applyStep < 5) {
      setApplyStep((prev) => (prev + 1) as any);
    }
  };

  const handleConfirmApplyTemplate = () => {
    if (!applyPreviewData) return;
    try {
      const scopeVals =
        applyScopeType === "Department"
          ? [applyScopeDept]
          : applyScopeType === "Employees"
            ? applySelectedEmpIds
            : [];

      const result = ScheduleService.applyShiftTemplate(
        {
          templateId: applySelectedTemplateId,
          scopeType: applyScopeType,
          scopeValues: scopeVals,
          startDate: applyStartDate,
          endDate: applyEndDate,
          overrideConflicts: applyOverrideConflicts,
        },
        globalEmployees,
        shiftOverrides,
        user?.email || "admin",
        user?.name || "Admin",
        orgId,
      );

      setShiftOverrides(result.appliedOverrides);
      setTemplates(ScheduleService.getShiftTemplates(orgId));
      setShowApplyModal(false);
      showToast(result.message, "success");
    } catch (err: any) {
      showToast(err.message || "Application failed.", "error");
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 pb-10">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Schedule Management
          </h2>
          <p
            className="text-sm font-medium mt-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Manage employee schedules, shift swap requests, shift templates, apply routines, and overtime configuration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "schedule" && (
            <>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-bold rounded-xl border border-dashed transition-all hover:bg-neutral-50 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Download size={16} />
                  {showExportModal ? "Exporting..." : "Export Schedule"}
                </div>
              </button>
              <button
                onClick={() => openApplyTemplateWorkflow()}
                className="px-4 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-xl hover:bg-emerald-100 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Zap size={16} />
                <span>Apply Template</span>
              </button>
              <button
                onClick={() => {
                  if (!canApprove) {
                    showToast("Permission denied: Schedule management rights required.", "error");
                    return;
                  }
                  dispatchAddModal({
                    type: "OPEN_MODAL",
                    employeeName: modalEmployeeName || globalEmployees[0]?.name || "",
                    dateStr: getDateString(currentDate),
                  });
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-lg shadow-emerald-600/20 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #059669, #0D9488)",
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="font-bold">Add Shift</span>
              </button>
            </>
          )}

          {activeTab === "requests" && (
            <button
              onClick={() => setShowCreateSwapModal(true)}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-white shadow-lg shadow-emerald-600/20 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #059669, #0D9488)",
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="font-bold">Create Swap Request</span>
            </button>
          )}

          {activeTab === "templates" && (
            <div className="flex items-center gap-3">
              {templateSubTab === "shift_templates" ? (
                <>
                  <button
                    onClick={() => openApplyTemplateWorkflow()}
                    className="px-4 py-2 text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap size={14} />
                    <span>Apply Template</span>
                  </button>
                  <button
                    onClick={openCreateTemplateModal}
                    className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/20 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #059669, #0D9488)",
                    }}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Create Template</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={openCreateOtModal}
                  className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-purple-600/20 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Create OT Template</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Top-Level Tab Navigation ────────────────────────────────── */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "schedule"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarIcon size={16} />
          <span>Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 relative cursor-pointer ${
            activeTab === "requests"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowLeftRight size={16} />
          <span>Requests</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-white rounded-full">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "templates"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarPlus size={16} />
          <span>Shift Templates</span>
        </button>
      </div>

      {/* ── TAB 1: SCHEDULE ─────────────────────────────────────────── */}
      {activeTab === "schedule" && (
        <div className="animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl">
                <button
                  className="p-1.5 rounded-lg hover:bg-[#00B87C]/[0.08] transition-colors text-muted-foreground hover:text-primary active:scale-90 cursor-pointer"
                  onClick={handlePrev}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-bold px-3 text-foreground min-w-[180px] text-center">
                  {navLabel}
                </span>
                <button
                  className="p-1.5 rounded-lg hover:bg-[#00B87C]/[0.08] transition-colors text-muted-foreground hover:text-primary active:scale-90 cursor-pointer"
                  onClick={handleNext}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <button
                className="px-4 py-2 text-sm font-bold text-primary bg-secondary border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors active:scale-95 cursor-pointer"
                onClick={handleToday}
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Filter
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <select
                  className="pl-9 pr-6 py-2 rounded-xl border border-border bg-background text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
              </div>

              <div className="flex p-1 bg-secondary rounded-xl">
                {["Week", "Month", "Day"].map((v) => (
                  <button
                    key={v}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      view === v
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => changeView(v as "Week" | "Month" | "Day")}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scheduling Metric Cards with Accurate Dynamic Shift Counts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Total Employees */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Total Employees
                </p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">
                  {filteredSchedule.length}
                </p>
                <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
                  Active in schedule
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
            </div>

            {/* Pending Shift Swaps */}
            <div
              onClick={() => setActiveTab("requests")}
              className="bg-card rounded-2xl p-5 border border-border shadow-sm flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Pending Shift Swaps
                </p>
                <p className="text-3xl font-extrabold text-amber-600 tracking-tight">
                  {pendingCount}
                </p>
                <span className="text-[11px] font-bold text-primary hover:underline mt-1 inline-flex items-center gap-1">
                  Review Applications <ArrowLeftRight size={10} />
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
                <CalendarDays size={24} />
              </div>
            </div>

            {/* Shift Count Summary (Dynamic stats derived from active schedule & overrides) */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex items-center justify-between">
              <div className="w-full">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                  <span>Shift Counts Summary</span>
                  <span className="text-[10px] text-emerald-600 font-extrabold lowercase">
                    dynamic
                  </span>
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <span className="text-xs font-extrabold text-emerald-600 block">
                      {shiftCounts.morning}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      MOR
                    </span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl border border-amber-100 dark:border-amber-800/30">
                    <span className="text-xs font-extrabold text-amber-600 block">
                      {shiftCounts.evening}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                      EVE
                    </span>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <span className="text-xs font-extrabold text-purple-600 block">
                      {shiftCounts.night}
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400">
                      NGT
                    </span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-border">
                    <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 block">
                      {shiftCounts.off}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      OFF
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Assign Toolbar */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <CalendarPlus size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">
                    Quick Assign
                  </p>
                  <p className="text-xs font-black text-foreground leading-none">
                    Select brush or drag shift to slot
                  </p>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-border mx-2"></div>
              <div className="flex gap-4">
                {[
                  { type: "Morning", color: "bg-[#00B87C]", label: "MOR" },
                  { type: "Evening", color: "bg-[#F59E0B]", label: "EVE" },
                  { type: "Night", color: "bg-[#7C3AED]", label: "NGT" },
                  { type: "Off Day", color: "bg-[#90A4AE]", label: "OFF" },
                ].map((type) => (
                  <div
                    key={type.type}
                    draggable="true"
                    onDragStart={(e) => e.dataTransfer.setData("shiftType", type.type)}
                    onClick={() => setActiveBrush(activeBrush === type.type ? null : type.type)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-grab active:cursor-grabbing transition-all hover:bg-secondary select-none ${
                      activeBrush === type.type
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border border-primary/30"
                        : ""
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full ${type.color} flex items-center justify-center text-white text-[9px] font-black shadow-sm`}>
                      {type.label}
                    </div>
                    <span className="text-xs font-extrabold text-foreground pr-1">
                      {type.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase text-emerald-600 tracking-widest leading-none mb-1">
                  Active Scope
                </p>
                <p className="text-sm font-bold text-foreground leading-none">
                  {selectedDept}
                </p>
              </div>
            </div>
          </div>

          {/* Week View Grid */}
          {view === "Week" && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-[240px_repeat(7,1fr)] bg-secondary/50 border-b border-border">
                <div className="px-4 py-3 text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center">
                  Employee
                </div>
                {days.map((day, i) => (
                  <div
                    key={day}
                    className={`px-3 py-3 text-center border-l border-border flex flex-col justify-center ${
                      day === "Mon" ? "bg-primary/5" : ""
                    }`}
                  >
                    <span className={`text-xs font-extrabold ${day === "Mon" ? "text-primary" : "text-foreground"}`}>
                      {day}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-bold">
                      {dates[i]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid-body divide-y divide-border">
                {filteredSchedule.map((emp) => (
                  <div
                    key={emp.id}
                    className="grid grid-cols-[240px_repeat(7,1fr)] hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors h-[60px]"
                  >
                    <div className="px-4 py-2 flex items-center gap-3 border-r border-border/50">
                      <div className="relative flex-shrink-0">
                        <img
                          src={emp.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-extrabold text-foreground leading-tight truncate">
                          {emp.name}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-tight mt-0.5">
                          {emp.dept}
                        </span>
                      </div>
                    </div>
                    {days.map((day, i) => {
                      const dateStr = weekDateStrings[i];
                      const shift = getShiftForDate(emp.name, dateStr);
                      return (
                        <div
                          key={day}
                          className="border-l border-border/50 p-1 flex items-stretch"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const shiftType = e.dataTransfer.getData("shiftType");
                            if (shiftType) {
                              handleDrop(emp.id, dateStr, shiftType);
                            }
                          }}
                          onClick={() => {
                            if (activeBrush) {
                              handleDrop(emp.id, dateStr, activeBrush);
                            } else {
                              if (!canApprove) {
                                showToast("Permission denied: Schedule management rights required.", "error");
                                return;
                              }
                              dispatchAddModal({
                                type: "OPEN_MODAL",
                                employeeName: emp.name,
                                dateStr,
                              });
                              dispatchAddModal({ type: "SET_FIELD", field: "modalShiftType", value: shift ? shift.type : "Morning" });
                              setShowAddModal(true);
                            }
                          }}
                        >
                          {shift && shift.type !== "Off Day" ? (
                            <div
                              className={`flex-1 rounded-xl p-2 flex flex-col justify-center text-left transition-all hover:scale-[1.02] cursor-pointer shadow-sm relative group ${
                                shift.type === "Morning"
                                  ? "bg-secondary text-primary border-l-4 border-l-primary"
                                  : shift.type === "Evening"
                                    ? "bg-amber-500/10 text-amber-600 border-l-4 border-l-amber-500"
                                    : shift.type === "Night"
                                      ? "bg-purple-500/10 text-purple-600 border-l-4 border-l-purple-500"
                                      : "bg-blue-500/10 text-blue-600 border-l-4 border-l-blue-500"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[11px] font-semibold uppercase tracking-tight">
                                  {shift.type}
                                </span>
                              </div>
                              <span className="text-[11px] font-bold opacity-80">
                                {shift.time}
                              </span>
                            </div>
                          ) : (
                            <div className="flex-1 rounded-xl border border-dashed border-border/60 hover:border-emerald-500/50 hover:bg-emerald-50/20 transition-colors flex items-center justify-center text-muted-foreground/40 hover:text-emerald-500 cursor-pointer">
                              <Plus size={12} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Month View Coverage Calendar */}
          {view === "Month" &&
            (() => {
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth();
              const firstDay = new Date(year, month, 1);
              const rawDay = firstDay.getDay();
              const startOffset = rawDay === 0 ? 6 : rawDay - 1;
              const totalDays = new Date(year, month + 1, 0).getDate();
              const monthLabel = currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });
              return (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                      {monthLabel} — Team Shift Coverage
                    </h3>
                    <span className="text-xs font-bold text-muted-foreground">
                      🟢 Morning | 🟡 Evening | 🟣 Night
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
                      <div
                        key={w}
                        className="py-2.5 text-center text-xs font-black text-muted-foreground uppercase tracking-wider bg-secondary/30 rounded-lg"
                      >
                        {w}
                      </div>
                    ))}

                    {Array.from({ length: startOffset }).map((_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        className="min-h-[90px] p-2 bg-secondary/10 rounded-xl border border-dashed border-border/40 opacity-30"
                      />
                    ))}

                    {Array.from({ length: totalDays }, (_, i) => {
                      const day = i + 1;
                      const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      let morningCount = 0;
                      let eveningCount = 0;
                      let nightCount = 0;
                      filteredSchedule.forEach((emp) => {
                        const shift = getShiftForDate(emp.name, dStr);
                        if (shift) {
                          if (shift.type === "Morning" || shift.type === "Full Day") morningCount++;
                          else if (shift.type === "Evening") eveningCount++;
                          else if (shift.type === "Night") nightCount++;
                        }
                      });
                      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                      const isSelected =
                        currentDate.getDate() === day &&
                        currentDate.getMonth() === month &&
                        currentDate.getFullYear() === year;

                      return (
                        <div
                          key={day}
                          onClick={() => {
                            setCurrentDate(new Date(year, month, day));
                            setView("Day");
                          }}
                          className={`min-h-[90px] p-3 bg-secondary/20 hover:bg-emerald-500/5 rounded-xl border hover:border-primary/50 transition-all flex flex-col justify-between group cursor-pointer ${
                            isSelected ? "border-primary/70 ring-1 ring-primary/20" : "border-border"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-xs font-black group-hover:text-primary transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {day}
                            </span>
                            {isToday && <span className="w-1.5 h-1.5 rounded-full bg-primary" title="Today" />}
                          </div>

                          <div className="space-y-1 mt-2">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
                              <span>{morningCount} MOR</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                              <span>{eveningCount} EVE</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                              <span>{nightCount} NGT</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          {/* Day View Columns */}
          {view === "Day" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-in fade-in duration-300">
              {/* Morning */}
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col h-[400px]">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00B87C]" />
                    <span className="text-sm font-extrabold text-foreground">Morning Shift</span>
                  </div>
                  <span className="text-xs font-black bg-secondary text-primary px-2 py-0.5 rounded-md">
                    {dayBreakdown.morning.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {dayBreakdown.morning.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3 p-2 bg-secondary/35 rounded-xl border border-transparent hover:border-border/60 transition-all">
                      <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-foreground truncate">{emp.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{emp.dept}</p>
                      </div>
                    </div>
                  ))}
                  {dayBreakdown.morning.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-8">No employees scheduled</p>
                  )}
                </div>
              </div>

              {/* Evening */}
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col h-[400px]">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="text-sm font-extrabold text-foreground">Evening Shift</span>
                  </div>
                  <span className="text-xs font-black bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">
                    {dayBreakdown.evening.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {dayBreakdown.evening.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3 p-2 bg-secondary/35 rounded-xl border border-transparent hover:border-border/60 transition-all">
                      <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-foreground truncate">{emp.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{emp.dept}</p>
                      </div>
                    </div>
                  ))}
                  {dayBreakdown.evening.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-8">No employees scheduled</p>
                  )}
                </div>
              </div>

              {/* Night */}
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col h-[400px]">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                    <span className="text-sm font-extrabold text-foreground">Night Shift</span>
                  </div>
                  <span className="text-xs font-black bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-md">
                    {dayBreakdown.night.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {dayBreakdown.night.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3 p-2 bg-secondary/35 rounded-xl border border-transparent hover:border-border/60 transition-all">
                      <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-foreground truncate">{emp.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{emp.dept}</p>
                      </div>
                    </div>
                  ))}
                  {dayBreakdown.night.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-8">No employees scheduled</p>
                  )}
                </div>
              </div>

              {/* Off Day */}
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col h-[400px]">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#90A4AE]" />
                    <span className="text-sm font-extrabold text-foreground">Rest / Off Day</span>
                  </div>
                  <span className="text-xs font-black bg-slate-500/10 text-slate-600 px-2 py-0.5 rounded-md">
                    {dayBreakdown.off.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {dayBreakdown.off.map((emp) => (
                    <div key={emp.id} className="flex items-center gap-3 p-2 bg-secondary/35 rounded-xl border border-transparent hover:border-border/60 transition-all">
                      <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-foreground truncate">{emp.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{emp.dept}</p>
                      </div>
                    </div>
                  ))}
                  {dayBreakdown.off.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-8">No employees scheduled</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: REQUESTS (TASK 9.3 WORKFLOW) ───────────────────── */}
      {activeTab === "requests" && (
        <div className="animate-in fade-in duration-200">
          {/* Header & Controls */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-foreground">
                  Shift Swap Requests
                </h3>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  Employees can request shift swaps with colleagues. Managers review, validate scope, and approve requests with append-only audit history.
                </p>
              </div>

              <button
                onClick={() => setShowCreateSwapModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#00B87C] hover:bg-[#00a36d] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start md:self-auto"
              >
                <Plus size={14} />
                <span>+ Create Swap Request</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search ID, employee, or reason..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Manager Review">Manager Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>

              {/* Department Filter */}
              <div className="relative">
                <select
                  value={requestDeptFilter}
                  onChange={(e) => setRequestDeptFilter(e.target.value)}
                  className="w-full px-4 py-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Requests Data Table */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/50 border-b border-border text-[11px] font-black uppercase text-muted-foreground tracking-wider">
                    <th className="py-3 px-4">Req ID</th>
                    <th className="py-3 px-4">Requester & Target</th>
                    <th className="py-3 px-4">Current Shift</th>
                    <th className="py-3 px-4">Requested Shift</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs font-bold text-foreground">
                  {filteredRequests.map((swap) => {
                    const statusBadge =
                      swap.status === "Pending"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : swap.status === "Manager Review"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : swap.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : swap.status === "Rejected"
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              : "bg-slate-500/10 text-slate-600 border-slate-500/20";

                    const scopeValidation = ScheduleService.validateManagerScope(
                      userDept,
                      swap.requesterDepartment,
                      hasGlobalManage,
                    );
                    const canActOnRequest =
                      canApprove &&
                      scopeValidation.isAllowed &&
                      (swap.status === "Pending" || swap.status === "Manager Review");

                    return (
                      <tr key={swap.id} className="hover:bg-neutral-50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                          {swap.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-foreground">{swap.requesterName}</span>
                            <ArrowLeftRight size={12} className="text-primary" />
                            <span className="font-extrabold text-foreground">{swap.targetEmployeeName}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground block mt-0.5 uppercase">{swap.requesterDepartment}</span>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">{swap.currentShiftName}</td>
                        <td className="py-3.5 px-4 text-foreground">{swap.requestedShiftName}</td>
                        <td className="py-3.5 px-4 font-mono">{swap.date}</td>
                        <td className="py-3.5 px-4 max-w-[180px] truncate text-muted-foreground" title={swap.reason}>
                          {swap.reason}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">{swap.submittedAt}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${statusBadge}`}>
                            {swap.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedSwapDetails(swap)}
                              className="px-3 py-1 text-[11px] font-extrabold text-primary hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                            >
                              Details
                            </button>

                            {canActOnRequest && (
                              <>
                                <button
                                  onClick={() => setRequestToApprove(swap)}
                                  className="px-2.5 py-1 text-[11px] font-extrabold text-white bg-[#00B87C] hover:bg-[#00a36d] rounded-lg transition-colors shadow-sm cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setRequestToReject(swap);
                                    setRejectionReasonInput("");
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {(swap.status === "Pending" || swap.status === "Manager Review") && !canActOnRequest && (
                              <button
                                onClick={() => setRequestToCancel(swap)}
                                className="px-2.5 py-1 text-[11px] font-bold text-slate-500 bg-secondary hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-3">
                  <ArrowLeftRight size={24} />
                </div>
                <h4 className="text-sm font-extrabold text-foreground">
                  No shift swap requests found
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  There are currently no shift swap requests matching your filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: SHIFT TEMPLATES & OVERTIME CONFIGURATION (TASK 9.4) ─── */}
      {activeTab === "templates" && (
        <div className="animate-in fade-in duration-200">
          {/* Sub-Nav Toggle Header */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 p-1 bg-secondary rounded-xl">
              <button
                onClick={() => setTemplateSubTab("shift_templates")}
                className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  templateSubTab === "shift_templates"
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarPlus size={14} />
                <span>Shift Routines & Templates ({templates.length})</span>
              </button>

              <button
                onClick={() => setTemplateSubTab("overtime_templates")}
                className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  templateSubTab === "overtime_templates"
                    ? "bg-card text-purple-600 dark:text-purple-400 shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>Overtime Configuration Templates ({overtimeTemplates.length})</span>
              </button>
            </div>

            {templateSubTab === "shift_templates" && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search template..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                <div className="relative">
                  <select
                    value={templateDeptFilter}
                    onChange={(e) => setTemplateDeptFilter(e.target.value)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer pr-8"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* SUB-SECTION A: SHIFT TEMPLATES */}
          {templateSubTab === "shift_templates" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredTemplates.map((tmpl) => {
                  const isDisabled = tmpl.status === "Disabled";
                  return (
                    <div
                      key={tmpl.id}
                      className={`bg-card rounded-2xl border p-5 shadow-sm transition-all relative flex flex-col justify-between group ${
                        isDisabled
                          ? "border-border opacity-70 bg-secondary/20"
                          : "border-border hover:-translate-y-[2px] hover:border-[#00B87C] hover:shadow-[0_0_15px_rgba(0,184,124,0.3)]"
                      }`}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-12 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border uppercase tracking-wide ${
                            isDisabled
                              ? "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400"
                          }`}
                        >
                          {tmpl.status}
                        </span>
                      </div>

                      {/* 3-Dot Action Menu */}
                      <div className="absolute top-4 right-4">
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTemplateMenu(showTemplateMenu === tmpl.id ? null : tmpl.id);
                          }}
                        >
                          <MoreIcon size={16} />
                        </button>

                        {showTemplateMenu === tmpl.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in slide-in-from-top-1">
                            <button
                              className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                              onClick={() => {
                                setShowTemplateMenu(null);
                                setSelectedTemplateDetails(tmpl);
                              }}
                            >
                              <Eye size={14} />
                              <span>View Details</span>
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                              onClick={() => {
                                setShowTemplateMenu(null);
                                openEditTemplateModal(tmpl);
                              }}
                            >
                              <Edit3 size={14} />
                              <span>Edit Template</span>
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                              onClick={() => {
                                setShowTemplateMenu(null);
                                handleDuplicateTemplate(tmpl);
                              }}
                            >
                              <Copy size={14} />
                              <span>Duplicate Template</span>
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer border-t border-border mt-1 pt-2"
                              onClick={() => {
                                setShowTemplateMenu(null);
                                handleToggleTemplateStatus(tmpl);
                              }}
                            >
                              <Power size={14} className={tmpl.status === "Active" ? "text-amber-500" : "text-emerald-500"} />
                              <span>{tmpl.status === "Active" ? "Disable Template" : "Enable Template"}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-foreground mb-1">
                          {tmpl.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {tmpl.description || "No description provided."}
                        </p>

                        {/* Shift Legend Chips */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {Array.from(new Set(Object.values(tmpl.weeklySchedule))).map((shiftName) => {
                            const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
                              Morning: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-[#00B87C]", dot: "#00B87C" },
                              Evening: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-[#F59E0B]", dot: "#F59E0B" },
                              Night: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-[#7C3AED]", dot: "#7C3AED" },
                              "Off Day": { bg: "bg-slate-100 dark:bg-slate-800", text: "text-[#90A4AE]", dot: "#90A4AE" },
                            };
                            const colors = colorMap[shiftName] || { bg: "bg-neutral-100", text: "text-neutral-600", dot: "#757575" };
                            return (
                              <span
                                key={shiftName}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-tight uppercase ${colors.bg} ${colors.text}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.dot }} />
                                {shiftName}
                              </span>
                            );
                          })}
                        </div>

                        {/* Metadata */}
                        <div className="space-y-1.5 mb-5 text-xs font-bold text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>{tmpl.employeesCount} employees assigned</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity size={14} />
                            <span>
                              Department: <span className="text-foreground">{tmpl.department}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            <span>
                              Last applied: <span className="text-foreground">{tmpl.lastAppliedAt || "Never"}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={isDisabled}
                        className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                          isDisabled
                            ? "bg-secondary text-muted-foreground cursor-not-allowed opacity-60"
                            : "bg-[#00B87C] text-white hover:bg-[#00a36d] cursor-pointer"
                        }`}
                        onClick={() => openApplyTemplateWorkflow(tmpl)}
                      >
                        <Zap size={14} className="mr-1.5" />
                        <span>{isDisabled ? "Template Disabled" : "Apply Template"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-12 text-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-3">
                    <CalendarPlus size={24} />
                  </div>
                  <h4 className="text-base font-extrabold text-foreground">
                    No shift templates configured
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-4">
                    Create a shift template to quickly assign schedule routines to employees or teams.
                  </p>
                  <button
                    onClick={openCreateTemplateModal}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#00B87C] hover:bg-[#00a36d] rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    + Create Template
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SUB-SECTION B: OVERTIME TEMPLATES CONFIGURATION */}
          {templateSubTab === "overtime_templates" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {overtimeTemplates.map((ot) => {
                  const isDisabled = ot.status === "Disabled";
                  return (
                    <div
                      key={ot.id}
                      className={`bg-card rounded-2xl border p-5 shadow-sm transition-all relative flex flex-col justify-between ${
                        isDisabled
                          ? "border-border opacity-70 bg-secondary/20"
                          : "border-border hover:border-purple-500/50 hover:shadow-sm"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-foreground">
                              {ot.name}
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border uppercase ${
                                isDisabled
                                  ? "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800"
                                  : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400"
                              }`}
                            >
                              {ot.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {ot.description || "Editable scheduling overtime rule configuration."}
                          </p>
                        </div>

                        {/* 3-Dot Action Menu */}
                        <div className="relative">
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowOtMenu(showOtMenu === ot.id ? null : ot.id);
                            }}
                          >
                            <MoreIcon size={16} />
                          </button>

                          {showOtMenu === ot.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-30 py-1 animate-in fade-in">
                              <button
                                className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                  setShowOtMenu(null);
                                  setSelectedOtDetails(ot);
                                }}
                              >
                                <Eye size={14} />
                                <span>View Details</span>
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                  setShowOtMenu(null);
                                  openEditOtModal(ot);
                                }}
                              >
                                <Edit3 size={14} />
                                <span>Edit OT Rule</span>
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                  setShowOtMenu(null);
                                  handleDuplicateOtTemplate(ot);
                                }}
                              >
                                <Copy size={14} />
                                <span>Duplicate OT Rule</span>
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary flex items-center gap-2 cursor-pointer border-t border-border mt-1 pt-2"
                                onClick={() => {
                                  setShowOtMenu(null);
                                  handleToggleOtStatus(ot);
                                }}
                              >
                                <Power size={14} className={ot.status === "Active" ? "text-amber-500" : "text-emerald-500"} />
                                <span>{ot.status === "Active" ? "Disable OT Rule" : "Enable OT Rule"}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rule Parameters Grid */}
                      <div className="grid grid-cols-2 gap-3 bg-secondary/30 p-3 rounded-xl border border-border/60 text-xs mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Max Daily OT</span>
                          <span className="font-extrabold text-foreground">{ot.maxDailyOvertimeHours} hours/day</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Max Weekly OT</span>
                          <span className="font-extrabold text-foreground">{ot.maxWeeklyOvertimeHours} hours/week</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Overtime Rate</span>
                          <span className="font-extrabold text-purple-600 dark:text-purple-400">{ot.overtimeRateMultiplier}x Base Rate</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground block">Manager Approval</span>
                          <span className="font-extrabold text-emerald-600">{ot.overtimeApprovalRequired ? "Pre-Approval Required" : "Auto-Approved"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                        <span>Effective: <strong className="text-foreground">{ot.effectiveFrom}</strong></span>
                        <span className="text-[11px] text-purple-600 font-bold">Configured Rule</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {overtimeTemplates.length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-12 text-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-3">
                    <SlidersHorizontal size={24} />
                  </div>
                  <h4 className="text-base font-extrabold text-foreground">
                    No overtime templates configured
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto mb-4">
                    Create overtime rules templates to configure daily/weekly OT limits and rate multipliers.
                  </p>
                  <button
                    onClick={openCreateOtModal}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    + Create OT Template
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL 1: CREATE / EDIT SHIFT TEMPLATE ─────────────────────── */}
      {showShiftTemplateModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSaveShiftTemplate}
            className="w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95"
          >
            <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarPlus size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {editingTemplate ? "Edit Shift Template" : "Create Shift Template"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configure shift routines and rotation rules.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShiftTemplateModal(false)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={tmplName}
                    onChange={(e) => setTmplName(e.target.value)}
                    placeholder="e.g. Engineering Week A"
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Department *
                  </label>
                  <select
                    value={tmplDept}
                    onChange={(e) => setTmplDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none cursor-pointer"
                  >
                    {departments.filter((d) => d !== "All Departments").map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={tmplDesc}
                  onChange={(e) => setTmplDesc(e.target.value)}
                  placeholder="Describe the purpose of this shift routine..."
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Rotation Type
                  </label>
                  <select
                    value={tmplRotation}
                    onChange={(e) => setTmplRotation(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none cursor-pointer"
                  >
                    <option value="Weekly Rotation">Weekly Rotation</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Weekend Only">Weekend Only</option>
                    <option value="Custom Rotation">Custom Rotation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={tmplStatus}
                    onChange={(e) => setTmplStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Shift Definitions Builder */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase text-muted-foreground">
                    Shift Definitions ({tmplShifts.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `s-${tmplShifts.length + 1}`;
                      setTmplShifts((prev) => [
                        ...prev,
                        { id: newId, code: `SHF-0${prev.length + 1}`, name: "New Shift", startTime: "08:00 AM", endTime: "04:00 PM", breakDurationMinutes: 30, workingHours: 8, displayOrder: prev.length + 1 },
                      ]);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold text-primary bg-secondary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                  >
                    + Add Shift
                  </button>
                </div>

                <div className="space-y-2">
                  {tmplShifts.map((shift, idx) => (
                    <div key={shift.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center bg-secondary/40 p-2.5 rounded-xl border border-border text-xs">
                      <input
                        type="text"
                        placeholder="Shift Name"
                        value={shift.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTmplShifts((prev) => prev.map((s, i) => i === idx ? { ...s, name: val } : s));
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-background font-bold outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Code"
                        value={shift.code}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTmplShifts((prev) => prev.map((s, i) => i === idx ? { ...s, code: val } : s));
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-background font-mono font-bold uppercase outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Start"
                        value={shift.startTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTmplShifts((prev) => prev.map((s, i) => i === idx ? { ...s, startTime: val } : s));
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-background font-bold outline-none"
                      />
                      <input
                        type="text"
                        placeholder="End"
                        value={shift.endTime}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTmplShifts((prev) => prev.map((s, i) => i === idx ? { ...s, endTime: val } : s));
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-background font-bold outline-none"
                      />
                      {tmplShifts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setTmplShifts((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-background flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowShiftTemplateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-foreground bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#00B87C] hover:bg-[#00a36d] shadow-sm transition-colors cursor-pointer"
              >
                Save Template
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL 2: CREATE / EDIT OVERTIME TEMPLATE ──────────────────── */}
      {showOtModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSaveOtTemplate}
            className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95"
          >
            <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <SlidersHorizontal size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {editingOtTemplate ? "Edit Overtime Template" : "Create Overtime Template"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Configure overtime limits, pre-approval rules, and rate multipliers.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOtModal(false)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={otName}
                  onChange={(e) => setOtName(e.target.value)}
                  placeholder="e.g. Standard Overtime Policy"
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={otDesc}
                  onChange={(e) => setOtDesc(e.target.value)}
                  placeholder="Describe overtime eligibility and conditions..."
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Max Daily OT (Hours) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    required
                    value={otMaxDaily}
                    onChange={(e) => setOtMaxDaily(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Max Weekly OT (Hours) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={48}
                    required
                    value={otMaxWeekly}
                    onChange={(e) => setOtMaxWeekly(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Min OT Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={15}
                    value={otMinDuration}
                    onChange={(e) => setOtMinDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Rate Multiplier (x) *
                  </label>
                  <input
                    type="number"
                    min={1.0}
                    step={0.1}
                    required
                    value={otMultiplier}
                    onChange={(e) => setOtMultiplier(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-xl border border-border">
                <input
                  type="checkbox"
                  id="otApproval"
                  checked={otApprovalRequired}
                  onChange={(e) => setOtApprovalRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                />
                <label htmlFor="otApproval" className="text-xs font-extrabold text-foreground cursor-pointer">
                  Require Manager Pre-Approval for OT Sessions
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Effective From
                  </label>
                  <input
                    type="date"
                    required
                    value={otEffectiveFrom}
                    onChange={(e) => setOtEffectiveFrom(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={otStatus}
                    onChange={(e) => setOtStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-background flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowOtModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-foreground bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-colors cursor-pointer"
              >
                Save OT Template
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL 3: APPLY SHIFT TEMPLATE MULTI-STEP WORKFLOW ─────────── */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-extrabold">
                  {applyStep}/5
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Apply Shift Template — Step {applyStep} of 5
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {applyStep === 1 && "Select an active shift template routine."}
                    {applyStep === 2 && "Configure target department or employees scope."}
                    {applyStep === 3 && "Select schedule date range."}
                    {applyStep === 4 && "Preview application & conflict analysis."}
                    {applyStep === 5 && "Confirm template application to schedule."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Step Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              {/* STEP 1: Select Active Template */}
              {applyStep === 1 && (
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                    Available Active Templates
                  </label>
                  <div className="space-y-2">
                    {templates.map((t) => {
                      const isSelected = applySelectedTemplateId === t.id;
                      const isDisabled = t.status === "Disabled";
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            if (!isDisabled) setApplySelectedTemplateId(t.id);
                          }}
                          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isDisabled
                              ? "opacity-50 border-border bg-secondary/20 cursor-not-allowed"
                              : isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                : "border-border hover:bg-secondary/40"
                          }`}
                        >
                          <div>
                            <span className="font-extrabold text-foreground block">{t.name}</span>
                            <span className="text-[11px] text-muted-foreground">{t.department} • {t.rotationType}</span>
                          </div>
                          {isDisabled ? (
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Disabled</span>
                          ) : (
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/40"}`}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Select Scope */}
              {applyStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                      Scope Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["Department", "Employees"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setApplyScopeType(st)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            applyScopeType === st
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {applyScopeType === "Department" && (
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                        Target Department
                      </label>
                      <select
                        value={applyScopeDept}
                        onChange={(e) => setApplyScopeDept(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none cursor-pointer"
                      >
                        {departments.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {applyScopeType === "Employees" && (
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                        Select Target Employees ({applySelectedEmpIds.length} Selected)
                      </label>
                      <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-secondary/30 rounded-xl border border-border">
                        {globalEmployees.map((emp) => {
                          const checked = applySelectedEmpIdsSet.has(emp.id);
                          return (
                            <label key={emp.id} className="flex items-center gap-2 p-1.5 hover:bg-card rounded-lg text-xs font-bold text-foreground cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setApplySelectedEmpIds((prev) => [...prev, emp.id]);
                                  } else {
                                    setApplySelectedEmpIds((prev) => prev.filter((id) => id !== emp.id));
                                  }
                                }}
                                className="w-4 h-4 rounded text-primary"
                              />
                              <span>{emp.name} ({emp.department})</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Select Date Range */}
              {applyStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={applyStartDate}
                        onChange={(e) => setApplyStartDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                        End Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={applyEndDate}
                        onChange={(e) => setApplyEndDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/40 rounded-xl border border-border text-xs text-muted-foreground">
                    Template will be generated and assigned to all selected employees for every date within the range.
                  </div>
                </div>
              )}

              {/* STEP 4: Preview & Conflict Analysis */}
              {applyStep === 4 && applyPreviewData && (
                <div className="space-y-4">
                  {/* Summary Banner */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-secondary/40 p-3 rounded-xl border border-border">
                      <span className="text-xl font-extrabold text-foreground block">{applyPreviewData.affectedEmployeesCount}</span>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Employees</span>
                    </div>
                    <div className="bg-secondary/40 p-3 rounded-xl border border-border">
                      <span className="text-xl font-extrabold text-foreground block">{applyPreviewData.affectedDaysCount}</span>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Days</span>
                    </div>
                    <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                      <span className="text-xl font-extrabold text-amber-600 block">{applyPreviewData.conflicts.length}</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">Conflicts</span>
                    </div>
                  </div>

                  {/* Conflict List Table */}
                  {applyPreviewData.conflicts.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-extrabold text-amber-600 block">
                        Detected Shift Conflicts:
                      </span>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-border rounded-xl p-2 bg-secondary/20 text-xs">
                        {applyPreviewData.conflicts.map((c) => (
                          <div key={c.id} className="flex justify-between items-center p-1.5 bg-card rounded-lg border border-border text-[11px]">
                            <div>
                              <span className="font-extrabold text-foreground">{c.employeeName}</span>
                              <span className="text-muted-foreground ml-2 font-mono">{c.date}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-rose-500 font-semibold line-through mr-1.5">{c.currentAssignment}</span>
                              <span className="text-emerald-600 font-extrabold">→ {c.proposedAssignment}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 p-3 bg-secondary/40 rounded-xl border border-border text-xs">
                    <input
                      type="checkbox"
                      id="overrideConf"
                      checked={applyOverrideConflicts}
                      onChange={(e) => setApplyOverrideConflicts(e.target.checked)}
                      className="w-4 h-4 rounded text-primary"
                    />
                    <label htmlFor="overrideConf" className="font-extrabold text-foreground cursor-pointer">
                      Overwrite existing shift conflicts with template definition
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 5: Confirmation */}
              {applyStep === 5 && applyPreviewData && (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="text-base font-extrabold text-foreground">
                    Ready to Apply Template
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    You are about to apply template <strong>'{applyPreviewData.template.name}'</strong> to {applyPreviewData.affectedEmployeesCount} employees from {applyStartDate} to {applyEndDate}.
                  </p>
                  <div className="p-3 bg-secondary/40 rounded-xl border border-border text-xs text-left max-w-md mx-auto space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employees:</span>
                      <span className="font-bold text-foreground">{applyPreviewData.affectedEmployeesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Days:</span>
                      <span className="font-bold text-foreground">{applyPreviewData.affectedDaysCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Override Conflicts:</span>
                      <span className="font-bold text-emerald-600">{applyOverrideConflicts ? "Yes" : "No (Skip)"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-border bg-background flex justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (applyStep > 1) setApplyStep((prev) => (prev - 1) as any);
                  else setShowApplyModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-foreground bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                {applyStep === 1 ? "Cancel" : "Back"}
              </button>

              {applyStep < 5 ? (
                <button
                  type="button"
                  onClick={handleApplyNextStep}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#00B87C] hover:bg-[#00a36d] shadow-sm transition-colors cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmApplyTemplate}
                  className="px-6 py-2 rounded-xl text-xs font-extrabold text-white bg-[#00B87C] hover:bg-[#00a36d] shadow-md transition-colors cursor-pointer"
                >
                  Confirm & Apply Template
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: TEMPLATE DETAILS DRAWER/MODAL ────────────────────── */}
      {selectedTemplateDetails && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-card rounded-[24px] shadow-2xl border border-border w-full max-w-lg overflow-hidden transform transition-all p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-foreground">
                    {selectedTemplateDetails.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    selectedTemplateDetails.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-300"
                  }`}>
                    {selectedTemplateDetails.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedTemplateDetails.department} • {selectedTemplateDetails.rotationType}
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplateDetails(null)}
                className="p-1.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1 custom-scrollbar text-xs">
              <div className="bg-secondary/30 p-4 rounded-2xl border border-border space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Description</span>
                <p className="font-medium text-foreground">{selectedTemplateDetails.description || "No description."}</p>
                <div className="pt-2 border-t border-border grid grid-cols-2 gap-2 text-[11px]">
                  <div>Created By: <strong className="text-foreground">{selectedTemplateDetails.createdBy}</strong></div>
                  <div>Created At: <strong className="text-foreground">{selectedTemplateDetails.createdAt}</strong></div>
                  <div>Last Applied: <strong className="text-foreground">{selectedTemplateDetails.lastAppliedAt || "Never"}</strong></div>
                  <div>Employees: <strong className="text-foreground">{selectedTemplateDetails.employeesCount}</strong></div>
                </div>
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase text-muted-foreground block mb-2">
                  Shift Definitions ({selectedTemplateDetails.shifts.length})
                </span>
                <div className="space-y-2">
                  {selectedTemplateDetails.shifts.map((s) => (
                    <div key={s.id} className="p-3 bg-card border border-border rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-foreground block">{s.name} ({s.code})</span>
                        <span className="text-[11px] text-muted-foreground">{s.startTime} — {s.endTime} ({s.workingHours} hrs)</span>
                      </div>
                      <span className="px-2 py-1 bg-secondary text-primary font-bold rounded-lg text-[10px]">
                        {s.breakDurationMinutes}m Break
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setSelectedTemplateDetails(null)}
                className="px-4 py-2 text-xs font-bold text-muted-foreground bg-secondary rounded-xl cursor-pointer"
              >
                Close
              </button>
              {selectedTemplateDetails.status === "Active" && (
                <button
                  onClick={() => {
                    const tmpl = selectedTemplateDetails;
                    setSelectedTemplateDetails(null);
                    openApplyTemplateWorkflow(tmpl);
                  }}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-[#00B87C] hover:bg-[#00a36d] rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <Zap size={14} />
                  <span>Apply Template</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: OVERTIME TEMPLATE DETAILS DRAWER/MODAL ───────────── */}
      {selectedOtDetails && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-card rounded-[24px] shadow-2xl border border-border w-full max-w-lg overflow-hidden transform transition-all p-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-foreground">
                    {selectedOtDetails.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border bg-purple-50 text-purple-700 border-purple-200">
                    {selectedOtDetails.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Overtime Configuration Template
                </p>
              </div>
              <button
                onClick={() => setSelectedOtDetails(null)}
                className="p-1.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1 custom-scrollbar text-xs">
              <div className="bg-secondary/30 p-4 rounded-2xl border border-border space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">Description</span>
                <p className="font-medium text-foreground">{selectedOtDetails.description || "No description."}</p>
                <div className="pt-2 border-t border-border grid grid-cols-2 gap-2 text-[11px]">
                  <div>Max Daily OT: <strong className="text-foreground">{selectedOtDetails.maxDailyOvertimeHours} hrs</strong></div>
                  <div>Max Weekly OT: <strong className="text-foreground">{selectedOtDetails.maxWeeklyOvertimeHours} hrs</strong></div>
                  <div>Min Duration: <strong className="text-foreground">{selectedOtDetails.minOvertimeDurationMinutes} mins</strong></div>
                  <div>OT Rate: <strong className="text-purple-600">{selectedOtDetails.overtimeRateMultiplier}x</strong></div>
                  <div>Pre-Approval: <strong className="text-emerald-600">{selectedOtDetails.overtimeApprovalRequired ? "Required" : "Auto"}</strong></div>
                  <div>Effective: <strong className="text-foreground">{selectedOtDetails.effectiveFrom}</strong></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedOtDetails(null)}
                className="px-4 py-2 text-xs font-bold text-muted-foreground bg-secondary rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 6: ASSIGN / ADD NEW SHIFT MODAL (HARDENED) ───────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddShiftConfirm(showConflictConfirmation);
            }}
            className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95"
          >
            <div className="px-6 py-4 border-b border-border bg-background flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarPlus size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Assign New Shift
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Create a new shift assignment for an employee.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  dispatchAddModal({ type: "CLOSE_MODAL" });
                  setShowAddModal(false);
                }}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Validation Error Banner */}
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Conflict Warning Banner */}
              {showConflictConfirmation && modalEmployeeName && modalDate && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                    <AlertCircle size={16} />
                    <span>Shift Conflict Warning</span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-bold">
                    {modalEmployeeName} already has <strong>{getShiftForDate(modalEmployeeName, modalDate)?.type} ({getShiftForDate(modalEmployeeName, modalDate)?.time})</strong> assigned on {modalDate}.
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Are you sure you want to replace this existing assignment with {modalShiftType}?
                  </p>
                </div>
              )}

              {/* Select Employee */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                  Select Employee *
                </label>
                <select
                  value={modalEmployeeName}
                  onChange={(e) => {
                    dispatchAddModal({ type: "SET_FIELD", field: "modalEmployeeName", value: e.target.value });
                    dispatchAddModal({ type: "SET_FIELD", field: "showConflictConfirmation", value: false });
                    dispatchAddModal({ type: "SET_FIELD", field: "validationError", value: null });
                  }}
                  required
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">-- Select Employee --</option>
                  {globalEmployees.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} — {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Type (Configured Options) */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                  Shift Type *
                </label>
                <select
                  value={modalShiftType}
                  onChange={(e) => {
                    dispatchAddModal({ type: "SET_FIELD", field: "modalShiftType", value: e.target.value });
                    dispatchAddModal({ type: "SET_FIELD", field: "showConflictConfirmation", value: false });
                    dispatchAddModal({ type: "SET_FIELD", field: "validationError", value: null });
                  }}
                  required
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                >
                  {availableShiftOptions.map((opt) => (
                    <option key={opt.type} value={opt.type}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Date */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                  Shift Date *
                </label>
                <input
                  type="date"
                  required
                  value={modalDate}
                  onChange={(e) => {
                    dispatchAddModal({ type: "SET_FIELD", field: "modalDate", value: e.target.value });
                    dispatchAddModal({ type: "SET_FIELD", field: "showConflictConfirmation", value: false });
                    dispatchAddModal({ type: "SET_FIELD", field: "validationError", value: null });
                  }}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase text-muted-foreground">
                  Shift Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => dispatchAddModal({ type: "SET_FIELD", field: "modalNotes", value: e.target.value })}
                  placeholder="Add optional operational instructions..."
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-border bg-background text-foreground outline-none resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-background flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  dispatchAddModal({ type: "CLOSE_MODAL" });
                  setShowAddModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-foreground bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2 rounded-xl text-xs font-extrabold text-white transition-colors cursor-pointer shadow-sm ${
                  showConflictConfirmation
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-[#00B87C] hover:bg-[#00a36d]"
                }`}
              >
                {showConflictConfirmation ? "Confirm Overwrite" : "Assign Shift"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
