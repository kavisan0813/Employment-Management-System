import React from "react";
import { useSettingsContext } from "../SettingsContext";
import {
  ChevronRight,
} from "lucide-react";

export function OnboardingSettingsSection() {
  const {
    activeOnboardingPhaseTab,
    extraConfig,
    setActiveOnboardingPhaseTab,
    showToast,
    updateExtraConfig,
  } = useSettingsContext();

  return (
    <div>
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "#9CA3AF" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#9CA3AF" }}>Module Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#00B87C", fontWeight: 700 }}>
          Onboarding Settings
        </span>
      </div>

      {/* CONTENT HEADER */}
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
            Onboarding Settings
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#9CA3AF",
              marginTop: "2px",
              margin: 0,
            }}
          >
            Configure the new hire onboarding journey and checklists
          </p>
        </div>
        <button
          onClick={() => showToast("Onboarding configurations saved")}
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

      {/* POLICY BLOCK 1: ONBOARDING WORKFLOW */}
      <div
        className="p-6 rounded-xl mb-6 border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-4 uppercase">
          ONBOARDING WORKFLOW
        </span>

        <div className="flex items-center justify-between py-2 mb-4 gap-2 overflow-x-auto">
          {/* Phase 1 */}
          <div
            className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-3 relative"
            style={{
              backgroundColor: "#DCFCE7",
              borderColor: "#00B87C",
              borderWidth: "1px",
            }}
          >
            <span className="block font-bold text-[13px] text-[#111827]">
              Pre-joining
            </span>
            <span className="block text-[11px] text-[#6B7280] mt-1">
              Before Day 1
            </span>
            <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-2 bg-[#00B87C] text-white">
              4 tasks
            </span>
          </div>

          <ChevronRight size={18} style={{ color: "#00B87C" }} />

          {/* Phase 2 */}
          <div
            className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-3 relative bg-white dark:bg-neutral-800"
            style={{
              borderColor: "#E5E7EB",
            }}
          >
            <span className="block font-bold text-[13px] text-gray-800 dark:text-gray-200">
              Day 1
            </span>
            <span className="block text-[11px] text-[#94A3B8] mt-1">
              First day at office
            </span>
            <span
              className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-2"
              style={{ backgroundColor: "#E6FFFA", color: "#319795" }}
            >
              6 tasks
            </span>
          </div>

          <ChevronRight size={18} style={{ color: "#00B87C" }} />

          {/* Phase 3 */}
          <div
            className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-3 relative bg-white dark:bg-neutral-800"
            style={{
              borderColor: "#E5E7EB",
            }}
          >
            <span className="block font-bold text-[13px] text-gray-800 dark:text-gray-200">
              Week 1
            </span>
            <span className="block text-[11px] text-[#94A3B8] mt-1">
              First 7 days
            </span>
            <span
              className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-2"
              style={{ backgroundColor: "#E6FFFA", color: "#319795" }}
            >
              8 tasks
            </span>
          </div>

          <ChevronRight size={18} style={{ color: "#00B87C" }} />

          {/* Phase 4 */}
          <div
            className="flex flex-col items-center text-center min-w-[120px] border rounded-xl p-3 relative bg-white dark:bg-neutral-800"
            style={{
              borderColor: "#E5E7EB",
            }}
          >
            <span className="block font-bold text-[13px] text-gray-800 dark:text-gray-200">
              Month 1
            </span>
            <span className="block text-[11px] text-[#94A3B8] mt-1">
              First 30 days
            </span>
            <span
              className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-2"
              style={{ backgroundColor: "#E6FFFA", color: "#319795" }}
            >
              5 tasks
            </span>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            className="px-4 py-2 text-[12px] font-bold border rounded-xl hover:bg-[#00B87C]/[0.08] dark:hover:bg-neutral-700 cursor-pointer"
            style={{
              borderColor: "#E5E7EB",
              color: "var(--foreground)",
              backgroundColor: "var(--card)",
            }}
          >
            Edit Phases
          </button>
          <span className="text-[12px] text-[#00B87C] cursor-pointer font-bold hover:underline">
            + Add Phase
          </span>
        </div>
      </div>

      {/* POLICY BLOCK 2: ONBOARDING TASKS BY PHASE */}
      <div
        className="p-6 rounded-xl mb-6 border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-4 uppercase">
          ONBOARDING TASKS BY PHASE
        </span>

        {/* TABS */}
        <div
          className="flex gap-6 border-b mb-4"
          style={{ borderColor: "var(--border)" }}
        >
          {[
            { id: "pre", label: "Pre-joining" },
            { id: "day1", label: "Day 1" },
            { id: "week1", label: "Week 1" },
            { id: "month1", label: "Month 1" },
          ].map((tab) => {
            const active = activeOnboardingPhaseTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveOnboardingPhaseTab(tab.id)}
                className="pb-2 font-bold text-[13px] bg-transparent cursor-pointer transition-all"
                style={{
                  borderBottom: active
                    ? "2px solid #00B87C"
                    : "2px solid transparent",
                  color: active ? "#00B87C" : "#6B7280",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TASK LIST */}
        <div className="divide-y divide-gray-100 dark:divide-neutral-800 mb-4">
          {[
            { name: "Send welcome email", dept: "HR", due: "-7", req: true },
            {
              name: "Collect required documents",
              dept: "HR",
              due: "-5",
              req: true,
            },
            {
              name: "Create employee system account",
              dept: "IT",
              due: "-3",
              req: true,
            },
            {
              name: "Order laptop and equipment",
              dept: "IT",
              due: "-5",
              req: true,
            },
            {
              name: "Send office location & parking info",
              dept: "HR",
              due: "-1",
              req: false,
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 h-[40px] text-[13px] py-1"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-gray-400 select-none cursor-grab">
                  ⋮⋮
                </span>
                <input
                  type="checkbox"
                  checked={t.req}
                  readOnly
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "#00B87C" }}
                />
                <span className="font-bold truncate text-gray-800 dark:text-gray-200">
                  {t.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Assigned To Dropdown Chip */}
                <select
                  value={t.dept}
                  onChange={() => {}}
                  className="text-[11px] bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border-0 font-medium outline-none cursor-pointer"
                >
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                  <option value="Ops">Ops</option>
                </select>

                {/* Due Days Input */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-[#94A3B8]">Day</span>
                  <input
                    type="number"
                    defaultValue={t.due}
                    className="w-12 text-center rounded border bg-white dark:bg-neutral-800 text-xs p-1"
                    style={{
                      borderColor: "#E5E7EB",
                      color: "var(--foreground)",
                    }}
                  />
                </div>

                {/* Required Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-[#94A3B8]">
                    {t.req ? "Required" : "Optional"}
                  </span>
                  <button
                    onClick={() => {}}
                    style={{
                      width: "30px",
                      height: "16px",
                      borderRadius: "16px",
                      backgroundColor: t.req ? "#00B87C" : "#E5E7EB",
                      position: "relative",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "1px",
                        left: t.req ? "15px" : "1px",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        transition: "all 0.2s",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <span className="text-[13px] text-[#00B87C] font-bold cursor-pointer hover:underline">
          + Add Task
        </span>
      </div>

      {/* POLICY BLOCK 3: ONBOARDING RULES */}
      <div
        className="p-6 rounded-xl mb-6 border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-4 uppercase">
          ONBOARDING RULES
        </span>
        <div className="space-y-4">
          {[
            {
              key: "onboardingPreJoiningEmail",
              label: "Send Pre-joining Welcome Email Automatically",
              desc: "Triggered when employee record is created and joining date set",
            },
            {
              key: "onboardingAutoBuddy",
              label: "Assign Buddy/Mentor Automatically",
              desc: "System assigns a buddy from same department on joining",
            },
            {
              key: "onboardingDigitalSign",
              label: "Enable Digital Document Signing on Onboarding",
              desc: "New hire signs NDA, offer letter digitally via portal",
            },
            {
              key: "onboardingBlockPayroll",
              label: "Block Payroll Until Onboarding Completion",
              desc: "Salary is held until all mandatory tasks are marked complete",
            },
            {
              key: "onboardingNotifyOverdue",
              label: "Notify HR if Onboarding Task Overdue",
              desc: "",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex justify-between items-center py-1"
            >
              <div>
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
                  {item.label}
                </span>
                {item.desc && (
                  <span className="text-[11px] text-[#94A3B8] mt-0.5 block">
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

      {/* POLICY BLOCK 4: OFFBOARDING SETTINGS */}
      <div
        className="p-6 rounded-xl mb-6 border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-4 uppercase">
          OFFBOARDING SETTINGS
        </span>
        <div className="space-y-4 mb-6">
          {[
            {
              key: "offboardingEnabled",
              label: "Enable Offboarding Workflow",
            },
            {
              key: "offboardingAutoTrigger",
              label: "Auto-trigger on Resignation Submission",
            },
            {
              key: "offboardingRequireExitInterview",
              label: "Require Exit Interview",
            },
            {
              key: "offboardingRevokeAccess",
              label: "Revoke System Access on Last Working Day",
            },
            {
              key: "offboardingAutoFf",
              label: "Auto-generate Full & Final Settlement",
            },
            {
              key: "offboardingAlumniAccess",
              label: "Enable Alumni Portal Access After Exit",
              desc: "Ex-employees can access limited portal for documents",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex justify-between items-center py-1"
            >
              <div>
                <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200 block">
                  {item.label}
                </span>
                {item.desc && (
                  <span className="text-[11px] text-[#94A3B8] mt-0.5 block">
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

        <div
          className="grid grid-cols-2 gap-4 border-t pt-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Notice Period Default (days)
            </label>
            <input
              type="number"
              value={extraConfig.offboardingNoticePeriod}
              onChange={(e) =>
                updateExtraConfig("offboardingNoticePeriod", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              F&F Settlement Deadline (days after exit)
            </label>
            <input
              type="number"
              value={extraConfig.offboardingFfDeadline}
              onChange={(e) =>
                updateExtraConfig("offboardingFfDeadline", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
        </div>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center gap-4 pt-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => showToast("Settings reset to default", "error")}
          style={{
            backgroundColor: "transparent",
            color: "#9CA3AF",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reset to Defaults
        </button>
        <button
          onClick={() => showToast("Onboarding configurations saved")}
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
