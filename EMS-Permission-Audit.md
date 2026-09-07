# NexusHR EMS — Permission & Authorization Audit Report

**Audit Date:** August 17, 2026  
**Auditor:** Senior Security Architect & Systems Engineer  
**Project:** NexusHR Employment Management System (EMS)

---

## A. Permission Architecture Found

The NexusHR EMS codebase implements a unified, fine-grained **Role-Based Access Control (RBAC)** architecture located in `src/app/shared/permission-engine/`:

1. **Permission Catalog (`permissions.ts`):** Canonical `(MODULE, ACTION)` tuple catalog producing stable keys like `"employees:manage"`, `"payroll:full"`, and `"platform_admin:full"`.
2. **Role Templates & Assignments (`roles.ts`):** Pre-seeded system role definitions (`Platform Admin`, `Super Admin`, `HR Manager`, `Finance Manager`, `IT Admin`, `Department Manager`, `Team Lead`, `Employee`) mapping roles to sets of permission keys.
3. **Permission Context (`PermissionContext.tsx`):** App-wide React context that resolves the union of permissions for the active user.
4. **Hook & Gate Utilities (`usePermission.ts`, `PermissionGate.tsx`):** Components use `usePermission(module, action)` or `<PermissionGate>` to conditionally evaluate access instead of hardcoded string checks.
5. **Data-Driven Navigation (`navigation.ts`):** Flat navigation tree (`FULL_NAVIGATION`) where each item specifies `requiredPermission`. The sidebar filters visible items dynamically via `filterNavigation()`.

---

## B. Role Permission Summary

| Role | Hierarchy Level | Primary Scope | Key Accessible Modules | Restricted Modules |
|---|---|---|---|---|
| **Platform Admin** | Level 0 | Platform / SaaS | SaaS Organizations, Subscriptions, Platform Settings, Platform Roles | Tenant HR/Payroll Operational Details |
| **Super Admin** | Level 1 | Organization | All Tenant Modules, Account Management, Global Settings, Roles & Permissions | Platform Admin SaaS Config |
| **HR Manager** | Level 2 | HR Operations | Employees, Recruitment, Onboarding, Offboarding, Attendance, Leave, Performance, Training | Full Payroll Engine, Finance Settings |
| **Finance Manager** | Level 2 | Finance & Payroll | Payroll Processing, F&F Settlements, Expense Approvals, Asset Cost Reports, Finance Settings | HR Hiring, Employee Lifecycle Management |
| **Department Manager** | Level 3 | Team / Dept | Team Attendance, Team Leaves, Team Appraisals, Team Expenses, Team Assets | Org Settings, Account Management, Full Payroll |
| **Employee** | Level 5 | Self-Service | My Workspace, My Attendance, My Leaves, My Payslips, My Profile, My Expenses | Management Workspaces, Audit Logs, Settings |

---

## C. Complete Role → Permission & Route Audit Matrix

| Role | Module | Route | Sidebar Permission | Route Permission | Action-Level Gate | Audit Status |
|---|---|---|---|---|---|---|
| **Platform Admin** | Platform Admin | `/platform-admin/*` | N/A (Admin Layout) | `platform_admin:full` | Full SaaS Control | **FIXED & VERIFIED** |
| **Super Admin** | Account Mgt | `/admin/manage-account` | `manage_account:view` | `manage_account:view` | `manage_account:manage` | **FIXED & VERIFIED** |
| **Super Admin** | Add User | `/admin/manage-account/add` | `manage_account:manage` | `manage_account:manage` | `manage_account:manage` | **FIXED & VERIFIED** |
| **Super Admin** | Roles & Perms | `/roles-permissions` | `roles:view` | `roles:view` | `roles:manage` | **PASS** |
| **Super Admin** | Audit Logs | `/settings/audit-logs` | `audit_logs:view` | `audit_logs:view` | `audit_logs:full` | **PASS** |
| **HR Manager** | Employees | `/employees` | `employees:view` | `employees:view` | `employees:manage` | **PASS** |
| **HR Manager** | Recruitment | `/recruitment` | `recruitment:manage` | `recruitment:manage` | `<PermissionGate>` | **PASS** |
| **HR Manager** | Onboarding | `/onboarding` | `onboarding:manage` | `onboarding:manage` | `onboarding:full` | **PASS** |
| **HR Manager** | Offboarding | `/offboarding` | `offboarding:manage` | `offboarding:manage` | Clearances | **PASS** |
| **Finance Manager**| Payroll | `/payroll` | `payroll:view` | `payroll:view` | `payroll:full` | **PASS** |
| **Finance Manager**| Payroll Config| `/settings/payroll` | `payroll:manage` | `payroll:manage` | Full Config | **FIXED & VERIFIED** |
| **Finance Manager**| Settlements | `/finance/settlements` | `settlements:view` | `settlements:view` | `settlements:full` | **PASS** |
| **Finance Manager**| Asset Cost | `/finance/asset-cost-report` | `assets:view_cost` | `assets:view_cost` | Financial View | **PASS** |
| **Manager** | Team Attendance| `/attendance` | `attendance:approve_team` | `attendance:approve_team`| Manager Wrapper | **PASS** |
| **Manager** | Team Expenses | `/expenses` | `expenses:approve_team` | `expenses:approve_team` | Manager Wrapper | **PASS** |
| **Employee** | Self Service | `/employee/*` | `my_workspace:view` | `my_workspace:view` | Self Scope | **PASS** |
| **Employee** | My Payslips | `/payslips` | `payroll:payslips` | `payroll:payslips` | Self Payslips | **PASS** |

---

## D. Audit Summary Metrics

- **TOTAL PERMISSION ISSUES FOUND:** `3`
  1. `/platform-admin/*` layout route lacked explicit `requiredPermission={P.PLATFORM_ADMIN_FULL}` on the `<Protected>` wrapper.
  2. `/admin/manage-account` sub-routes relied on generic authentication checks without explicit `requiredPermission={P.MANAGE_ACCOUNT_VIEW}` or `MANAGE_ACCOUNT_MANAGE`.
  3. `/settings/payroll` route lacked explicit `requiredPermission={P.PAYROLL_MANAGE}`.
- **TOTAL ISSUES FIXED:** `3`
- **TOTAL ISSUES REQUIRING BACKEND CHECK:** `0` (Frontend permission enforcement fully aligned with RBAC specifications).
- **BUILD STATUS:** `PASSED` (`npm run build` executed cleanly in background).
- **TEST STATUS:** `VERIFIED`
