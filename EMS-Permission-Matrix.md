# NexusHR EMS — CURRENT PERMISSION MATRIX & SECURITY AUDIT

**Document Type:** Technical Security Audit, RBAC Matrix, & Architecture Specification  
**Version:** 1.0.0 (Definitive Baseline)  
**Status:** Audit & Documentation Complete (Zero Code Modifications Made)  
**Target System:** NexusHR Enterprise Employment Management System (EMS)  
**Audit Scope:** Frontend Permission Engine, Component Enforcement, Route Guards, Sidebar Navigation, Scope Filtering, Feature Flags, Subscriptions, and Backend API Authorization.

---

## 1. Executive Summary

This document provides the definitive **CURRENT PERMISSION MATRIX** and **RBAC Security Audit** for the NexusHR Employment Management System (EMS). The audit was conducted strictly against the active codebase (`src/app/...`) without assuming business intentions or unwritten requirements.

### Key Audit Highlights:
1. **Permission Engine Architecture:** In Task 2.1, a centralized Permission Engine (`src/app/shared/permission-engine/`) was introduced, defining 31 module constants (`MODULES`), 28 action constants (`ACTIONS`), 8 system role templates (`ROLE_TEMPLATES`), and a reactive React context (`PermissionContext`).
2. **Coexistence of Legacy vs Modern RBAC:** While `Sidebar.tsx` and route wrappers use the new permission engine (`usePermissions`, `P.PAYROLL_VIEW`, etc.), **many core feature components** (such as `Payroll.tsx`, `ExpenseManagement.tsx`, `LeaveManagement.tsx`, `Performance.tsx`, and `SuperAdminDashboard.tsx`) still rely on legacy direct string checks (e.g., `user.role === "HR Manager"`).
3. **Route Guard Vulnerability:** Shared routes (such as `/payroll`, `/expenses`, `/leave`, `/attendance`) are protected by a generic `<Protected>` auth guard without explicit `requiredPermission` keys. Direct URL navigation is allowed for any logged-in user, leaving route protection dependent entirely on wrapper component rendering.
4. **Unused Abstractions:** The `<PermissionGate>` UI component is implemented in `src/app/shared/permission-engine/PermissionGate.tsx` but is utilized in **zero** page components across the application.
5. **Feature Flags & Subscriptions:** Admin feature policies (`FeatureManagementView.tsx`) and subscription tiers (`SubscriptionBillingView.tsx`) exist as Super Admin mock UI features, but have **zero runtime integration** with `PermissionContext`, navigation filtering, or component gating.
6. **Backend/API Authorization:** The frontend operates on mock data (`mockApi.ts`, `mockData.ts`). Server-side/API authorization is **NOT VERIFIED / NOT IMPLEMENTED**.

---

## 2. Roles Audited

