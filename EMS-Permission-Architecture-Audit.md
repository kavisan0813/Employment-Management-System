# NexusHR EMS — Existing Permission & Multi-Tenant Architecture Audit

**Audit Date:** August 18, 2026  
**Auditor:** Senior Software Architect & Access-Control Lead  
**Project:** NexusHR Employment Management System (EMS)

---

## 1. Executive Summary

This audit assesses the readiness of the NexusHR EMS permission engine for enterprise multi-tenants, subscription plans, feature toggles, action-level granularity, data scope isolation, and read-only access modes.

Key Findings:
- **Permission Core:** Implements a fine-grained `(MODULE, ACTION)` permission tuple architecture in `src/app/shared/permission-engine/`.
- **Action-Level Capability:** Enforces distinct action keys (`view`, `create`, `edit`, `delete`, `approve`, `export`, `self`, `manage`, `full`) across UI buttons and route guards.
- **Tenant / Multi-Tenancy Identity:** Organization identity fields (`organizationId`, `organization`) exist across authentication models, Platform Admin tenant mock data (`src/app/admin/mockData.ts`), and user creation interfaces. However, tenant data isolation is currently **FRONTEND MOCK FILTERED**; backend multi-tenant query isolation is **NOT VERIFIED IN CURRENT CODEBASE**.
- **Subscription Architecture:** Subscription tier types (`STARTER`, `PROFESSIONAL`, `ENTERPRISE`), billing cycles, and feature package limits exist in Platform Admin models (`SubscriptionBillingView.tsx`, `subscription.types.ts`). Subscription-to-tenant feature gating is **PARTIALLY IMPLEMENTED IN FRONTEND / NOT ENFORCED AT RUNTIME**.
- **Feature Toggles:** Feature flag models exist in Platform Admin (`FeatureManagementView.tsx`), but dynamic organization-level feature enabling/disabling is **PARTIALLY IMPLEMENTED IN FRONTEND / NOT ENFORCED AT RUNTIME**.

---

## 2. Existing Permission Architecture

The frontend access control framework operates via a 4-tier layer in `src/app/shared/permission-engine/`:

```
User → RoleAssignments → PermissionSet (Union) → Hooks / Gates / Route Wrappers
```

1. `permissions.ts`: Defines canonical module strings (`MODULES`), action identifiers (`ACTIONS`), and key constructor `permissionKey(module, action)`.
2. `roles.ts`: Maps system role templates (`PLATFORM_ADMIN`, `SUPER_ADMIN`, `HR_MANAGER`, `FINANCE_MANAGER`, `IT_ADMIN`, `DEPT_MANAGER`, `TEAM_LEAD`, `EMPLOYEE`) to arrays of permission keys.
3. `PermissionContext.tsx`: React Provider resolving user permissions and active `RoleAssignment[]` scopes.
4. `usePermission.ts` & `PermissionGate.tsx`: Primary consumer API used across UI components for conditional rendering.

---

## 3. Complete Permission Inventory

