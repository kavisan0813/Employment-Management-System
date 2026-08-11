import { employees as initialEmployees } from "../data/mockData";

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
  const savedEmps = localStorage.getItem("viyan_employees:v1");
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
