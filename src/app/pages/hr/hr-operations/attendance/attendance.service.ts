// ─── Attendance Data Service ─────────────────────────────────────────
import type {
  AttendanceRecord,
  AttendanceFilter,
  KPIMetrics,
  AttendanceDevice,
  AttendanceCorrection,
  LeaveOnDay,
  DepartmentAttendance,
  LocationAttendance,
} from "./attendance.types";
import {
  employees,
  departments,
  attendanceCalendar,
  dailyLogs,
} from "../../../../data/mockData";

const RECORDS_KEY = "viyan_attendance_records:v1";
const DEVICES_KEY = "viyan_attendance_devices:v1";
const CORRECTIONS_KEY = "viyan_attendance_corrections:v1";

// ─── Month/Date Helpers ──────────────────────────────────────────────

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  Present: { bg: "rgba(16, 185, 129, 0.1)", color: "#10B981", label: "Present" },
  Absent: { bg: "rgba(239, 68, 68, 0.1)", color: "#EF4444", label: "Absent" },
  Late: { bg: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", label: "Late" },
  "Half-day": { bg: "rgba(234, 179, 8, 0.1)", color: "#EAB308", label: "Half-day" },
  WFH: { bg: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", label: "WFH" },
  Leave: { bg: "rgba(167, 139, 250, 0.1)", color: "#A78BFA", label: "Leave" },
  Holiday: { bg: "rgba(20, 184, 166, 0.1)", color: "#14B8A6", label: "Holiday" },
  Weekend: { bg: "transparent", color: "var(--muted-foreground)", label: "Weekend" },
};

export const LEGEND_ITEMS = [
  { label: "Present", color: "#10B981" },
  { label: "Absent", color: "#EF4444" },
  { label: "Late", color: "#F59E0B" },
  { label: "Leave", color: "#A78BFA" },
  { label: "Holiday", color: "#14B8A6" },
  { label: "Weekend", color: "#94A3B8" },
];

export const LOCATIONS = ["HQ Office", "Branch Office", "Remote"];
export const SHIFTS = ["Morning", "Evening", "Night"];
export const LEAVE_TYPES = [
  "Casual Leave", "Sick Leave", "Earned Leave", "Comp Off",
  "Loss of Pay", "Work From Home", "Permission",
];

// ─── Date Formatting ─────────────────────────────────────────────────

export function formatDate(day: number, month: number, year: number): string {
  const monthStr = MONTH_SHORT[month] || "";
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  return `${monthStr} ${dayStr}, ${year}`;
}

export function convertToInputDate(dateStr: string): string {
  const parts = dateStr.replace(",", "").split(" ");
  if (parts.length < 3) return "";
  const monthIdx = MONTH_NAMES.findIndex((m) => m.startsWith(parts[0]));
  if (monthIdx === -1) return "";
  const monthStr = monthIdx + 1 < 10 ? `0${monthIdx + 1}` : `${monthIdx + 1}`;
  return `${parts[2]}-${monthStr}-${parts[1]}`;
}

export function convertToDisplayDate(inputDate: string): string {
  const parts = inputDate.split("-");
  if (parts.length < 3) return "";
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);
  const dayStr = day < 10 ? `0${day}` : `${day}`;
  return `${MONTH_SHORT[month]} ${dayStr}, ${parts[0]}`;
}

export function to12Hour(time24: string): string {
  if (!time24) return "";
  const [hoursStr, minutesStr] = time24.split(":");
  const hours = parseInt(hoursStr);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const dh = displayHours < 10 ? `0${displayHours}` : `${displayHours}`;
  return `${dh}:${minutesStr} ${ampm}`;
}

export function to24Hour(time12: string): string {
  if (!time12) return "";
  const parts = time12.split(" ");
  if (parts.length < 2) return "";
  const [hoursStr, minutesStr] = parts[0].split(":");
  let hours = parseInt(hoursStr);
  if (parts[1] === "PM" && hours < 12) hours += 12;
  if (parts[1] === "AM" && hours === 12) hours = 0;
  const h24 = hours < 10 ? `0${hours}` : `${hours}`;
  return `${h24}:${minutesStr}`;
}

