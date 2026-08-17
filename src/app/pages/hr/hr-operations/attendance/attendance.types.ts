// ─── Attendance Module Types ─────────────────────────────────────────

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  date: string; // "Apr 01, 2026"
  status: string;
  checkIn: string; // "08:58 AM"
  checkOut: string; // "06:02 PM"
  hours: string; // "9h 04m"
  notes?: string;
  punchIn?: string;
  punchOut?: string;
  logs?: AttendanceLog[];
  location?: string;
  shift?: string;
  overtime?: string;
}

export interface AttendanceLog {
  time: string;
  action: string;
  type: "in" | "out" | "break_start" | "break_end";
}

export interface AttendanceFilter {
  month: number;
  year: number;
  department: string;
  employeeId: string;
  location: string;
  status: string;
  shift: string;
  search: string;
}

export interface KPIMetrics {
  weekdays: number;
  weekendHolidays: number;
  festivalHolidays: number;
  workingDays: number;
}

export interface AttendanceDevice {
  id: string;
  name: string;
  type: "Biometric" | "Fingerprint" | "Face Recognition" | "RFID" | "Access Control";
  deviceId: string;
  location: string;
  ipAddress: string;
  port: string;
  apiEndpoint: string;
  syncInterval: number; // minutes
  status: "Connected" | "Disconnected" | "Syncing" | "Error" | "Disabled";
  lastSync?: string;
}

export interface AttendanceCorrection {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  currentStatus: string;
  currentPunchIn: string;
  currentPunchOut: string;
  correctedPunchIn: string;
  correctedPunchOut: string;
  reason: string;
  supportingDoc?: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
  reviewedBy?: string;
}

export interface LeaveOnDay {
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  leaveType: string;
  duration: "Full Day" | "Half Day" | "Permission";
  status: "Approved" | "Pending" | "Rejected";
  reason?: string;
}

export interface DepartmentAttendance {
  department: string;
  percentage: number;
  present: number;
  total: number;
}

export interface LocationAttendance {
  location: string;
  employees: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface AttendanceConfig {
  workingHours: number;
  gracePeriod: number;
  lateThreshold: number;
  earlyCheckoutThreshold: number;
  halfDayThreshold: number;
  minimumWorkingHours: number;
  weekendDays: number[]; // 0=Sun, 6=Sat
}

export type SortDirection = "asc" | "desc";
export interface SortConfig {
  key: string;
  direction: SortDirection;
}