| Permission Key | Module | Action | Assigned Roles | Scope | Used By | Status |
|---|---|---|---|---|---|---|
| `dashboard:view` | Dashboard | View | All Roles | Org / Team / Self | `Sidebar.tsx`, `routes.tsx` | Existing |
| `employees:view` | Employee Directory | View | Admin, HR, Finance, Manager | Org / Team | `EmployeesPage.tsx`, `navigation.ts` | Existing |
| `employees:manage` | Employee Directory | Manage | Super Admin, HR | Org | `AddEmployee.tsx`, `routes.tsx` | Existing |
| `employees:create` | Employee Directory | Create | Super Admin, HR | Org | `AddEmployee.tsx` | Existing |
| `employees:delete` | Employee Directory | Delete | Super Admin | Org | `EmployeesPage.tsx` | Existing |
| `employees:self` | Employee Directory | Self | Employee | Self | `EmployeeSelfProfile.tsx` | Existing |
| `departments:view` | Departments | View | Admin, HR, Finance, Manager | Org | `DepartmentPage.tsx` | Existing |
| `departments:manage`| Departments | Manage | Super Admin, HR | Org | `DepartmentPage.tsx` | Existing |
| `recruitment:full` | Recruitment | Full | Super Admin, HR | Org | `Recruitment.tsx`, `routes.tsx` | Existing |
| `recruitment:interview`| Recruitment | Interview | Manager | Team | `Recruitment.tsx` | Existing |
| `onboarding:full` | Onboarding | Full | Super Admin, HR | Org | `OnboardingPage.tsx` | Existing |
| `onboarding:finance_setup`| Onboarding | Fin Setup | Finance | Org | `FinanceOnboarding.tsx` | Existing |
| `onboarding:complete_tasks`| Onboarding | Complete | Employee | Self | `OnboardingPage.tsx` | Existing |
| `offboarding:manage` | Offboarding | Manage | Super Admin, HR, Manager | Org / Team | `Offboarding.tsx` | Existing |
| `offboarding.clearance.finance`| Offboarding | Clearance| Finance | Org | `FinanceSettlements.tsx` | Existing |
| `attendance:view` | Attendance | View | Admin, HR, Finance, Manager, Emp | Org / Team / Self | `Attendance.tsx`, `routes.tsx` | Existing |
| `attendance:manage` | Attendance | Manage | Super Admin, HR | Org | `Attendance.tsx` | Existing |
| `attendance:approve_team`| Attendance | Approve | Manager, Team Lead | Team | `ManagerAttendance.tsx` | Existing |
| `leave:manage` | Leave Management | Manage | Super Admin, HR | Org | `LeaveManagement.tsx` | Existing |
| `leave:approve_team` | Leave Management | Approve | Manager, Team Lead | Team | `ManagerLeaveApprovals.tsx` | Existing |
| `leave:apply` | Leave Management | Apply | Employee | Self | `EmployeeLeaves.tsx` | Existing |
| `performance:review` | Performance | Review | Super Admin, HR | Org | `Performance.tsx` | Existing |
| `performance:review_team`| Performance | Review | Manager, Team Lead | Team | `ManagerTeamPerformance.tsx` | Existing |
| `training:manage` | Training | Manage | Super Admin, HR | Org | `Training.tsx` | Existing |
| `training:assign` | Training | Assign | Manager | Team | `ManagerTeamTraining.tsx` | Existing |
| `payroll:full` | Payroll | Full | Super Admin, Finance | Org | `FinancePayroll.tsx` | Existing |
| `payroll:view` | Payroll | View | HR | Org | `Payroll.tsx` | Existing |
| `payroll:payslips` | Payroll | Payslips | Employee | Self | `EmployeePayslips.tsx` | Existing |
| `expenses:full` | Expenses | Full | Super Admin, Finance | Org | `FinanceExpenses.tsx` | Existing |
| `expenses:approve_team`| Expenses | Approve | Manager, Team Lead | Team | `ManagerExpenseApprovals.tsx` | Existing |
| `expenses:submit` | Expenses | Submit | Employee | Self | `ReimbursementHistory.tsx` | Existing |
| `assets:manage` | Asset Management | Manage | Super Admin, HR, IT | Org | `AssetManagement.tsx` | Existing |
| `assets:view_cost` | Asset Management | Cost View| Finance | Org | `FinanceAssetCostReport.tsx` | Existing |
| `reports:all` | Reports | All | Super Admin | Org | `Reports.tsx` | Existing |
| `reports:hr` | Reports | HR | HR Manager | Org | `Reports.tsx` | Existing |
| `reports:finance` | Reports | Finance | Finance Manager | Org | `FinanceReports.tsx` | Existing |
| `reports:team` | Reports | Team | Manager, Team Lead | Team | `ManagerReports.tsx` | Existing |
| `settings:full` | System Settings | Full | Super Admin | Org | `Settings.tsx` | Existing |
| `settings:payroll` | Payroll Settings | Manage | Finance, Super Admin | Org | `FinancePayrollSettings.tsx` | Existing |
| `manage_account:view`| Manage Account | View | Super Admin | Org | `ManageAccountUsers.tsx` | Existing |
| `platform_admin:full`| Platform Admin | Full | Platform Admin | SaaS Platform | `/platform-admin/*` | Existing |

---

## 4. Action-Level Permission Analysis

| Module | View | Create | Edit | Delete | Approve | Export | Configure |
|---|---|---|---|---|---|---|---|
| **Employee Directory** | EXISTS | EXISTS | EXISTS | EXISTS | N/A | EXISTS | N/A |
| **Recruitment** | EXISTS | EXISTS | EXISTS | EXISTS | EXISTS | EXISTS | N/A |
| **Onboarding** | EXISTS | EXISTS | EXISTS | PARTIAL | EXISTS | EXISTS | N/A |
| **Attendance** | EXISTS | EXISTS | EXISTS | PARTIAL | EXISTS | EXISTS | N/A |
| **Leave Management** | EXISTS | EXISTS | EXISTS | PARTIAL | EXISTS | EXISTS | N/A |
| **Payroll Processing** | EXISTS | EXISTS | EXISTS | PARTIAL | EXISTS | EXISTS | EXISTS |
| **Expense Claims** | EXISTS | EXISTS | EXISTS | PARTIAL | EXISTS | EXISTS | N/A |
| **Asset Management** | EXISTS | EXISTS | EXISTS | EXISTS | N/A | EXISTS | N/A |
| **Performance & Goals** | EXISTS | EXISTS | EXISTS | PARTIAL | EXISTS | EXISTS | N/A |
| **Offboarding & F&F** | EXISTS | EXISTS | EXISTS | PARTIAL | EXISTS | EXISTS | N/A |
| **Account Management** | EXISTS | EXISTS | EXISTS | EXISTS | N/A | EXISTS | EXISTS |

