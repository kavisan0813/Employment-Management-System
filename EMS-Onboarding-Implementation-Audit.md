# NexusHR EMS — Onboarding Implementation Audit & Architecture Report

**Task Reference**: TASK 5.2 — Onboarding File Upload, Validation, Configurable Limits, RBAC & Workflow Implementation  
**Project**: NexusHR Employment Management System (EMS)  
**Author**: Antigravity AI Senior Architect  
**Date**: August 22, 2026  
**Status**: COMPLETED & VERIFIED  

---

## 1. Executive Summary

This document presents the complete architectural audit and implementation specification for the **NexusHR EMS Onboarding Module**, focusing on file upload management, configurable upload limits, multi-layered file validation, double-layered RBAC authorization, and end-to-end workflow coherence.

### Key Implementation Achievements
- **Configurable Upload Limits**: Implemented a platform-wide setting in Super Admin / Platform Settings (`OnboardingSettingsSection.tsx`) permitting administrators to configure document upload limits (1 MB to 100 MB, defaulting to 10 MB).
- **Single Source of Truth**: Created canonical utility functions in `src/app/features/Onboarding/utils/fileValidation.ts` (`getOnboardingMaxFileSizeMb()`, `validateFile()`, `formatBytes()`) that synchronize across Super Admin settings and candidate/HR upload modals via `localStorage` key `"viyan_onboarding_config:v1"`.
- **Multi-layered File Validation**: Enforced pre-upload checks for zero-byte empty files (`file.size === 0`), maximum file size limits, MIME type and extension checking (`.pdf`, `.jpg`, `.jpeg`, `.png`, `.doc`, `.docx`), and duplicate file upload detection for individual onboarding records.
- **Enhanced UI & UX**: Upgraded `UploadDocumentModal.tsx` to support Drag-and-Drop zones, Browse file selection, dynamic display of active upload limits, file preview cards, inline error alert banners, and animated progress indicators (0% → 100%).
- **Double-Layered RBAC Security**: Enforced authorization checks on both the UI layer (`<PermissionGate requires={P.ONBOARDING_MANAGE}>`) and handler level (`hasPermissionKey(P.ONBOARDING_MANAGE)`, `P.ONBOARDING_SELF`, `P.ONBOARDING_COMPLETE_TASKS`). Removed legacy role-string authorization checks.
- **Tenant Isolation & Subscription Compliance**: Maintained organization context scoping without hardcoded tenant identifiers, ensuring full compatibility with `FeatureContext` (`FEATURE_KEYS.ONBOARDING`) and `Growth` tier subscription requirements.

---

## 2. Current System Audit & Refactoring Baseline

### Pre-Implementation State
1. **Hardcoded Upload Limit**: File validation was constrained by a static placeholder (`MAX_FILE_SIZE_MB = 2`) in `fileValidation.ts` without integration to system settings.
2. **Limited File Validation**: Only checked standard file size and basic MIME types. Did not detect zero-byte/empty files, duplicate filenames, or Word document extensions (`.doc`, `.docx`).
3. **Modal Input Disconnect**: `UploadDocumentModal.tsx` did not pass the selected `File` object or metadata (`fileName`, `fileSize`, `fileType`) to `handleConfirmUpload`, resulting in incomplete document record entries.
4. **Authorization Gaps**: `CompanyProcess.tsx` contained legacy role-string checking (`user?.role`), which violated canonical RBAC principles.

### Post-Implementation Refactored Architecture
- **Types**: Extended `DocumentItem` in `src/app/features/Onboarding/types/onboarding.types.ts` to include `fileName?: string`, `fileSize?: string`, `fileType?: string`.
- **Validation Engine**: Refactored `src/app/features/Onboarding/utils/fileValidation.ts` into a complete validation suite returning explicit `FileValidationResult` objects with codes: `EMPTY_FILE`, `OVERSIZED`, `UNSUPPORTED_TYPE`, `DUPLICATE`, `INVALID_FILE`.
- **Admin Configuration**: Updated `OnboardingSettingsSection.tsx` and `SettingsContext.tsx` with a dedicated `Maximum Document Upload Size (MB)` control.
- **Modal Component**: Rewrote `UploadDocumentModal.tsx` with Drag-and-Drop, file preview cards, inline error alerts, animated progress bars, and permission checking.
- **Portal Integration**: Connected candidate and HR onboarding portals (`EmployeePortal.tsx`, `Documents.tsx`, `useOnboarding.ts`) to the unified modal and validation engine.

---

## 3. Configurable File Upload Limit Architecture

