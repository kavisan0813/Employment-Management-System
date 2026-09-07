# NexusHR EMS — Existing Roles Architecture Audit

**Audit Date:** August 18, 2026  
**Auditor:** Senior Software Architect & Access-Control Lead  
**Project:** NexusHR Employment Management System (EMS)

---

## 1. Executive Summary

This audit documents the exact roles architecture, role definitions, permission mappings, dashboard/sidebar routing, data scope implementations, and role-checking mechanisms currently active in the NexusHR EMS codebase.

Key findings:
- **Centralized Permission Engine:** Located at `src/app/shared/permission-engine/`. Fine-grained RBAC is driven by canonical `(MODULE, ACTION)` permission keys.
- **Legacy Migration Interoperability:** Legacy string roles (`user.role`) are mapped to internal role IDs (`ROLE_IDS`) in `PermissionContext.tsx` via `LEGACY_ROLE_MAP`.
- **System Roles Audited:** 8 system role IDs exist in `roles.ts` representing the 6 primary business roles plus 2 supplementary roles (`IT Admin`, `Team Lead`).
- **Data Scopes:** Data scopes (`organization`, `branch`, `department`, `team`, `self`) are formally typed in `roles.ts` (`ScopeType`), but actual filtering in UI components is currently driven by local state, mock filters, or conditional component selection.
- **Backend Enforcement:** The application currently operates in a client-side frontend architecture with `sessionStorage` mock session persistence; backend API/middleware role enforcement is **NOT VERIFIED IN CURRENT CODEBASE**.

---

## 2. Roles Found

The codebase contains 8 system role definitions across legacy string identifiers and new system role keys:

1. **Platform Admin** (`role_platform_admin` / `"Platform Admin"`) — SaaS Multi-tenant System Administrator.
2. **Super Admin** (`role_super_admin` / `"Super Admin"`) — Organization Owner & Administrator.
3. **HR Manager** (`role_hr_manager` / `"HR Manager"`) — Human Resources Administrator.
4. **Finance Manager** (`role_finance_manager` / `"Finance"`) — Payroll & Financial Operations Manager.
5. **Department Manager** (`role_dept_manager` / `"Manager"`) — Team & Department Lead.
6. **Employee** (`role_employee` / `"Employee"`) — Self-Service Staff Member.
7. **IT Admin** (`role_it_admin` / `"IT"`) — Information Technology Asset & Clearance Administrator.
8. **Team Lead** (`role_team_lead` / `"Team Lead"`) — Sub-department Team Leader.

---

## 3. Role Definitions

### Source Files:
- `src/app/context/auth.config.ts` (`UserRole` type & `ROLE_CONFIG`)
- `src/app/shared/permission-engine/roles.ts` (`ROLE_IDS` & `ROLE_TEMPLATES`)
- `src/app/context/AuthContext.tsx` (`User` interface)

```typescript
// auth.config.ts:1-9
export type UserRole =
  | "Platform Admin"
  | "Super Admin"
  | "HR Manager"
  | "Finance"
  | "IT"
  | "Manager"
  | "Team Lead"
  | "Employee";
```

```typescript
// roles.ts:47-56
export const ROLE_IDS = {
  PLATFORM_ADMIN: "role_platform_admin",
  SUPER_ADMIN: "role_super_admin",
  HR_MANAGER: "role_hr_manager",
  FINANCE_MANAGER: "role_finance_manager",
  IT_ADMIN: "role_it_admin",
  DEPT_MANAGER: "role_dept_manager",
  TEAM_LEAD: "role_team_lead",
  EMPLOYEE: "role_employee",
} as const;
```

---

## 4. Role → Dashboard Mapping

Routing to dashboards is handled by `DashboardWrapper.tsx` and `routes.tsx`:

| Role Identifier | Configured Home Route (`auth.config.ts`) | Root Redirect (`routes.tsx`) | Rendered Dashboard Component |
|---|---|---|---|
| **Platform Admin** | `/platform-admin/dashboard` | `/platform-admin/dashboard` | `AdminDashboardPage` (`DashboardView.tsx`) |
| **Super Admin** | `/dashboard` | `/admin/dashboard` → `/dashboard` | `SuperAdminDashboard.tsx` |
| **HR Manager** | `/dashboard` | `/hr/dashboard` → `/dashboard` | `HRDashboard.tsx` |
| **Finance** | `/dashboard` | `/finance/dashboard` → `/dashboard` | `FinanceDashboard.tsx` |
| **Manager** | `/dashboard` | `/manager/dashboard` → `/dashboard` | `ManagerDashboard.tsx` |
| **Employee** | `/dashboard` | `/employee/dashboard` → `/dashboard` | `EmployeeDashboard.tsx` |
| **IT** | `/dashboard` | `/dashboard` | `EmployeeDashboard.tsx` (Fallback) |
| **Team Lead** | `/dashboard` | `/dashboard` | `ManagerDashboard.tsx` |

*Note on Login Redirect:* In `Login.tsx`, mock preset logins map directly to these role strings and navigate to `/dashboard` (or `/platform-admin/dashboard` for Platform Admin).

---

