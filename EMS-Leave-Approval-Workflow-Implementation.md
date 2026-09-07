# EMS LEAVE MANAGEMENT — CONFIGURABLE APPROVAL WORKFLOW IMPLEMENTATION

> **Task ID:** TASK 8.3 — Configurable Approval Workflows (Single, Double, & Third Layer)  
> **Status:** COMPLETED / PASS  
> **Date:** August 28, 2026  

---

## 1. ARCHITECTURAL OVERVIEW

Task 8.3 introduces a centralized, tenant-scoped, multi-stage Leave Approval Workflow Engine. Leave management approval rules are abstracted into `LeaveService.ts`, allowing Super Admins to select between three authoritative workflow layers that dynamically control runtime leave request routing:

1. **SINGLE LAYER (`SINGLE`)**
   - Flow: `Employee` → `Team Lead (TL)` → `APPROVED`
   - Approval Stage 1: Team Lead (TL)
   - Outcome: Upon TL approval, the request immediately becomes `APPROVED`. Manager and HR approvals are not required or exposed.

2. **DOUBLE LAYER (`DOUBLE` - DEFAULT)**
   - Flow: `Employee` → `Team Lead (TL)` → `Manager` → `APPROVED`
   - Approval Stage 1: Team Lead (TL)
   - Approval Stage 2: Manager
   - Outcome: The request advances to `PENDING_MANAGER` after TL approval and becomes `APPROVED` only after Manager sign-off.

3. **THIRD LAYER (`THIRD`)**
   - Flow: `Employee` → `Team Lead (TL)` → `HR` → `Manager` → `APPROVED`
   - Approval Stage 1: Team Lead (TL)
   - Approval Stage 2: HR Review
   - Approval Stage 3: Manager Final Sign-off
   - Outcome: Full enterprise pipeline. The request advances sequentially through TL → HR → Manager stages.

---

## 2. STATE MODEL & STAGE ISOLATION

### Normalized Stage & Workflow States:
- `PENDING_TL`: Awaiting Team Lead approval.
- `PENDING_HR`: Awaiting HR compliance review (available in `THIRD` layer).
- `PENDING_MANAGER`: Awaiting Manager approval (available in `DOUBLE` and `THIRD` layers).
- `APPROVED`: All configured stages completed.
- `REJECTED`: Halted immediately by an approver at any active stage.

### Stage-Skipping Protection:
- Approvers cannot approve out of order (e.g. Manager cannot approve before TL in `DOUBLE` or before HR in `THIRD`).
- HR approval controls are hidden and disabled in `SINGLE` and `DOUBLE` layers.
- Rejection at any stage sets status to `REJECTED` and halts further pipeline progression.

---

## 3. TENANT ISOLATION & PERSISTENCE

- **Tenant Scoped Settings Key:** `viyan_leave_settings:${orgId}`
- **Tenant Scoped Records Key:** `viyan_leave_records:${orgId}`
- **Default Fallback:** `DOUBLE` layer (`Employee → TL → Manager`).
- **Super Admin Integration:** Changing the active workflow layer in `ApprovalWorkflowsSection.tsx` immediately persists to tenant storage, updates the workflow builder preview, and updates runtime Leave Management routing without requiring application reloads.

---

## 4. CANONICAL RBAC & SCOPE ENFORCEMENT

Authorization is strictly governed by canonical permission keys rather than hardcoded role strings:
- **`P.LEAVE_APPROVE_TEAM` / `P.LEAVE_APPROVE` / `P.LEAVE_RECOMMEND`**: Authorizes Team Lead (TL) stage approval.
- **`P.LEAVE_APPROVE_DEPT` / `P.LEAVE_MANAGE`**: Authorizes HR stage review in `THIRD` layer.
- **`P.LEAVE_APPROVE_DEPT` / `P.LEAVE_APPROVE_TEAM` / `P.LEAVE_APPROVE`**: Authorizes Manager stage approval.
- **`P.LEAVE_FULL` / `P.LEAVE_MANAGE`**: Authorizes full administrative override for Super Admin/HR Director.

---

## 5. FILES CREATED & MODIFIED

| File Path | Action | Description |
|---|---|---|
| [`src/app/pages/hr/hr-operations/leave/types.ts`](file:///d:/Employment%20Management%20System/src/app/pages/hr/hr-operations/leave/types.ts) | Modified | Added `ApprovalLayerType`, `ApprovalRole`, `ApprovalWorkflowConfig`, `ApprovalStageRecord`, `WorkflowStatus` |
| [`src/app/pages/hr/hr-operations/leave/leaveService.ts`](file:///d:/Employment%20Management%20System/src/app/pages/hr/hr-operations/leave/leaveService.ts) | Created | Centralized Leave Service & Workflow Engine (tenant storage, stage evaluation, approve/reject handlers) |
| [`src/app/pages/super-admin/settings/sections/ApprovalWorkflowsSection.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/super-admin/settings/sections/ApprovalWorkflowsSection.tsx) | Modified | Connected workflow selector UI to `LeaveService` tenant settings & dynamic builder preview |
| [`src/app/pages/hr/hr-operations/LeaveManagement.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/hr/hr-operations/LeaveManagement.tsx) | Modified | Integrated `LeaveService`, updated `LeaveDetailDrawer` stage progress bar & audit trail |
| [`src/app/pages/manager/team/ManagerLeaveApprovals.tsx`](file:///d:/Employment%20Management%20System/src/app/pages/manager/team/ManagerLeaveApprovals.tsx) | Modified | Integrated `LeaveService` for Manager stage approvals & active layer awareness banners |

---

## 6. BACKEND BOUNDARY DECLARATIONS

- **BACKEND WORKFLOW ENGINE:** BACKEND REQUIRED
- **BACKEND AUDIT LOG:** BACKEND REQUIRED
- **BACKEND TENANT/RLS:** BACKEND REQUIRED
