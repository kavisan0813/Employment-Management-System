# TASK 9.1 — NEXUSHR EMS SCHEDULE MANAGEMENT AUDIT & GAP ANALYSIS

**Project**: NexusHR EMS / Employee Management System  
**Module**: Schedule Management (Day 9 Requirements)  
**Date**: August 28, 2026  
**Status**: AUDIT & GAP ANALYSIS COMPLETE — IMPLEMENTATION NOT YET STARTED  

---

## 1. Executive Summary

This document presents a comprehensive audit, current-state analysis, requirement gap matrix, and architectural boundary definition for the **Schedule Management** module of NexusHR EMS in accordance with the authoritative Day 9 requirements.

### Key Audit Findings
1. **Monolithic Page Layout**: The current implementation in `src/app/pages/hr/hr-operations/ShiftSchedule.tsx` is a single vertical layout stacking schedule grids, swap panels, overtime monitoring, and template cards. It lacks top-level tabbed navigation (`[ Schedule ]`, `[ Requests ]`, `[ Shift Templates ]`).
2. **Navbar & Labeling Discrepancy**: The sidebar navigation (`navigation.ts`) and page wrapper (`Layout.tsx`) display `"Schedule"`, while the page header displays `"Shift & Schedule Manager"`. The authoritative Day 9 terminology is **"Schedule Management"**.
3. **Out-of-Scope Overtime Monitoring**: The Schedule Management page currently includes a dedicated **Overtime Monitoring** panel (`#overtime-panel`) and OT-specific KPI cards ("Total Overtime 142h", "Fix Overtime Now" simulator). These violate Day 9 Requirement #10 and must be removed from Schedule Management (while preserving any shared Payroll/Finance OT utilities).
4. **Staffing Metrics Redundancy**: Redundant metrics like "Coverage Status 94.2%" and "3 Understaffed Shifts" pollute the top bar and need cleanup (Day 9 Requirement #9).
5. **Missing / Partial Core Features**:
   - **Shift Swap Requests & Manager Approval**: Partial mock UI exists in a bottom panel, but lacks a full request creation modal, complete lifecycle states (`PENDING`, `MANAGER_REVIEW`, `APPROVED`, `REJECTED`, `CANCELLED`), manager scope validation, and approval audit history.
   - **Request Tab**: Completely missing as a top-level tab.
   - **Shift Template Tab**: Templates exist in a bottom grid, but need promotion to a dedicated top-level tab with enhanced configuration views.
   - **Editable Overtime Template**: Missing on the Schedule Management page. Settings currently exist in Super Admin (`WorkSchedulesSection.tsx`), but Day 9 requires an editable OT template configuration within Schedule Management (strictly scoped to scheduling parameters, excluding payroll calculations).

---

## 2. Current Architecture & File Structure

The existing Schedule Management capability spans across multiple role-based pages, navigation configs, and settings sections:

```
src/
├── app/
│   ├── components/
│   │   ├── Layout.tsx                     # Map: "/schedule" -> "Schedule" (Needs update)
│   │   ├── Sidebar.tsx                    # Sidebar rendering
│   │   └── Topbar.tsx                     # Topbar rendering & breadcrumb
│   ├── pages/
│   │   ├── hr/
│   │   │   └── hr-operations/
│   │   │       ├── ShiftSchedule.tsx      # Main HR/Admin Schedule page (2,917 lines)
│   │   │       └── attendance/            # Attendance module (shared shift types)
│   │   ├── manager/
│   │   │   ├── team/
│   │   │   │   └── ManagerTeamSchedule.tsx # Manager view of team schedule
│   │   │   └── workspace/
│   │   │       └── ManagerPersonalSchedule.tsx # Manager personal schedule
│   │   ├── employee/
│   │   │   └── EmployeeSchedule.tsx        # Employee self-service schedule & requests
│   │   ├── finance/
│   │   │   └── workspace/
│   │   │       └── FinanceSchedule.tsx     # Finance read-only schedule view
│   │   └── super-admin/
│   │       └── settings/
│   │           └── sections/
│   │               ├── WorkSchedulesSection.tsx   # Global work schedules config
│   │               └── ShiftSwapRulesSection.tsx  # Shift swap policy config
│   ├── routes.tsx                         # Route definitions & ScheduleWrapper router
│   └── shared/
│       ├── permission-engine/
│       │   ├── navigation.ts              # Menu item: label "Schedule", path "/schedule"
│       │   ├── permissions.ts             # P.SCHEDULE_MANAGE, P.SCHEDULE_VIEW, etc.
│       │   └── roles.ts                   # Role permission mapping
│       └── feature-engine/
│           └── featureRegistry.ts         # FEATURE_KEYS.SCHEDULE
└── styles/
    └── ShiftSchedule.css                  # Custom styling rules for shift grid
```

### Route Resolution (`ScheduleWrapper` in `routes.tsx`)
When a user navigates to `/schedule`, `routes.tsx` evaluates permissions:
- If user has `P.SCHEDULE_MANAGE` or `P.SCHEDULE_FULL` -> Renders `ShiftSchedule.tsx`
- Else if user has `P.SCHEDULE_VIEW_TEAM` -> Renders `ManagerTeamSchedule.tsx`
- Else if user has `P.PAYROLL_FULL` -> Renders `FinanceSchedule.tsx`
- Else if user has `P.SCHEDULE_SELF` -> Renders `EmployeeSchedule.tsx`

---

## 3. Day 9 Requirement Audit & Gap Matrix

The following matrix evaluates the 10 authoritative Day 9 requirements against the existing codebase:

| # | Requirement | Current State | Classification | Source File(s) | Required Action for Task 9.2+ | Backend Required |
|---|---|---|---|---|---|---|
| 1 | **Shift Swap Request** | Request creation exists in `EmployeeSchedule.tsx`; list panel exists in `ShiftSchedule.tsx`. Missing unified lifecycle state machine. | **PARTIAL** | `ShiftSchedule.tsx` (L1249-1367)<br>`EmployeeSchedule.tsx` (L29-62) | Implement Shift Swap Request modal allowing selection of current shift, requested shift, target employee, date, reason. Support full lifecycle. | **YES** (API for swap creation & state persistence) |
| 2 | **Manager Approval** | Inline Approve/Reject buttons in HR swap panel with mock state removal. Lacks manager scope check & rejection reason. | **PARTIAL** | `ShiftSchedule.tsx` (L1310-1329)<br>`ManagerTeamSchedule.tsx` | Add structured Manager Approval flow with permission scope checks, rejection reason prompt, schedule mutation on approval, and log history. | **YES** (API for approval/rejection & audit log) |
| 3 | **Request Tab** | Requests are currently buried in a bottom scrollable card on the main page. | **MISSING** | `ShiftSchedule.tsx` (L1249) | Implement dedicated top-level `[ Requests ]` tab displaying full data table with statuses, approvals, filters, and action triggers. | **YES** (GET/PATCH `/api/v1/shift-swap-requests`) |
| 4 | **Shift Template Tab** | Template cards exist in a bottom grid section on the main page. | **PARTIAL** | `ShiftSchedule.tsx` (L1503-1717) | Promote template grid to a dedicated top-level `[ Shift Templates ]` tab with full management options (create, edit, view, apply, enable/disable). | **YES** (Template CRUD APIs) |
| 5 | **Apply Shift Template** | Modal workflow exists with employee selection, date range, start day, and conflict options. | **PASS / PARTIAL** | `ShiftSchedule.tsx` (L1718-1850) | Preserve existing modal workflow, integrate into `Shift Templates` tab, add conflict confirmation guardrail. | **YES** (Apply template API & conflict engine) |
| 6 | **Shift Count** | Aggregated counts shown in Day view columns & Month calendar cells. Missing explicit counter per template. | **PARTIAL** | `ShiftSchedule.tsx` (L1051, L1085, L1127) | Add explicit Shift Count indicators per shift type/template displaying number of assigned employees. | **NO** (Derived from frontend state) |
| 7 | **Editable Overtime Template** | Overtime settings exist in Super Admin (`WorkSchedulesSection.tsx`), but missing from Schedule Management page. | **MISSING** | `WorkSchedulesSection.tsx`<br>`ShiftSchedule.tsx` | Create Editable Overtime Template component within Schedule Management (Min/Max OT hours, rate rule, weekday/weekend/holiday rules, approval flag). | **YES** (OT Template configuration APIs) |
| 8 | **Navbar Name Correction** | Labels say "Schedule" in `navigation.ts` and `Layout.tsx`; header says "Shift & Schedule Manager". | **PARTIAL** | `navigation.ts` (L235)<br>`Layout.tsx` (L31)<br>`ShiftSchedule.tsx` (L477) | Update display labels across Navigation, Layout pageTitles, and Page Header to authoritative **"Schedule Management"**. | **NO** (Frontend terminology update) |
| 9 | **Remove Staffing Metrics** | "Coverage Status 94.2%" and "3 Understaffed Shifts" top alerts bar are redundant/unnecessary. | **OBSOLETE** | `ShiftSchedule.tsx` (L516-556) | Remove unnecessary top alerts bar and non-standard KPI cards. Retain useful scheduling metrics (Total Employees, Shift Count). | **NO** (UI Cleanup) |
| 10 | **Remove OT Monitoring** | Dedicated "Overtime Monitoring" panel (`id="overtime-panel"`) and OT KPI cards exist on the page. | **OBSOLETE** | `ShiftSchedule.tsx` (L705-718, L1370-1501) | Remove Overtime Monitoring panel, OT KPI card, and "Fix OT Now" buttons from Schedule Management page while preserving shared payroll/finance code. | **NO** (UI Cleanup) |

---

## 4. Detailed Component & Feature Gap Analysis

### 4.1 UI Layout & Tab Restructure Gap Analysis
- **Current State**: Everything is rendered on a single page in vertical order:
  1. Header & Actions
  2. System Health / Alerts Bar
  3. Controls (Date nav, View mode, Department filter)
  4. KPI Cards (Employees, Target Coverage, Total Overtime, Pending Swaps)
  5. Drag-and-drop Quick Assign bar
  6. Main Calendar Grid (Week / Month / Day views)
  7. Bottom Grid Column 1: Shift Swap Requests panel
  8. Bottom Grid Column 2: Overtime Monitoring panel
  9. Bottom Section: Shift Templates grid & Apply modal
- **Target Architecture (Day 9)**:
  - Header: **Schedule Management** with standard primary actions.
  - Tab Bar:
    - **`[ Schedule ]`**: Main schedule calendar, view toggles, filters, and employee shift assignments.
    - **`[ Requests ]`**: Comprehensive shift swap and change requests table with filterable statuses and manager actions.
    - **`[ Shift Templates ]`**: Configured shift templates grid, template editor, shift count metrics, apply template modal, and editable overtime template.

### 4.2 Shift Swap Request Gap Analysis
- **Target Fields**:
  - Employee (Requester)
  - Current Shift (Date & Shift Type)
  - Requested Shift (Date & Shift Type)
  - Target Employee (Collaborator)
  - Date of Swap
  - Reason for Request
- **Target Lifecycle States**:
  - `PENDING` -> Initial submission
  - `MANAGER_REVIEW` -> Under evaluation by assigned manager
  - `APPROVED` -> Approved by manager; schedule automatically updated
  - `REJECTED` -> Rejected by manager with reason recorded
  - `CANCELLED` -> Withdrawn by requester
- **Current Deficit**:
  - Swap data in `ShiftSchedule.tsx` uses mock arrays without lifecycle state tracking.
  - Reject action simply filters out the item without capturing a rejection reason or recording audit trail.
  - `FRONTEND READY — BACKEND REQUIRED` classification.

### 4.3 Manager Approval Flow Gap Analysis
- **Permission Boundaries**:
  - Super Admin / HR Admin: Full approval across all departments.
  - Manager: Scoped approval restricted to employees within manager's assigned team/department.
  - Employee: Read-only access to swap status; capability to submit or cancel own requests.
- **Current Deficit**:
  - Approval in `ShiftSchedule.tsx` does not check manager department assignment.
  - Rejection does not prompt for a mandatory rejection reason.
  - Approval does not auto-update the target employee schedules in `scheduleData`.

### 4.4 Shift Template & Apply Template Gap Analysis
- **Current State**: Good foundation in `ShiftSchedule.tsx` (lines 1503-1850).
- **Existing Fields**: Template Name, Department, Employee Count, Last Applied, Rotation Type, Weekly Schedule (Mon-Sun).
- **Missing Capabilities**:
  - Enable/Disable template toggle.
  - Explicit Shift Code, Start Time, End Time, Break Duration, Grace Period per template.
  - Advanced conflict detection engine (currently mock choice: replace/fill/skip).

### 4.5 Editable Overtime Template Gap Analysis
- **Requirement**: Authorized users must be able to configure an Overtime Template associated with scheduling.
- **Boundary Rules**:
  - MUST include: Overtime Template Name, Minimum OT Hours threshold, Maximum OT Hours cap, OT Rate multiplier rule (e.g. 1.5x), Weekday OT Rule, Weekend OT Rule, Holiday OT Rule, Manager Approval Required flag, Status (Active/Inactive).
  - MUST NOT include: Gross pay, net pay, tax withholdings, currency payouts, or payroll slip calculations (strictly preserved in Finance/Payroll module).

### 4.6 Staffing Metrics & OT Monitoring Cleanup Analysis
- **Items Marked for Removal from Schedule Management**:
  1. Top Alerts Bar: Coverage Status (94.2%), System Alerts (3 Understaffed), Ongoing Swaps (8 Pending) -> `ShiftSchedule.tsx` L516-556.
  2. KPI Card: Total Overtime (142h) -> `ShiftSchedule.tsx` L705-718.
  3. Bottom Panel: Overtime Monitoring (`#overtime-panel`) -> `ShiftSchedule.tsx` L1370-1501.
  4. OT Simulator: "Fix Overtime Now" simulation trigger.
- **Items Retained**:
  1. Total Employees KPI Card.
  2. Pending Swaps KPI Card (redirects to `[ Requests ]` tab).
  3. Shift Count badges and per-shift employee distribution counters.

---

## 5. Governance, RBAC & Tenant Isolation Audit

### 5.1 RBAC Audit
- **Current Code Analysis**:
  - Navigation uses permission keys `P.SCHEDULE_FULL`, `P.SCHEDULE_MANAGE`, `P.SCHEDULE_VIEW_TEAM`, `P.SCHEDULE_SELF`, `P.SCHEDULE_VIEW`.
  - Component code in `ShiftSchedule.tsx` does not enforce granular action permissions inline (e.g. any rendered user can click Approve/Reject or Apply Template in the current prototype).
- **Target Canonical RBAC Rules**:
  - `P.SCHEDULE_MANAGE` / `P.SCHEDULE_FULL`: Full access to create/edit templates, apply templates, approve all swap requests, edit OT templates.
  - `P.SCHEDULE_VIEW_TEAM`: Manager access to view team schedules, review and approve/reject swap requests for assigned team members.
  - `P.SCHEDULE_SELF`: Employee access to view personal schedule and submit/cancel shift swap requests.

### 5.2 Tenant Isolation Audit
- **Current State**: Prototype relies on local memory state and `mockData.ts`. Tenant boundary (`organizationId`) is not passed into schedule filters.
- **Required Backend Isolation Strategy**:
  - All future Schedule APIs must accept `organization_id` header or derive it from JWT session context.
  - PostgreSQL Row Level Security (RLS) policies must enforce `WHERE organization_id = current_tenant_id()`.

---

## 6. Service & Data Architecture (Backend Integration Contract)

### Proposed `ScheduleService` Interface
To decouple UI components from direct state/localStorage manipulation in future tasks, the following abstraction contract is defined:

```typescript
export interface ScheduleService {
  // Schedules
  getSchedules(params: { organizationId: string; dateRange: { start: string; end: string }; departmentId?: string }): Promise<EmployeeScheduleRow[]>;
  assignShift(payload: { employeeId: string; date: string; shiftType: string; isOT?: boolean }): Promise<void>;
  
  // Shift Templates
  getShiftTemplates(organizationId: string): Promise<ShiftTemplate[]>;
  createShiftTemplate(template: Omit<ShiftTemplate, "id">): Promise<ShiftTemplate>;
  updateShiftTemplate(id: number, template: Partial<ShiftTemplate>): Promise<ShiftTemplate>;
  applyShiftTemplate(payload: { templateId: number; targetEmployeeIds: string[]; startDate: string; endDate: string; conflictStrategy: "replace" | "skip" }): Promise<{ appliedCount: number; conflicts: string[] }>;

  // Shift Swap Requests
  getSwapRequests(params: { organizationId: string; status?: string }): Promise<SwapRequestItem[]>;
  createSwapRequest(request: { requesterId: string; currentShiftDate: string; currentShiftType: string; targetEmployeeId: string; requestedShiftDate: string; requestedShiftType: string; reason: string }): Promise<SwapRequestItem>;
  approveSwapRequest(id: string, managerId: string, comments?: string): Promise<void>;
  rejectSwapRequest(id: string, managerId: string, reason: string): Promise<void>;

  // Overtime Templates
  getOvertimeTemplate(organizationId: string): Promise<OvertimeTemplate>;
  updateOvertimeTemplate(template: OvertimeTemplate): Promise<OvertimeTemplate>;
}
```

---

## 7. Verification Results (Task 9.1 Baseline)

Prior to commencing Task 9.2, static analysis and build verification were conducted on the project codebase:

### 1. TypeScript Verification
Command: `npx tsc --noEmit`  
Result: **PASS** (Zero errors in Schedule components)

### 2. Production Build Verification
Command: `npm run build` / `npx vite build`  
Result: **PASS** (Successful bundle generation)

---

## 8. Source Files Matrix

| Source File Path | Purpose | Current State | Required Changes in Day 9 | Priority |
|---|---|---|---|---|
| `src/app/pages/hr/hr-operations/ShiftSchedule.tsx` | Main HR/Admin Schedule Page | Monolithic layout (2,917 lines) | Restructure into 3 Tabs (`Schedule`, `Requests`, `Shift Templates`), remove OT monitoring & redundant metrics, integrate Editable OT Template. | **CRITICAL** |
| `src/app/shared/permission-engine/navigation.ts` | Navigation Tree Config | Label: `"Schedule"` | Update label to `"Schedule Management"`. | **HIGH** |
| `src/app/components/Layout.tsx` | Layout Page Titles | Entry: `"/schedule": "Schedule"` | Update title map entry to `"Schedule Management"`. | **HIGH** |
| `src/app/pages/employee/EmployeeSchedule.tsx` | Employee Schedule & Requests | Contains mock swap requests | Align swap request modal schema with Manager/HR view. | **MEDIUM** |
| `src/app/pages/manager/team/ManagerTeamSchedule.tsx` | Manager Team View | Duplicate schedule grid | Align tab structure and scoped manager approval actions. | **MEDIUM** |
| `src/app/routes.tsx` | Route definitions | Mapped at `/schedule` | Retain `/schedule` route URL, update display metadata. | **LOW** |

---

## 9. Next Steps (Task 9.2 Execution Roadmap)

1. Proceed to **TASK 9.2 — CORE SCHEDULE UI RESTRUCTURE**:
   - Update navigation and layout display names to "Schedule Management".
   - Implement `[ Schedule ]`, `[ Requests ]`, `[ Shift Templates ]` top-level tab container.
   - Strip out Overtime Monitoring panel (`#overtime-panel`) and redundant staffing metric cards from `ShiftSchedule.tsx`.
   - Maintain 100% design system consistency with existing NexusHR EMS tokens.