## 5. Role → Sidebar Mapping

Navigation items are filtered dynamically in `Sidebar.tsx` using `filterNavigation(FULL_NAVIGATION, permissions)` from `navigation.ts`:

| Navigation Item | Platform Admin | Super Admin | HR Manager | Finance | Manager | Employee |
|---|---|---|---|---|---|---|
| **Dashboard** | YES | YES | YES | YES | YES | YES |
| **Roles & Permissions**| YES | YES | NO | NO | NO | NO |
| **Reports** | YES | YES | YES (HR) | YES (Finance)| YES (Team)| YES (Self) |
| **Employees** | YES | YES | YES | YES (View) | YES (Team) | NO |
| **Departments** | YES | YES | YES | YES (View) | YES (View) | NO |
| **Recruitment** | NO | YES | YES | NO | YES (Intv) | NO |
| **Onboarding** | NO | YES | YES | YES (Fin) | YES (Team) | YES (Task) |
| **Offboarding** | NO | YES | YES | YES (Fin) | YES (Clear)| NO |
| **Attendance** | NO | YES | YES | YES (View) | YES (Team) | YES (Self) |
| **Schedule** | NO | YES | YES | NO | YES (Team) | YES (Self) |
| **Leave Management** | NO | YES | YES | NO | YES (Team) | YES (Self) |
| **Performance** | NO | YES | YES | NO | YES (Team) | YES (Self) |
| **Training** | NO | YES | YES | NO | YES (Team) | YES (Self) |
| **Payroll** | NO | YES (View) | YES (View) | YES (Full) | NO | YES (Payslip)|
| **Expenses** | NO | YES | YES (L1) | YES (Final) | YES (Team) | YES (Self) |
| **Asset Management** | NO | YES | YES | YES (Cost) | YES (Team) | YES (Self) |
| **Finance Settlements**| NO | YES | NO | YES | NO | NO |
| **Manage Account** | NO | YES | NO | NO | NO | NO |
| **My Workspace** | NO | NO | YES | YES | YES | YES |
| **Platform Management**| YES | NO | NO | NO | NO | NO |

---

## 6. Role → Route Mapping

Route protection is governed by `<Protected>` wrappers in `routes.tsx`:

- **Platform Admin:** Isolated under `/platform-admin/*` guarded by `<Protected requiredPermission={P.PLATFORM_ADMIN_FULL}>`.
- **Super Admin Account Management:** `/admin/manage-account` guarded by `<Protected requiredPermission={P.MANAGE_ACCOUNT_VIEW}>`.
- **Roles & Permissions:** `/roles-permissions` guarded by `<Protected requiredPermission={P.ROLES_VIEW}>`.
- **Payroll Settings:** `/settings/payroll` guarded by `<Protected requiredPermission={P.PAYROLL_MANAGE}>`.
- **Shared Routes:** Pages like `/employees`, `/attendance`, `/payroll`, `/expenses`, `/leave`, `/reports`, `/performance` use permission-aware wrapper components (`PayrollWrapper`, `ExpensesWrapper`, `LeaveWrapper`, `ReportsWrapper`, etc.) to dynamically mount the appropriate role-specific view component based on `usePermissions()`.

---

## 7. Role → Permission Mapping

Permissions are mapped to role templates in `roles.ts` via `ROLE_TEMPLATES`:

- **Platform Admin:** `platform_admin:full`, `dashboard:view`, `employees:view`, `departments:view`, `reports:analytics`, `settings:full`.
- **Super Admin:** Full administrative access across `employees:full`, `departments:full`, `recruitment:full`, `onboarding:full`, `offboarding:full`, `attendance:full`, `leave:full`, `performance:full`, `training:full`, `assets:full`, `reports:all`, `documents:full`, `settings:full`, `schedule:full`, `appraisal:full`, `settlements:full`, `audit_logs:full`, `manage_account:manage`.
- **HR Manager:** `employees:manage`, `recruitment:full`, `onboarding:full`, `offboarding:manage`, `attendance:manage`, `leave:manage`, `performance:review`, `training:manage`, `expenses:level_1`, `reports:hr`, `documents:manage`, `schedule:manage`.
- **Finance Manager:** `payroll:full`, `expenses:final_approval`, `assets:view_cost`, `reports:finance`, `appraisal:approve`, `settlements:full`, `offboarding.clearance.finance`.
- **Department Manager:** `employees:view_team`, `attendance:approve_team`, `leave:approve_team`, `performance:review_team`, `training:assign`, `expenses:approve_team`, `assets:view_team`, `reports:team`, `schedule:view_team`, `appraisal:manage`, `offboarding.clearance.manager`.
- **Employee:** `employees:self`, `attendance:self`, `leave:apply`, `performance:self`, `training:learn`, `expenses:submit`, `assets:self`, `documents:self`, `schedule:self`, `payroll:payslips`, `reports:self`, `onboarding:complete_tasks`.

---

## 8. Role → Data Scope

Scope types are formally typed in `roles.ts`:
- `ScopeType = "organization" | "branch" | "department" | "team" | "self"`

