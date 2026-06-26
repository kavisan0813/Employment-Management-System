import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { showToast } from "../components/workflow/ToastNotification";

export type AttendanceLog = {
  time: string;
  action: string;
  type: "in" | "out" | "break_start" | "break_end";
};

type PunchState = {
  isPunchedIn: boolean;
  isOnBreak: boolean;
  punchInTime: string | null;
  punchInTimestamp: number | null;
  punchOutTime: string | null;
  workedHours: string | null;
  dateStr: string | null;
  logs: AttendanceLog[];
};

type AttendanceContextType = {
  punchState: PunchState;
  handlePunchIn: () => void;
  handlePunchOut: () => void;
  handleStartBreak: () => void;
  handleEndBreak: () => void;
  handleResetPunch: () => void;
  getPunchStateForEmail: (email: string) => PunchState | null;
};

const defaultPunchState: PunchState = {
  isPunchedIn: false,
  isOnBreak: false,
  punchInTime: null,
  punchInTimestamp: null,
  punchOutTime: null,
  workedHours: null,
  dateStr: null,
  logs: [],
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined,
);

export function AttendanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [punchState, setPunchState] = useState<PunchState>(defaultPunchState);

  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`nexus_punch_${user.email}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const todayStr = new Date().toLocaleDateString();
          if (parsed.dateStr === todayStr || !parsed.dateStr) {
            setPunchState(parsed);
          } else {
            localStorage.removeItem(`nexus_punch_${user.email}`);
            setPunchState(defaultPunchState);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setPunchState(defaultPunchState);
      }
    }
  }, [user?.email]);

  const handlePunchIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const timestamp = Date.now();
    const newState: PunchState = {
      isPunchedIn: true,
      isOnBreak: false,
      punchInTime: timeStr,
      punchInTimestamp: timestamp,
      punchOutTime: null,
      workedHours: null,
      dateStr: new Date().toLocaleDateString(),
      logs: [{ time: timeStr, action: "Swipe In (Web Portal)", type: "in" }],
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.setItem(
        `nexus_punch_${user.email}`,
        JSON.stringify(newState),
      );
    }
    showToast(
      "Punched In",
      "success",
      `Shift started successfully at ${timeStr}.`,
    );
  };

  const handlePunchOut = () => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const elapsedMs = Date.now() - (punchState.punchInTimestamp || Date.now());
    const elapsedSecs = Math.floor(elapsedMs / 1000);
    const elapsedMins = Math.floor(elapsedSecs / 60);

    let workedStr = "";
    if (elapsedMins < 1) {
      workedStr = `${elapsedSecs} seconds`;
    } else if (elapsedMins < 60) {
      workedStr = `${elapsedMins} mins`;
    } else {
      workedStr = `${(elapsedMs / (1000 * 60 * 60)).toFixed(2)} hours`;
    }

    const newState: PunchState = {
      ...punchState,
      isPunchedIn: false,
      isOnBreak: false,
      punchOutTime: timeStr,
      workedHours: workedStr,
      logs: [
        ...punchState.logs,
        { time: timeStr, action: "Swipe Out (End of Shift)", type: "out" },
      ],
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.setItem(
        `nexus_punch_${user.email}`,
        JSON.stringify(newState),
      );
    }
    showToast(
      "Punched Out",
      "success",
      `Shift completed at ${timeStr}. Duration: ${workedStr}`,
    );
  };

  const handleStartBreak = () => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newState: PunchState = {
      ...punchState,
      isOnBreak: true,
      logs: [
        ...punchState.logs,
        {
          time: timeStr,
          action: "Swipe Out (Lunch Break)",
          type: "break_start",
        },
      ],
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.setItem(
        `nexus_punch_${user.email}`,
        JSON.stringify(newState),
      );
    }
    showToast(
      "Break Started",
      "success",
      `Enjoy your break! Started at ${timeStr}.`,
    );
  };

  const handleEndBreak = () => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newState: PunchState = {
      ...punchState,
      isOnBreak: false,
      logs: [
        ...punchState.logs,
        { time: timeStr, action: "Swipe In (Back to Desk)", type: "break_end" },
      ],
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.setItem(
        `nexus_punch_${user.email}`,
        JSON.stringify(newState),
      );
    }
    showToast("Break Ended", "success", `Welcome back! Resumed at ${timeStr}.`);
  };

  const handleResetPunch = () => {
    setPunchState(defaultPunchState);
    if (user?.email) {
      localStorage.removeItem(`nexus_punch_${user.email}`);
    }
    showToast("Shift Reset", "info", "You can now punch in for a new shift.");
  };

  const getPunchStateForEmail = (email: string) => {
    const saved = localStorage.getItem(`nexus_punch_${email}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const todayStr = new Date().toLocaleDateString();
        if (parsed.dateStr === todayStr || !parsed.dateStr) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  };

  return (
    <AttendanceContext.Provider
      value={{
        punchState,
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
