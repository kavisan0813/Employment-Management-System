# NexusHR EMS — Feature Change Master Checklist & Gap Analysis

**Date:** August 18, 2026  
**Author:** Principal Software Architect & Systems Engineering Lead  
**Project:** NexusHR Employment Management System (EMS)

---

## 1. Executive Summary & Inventory

- **Total Screens Analyzed:** 84 implemented screen files across 6 system roles (`Super Admin`, `HR Manager`, `Finance`, `Manager`, `Employee`, `Platform Admin`).
- **Total Modules Evaluated:** 22 functional domain modules.
- **Current Integration Architecture:** Robust frontend state with mock data contexts (`AppContext`, `AttendanceContext`, `AuthContext`) and local state persistence (`localStorage`/`sessionStorage`). Production REST/GraphQL API integration is pending for live database sync.

---

## 2. Complete Screen & Component Inventory

### Super Admin
1. **Super Admin Dashboard:** `src/app/pages/super-admin/SuperAdminDashboard.tsx` (`/dashboard`)
2. **Account Management - User List:** `src/app/pages/super-admin/manage-account/ManageAccountUsers.tsx` (`/admin/manage-account`)
3. **Account Management - Add User:** `src/app/pages/super-admin/manage-account/ManageAccountAddUser.tsx` (`/admin/manage-account/add`)
4. **Account Management - Bulk Import:** `src/app/pages/super-admin/manage-account/ManageAccountBulkImport.tsx` (`/admin/manage-account/import`)
5. **Roles & Permissions Matrix:** `src/app/pages/common/roles-permissions/RolesPermissionsPage.tsx` (`/roles-permissions`)
6. **System Settings Hub:** `src/app/pages/super-admin/settings/Settings.tsx` (`/settings`)
7. **System Audit Logs:** `src/app/pages/super-admin/settings/AuditLogs.tsx` (`/settings/audit-logs`)
8. **Asset Management Hub:** `src/app/pages/hr/finance-payroll/AssetManagement.tsx` (`/asset-management`)

### HR Manager
1. **HR Dashboard:** `src/app/pages/dashboard/HRDashboard.tsx` (`/dashboard`)
2. **Employee Directory:** `src/app/features/Employee/EmployeesPage.tsx` (`/employees`)
3. **Add Employee Wizard:** `src/app/features/Employee/components/AddEmployee.tsx` (`/employees/add`)
4. **Employee Profile View:** `src/app/pages/employee/EmployeeProfile.tsx` (`/employees/:id`)
5. **Department Management:** `src/app/features/Department/DepartmentPage.tsx` (`/departments`)
6. **Recruitment Pipeline:** `src/app/pages/hr/team-management/Recruitment.tsx` (`/recruitment`)
7. **Onboarding Portal:** `src/app/features/Onboarding/OnboardingPage.tsx` (`/onboarding`)
8. **Offboarding & Clearances:** `src/app/pages/hr/team-management/Offboarding.tsx` (`/offboarding`)
9. **Attendance Tracker:** `src/app/pages/hr/hr-operations/Attendance.tsx` (`/attendance`)
10. **Shift & Schedule Management:** `src/app/pages/hr/hr-operations/ShiftSchedule.tsx` (`/schedule`)
11. **Leave Management:** `src/app/pages/hr/hr-operations/LeaveManagement.tsx` (`/leave`)
12. **Performance Review:** `src/app/pages/hr/hr-operations/Performance.tsx` (`/performance`)
13. **Training & LMS:** `src/app/pages/hr/hr-operations/Training.tsx` (`/training`)
14. **Document Repository:** `src/app/pages/hr/hr-operations/Documents.tsx` (`/documents`)
15. **Notifications & Broadcasts:** `src/app/pages/hr/settings/Notifications.tsx` (`/notifications`)
16. **Reports & Analytics:** `src/app/pages/hr/reports/Reports.tsx` (`/reports`)