```
┌─────────────────────────────────────────────────────────┐
│     Super Admin / Platform Settings UI                   │
│     (OnboardingSettingsSection.tsx / SettingsContext)   │
└───────────────────────────┬─────────────────────────────┘
                            │ Updates Setting
                            ▼
┌─────────────────────────────────────────────────────────┐
│     Local Storage Config Repository                     │
│     key: "viyan_onboarding_config:v1" { maxFileSizeMb }  │
└───────────────────────────┬─────────────────────────────┘
                            │ Reads Active Limit
                            ▼
┌─────────────────────────────────────────────────────────┐
│     Canonical Validation Suite (fileValidation.ts)      │
│     getOnboardingMaxFileSizeMb()                        │
└───────────────────────────┬─────────────────────────────┘
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│ HR Onboarding Modal   │       │ Candidate Portal      │
│ UploadDocumentModal   │       │ EmployeePortal        │
└───────────────────────┘       └───────────────────────┘
```

### Configuration Specifications
- **Setting Name**: `onboardingMaxFileSizeMb`
- **Default Value**: `10` MB
- **Allowed Numeric Range**: `1` MB to `100` MB
- **Validation**: Rejects `0`, negative, or non-numeric inputs.
- **Storage & Synchronization**: Persisted to `localStorage` key `"viyan_onboarding_config:v1"`. Triggers custom window event `"viyan:onboarding-config-updated"` for instant reactive synchronization across open tabs and views.

---

## 4. File Validation & Safety Specifications

The canonical `validateFile(file, existingFileNames)` function executes five sequential validation checks:

| Validation Stage | Test Condition | Rejection Code | Human-Readable Error Message |
| :--- | :--- | :--- | :--- |
| **1. File Existence** | `!file` | `INVALID_FILE` | "Please select a file to upload." |
| **2. Zero-Byte Check** | `file.size === 0` | `EMPTY_FILE` | "The selected file is empty (0 bytes). Please select a valid, non-empty document." |
| **3. Size Limit Check** | `file.size > maxBytes` | `OVERSIZED` | "File size ({formattedSize}) exceeds the maximum configured limit of {maxMb} MB." |
| **4. Format & Extension** | `!isValidMime && !isValidExt` | `UNSUPPORTED_TYPE` | "Unsupported file format '{extension}'. Allowed formats: PDF, JPG, PNG, DOC, DOCX." |
| **5. Duplicate Detection** | `existingNames.includes(file.name)` | `DUPLICATE` | "A file named '{file.name}' has already been uploaded for this onboarding." |

---

## 5. Upload Error & Success Handling

### Upload Error Flow
1. **Non-destructive Behavior**: Validation failure preserves all existing onboarding checklist selections, candidate details, and phase progress.
2. **Inline Alert Card**: Displays a styled alert box (`AlertCircle` icon) inside `UploadDocumentModal` highlighting the specific error code and detailed message.
3. **Toast Notification**: Triggers `showToast("Upload Validation Failed", "error", errorMsg)`.
4. **Action Gate**: Disables the "Confirm Upload" button until a valid file is selected.

### Upload Success Flow
1. **File Preview Card**: Displays file icon (PDF, Image, Word), file name, formatted size (`formatBytes()`), and a green `"Valid"` badge.
2. **Simulated Upload Progress**: Animates progress bar from `0%` to `100%` over 500ms when confirmed.
3. **Metadata Storage**: Stores document metadata in `viyan_onboarding_documents:v1`:
   - `id`: Unique document ID (`doc-{hireId}-{timestamp}`)
   - `fileName`: Original file name (e.g. `Passport_Scan.pdf`)
   - `fileSize`: Formatted string (e.g. `2.45 MB`)
   - `fileType`: Format badge (e.g. `PDF`)
   - `status`: `"uploaded"`
   - `uploadedBy`: Current user name or `"HR Team"`
   - `date`: Current ISO date
   - `verificationStatus`: `"pending"`
4. **Toast Notification**: Triggers `showToast("Document Uploaded Successfully", "success", msg)`.

---

