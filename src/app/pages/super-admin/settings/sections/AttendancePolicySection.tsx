import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
} from "lucide-react";

export function AttendancePolicySection() {
  const {
    showToast,
  } = useSettingsContext();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight
          size={12}
          style={{ color: "var(--muted-foreground)" }}
        />
        <span style={{ color: "#00B87C" }}>Attendance Policy</span>
      </div>

      {/* Content Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Attendance Policy
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Define rules for check-in, late marks and regularization
          </p>
        </div>
        <button
          onClick={() =>
            showToast("Attendance protocols updated successfully")
          }
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Policy
        </button>
      </div>
    </div>
  );
}