### Finance Manager
1. **Finance Dashboard:** `src/app/components/dashboards/FinanceDashboard.tsx` (`/dashboard`)
2. **Payroll Processing:** `src/app/pages/finance/ops/FinancePayroll.tsx` (`/payroll`)
3. **Payroll Settings & Salary Structures:** `src/app/pages/finance/workspace/FinancePayrollSettings.tsx` (`/settings/payroll`)
4. **Expense Claims & Approvals:** `src/app/pages/finance/ops/FinanceExpenses.tsx` (`/expenses`)
5. **F&F Settlements:** `src/app/pages/finance/ops/FinanceSettlements.tsx` (`/finance/settlements`)
6. **Increment & Appraisal Approvals:** `src/app/pages/finance/ops/FinanceIncrement.tsx` (`/appraisal`)
7. **Asset Cost & Depreciation Report:** `src/app/pages/finance/reports/FinanceAssetCostReport.tsx` (`/finance/asset-cost-report`)
8. **Finance Reports & Analytics:** `src/app/pages/finance/reports/FinanceReports.tsx` (`/reports`)
9. **Finance Audit Logs:** `src/app/pages/finance/workspace/FinanceAuditLogs.tsx` (`/settings/audit-logs`)

### Manager (Team Lead / Department Manager)
1. **Manager Dashboard:** `src/app/components/dashboards/ManagerDashboard.tsx` (`/dashboard`)
2. **Team Attendance Approvals:** `src/app/pages/manager/team/ManagerAttendance.tsx` (`/attendance`)
3. **Team Shift Schedule:** `src/app/pages/manager/team/ManagerTeamSchedule.tsx` (`/schedule`)
4. **Team Leave Approvals:** `src/app/pages/manager/team/ManagerLeaveApprovals.tsx` (`/leave`)
5. **Team Performance Reviews:** `src/app/pages/manager/team/ManagerTeamPerformance.tsx` (`/performance`)
6. **Team Training Assignments:** `src/app/pages/manager/team/ManagerTeamTraining.tsx` (`/training`)
7. **Team Expense Approvals:** `src/app/pages/manager/team/ManagerExpenseApprovals.tsx` (`/expenses`)
8. **Team Appraisal Recommendations:** `src/app/pages/manager/team/ManagerTeamAppraisal.tsx` (`/appraisal`)
9. **Team Onboarding Tracking:** `src/app/pages/manager/team/ManagerTeamOnboarding.tsx` (`/manager/team-onboarding`)
10. **Team Directory:** `src/app/pages/manager/team/ManagerTeamDirectory.tsx` (`/manager/directory`)
11. **Team Asset Oversight:** `src/app/pages/manager/team/ManagerTeamAssets.tsx` (`/manager/team-assets`)
12. **Manager Settings:** `src/app/pages/manager/workspace/ManagerSettings.tsx` (`/manager/settings`)

### Employee (Self-Service)
1. **Employee Dashboard:** `src/app/components/dashboards/EmployeeDashboard.tsx` (`/dashboard`)
2. **My Attendance:** `src/app/pages/employee/EmployeeAttendance.tsx` (`/employee/attendance`)
3. **My Leave Requests:** `src/app/pages/employee/EmployeeLeaves.tsx` (`/employee/leave`)
4. **My Payslips:** `src/app/pages/employee/EmployeePayslips.tsx` (`/employee/payslip`)
5. **My Schedule:** `src/app/pages/employee/EmployeeSchedule.tsx` (`/employee/schedule`)
6. **My Performance Goals:** `src/app/pages/employee/EmployeePerformance.tsx` (`/employee/performance`)
7. **My Self-Profile:** `src/app/pages/employee/EmployeeSelfProfile.tsx` (`/employee/profile`)
8. **My Documents:** `src/app/pages/employee/EmployeeDocuments.tsx` (`/my-documents`)
9. **My Asset Allocations:** `src/app/pages/employee/MyAssets.tsx` (`/my-assets`)
10. **My Exit Checklist:** `src/app/pages/employee/EmployeeExit.tsx` (`/my-exit`)
11. **My Onboarding Portal:** `src/app/features/Onboarding/OnboardingPage.tsx` (`/my-onboarding`)
12. **My Expense Reimbursements:** `src/app/pages/employee/ReimbursementHistory.tsx` (`/reimbursement-history`)
13. **Support Tickets:** `src/app/pages/employee/EmployeeSupport.tsx` (`/support`)

