import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
} from "lucide-react";

export function LeaveApprovalsSection() {
  const {
    extraConfig,
    showToast,
    updateExtraConfig,
  } = useSettingsContext();

  const leaveRules = [
    {
      type: "Casual Leave",
      levels: "1 — Manager",
      max: "1 day",
      deadline: "2 days",
      escalation: "HR after 2 days",
    },
    {
      type: "Earned Leave",
      levels: "2 — Mgr + HR",
      max: "None",
      deadline: "3 days",
      escalation: "Skip to HR",
    },
    {
      type: "Sick Leave",
      levels: "1 — Manager",
      max: "3 days",
      deadline: "1 day",
      escalation: "Auto-approve",
    },
    {
      type: "Maternity",
      levels: "2 — Mgr + HR",
      max: "None",
      deadline: "5 days",
      escalation: "MD escalation",
    },
    {
      type: "Comp Off",
      levels: "1 — Manager",
      max: "2 days",
      deadline: "1 day",
      escalation: "Auto-approve",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "#9CA3AF" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#9CA3AF" }}>Workflow Automation</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#00B87C", fontWeight: 700 }}>
          Leave Approvals
        </span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}
          >
            Leave Approvals
          </h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
            Configure leave approval workflow and escalation rules
          </p>
        </div>
        <button
          onClick={() => showToast("Leave approval policies saved")}
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
          Save Settings
        </button>
      </div>

      {/* POLICY BLOCK 1: APPROVAL CHAIN */}
      <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
        APPROVAL CHAIN
      </span>
      <div
        className="p-6 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <div className="flex items-center justify-between overflow-x-auto py-2">
          <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
            <span className="block text-[12px] font-bold text-gray-800">
              Employee
            </span>
          </div>
          <div className="flex items-center flex-1 justify-center">
            <div className="h-[2px] bg-[#00B87C] flex-1" />
            <ChevronRight
              className="text-[#00B87C]"
              size={16}
              style={{ marginLeft: "-10px" }}
            />
          </div>
          <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
            <span className="block text-[12px] font-bold text-gray-800">
              Direct Manager
            </span>
          </div>
          <div className="flex items-center flex-1 justify-center relative">
            <div className="h-[2px] border-t-2 border-dashed border-[#F59E0B] flex-1" />
            <span className="absolute -top-3 text-[9px] bg-[#FEF3C7] text-[#D97706] font-bold px-1.5 py-0.5 rounded">
              If &gt; 5 days
            </span>
            <ChevronRight
              className="text-[#F59E0B]"
              size={16}
              style={{ marginLeft: "-10px" }}
            />
          </div>
          <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
            <span className="block text-[12px] font-bold text-gray-800">
              HR Manager
            </span>
          </div>
          <div className="flex items-center flex-1 justify-center">
            <div className="h-[2px] bg-[#00B87C] flex-1" />
            <ChevronRight
              className="text-[#00B87C]"
              size={16}
              style={{ marginLeft: "-10px" }}
            />
          </div>
          <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
            <span className="block text-[12px] font-bold text-gray-800">
              Notified
            </span>
          </div>
        </div>
      </div>

      {/* POLICY BLOCK 2: APPROVAL RULES BY LEAVE TYPE */}
      <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
        APPROVAL RULES BY LEAVE TYPE
      </span>
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200">
                {[
                  "LEAVE TYPE",
                  "APPROVER LEVELS",
                  "MAX AUTO-APPROVE",
                  "DEADLINE",
                  "ESCALATION",
                  "ACTION",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaveRules.map((r, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-[#00B87C]/[0.08] transition-all text-[13px]"
                >
                  <td className="py-3 px-4 font-medium">
                    <span
                      className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${idx === 0 ? "bg-[#DCFCE7] text-[#00B87C]" : idx === 1 ? "bg-teal-100 text-teal-700" : idx === 2 ? "bg-red-500/10 text-red-500" : idx === 3 ? "bg-purple-100 text-purple-700" : "bg-amber-500/10 text-amber-500"}`}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800">{r.levels}</td>
                  <td className="py-3 px-4 text-gray-600">{r.max}</td>
                  <td className="py-3 px-4 text-gray-600">{r.deadline}</td>
                  <td className="py-3 px-4 text-gray-600">{r.escalation}</td>
                  <td className="py-3 px-4">
                    <button className="px-2 py-1 text-[11px] font-bold border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-[#00B87C]/[0.08] cursor-pointer">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POLICY BLOCK 3: AUTO-APPROVAL RULES */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          AUTO-APPROVAL RULES
        </span>
        <div className="space-y-3">
          {[
            {
              key: "leaveAutoApproveShort",
              label: "Enable Auto-Approval for Short Leaves (1 day)",
              desc: "Single-day leaves approved automatically if balance available",
            },
            {
              key: "leaveAutoApproveMgrOnLeave",
              label: "Auto-approve if Manager is On Leave",
              desc: "Escalates to next level or auto-approves based on type",
            },
            {
              key: "leaveBlockCritical",
              label: "Block Leave During Critical Periods",
              desc: "HR can lock leave requests during quarter-end / appraisals",
            },
            {
              key: "leaveAllowRetroactive",
              label: "Allow Retroactive Leave Application",
              desc: "Employees cannot apply leave for dates already passed",
            },
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center">
              <div>
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
                  {item.label}
                </span>
                {item.desc && (
                  <span className="text-[11px] text-[#94A3B8]">
                    {item.desc}
                  </span>
                )}
              </div>
              <button
                onClick={() =>
                  updateExtraConfig(
                    item.key,
                    !extraConfig[item.key as keyof typeof extraConfig],
                  )
                }
                style={{
                  width: "36px",
                  height: "20px",
                  borderRadius: "20px",
                  backgroundColor: extraConfig[
                    item.key as keyof typeof extraConfig
                  ]
                    ? "#00B87C"
                    : "#E5E7EB",
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
                    left: extraConfig[item.key as keyof typeof extraConfig]
                      ? "18px"
                      : "2px",
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
      </div>

      {/* POLICY BLOCK 4: NOTIFICATION SETTINGS */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          NOTIFICATION SETTINGS
        </span>
        <div className="space-y-3">
          {[
            {
              key: "leaveNotifyMgr",
              label: "Notify Manager Immediately on Application",
            },
            {
              key: "leaveNotifyEmp",
              label: "Notify Employee on Every Status Change",
            },
            {
              key: "leaveDigest",
              label: "Send Daily Digest of Pending Approvals",
            },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
                  {item.label}
                </span>
                <button
                  onClick={() =>
                    updateExtraConfig(
                      item.key,
                      !extraConfig[item.key as keyof typeof extraConfig],
                    )
                  }
                  style={{
                    width: "36px",
                    height: "20px",
                    borderRadius: "20px",
                    backgroundColor: extraConfig[
                      item.key as keyof typeof extraConfig
                    ]
                      ? "#00B87C"
                      : "#E5E7EB",
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
                      left: extraConfig[item.key as keyof typeof extraConfig]
                        ? "18px"
                        : "2px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      transition: "all 0.2s",
                    }}
                  />
                </button>
              </div>
              {item.key === "leaveDigest" && extraConfig.leaveDigest && (
                <div className="mt-2">
                  <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">
                    Digest Time
                  </label>
                  <select
                    value={extraConfig.leaveDigestTime}
                    onChange={(e) =>
                      updateExtraConfig("leaveDigestTime", e.target.value)
                    }
                    className="rounded-xl px-3 py-1.5 text-xs border bg-white dark:bg-neutral-800"
                    style={{
                      borderColor: "#E5E7EB",
                      color: "var(--foreground)",
                    }}
                  >
                    <option>9:00 AM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
              Escalation Reminder After (hours)
            </span>
            <input
              type="number"
              value={extraConfig.leaveEscalationHours}
              onChange={(e) =>
                updateExtraConfig("leaveEscalationHours", e.target.value)
              }
              className="rounded-xl px-3 py-2 text-sm border w-24 text-center bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
        </div>
      </div>

      <div
        className="flex justify-end items-center pt-4 border-t"
        style={{ borderColor: "#F3F4F6" }}
      >
        <button
          onClick={() => showToast("Leave policies saved")}
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
          Save Settings
        </button>
      </div>
    </div>
  );
}
