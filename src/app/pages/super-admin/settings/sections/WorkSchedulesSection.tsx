import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
  CheckCircle,
  Clock,
  RotateCcw,
  Users,
} from "lucide-react";

export function WorkSchedulesSection() {
  const {
    SectionTitle,
    schedLocFilter,
    schedSearchQuery,
    schedStatusFilter,
    schedTypeFilter,
    schedulesList,
    setActiveModal,
    setSchedLocFilter,
    setSchedSearchQuery,
    setSchedStatusFilter,
    setSchedTypeFilter,
    setScheduleForm,
    setSchedulesList,
    setSelectedSchedule,
    setWsAbsentThreshold,
    setWsAutoOt,
    setWsCompOff,
    setWsGracePeriod,
    setWsHalfDay,
    setWsMinRest,
    setWsOtAlert,
    setWsOtThreshold,
    setWsRequireOtApproval,
    setWsWeeklyHours,
    showToast,
    wsAbsentThreshold,
    wsAutoOt,
    wsCompOff,
    wsGracePeriod,
    wsHalfDay,
    wsMinRest,
    wsOtAlert,
    wsOtThreshold,
    wsRequireOtApproval,
    wsWeeklyHours,
  } = useSettingsContext();

  // Filter logic
  const filteredScheds = schedulesList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(schedSearchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(schedSearchQuery.toLowerCase());

    const matchesStatus =
      schedStatusFilter === "All" || s.status === schedStatusFilter;
    const matchesType =
      schedTypeFilter === "All" || s.type === schedTypeFilter;
    const matchesLoc =
      schedLocFilter === "All" || s.location === schedLocFilter;

    return matchesSearch && matchesStatus && matchesType && matchesLoc;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight
          size={12}
          style={{ color: "var(--muted-foreground)" }}
        />
        <span style={{ color: "#00B87C" }}>Work Schedules</span>
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
            Work Schedule Management
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Configure team allocations and core shift rules
          </p>
        </div>
        <button
          onClick={() => {
            setScheduleForm({
              name: "",
              code: "",
              type: "General",
              startTime: "09:00",
              endTime: "18:00",
              breakDuration: 60,
              workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
              weekends: ["Sat", "Sun"],
              graceTime: 15,
              halfDayRule: "Under 4 hours",
              otEligible: true,
              dept: "All",
              location: "All",
              status: "Active",
            });
            setSelectedSchedule(null);
            setActiveModal("add_schedule");
          }}
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add Schedule
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Schedules",
            value: schedulesList.length,
            icon: <Clock size={20} />,
            color: "#00B87C",
            bg: "rgba(0, 184, 124, 0.1)",
          },
          {
            label: "Active Schedules",
            value: schedulesList.filter((s) => s.status === "Active").length,
            icon: <CheckCircle size={20} />,
            color: "#0EA5E9",
            bg: "rgba(14, 165, 233, 0.1)",
          },
          {
            label: "Employees Assigned",
            value: schedulesList.reduce(
              (acc, curr) => acc + curr.empCount,
              0,
            ),
            icon: <Users size={20} />,
            color: "#F59E0B",
            bg: "rgba(245, 158, 11, 0.1)",
          },
          {
            label: "Shift Based Schedules",
            value: schedulesList.filter((s) => s.type === "Shift").length,
            icon: <RotateCcw size={20} />,
            color: "#8B5CF6",
            bg: "rgba(139, 92, 246, 0.1)",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl flex items-center justify-between shadow-sm"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#111827",
                  marginTop: "4px",
                  marginBottom: 0,
                }}
              >
                {card.value}
              </p>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: card.bg,
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
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
          placeholder="Search by name, code..."
          value={schedSearchQuery}
          onChange={(e) => setSchedSearchQuery(e.target.value)}
          className="rounded-xl px-4 py-2 text-sm outline-none border w-64 transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
        <select
          value={schedStatusFilter}
          onChange={(e) => setSchedStatusFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={schedTypeFilter}
          onChange={(e) => setSchedTypeFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="All">All Types</option>
          <option value="General">General</option>
          <option value="Shift">Shift</option>
          <option value="Flexible">Flexible</option>
          <option value="Rotational">Rotational</option>
          <option value="Part Time">Part Time</option>
        </select>
        <select
          value={schedLocFilter}
          onChange={(e) => setSchedLocFilter(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none border transition-all"
          style={{
            backgroundColor: "var(--input-background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <option value="All">All Locations</option>
          <option value="Bengaluru HQ">Bengaluru HQ</option>
          <option value="Mumbai Branch">Mumbai Branch</option>
          <option value="US Remote">US Remote</option>
          <option value="Delhi Warehouse">Delhi Warehouse</option>
        </select>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] shadow-sm mb-6">
        <table
          className="w-full border-collapse"
          style={{ minWidth: "1000px" }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #F3F4F6",
                textAlign: "left",
                backgroundColor: "#F9FAFB",
              }}
            >
              {[
                "SCHEDULE",
                "CODE",
                "TYPE",
                "TIMINGS",
                "BREAK",
                "WORKING DAYS",
                "ASSIGNED",
                "LOCATION",
                "STATUS",
                "ACTION",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredScheds.map((s, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid var(--border)",
                  height: "56px",
                }}
                className="hover:bg-[var(--muted)] transition-all"
              >
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                  }}
                >
                  {s.name}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                  }}
                >
                  <span
                    className="px-2 py-1 rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: "var(--muted)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {s.code}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {s.type}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {s.startTime === "Flexible"
                    ? "Flexible"
                    : `${s.startTime} - ${s.endTime}`}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {s.breakDuration} mins
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {s.workingDays.join(", ")}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor: "rgba(0, 184, 124, 0.1)",
                      color: "#00B87C",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {s.empCount} Employees
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {s.location}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      backgroundColor:
                        s.status === "Active"
                          ? "rgba(0, 184, 124, 0.1)"
                          : "rgba(107, 114, 128, 0.1)",
                      color: s.status === "Active" ? "#00B87C" : "#6B7280",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedSchedule(s);
                        setActiveModal("view_schedule");
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSchedule(s);
                        setScheduleForm({
                          name: s.name,
                          code: s.code,
                          type: s.type,
                          startTime: s.startTime,
                          endTime: s.endTime,
                          breakDuration: s.breakDuration,
                          workingDays: s.workingDays,
                          weekends: s.weekends,
                          graceTime: s.graceTime,
                          halfDayRule: s.halfDayRule,
                          otEligible: s.otEligible,
                          dept: s.dept,
                          location: s.location,
                          status: s.status,
                        });
                        setActiveModal("edit_schedule");
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #00B87C",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#00B87C",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const cloneCode = `${s.code}-COPY`;
                        const cloneSched: WorkScheduleRecord = {
                          ...s,
                          code: cloneCode,
                          name: `${s.name} (Copy)`,
                          empCount: 0,
                        };
                        setSchedulesList([...schedulesList, cloneSched]);
                        showToast("Schedule cloned successfully", "success");
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #8B5CF6",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#8B5CF6",
                        cursor: "pointer",
                      }}
                    >
                      Clone
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSchedule(s);
                        setActiveModal("delete_schedule");
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #EF4444",
                        borderRadius: "8px",
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#EF4444",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section: DEFAULT RULES */}
      <SectionTitle title="Default Rules" />
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid #00B87C",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "Grace Period (mins)",
              state: wsGracePeriod,
              setter: setWsGracePeriod,
            },
            {
              label: "Weekly Hours Cap",
              state: wsWeeklyHours,
              setter: setWsWeeklyHours,
            },
            {
              label: "OT Threshold (hrs/day)",
              state: wsOtThreshold,
              setter: setWsOtThreshold,
            },
            {
              label: "Min Rest Between Shifts (hrs)",
              state: wsMinRest,
              setter: setWsMinRest,
            },
            {
              label: "Half-Day Threshold (hrs)",
              state: wsHalfDay,
              setter: setWsHalfDay,
            },
            {
              label: "Absent If Less Than (hrs)",
              state: wsAbsentThreshold,
              setter: setWsAbsentThreshold,
            },
          ].map((f, idx) => (
            <div key={idx}>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                {f.label}
              </label>
              <input
                type="text"
                value={f.state}
                onChange={(e) => f.setter(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section: OVERTIME RULES */}
      <SectionTitle title="Overtime Rules" />
      <div className="space-y-4 mb-6">
        {[
          {
            label: "Auto-calculate Overtime",
            state: wsAutoOt,
            setter: setWsAutoOt,
          },
          {
            label: "Require Manager Approval for OT",
            state: wsRequireOtApproval,
            setter: setWsRequireOtApproval,
          },
          {
            label: "Send OT Alert at Threshold",
            state: wsOtAlert,
            setter: setWsOtAlert,
          },
          {
            label: "Allow Comp-off in lieu of OT Pay",
            state: wsCompOff,
            setter: setWsCompOff,
          },
        ].map((row, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <span
              style={{
                fontSize: "13px",
                color: "var(--foreground)",
                fontWeight: 500,
              }}
            >
              {row.label}
            </span>
            <button
              onClick={() => row.setter(!row.state)}
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: row.state
                  ? "#00B87C"
                  : "var(--switch-background)",
                position: "relative",
                transition: "all 0.2s",
                cursor: "pointer",
                border: "none",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  left: row.state ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "all 0.2s",
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() =>
            showToast("Work schedule updates saved successfully")
          }
          style={{
            backgroundColor: "#00B87C",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
