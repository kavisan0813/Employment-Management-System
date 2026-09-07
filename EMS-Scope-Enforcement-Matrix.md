# EMS FRONTEND DATA SCOPE ENFORCEMENT AUDIT & SECURITY MATRIX REPORT
**Task Ref**: TASK 2.2-F4  
**System**: NexusHR Employment Management System (EMS)  
**Date**: August 18, 2026  
**Auditor**: Senior Frontend Architect, RBAC Security Engineer & Multi-Tenant SaaS Reviewer  

---

## 1. Executive Summary

TASK 2.2-F4 conducted a thorough data scope enforcement audit across all major data-sensitive modules in the NexusHR EMS.

### Key Audit Findings
1. **Canonical Scope Definitions**: The system formally defines 5 scope types in `src/app/shared/permission-engine/roles.ts`: `organization`, `branch`, `department`, `team`, `self`.
2. **Self-Service Scope Security**: Employee self-service paths (`/employee/*`, `/my-assets`, `/my-exit`, `/my-documents`, `/my-onboarding`) achieve **TRUE SCOPE ENFORCEMENT (Self Scope)** via dedicated self-service components (`EmployeeAttendance`, `EmployeeLeaves`, `EmployeePayslips`, `EmployeePerformance`, `EmployeeExpenses`, `MyAssets`, `EmployeeExit`).
3. **Role-Based Component Routing**: Shared application routes (`/attendance`, `/leave`, `/payroll`, `/expenses`, `/performance`, `/schedule`, `/reports`, `/appraisal`, `/training`, `/notifications`) enforce view-level isolation via permission wrappers that route users to appropriate role-specific screens (e.g. `ManagerAttendance`, `FinanceAttendance`, `AdminAttendance`).
4. **UI Filtering vs. Authorization**: Dropdown filters (e.g., Department filter, Location/Branch filter, Status filter) act as **UI FILTER ONLY / MOCK DATA FILTERING**. They control visual display options but do not provide backend data-layer authorization.
5. **Organization / Tenant Isolation**: Multi-tenant database row-level security and organization-isolated API queries are **NOT VERIFIED / DEFERRED TO BACKEND** (the frontend demo operates on mock arrays and `localStorage`).
6. **Branch Scope Status**: Branch scope is **DEFINED BUT NOT ENFORCED AT RUNTIME**.
7. **Build Metrics**: `npx tsc --noEmit` and `npm run build` pass with 0 errors (3,383 modules transformed in 21.08s).

---

## 2. Scope Definitions & Meaning

| Scope | Existing Meaning | Where Defined | Where Used | Status |
| :--- | :--- | :--- | :--- | :---: |
| **organization** | Access to all records within the entire tenant / company | `src/app/shared/permission-engine/roles.ts` (`ScopeType`) | Default scope for `Platform Admin`, `Super Admin`, `HR Manager`, `Finance`, `IT Admin` in `createMockAssignment()` | **DEFINED & ACTIVE IN DEMO** |
| **branch** | Access restricted to a specific physical branch location | `roles.ts` (`ScopeType`), `AddEmployee.tsx` | Defined in types and UI scope dropdowns | **DEFINED BUT NOT ENFORCED** |
| **department** | Access restricted to employees/records within assigned department | `roles.ts` (`ScopeType`), `ROLE_TEMPLATES` | `ROLE_IDS.DEPT_MANAGER` permissions (`*_VIEW_DEPT`, `*_APPROVE_DEPT`) | **ROLE-FILTERED IN WRAPPERS** |
| **team** | Access restricted to direct reports or assigned team members | `roles.ts` (`ScopeType`), `PermissionContext.tsx` | Default scope for `Team Lead` in `PermissionContext.tsx` line 77 | **ROLE-FILTERED IN WRAPPERS** |
| **self** | Access restricted to own personal employee records | `roles.ts` (`ScopeType`), `PermissionContext.tsx` | Default scope for `Employee` in `PermissionContext.tsx` line 79 | **TRUE SCOPE ENFORCEMENT** |

---

## 3. Role → Scope Mapping Audit

