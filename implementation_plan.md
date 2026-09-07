# Implementation Plan — Day 8 Leave Management Refactor & Configurable Approval Engine

Refactor and enhance the NexusHR EMS Leave Management module according to Day 8 Authoritative Requirements: Calendar-first layout, analytics placement, 8-axis filtering, smart table sorting, indeterminate checkbox selection, multi-stage approval history, and tenant-configurable 1-layer, 2-layer, and 3-layer approval workflows.

---

## User Review Required

> [!IMPORTANT]
> **Configurable Approval Workflows**: Day 8 introduces three configurable approval layers:
> - **SINGLE LAYER**: Employee $\rightarrow$ Team Lead (TL)
> - **DOUBLE LAYER**: Employee $\rightarrow$ Team Lead (TL) $\rightarrow$ Manager
> - **THIRD LAYER**: Employee $\rightarrow$ Team Lead (TL) $\rightarrow$ HR $\rightarrow$ Manager
>
> Approval rules will be stored in tenant-scoped configuration (`viyan_leave_settings:${orgId}`) and can be configured via Super Admin settings.

> [!NOTE]
> **UI Layout Order**: The Leave Management view will be restructured so that the **Calendar** and **Analytics** appear before the **Detailed Leave Records Table**.

---

## Proposed Tasks & Phased Scopes

### TASK 8.2 — Core Leave UI, Calendar-First Layout, Analytics & Monitoring Restructuring

#### [MODIFY] [LeaveManagement.tsx](file:///d:/Employment%20Management%20System/src/app/pages/hr/hr-operations/LeaveManagement.tsx)
- Reorder page sections to enforce Calendar-first layout:
  1. Header & Actions (Apply Leave, Export Report, Filter Toggle)
  2. 8-Axis Filter Bar (Month, Year, Department, Team, Employee, Leave Type, Status, Search)
  3. Leave Calendar (Primary visual month grid with leave indicators and click-to-view date active leaves modal)
  4. Leave Analytics (Leave Distribution pie/bars & Team Availability Trend charts)
  5. Detailed Leave Records Table
- Integrate Team & Department Monitoring indicators (capacity health, coverage warnings, departmental absence distribution).
- Ensure active 8-axis filters update Calendar, Analytics, and Table simultaneously.

---

### TASK 8.3 — Configurable Approval Workflows (Single, Double, & Third Layer)

#### [NEW] [leaveService.ts](file:///d:/Employment%20Management%20System/src/app/pages/hr/hr-operations/leave/leaveService.ts)
- Create `LeaveService` abstraction encapsulating CRUD, tenant storage keys (`viyan_leave_records:${orgId}`, `viyan_leave_settings:${orgId}`), and approval workflow engine.
- Define approval workflow configuration interface:
  ```ts
  export type ApprovalLayerType = "SINGLE" | "DOUBLE" | "THIRD";
  ```
  - **SINGLE**: Stage 1 = TL (Approves $\rightarrow$ Status: `Approved`)
  - **DOUBLE**: Stage 1 = TL, Stage 2 = Manager (Both approve $\rightarrow$ Status: `Approved`)
  - **THIRD**: Stage 1 = TL, Stage 2 = HR, Stage 3 = Manager (All 3 approve $\rightarrow$ Status: `Approved`)

#### [MODIFY] [LeaveManagement.tsx](file:///d:/Employment%20Management%20System/src/app/pages/hr/hr-operations/LeaveManagement.tsx)
#### [MODIFY] [ManagerLeaveApprovals.tsx](file:///d:/Employment%20Management%20System/src/app/pages/manager/team/ManagerLeaveApprovals.tsx)
- Update detail drawers and approval cards to dynamically render approval stages matching the active tenant `approvalLayer` configuration.
- Implement stage-by-stage progression and rejection handling.

#### [MODIFY] [ApprovalWorkflowsSection.tsx](file:///d:/Employment%20Management%20System/src/app/pages/super-admin/settings/sections/ApprovalWorkflowsSection.tsx)
- Connect Super Admin Approval Workflows configuration UI to `LeaveService.saveLeaveSettings(...)` so changing the approval layer updates runtime request routing.

---

### TASK 8.4 — Approval History, Indeterminate Checkboxes, Table Sorting & Production Hardening

#### [MODIFY] [LeaveManagement.tsx](file:///d:/Employment%20Management%20System/src/app/pages/hr/hr-operations/LeaveManagement.tsx)
- Add sortable table headers (`Employee`, `Department`, `Leave Type`, `Timeline`, `Days`, `Status`) with `sortField` and `sortDirection` state.
- Implement proper checkbox selection mechanics:
  - Header checkbox sets `indeterminate = true` when $0 < \text{selectedCount} < \text{totalCount}$.
  - Select All selects visible filtered rows only.
- Render multi-stage approval history in `DetailDrawer` with stage title, approver name, action (`Approved`/`Rejected`), timestamp, and comments.
- Audit action handlers for canonical permission checks (`P.LEAVE_APPROVE`, `P.LEAVE_MANAGE`, `P.LEAVE_FULL`).

---

### TASK 8.5 — Backend Integration Boundary & Final Verification

#### [NEW] [EMS-Leave-Backend-Integration-Contract.md](file:///d:/Employment%20Management%20System/EMS-Leave-Backend-Integration-Contract.md)
- Document RESTful API endpoints (`GET/POST/PATCH/DELETE /api/v1/leave/requests`), multi-layer approval endpoints (`PATCH /api/v1/leave/requests/:id/approve`), database schema, PostgreSQL RLS policies, and audit logging standards.

#### [NEW] [EMS-Leave-Management-Verification.md](file:///d:/Employment%20Management%20System/EMS-Leave-Management-Verification.md)
- Complete Day 8 verification matrix.
- Execute `npx tsc --noEmit` and production build (`npx vite build`) to confirm zero compilation or bundling errors.

---

## Verification Plan

### Automated Tests & Type Checks
- `npx tsc --noEmit`
- `npx vite build`

### Manual Verification
- Test switching approval layer configurations (Single, Double, Third) in Super Admin Settings and verifying approval workflow routing in Leave Management.
- Test Calendar month navigation and date click modals.
- Test 8-axis filter synchronization across Calendar, Analytics, and Table.
- Test table column sorting and header checkbox indeterminate state.
