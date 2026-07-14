import React, { useState } from "react";
import { useSettingsContext } from "../SettingsContext";
import { ChevronRight } from "lucide-react";
import type { LeaveTypeRecord } from "../SettingsContext";

export function LeavePolicySection() {
  const {
    SectionTitle,
    leaveTypesList,
    setActiveModal,
    setLeaveTypeForm,
    setSelectedLeaveType,
  } = useSettingsContext();

  const [lpApprovalLevels, setLpApprovalLevels] = useState("1");
  const [lpAutoApprove, setLpAutoApprove] = useState(false);
  const [lpCarryForwardLimit, setLpCarryForwardLimit] = useState("10");
  const [lpEligibilityMonths, setLpEligibilityMonths] = useState("3");
  const [lpEncashmentLimit, setLpEncashmentLimit] = useState("15");
  const lpLastUpdatedBy = "Ryan Park";
  const lpLastUpdatedTime = "Apr 18, 2026";
  const lpPolicyVersion = "v2.4";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-[12px] font-medium">
        <span style={{ color: "var(--muted-foreground)" }}>Settings</span>
        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
        <span style={{ color: "#00B87C" }}>Leave Policy</span>
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
            Leave Policy Configuration
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Version {lpPolicyVersion} • Last saved {lpLastUpdatedTime} by{" "}
            {lpLastUpdatedBy}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal("confirm_save_policy")}
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--foreground)",
              cursor: "pointer",
            }}
          >
            Save Policy
          </button>
          <button
            onClick={() => {
              setLeaveTypeForm({
                name: "",
                code: "",
                days: 12,
                type: "Paid",
                carryForward: false,
                maxCarryForward: 0,
                encashment: false,
                approvalRequired: true,
                attachmentRequired: false,
                minNoticePeriod: 1,
                maxConsecutiveLeave: 5,
                dept: "All",
                location: "All Locations",
                status: "Active",
                description: "",
              });
              setSelectedLeaveType(null);
              setActiveModal("add_leave_type");
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
            + Add Leave Type
          </button>
        </div>
      </div>

      {/* SECTION 1: LEAVE TYPES */}
      <SectionTitle title="1. Leave Types" />
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
                "LEAVE TYPE",
                "CODE",
                "ENTITLEMENT",
                "TYPE",
                "CARRY FORWARD",
                "APPROVAL",
                "ATTACHMENT",
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
            {leaveTypesList.map(
              (l: LeaveTypeRecord, idx: React.Key | null | undefined) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid #F3F4F6",
                    height: "56px",
                  }}
                  className="hover:bg-[#00B87C]/[0.08] transition-all"
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {l.name}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {l.code}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {l.days} Days
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor:
                          l.type === "Paid"
                            ? "rgba(0, 184, 124, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                        color: l.type === "Paid" ? "#00B87C" : "#EF4444",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {l.type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {l.carryForward ? `Yes (Max ${l.maxCarryForward}d)` : "No"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {l.approvalRequired ? "Required" : "Auto"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {l.attachmentRequired ? "Mandatory" : "Optional"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        backgroundColor:
                          l.status === "Active"
                            ? "rgba(0, 184, 124, 0.1)"
                            : "rgba(107, 114, 128, 0.1)",
                        color: l.status === "Active" ? "#00B87C" : "#6B7280",
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedLeaveType(l);
                          setLeaveTypeForm({
                            name: l.name,
                            code: l.code,
                            days: l.days,
                            type: l.type,
                            carryForward: l.carryForward,
                            maxCarryForward: l.maxCarryForward,
                            encashment: l.encashment,
                            approvalRequired: l.approvalRequired,
                            attachmentRequired: l.attachmentRequired,
                            minNoticePeriod: l.minNoticePeriod,
                            maxConsecutiveLeave: l.maxConsecutiveLeave,
                            dept: l.dept,
                            location: l.location,
                            status: l.status,
                            description: l.description,
                          });
                          setActiveModal("edit_leave_type");
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
                          setSelectedLeaveType(l);
                          setActiveModal("delete_leave_type");
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
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* SECTION 2: APPROVAL RULES */}
      <SectionTitle title="2. Approval Rules" />
      <div
        className="p-6 rounded-2xl border mb-6 space-y-4"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <span
              style={{
                fontSize: "14px",
                color: "var(--foreground)",
                fontWeight: 600,
              }}
            >
              Approval Levels
            </span>
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginTop: "2px",
              }}
            >
              Number of approval stages required per request
            </p>
          </div>
          <select
            value={lpApprovalLevels}
            onChange={(e) => setLpApprovalLevels(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value={1}>1 Level (Manager)</option>
            <option value={2}>2 Levels (Manager + HR)</option>
            <option value={3}>3 Levels (Manager + Dept Head + HR)</option>
          </select>
        </div>
        <div className="flex justify-between items-center py-2">
          <div>
            <span
              style={{
                fontSize: "14px",
                color: "var(--foreground)",
                fontWeight: 600,
              }}
            >
              Auto-Approve if no action taken
            </span>
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginTop: "2px",
              }}
            >
              Automatically approves requests after 7 days
            </p>
          </div>
          <button
            onClick={() => setLpAutoApprove(!lpAutoApprove)}
            style={{
              width: "36px",
              height: "20px",
              borderRadius: "20px",
              backgroundColor: lpAutoApprove
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
                left: lpAutoApprove ? "18px" : "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "white",
                transition: "all 0.2s",
              }}
            />
          </button>
        </div>

        {/* Approval chain visual (horizontal stepper) */}
        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <span className="block text-[11px] font-bold text-[var(--muted-foreground)] uppercase mb-4">
            Leave Approval Workflow
          </span>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
            {[
              { role: "Employee", label: "Applies" },
              { role: "Manager", label: "Level 1 (within 2 days)" },
              { role: "HR Manager", label: "Level 2 (within 2 days)" },
              { role: "Auto-Approved", label: "Complete" },
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div
                  className="flex flex-col items-center text-center p-4 rounded-xl flex-1 bg-white dark:bg-neutral-800 border border-[#E5E7EB]"
                  style={{ minWidth: "160px" }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {step.role}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      marginTop: "4px",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className="hidden md:block h-[2px] bg-[#00B87C] flex-1 mx-2"
                    style={{ minWidth: "20px" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3 & 4: CARRY FORWARD & ENCASHMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionTitle title="3. Carry Forward Rules" />
          <div className="mt-4 space-y-4">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Global Max Carry Forward Limit (Days)
              </label>
              <input
                type="number"
                value={lpCarryForwardLimit}
                onChange={(e) => setLpCarryForwardLimit(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm border"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <SectionTitle title="4. Encashment Rules" />
          <div className="mt-4 space-y-4">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Max Encashment Days per Year
              </label>
              <input
                type="number"
                value={lpEncashmentLimit}
                onChange={(e) => setLpEncashmentLimit(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm border"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: ELIGIBILITY RULES */}
      <SectionTitle title="5. Eligibility Rules" />
      <div
        className="p-6 rounded-2xl border mb-6 space-y-4"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <span
              style={{
                fontSize: "14px",
                color: "var(--foreground)",
                fontWeight: 600,
              }}
            >
              Probation Lock-in Period
            </span>
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginTop: "2px",
              }}
            >
              Minimum months an employee must complete before applying for leave
            </p>
          </div>
          <select
            value={lpEligibilityMonths}
            onChange={(e) => setLpEligibilityMonths(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none border"
            style={{
              backgroundColor: "var(--input-background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value={0}>0 Months (Immediate)</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
          </select>
        </div>
      </div>

      {/* SECTION 6: POLICY SUMMARY */}
      <SectionTitle title="6. Policy Summary" />
      <div
        className="p-6 rounded-2xl border mb-6 shadow-sm"
        style={{
          backgroundColor: "rgba(0, 184, 124, 0.05)",
          borderColor: "rgba(0, 184, 124, 0.2)",
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "#00B87C", margin: "0 0 6px 0" }}
        >
          Leave Entitlements at a Glance
        </p>
        <div
          className="text-xs space-y-1"
          style={{ color: "var(--foreground)" }}
        >
          {leaveTypesList.map(
            (l: LeaveTypeRecord) => (
              <div key={l.code}>
                • {l.name} ({l.code}):{" "}
                <span className="font-bold">{l.days} Days</span> per year |
                Carryforward: {l.carryForward ? "Yes" : "No"}
              </div>
            ),
          )}
        </div>
      </div>

      {/* SAVE BAR */}
      <div
        className="flex justify-end items-center pt-4 mt-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => setActiveModal("confirm_save_policy")}
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
          Save Policy Changes
        </button>
      </div>
    </div>
  );
}