| Role | Defined Scope | Evidence | Enforcement Mechanism | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Platform Admin** | `organization` (Global) | `ROLE_TEMPLATES[role_platform_admin]` (`P.PLATFORM_ADMIN_FULL`) | Route Guard (`<Protected requiredPermission={P.PLATFORM_ADMIN_FULL}>`) | **ENFORCED AT ROUTE** |
| **Super Admin** | `organization` | `ROLE_TEMPLATES[role_super_admin]` (`P.EMPLOYEES_FULL`, `P.MANAGE_ACCOUNT_MANAGE`) | Action & Route Guards | **ENFORCED AT ROUTE & ACTION** |
| **HR Manager** | `organization` | `ROLE_TEMPLATES[role_hr_manager]` (`P.EMPLOYEES_MANAGE`, `P.LEAVE_MANAGE`) | Action Guards & Admin Views | **ENFORCED AT ROUTE & ACTION** |
| **Finance Manager** | `organization` | `ROLE_TEMPLATES[role_finance_manager]` (`P.PAYROLL_MANAGE`, `P.EXPENSES_FINAL_APPROVAL`) | Action Guards & Finance Views | **ENFORCED AT ROUTE & ACTION** |
| **IT Admin** | `organization` | `ROLE_TEMPLATES[role_it_admin]` (`P.ASSETS_MANAGE`, `P.OFFBOARDING_CLEARANCE_IT`) | Action Guards & Asset Views | **ENFORCED AT ROUTE & ACTION** |
| **Department Manager**| `department` / `organization` | `ROLE_TEMPLATES[role_dept_manager]` (`*_APPROVE_TEAM`, `*_REVIEW_TEAM`) | Wrapper Component Routing | **ROLE-BASED FILTERING** |
| **Team Lead** | `team` | `PermissionContext.tsx` (`defaultScope = "team"`) | Wrapper Component Routing | **ROLE-BASED FILTERING** |
| **Employee** | `self` | `PermissionContext.tsx` (`defaultScope = "self"`) | Dedicated Self-Service Components | **TRUE SCOPE ENFORCEMENT** |

---

## 4. Module-by-Module Scope Enforcement Audit

| Module | Role | Assigned Scope | Current Filtering Mechanism | Enforcement Location | Bypass Risk | Classification |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Employee Directory** | Super Admin / HR | `organization` | Full Employee List | `EmployeesPage.tsx` | Low (Action protected) | TRUE SCOPE ENFORCEMENT |
| | Employee | `self` | Scoped list / Self profile | `EmployeeSelfProfile.tsx` | None (Direct URL routes to `/profile`) | TRUE SCOPE ENFORCEMENT |
| **Attendance** | Admin / HR | `organization` | Full Attendance Log | `Attendance.tsx` | Low (Action protected) | TRUE SCOPE ENFORCEMENT |
| | Manager | `department`/`team`| Team Attendance Log | `ManagerAttendance.tsx` | Low (Wrapper component) | ROLE-BASED FILTERING |
| | Employee | `self` | Personal Attendance Log | `EmployeeAttendance.tsx` | None (Wrapper routes to self UI) | TRUE SCOPE ENFORCEMENT |
| **Leave Management** | Admin / HR | `organization` | All Leave Requests | `LeaveManagement.tsx` | Low (Action protected) | TRUE SCOPE ENFORCEMENT |
| | Manager | `department`/`team`| Team Approval Queue | `ManagerLeaveApprovals.tsx` | Low (Wrapper component) | ROLE-BASED FILTERING |
| | Employee | `self` | Personal Leave Applications | `EmployeeLeaves.tsx` | None (Wrapper routes to self UI) | TRUE SCOPE ENFORCEMENT |
| **Payroll** | Finance / Admin | `organization` | Full Payroll Register | `Payroll.tsx` / `FinancePayroll.tsx` | Low (Route protected) | TRUE SCOPE ENFORCEMENT |
| | Employee | `self` | Personal Payslips | `EmployeePayslips.tsx` | None (Non-payroll routed to payslips) | TRUE SCOPE ENFORCEMENT |
| **Expenses** | Finance | `organization` | Final Approval Queue | `FinanceExpenses.tsx` | Low (Action protected) | TRUE SCOPE ENFORCEMENT |
| | Manager | `department`/`team`| Team Approval Queue | `ManagerExpenseApprovals.tsx` | Low (Wrapper component) | ROLE-BASED FILTERING |
| | Employee | `self` | Personal Claims | `Expenses.tsx` / `EmployeeExpenses` | None (Self-service submit view) | TRUE SCOPE ENFORCEMENT |
| **Performance** | HR / Admin | `organization` | All Reviews | `Performance.tsx` | Low (Action protected) | TRUE SCOPE ENFORCEMENT |
| | Manager | `department`/`team`| Team Reviews | `ManagerTeamPerformance.tsx` | Low (Wrapper component) | ROLE-BASED FILTERING |
| | Employee | `self` | Personal Review | `EmployeePerformance.tsx` | None (Non-reviewer routed to self) | TRUE SCOPE ENFORCEMENT |
| **Asset Management** | IT / Admin | `organization` | All Company Assets | `AssetManagement.tsx` | Low (Route protected `P.ASSETS_VIEW`) | TRUE SCOPE ENFORCEMENT |
| | Employee | `self` | Assigned Assets | `MyAssets.tsx` | None (Direct URL routed to `/my-assets`) | TRUE SCOPE ENFORCEMENT |
| **Offboarding** | HR / Admin | `organization` | All Exit Workflows | `OffboardingPage.tsx` | Low (Route protected `P.OFFBOARDING_VIEW`) | TRUE SCOPE ENFORCEMENT |
| | Employee | `self` | Personal Exit Status | `EmployeeExit.tsx` | None (Direct URL routed to `/my-exit`) | TRUE SCOPE ENFORCEMENT |
| **Reports** | HR / Finance | `organization` | Org / HR / Finance Reports | `Reports.tsx` / `FinanceReports` | Low (Wrapper component) | ROLE-BASED FILTERING |
| | Manager | `team` | Team Summary Reports | `ManagerReports.tsx` | Low (Wrapper component) | ROLE-BASED FILTERING |
| | Employee | `self` | 403 / Access Restricted | `ReportsWrapper.tsx` | None (Blocked at wrapper) | TRUE SCOPE ENFORCEMENT |

