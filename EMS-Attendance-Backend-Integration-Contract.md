# NexusHR EMS — Attendance Management Backend Integration Contract

**System**: NexusHR Employee Management System (EMS)  
**Module**: HR Operations — Attendance Management  
**Classification**: FRONTEND/BACKEND BOUNDARY CONTRACT SPECIFICATION  
**Document Status**: APPROVED SPECIFICATION FOR BACKEND ENGINE INTEGRATION  

---

## 1. Overview & Architectural Boundaries

This document defines the strict RESTful API contracts, data schemas, security standards, and state synchronization rules required for integrating the NexusHR Attendance Management frontend with a production backend database and API gateway.

```
+-----------------------------------------------------------------------------------+
|                            NEXUSHR FRONTEND UI LAYER                              |
| (Attendance.tsx, AttendanceCalendar, AttendanceAnalytics, AttendanceRecordsTable) |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        FRONTEND SERVICE ABSTRACTION LAYER                         |
| (AttendanceService, AttendanceHardwareAdapter, AttendanceContext)                 |
+-----------------------------------------------------------------------------------+
                                         │
                                         │  HTTP / REST API + Bearer JWT Token
                                         ▼
+-----------------------------------------------------------------------------------+
|                           BACKEND API GATEWAY & SERVICES                          |
|  - Tenant Authorization Middleware (X-Organization-Id)                            |
|  - Server-side RBAC Enforcement Engine                                            |
|  - Input Validation & Time Parsing                                                |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                            DATABASE & STORAGE LAYER                               |
|  - PostgreSQL Row Level Security (RLS) on organization_id                         |
|  - Audit Log Ledger                                                               |
+-----------------------------------------------------------------------------------+
```

---

## 2. API Endpoints Specification

### A. Attendance Records API

#### 1. `GET /api/v1/attendance`
Retrieves a filtered, paginated list of attendance records for the active tenant.

- **Headers**: `Authorization: Bearer <JWT>`, `X-Organization-Id: <tenant-uuid>`
- **Query Parameters**:
  - `month` (integer, 1-12)
  - `year` (integer, 2024-2030)
  - `departmentId` (string, optional)
  - `employeeId` (string, optional)
  - `location` (string, optional)
  - `status` (string, optional: `Present` | `Absent` | `Late` | `Leave` | `Holiday` | `Half-day` | `WFH` | `Weekend`)
  - `shift` (string, optional)
  - `search` (string, optional query for name/ID/notes)
  - `page` (integer, default 1)
  - `limit` (integer, default 25)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ATT-1001",
      "employeeId": "EMP-101",
      "employeeName": "Sarah Jenkins",
      "employeeAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      "department": "Engineering",
      "date": "2026-04-10",
      "status": "Present",
      "checkIn": "08:58 AM",
      "checkOut": "06:02 PM",
      "hours": "9h 04m",
      "location": "HQ Office",
      "shift": "Morning",
      "notes": "Punched via Biometric Gate 01"
    }
  ],
  "pagination": {
    "total": 342,
    "page": 1,
    "limit": 25,
    "totalPages": 14
  }
}
```

#### 2. `POST /api/v1/attendance`
Creates a new attendance entry.

- **Required Permissions**: `P.ATTENDANCE_MANAGE` or `P.ATTENDANCE_FULL`
- **Request Body**:
```json
{
  "employeeId": "EMP-101",
  "date": "2026-04-10",
  "status": "Present",
  "checkIn": "09:00",
  "checkOut": "18:00",
  "location": "HQ Office",
  "shift": "Morning Shift",
  "notes": "Manual entry by HR Manager"
}
```
- **Validation Rules**:
  - `employeeId`, `date`, `status` are strictly required.
  - For `Present`, `Late`, `Half-day`, `WFH`: `checkIn` and `checkOut` are required.
  - `checkOut` timestamp MUST be greater than `checkIn` timestamp.
  - Server MUST enforce tenant isolation based on authenticated JWT user context.

#### 3. `PATCH /api/v1/attendance/:id`
Updates an existing attendance entry.

- **Required Permissions**: `P.ATTENDANCE_MANAGE` or `P.ATTENDANCE_FULL`
- **Response `200 OK`**: Returns updated record object.

#### 4. `DELETE /api/v1/attendance/:id`
Deletes an attendance record.

- **Required Permissions**: `P.ATTENDANCE_MANAGE` or `P.ATTENDANCE_FULL`
- **Response `200 OK`**: `{"success": true, "deletedId": "ATT-1001"}`

---

### B. Attendance Correction / Regularization API

#### 1. `POST /api/v1/attendance/corrections`
Submits a regularization request for an attendance discrepancy.

- **Request Body**:
```json
{
  "recordId": "ATT-1001",
  "employeeId": "EMP-101",
  "date": "2026-04-10",
  "currentCheckIn": "09:25 AM",
  "currentCheckOut": "06:00 PM",
  "correctedCheckIn": "09:00",
  "correctedCheckOut": "18:00",
  "reason": "Biometric terminal failed to log morning entry due to network drop.",
  "documentUrl": "https://storage.provider.com/tenants/org-uuid/docs/corr-101.pdf"
}
```
- **Response `201 Created`**: Returns correction object with `status: "PENDING"`.

#### 2. `PATCH /api/v1/attendance/corrections/:id/approve`
Approves a pending attendance correction request and automatically updates the target record.

- **Required Permissions**: `P.ATTENDANCE_APPROVE` or `P.ATTENDANCE_FULL`
- **Response `200 OK`**: Returns updated record and approved status.

#### 3. `PATCH /api/v1/attendance/corrections/:id/reject`
Rejects a pending attendance correction request.

- **Required Permissions**: `P.ATTENDANCE_APPROVE` or `P.ATTENDANCE_FULL`

---

### C. Attendance Settings & Configuration API

#### 1. `GET /api/v1/attendance/settings`
Returns organization-level attendance configuration (working hours, thresholds, holidays, shifts).

- **Required Permissions**: `P.ATTENDANCE_FULL`

#### 2. `PATCH /api/v1/attendance/settings`
Saves organization-level attendance configuration.

- **Required Permissions**: `P.ATTENDANCE_FULL`

---

## 3. Security, Authorization & Tenant Isolation Standards

1. **JWT Auth & Tenant Header**: Every request MUST include `Authorization: Bearer <JWT>` and `X-Organization-Id: <tenant-uuid>`.
2. **PostgreSQL Row Level Security (RLS)**:
   ```sql
   ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
   CREATE POLICY tenant_isolation_policy ON attendance_records
     USING (organization_id = current_setting('app.current_organization_id')::uuid);
   ```
3. **Audit Logging Ledger**: All create, edit, delete, and regularization approval actions MUST emit structured audit log events to the `audit_logs` table containing `actor_user_id`, `action`, `resource_id`, `ip_address`, and `changes_diff`.
