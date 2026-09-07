import React, { useState } from "react";
import { ApprovalWorkflowsSection } from "./ApprovalWorkflowsSection";
import { LeaveApprovalsSection } from "./LeaveApprovalsSection";
import { CanonicalModuleLink } from "../components/CanonicalModuleLink";

export function ApprovalWorkflowsCombinedSection() {
  const [activeTab, setActiveTab] = useState<"all" | "leave" | "shifts">("all");

  return (
    <div className="space-y-6">
      {/* SUB TABS */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          All Approval Workflows
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("leave")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "leave"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Leave Approvals
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("shifts")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "shifts"
              ? "bg-[#00B87C] text-white shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          Shift Swap Rules
        </button>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "all" && <ApprovalWorkflowsSection />}
        {activeTab === "leave" && <LeaveApprovalsSection />}
        {activeTab === "shifts" && (
          <CanonicalModuleLink
            title="Shift Swap Rules & Roster Configuration"
            description="Shift swap approvals, deadline thresholds, and peer exchange rules belong to Schedule Management."
            iconName="Calendar"
            buttonLabel="Go to Schedule Management"
            targetPath="/hr/attendance"
          />
        )}
      </div>
    </div>
  );
}