export function calculateHours(checkIn: string, checkOut: string, status: string): string {
  if (["Absent", "Leave", "Holiday", "Weekend"].includes(status)) return "0h 00m";
  if (!checkIn || !checkOut) return "8h 00m";
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  let diffMins = outH * 60 + outM - (inH * 60 + inM);
  if (diffMins < 0) diffMins += 24 * 60;
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hrs}h ${mins < 10 ? "0" : ""}${mins}m`;
}

// ─── Records CRUD ────────────────────────────────────────────────────

export function loadRecords(): AttendanceRecord[] {
  const local = localStorage.getItem(RECORDS_KEY);
  if (local) {
    try { return JSON.parse(local); } catch { /* ignore */ }
  }
  // Generate from mock data
  const generated: AttendanceRecord[] = [];
  dailyLogs.forEach((log, index) => {
    const emp = employees[index % employees.length] || employees[0];
    generated.push({
      id: `ATT-${1000 + index}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      department: emp.department,
      date: log.date,
      status: log.status,
      checkIn: log.checkIn,
      checkOut: log.checkOut,
      hours: log.hours,
      notes: "Initial pre-populated system record",
      location: LOCATIONS[index % LOCATIONS.length],
      shift: SHIFTS[index % SHIFTS.length],
      overtime: "0h 00m",
    });
  });
  localStorage.setItem(RECORDS_KEY, JSON.stringify(generated));
  return generated;
}

export function saveRecords(records: AttendanceRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// ─── KPI Calculation ─────────────────────────────────────────────────

export function calculateKPIMetrics(month: number, year: number): KPIMetrics {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let weekdays = 0;
  let weekendDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month, d).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      weekdays++;
    }
  }

  // Festival holidays — from mock data or configurable
  const festivalHolidays = getFestivalHolidaysForMonth(month, year);

  return {
    weekdays,
    weekendHolidays: weekendDays,
    festivalHolidays: festivalHolidays.length,
    workingDays: weekdays - festivalHolidays.length,
  };
}

export function getFestivalHolidaysForMonth(month: number, year: number): { day: number; name: string }[] {
  // Default holidays — Super Admin configurable
  const allHolidays: Record<string, { day: number; name: string }[]> = {
    "0": [{ day: 1, name: "New Year's Day" }],
    "1": [],
    "2": [],
    "3": [{ day: 21, name: "Easter Monday" }, { day: 14, name: "Ambedkar Jayanti" }],
    "4": [{ day: 1, name: "May Day" }],
    "5": [],
    "6": [{ day: 4, name: "Independence Day" }],
    "7": [{ day: 15, name: "Independence Day" }],
    "8": [],
    "9": [{ day: 2, name: "Gandhi Jayanti" }],
    "10": [{ day: 1, name: "Diwali" }],
    "11": [{ day: 25, name: "Christmas" }],
  };

  const stored = localStorage.getItem("viyan_festival_holidays:v1");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const key = `${year}-${month}`;
      if (parsed[key]) return parsed[key];
    } catch { /* ignore */ }
  }

  return allHolidays[String(month)] || [];
}

// ─── Calendar Helpers ────────────────────────────────────────────────

