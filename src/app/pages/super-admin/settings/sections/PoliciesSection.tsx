import React, { useState } from "react";
import { useSettingsContext } from "../SettingsContext";
import { CanonicalModuleLink } from "../components/CanonicalModuleLink";
import type { PolicyCategory, PolicyRecord } from "../services/policyService";

export function PoliciesSection() {
  const {
    policiesList,
    setSelectedPolicy,
    setPolicyForm,
    setActiveModal,
    showToast,
  } = useSettingsContext();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");

  const categories = ["All", "HR", "Attendance", "Leave", "Payroll", "Security", "Expense", "RemoteWork", "CodeOfConduct"];

  const filteredPolicies = (policiesList || []).filter(
    (p: PolicyRecord) => activeCategoryFilter === "All" || p.category === activeCategoryFilter
  );

  return (
    <div className="space-y-6">
      {/* CANONICAL SHORTCUT */}
      <CanonicalModuleLink
        title="Leave Entitlements & Operational Leave Types"
        description="Operational leave types, accrual balances, encashment policies, and carry-forward rules are managed within Leave Management."
        iconName="TreePalm"
        buttonLabel="Manage Leave Settings"
        targetPath="/hr/leave"
      />

      {/* HEADER & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Corporate Policies & Governance
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage organization-wide HR, Leave, Payroll, and Security policies.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPolicyForm({
              category: "HR" as PolicyCategory,
              name: "",
              description: "",
              content: "",
              effectiveDate: new Date().toISOString().split("T")[0],
              status: "Active",
            });
            setSelectedPolicy(null);
            setActiveModal("add_policy");
          }}
          className="px-4 py-2 bg-[#00B87C] hover:bg-[#00B87C]/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
        >
          + Add Policy
        </button>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              activeCategoryFilter === cat
                ? "bg-[#00B87C] text-white border-[#00B87C]"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            {cat === "All" ? "All Policies" : cat}
          </button>
        ))}
      </div>

      {/* POLICIES CARDS / LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPolicies.map((policy: PolicyRecord) => (
          <div
            key={policy.id}
            className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between hover:border-[#00B87C]/30 transition-all"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-[#00B87C]/10 text-[#00B87C]">
                  {policy.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    policy.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : policy.status === "Draft"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {policy.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                {policy.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {policy.description || policy.content}
              </p>
              <div className="text-[11px] text-muted-foreground space-y-0.5 mb-4 bg-muted/30 p-2.5 rounded-xl border border-border/40">
                <div>
                  <span className="font-semibold">Version:</span> {policy.version || "v1.0"}
                </div>
                <div>
                  <span className="font-semibold">Effective:</span> {policy.effectiveDate}
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span> {policy.updatedAt} by {policy.updatedBy || "System"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
              <button
                type="button"
                onClick={() => {
                  setSelectedPolicy(policy);
                  setPolicyForm({
                    category: policy.category,
                    name: policy.name,
                    description: policy.description || "",
                    content: policy.content || "",
                    effectiveDate: policy.effectiveDate || new Date().toISOString().split("T")[0],
                    status: policy.status,
                  });
                  setActiveModal("edit_policy");
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#00B87C] text-[#00B87C] hover:bg-[#00B87C]/10 cursor-pointer transition-colors"
              >
                Edit Policy
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPolicy(policy);
                  setActiveModal("archive_policy");
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPolicies.length === 0 && (
        <div className="p-8 text-center bg-card rounded-2xl border border-border text-muted-foreground text-xs">
          No policies found matching category "{activeCategoryFilter}".
        </div>
      )}
    </div>
  );
}