---

## 5. UI Filtering vs. True Security Authorization

| Component Feature | UI Element | Classification | Description | Security Value |
| :--- | :--- | :--- | :--- | :---: |
| **Department Selector** | `<select>` dropdown | **UI FILTER ONLY** | Filters mock array in React local state | Visual UI Convenience |
| **Location / Branch Filter** | `<select>` dropdown | **UI FILTER ONLY** | Filters mock array in React local state | Visual UI Convenience |
| **Status Filter** | Tabs / Buttons | **UI FILTER ONLY** | Filters pending/approved status items | Visual UI Convenience |
| **Route Wrapper Routing** | `<PayrollWrapper />` | **ROLE-BASED FILTERING** | Switches component tree based on permission keys | Architectural View Gate |
| **Action Gate Handler** | `hasPermissionKey(P.*)` | **TRUE SCOPE ENFORCEMENT** | Aborts event handler execution on missing key | Frontend Action Security |
| **Self Component Isolation** | `<EmployeePayslips />` | **TRUE SCOPE ENFORCEMENT** | Displays only logged-in user's data record | Self-Service Scope Isolation |
| **Backend RLS / API Middleware** | Server DB Policies | **DEFERRED TO BACKEND** | Database row-level security & JWT scope validation | True Production Multi-Tenant RLS |

---

## 6. Export and Download Scope Audit

| Report / Export Feature | Component Source | Accessing Permission | Export Dataset Scope | Bypass Status |
| :--- | :--- | :--- | :--- | :---: |
| **Employee Directory Export** | `EmployeesPage.tsx` (`onExport`) | `P.EMPLOYEES_MANAGE` / `P.EMPLOYEES_FULL` | Currently displayed directory array | **PROTECTED AT HANDLER** |
| **Offboarding CSV Export** | `OffboardingPage.tsx` (`handleExportCSV`) | `P.OFFBOARDING_VIEW` / `P.OFFBOARDING_MANAGE` | Active exit records array | **PROTECTED AT ROUTE** |
| **Finance Reports Export** | `FinanceReports.tsx` | `P.REPORTS_FINANCE` | Filtered financial summary dataset | **PROTECTED AT WRAPPER** |
| **Manager Team Report Export** | `ManagerReports.tsx` | `P.REPORTS_TEAM` | Direct team metrics dataset | **PROTECTED AT WRAPPER** |
| **Employee Self Payslip PDF** | `EmployeePayslips.tsx` | `P.PAYROLL_PAYSLIPS` | Logged-in user's payslip document | **PROTECTED AT COMPONENT** |

---

## 7. Deferred Items & Architectural Gaps

The following scope enforcement mechanisms belong to server-side backend infrastructure and are formally documented as deferred:

1. **Database Row-Level Security (RLS)**: `DEFERRED — BACKEND AUTHORIZATION NOT PRESENT/VERIFIED IN CURRENT FRONTEND DEMO`.
2. **API Authorization Middleware**: `DEFERRED — BACKEND AUTHORIZATION NOT PRESENT/VERIFIED IN CURRENT FRONTEND DEMO`.
3. **Multi-Tenant Organization Database Isolation**: `ORGANIZATION/TENANT DATA ISOLATION NOT VERIFIED IN FRONTEND DEMO`.
4. **Runtime Branch Scope Query Filtering**: `DEFINED BUT NOT ENFORCED AT RUNTIME`.

---

## 8. Build & Verification Metrics

- **TypeScript Type Checker (`npx tsc --noEmit`)**:
  - Result: **PASS** (0 errors)
- **Production Bundle Build (`npm run build`)**:
  - Result: **PASS** (3,383 modules built in 21.08s)
- **Files Modified**: `src/app/routes.tsx` (Route-level protection added in TASK 2.2-F3).
- **Files Untouched**: `src/app/shared/permission-engine/roles.ts`, `permissions.ts`, `PermissionContext.tsx`, `navigation.ts` (Existing canonical architecture preserved).
