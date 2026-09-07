# NexusHR EMS — Leave Management Audit & Implementation Strategy (Task 8.1)

**Date**: August 28, 2026  
**System**: NexusHR Employee Management System (EMS)  
**Module**: HR Operations — Leave Management (Day 8)  
**Audit Purpose**: Codebase Audit, Approval Workflow Gap Analysis, UI Layout Evaluation & Multi-Phase Implementation Plan  

---

## 1. Executive Summary

An audit of the NexusHR Employee Management System (EMS) Leave Management module was conducted against the Day 8 Authoritative Requirements. 

While the existing codebase features rich UI components (such as stat cards, approval drawers, employee self-service modals, calendar widgets, and export options), several structural gaps exist between the current codebase and the Day 8 specifications:
1. **Fixed Approval Assumptions**: The current `LeaveManagement.tsx` component hardcodes a 2-stage approval workflow (`Manager Approval` and `HR Approval`). It lacks support for the three required configurable approval workflows:
   - **SINGLE LAYER**: `Employee -> TL`
   - **DOUBLE LAYER**: `Employee -> TL -> Manager`
   - **THIRD LAYER**: `Employee -> TL -> HR -> Manager`
2. **Disconnected Super Admin Settings**: The `ApprovalWorkflowsSection.tsx` component in Super Admin settings displays static preview UI only and is not connected to `LeaveManagement.tsx` runtime logic or tenant settings.
3. **UI Layout Order**: The current `LeaveManagement.tsx` places the detailed records table *first* (top-left) with calendar and analytics in sidebars/bottom containers. The specification requires a **Calendar-first** layout followed by **Graphs/Analytics** before the **Detailed Records Table**.
4. **Table Controls & Checkbox Mechanics**: Table headers currently lack sort triggers (`sortField`, `sortDirection`). Row selection checkboxes do not support `indeterminate` header states when partial rows are checked.
5. **Decoupled Data Services**: Employee, Manager, and HR Leave views operate on separate mock datasets without a unified `LeaveService` or tenant-scoped context (`user.organizationId`).

---

## 2. Current Leave Architecture

The current Leave Management ecosystem spans five main UI locations:
- **`src/app/pages/hr/hr-operations/LeaveManagement.tsx`**: HR Admin operational view with KPI cards, leave table, filter panel, quick actions, team calendar, and detail drawer.
- **`src/app/pages/employee/EmployeeLeaves.tsx`**: Employee self-service view with balance cards (CL, EL, SL, Comp Off), request modal, and history tab.
- **`src/app/pages/manager/team/ManagerLeaveApprovals.tsx`**: Manager-facing team approval view with pending request cards, policy checks, and rejection reason overlay.
- **`src/app/pages/super-admin/settings/sections/ApprovalWorkflowsSection.tsx`**: Super Admin configuration view showing workflow builder preview and global workflow rule toggles.
- **`src/app/shared/permission-engine/permissions.ts`**: Defines canonical permission keys: `P.LEAVE_VIEW`, `P.LEAVE_MANAGE`, `P.LEAVE_APPROVE`, `P.LEAVE_SELF`, `P.LEAVE_APPLY`, `P.LEAVE_APPROVE_TEAM`, `P.LEAVE_APPROVE_DEPT`, `P.LEAVE_RECOMMEND`, `P.LEAVE_FULL`.

---

## 3. Current Leave Request Lifecycle & Workflow Analysis

```
Current Discovered Workflow in Code:

[ Employee Submits ]
        │
        ▼
[ managerApproval: "Pending" ]  ──(Manager Approves)──►  [ managerApproval: "Approved" ]
        │                                                         │
        ▼                                                         ▼
[ hrApproval: "Pending" ]       ──(HR Approves)───────►  [ hrApproval: "Approved" ]
                                                                  │
                                                                  ▼
                                                      [ Final Status: "Approved" ]
```

