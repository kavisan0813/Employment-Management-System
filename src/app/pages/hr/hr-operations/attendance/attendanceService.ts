import { AttendanceRecord } from "../../../../context/AttendanceContext";
import { employees } from "../../../../data/mockData";

export interface AttendanceCorrectionRequest {
  id: string;
  recordId: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  date: string;
  currentCheckIn: string;
  currentCheckOut: string;
  correctedCheckIn: string;
  correctedCheckOut: string;
  reason: string;
  documentName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  approvedBy?: string;
  rejectedReason?: string;
}

export interface SuperAdminAttendanceSettings {
  workingHours: number;
  gracePeriod: number;
  lateThreshold: number;
  earlyCheckoutThreshold: number;
  halfDayThreshold: number;
  minWorkingHours: number;
  satOff: boolean;
  sunOff: boolean;
  holidays: Array<{ id: string; name: string; date: string; type: string }>;
  shifts: Array<{ id: string; name: string; start: string; end: string; grace: number }>;
}

const DEFAULT_SETTINGS: SuperAdminAttendanceSettings = {
  workingHours: 8,
  gracePeriod: 15,
  lateThreshold: 30,
  earlyCheckoutThreshold: 30,
  halfDayThreshold: 4,
  minWorkingHours: 4,
  satOff: true,
  sunOff: true,
  holidays: [
    { id: "1", name: "New Year's Day", date: "2026-01-01", type: "Public" },
    { id: "2", name: "Republic Day", date: "2026-01-26", type: "Public" },
    { id: "3", name: "Good Friday", date: "2026-04-03", type: "Festival" },
    { id: "4", name: "Independence Day", date: "2026-08-15", type: "Public" },
    { id: "5", name: "Diwali", date: "2026-11-08", type: "Festival" },
  ],
  shifts: [
    { id: "S1", name: "Morning Shift", start: "09:00", end: "18:00", grace: 15 },
    { id: "S2", name: "Evening Shift", start: "14:00", end: "23:00", grace: 15 },
    { id: "S3", name: "Night Shift", start: "22:00", end: "07:00", grace: 20 },
  ],
};

// Helper for tenant-scoped localStorage keys
const getTenantKey = (orgId: string | undefined, keyName: string): string => {
  const safeOrg = orgId && orgId.trim() !== "" ? orgId : "default";
  return `viyan_${keyName}:${safeOrg}`;
};

/**
 * AttendanceService — Frontend Service Abstraction Layer
 * 
 * CLASSIFICATION: FRONTEND SERVICE ABSTRACTION — BACKEND API REQUIRED
 * Tenant Context Safety: All operations scope storage keys by user.organizationId
 */