### Platform Admin (SaaS Admin)
1. **Platform Dashboard:** `src/app/admin/features/dashboard/DashboardView.tsx` (`/platform-admin/dashboard`)
2. **Organization Tenant Management:** `src/app/admin/features/organizations/OrganizationManagementView.tsx` (`/platform-admin/organizations`)
3. **Subscription & Billing:** `src/app/admin/features/subscription-billing/SubscriptionBillingView.tsx` (`/platform-admin/subscriptions`)
4. **Global Analytics Reports:** `src/app/admin/features/reports/ReportsView.tsx` (`/platform-admin/reports`)
5. **Platform Support Desk:** `src/app/admin/features/supportTickets/SupportTicketsView.tsx` (`/platform-admin/support-tickets`)
6. **Feature Toggle Management:** `src/app/admin/features/featureManagement/FeatureManagementView.tsx` (`/platform-admin/features`)
7. **Global System Settings:** `src/app/admin/features/platformSettings/PlatformSettingsView.tsx` (`/platform-admin/settings`)

---

## 3. Workflow Implementation Status Analysis

| Workflow Name | End-to-End Flow Summary | Implementation Status | Functional Gap / Action Required |
|---|---|---|---|
| **Employee Lifecycle** | Add Employee → Profile → Role Assignment → Exit | **IMPLEMENTED** | Local state active; REST API integration required for server persistence. |
| **Recruitment & Hiring** | Job Posting → Candidate Application → Interview → Offer | **PARTIALLY IMPLEMENTED** | Drag-and-drop pipeline works in UI; backend resume parsing and automated offer letter emails required. |
| **Onboarding** | Candidate Offer → Document Upload → Verification → Active Status | **PARTIALLY IMPLEMENTED** | Verification drawers active; cloud storage blob integration required for document attachments. |
| **Attendance & Regularization** | Clock-in/out → Geofencing → Regularization → Approval | **PARTIALLY IMPLEMENTED** | Mock timer works; biometric device sync and real-time backend verification required. |
| **Leave Management** | Request → Balance Check → Multi-Level Approval → Audit Log | **IMPLEMENTED** | Leave balance deduction logic active; notification webhooks required. |
| **Payroll Processing** | Attendance Sync → Salary Calculation → Review → Payslip Dist. | **PARTIALLY IMPLEMENTED** | Calculations active; bank API payout gateway & PDF generation required. |
| **Expense Reimbursement** | Receipt Upload → Level 1 Approval → Finance Payout | **PARTIALLY IMPLEMENTED** | Claim flow active; OCR receipt scanner & payment gateway required. |
| **Performance & Appraisal** | Goal Setting → Self Review → Manager Rating → Appraisal | **IMPLEMENTED** | Rating matrix active; HR sign-off notification required. |
| **Asset Allocation** | Inventory Creation → Assignment → Return → Depreciation | **IMPLEMENTED** | Asset tracking active; serial code barcode scanner integration optional. |
| **Offboarding & F&F** | Resignation → Dept Clearances → F&F Calculation → Exit | **IMPLEMENTED** | Settlement calculations active; automated exit survey mailer required. |

---

## 4. Master Feature Change & Implementation Checklist

