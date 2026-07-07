import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { showToast } from "../components/workflow/ToastNotification";
import { employees as initialEmployees } from "../data/mockData";

export type AttendanceLog = {
  time: string;
  action: string;
  type: "in" | "out" | "break_start" | "break_end";
};

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  date: string; // e.g. "Apr 01, 2026"
  status: string; // "Present" | "Late" | "Absent" | "Leave" | "Weekend" | "Holiday"
  checkIn: string; // e.g. "08:58 AM"
  checkOut: string; // e.g. "06:02 PM"
  hours: string; // e.g. "9h 04m"
  notes?: string;
  punchIn?: string; // ISO timestamp
  punchOut?: string; // ISO timestamp
  logs?: AttendanceLog[];
}

export type DerivedPunchState = "not-punched" | "punched-in" | "punched-out";

export type CompatiblePunchState = {
  isPunchedIn: boolean;
  isOnBreak: boolean;
  punchInTime: string | null;
  punchOutTime: string | null;
  workedHours: string | null;
  logs: AttendanceLog[];
};

type AttendanceContextType = {
  records: AttendanceRecord[];
  todayRecord: AttendanceRecord | null;
  derivedState: DerivedPunchState;
  isOnBreak: boolean;
  handlePunchIn: () => void;
  handlePunchOut: () => void;
  handleStartBreak: () => void;
  handleEndBreak: () => void;
  handleResetPunch: () => void;
  getPunchStateForEmail: (email: string) => CompatiblePunchState | null;
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined,
);

// Constants for late derivation
export const SHIFT_START = "09:30";
export const GRACE_MINUTES = 15;

// Helper to format ISO strings to 12-hour (e.g. "09:32 AM")
export const formatTime12Hour = (isoString: string | undefined): string => {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.log(e);

    return "-";
  }
};

// Helper to format Date into HR format (e.g. "Apr 06, 2026")
export const getTodayHRDateStr = (): string => {
  const date = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthStr = months[date.getMonth()];
  const dayStr = String(date.getDate()).padStart(2, "0");
  return `${monthStr} ${dayStr}, ${date.getFullYear()}`;
};

// Helper to convert HR date string ("Apr 06, 2026") to Employee date string ("06 Apr 2026")
export const hrDateToEmployeeDate = (hrDate: string): string => {
  const parts = hrDate.replace(",", "").split(" ");
  if (parts.length < 3) return hrDate;
  const month = parts[0];
  const day = parts[1];
  const year = parts[2];
  return `${day} ${month} ${year}`;
};

// Helper to check if punch-in time is late
export const isPunchInLate = (punchInISO: string): boolean => {
  const punchDate = new Date(punchInISO);
  const [shiftHours, shiftMins] = SHIFT_START.split(":").map(Number);

  const shiftTime = new Date(punchDate);
  shiftTime.setHours(shiftHours, shiftMins, 0, 0);

  const diffMs = punchDate.getTime() - shiftTime.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  return diffMins > GRACE_MINUTES;
};

// Find employee record by email only (case-insensitive)
export const findEmployeeByEmail = (email: string | undefined) => {
  if (!email) return null;
  const lowerEmail = email.toLowerCase();

  // 1. Check local storage first
  const savedEmps = localStorage.getItem("nexus_employees");
  if (savedEmps) {
    try {
      const emps = JSON.parse(savedEmps);
      const match = emps.find(
        (e: { email?: string }) => e.email?.toLowerCase() === lowerEmail,
      );
      if (match) return match;
    } catch (e) {
      console.error("Failed to parse local employees", e);
    }
  }

  // 2. Fallback to initial mock data
  const match = initialEmployees.find(
    (e: { email?: string }) => e.email?.toLowerCase() === lowerEmail,
  );
  return match || null;
};