### Discovered Workflow Limitations:
1. **No Team Lead (TL) Stage**: The current model skips TL approval entirely (`managerApproval` and `hrApproval` only).
2. **HR Sequence Violation**: In 3-layer enterprise workflows (`Employee -> TL -> HR -> Manager`), HR evaluates leave requests *before* final Manager approval. The current codebase evaluates Manager *before* HR.
3. **Hardcoded Dual Gate**: Rejection by either Manager or HR immediately marks the request as `Rejected`, but there is no mechanism to toggle off HR or Manager stages for Single-layer or Double-layer organizations.

---

## 4. Configurable Approval Layer Gap Analysis

The Day 8 specification mandates three configurable approval-layer workflows:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ SINGLE LAYER  :  Employee  ──►  Team Lead (TL)                          │
├─────────────────────────────────────────────────────────────────────────┤
│ DOUBLE LAYER  :  Employee  ──►  Team Lead (TL)  ──►  Manager            │
├─────────────────────────────────────────────────────────────────────────┤
│ THIRD LAYER   :  Employee  ──►  Team Lead (TL)  ──►  HR  ──►  Manager   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Gap Identification Matrix:

| Workflow Layer | Current Codebase Support | Required Addition |
|----------------|--------------------------|-------------------|
| **SINGLE LAYER** (`Emp -> TL`) | **MISSING** | Add `SINGLE` configuration where TL approval sets status to `Approved`. |
| **DOUBLE LAYER** (`Emp -> TL -> Manager`) | **PARTIAL** (uses Manager+HR) | Standardize `DOUBLE` configuration to route through TL then Manager. |
| **THIRD LAYER** (`Emp -> TL -> HR -> Manager`) | **MISSING** | Add `THIRD` configuration routing through TL, HR, then Manager. |
| **Dynamic Stage Resolution** | **MISSING** | Replace `managerApproval`/`hrApproval` fields with a dynamic `currentStage` pointer and `stages` array. |
| **Tenant Workflow Config** | **MISSING** | Store `approvalLayer` configuration in tenant-scoped settings (`viyan_leave_settings:${orgId}`). |

---

## 5. RBAC & Permission Audit

### Discovered Permission Catalog (`permissions.ts`):
- `P.LEAVE_VIEW` (`leave:view`) — View leave screens.
- `P.LEAVE_MANAGE` (`leave:manage`) — Full CRUD management.
- `P.LEAVE_APPROVE` (`leave:approve`) — Perform leave approvals.
- `P.LEAVE_APPROVE_TEAM` (`leave:approve_team`) — Perform team-level approvals (TL/Manager).
- `P.LEAVE_APPROVE_DEPT` (`leave:approve_dept`) — Perform department-level approvals (Department Head).
- `P.LEAVE_SELF` (`leave:self`) — View own leave balances and requests.
- `P.LEAVE_APPLY` (`leave:apply`) — Submit leave requests.
- `P.LEAVE_FULL` (`leave:full`) — Unrestricted leave administration.

### RBAC Audit Summary:
- **Canonical Keys**: The codebase correctly defines canonical permission keys without relying on raw role-string comparisons.
- **Action Guarding**: `LeaveManagement.tsx` checks `hasPermissionKey(P.LEAVE_APPROVE)` before allowing approvals.
- **Action Required for Task 8.4**: Ensure handlers in `ManagerLeaveApprovals.tsx` and `EmployeeLeaves.tsx` explicitly check `hasPermissionKey(P.LEAVE_APPROVE_TEAM)` and `hasPermissionKey(P.LEAVE_APPLY)`.

---

## 6. UI, Calendar & Analytics Layout Gap Analysis