export class AttendanceService {
  /**
   * Generates initial mock attendance records for April 2026
   */
  public static generateInitialRecords(): AttendanceRecord[] {
    const generated: AttendanceRecord[] = [];
    employees.forEach((emp, index) => {
      for (let day = 1; day <= 22; day++) {
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        const dayOfWeek = new Date(2026, 3, day).getDay();
        let status = "Present";
        let checkIn = "08:58 AM";
        let checkOut = "06:02 PM";
        let hours = "9h 04m";

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          status = "Weekend";
          checkIn = "--:--";
          checkOut = "--:--";
          hours = "0h 00m";
        } else if (day === 3) {
          status = "Holiday";
          checkIn = "--:--";
          checkOut = "--:--";
          hours = "0h 00m";
        } else if (day === 10 && index % 2 === 0) {
          status = "Leave";
          checkIn = "--:--";
          checkOut = "--:--";
          hours = "0h 00m";
        } else if (day % 5 === 0 && index % 3 === 0) {
          status = "Late";
          checkIn = "09:24 AM";
          checkOut = "06:15 PM";
          hours = "8h 51m";
        }

        const loc = index % 3 === 0 ? "Branch Office" : index % 5 === 0 ? "Remote" : "HQ Office";
        const shiftVal = index % 4 === 0 ? "Evening" : index % 7 === 0 ? "Night" : "Morning";

        generated.push({
          id: `ATT-${1000 + index * 30 + day}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeAvatar: emp.avatar,
          department: emp.department,
          date: `Apr ${dayStr}, 2026`,
          status,
          checkIn,
          checkOut,
          hours,
          location: loc,
          shift: shiftVal,
          notes: "Automated pre-populated record",
        });
      }
    });
    return generated;
  }

  public static getAttendanceRecords(orgId?: string): AttendanceRecord[] {
    const key = getTenantKey(orgId, "attendance_records");
    const local = localStorage.getItem(key);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Failed to parse attendance records from storage", e);
      }
    }
    const initial = this.generateInitialRecords();
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }

  public static saveAttendanceRecords(records: AttendanceRecord[], orgId?: string): void {
    const key = getTenantKey(orgId, "attendance_records");
    localStorage.setItem(key, JSON.stringify(records));
  }

  public static createAttendanceRecord(record: AttendanceRecord, orgId?: string): AttendanceRecord {
    const records = this.getAttendanceRecords(orgId);
    const updated = [record, ...records];
    this.saveAttendanceRecords(updated, orgId);
    return record;
  }

  public static updateAttendanceRecord(record: AttendanceRecord, orgId?: string): AttendanceRecord {
    const records = this.getAttendanceRecords(orgId);
    const updated = records.map((r) => (r.id === record.id ? record : r));
    this.saveAttendanceRecords(updated, orgId);
    return record;
  }

  public static deleteAttendanceRecord(id: string, orgId?: string): boolean {
    const records = this.getAttendanceRecords(orgId);
    const updated = records.filter((r) => r.id !== id);
    this.saveAttendanceRecords(updated, orgId);
    return true;
  }

  public static getAttendanceCorrections(orgId?: string): AttendanceCorrectionRequest[] {
    const key = getTenantKey(orgId, "attendance_corrections");
    const local = localStorage.getItem(key);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Failed to parse attendance corrections", e);
      }
    }
    return [];
  }

  public static requestAttendanceCorrection(
    req: Omit<AttendanceCorrectionRequest, "id" | "status" | "submittedAt">,
    orgId?: string
  ): AttendanceCorrectionRequest {
    const corrections = this.getAttendanceCorrections(orgId);
    const newCorrection: AttendanceCorrectionRequest = {
      ...req,
      id: `CORR-${Date.now()}`,
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    };
    const updated = [newCorrection, ...corrections];
    const key = getTenantKey(orgId, "attendance_corrections");
    localStorage.setItem(key, JSON.stringify(updated));
    return newCorrection;
  }

  public static approveAttendanceCorrection(
    correctionId: string,
    approverName: string = "Manager",
    orgId?: string
  ): { success: boolean; record?: AttendanceRecord } {
    const corrections = this.getAttendanceCorrections(orgId);
    const target = corrections.find((c) => c.id === correctionId);
    if (!target) return { success: false };

    target.status = "APPROVED";
    target.approvedBy = approverName;

    const keyCorr = getTenantKey(orgId, "attendance_corrections");
    localStorage.setItem(keyCorr, JSON.stringify(corrections));

    // Update the corresponding attendance record
    const records = this.getAttendanceRecords(orgId);
    const recordIndex = records.findIndex((r) => r.id === target.recordId);
    if (recordIndex !== -1) {
      const rec = records[recordIndex];
      // Format 12-hour display checkIn/checkOut
      const to12h = (t: string) => {
        if (!t) return "--:--";
        const [hStr, mStr] = t.split(":");
        let h = parseInt(hStr);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h < 10 ? `0${h}` : h}:${mStr} ${ampm}`;
      };

      const checkInDisp = to12h(target.correctedCheckIn);
      const checkOutDisp = to12h(target.correctedCheckOut);

      // Compute hours
      const [inH, inM] = target.correctedCheckIn.split(":").map(Number);
      const [outH, outM] = target.correctedCheckOut.split(":").map(Number);
      let diffMins = outH * 60 + outM - (inH * 60 + inM);
      if (diffMins < 0) diffMins += 24 * 60;
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      const hoursDisp = `${hrs}h ${mins < 10 ? `0${mins}` : mins}m`;

      const updatedRecord: AttendanceRecord = {
        ...rec,
        checkIn: checkInDisp,
        checkOut: checkOutDisp,
        hours: hoursDisp,
        notes: `Corrected via request ${target.id}: ${target.reason}`,
      };

      records[recordIndex] = updatedRecord;
      this.saveAttendanceRecords(records, orgId);
      return { success: true, record: updatedRecord };
    }

    return { success: true };
  }

  public static rejectAttendanceCorrection(
    correctionId: string,
    reason: string = "Request declined",
    orgId?: string
  ): boolean {
    const corrections = this.getAttendanceCorrections(orgId);
    const target = corrections.find((c) => c.id === correctionId);
    if (!target) return false;

    target.status = "REJECTED";
    target.rejectedReason = reason;

    const keyCorr = getTenantKey(orgId, "attendance_corrections");
    localStorage.setItem(keyCorr, JSON.stringify(corrections));
    return true;
  }

  public static getSuperAdminSettings(orgId?: string): SuperAdminAttendanceSettings {
    const key = getTenantKey(orgId, "attendance_settings");
    const local = localStorage.getItem(key);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error("Failed to parse super admin attendance settings", e);
      }
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSuperAdminSettings(
    settings: Partial<SuperAdminAttendanceSettings>,
    orgId?: string
  ): SuperAdminAttendanceSettings {
    const current = this.getSuperAdminSettings(orgId);
    const updated = { ...current, ...settings };
    const key = getTenantKey(orgId, "attendance_settings");
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  }
}