export function AttendanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Load records from the shared HR local storage key
  useEffect(() => {
    const saved = localStorage.getItem("nexus_attendance_records");
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse HR attendance records", e);
      }
    }
  }, []);

  // Sync records helper
  const saveRecords = (newRecords: AttendanceRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(
      "nexus_attendance_records",
      JSON.stringify(newRecords),
    );
  };

  // Resolve today's record for the logged-in user
  const todayRecord = useMemo(() => {
    if (!user) return null;
    const emp = findEmployeeByEmail(user.email);
    if (!emp) return null;
    const todayStr = getTodayHRDateStr();
    return (
      records.find((r) => r.employeeId === emp.id && r.date === todayStr) ||
      null
    );
  }, [records, user]);

  // Derived state from todayRecord
  const derivedState = useMemo<DerivedPunchState>(() => {
    if (!todayRecord) return "not-punched";
    if (todayRecord.punchIn && !todayRecord.punchOut) return "punched-in";
    if (todayRecord.punchIn && todayRecord.punchOut) return "punched-out";
    return "not-punched";
  }, [todayRecord]);

  // Load break state
  const [isOnBreak, setIsOnBreak] = useState<boolean>(() => {
    if (user?.email) {
      const savedBreak = localStorage.getItem(`nexus_on_break_${user.email}`);
      return savedBreak === "true";
    }
    return false;
  });

  // Sync break state
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`nexus_on_break_${user.email}`, String(isOnBreak));
    }
  }, [isOnBreak, user]);

  const handlePunchIn = () => {
    if (!user) return;

    const emp = findEmployeeByEmail(user.email);
    if (!emp) {
      showToast("Error", "error", "No employee record linked to your account");
      return;
    }

    const todayStr = getTodayHRDateStr();

    // Guard: already punched in
    if (todayRecord && todayRecord.punchIn) {
      showToast(
        "Already Punched In",
        "warning",
        "You have already punched in for today.",
      );
      return;
    }

    const now = new Date();
    const punchInISO = now.toISOString();
    const timeStr = formatTime12Hour(punchInISO);

    const isLate = isPunchInLate(punchInISO);
    const status = isLate ? "Late" : "Present";

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar || "",
      department: emp.department || "",
      date: todayStr,
      status: status,
      checkIn: timeStr,
      checkOut: "-",
      hours: "-",
      punchIn: punchInISO,
      logs: [
        {
          time: timeStr,
          action: "Swipe In (Web Portal)",
          type: "in",
        },
      ],
    };

    const updatedRecords = [...records, newRecord];
    saveRecords(updatedRecords);

    showToast(
      "Punched In",
      "success",
      `Shift started successfully at ${timeStr}.`,
    );
  };

  const handlePunchOut = () => {
    if (!user) return;

    const emp = findEmployeeByEmail(user.email);
    if (!emp) {
      showToast("Error", "error", "No employee record linked to your account");
      return;
    }

    if (!todayRecord || !todayRecord.punchIn) {
      showToast(
        "Cannot Punch Out",
        "error",
        "No active punch-in record found for today.",
      );
      return;
    }

    if (todayRecord.punchOut) {
      showToast(
        "Already Punched Out",
        "warning",
        "You have already punched out for today.",
      );
      return;
    }

    const now = new Date();
    const punchOutISO = now.toISOString();
    const timeStr = formatTime12Hour(punchOutISO);

    // Calculate worked hours
    const diffMs = now.getTime() - new Date(todayRecord.punchIn).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    const hoursStr = `${hrs}h ${String(mins).padStart(2, "0")}m`;

    const updatedRecord: AttendanceRecord = {
      ...todayRecord,
      punchOut: punchOutISO,
      checkOut: timeStr,
      hours: hoursStr,
      logs: [
        ...(todayRecord.logs || []),
        {
          time: timeStr,
          action: "Swipe Out (End of Shift)",
          type: "out",
        },
      ],
    };

    const updatedRecords = records.map((r) =>
      r.employeeId === emp.id && r.date === todayRecord.date
        ? updatedRecord
        : r,
    );

    saveRecords(updatedRecords);
    setIsOnBreak(false); // Clear break on punch out

    showToast(
      "Punched Out",
      "success",
      `Shift completed at ${timeStr}. Duration: ${hoursStr}`,
    );
  };

  const handleStartBreak = () => {
    if (!user) return;

    const emp = findEmployeeByEmail(user.email);
    if (!emp) {
      showToast("Error", "error", "No employee record linked to your account");
      return;
    }

    if (!todayRecord || !todayRecord.punchIn || todayRecord.punchOut) {
      showToast("Error", "error", "Must be punched in to take a break.");
      return;
    }

    const now = new Date();
    const timeStr = formatTime12Hour(now.toISOString());

    const updatedRecord: AttendanceRecord = {
      ...todayRecord,
      logs: [
        ...(todayRecord.logs || []),
        {
          time: timeStr,
          action: "Swipe Out (Lunch Break)",
          type: "break_start",
        },
      ],
    };

    const updatedRecords = records.map((r) =>
      r.employeeId === emp.id && r.date === todayRecord.date
        ? updatedRecord
        : r,
    );

    saveRecords(updatedRecords);
    setIsOnBreak(true);

    showToast(
      "Break Started",
      "success",
      `Enjoy your break! Started at ${timeStr}.`,
    );
  };

  const handleEndBreak = () => {
    if (!user) return;

    const emp = findEmployeeByEmail(user.email);
    if (!emp) {
      showToast("Error", "error", "No employee record linked to your account");
      return;
    }

    if (
      !todayRecord ||
      !todayRecord.punchIn ||
      todayRecord.punchOut ||
      !isOnBreak
    ) {
      showToast("Error", "error", "Must be on break to resume work.");
      return;
    }

    const now = new Date();
    const timeStr = formatTime12Hour(now.toISOString());

    const updatedRecord: AttendanceRecord = {
      ...todayRecord,
      logs: [
        ...(todayRecord.logs || []),
        {
          time: timeStr,
          action: "Swipe In (Back to Desk)",
          type: "break_end",
        },
      ],
    };

    const updatedRecords = records.map((r) =>
      r.employeeId === emp.id && r.date === todayRecord.date
        ? updatedRecord
        : r,
    );

    saveRecords(updatedRecords);
    setIsOnBreak(false);

    showToast("Break Ended", "success", `Welcome back! Resumed at ${timeStr}.`);
  };

  const handleResetPunch = () => {
    if (!user) return;

    const emp = findEmployeeByEmail(user.email);
    if (!emp) {
      showToast("Error", "error", "No employee record linked to your account");
      return;
    }

    if (!todayRecord) return;

    const updatedRecords = records.filter(
      (r) => !(r.employeeId === emp.id && r.date === todayRecord.date),
    );

    saveRecords(updatedRecords);
    setIsOnBreak(false);

    showToast("Shift Reset", "info", "You can now punch in for a new shift.");
  };

  // Lookup for manager view compatibility
  const getPunchStateForEmail = (email: string) => {
    const emp = findEmployeeByEmail(email);
    if (!emp) return null;

    const todayStr = getTodayHRDateStr();
    const record = records.find(
      (r) => r.employeeId === emp.id && r.date === todayStr,
    );
    if (!record) return null;

    const isPunchedIn = !!record.punchIn && !record.punchOut;

    let workedStr: string | null = null;
    if (record.punchIn) {
      const end = record.punchOut ? new Date(record.punchOut) : new Date();
      const diffMs = end.getTime() - new Date(record.punchIn).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      workedStr = `${hrs}h ${String(mins).padStart(2, "0")}m`;
    }

    return {
      isPunchedIn,
      isOnBreak:
        isOnBreak && email.toLowerCase() === user?.email?.toLowerCase(),
      punchInTime: formatTime12Hour(record.punchIn),
      punchOutTime: formatTime12Hour(record.punchOut),
      workedHours: workedStr,
      logs: record.logs || [],
    };
  };

  return (
    <AttendanceContext.Provider
      value={{
        records,
        todayRecord,
        derivedState,
        isOnBreak,
        handlePunchIn,
        handlePunchOut,
        handleStartBreak,
        handleEndBreak,
        handleResetPunch,
        getPunchStateForEmail,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}
