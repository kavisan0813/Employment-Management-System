import React, { useState, useEffect } from "react";
import { useSettingsContext } from "../SettingsContext";
import { useAuth } from "../../../../context/AuthContext";
import { usePermissions } from "../../../../shared/permission-engine/PermissionContext";
import { P } from "../../../../shared/permission-engine/permissions";
import { ChevronRight, CheckCircle2, ShieldCheck, ArrowRight, Layers, Save } from "lucide-react";
import { LeaveService } from "../../../hr/hr-operations/leave/leaveService";
import { ApprovalLayerType } from "../../../hr/hr-operations/leave/types";

export function ApprovalWorkflowsSection() {
  const { user } = useAuth();
  const { hasPermissionKey } = usePermissions();
  const { extraConfig, setActiveModal, showToast, updateExtraConfig } =
    useSettingsContext();

  // Active Tenant Leave Workflow Layer State
  const [activeLayer, setActiveLayer] = useState<ApprovalLayerType>(() => {
    return LeaveService.getWorkflowConfig(user?.organizationId).layerType;
  });

  useEffect(() => {
    const config = LeaveService.getWorkflowConfig(user?.organizationId);
    setActiveLayer(config.layerType);
  }, [user?.organizationId]);

  const handleSaveWorkflowConfig = (layer: ApprovalLayerType) => {
    if (
      !hasPermissionKey(P.SETTINGS_MANAGE) &&
      !hasPermissionKey(P.ROLES_MANAGE) &&
      !hasPermissionKey(P.LEAVE_MANAGE) &&
      !hasPermissionKey(P.PLATFORM_ADMIN_FULL)
    ) {
      showToast("Permission denied: Action requires Workflow Management authorization.", "error");
      return;
    }
    setActiveLayer(layer);
    LeaveService.saveWorkflowConfig(layer, user?.organizationId);
    showToast(`Leave approval workflow updated to ${layer === "SINGLE" ? "Single Layer (TL)" : layer === "DOUBLE" ? "Double Layer (TL -> Manager)" : "Third Layer (TL -> HR -> Manager)"}`, "success");
  };

  const workflows = [
    {
      name: "Leave Approval",
      desc: "When leave is requested (Runtime Connected)",
      trigger: "leave.applied",
      steps: activeLayer === "SINGLE" ? "1 step (TL)" : activeLayer === "DOUBLE" ? "2 steps (TL -> Mgr)" : "3 steps (TL -> HR -> Mgr)",
      applies: "All Employees",
      status: "RUNTIME CONNECTED",
      color: "#00B87C",
      isLive: true,
    },
    {
      name: "Expense Reimbursement",
      desc: "When expense is submitted (Preview Only)",
      trigger: "expense.submitted",
      steps: "2 steps",
      applies: "All Employees",
      status: "CONFIGURATION PREVIEW",
      color: "#F59E0B",
      isLive: false,
    },
    {
      name: "Payroll Approval",
      desc: "Before payroll is processed (Preview Only)",
      trigger: "payroll.pre-run",
      steps: "3 steps",
      applies: "Finance + HR",
      status: "CONFIGURATION PREVIEW",
      color: "#8B5CF6",
      isLive: false,
    },
    {
      name: "Increment Approval",
      desc: "When increment is proposed (Preview Only)",
      trigger: "increment.proposed",
      steps: "4 steps",
      applies: "Managers",
      status: "CONFIGURATION PREVIEW",
      color: "#F59E0B",
      isLive: false,
    },
    {
      name: "Offboarding Checklist",
      desc: "When resignation is submitted (Preview Only)",
      trigger: "employee.resigned",
      steps: "5 steps",
      applies: "HR + IT + Finance",
      status: "CONFIGURATION PREVIEW",
      color: "#EF4444",
      isLive: false,
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
              color: "var(--foreground, #111827)",
              margin: 0,
            }}
          >
            Approval Workflows
          </h2>
          <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "2px" }}>
            Configure multi-step approval chains for HR processes (Tenant Scoped)
          </p>
        </div>
      </div>

      {/* SECTION: CONFIGURABLE LEAVE APPROVAL WORKFLOW SELECTOR */}
      <div className="p-5 rounded-2xl mb-6 border bg-card border-border shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#00B87C]">
            <Layers size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Leave Management Approval Layer Configuration
            </h3>
            <p className="text-xs text-muted-foreground">
              Select the tenant-scoped approval pipeline for all employee leave applications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* SINGLE LAYER */}
          <div
            onClick={() => handleSaveWorkflowConfig("SINGLE")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeLayer === "SINGLE"
                ? "bg-[#00B87C]/10 border-[#00B87C] ring-2 ring-[#00B87C]/20"
                : "bg-background border-border hover:border-[#00B87C]/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-foreground">
                SINGLE LAYER
              </span>
              {activeLayer === "SINGLE" && (
                <CheckCircle2 size={16} className="text-[#00B87C]" />
              )}
            </div>
            <p className="text-xs font-bold text-[#00B87C] mb-1">
              Employee → Team Lead (TL)
            </p>
            <p className="text-[11px] text-muted-foreground">
              Direct Team Lead approval yields immediate final approval status.
            </p>
          </div>

          {/* DOUBLE LAYER (DEFAULT) */}
          <div
            onClick={() => handleSaveWorkflowConfig("DOUBLE")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeLayer === "DOUBLE"
                ? "bg-[#00B87C]/10 border-[#00B87C] ring-2 ring-[#00B87C]/20"
                : "bg-background border-border hover:border-[#00B87C]/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-foreground">
                DOUBLE LAYER (Default)
              </span>
              {activeLayer === "DOUBLE" && (
                <CheckCircle2 size={16} className="text-[#00B87C]" />
              )}
            </div>
            <p className="text-xs font-bold text-[#00B87C] mb-1">
              Employee → TL → Manager
            </p>
            <p className="text-[11px] text-muted-foreground">
              Requires Team Lead approval followed by Manager final sign-off.
            </p>
          </div>

          {/* THIRD LAYER */}
          <div
            onClick={() => handleSaveWorkflowConfig("THIRD")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeLayer === "THIRD"
                ? "bg-[#00B87C]/10 border-[#00B87C] ring-2 ring-[#00B87C]/20"
                : "bg-background border-border hover:border-[#00B87C]/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-foreground">
                THIRD LAYER
              </span>
              {activeLayer === "THIRD" && (
                <CheckCircle2 size={16} className="text-[#00B87C]" />
              )}
            </div>
            <p className="text-xs font-bold text-[#00B87C] mb-1">
              Employee → TL → HR → Manager
            </p>
            <p className="text-[11px] text-muted-foreground">
              Full enterprise chain: TL approval, HR compliance review, Manager final sign-off.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: ACTIVE WORKFLOWS TABLE */}
      <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
        ACTIVE WORKFLOWS CATALOG
      </span>
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                {[
                  "WORKFLOW NAME",
                  "TRIGGER",
                  "CONFIGURED STEPS",
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
              {workflows.map((w) => (
                <tr
                  key={w.name}
                  className="border-b border-border hover:bg-[#00B87C]/[0.08] transition-all text-[13px]"
                >
                  <td className="py-3 px-4">
                    <span className="block font-bold text-foreground">
                      {w.name}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">{w.desc}</span>
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
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                      {w.steps}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{w.applies}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      w.isLive
                        ? "bg-[#00B87C]/15 text-[#00B87C] border border-[#00B87C]/30"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => showToast(`Configured workflow: ${w.name}`)}
                      className="px-2.5 py-1 text-[11px] font-bold border border-border rounded-lg text-foreground bg-background hover:bg-muted cursor-pointer"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION: DYNAMIC WORKFLOW BUILDER PREVIEW */}
      <span className="block text-[11px] font-bold text-[#94A3B8] mb-3 uppercase">
        ACTIVE LEAVE WORKFLOW PIPELINE PREVIEW ({activeLayer} LAYER)
      </span>
      <div
        className="p-6 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between gap-4 overflow-x-auto py-4">
          {/* Step 1: Employee */}
          <div className="flex flex-col items-center text-center min-w-[130px] border border-border rounded-xl p-4 relative bg-background">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#00B87C] font-bold text-xs mb-2">
              1
            </div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              Employee
            </span>
            <span className="block font-bold text-[13px] text-foreground mt-1">
              Submits Request
            </span>
            <span className="inline-block text-[11px] bg-[#DCFCE7] text-[#00B87C] font-bold px-2 py-0.5 rounded-full mt-2">
              Trigger
            </span>
          </div>

          <div className="flex items-center flex-1 min-w-[30px] justify-center">
            <div className="h-[2px] bg-[#00B87C] flex-1" />
            <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
          </div>

          {/* Stage 1: Team Lead (ALWAYS PRESENT IN ALL 3 WORKFLOWS) */}
          <div className="flex flex-col items-center text-center min-w-[130px] border border-border rounded-xl p-4 relative bg-background">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#00B87C] font-bold text-xs mb-2">
              2
            </div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              Team Lead (TL)
            </span>
            <span className="block font-bold text-[13px] text-foreground mt-1">
              Initial Approval
            </span>
            <span className="inline-block text-[11px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full mt-2">
              Stage 1
            </span>
          </div>

          {/* Stage 2: HR (ONLY PRESENT IN THIRD LAYER) */}
          {activeLayer === "THIRD" && (
            <>
              <div className="flex items-center flex-1 min-w-[30px] justify-center">
                <div className="h-[2px] bg-[#00B87C] flex-1" />
                <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
              </div>
              <div className="flex flex-col items-center text-center min-w-[130px] border border-border rounded-xl p-4 relative bg-background">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 font-bold text-xs mb-2">
                  3
                </div>
                <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
                  HR Review
                </span>
                <span className="block font-bold text-[13px] text-foreground mt-1">
                  Compliance Review
                </span>
                <span className="inline-block text-[11px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full mt-2">
                  Stage 2
                </span>
              </div>
            </>
          )}

          {/* Stage 2 or 3: Manager (PRESENT IN DOUBLE AND THIRD LAYERS) */}
          {(activeLayer === "DOUBLE" || activeLayer === "THIRD") && (
            <>
              <div className="flex items-center flex-1 min-w-[30px] justify-center">
                <div className="h-[2px] bg-[#00B87C] flex-1" />
                <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
              </div>
              <div className="flex flex-col items-center text-center min-w-[130px] border border-border rounded-xl p-4 relative bg-background">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 font-bold text-xs mb-2">
                  {activeLayer === "DOUBLE" ? 3 : 4}
                </div>
                <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
                  Manager
                </span>
                <span className="block font-bold text-[13px] text-foreground mt-1">
                  Final Sign-Off
                </span>
                <span className="inline-block text-[11px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full mt-2">
                  {activeLayer === "DOUBLE" ? "Stage 2" : "Stage 3"}
                </span>
              </div>
            </>
          )}

          {/* Final Step: Approved */}
          <div className="flex items-center flex-1 min-w-[30px] justify-center">
            <div className="h-[2px] bg-[#00B87C] flex-1" />
            <ChevronRight className="text-[#00B87C]" size={16} style={{ marginLeft: "-10px" }} />
          </div>
          <div className="flex flex-col items-center text-center min-w-[130px] border border-border rounded-xl p-4 relative bg-background">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#00B87C] text-white font-bold text-xs mb-2">
              ✓
            </div>
            <span className="block text-[11px] font-bold text-[#94A3B8] uppercase">
              Request Status
            </span>
            <span className="block font-bold text-[13px] text-foreground mt-1">
              APPROVED
            </span>
            <span className="inline-block text-[11px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full mt-2">
              Auto
            </span>
          </div>
        </div>
      </div>

      {/* POLICY BLOCK: GLOBAL WORKFLOW RULES */}
      <div
        className="p-4 rounded-xl mb-6 border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
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
              key: "workflowCcHr",
              label: "CC HR on all approval decisions",
              desc: "",
            },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[13px] font-medium text-foreground block">
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
                    transition: "background-color 0.2s",
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
                      transition: "left 0.2s",
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex justify-end items-center pt-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => showToast(`Leave approval settings saved for ${activeLayer} Layer workflow.`)}
          className="bg-[#00B87C] hover:bg-[#009966] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-2"
        >
          <Save size={14} /> Save Workflow Settings
        </button>
      </div>
    </div>
  );
}
