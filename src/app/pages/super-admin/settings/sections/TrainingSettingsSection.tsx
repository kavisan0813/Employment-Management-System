import React from "react";
import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";

export function TrainingSettingsSection() {
  const { extraConfig, showToast, updateExtraConfig } = useSettingsContext();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "#9CA3AF" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#9CA3AF" }}>Module Settings</span>
        <ChevronRight size={12} style={{ color: "#9CA3AF" }} />
        <span style={{ color: "#00B87C", fontWeight: 700 }}>
          Training Settings
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
            Training Settings
          </h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
            Configure the LMS, course access and completion rules
          </p>
        </div>
        <button
          onClick={() => showToast("Training settings saved")}
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

      {/* POLICY BLOCK 1: LMS CONFIGURATION */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          LMS CONFIGURATION
        </span>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              LMS Mode
            </label>
            <select
              value={extraConfig.lmsMode}
              onChange={(e) => updateExtraConfig("lmsMode", e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Internal (Built-in)</option>
              <option>External LMS</option>
              <option>Both</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              External LMS URL
            </label>
            <input
              type="url"
              value={extraConfig.lmsExternalUrl}
              onChange={(e) =>
                updateExtraConfig("lmsExternalUrl", e.target.value)
              }
              disabled={extraConfig.lmsMode === "Internal (Built-in)"}
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800 disabled:bg-gray-100 disabled:text-gray-400"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Default Course Language
            </label>
            <select
              value={extraConfig.lmsDefaultLanguage}
              onChange={(e) =>
                updateExtraConfig("lmsDefaultLanguage", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Video Hosting
            </label>
            <select
              value={extraConfig.lmsVideoHosting}
              onChange={(e) =>
                updateExtraConfig("lmsVideoHosting", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Internal Storage</option>
              <option>YouTube</option>
              <option>Vimeo</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Certificate Provider
            </label>
            <select
              value={extraConfig.lmsCertificateProvider}
              onChange={(e) =>
                updateExtraConfig("lmsCertificateProvider", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>viyanHR</option>
              <option>External</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Max Video Size (MB)
            </label>
            <input
              type="number"
              value={extraConfig.lmsMaxVideoSize}
              onChange={(e) =>
                updateExtraConfig("lmsMaxVideoSize", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
        </div>
      </div>

      {/* POLICY BLOCK 2: MANDATORY TRAINING RULES */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          MANDATORY TRAINING RULES
        </span>
        <div className="space-y-3">
          {[
            {
              key: "lmsMandatoryEnabled",
              label: "Enable Mandatory Training Module",
              desc: "Set required courses that all or specific employees must complete",
            },
            {
              key: "lmsBlockAccess",
              label: "Block System Access Until Mandatory Training Done",
              desc: "New employees cannot use EMS until onboarding training is complete",
            },
            {
              key: "lmsAutoAssign",
              label: "Auto-assign Role-based Training on Joining",
              desc: "New employees automatically enrolled in role-specific courses",
            },
            {
              key: "lmsSetDeadline",
              label: "Set Training Completion Deadline",
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
              {item.key === "lmsSetDeadline" && extraConfig.lmsSetDeadline && (
                <input
                  type="text"
                  value={extraConfig.lmsDeadlineDays}
                  onChange={(e) =>
                    updateExtraConfig("lmsDeadlineDays", e.target.value)
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

      {/* POLICY BLOCK 3: COMPLETION & CERTIFICATION */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          COMPLETION & CERTIFICATION
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Passing Score (%)
            </label>
            <input
              type="number"
              value={extraConfig.lmsPassingScore}
              onChange={(e) =>
                updateExtraConfig("lmsPassingScore", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Max Attempts per Quiz
            </label>
            <input
              type="number"
              value={extraConfig.lmsMaxAttempts}
              onChange={(e) =>
                updateExtraConfig("lmsMaxAttempts", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Certificate Valid For
            </label>
            <select
              value={extraConfig.lmsCertValidFor}
              onChange={(e) =>
                updateExtraConfig("lmsCertValidFor", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>1 Year</option>
              <option>6 months</option>
              <option>2 years</option>
              <option>Lifetime</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Reminder Before Expiry (days)
            </label>
            <input
              type="number"
              value={extraConfig.lmsReminderBeforeExpiry}
              onChange={(e) =>
                updateExtraConfig("lmsReminderBeforeExpiry", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              key: "lmsIssueCert",
              label: "Issue Digital Certificate on Completion",
            },
            {
              key: "lmsShowCertProfile",
              label: "Show Certificate on Employee Profile",
            },
            {
              key: "lmsRequireSignOff",
              label: "Require Manager Sign-off for Course Completion",
            },
            {
              key: "lmsTrackProgress",
              label: "Track Course Progress in Real-time",
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

      {/* POLICY BLOCK 4: TRAINING BUDGET */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          TRAINING BUDGET
        </span>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Annual Training Budget per Employee (₹)
            </label>
            <input
              type="text"
              value={extraConfig.lmsAnnualBudget}
              onChange={(e) =>
                updateExtraConfig("lmsAnnualBudget", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Department Training Budget Allocation
            </label>
            <select
              value={extraConfig.lmsDeptAllocation}
              onChange={(e) =>
                updateExtraConfig("lmsDeptAllocation", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            >
              <option>Proportional to Headcount</option>
              <option>Fixed Equal</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-800 dark:text-gray-200">
              External Training Reimbursement
            </span>
            <button
              onClick={() =>
                updateExtraConfig(
                  "lmsExternalReimbursement",
                  !extraConfig.lmsExternalReimbursement,
                )
              }
              style={{
                width: "36px",
                height: "20px",
                borderRadius: "20px",
                backgroundColor: extraConfig.lmsExternalReimbursement
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
                  left: extraConfig.lmsExternalReimbursement ? "18px" : "2px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "all 0.2s",
                }}
              />
            </button>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1 uppercase">
              Reimbursement Cap per Course (₹)
            </label>
            <input
              type="text"
              value={extraConfig.lmsReimbursementCap}
              onChange={(e) =>
                updateExtraConfig("lmsReimbursementCap", e.target.value)
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm border bg-white dark:bg-neutral-800"
              style={{ borderColor: "#E5E7EB", color: "var(--foreground)" }}
            />
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              key: "lmsRequirePreApproval",
              label: "Require Pre-approval for External Training",
              desc: "Employees must get HR + manager approval before external course",
            },
            {
              key: "lmsTrackRoi",
              label: "Track Training ROI (Performance Impact)",
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

      {/* POLICY BLOCK 5: GAMIFICATION */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "#E5E7EB" }}
      >
        <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
          GAMIFICATION
        </span>
        <div className="space-y-3">
          {[
            {
              key: "lmsLeaderboard",
              label: "Enable Learning Leaderboard",
              desc: "Top learners visible on employee dashboard",
            },
            {
              key: "lmsAwardPoints",
              label: "Award Points for Course Completion",
              desc: "",
            },
            {
              key: "lmsBadges",
              label: "Enable Badges & Achievements",
              desc: "",
            },
            {
              key: "lmsShowTeamProgress",
              label: "Show Team Learning Progress",
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

      <div
        className="flex justify-end items-center pt-4 border-t"
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
          onClick={() => showToast("Training settings saved")}
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
