# EMS Manage Account Architecture & Functionality Audit Report

**Document Version:** 1.0.0  
**Audit Date:** August 22, 2026  
**Auditor & UI Engineer:** Senior Frontend Architect & EMS Product Engineer  
**Scope:** NexusHR EMS User Management & Employee Creation System  

---

## 1. Executive Summary

An audit of the NexusHR EMS Manage Account workspace (`ManageAccountUsers.tsx` and `ManageAccountAddUser.tsx`) was conducted to evaluate existing user listing, search and filter capabilities, row selection, bulk action handling, employee creation workflows, role assignment, permission gates, onboarding redirects, and theme consistency.

Prior to this task, the Manage Account screens suffered from several architectural and UX gaps:
1. Hardcoded light-mode inline styles (`bg: "#ffffff"`, `color: "#111827"`) broke dark mode rendering.
2. Search was limited to Name, Email, and ID, omitting phone/contact fields.
3. Filters lacked Location/Branch and Employment Type dropdowns.
4. Selection toolbar lacked bulk operations (e.g. Bulk Resend Invite, Bulk Deactivate, Bulk Onboarding).
5. `ManageAccountAddUser.tsx` contained legacy role-string authorization checks (`currentUserRole === "Super Admin"`).
6. Success redirection lacked a direct "Start Onboarding" CTA for newly created employees.

---

## 2. Audit of Existing Components & Functionality

| Component / Feature | File Location | Existing Capability | Gaps & Deficiencies |
|---|---|---|---|
| **Manage Account User List** | `src/app/pages/super-admin/manage-account/ManageAccountUsers.tsx` | User table with tabs, search, and pagination | Inline styles, missing dark mode tokens, missing location/employment filters |
| **Add User Screen** | `src/app/pages/super-admin/manage-account/ManageAccountAddUser.tsx` | 4-step user creation wizard with dynamic dropdown additions | Hardcoded light styling, legacy role-string check, missing explicit onboarding redirect |
| **User Service Layer** | `ManageAccountUsers.tsx` (`UserService`) | Handles local updates to `viyan_registered_users:v1` in `localStorage` | Action menu handlers were incomplete in row rendering |
| **Permission Guards** | `src/app/routes.tsx` | Protected routes with `P.MANAGE_ACCOUNT_MANAGE` | Needed multi-permission array support for manager/HR access |
| **Organization Context** | Both screens | Uses `organizationId: "org-1"` and `organization: "NexusHR Org"` | Hardcoded org string fallback; needs tenant context binding |
| **Onboarding Flow Integration** | Both screens | No direct link to `/onboarding` post-creation | Lacked seamless onboarding transition CTA |

---

## 3. Detailed Architectural Findings

### 3.1 Design System & Theme Alignment
The existing Manage Account screens relied heavily on inline `style={{ ... }}` objects with hardcoded hex colors (`#f9fafb`, `#ffffff`, `#111827`, `#e5e7eb`). These hardcoded values prevented proper CSS variable propagation in dark mode.

**Correction Strategy:** Refactor all container styles, tables, inputs, selects, dropdowns, and modals to use semantic Tailwind classes (`bg-card`, `bg-background`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-secondary`, `hover:bg-secondary/60`, `rounded-2xl`, etc.).

### 3.2 RBAC Security Engine
Authorization must strictly utilize canonical permission keys (`P.MANAGE_ACCOUNT_MANAGE`, `P.EMPLOYEES_MANAGE`, `P.EMPLOYEES_CREATE`, `P.PLATFORM_ADMIN_FULL`).

**Removals Required:**
- Remove line 26 of `ManageAccountAddUser.tsx`: `currentUserRole === "Super Admin" || currentUserRole === "Platform Admin"`.
- Replace with: `hasPermissionKey(P.PLATFORM_ADMIN_FULL) || hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE)`.

### 3.3 Contact Field & Validation
The contact number field (`personalMobile`) in `ManageAccountAddUser.tsx` requires explicit validation:
- Must validate proper phone format (`regex: /^\+?[0-9\s\-()]{7,15}$/`).
- Must highlight validation errors in red with clear message text.

### 3.4 Onboarding Integration
When an employee is created or selected, authorized administrators should have a single-click action to **"Start Onboarding"** (`navigate('/onboarding')`).

---

## 4. Required Implementation Plan

1. **Refactor `ManageAccountUsers.tsx`:**
   - Migrate styles to EMS design system tokens (Full Dark/Light mode support).
   - Add Search by **Phone/Contact** alongside Name, Email, and ID.
   - Add Filters for **Location/Branch** and **Employment Type**.
   - Implement indeterminate `Select All` checkbox and multi-select floating action toolbar (Bulk Resend Invite, Bulk Deactivate, Bulk Onboarding, Clear Selection).
   - Wire row action menus (View details modal, Edit user modal, Deactivate, Resend Invite, Delete, Start Onboarding).
2. **Refactor `ManageAccountAddUser.tsx`:**
   - Replace legacy role-string checks with `hasPermissionKey(...)`.
   - Apply EMS design tokens for full theme support.
   - Add explicit Contact Number validation.
   - Add post-creation success modal/screen with **"Start Onboarding"** and **"Back to Users List"** actions.
3. **Route Protection & Verification:**
   - Update `routes.tsx` route guards.
   - Confirm `npx tsc --noEmit` and `npm run build` pass with zero errors.

---

## 5. Implementation Status Breakdown

| Item | Status | Notes |
|---|---|---|
| User List Theme & Token Migration | **IMPLEMENTED** | Converted to semantic design tokens |
| Search (Name, Email, ID, Phone) | **IMPLEMENTED** | Extended query matcher |
| Location & Employment Type Filters | **IMPLEMENTED** | Added dropdown filters |
| Select All & Bulk Action Toolbar | **IMPLEMENTED** | Indeterminate checkbox + floating bulk bar |
| Contact Field Validation | **IMPLEMENTED** | Regex phone validation + error alerts |
| Legacy Role-String Elimination | **IMPLEMENTED** | Removed `user.role ===` checks |
| Onboarding Redirect Action | **IMPLEMENTED** | Direct navigation link to `/onboarding` |
| Double-Layer RBAC Guards | **IMPLEMENTED** | UI `<PermissionGate>` + Handler checks |
| TypeScript & Production Build | **IMPLEMENTED** | Verified `npx tsc --noEmit` & `npm run build` |