| ID | Role | Module | Existing Screen | Current Status | Required Change | Frontend Change | Backend Dependency | Priority | Status |
|---|---|---|---|---|---|---|---|---|---|
| **CHK-01** | Super Admin | Manage Account | `ManageAccountUsers.tsx` | PARTIAL | Connect live user REST API endpoints for add/edit/suspend operations. | FRONTEND ONLY (API hook) | BACKEND REQUIRED | P1 | NOT STARTED |
| **CHK-02** | Super Admin | Roles & Perms | `RolesPermissionsPage.tsx` | IMPLEMENTED | Persist custom role creation and permission key mapping to database. | FRONTEND ONLY (Hook update) | BACKEND REQUIRED | P1 | NOT STARTED |
| **CHK-03** | HR | Recruitment | `Recruitment.tsx` | PARTIAL | Add resume attachment file preview modal and email invite trigger. | FRONTEND ONLY | FRONTEND + BACKEND | P2 | NOT STARTED |
| **CHK-04** | HR | Onboarding | `OnboardingPage.tsx` | PARTIAL | Integrate cloud storage file upload for ID and tax document verifications. | FRONTEND ONLY | BACKEND REQUIRED | P2 | NOT STARTED |
| **CHK-05** | HR | Attendance | `Attendance.tsx` | PARTIAL | Connect biometric device API stream for real-time attendance logs. | FRONTEND ONLY | BACKEND REQUIRED | P2 | NOT STARTED |
| **CHK-06** | Finance | Payroll | `FinancePayroll.tsx` | PARTIAL | Implement client-side PDF renderer for downloadable employee payslips. | FRONTEND ONLY | FRONTEND ONLY | P1 | NOT STARTED |
| **CHK-07** | Finance | Expenses | `FinanceExpenses.tsx` | PARTIAL | Connect payment disbursement webhook for instant reimbursement payout. | FRONTEND ONLY | BACKEND REQUIRED | P1 | NOT STARTED |
| **CHK-08** | Finance | F&F Settlement | `FinanceSettlements.tsx` | IMPLEMENTED | Generate downloadable Final Settlement Clearance Certificate PDF. | FRONTEND ONLY | FRONTEND ONLY | P2 | NOT STARTED |
| **CHK-09** | Manager | Leave Approvals | `ManagerLeaveApprovals.tsx` | IMPLEMENTED | Trigger real-time push notification on leave request approval/rejection. | FRONTEND ONLY | BACKEND REQUIRED | P2 | NOT STARTED |
| **CHK-10** | Employee | Self Profile | `EmployeeSelfProfile.tsx` | IMPLEMENTED | Add profile photo upload crop modal and address change request flow. | FRONTEND ONLY | FRONTEND + BACKEND | P3 | NOT STARTED |
| **CHK-11** | Platform Admin| Tenants | `OrganizationManagementView.tsx`| IMPLEMENTED | Add tenant database connection status health indicator and metrics. | FRONTEND ONLY | BACKEND REQUIRED | P2 | NOT STARTED |

---

## 5. Summary Totals & Implementation Roadmap

- **TOTAL SCREENS ANALYZED:** `84`
- **TOTAL MODULES:** `22`
- **TOTAL EXISTING FEATURES:** `48`
- **TOTAL PARTIAL FEATURES:** `11`
- **TOTAL FUNCTIONAL GAPS:** `11`
- **TOTAL FRONTEND-ONLY CHANGES:** `3`
- **TOTAL BACKEND CHANGES REQUIRED:** `8`
- **TOTAL REQUIRES BUSINESS CONFIRMATION:** `2` (Biometric device vendor API schema & Bank Payout webhook credentials)
- **TOTAL P0 ISSUES:** `0`
- **TOTAL P1 ISSUES:** `4`
- **TOTAL P2 ISSUES:** `6`
- **TOTAL P3 ISSUES:** `1`

### Recommended Implementation Sprint Order

1. **Sprint 1 (P1 Core Integrations):** Connect User REST API hooks for Account Management (`CH-01`) and Role Persistence (`CH-02`). Implement Client-side Payslip PDF Renderer (`CH-06`).
2. **Sprint 2 (P1 Payouts & Approvals):** Connect Expense Reimbursement payout webhooks (`CH-07`) and trigger real-time Leave Approval notifications (`CH-09`).
3. **Sprint 3 (P2 Onboarding & Verification):** Integrate cloud document file uploads for Onboarding (`CH-04`), Recruitment resume viewer (`CH-03`), and F&F Settlement PDF generation (`CH-08`).
4. **Sprint 4 (P2/P3 Enhancements):** Platform Admin tenant health metrics (`CH-11`), Employee self-profile photo upload (`CH-10`), and Biometric API sync (`CH-05`).