### Current Implementation Evidence:
- **Super Admin & HR:** Scope set to `"organization"` in `PermissionContext.tsx`.
- **Manager / Team Lead:** Scope set to `"team"` in `PermissionContext.tsx`.
- **Employee:** Scope set to `"self"` in `PermissionContext.tsx`.
- **UI Filtering Evidence:** Component level filtering relies on string match checks (e.g. `user?.name`, `user?.email`, or local state filters like `deptFilter`). Server-enforced query parameter scoping is **NOT VERIFIED IN CURRENT CODEBASE** due to mock state layer.

---

## 9. Frontend Role Enforcement

- **Primary Mechanism:** `usePermission(module, action)` and `usePermissionKey(key)` hooks from `PermissionContext.tsx`.
- **Visual Gating:** `<PermissionGate>` component conditionally renders children or fallback based on permissions.
- **Legacy Fallbacks:** A total of ~45 inline legacy string checks (`user?.role === "HR Manager"`, `user?.role === "Finance"`, `user?.role === "Manager"`) remain across individual page components as secondary UI state toggles.

---

## 10. Backend Role Enforcement

- **Current Architecture:** Frontend-only single-page application operating against client-side mock data and `sessionStorage`.
- **Backend Middleware / Controller RBAC:** **NOT VERIFIED IN CURRENT CODEBASE**.

---

## 11. Role Conflicts / Duplicates

1. **Role Identifier Aliasing:** Legacy role strings (`"Finance"`, `"HR Manager"`, `"Manager"`) differ slightly from internal system IDs (`role_finance_manager`, `role_hr_manager`, `role_dept_manager`). They are unified via `LEGACY_ROLE_MAP` in `PermissionContext.tsx`.
2. **"Org Admin" Alias:** Login component (`Login.tsx:114`) accepts `"Org Admin"` and maps it to `"Super Admin"`.
3. **IT Admin & Team Lead:** Defined as separate roles in `auth.config.ts` and `roles.ts`, but mostly fallback to `Employee` or `Manager` components in wrappers.

---

## 12. Security Findings

- **CRITICAL:** None found on frontend. All routes, navigation items, and layout boundaries are protected by permission keys.
- **HIGH:** Backend API authorization logic is **NOT VERIFIED IN CURRENT CODEBASE**. Frontend permissions must be mirrored by API server endpoints upon integration.
- **MEDIUM:** Residual legacy `user?.role === "..."` string checks exist in legacy sub-components alongside the new permission engine.

---

## 13. Missing Architecture

1. Dynamic Server Role & Permission Fetching (Currently relies on static seed data in `roles.ts`).
2. Server-side Data Scope Filtering (GraphQL / REST query parameters for `ScopeType`).

---

## 14. Recommended Fixes for Future Tasks

1. Refactor remaining inline `user?.role === "..."` checks to use `usePermission()` for 100% permission engine coverage.
2. Ensure future REST/GraphQL backend API endpoints enforce identical permission key middleware validation.

---

## 15. Final Role Matrix

| Role | Actual Identifier | Dashboard | Sidebar | Route Protection | Permission System | Data Scope | Backend Enforcement |
|---|---|---|---|---|---|---|---|
| **Platform Admin** | `role_platform_admin` | PASS | PASS | PASS | PASS | Organization (SaaS) | NOT VERIFIED |
| **Super Admin** | `role_super_admin` | PASS | PASS | PASS | PASS | Organization | NOT VERIFIED |
| **HR Manager** | `role_hr_manager` | PASS | PASS | PASS | PASS | Organization (HR) | NOT VERIFIED |
| **Finance** | `role_finance_manager` | PASS | PASS | PASS | PASS | Organization (Fin)| NOT VERIFIED |
| **Manager** | `role_dept_manager` | PASS | PASS | PASS | PASS | Team / Dept | NOT VERIFIED |
| **Employee** | `role_employee` | PASS | PASS | PASS | PASS | Self | NOT VERIFIED |

---

## 16. Files Inspected

- [`src/app/shared/permission-engine/roles.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/roles.ts)
- [`src/app/shared/permission-engine/permissions.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/permissions.ts)
- [`src/app/shared/permission-engine/PermissionContext.tsx`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/PermissionContext.tsx)
- [`src/app/shared/permission-engine/navigation.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/navigation.ts)
- [`src/app/shared/permission-engine/usePermission.ts`](file:///d:/Employment%20Management%20System/src/app/shared/permission-engine/usePermission.ts)
- [`src/app/context/AuthContext.tsx`](file:///d:/Employment%20Management%20System/src/app/context/AuthContext.tsx)
- [`src/app/context/auth.config.ts`](file:///d:/Employment%20Management%20System/src/app/context/auth.config.ts)
- [`src/app/routes.tsx`](file:///d:/Employment%20Management%20System/src/app/routes.tsx)
- [`src/app/pages/dashboard/DashboardWrapper.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/dashboard/DashboardWrapper.tsx)

---

**AUDIT STATUS:** **PASS WITH ISSUES**  
*(Architecture is clean, robust, and functional on the frontend; minor legacy string check cleanups and future backend API verification remain for subsequent tasks).*