export function getCalendarDays(month: number, year: number): (number | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() returns 0=Sun, we want Mon=0, so adjust
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1; // Convert to Mon-based

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export function getDayStatus(
  day: number,
  month: number,
  year: number,
  records: AttendanceRecord[],
  selectedEmpId: string,
  endDay: number,
): string {
  const dayOfWeek = new Date(year, month, day).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  if (isWeekend) return "Weekend";
  if (day > endDay) return "Future";

  // Check festival holidays
  const holidays = getFestivalHolidaysForMonth(month, year);
  if (holidays.some((h) => h.day === day)) return "Holiday";

  const dateStr = formatDate(day, month, year);
  const rec = records.find((r) => {
    const matchesDate = r.date === dateStr;
    if (selectedEmpId !== "All Employees") {
      return matchesDate && r.employeeId === selectedEmpId;
    }
    return matchesDate;
  });

  if (rec) return rec.status;

  // Fallback to mock calendar for April 2026
  if (month === 3 && year === 2026) {
    return (attendanceCalendar as Record<number, string>)[day] || "Present";
  }

  return "Absent";
}

// ─── Filtering ───────────────────────────────────────────────────────

export function filterRecords(
  records: AttendanceRecord[],
  filter: AttendanceFilter,
  startDate: Date,
  endDate: Date,
): AttendanceRecord[] {
  return records.filter((log) => {
    if (filter.department !== "All Departments" && log.department !== filter.department) return false;
    if (filter.employeeId !== "All Employees" && log.employeeId !== filter.employeeId) return false;
    if (filter.status !== "All Statuses" && log.status !== filter.status) return false;
    if (filter.location !== "All Locations" && log.location !== filter.location) return false;
    if (filter.shift !== "All Shifts" && log.shift !== filter.shift) return false;

    if (filter.search) {
      const q = filter.search.toLowerCase();
      const nameMatch = log.employeeName.toLowerCase().includes(q);
      const deptMatch = log.department.toLowerCase().includes(q);
      const idMatch = log.employeeId.toLowerCase().includes(q);
      if (!nameMatch && !deptMatch && !idMatch) return false;
    }

    const logDate = new Date(log.date);
    return logDate >= startDate && logDate <= endDate;
  });
}

// ─── Analytics Data ──────────────────────────────────────────────────

export function calculateStatusDistribution(
  records: AttendanceRecord[],
  filter: AttendanceFilter,
  startDate: Date,
  endDate: Date,
): { name: string; value: number; color: string }[] {
  const filtered = filterRecords(records, filter, startDate, endDate);
  const total = filtered.length || 1;
  const counts = {
    Present: 0, Absent: 0, Late: 0, Leave: 0, Holiday: 0,
  };

  filtered.forEach((r) => {
    if (r.status === "Present" || r.status === "WFH") counts.Present++;
    else if (r.status === "Absent") counts.Absent++;
    else if (r.status === "Late") counts.Late++;
    else if (r.status === "Leave") counts.Leave++;
    else if (r.status === "Holiday") counts.Holiday++;
  });

  return [
    { name: "Present", value: Math.round((counts.Present / total) * 100), color: "#10B981" },
    { name: "Absent", value: Math.round((counts.Absent / total) * 100), color: "#EF4444" },
    { name: "Late", value: Math.round((counts.Late / total) * 100), color: "#F59E0B" },
    { name: "Leave", value: Math.round((counts.Leave / total) * 100), color: "#A78BFA" },
    { name: "Holiday", value: Math.round((counts.Holiday / total) * 100), color: "#14B8A6" },
  ];
}

export function calculateDepartmentAttendance(
  records: AttendanceRecord[],
  filter: AttendanceFilter,
  startDate: Date,
  endDate: Date,
): DepartmentAttendance[] {
  const filtered = filterRecords(
    records,
    { ...filter, department: "All Departments" },
    startDate, endDate,
  );

  const deptMap: Record<string, { present: number; total: number }> = {};
  departments.forEach((d) => { deptMap[d.name] = { present: 0, total: 0 }; });

  filtered.forEach((r) => {
    if (!deptMap[r.department]) deptMap[r.department] = { present: 0, total: 0 };
    deptMap[r.department].total++;
    if (r.status === "Present" || r.status === "WFH" || r.status === "Late") {
      deptMap[r.department].present++;
    }
  });

  // Add mock data for departments without records
  return departments.map((d) => {
    const data = deptMap[d.name] || { present: 0, total: 0 };
    const total = data.total || 1;
    // Use mock percentages if no real data
    const mockPercentages: Record<string, number> = {
      Engineering: 96, Marketing: 92, Design: 94, Finance: 95,
      HR: 98, Product: 93, Sales: 89, Operations: 91,
    };
    return {
      department: d.name,
      percentage: data.total > 0 ? Math.round((data.present / total) * 100) : (mockPercentages[d.name] || 90),
      present: data.present || Math.round((mockPercentages[d.name] || 90) * d.employees / 100),
      total: data.total || d.employees,
    };
  });
}

export function calculateLocationAttendance(
  records: AttendanceRecord[],
  filter: AttendanceFilter,
  startDate: Date,
  endDate: Date,
): LocationAttendance[] {
  const filtered = filterRecords(
    records,
    { ...filter, location: "All Locations" },
    startDate, endDate,
  );

  const locMap: Record<string, { employees: Set<string>; present: number; absent: number; late: number }> = {};
  LOCATIONS.forEach((loc) => {
    locMap[loc] = { employees: new Set(), present: 0, absent: 0, late: 0 };
  });

  filtered.forEach((r) => {
    const loc = r.location || "HQ Office";
    if (!locMap[loc]) locMap[loc] = { employees: new Set(), present: 0, absent: 0, late: 0 };
    locMap[loc].employees.add(r.employeeId);
    if (r.status === "Present" || r.status === "WFH") locMap[loc].present++;
    else if (r.status === "Absent") locMap[loc].absent++;
    else if (r.status === "Late") locMap[loc].late++;
  });

  return LOCATIONS.map((loc) => {
    const data = locMap[loc];
    const total = data.present + data.absent + data.late || 1;
    // Provide mock data if empty
    const empCount = data.employees.size || (loc === "HQ Office" ? 120 : loc === "Branch Office" ? 45 : 30);
    return {
      location: loc,
      employees: empCount,
      present: data.present || Math.round(empCount * 0.88),
      absent: data.absent || Math.round(empCount * 0.05),
      late: data.late || Math.round(empCount * 0.07),
      percentage: data.present > 0 ? Math.round((data.present / total) * 100) : (loc === "HQ Office" ? 94 : loc === "Branch Office" ? 91 : 88),
    };
  });
}

export function getMonthlyTrendData(
  records: AttendanceRecord[],
  month: number,
  year: number,
  filter: AttendanceFilter,
): { day: string; present: number; absent: number; late: number; leave: number }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const currentDay = (today.getFullYear() === year && today.getMonth() === month)
    ? today.getDate()
    : daysInMonth;

  const data: { day: string; present: number; absent: number; late: number; leave: number }[] = [];

  // Group by week for cleaner chart
  const weeks = Math.ceil(currentDay / 7);
  for (let w = 0; w < weeks; w++) {
    const startDay = w * 7 + 1;
    const endDay = Math.min((w + 1) * 7, currentDay);
    let p = 0, a = 0, l = 0, lv = 0, total = 0;

    for (let d = startDay; d <= endDay; d++) {
      const dayOfWeek = new Date(year, month, d).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      total++;
      const dateStr = formatDate(d, month, year);
      const rec = records.find((r) => {
        const matchDate = r.date === dateStr;
        if (filter.employeeId !== "All Employees") return matchDate && r.employeeId === filter.employeeId;
        return matchDate;
      });

      const status = rec?.status || ((month === 3 && year === 2026) ? ((attendanceCalendar as Record<number, string>)[d] || "Present") : "Present");
      if (status === "Present" || status === "WFH") p++;
      else if (status === "Absent") a++;
      else if (status === "Late") l++;
      else if (status === "Leave") lv++;
    }

    const t = total || 1;
    data.push({
      day: `Week ${w + 1}`,
      present: Math.round((p / t) * 100),
      absent: Math.round((a / t) * 100),
      late: Math.round((l / t) * 100),
      leave: Math.round((lv / t) * 100),
    });
  }

  // If no real data, return mock
  if (data.every((d) => d.present === 0 && d.absent === 0)) {
    return [
      { day: "Week 1", present: 94, absent: 2, late: 3, leave: 1 },
      { day: "Week 2", present: 92, absent: 3, late: 4, leave: 1 },
      { day: "Week 3", present: 96, absent: 1, late: 2, leave: 1 },
      { day: "Week 4", present: 91, absent: 4, late: 3, leave: 2 },
    ];
  }

  return data;
}

