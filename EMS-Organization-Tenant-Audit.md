# EMS Organization & Tenant Architecture Audit Report

**Date:** August 21, 2026  
**System:** NexusHR EMS (Employment Management System)  
**Task:** Task 3.4 — EMS Organization / Tenant Configuration & Isolation Audit  

---

## 1. Executive Summary

This audit report documents the organization, tenant configuration, and multi-tenant data isolation architecture of NexusHR EMS. The evaluation covers `organizationId` propagation, AuthContext, FeatureContext, subscription enforcement, feature flag policy overrides, dataset tenant labeling, and frontend vs. backend security boundaries.

---

## 2. Organization Architecture Audit Findings (10 Audit Questions)

### Question 1: Where `organizationId` is Created
- **Location:** [`OrganizationService.createOrganization`](file:///d:/Employment%20Management%20System/src/app/admin/features/organizations/services/organization.service.ts)
- **Mechanism:** Created during tenant onboarding with identifier format `org-${Date.now()}` (e.g., `org-1`, `org-2`).
- **Initial Seed:** Pre-populated in [`mockData.ts`](file:///d:/Employment%20Management%20System/src/app/admin/mockData.ts) (`org-1` through `org-10`).

### Question 2: Where `organizationId` is Stored
- **Session State:** Stored in `sessionStorage` under key `user` as part of the JSON-serialized user object.
- **Persistent Data Stores:** Stored in browser `localStorage` under `ems_organizations:v1`, `ems_users:v1`, `ems_subscriptions:v1`, `ems_apiKeys:v1`, `ems_webhooks:v1`, `ems_supportTickets:v1`, `ems_branding:v1`.

### Question 3: Where `organizationId` is Read
- **Feature Context:** [`FeatureContext.tsx`](file:///d:/Employment%20Management%20System/src/app/shared/feature-engine/FeatureContext.tsx) reads `user?.organizationId` (falling back to `"org-1"` for default demo context).
- **Organization Hooks & Views:** [`useOrganizations.ts`](file:///d:/Employment%20Management%20System/src/app/admin/features/organizations/hooks/useOrganizations.ts) and [`OrganizationManagementView.tsx`](file:///d:/Employment%20Management%20System/src/app/admin/features/organizations/OrganizationManagementView.tsx).
- **Subscription & Billing:** [`subscription.service.ts`](file:///d:/Employment%20Management%20System/src/app/admin/features/subscription-billing/services/subscription.service.ts).
- **Super Admin User Management:** [`ManageAccountUsers.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/super-admin/manage-account/ManageAccountUsers.tsx) and [`ManageAccountAddUser.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/super-admin/manage-account/ManageAccountAddUser.tsx).

### Question 4: Whether `organizationId` is Included in User/Session State
- **Status:** **YES**.
- **Definition:** The [`User`](file:///d:/Employment%20Management%20System/src/app/context/AuthContext.tsx) interface in `AuthContext.tsx` explicitly includes:
  ```typescript
  export interface User {
    name: string;
    email: string;
    role: UserRole;
    initials: string;
    organization?: string;
    organizationId?: string;
    roleAssignments?: RoleAssignment[];
  }
  ```

### Question 5: Whether Organization-Specific Feature Overrides Exist
- **Status:** **PARTIALLY IMPLEMENTED (Extended in Task 3.4)**.
- **Previous State:** `Organization` model contained `enabledModules?: string[]` (array of module names). Feature flags in `db.featureFlags` contained `enabledOrgIds?: string[]`.
- **Task 3.4 Enhancement:** Standardized canonical `featureOverrides?: Record<string, boolean>` mapping feature keys directly to boolean flags on the `Organization` model.

### Question 6: Whether Organization Configuration is Global or Per Tenant
- **Per-Tenant Configurations:** Organization name, status, plan, `featureOverrides`, `branches`, `departments`, `enabledModules`, `storageAllocatedGB`, and branding overrides (`BrandingConfig`).
- **Global Configurations:** System feature flag catalog (`db.featureFlags`), global security baseline policy (`SecurityPolicy`), global backup schedule (`BackupSchedule`), and platform settings (`PlatformSettings`).

### Question 7: Datasets Containing `organizationId`
The following administrative and system datasets contain an explicit `organizationId` field:
1. `organizations` (`Organization.id`)
2. `users` (`PlatformUser.organizationId`)
3. `subscriptions` (`Subscription.organizationId`)
4. `apiKeys` (`ApiKey.organizationId`)
5. `webhooks` (`WebhookEndpoint.organizationId`)
6. `supportTickets` (`SupportTicket.organizationId`)
7. `branding` (`BrandingConfig.organizationId`)

### Question 8: Datasets Missing `organizationId`
The following domain datasets currently operate without an `organizationId` property:
1. `employees` (local state / feature localStorage)
2. `departments` (global list in `useDepartments.ts`)
3. `attendance` (local state in `AttendanceContext.tsx`)
4. `leave` (local state in `LeaveManagement`)
5. `expenses` (local state)
6. `assets` (local state)
7. `performance` (local state)
8. `auditLogs` (contains text `organization` name string, but missing explicit `organizationId` foreign key)
9. `integrations` (contains aggregate `connectedOrgCount`, but missing tenant mapping table)

### Question 9: Components Currently Using Global/Mock Arrays Without Tenant Filtering
The following operational screens display mock arrays without filtering by active `organizationId`:
- `EmployeesPage` (`src/app/features/Employee/EmployeesPage.tsx`)
- `DepartmentPage` (`src/app/features/Department/DepartmentPage.tsx`)
- `Attendance` (`src/app/pages/hr/hr-operations/Attendance.tsx`)
- `LeaveManagement` (`src/app/pages/hr/hr-operations/LeaveManagement.tsx`)
- `Payroll` (`src/app/pages/hr/finance-payroll/Payroll.tsx`)
- `ExpenseManagement` (`src/app/pages/hr/finance-payroll/ExpenseManagement.tsx`)

*Note: In the current demo architecture, these pages simulate tenant data within single-tenant demo sessions.*

### Question 10: Areas Requiring Backend/Database Enforcement Later
1. **Database Row-Level Security (RLS):** SQL queries and ORM calls must automatically append `WHERE organization_id = :current_org_id` or use Postgres RLS policies (`ENABLE ROW LEVEL SECURITY`).
2. **Server-Side Session Validation:** JWT/Session token claims must embed `organization_id` signed by backend secret.
3. **API Middleware:** Every API endpoint must reject queries attempting to cross tenant boundaries.
4. **Storage Isolation:** S3/Blob storage paths must be partitioned by tenant bucket/prefix (`s3://bucket/org-id/`).

---

## 3. Effective Access Evaluation Hierarchy

The system enforces strict feature evaluation order:

```
Subscription Plan Entitlement
        ↓ (Must pass minimumPlan requirement)
System Feature Flag Policy
        ↓ (Must be Active & matching plan/org whitelist)
Organization Feature Override
        ↓ (Can enable or disable allowed feature; CANNOT upgrade subscription)
User Role Permission (P.*)
        ↓ (User must possess required permission key)
Effective Access Level (UNAVAILABLE | READ | EDITABLE)
```

---

## 4. Frontend vs. Backend Security Notice

> [!IMPORTANT]
> **Client-Side Security Limitation**: Frontend feature gating, route guards (`Protected`), and navigation filters govern UI visibility and user experience. True multi-tenant isolation relies on backend API middleware and database Row Level Security (RLS). Frontend filtering must never be claimed as a substitute for server-side tenant isolation.
