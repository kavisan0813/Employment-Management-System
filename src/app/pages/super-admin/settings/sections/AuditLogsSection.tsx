import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function AuditLogsSection() {
  const { SectionTitle, showToast } = useSettingsContext();

  const logs = [
    {
      text: "Ryan Park deleted employee record EMP-0421",
      time: "Today 10:42 AM",
      dotColor: "#EF4444",
    },
    {
      text: "Meera Thomas approved leave for Priya Sharma",
      time: "Today 10:15 AM",
      dotColor: "#10B981",
    },
    {
      text: "Ryan Park updated role permissions for HR Manager",
      time: "Today 9:58 AM",
      dotColor: "#0EA5E9",
    },
    {
      text: "Suresh Iyer ran payroll for March 2026",
      time: "Yesterday 6:30 PM",
      dotColor: "#F59E0B",
    },
    {
      text: "Ananya Das added new employee Leo Martinez",
      time: "Yesterday 3:12 PM",
      dotColor: "#10B981",
    },
    {
      text: "Ryan Park changed security policy — MFA enforced",
      time: "Apr 5, 2:00 PM",
      dotColor: "#8B5CF6",
    },
    {
      text: "Meera Thomas updated leave policy — EL carryforward 15 days",
      time: "Apr 4, 11:20 AM",
      dotColor: "#0EA5E9",
    },
    {
      text: "Suresh Iyer deleted shift template Engineering-Week-A",
      time: "Apr 3, 4:45 PM",
      dotColor: "#EF4444",
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Audit Logs</span>
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
            Audit Logs
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            System activity trail — who did what and when
          </p>
        </div>
        <button
          onClick={() =>
            showToast("Audit trail extracted as corporate CSV bundle")
          }
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            borderRadius: "10px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          Export Logs
        </button>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-xl flex flex-wrap items-center gap-3 mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <input
          type="text"
          placeholder="Search logs by user, action..."
          className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
        <select
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option>All Actions</option>
          <option>Login</option>
          <option>Edit</option>
          <option>Delete</option>
          <option>Create</option>
          <option>Export</option>
        </select>
        <select
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option>All Modules</option>
        </select>
        <select
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>Custom</option>
        </select>
      </div>

      {/* Section: ACTIVITY LOG */}
      <SectionTitle title="Activity Log" />
      <div
        className="rounded-xl overflow-hidden mb-6 p-2"
        style={{
          backgroundColor: "var(--input-background)",
          border: "1px solid var(--border)",
        }}
      >
        {logs.map((l, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center py-3 px-4"
            style={{
              borderBottom:
                idx === logs.length - 1 ? "none" : "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: l.dotColor,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--foreground)",
                  fontWeight: 600,
                }}
              >
                {l.text}
              </span>
            </div>
            <span
              style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
            >
              {l.time}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center py-2">
        <span style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
          Showing 1–8 of 1,248 logs
        </span>
        <div className="flex gap-2">
          <button
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Previous
          </button>
          <button
            style={{
              border: "1px solid var(--border)",
              background: "#00B87C",
              color: "white",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            1
          </button>
          <button
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            2
          </button>
          <button
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            3
          </button>
          <button
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