// ─── Leave on Day ────────────────────────────────────────────────────

export function getLeavesOnDay(day: number, month: number, year: number): LeaveOnDay[] {
  // Mock leave data for demonstration
  if (month === 3 && year === 2026) {
    if (day === 15 || day === 16) {
      return [
        {
          employeeId: "EMP001", employeeName: "Sarah Johnson",
          employeeAvatar: employees[0]?.avatar,
          leaveType: "Sick Leave", duration: "Full Day", status: "Approved", reason: "Medical appointment",
        },
        {
          employeeId: "EMP004", employeeName: "James Carter",
          employeeAvatar: employees[3]?.avatar,
          leaveType: "Casual Leave", duration: "Half Day", status: "Approved", reason: "Personal errands",
        },
      ];
    }
    if (day === 10) {
      return [
        {
          employeeId: "EMP002", employeeName: "Marcus Williams",
          employeeAvatar: employees[1]?.avatar,
          leaveType: "Work From Home", duration: "Full Day", status: "Approved", reason: "Remote work",
        },
      ];
    }
  }
  return [];
}

// ─── Device Management ───────────────────────────────────────────────

export function loadDevices(): AttendanceDevice[] {
  const stored = localStorage.getItem(DEVICES_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  // Default demo devices
  const defaults: AttendanceDevice[] = [
    {
      id: "DEV-001", name: "Main Entrance Biometric", type: "Biometric",
      deviceId: "BIO-100", location: "HQ Office", ipAddress: "192.168.1.100",
      port: "4370", apiEndpoint: "/api/v1/attendance", syncInterval: 5,
      status: "Disconnected", lastSync: "Not synced",
    },
    {
      id: "DEV-002", name: "Floor 2 Face Reader", type: "Face Recognition",
      deviceId: "FR-200", location: "HQ Office", ipAddress: "192.168.1.101",
      port: "4370", apiEndpoint: "/api/v1/attendance", syncInterval: 10,
      status: "Disabled",
    },
  ];
  localStorage.setItem(DEVICES_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveDevices(devices: AttendanceDevice[]): void {
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
}

// ─── Corrections ─────────────────────────────────────────────────────

export function loadCorrections(): AttendanceCorrection[] {
  const stored = localStorage.getItem(CORRECTIONS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  return [];
}

export function saveCorrections(corrections: AttendanceCorrection[]): void {
  localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(corrections));
}

// ─── Export Utilities ────────────────────────────────────────────────

export function exportToCSV(records: AttendanceRecord[], filename: string): void {
  const header = "Employee,Department,Date,Status,Punch In,Punch Out,Working Hours,Location,Shift\n";
  const rows = records.map((r) =>
    `"${r.employeeName}","${r.department}","${r.date}","${r.status}","${r.checkIn}","${r.checkOut}","${r.hours}","${r.location || "HQ Office"}","${r.shift || "Morning"}"`
  ).join("\n");

  downloadFile(header + rows, filename, "text/csv;charset=utf-8;");
}

export function exportToExcel(records: AttendanceRecord[], filename: string): void {
  // Tab-separated values with .xls extension — opens in Excel
  const header = "Employee\tDepartment\tDate\tStatus\tPunch In\tPunch Out\tWorking Hours\tLocation\tShift\n";
  const rows = records.map((r) =>
    `${r.employeeName}\t${r.department}\t${r.date}\t${r.status}\t${r.checkIn}\t${r.checkOut}\t${r.hours}\t${r.location || "HQ Office"}\t${r.shift || "Morning"}`
  ).join("\n");

  downloadFile(header + rows, filename, "application/vnd.ms-excel;charset=utf-8;");
}

export function exportToPDF(): void {
  window.print();
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Re-export employees/departments for component use
export { employees, departments };