## 6. Onboarding Workflow Coherence

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Manage Account  │ ──> │ Onboarding       │ ──> │ Candidate        │
│ / Add User      │     │ Queue / Selected │     │ Setup Portal     │
└─────────────────┘     └──────────────────┘     └──────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Onboarding      │ <── │ Verification &   │ <── │ Document Upload  │
│ Completed       │     │ HR Approvals     │     │ & Validation     │
└─────────────────┘     └──────────────────┘     └──────────────────┘
```

### Handoff & Progression
- **Initiation Handoff**: Creating a user in Super Admin / Manage Account adds the record to `viyan_onboarding_queue:v1` with status `"pre-joining"`.
- **Backward/Forward Navigation**: Navigating between Onboarding tabs (`Dashboard`, `Workspace`, `Templates`) or candidate sub-tabs (`Personal Information`, `Required Files`, `Company Documents`) preserves all state in local storage.
- **Completion Criteria**: Overall progress percentage updates dynamically as documents are uploaded and tasks are marked completed.

---

## 7. Role & Permission Security Audit (RBAC)

### Canonical Permission Mapping

| Feature / Action | Required Permission Key | Component / Handler Protection |
| :--- | :--- | :--- |
| **Manage Onboarding & Templates** | `P.ONBOARDING_MANAGE` (`"onboarding:manage"`) | `<PermissionGate requires={P.ONBOARDING_MANAGE}>` & `hasPermissionKey(P.ONBOARDING_MANAGE)` |
| **Full Onboarding Access** | `P.ONBOARDING_FULL` (`"onboarding:full"`) | Route Guard & Handler checks |
| **Finance Setup & Approvals** | `P.ONBOARDING_FINANCE_SETUP` (`"onboarding:finance_setup"`) | `CompanyProcess.tsx` `canActOnOwner("Finance")` |
| **Task & Document Completion** | `P.ONBOARDING_COMPLETE_TASKS` (`"onboarding:complete_tasks"`) | `UploadDocumentModal.tsx` & `EmployeePortal.tsx` |
| **Employee Self-Service Portal**| `P.ONBOARDING_SELF` (`"onboarding:self"`) | `EmployeePortal.tsx` candidate uploads |

### Elimination of Legacy Role-String Checks
- Audited `CompanyProcess.tsx` and removed string matching against `user?.role`. Replaced with `hasPermissionKey(P.OFFBOARDING_CLEARANCE_IT)`, `hasPermissionKey(P.ONBOARDING_FINANCE_SETUP)`, etc.
- Audited `useOnboarding.ts` and `UploadDocumentModal.tsx` to ensure zero direct `role ===` authorization logic exists.

---

## 8. Feature Flag & Subscription Tier Alignment

- **Feature Key**: `FEATURE_KEYS.ONBOARDING` (`"onboarding"`)
- **Minimum Subscription Plan**: `Growth` (also available in `Enterprise`)
- **Enforcement**: Protected via `FeatureContext`. If a tenant is on `Starter` plan or has the feature disabled, the UI renders `<FeatureUnavailable featureKey="onboarding" />`.

---

## 9. Tenant Isolation Audit

- **Organization Context**: All onboarding queue items (`ONB_QUEUE_KEY`), phase checklists (`ONB_PHASES_KEY`), and uploaded documents (`ONB_DOCS_KEY`) are stored with employee IDs and tenant references.
- **Zero Hardcoded Organization IDs**: Verified no static tenant references (such as `"org-1"`) exist in the onboarding implementation.

---

## 10. UX, Design System & Accessibility

- **Design System Tokens**: Fully adheres to NexusHR design tokens: `#00B87C` (Primary Green), `#8B5CF6` (Accent Purple), `#F59E0B` (Warning Amber), `#EF4444` (Error Red), `var(--card)`, `var(--border)`, `var(--foreground)`.
- **Theme Support**: 100% compliant with Light and Dark mode using CSS variables and Tailwind theme utilities (`dark:bg-neutral-800`, `dark:border-neutral-700`).
- **Responsive Viewports**: Tested and verified across desktop (`1440px+`), laptop (`1024px`), tablet (`768px`), and mobile screens (`360px`, `390px`, `480px`).
- **Accessibility**: Modal controls include keyboard focus traps, `aria-labels`, `Esc` key listener, and keyboard-accessible Drag/Drop file browse triggers.

---

## 11. Audit Summary & Sign-off

| Requirement Item | Status | Verification Result |
| :--- | :--- | :--- |
| **1. File Upload Size Limit** | COMPLETED | Configurable 1 MB - 100 MB (Default: 10 MB) |
| **2. Multi-layered File Validation** | COMPLETED | Checks size, 0-byte, MIME/extension, duplicates |
| **3. Upload Error States** | COMPLETED | Non-destructive, inline alerts, error toast, retry |
| **4. Upload Success States** | COMPLETED | Preview card, size formatting, timestamp, progress bar |
| **5. Canonical RBAC Protection** | COMPLETED | Double-layer `PermissionGate` + `hasPermissionKey` |
| **6. Onboarding Workflow Coherence** | COMPLETED | End-to-end queue, handoffs, progress tracking |
| **7. Configurable Admin Setting** | COMPLETED | Added to `OnboardingSettingsSection.tsx` & synced |
| **8. Tenant Isolation** | COMPLETED | Scoped to organization context, no static org IDs |
| **9. Light/Dark Mode Support** | COMPLETED | Styled with theme CSS tokens across all components |
| **10. Responsive Behavior** | COMPLETED | Verified from 360px mobile to 1440px+ screens |
| **11. Zero TypeScript Errors** | COMPLETED | `npx tsc --noEmit` passed with 0 errors |
| **12. Production Build Success** | COMPLETED | `npm run build` completed cleanly (Exit 0) |

**Signed-off by**: Senior Architect, Antigravity AI Engineering Team  
**Timestamp**: August 22, 2026
