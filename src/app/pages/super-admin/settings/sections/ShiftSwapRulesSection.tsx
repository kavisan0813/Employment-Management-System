import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function ShiftSwapRulesSection() {
  const { extraConfig, showToast, updateExtraConfig } = useSettingsContext();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "#9CA3AF" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#9CA3AF" }}>Workflow Automation</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#00B87C", fontWeight: 700 }}>
          Shift Swap Rules
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
            Shift Swap Rules
          </h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
            Define rules and approval flow for employee shift swaps
          </p>
        </div>
        <button
          onClick={() => showToast("Shift swap rules saved")}
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
          Save Rules
        </button>
      </div>

      {/* POLICY BLOCK 1: SWAP ELIGIBILITY */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          SWAP ELIGIBILITY
        </span>
        <div className="space-y-3">
          {[
            {
              key: "swapAllow",
              label: "Allow Shift Swaps Between Employees",
              desc: "Employees can request to exchange shifts with colleagues",
            },
            {
              key: "swapSameDept",
              label: "Restrict Swaps to Same Department Only",
              desc: "Employees can only swap with same-department colleagues",
            },
            {
              key: "swapSameShift",
              label: "Restrict Swaps to Same Shift Type Only",
              desc: "Morning can only swap with Morning, etc.",
            },
            {
              key: "swapCrossLoc",
              label: "Allow Swaps Across Locations",
              desc: "Employees from different offices can swap shifts",
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
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
              Minimum Notice Period for Swap (hours)
            </span>
            <input
              type="number"
              value={extraConfig.swapMinNotice}
              onChange={(e) =>
                updateExtraConfig("swapMinNotice", e.target.value)
              }
              className="rounded-xl px-3 py-2 text-sm border w-24 text-center bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
        </div>
      </div>

      {/* POLICY BLOCK 2: APPROVAL WORKFLOW */}
      <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
        APPROVAL WORKFLOW
      </span>
      <div
        className="p-6 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <div className="flex items-center justify-between overflow-x-auto py-2 mb-4">
          <div className="border rounded-xl p-3 text-center min-w-[100px] bg-white dark:bg-neutral-900">
            <span className="block text-[11px] font-bold text-[#94A3B8]">
              Employee A
            </span>
            <span className="block text-[12px] font-bold text-gray-800 mt-1">
              Initiates Swap
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
            <span className="block text-[11px] font-bold text-[#94A3B8]">
              Employee B
            </span>
            <span className="block text-[12px] font-bold text-gray-800 mt-1">
              Accepts/Declines
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
            <span className="block text-[11px] font-bold text-[#94A3B8]">
              Direct Manager
            </span>
            <span className="block text-[12px] font-bold text-gray-800 mt-1">
              Final Approval
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
              ✓ Updated
            </span>
            <span className="block text-[11px] text-[#94A3B8]">
              Both notified
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
            Skip Manager Approval for Same-Day Swaps
          </span>
          <button
            onClick={() =>
              updateExtraConfig(
                "swapSkipMgrSameDay",
                !extraConfig.swapSkipMgrSameDay,
              )
            }
            style={{
              width: "36px",
              height: "20px",
              borderRadius: "20px",
              backgroundColor: extraConfig.swapSkipMgrSameDay
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
                left: extraConfig.swapSkipMgrSameDay ? "18px" : "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "white",
                transition: "all 0.2s",
              }}
            />
          </button>
        </div>
      </div>

      {/* POLICY BLOCK 3: SWAP LIMITS */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          SWAP LIMITS
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Max Swaps per Employee per Month
            </label>
            <input
              type="number"
              value={extraConfig.swapMaxPerMonth}
              onChange={(e) =>
                updateExtraConfig("swapMaxPerMonth", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Swap Request Expiry (hours)
            </label>
            <input
              type="number"
              value={extraConfig.swapExpiryHours}
              onChange={(e) =>
                updateExtraConfig("swapExpiryHours", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
            <span className="text-[11px] text-[#94A3B8]">
              If Employee B does not respond, request expires
            </span>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Manager Approval Deadline (hours)
            </label>
            <input
              type="number"
              value={extraConfig.swapMgrDeadlineHours}
              onChange={(e) =>
                updateExtraConfig("swapMgrDeadlineHours", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Max Advance Booking (days)
            </label>
            <input
              type="number"
              value={extraConfig.swapMaxAdvanceDays}
              onChange={(e) =>
                updateExtraConfig("swapMaxAdvanceDays", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
        </div>
        <div className="space-y-3">
          {[
            { key: "swapEnforceLimit", label: "Enforce Monthly Swap Limit" },
            {
              key: "swapAutoDecline",
              label: "Auto-decline Expired Requests",
            },
            {
              key: "swapAllowCancel",
              label: "Allow Cancellation After Approval",
              desc: "Once both parties and manager approve, swap is locked",
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

      {/* POLICY BLOCK 4: OT & COMPLIANCE CHECKS */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          OT & COMPLIANCE CHECKS
        </span>
        <div className="space-y-3">
          {[
            {
              key: "swapBlockOtViolation",
              label: "Block Swap if it Causes Overtime Violation",
              desc: "Prevent swaps that push employee over weekly OT limit",
            },
            {
              key: "swapBlockRestViolation",
              label: "Block Swap if Rest Period < 8 Hours",
              desc: "Enforce minimum rest between back-to-back shifts",
            },
            {
              key: "swapAutoCalcOt",
              label: "Auto-calculate OT Impact Before Approval",
              desc: "Show OT impact to manager during approval",
            },
            {
              key: "swapNotifyCompliance",
              label: "Notify HR if Swap Causes Compliance Issue",
              desc: "",
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

      {/* POLICY BLOCK 5: NOTIFICATIONS */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          NOTIFICATIONS
        </span>
        <div className="space-y-3">
          {[
            {
              key: "swapNotifyB",
              label: "Notify Employee B Immediately on Swap Request",
            },
            {
              key: "swapNotifyMgr",
              label: "Notify Manager on Employee Acceptance",
            },
            {
              key: "swapSmsConfirmation",
              label: "Send Confirmation SMS After Approval",
            },
            {
              key: "swapRealTimeCalendar",
              label: "Update Shift Calendar in Real-time",
            },
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center">
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
          ))}
        </div>
      </div>

      <div
        className="flex justify-end items-center gap-4 pt-4 border-t"
        style={{ borderColor: "#F3F4F6" }}
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
          onClick={() => showToast("Shift swap rules saved")}
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
          Save Rules
        </button>
      </div>
    </div>
  );
}