### Required Layout Hierarchy (Day 8 Spec):
```
1. Header & Actions (Apply Leave, Export Report, Filters Toggle)
2. Filter Bar (Month, Year, Dept, Team, Employee, Type, Status, Search)
3. LEAVE CALENDAR (Primary Visual Grid)
4. LEAVE ANALYTICS (Leave Distribution & Team Availability Charts)
5. DETAILED LEAVE RECORDS TABLE (Sortable, Multi-select, Actions)
```

### Current Layout vs Required Layout:

```
[CURRENT LAYOUT IN LeaveManagement.tsx]         [REQUIRED LAYOUT FOR TASK 8.2]
+------------------------------------+          +------------------------------------+
| 4 Stat KPI Cards                   |          | 4 Stat KPI Cards                   |
+------------------------------------+          +------------------------------------+
| Detailed Records Table (Main Area) |          | Filter Bar (8-Axis Filters)        |
+------------------------------------+          +------------------------------------+
| Analytics Charts (Below Table)     |          | LEAVE CALENDAR (Primary Visual)    |
+------------------------------------+          +------------------------------------+
| Team Calendar (Right Sidebar)      |          | LEAVE ANALYTICS (Distribution/Trend|
+------------------------------------+          +------------------------------------+
                                                | DETAILED LEAVE TABLE (Bottom)      |
                                                +------------------------------------+
```

---

## 7. Detailed Table & Controls Audit

1. **Header & Individual Checkbox Mechanics**:
   - Current implementation: `<div onClick={toggleSelectAll}>` toggles between selecting all rows or zero rows.
   - Missing: Indeterminate state handling (`ref.current.indeterminate = true`) when $0 < \text{selectedCount} < \text{totalCount}$.
2. **Column Sorting**:
   - Current implementation: Table header cells (`<th>`) are plain text labels.
   - Missing: Clickable sorting headers (`sortField`, `sortDirection`), visual sort arrows ($\uparrow \downarrow$), and numeric/date sort logic.
3. **Approval History & Audit Trail**:
   - Current implementation: `history: LeaveHistory[]` tracks `{ date, action, by, comment }`.
   - Missing: Explicit stage metadata (`stageId`, `approverRole`, `timestampIso`, `statusAfterStage`).

---

## 8. Backend Boundary & Data Service Classification

| Feature Component | Current Implementation | Target Classification |
|-------------------|------------------------|-----------------------|
| **Leave Records & Balances** | Local memory state in `LeaveManagement.tsx` / `EmployeeLeaves.tsx` | **FRONTEND SERVICE ABSTRACTION — BACKEND API REQUIRED** |
| **Configurable Approval Layer** | Hardcoded dual gate | **FRONTEND READY — BACKEND WORKFLOW ENGINE REQUIRED** |
| **Multi-stage Approval History** | Local `history` array | **FRONTEND READY — BACKEND AUDIT LOG REQUIRED** |
| **Tenant Isolation Scoping** | In-memory mock arrays | **FRONTEND TENANT CONTEXT READY — BACKEND API/RLS REQUIRED** |
| **CSV / PDF Export** | Native browser CSV generation & printable window | **FRONTEND COMPLETE — BACKEND REPORTING OPTIONAL** |

---

## 9. Baseline Verification & Source Code Integrity

- **Source Code Files Modified in Task 8.1**: `0` (Zero code changes made during audit).
- **TypeScript Type Check (`npx tsc --noEmit`)**: **PASS (0 Errors)**.
- **Production Build (`npx vite build`)**: **PASS (0 Errors)**.

---

## 10. Deliverable Summary & Next Steps

1. [`EMS-Leave-Management-Audit.md`](file:///d:/Employment%20Management%20System/EMS-Leave-Management-Audit.md) — Comprehensive audit report.
2. [`implementation_plan.md`](file:///d:/Employment%20Management%20System/implementation_plan.md) — Multi-phase execution plan for Tasks 8.2 through 8.5.

**NEXT RECOMMENDED TASK**: **TASK 8.2 — Core Leave UI, Calendar-First Layout, Analytics & Monitoring View Restructuring**.
