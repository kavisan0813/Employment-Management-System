import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
} from "lucide-react";

export function ApprovalWorkflowsSection() {
  const {
    extraConfig,
    setActiveModal,
    showToast,
    updateExtraConfig,
  } = useSettingsContext();

  const workflows = [
    {
      name: "Leave Approval",
      desc: "When leave is requested",
      trigger: "leave.applied",
      steps: "3 steps",
      applies: "All Employees",
      status: "Active",
      color: "#00B87C",
    },
    {
      name: "Expense Reimbursement",
      desc: "When expense is submitted",
      trigger: "expense.submitted",
      steps: "2 steps",
      applies: "All Employees",
      status: "Active",
      color: "#F59E0B",
    },
    {
      name: "Payroll Approval",
      desc: "Before payroll is processed",
      trigger: "payroll.pre-run",
      steps: "3 steps",
      applies: "Finance + HR",
      status: "Active",
      color: "#8B5CF6",
    },
    {
      name: "Increment Approval",
      desc: "When increment is proposed",
      trigger: "increment.proposed",
      steps: "4 steps",
      applies: "Managers",
      status: "Active",
      color: "#F59E0B",
    },
    {
      name: "Offboarding Checklist",
      desc: "When resignation is submitted",
      trigger: "employee.resigned",
      steps: "5 steps",
      applies: "HR + IT + Finance",
      status: "Active",
      color: "#EF4444",
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
          Approval Workflows
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
            Approval Workflows
          </h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
            Configure multi-step approval chains for HR processes
          </p>
        </div>
        <button
          onClick={() => setActiveModal("create_workflow")}
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
          + Create Workflow
        </button>
      </div>

      {/* SECTION: ACTIVE WORKFLOWS */}
      <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
        ACTIVE WORKFLOWS
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
                  "WORKFLOW NAME",
                  "TRIGGER",
                  "STEPS",
                  "APPLIES TO",
                  "STATUS",
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
              {workflows.map((w, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-[#00B87C]/[0.08] transition-all text-[13px]"
                >
                  <td className="py-3 px-4">
                    <span className="block font-bold text-gray-800 dark:text-gray-200">
                      {w.name}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {w.desc}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${w.color}20`,
                        color: w.color,
                      }}
                    >
                      {w.trigger}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                      {w.steps}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{w.applies}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#00B87C]">
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
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

      {/* SECTION: WORKFLOW BUILDER PREVIEW */}
      <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
        WORKFLOW BUILDER PREVIEW
      </span>
      <div
        className="p-6 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <div className="flex items-center justify-between gap-4 overflow-x-auto py-4">
          {/* Step 1 */}
          <div
            className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-4 relative bg-white dark:bg-neutral-900"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#00B87C] font-bold text-xs mb-2">
              1
            </div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              Employee
            </span>
            <span className="block font-bold text-[13px] text-[#111827] mt-1">
              Submits Request
            </span>
            <span className="inline-block text-[11px] bg-[#DCFCE7] text-[#00B87C] font-bold px-2 py-0.5 rounded-full mt-2">
              Trigger
            </span>
          </div>

          <div className="flex items-center flex-1 min-w-[30px] justify-center">
            <div className="h-[2px] bg-[#00B87C] flex-1" />
            <ChevronRight
              className="text-[#00B87C]"
              size={16}
              style={{ marginLeft: "-10px" }}
            />
          </div>

          {/* Step 2 */}
          <div
            className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-4 relative bg-white dark:bg-neutral-900"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#00B87C] font-bold text-xs mb-2">
              2
            </div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              Direct Manager
            </span>
            <span className="block font-bold text-[13px] text-[#111827] mt-1">
              Reviews & Approves
            </span>
            <span className="block text-[11px] text-[#94A3B8] mt-1">
              Within 2 days
            </span>
            <span className="inline-block text-[11px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full mt-2">
              Level 1
            </span>
          </div>

          <div className="flex items-center flex-1 min-w-[30px] justify-center">
            <div className="h-[2px] bg-[#00B87C] flex-1" />
            <ChevronRight
              className="text-[#00B87C]"
              size={16}
              style={{ marginLeft: "-10px" }}
            />
          </div>

          {/* Step 3 */}
          <div
            className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-4 relative bg-white dark:bg-neutral-900"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#00B87C] font-bold text-xs mb-2">
              3
            </div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              HR Manager
            </span>
            <span className="block font-bold text-[13px] text-[#111827] mt-1">
              Final Approval
            </span>
            <span className="block text-[11px] text-[#94A3B8] mt-1">
              Within 1 day
            </span>
            <span className="inline-block text-[11px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full mt-2">
              Level 2
            </span>
          </div>

          <div className="flex items-center flex-1 min-w-[30px] justify-center">
            <div className="h-[2px] bg-[#00B87C] flex-1" />
            <ChevronRight
              className="text-[#00B87C]"
              size={16}
              style={{ marginLeft: "-10px" }}
            />
          </div>

          {/* Step 4 */}
          <div
            className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-4 relative bg-white dark:bg-neutral-900"
            style={{ borderColor: "#E5E7EB" }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#00B87C] text-white font-bold text-xs mb-2">
              ✓
            </div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              Employee
            </span>
            <span className="block font-bold text-[13px] text-[#111827] mt-1">
              Notified
            </span>
            <span className="block text-[11px] text-[#94A3B8] mt-1">
              Email + Push
            </span>
            <span className="inline-block text-[11px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full mt-2">
              Auto
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-4">
          <button className="px-4 py-2 text-[12px] font-bold border border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-[#00B87C]/[0.08] cursor-pointer">
            Edit Workflow
          </button>
          <span className="text-[12px] text-[#00B87C] cursor-pointer font-bold">
            + Add Step
          </span>
        </div>
      </div>

      {/* POLICY BLOCK: GLOBAL WORKFLOW RULES */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          GLOBAL WORKFLOW RULES
        </span>
        <div className="space-y-3">
          {[
            {
              key: "workflowAutoEscalate",
              label: "Auto-escalate if not approved within deadline",
              desc: "Moves to next level if approver is inactive for set duration",
            },
            {
              key: "workflowReminder",
              label: "Send reminder before deadline expires",
              desc: "",
            },
            {
              key: "workflowDelegation",
              label: "Allow Delegation of Approval",
              desc: "Approvers can temporarily delegate to another manager",
            },
            {
              key: "workflowParallel",
              label: "Parallel Approvals (all approvers simultaneously)",
              desc: "All approvers notified at once instead of sequentially",
            },
            {
              key: "workflowCcHr",
              label: "CC HR on all approval decisions",
              desc: "",
            },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between items-center">
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
              {item.key === "workflowReminder" &&
                extraConfig.workflowReminder && (
                  <input
                    type="text"
                    value={extraConfig.workflowReminderTime}
                    onChange={(e) =>
                      updateExtraConfig(
                        "workflowReminderTime",
                        e.target.value,
                      )
                    }
                    className="mt-2 rounded-xl px-3 py-2 text-sm border w-full md:w-64 bg-white dark:bg-neutral-800"
                    style={{
                      borderColor: "#E5E7EB",
                      color: "var(--foreground)",
                    }}
                  />
                )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex justify-end items-center pt-4 border-t"
        style={{ borderColor: "#F3F4F6" }}
      >
        <button
          onClick={() => showToast("Workflow policies saved")}
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
