import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { showToast } from "../components/workflow/ToastNotification";

type PunchState = {
  isPunchedIn: boolean;
  punchInTime: string | null;
  punchInTimestamp: number | null;
  punchOutTime: string | null;
  workedHours: string | null;
  dateStr: string | null;
};

type AttendanceContextType = {
  punchState: PunchState;
  handlePunchIn: () => void;
  handlePunchOut: () => void;
  handleResetPunch: () => void;
  getPunchStateForEmail: (email: string) => PunchState | null;
};

const defaultPunchState: PunchState = {
  isPunchedIn: false,
  punchInTime: null,
  punchInTimestamp: null,
  punchOutTime: null,
  workedHours: null,
  dateStr: null,
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
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
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const timestamp = Date.now();
    const newState: PunchState = {
      isPunchedIn: true,
      punchInTime: timeStr,
      punchInTimestamp: timestamp,
      punchOutTime: null,
      workedHours: null,
      dateStr: new Date().toLocaleDateString(),
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.setItem(`nexus_punch_${user.email}`, JSON.stringify(newState));
    }
    showToast("Punched In", "success", `Shift started successfully at ${timeStr}.`);
  };

  const handlePunchOut = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
      punchOutTime: timeStr,
      workedHours: workedStr,
    };
    setPunchState(newState);
    if (user?.email) {
      localStorage.setItem(`nexus_punch_${user.email}`, JSON.stringify(newState));
    }
    showToast("Punched Out", "success", `Shift completed at ${timeStr}. Duration: ${workedStr}`);
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