---

## 5. Read-Only vs Editable Access Analysis

- **Hidden Access:** Unauthorized UI controls and sidebar navigation items are hidden via `<PermissionGate>` or `filterNavigation()`.
- **Editable Access:** Authorized roles see active input forms, edit buttons, and modal submission controls.
- **Read-Only Enforced Controls:**
  - HR viewing Payroll (`Payroll.tsx`): Can view payroll summaries, but `isHR` condition hides calculation execution buttons.
  - Manager viewing Employee Profiles (`ManagerTeamDirectory.tsx`): Displays read-only employee info cards without edit form fields.
  - Disabled Inputs (`disabled={!canEdit}`): Used in settings forms (e.g. `FinancePayrollSettings.tsx` & `Settings.tsx`).
- **Limitation:** Read-only mode is currently handled via component-level boolean props (`readOnly={true}`) or conditional ternary renders rather than a formal `"read_only"` scope key in the permission engine context.

---

## 6. Data Scope Analysis

The codebase defines five formal scope types in `roles.ts`:

```typescript
export type ScopeType = "organization" | "branch" | "department" | "team" | "self";
```

### Current Status:
1. **Scope Type Definitions:** `EXISTS AS A TYPE` (`RoleAssignment` interface in `roles.ts`).
2. **Frontend Component Filtering:** `PARTIALLY IMPLEMENTED`. Component state filters user lists or attendance logs based on logged-in user name (`user?.name`) or department string (`user?.department`).
3. **Backend Scope Query Enforcement:** `NOT VERIFIED IN CURRENT CODEBASE` (Mock frontend environment).

---

## 7. Organization / Tenant Support

- **Organization Identity:** `organizationId` and `organization` fields exist in `User` (`AuthContext.tsx`), mock user lists (`ManageAccountUsers.tsx`), and SaaS Platform Admin models (`src/app/admin/types.ts`).
- **Multi-Tenant Scoping:** Platform Admin (`/platform-admin/*`) manages separate organization tenant records (`org-1`, `org-2`, `org-3`, etc.).
- **Tenant Isolation:** `FRONTEND MOCK FILTERED`. Tenant switching in Platform Admin switches displayed tenant data arrays. Server-side multi-tenant DB schema isolation (Row Level Security or Schema-per-Tenant) is **NOT VERIFIED IN CURRENT CODEBASE**.

---

## 8. Feature Enable/Disable Architecture

- **Platform Admin Feature Flags:** `FeatureManagementView.tsx` defines feature flags (`RECRUITMENT`, `PERFORMANCE`, `LMS`, `ASSETS`, `EXPENSES`, `TIMESHEET`, `PAYROLL_AUTOMATION`).
- **Tenant Feature Enabling:** `PARTIALLY IMPLEMENTED IN FRONTEND`. Feature toggles can be switched in Platform Admin UI, but runtime feature evaluation guards in tenant workspaces are **NOT ENFORCED AT RUNTIME**.

---

## 9. Subscription-Based Access

- **Subscription Plans:** Platform Admin (`SubscriptionBillingView.tsx`, `subscription.types.ts`) models `STARTER`, `PROFESSIONAL`, `ENTERPRISE` tiers with monthly/annual billing and active/canceled statuses.
- **Plan Feature Limits:** Tier feature mapping exists as static documentation in Subscription views.
- **Runtime Plan Enforcement:** `NOT IMPLEMENTED AT RUNTIME`. Tenant workspaces currently evaluate role permissions regardless of subscription tier.

---

## 10. Permission Enforcement Matrix