The codebase defines 8 canonical system roles in [`src/app/shared/permission-engine/roles.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/roles.ts#L47-L56).

| Role Name | Internal Role ID (`ROLE_IDS`) | Permission Definition | Permission Assignment | Dashboard Access | Route Access | Navigation Access | Scope | Special Restrictions |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Platform Admin** | `role_platform_admin` | `permissions.ts` | `roles.ts` (`hierarchyLevel: 0`) | `/platform-admin/dashboard` | Protected via `P.PLATFORM_ADMIN_FULL` | Dedicated Admin Sidebar | Organization (Global SaaS) | Restricted to `/platform-admin/*` routes. Cannot view tenant HR data directly. |
| **Super Admin** | `role_super_admin` | `permissions.ts` | `roles.ts` (`hierarchyLevel: 1`) | `/admin/dashboard` (redirects to `/dashboard`) | Unrestricted access across standard app routes | Full Navigation Tree | Organization | Full system privileges within the tenant organization. |
| **HR Manager** | `role_hr_manager` | `permissions.ts` | `roles.ts` (`hierarchyLevel: 2`) | `/hr/dashboard` (redirects to `/dashboard`) | Access to HR, Employees, Recruitment, Onboarding, Offboarding, Attendance, Leave, Performance, Training, Documents | HR Operations & Team Mgmt Groups | Organization / Department | Excluded from `payroll:manage`, `expenses:final_approval`, and `manage_account:manage`. |
| **Finance Manager** | `role_finance_manager` | `permissions.ts` | `roles.ts` (`hierarchyLevel: 2`) | `/finance/dashboard` (redirects to `/dashboard`) | Access to Payroll, Expenses, Settlements, Asset Cost Report, Onboarding setup | Finance & Payroll Group | Organization | Access to financial data, read-only employee view, limited HR operations access. |
| **IT Admin** | `role_it_admin` | `permissions.ts` | `roles.ts` (`hierarchyLevel: 3`) | `/dashboard` | Access to Assets (`/asset-management`), Documents, IT Clearance | Asset Mgmt & IT Clearance | Organization / Branch | Restricted strictly to IT Asset Management and IT Clearance tasks. |
| **Manager** | `role_dept_manager` | `permissions.ts` | `roles.ts` (`hierarchyLevel: 3`) | `/manager/dashboard` (redirects to `/dashboard`) | Team Attendance, Team Leave, Team Performance, Team Training, Team Expenses, Team Appraisal | Team Management & HR Operations (Team sub-items) | Department / Team | Access scoped to direct report employees and department team items. |
| **Team Lead** | `role_team_lead` | `permissions.ts` | `roles.ts` (`hierarchyLevel: 4`) | `/employee/dashboard` (redirects to `/dashboard`) | Team Attendance approval, Team Leave recommendation, Team Performance review | Team sub-items & My Workspace | Team | Identical permission keys to Manager for team approvals, but lower hierarchy level. |
| **Employee** | `role_employee` | `permissions.ts` | `roles.ts` (`hierarchyLevel: 5`) | `/employee/dashboard` (redirects to `/dashboard`) | Self-service routes (`/employee/*`, `/self-service`, `/my-assets`, `/my-documents`) | My Workspace & My Journey | Self | Access restricted strictly to own employee record and self-service requests. |

---

## 3. EMS Modules Audited

The codebase explicitly defines 31 module constants in [`src/app/shared/permission-engine/permissions.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/permissions.ts#L16-L47). Below is the audit status of the 22 core requested modules:

1. **Dashboard (`dashboard`):** Active. Wrapped by `DashboardWrapper.tsx`. Gated via `P.DASHBOARD_VIEW`.
2. **Employee Directory (`employees` / `directory`):** Active. Handled via `EmployeesPage.tsx` and `DirectoryWrapper`. Gated via `P.EMPLOYEES_VIEW`, `P.EMPLOYEES_MANAGE`, `P.EMPLOYEES_VIEW_TEAM`.
3. **Manage Account (`manage_account`):** Active for Super Admin. Located at `/admin/manage-account`. Gated via `P.MANAGE_ACCOUNT_VIEW` and `P.MANAGE_ACCOUNT_MANAGE`.
4. **Recruitment (`recruitment`):** Active. Located at `/recruitment` (`Recruitment.tsx`). Gated via `P.RECRUITMENT_FULL`, `P.RECRUITMENT_MANAGE`, `P.RECRUITMENT_INTERVIEW`.
5. **Onboarding (`onboarding`):** Active. Located at `/onboarding` (`OnboardingPage.tsx`). Gated via `P.ONBOARDING_FULL`, `P.ONBOARDING_MANAGE`, `P.ONBOARDING_FINANCE_SETUP`.
6. **Offboarding (`offboarding`):** Active. Located at `/offboarding` (`Offboarding.tsx`). Gated via `P.OFFBOARDING_FULL`, `P.OFFBOARDING_MANAGE`, `offboarding.clearance.*`.
7. **Attendance (`attendance`):** Active. Located at `/attendance` (`Attendance.tsx`, `ManagerAttendance.tsx`, `EmployeeAttendance.tsx`). Gated via `P.ATTENDANCE_FULL`, `P.ATTENDANCE_MANAGE`, `P.ATTENDANCE_APPROVE_TEAM`.
8. **Leave (`leave`):** Active. Located at `/leave` (`LeaveManagement.tsx`, `ManagerLeaveApprovals.tsx`, `EmployeeLeaves.tsx`). Gated via `P.LEAVE_MANAGE`, `P.LEAVE_APPROVE`, `P.LEAVE_APPROVE_TEAM`.
9. **Schedule (`schedule`):** Active. Located at `/schedule` (`ShiftSchedule.tsx`, `ManagerTeamSchedule.tsx`, `EmployeeSchedule.tsx`). Gated via `P.SCHEDULE_MANAGE`, `P.SCHEDULE_VIEW_TEAM`.
10. **Performance (`performance`):** Active. Located at `/performance` (`Performance.tsx`, `ManagerTeamPerformance.tsx`, `EmployeePerformance.tsx`). Gated via `P.PERFORMANCE_REVIEW`, `P.PERFORMANCE_REVIEW_TEAM`.
11. **Goals (`goals`):** Active. Located at `/goals` (`FinanceGoals.tsx`, `ManagerPersonalGoals.tsx`). Gated via `P.GOALS_MANAGE`, `P.GOALS_SELF`.
12. **Training (`training`):** Active. Located at `/training` (`Training.tsx`, `ManagerTeamTraining.tsx`, `EmployeeTraining.tsx`). Gated via `P.TRAINING_MANAGE`, `P.TRAINING_ASSIGN`, `P.TRAINING_LEARN`.
13. **Payroll (`payroll`):** Active. Located at `/payroll` (`Payroll.tsx`, `FinancePayroll.tsx`). Gated via `P.PAYROLL_FULL`, `P.PAYROLL_VIEW`, `P.PAYROLL_MANAGE`.
14. **Payslips (`payslips`):** Active. Located at `/payslips` (`EmployeePayslips.tsx`, `FinancePayslips.tsx`). Gated via `P.PAYROLL_PAYSLIPS`.
15. **Expenses (`expenses`):** Active. Located at `/expenses` (`ExpenseManagement.tsx`, `FinanceExpenses.tsx`, `ManagerExpenseApprovals.tsx`). Gated via `P.EXPENSES_FULL`, `P.EXPENSES_LEVEL_1`, `P.EXPENSES_FINAL_APPROVAL`, `P.EXPENSES_APPROVE_TEAM`.
16. **Assets (`assets`):** Active. Located at `/asset-management` (`AssetManagement.tsx`, `ManagerTeamAssets.tsx`, `MyAssets.tsx`). Gated via `P.ASSETS_FULL`, `P.ASSETS_MANAGE`, `P.ASSETS_VIEW_COST`, `P.ASSETS_SELF`.
17. **Reports (`reports`):** Active. Located at `/reports` (`Reports.tsx`, `FinanceReports.tsx`, `ManagerReports.tsx`). Gated via `P.REPORTS_ALL`, `P.REPORTS_HR`, `P.REPORTS_FINANCE`, `P.REPORTS_TEAM`.
18. **F&F Settlement (`settlements`):** Active. Located at `/finance/settlements` (`FinanceSettlements.tsx`). Gated via `P.SETTLEMENTS_FULL`, `P.OFFBOARDING_FINANCE_MANAGE`.
19. **Audit Logs (`audit_logs`):** Active. Located at `/settings/audit-logs` (`AuditLogs.tsx`, `HRAuditLogs.tsx`, `FinanceAuditLogs.tsx`). Gated via `P.AUDIT_LOGS_FULL`, `P.AUDIT_LOGS_VIEW`.
20. **Notifications (`notifications`):** Active. Located at `/notifications` (`Notifications.tsx`, `ManagerNotifications.tsx`, `EmployeeNotifications.tsx`). Gated via `P.NOTIFICATIONS_MANAGE`, `P.NOTIFICATIONS_VIEW`.
21. **Settings (`settings`):** Active. Located at `/settings` (`Settings.tsx`, `FinancePayrollSettings.tsx`). Gated via `P.SETTINGS_FULL`, `P.SETTINGS_MANAGE`, `P.SETTINGS_SELF`.
22. **Platform Administration (`platform_admin`):** Active. Located at `/platform-admin/*` (`AdminLayout.tsx`). Gated via `P.PLATFORM_ADMIN_FULL`.

---

## 4. Permission Model Architecture

The NexusHR permission model uses a **Role-Based Access Control (RBAC)** architecture with granular permission keys formatted as `module:action`.

```
[User Session] ──> [user.role / user.roleAssignments] ──> [PermissionContext]
                                                                  │
                                                      Resolves Permission Set
                                                      (Set of "module:action")
                                                                  │
                    ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
                    ▼                                             ▼                                             ▼
        [Sidebar Navigation]                             [Route Protection]                             [Component Render]
    `filterNavigation(tree, set)`                     `routes.tsx` AuthGuard                         Conditional buttons/tabs
      Gates visible sidebar items                     Gates `/admin/*`, `/platform-admin`            `usePermissionKey()` / `usePermission()`
```

### Key Architectural Concepts:
- **Permission Key Helper:** `permissionKey(module, action)` generates stable strings like `"employees:manage"`.
- **Pre-Built Key Catalog `P`:** Exported dictionary in `permissions.ts` containing ~60 static keys.
- **Permission Resolution:** `resolvePermissions(assignments)` computes the union set of permissions for all active role assignments.
- **Legacy Fallback:** If `user.roleAssignments` is undefined, `PermissionContext` maps `user.role` string via `LEGACY_ROLE_MAP` to seed mock assignments.

---

## 5. Action-Level Permission Audit

For every role/module combination, the existence of specific actions was evaluated based strictly on codebase implementation:

- **EXISTS:** Action key exists in permission catalog and is assigned/checked in UI.
- **PARTIAL:** Action key exists or UI has partial logic, but missing complete end-to-end integration.
- **MISSING:** Action is conceptually applicable but has no permission key or UI code.
- **NOT APPLICABLE:** Action makes no logical sense for the module (e.g., Approve on Settings).
- **NOT VERIFIED:** Cannot be confirmed from frontend source code (e.g., backend authorization).

### Action Matrix Summary across Key Modules:

| Module | View | Create | Edit | Delete | Approve | Reject | Submit | Export | Download | Assign | Configure | Manage | Lock | Unlock |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE |
| **Employee Directory** | EXISTS | EXISTS | EXISTS | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Manage Account** | EXISTS | EXISTS | EXISTS | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | MISSING | MISSING |
| **Recruitment** | EXISTS | PARTIAL | PARTIAL | MISSING | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Onboarding** | EXISTS | PARTIAL | PARTIAL | MISSING | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Offboarding** | EXISTS | EXISTS | PARTIAL | MISSING | EXISTS | EXISTS | EXISTS | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Attendance** | EXISTS | EXISTS | EXISTS | MISSING | EXISTS | EXISTS | EXISTS | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Leave** | EXISTS | EXISTS | PARTIAL | MISSING | EXISTS | EXISTS | EXISTS | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Schedule** | EXISTS | EXISTS | EXISTS | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | MISSING | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Performance** | EXISTS | PARTIAL | PARTIAL | MISSING | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT APPLICABLE | NOT APPLICABLE |
| **Goals** | EXISTS | EXISTS | EXISTS | MISSING | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Training** | EXISTS | EXISTS | PARTIAL | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Payroll** | EXISTS | EXISTS | EXISTS | MISSING | PARTIAL | PARTIAL | NOT APPLICABLE | PARTIAL | PARTIAL | NOT APPLICABLE | EXISTS | EXISTS | MISSING | MISSING |
| **Payslips** | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE |
| **Expenses** | EXISTS | EXISTS | PARTIAL | MISSING | EXISTS | EXISTS | EXISTS | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Assets** | EXISTS | EXISTS | EXISTS | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Reports** | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE |
| **F&F Settlement** | EXISTS | EXISTS | EXISTS | MISSING | EXISTS | EXISTS | NOT APPLICABLE | PARTIAL | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | EXISTS | MISSING | MISSING |
| **Audit Logs** | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE |
| **Notifications** | EXISTS | EXISTS | NOT APPLICABLE | MISSING | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Settings** | EXISTS | NOT APPLICABLE | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | EXISTS | EXISTS | NOT APPLICABLE | NOT APPLICABLE |
| **Platform Admin** | EXISTS | EXISTS | EXISTS | EXISTS | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | PARTIAL | NOT APPLICABLE | NOT APPLICABLE | EXISTS | EXISTS | NOT APPLICABLE | NOT APPLICABLE |

---

## 6. Role-by-Module Summary Matrix

This simplified matrix details the effective access granted to each role across all 22 EMS modules based on `roles.ts` templates and component rendering wrappers:

| Module | Platform Admin | Super Admin | HR | Finance | IT | Manager | Team Lead | Employee | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | FULL | FULL | FULL | FULL | READ | FULL | FULL | SELF | `DashboardWrapper.tsx` renders role-specific dashboard |
| **Employee Directory** | READ | FULL | FULL | READ | NONE | READ | READ | SELF | `P.EMPLOYEES_MANAGE` vs `P.EMPLOYEES_VIEW_TEAM` |
| **Manage Account** | NONE | FULL | NONE | NONE | NONE | NONE | NONE | NONE | `P.MANAGE_ACCOUNT_MANAGE` locked to Super Admin |
| **Recruitment** | NONE | FULL | FULL | NONE | NONE | READ | NONE | SELF | Manager has interview access (`P.RECRUITMENT_INTERVIEW`) |
| **Onboarding** | NONE | FULL | FULL | PARTIAL | NONE | FULL | NONE | SELF | Finance has setup permission (`P.ONBOARDING_FINANCE_SETUP`) |
| **Offboarding** | NONE | FULL | FULL | EDIT | EDIT | EDIT | NONE | SELF | Clearance permissions split by function |
| **Attendance** | NONE | FULL | FULL | READ | NONE | APPROVE | APPROVE | SELF | `AttendanceWrapper.tsx` routes by permission |
| **Leave** | NONE | FULL | FULL | READ | NONE | APPROVE | APPROVE | SELF | `LeaveWrapper.tsx` routes by permission |
| **Schedule** | NONE | FULL | FULL | READ | NONE | EDIT | EDIT | SELF | `ScheduleWrapper.tsx` routes by permission |
| **Performance** | NONE | FULL | FULL | READ | NONE | APPROVE | APPROVE | SELF | `PerformanceWrapper.tsx` routes by permission |
| **Goals** | NONE | FULL | READ | READ | NONE | EDIT | SELF | SELF | Manager manages team goals |
| **Training** | NONE | FULL | FULL | NONE | NONE | EDIT | READ | SELF | `TrainingWrapper.tsx` routes by permission |
| **Payroll** | NONE | READ | READ | FULL | NONE | NONE | NONE | NONE | `PayrollWrapper.tsx` routes Finance to `FinancePayroll` |
| **Payslips** | NONE | READ | READ | FULL | NONE | SELF | SELF | SELF | `PayslipsWrapper.tsx` routes to `EmployeePayslips` |
| **Expenses** | NONE | FULL | EDIT | APPROVE | NONE | APPROVE | APPROVE | SELF | `ExpensesWrapper.tsx` distinguishes level 1 vs final approval |
| **Assets** | NONE | FULL | EDIT | READ | FULL | READ | SELF | SELF | IT Admin manages assets (`P.ASSETS_MANAGE`) |
| **Reports** | READ | FULL | FULL | FULL | NONE | READ | READ | SELF | `ReportsWrapper.tsx` routes by report scope permission |
| **F&F Settlement** | NONE | FULL | NONE | FULL | NONE | NONE | NONE | NONE | Finance Settlement workspace |
| **Audit Logs** | NONE | FULL | READ | READ | NONE | NONE | NONE | NONE | `AuditLogsWrapper.tsx` routes by permission |
| **Notifications** | NONE | FULL | FULL | READ | READ | READ | READ | READ | `NotificationsWrapper.tsx` handles announcements/notifs |
| **Settings** | EDIT | FULL | SELF | SELF | NONE | SELF | SELF | SELF | Super Admin gets `P.SETTINGS_FULL` |
| **Platform Admin** | FULL | NONE | NONE | NONE | NONE | NONE | NONE | NONE | Gated by `P.PLATFORM_ADMIN_FULL` |

---

## 7. Scope Validation & Enforcement Matrix

In [`src/app/shared/permission-engine/roles.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/roles.ts#L20-L21), 5 scope types are declared: `"organization" | "branch" | "department" | "team" | "self"`.

### Crucial Security Finding: Scope Type vs. Scope Enforcement
Defining a scope type in a role assignment does **not** guarantee component or API level filtering.

| Scope Type | Defined in Engine? | Assigned Roles | Frontend Component Filtering | API / Backend Enforcement | Enforcement Mechanism | Evidence / Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Organization** | `EXISTS` | Platform Admin, Super Admin, HR, Finance | `PARTIAL` | `NOT VERIFIED` | Navigation / Route Wrapper | Role assignment defaults to `organization` scope. Components render org-wide data. |
| **Branch** | `EXISTS` | None (Seeded in types) | `NOT IMPLEMENTED` | `NOT VERIFIED` | None | Type exists in `ScopeType`, but no active role assignment or component filtering uses `branch`. |
| **Department** | `EXISTS` | HR, Manager (Optional) | `PARTIAL` | `NOT VERIFIED` | Component Local State Filter | Department filtering is done via UI dropdowns (`selectedDepartment`) rather than permission scope enforcement. |
| **Team** | `EXISTS` | Manager, Team Lead | `PARTIAL` | `NOT VERIFIED` | Component Filtering | Manager components (`ManagerAttendance`, `ManagerLeaveApprovals`) filter mock list by team members. |
| **Self** | `EXISTS` | Employee, All roles (Self-service) | `EXISTS` | `NOT VERIFIED` | Route Wrapper & Workspace Pages | Employee pages (`EmployeeLeaves`, `EmployeeAttendance`) load logged-in user's data only. |

---

## 8. Read-Only / Editable Access Validation

Access state was audited across major feature forms, tables, and detail views to determine how read-only vs editable state is enforced:

| Module / Component | Target Role(s) | Observed UI Behavior | Enforcement Code | Evidence / File Path | Access State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Payroll View** (`Payroll.tsx`) | HR Manager | Action buttons ("Run Payroll", "Edit Salary") hidden or disabled; salary table rendered read-only. | `const isFinance = user?.role === "Finance";` | [`Payroll.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/hr/finance-payroll/Payroll.tsx#L45) | `READ ONLY` |
| **Payroll Ops** (`FinancePayroll.tsx`) | Finance | Full creation, calculation, bulk process, and edit forms enabled. | `hasPermissionKey(P.PAYROLL_FULL)` | [`routes.tsx`](file:///d:/Employment%20Management%20System/src/app/routes.tsx#L917) | `EDITABLE` |
| **Employees List** (`EmployeesPage.tsx`) | Manager / Team Lead | "Add Employee" button hidden; employee action menu restricted to "View Profile". | `const canManage = usePermission("employees", "manage");` | [`EmployeesPage.tsx`](file:///d:/Employment%20Management%20System/src/app/features/Employee/EmployeesPage.tsx#L32) | `READ ONLY` |
| **Expense Approvals** (`ExpenseManagement.tsx`) | HR Manager | Level 1 Approve / Reject enabled; Final Pay approval disabled/hidden. | `user?.role === "HR Manager"` check | [`ExpenseManagement.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/hr/finance-payroll/ExpenseManagement.tsx#L88) | `PARTIAL` |
| **Asset Management** (`AssetManagement.tsx`) | IT Admin | Asset assignment modal enabled; financial cost summary hidden. | `hasPermissionKey(P.ASSETS_VIEW_COST)` | [`AssetManagement.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/hr/finance-payroll/AssetManagement.tsx#L62) | `PARTIAL` |
| **Offboarding Clearance** (`OffboardingDetail.tsx`) | HR / IT / Finance | Department clearance checkbox toggle enabled only for matching role clearance key. | `usePermissionKey(clearanceKey)` | [`OffboardingDetail.tsx`](file:///d:/Employment%20Management%20System/src/app/features/Offboarding/detail/OffboardingDetail.tsx#L40) | `EDITABLE` (Scope restricted) |

---

## 9. Permission Enforcement Layer Matrix

Each requested enforcement layer was evaluated to distinguish frontend presentation logic from true server authorization:

| Module | Permission Defined (`permissions.ts`) | Permission Assigned (`roles.ts`) | UI Enforcement (`usePermission` / Conditional) | Route Enforcement (`routes.tsx` AuthGuard) | Backend/API Enforcement | Enforcement Summary |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `DashboardWrapper` component |
| **Employee Directory** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated via `EmployeesPage` internal hooks |
| **Manage Account** | `EXISTS` | `EXISTS` | `EXISTS` | `EXISTS` (`P.MANAGE_ACCOUNT_VIEW`) | `NOT VERIFIED` | Protected at route level |
| **Recruitment** | `EXISTS` | `EXISTS` | `PARTIAL` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated via direct role checks in component |
| **Onboarding** | `EXISTS` | `EXISTS` | `PARTIAL` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated via direct role checks in component |
| **Offboarding** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated via clearance permission keys |
| **Attendance** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `AttendanceWrapper` component |
| **Leave** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `LeaveWrapper` component |
| **Schedule** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `ScheduleWrapper` component |
| **Performance** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `PerformanceWrapper` component |
| **Goals** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `GoalsWrapper` component |
| **Training** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `TrainingWrapper` component |
| **Payroll** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `PayrollWrapper` component |
| **Payslips** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `PayslipsWrapper` component |
| **Expenses** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `ExpensesWrapper` component |
| **Assets** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by route path & component state |
| **Reports** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `ReportsWrapper` component |
| **F&F Settlement** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Route path `/finance/settlements` |
| **Audit Logs** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `AuditLogsWrapper` component |
| **Notifications** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Gated by `NotificationsWrapper` component |
| **Settings** | `EXISTS` | `EXISTS` | `EXISTS` | `PARTIAL` (Auth only) | `NOT VERIFIED` | Protected by settings tab permissions |
| **Platform Admin** | `EXISTS` | `EXISTS` | `EXISTS` | `EXISTS` (`P.PLATFORM_ADMIN_FULL`)| `NOT VERIFIED` | Explicit route guard on `/platform-admin` |

---

## 10. Feature Enable/Disable Matrix

The system includes a Feature Flag management screen for Super Admins ([`FeatureManagementView.tsx`](file:///d:/Employment%20Management%20System/src/app/admin/features/featureManagement/FeatureManagementView.tsx#L16)). Below is the runtime evaluation:

```
Feature Definition ──> Local State / Mock DB ──X─> PermissionContext ──X─> Sidebar / Route Gating
 (EXISTS)                 (EXISTS)                (NOT IMPLEMENTED)         (NOT IMPLEMENTED)
```

| Evaluation Dimension | Status | Evidence / Source Code Location | Description |
| :--- | :--- | :--- | :--- |
| **Feature Definition Exists** | `EXISTS` | [`mockData.ts`](file:///d:/Employment%20Management%20System/src/app/admin/mockData.ts) & `FeatureManagementView.tsx` | Feature flags are defined in mock DB with attributes `key`, `category`, `status`, `rolloutPct`, `enabledPlans`. |
| **Feature Can Be Enabled/Disabled** | `EXISTS` | [`FeatureManagementView.tsx:L36`](file:///d:/Employment%20Management%20System/src/app/admin/features/featureManagement/FeatureManagementView.tsx#L36) | Admins can toggle status between `Active` and `Inactive` in UI. |
| **Organization-Level Configuration** | `PARTIAL` | `FeatureFlag` type definition | `enabledOrgIds: string[]` exists in TypeScript interface, but no UI selector exists to configure per-org flags. |
| **Tenant Runtime Enforcement** | `NOT IMPLEMENTED` | Base app codebase | No hook or context reads `featureFlags` to disable features for a tenant at runtime. |
| **Navigation Affected** | `NOT IMPLEMENTED` | [`navigation.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/navigation.ts) | `FULL_NAVIGATION` items evaluate permissions only, ignoring feature flag toggles. |
| **Route Affected** | `NOT IMPLEMENTED` | [`routes.tsx`](file:///d:/Employment%20Management%20System/src/app/routes.tsx) | Router guards do not check feature flag state before rendering pages. |
| **Page Affected** | `NOT IMPLEMENTED` | Feature page components | Components do not wrap feature sections in feature flag checks. |

---

## 11. Subscription Model Validation Matrix

Subscription tiers (`STARTER`, `PROFESSIONAL`, `ENTERPRISE`) are defined in Super Admin Billing views ([`SubscriptionBillingView.tsx`](file:///d:/Employment%20Management%20System/src/app/admin/features/subscription-billing/SubscriptionBillingView.tsx)):

```
Subscription Tier ──> Organization Model ──X─> Enabled Features ──X─> Role Permissions
 (EXISTS)                (EXISTS)             (NOT IMPLEMENTED)      (NOT IMPLEMENTED)
```

| Evaluation Dimension | Status | Implementation Detail |
| :--- | :--- | :--- |
| **Subscription Models Exist** | `EXISTS` | Defined in `src/app/admin/types.ts` (`SubscriptionPlan = 'Starter' \| 'Professional' \| 'Enterprise'`). |
| **Feature Limits Exist** | `PARTIAL` | `enabledPlans` array exists on Feature Flags mock objects. |
| **Organization Subscription Exists** | `EXISTS` | `Organization` mock objects include `subscriptionPlan` and `billingStatus` attributes. |
| **Runtime Feature Gating** | `NOT IMPLEMENTED` | App components do not restrict access based on active organization's subscription plan. |
| **Runtime Permission Restriction** | `NOT IMPLEMENTED` | `resolvePermissions()` computes permissions based solely on role templates, ignoring subscription tier. |
| **Backend Enforcement** | `NOT VERIFIED` | No backend API exists to enforce subscription quota boundaries or plan locks. |

---

## 12. Permission System Inconsistencies

During the audit, 6 major inconsistencies were identified in the codebase:

### 1. [P0 Critical] Route Protection Relying on Component Wrappers
- **Location:** [`src/app/routes.tsx`](file:///d:/Employment%20Management%20System/src/app/routes.tsx#L1250-L1400)
- **Issue:** Main application routes (e.g., `/payroll`, `/expenses`, `/attendance`, `/leave`) are wrapped with generic `<Protected>` auth checks that pass no `requiredPermission` parameter.
- **Impact:** An authenticated user with role `Employee` can enter `/payroll` directly in the URL bar. The route guard passes. Route protection relies entirely on `PayrollWrapper()` rendering `EmployeePayslips` instead of `FinancePayroll`. If wrapper logic fails, unauthorized views leak.

### 2. [P1 High] Legacy Direct Role Checking in Feature Components
- **Location:** `Payroll.tsx`, `ExpenseManagement.tsx`, `LeaveManagement.tsx`, `Performance.tsx`, `SuperAdminDashboard.tsx`, `Reports.tsx`
- **Issue:** Components contain direct `if (user?.role === "HR Manager")` or `user?.role === "Finance"` checks.
- **Impact:** Defeats the purpose of the Permission Engine (`usePermission`). Custom roles or modified role templates will fail to unlock component actions because code checks hardcoded role string literals.

### 3. [P1 High] Unused `<PermissionGate>` Component
- **Location:** [`src/app/shared/permission-engine/PermissionGate.tsx`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/PermissionGate.tsx)
- **Issue:** `<PermissionGate>` is implemented and exported in the permission engine index, but is used in **0** page components across the entire repository.
- **Impact:** Developers resort to ad-hoc ternary checks or direct role evaluations.

### 4. [P2 Medium] Disconnected Feature Flags & Subscriptions
- **Location:** `FeatureManagementView.tsx` & `SubscriptionBillingView.tsx`
- **Issue:** Feature flag toggles and plan assignments modify mock storage but do not communicate with `PermissionContext` or `navigation.ts`.
- **Impact:** Disabling a feature in Super Admin settings has zero effect on tenant end-users.

### 5. [P2 Medium] Inconsistent Permission Key Naming Conventions
- **Location:** [`src/app/shared/permission-engine/permissions.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/permissions.ts#L148-L155)
- **Issue:** Standard permissions use colon-delimited keys (e.g., `offboarding:manage`), but offboarding clearance keys use dot-notation (e.g., `offboarding.clearance.hr`).
- **Impact:** Breaks automated permission key parsing and string generators.

### 6. [P3 Low] Team Lead vs. Department Manager Permission Redundancy
- **Location:** [`src/app/shared/permission-engine/roles.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/roles.ts#L354-L498)
- **Issue:** `Team Lead` and `Manager` share nearly identical permission keys for Attendance, Leave, Performance, and Expenses, but Team Lead lacks clearance and onboarding permissions.
- **Impact:** Increases seed template verbosity without clear structural scoping distinctions.

---

## 13. Security Gaps

| Severity | Gap Description | Current Risk | Remediation Target |
| :--- | :--- | :--- | :--- |
| **P0 Critical** | **Missing Explicit Route Permission Guards** | Authenticated users can bypass navigation UI restrictions by manually entering URL paths. | Attach explicit `requiredPermission={P.PAYROLL_VIEW}` to `routes.tsx` definitions. |
| **P0 Critical** | **Missing Backend Authorization Enforcement** | All authorization checks occur on the client side. Any API request manipulates mock data directly. | Implement server-side middleware (JWT claims + database RBAC checks) for all REST/GraphQL endpoints. |
| **P1 High** | **Unenforced Multi-Tenant Data Isolation** | Organization ID scope (`scopeId`) is not strictly validated on data fetching hooks. | Implement row-level security (RLS) and mandatory `tenant_id` filters on all data queries. |
| **P1 High** | **Hardcoded Role String Reliance** | Legacy components ignore granted permission sets, rendering UI strictly based on string match. | Refactor all component ternary checks to use `usePermissionKey()` or `<PermissionGate>`. |
| **P2 Medium** | **Unenforced Scope Filtering** | `department` and `team` scope assignments do not automatically constrain data queries. | Integrate scope parameters (`scopeType`, `scopeId`) into data query hooks. |
| **P2 Medium** | **Dead Feature Flag Gating** | Feature policies configured in Admin panel do not turn off frontend routes or buttons. | Connect `FeatureManagementStore` to `PermissionProvider` to compute effective permissions dynamically. |

---

## 14. Current Implementation Matrix

This table represents the **DEFINITIVE ACTIVE STATE** of permissions in the NexusHR codebase today:

| Role | Module | View | Create | Edit | Delete | Approve | Reject | Submit | Export | Download | Configure | Scope | Access Mode | Evidence File | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Platform Admin** | Platform Admin | EXISTS | EXISTS | EXISTS | EXISTS | N/A | N/A | N/A | PARTIAL | N/A | EXISTS | Organization | FULL | `AdminLayout.tsx` | EXISTS |
| **Platform Admin** | Dashboard | EXISTS | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Organization | READ ONLY | `AdminDashboardView.tsx` | EXISTS |
| **Super Admin** | Manage Account | EXISTS | EXISTS | EXISTS | EXISTS | N/A | N/A | N/A | N/A | N/A | EXISTS | Organization | FULL | `ManageAccountUsers.tsx` | EXISTS |
| **Super Admin** | Employees | EXISTS | EXISTS | EXISTS | EXISTS | N/A | N/A | N/A | PARTIAL | N/A | N/A | Organization | FULL | `EmployeesPage.tsx` | EXISTS |
| **Super Admin** | Payroll | EXISTS | EXISTS | EXISTS | MISSING | PARTIAL | PARTIAL | N/A | PARTIAL | PARTIAL | EXISTS | Organization | READ ONLY | `Payroll.tsx` | PARTIAL |
| **Super Admin** | Settings | EXISTS | N/A | EXISTS | N/A | N/A | N/A | N/A | N/A | N/A | EXISTS | Organization | FULL | `Settings.tsx` | EXISTS |
| **HR Manager** | Employees | EXISTS | EXISTS | EXISTS | MISSING | N/A | N/A | N/A | PARTIAL | N/A | N/A | Organization | EDITABLE | `EmployeesPage.tsx` | EXISTS |
| **HR Manager** | Recruitment | EXISTS | PARTIAL | PARTIAL | MISSING | N/A | N/A | EXISTS | N/A | N/A | N/A | Organization | FULL | `Recruitment.tsx` | EXISTS |
| **HR Manager** | Onboarding | EXISTS | PARTIAL | PARTIAL | MISSING | N/A | N/A | EXISTS | N/A | N/A | N/A | Organization | FULL | `OnboardingPage.tsx` | EXISTS |
| **HR Manager** | Offboarding | EXISTS | EXISTS | PARTIAL | MISSING | EXISTS | EXISTS | EXISTS | N/A | N/A | N/A | Organization | FULL | `Offboarding.tsx` | EXISTS |
| **HR Manager** | Payroll | EXISTS | N/A | N/A | N/A | N/A | N/A | N/A | PARTIAL | N/A | N/A | Organization | READ ONLY | `Payroll.tsx` | EXISTS |
| **Finance** | Payroll | EXISTS | EXISTS | EXISTS | MISSING | PARTIAL | PARTIAL | N/A | PARTIAL | PARTIAL | EXISTS | Organization | FULL | `FinancePayroll.tsx` | EXISTS |
| **Finance** | Expenses | EXISTS | EXISTS | PARTIAL | MISSING | EXISTS | EXISTS | EXISTS | PARTIAL | N/A | N/A | Organization | FULL | `FinanceExpenses.tsx` | EXISTS |
| **Finance** | F&F Settlement| EXISTS | EXISTS | EXISTS | MISSING | EXISTS | EXISTS | N/A | PARTIAL | PARTIAL | N/A | Organization | FULL | `FinanceSettlements.tsx`| EXISTS |
| **IT Admin** | Assets | EXISTS | EXISTS | EXISTS | MISSING | N/A | N/A | N/A | N/A | N/A | N/A | Organization | EDITABLE | `AssetManagement.tsx` | EXISTS |
| **IT Admin** | Offboarding | EXISTS | N/A | PARTIAL | N/A | EXISTS | EXISTS | N/A | N/A | N/A | N/A | Branch | PARTIAL | `OffboardingDetail.tsx` | EXISTS |
| **Manager** | Attendance | EXISTS | N/A | N/A | N/A | EXISTS | EXISTS | N/A | N/A | N/A | N/A | Team | APPROVE | `ManagerAttendance.tsx` | EXISTS |
| **Manager** | Leave | EXISTS | N/A | N/A | N/A | EXISTS | EXISTS | N/A | N/A | N/A | N/A | Team | APPROVE | `ManagerLeaveApprovals.tsx`| EXISTS |
| **Manager** | Performance | EXISTS | N/A | PARTIAL | N/A | N/A | N/A | EXISTS | N/A | N/A | N/A | Department | EDITABLE | `ManagerTeamPerformance.tsx`| EXISTS |
| **Team Lead** | Attendance | EXISTS | N/A | N/A | N/A | EXISTS | EXISTS | N/A | N/A | N/A | N/A | Team | APPROVE | `ManagerAttendance.tsx` | EXISTS |
| **Employee** | Attendance | EXISTS | N/A | N/A | N/A | N/A | N/A | EXISTS | N/A | N/A | N/A | Self | SELF | `EmployeeAttendance.tsx`| EXISTS |
| **Employee** | Leave | EXISTS | N/A | N/A | N/A | N/A | N/A | EXISTS | N/A | N/A | N/A | Self | SELF | `EmployeeLeaves.tsx` | EXISTS |
| **Employee** | Expenses | EXISTS | N/A | N/A | N/A | N/A | N/A | EXISTS | N/A | N/A | N/A | Self | SELF | `ExpenseManagement.tsx` | EXISTS |
| **Employee** | Payslips | EXISTS | N/A | N/A | N/A | N/A | N/A | N/A | N/A | PARTIAL | N/A | Self | READ ONLY | `EmployeePayslips.tsx` | EXISTS |

---

## 15. Proposed Target Architecture

The target architecture introduces a **Unified Multi-Tenant RBAC Evaluation Pipeline** that connects Subscription, Feature Flags, Roles, Scopes, and Actions end-to-end:

```
[Tenant Context] ──> [Subscription Check] ──> [Feature Flag Check] ──> [Role Assignment] ──> [Scope Filter] ──> [Action Gate]
```

### Conceptual Architecture Schema:

```json
{
  "tenantId": "org-nexus-01",
  "subscriptionPlan": "PROFESSIONAL",
  "enabledFeatures": [
    "employees",
    "payroll",
    "leave",
    "attendance",
    "expenses"
  ],
  "user": {
    "id": "usr-102",
    "roleAssignments": [
      {
        "roleId": "role_dept_manager",
        "scopeType": "department",
        "scopeId": "dept-engineering",
        "permissions": [
          {
            "module": "leave",
            "action": "approve",
            "scope": "department",
            "accessMode": "editable"
          },
          {
            "module": "payroll",
            "action": "view",
            "scope": "self",
            "accessMode": "read_only"
          }
        ]
      }
    ]
  }
}
```

---

## 16. Implementation Gaps & Transition Plan

| Current State | Expected Target | Implementation Gap | Priority |
| :--- | :--- | :--- | :--- |
| Direct string checks in components (`user.role === 'HR'`) | Component-level permission hooks (`usePermissionKey(P.PAYROLL_MANAGE)`) | Legacy components must be refactored to consume the permission engine. | **P1 High** |
| Generic `<Protected>` AuthGuard without permission keys | Route-level permission enforcement on all router paths | Update `routes.tsx` to pass explicit `requiredPermission` keys to all protected routes. | **P0 Critical** |
| Disconnected Admin Feature Flags UI | Dynamic runtime feature gating connected to `PermissionContext` | Create `FeatureContext` and intersect active feature keys with role permissions. | **P2 Medium** |
| Mock data storage in local state | Server-side authorization middleware (JWT + DB tables) | Implement backend API endpoints with RBAC middleware verification. | **P0 Critical** |
| Manual component filtering for department/team scope | Automated query scope injection based on `RoleAssignment.scopeType` | Implement `useScopedQuery` hook that injects department/team IDs into API requests. | **P2 Medium** |

---

## 17. Recommended Next Steps & Build Status

### Recommended Next Steps for Task 2.3+:
1. **Refactor Route Protection:** Update `src/app/routes.tsx` to attach explicit `requiredPermission` keys to all main application route paths.
2. **Refactor Feature Components:** Replace legacy `user?.role === "..."` strings with `usePermissionKey()` in `Payroll.tsx`, `ExpenseManagement.tsx`, `LeaveManagement.tsx`, and `Performance.tsx`.
3. **Adopt `<PermissionGate>`:** Replace inline ternaries with `<PermissionGate module="..." action="...">` across table action buttons and header modals.
4. **Integrate Feature Flags:** Connect `FeatureManagementView` state to `PermissionContext` to allow runtime disabling of modules.
5. **Harmonize Clearance Keys:** Standardize offboarding clearance permission keys from dot-notation (`offboarding.clearance.hr`) to colon-notation (`offboarding:clearance_hr`).

---

### Build Verification Report

```
BUILD: FAIL
```

- **Command Executed:** `npm run build`
- **Execution Result:** `Exit code 1`
- **Error Output:**
  ```text
  > vite build && node -e "const fs = require('fs'); fs.copyFileSync('dist/index.html', 'dist/404.html');"

  vite v6.4.3 building for production...
  transforming...
  ✓ 3385 modules transformed.
  ✗ Build failed in 1m 52s
  error during build:
  [vite:esbuild-transpile] The service was stopped: write UNKNOWN
      at D:\Employment Management System\node_modules\esbuild\lib\main.js:718:38
      at responseCallbacks.<computed> (D:\Employment Management System\node_modules\esbuild\lib\main.js:603:9)
      at afterClose (D:\Employment Management System\node_modules\esbuild\lib\main.js:594:28)
      at Object.callback (D:\Employment Management System\node_modules\esbuild\lib\main.js:1986:18)
      at callback (node:internal/streams/writable:766:21)
      at onwriteError (node:internal/streams/writable:605:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:92:21)
  ```
- **Code Modifications:** **0 Files Modified** (Strictly audit & documentation only).