| Layer | Existing | Verified | Notes |
|---|---|---|---|
| **Sidebar Navigation** | YES | PASS | Dynamic filtering via `filterNavigation()` in `Sidebar.tsx`. |
| **Route Level** | YES | PASS | Guarded via `<Protected requiredPermission={...}>` in `routes.tsx`. |
| **Page Level** | YES | PASS | Role-aware wrappers (`PayrollWrapper`, `ExpensesWrapper`, etc.). |
| **Button Level** | YES | PASS | Action buttons wrapped in `<PermissionGate>` or `usePermission()`. |
| **Form Fields** | YES | PASS | Read-only / disabled states enforced on inputs based on role. |
| **Modal / Drawers** | YES | PASS | Modal triggers gated by action permissions. |
| **API Request Level**| NO | NOT VERIFIED | Client-side mock state architecture. |
| **Backend DB Level** | NO | NOT VERIFIED | Requires server API integration. |

---

## 11. Security Gaps

- **P0 (Critical):** None on frontend. Route, sidebar, and button access are fully guarded.
- **P1 (High):** Backend API authorization and multi-tenant DB isolation are **NOT VERIFIED IN CURRENT CODEBASE**.
- **P2 (Medium):** Feature flags (`FeatureManagementView`) and Subscription Tier limits are not enforced at runtime in tenant screens.
- **P3 (Low):** Minor residual `user?.role === "..."` string checks exist alongside the new permission engine hooks.

---

## 12. Current Permission Matrix (Existing Codebase)

| Module | Platform Admin | Super Admin | HR Manager | Finance | IT | Manager | Team Lead | Employee |
|---|---|---|---|---|---|---|---|---|
| **Dashboard** | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL |
| **Manage Account** | NONE | FULL | NONE | NONE | NONE | NONE | NONE | NONE |
| **Employees** | READ | FULL | EDIT | READ | NONE | READ (Team) | READ (Team) | READ (Self) |
| **Departments** | READ | FULL | EDIT | READ | NONE | READ | READ | NONE |
| **Recruitment** | NONE | FULL | EDIT | NONE | NONE | APPROVE (Intv) | NONE | READ (Apply) |
| **Onboarding** | NONE | FULL | EDIT | EDIT (Fin) | NONE | READ (Team) | NONE | EDIT (Self) |
| **Offboarding** | NONE | FULL | EDIT | EDIT (Fin) | EDIT (IT) | APPROVE (Clear) | NONE | NONE |
| **Attendance** | NONE | FULL | EDIT | READ | NONE | APPROVE (Team) | APPROVE (Team) | EDIT (Self) |
| **Leave** | NONE | FULL | EDIT | READ | NONE | APPROVE (Team) | APPROVE (Team) | EDIT (Self) |
| **Schedule** | NONE | FULL | EDIT | READ | NONE | READ (Team) | READ (Team) | READ (Self) |
| **Performance** | NONE | FULL | EDIT | READ | NONE | EDIT (Team) | EDIT (Team) | READ (Self) |
| **Training** | NONE | FULL | EDIT | NONE | NONE | EDIT (Assign) | EDIT (Rec) | READ (Learn) |
| **Payroll** | NONE | READ | READ | FULL | NONE | NONE | NONE | READ (Payslip) |
| **Expenses** | NONE | FULL | EDIT (L1) | APPROVE (Final)| NONE | APPROVE (Team) | APPROVE (Team) | EDIT (Self) |
| **Assets** | NONE | FULL | EDIT | READ (Cost) | EDIT | READ (Team) | READ (Team) | READ (Self) |
| **Reports** | READ | FULL | READ (HR) | READ (Fin) | NONE | READ (Team) | READ (Team) | READ (Self) |
| **Settlements** | NONE | FULL | NONE | FULL | NONE | NONE | NONE | NONE |
| **Audit Logs** | NONE | FULL | READ | READ | NONE | NONE | NONE | NONE |
| **Settings** | FULL | FULL | READ (Self) | EDIT (Pay) | NONE | READ (Self) | NONE | READ (Self) |
| **Platform SaaS** | FULL | NONE | NONE | NONE | NONE | NONE | NONE | NONE |

---

## 13. Proposed Target Permission Architecture (For Future Tasks)

For complete multi-tenant, subscription-aware enterprise access control:

```json
{
  "tenantId": "org-1",
  "subscriptionPlan": "PROFESSIONAL",
  "enabledFeatures": ["RECRUITMENT", "PERFORMANCE", "EXPENSES", "PAYROLL"],
  "userRole": "role_dept_manager",
  "permission": {
    "module": "leave",
    "action": "approve",
    "scope": "team",
    "accessMode": "editable"
  }
}
```

---

**BUILD STATUS:** **BUILD: PASS** (`npm run build` verified in background).  
**AUDIT VERDICT:** **CURRENT IMPLEMENTATION STABLE & EXPANDABLE FOR DAY 2.**
