import React, { useState } from "react";
import { db } from "../../../../admin/mockData";
import type { FeatureFlag } from "../../../../admin/types";
import { useSettingsContext } from "../SettingsContext";
import { usePermissions } from "../../../../shared/permission-engine/PermissionContext";
import { P } from "../../../../shared/permission-engine/permissions";
import * as Icons from "lucide-react";

export function FeatureManagementSection() {
  const { showToast } = useSettingsContext();
  const { hasPermissionKey } = usePermissions();
  const [flags, setFlags] = useState<FeatureFlag[]>(() => db.featureFlags.get());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [targetDisableFlag, setTargetDisableFlag] = useState<FeatureFlag | null>(null);

  const handleActionClick = (flag: FeatureFlag) => {
    if (!hasPermissionKey(P.SETTINGS_MANAGE) && !hasPermissionKey(P.PLATFORM_ADMIN_FULL)) {
      showToast("Permission denied: Feature management requires administrator privileges.", "error");
      return;
    }

    if (flag.status === "Active") {
      // Prompt confirmation modal for disabling
      setTargetDisableFlag(flag);
    } else {
      // Direct enable
      performToggle(flag.id);
    }
  };

  const performToggle = (id: string) => {
    const updated = flags.map((f) => {
      if (f.id === id) {
        const nextStatus: "Active" | "Inactive" = f.status === "Active" ? "Inactive" : "Active";
        showToast(`Feature "${f.name}" status updated to ${nextStatus}`, "success");
        return {
          ...f,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return f;
    });
    setFlags(updated);
    db.featureFlags.save(updated);
  };

  const confirmDisable = () => {
    if (targetDisableFlag) {
      performToggle(targetDisableFlag.id);
      setTargetDisableFlag(null);
    }
  };

  const filteredFlags = flags.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.key.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || f.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Feature Management & Module Overrides
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Control feature flag availability, plan tier requirements, and organization overrides.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="relative w-full sm:w-72">
          <Icons.Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search features or keys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-input-background text-foreground outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "Core", "Beta", "Experimental", "Deprecated"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                categoryFilter === cat
                  ? "bg-[#00B87C] text-white border-[#00B87C]"
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="p-3.5 pl-5">Feature</th>
                <th className="p-3.5">Module / Category</th>
                <th className="p-3.5">Plan Requirement</th>
                <th className="p-3.5">Org Override</th>
                <th className="p-3.5">Effective Status</th>
                <th className="p-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredFlags.map((flag) => {
                const isEnabled = flag.status === "Active";
                const planReq = flag.enabledPlans?.join(", ") || "Starter+";
                const hasOverride = flag.enabledOrgIds && flag.enabledOrgIds.length > 0;

                return (
                  <tr key={flag.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-foreground">{flag.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{flag.key}</div>
                    </td>
                    <td className="p-3.5 font-medium">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-muted text-muted-foreground">
                        {flag.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-muted-foreground font-medium">{planReq}</td>
                    <td className="p-3.5 font-medium">
                      {hasOverride ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600">
                          {flag.enabledOrgIds.length} Orgs Overridden
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isEnabled
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-rose-500/10 text-rose-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isEnabled ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleActionClick(flag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isEnabled
                            ? "border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                            : "border-[#00B87C] text-[#00B87C] hover:bg-[#00B87C]/10"
                        }`}
                      >
                        {isEnabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FEATURE DISABLE CONFIRMATION MODAL */}
      {targetDisableFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0">
                <Icons.AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Disable Feature: {targetDisableFlag.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">{targetDisableFlag.key}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-2">
              <p className="font-bold text-rose-600 dark:text-rose-400">
                Disabling this feature is at your own risk.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Navigation options for this module may disappear from user menus</li>
                <li>Users will lose access to associated controls and actions</li>
                <li>Existing underlying data remains preserved unless actual behavior differs</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTargetDisableFlag(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-foreground border border-border bg-card hover:bg-muted cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDisable}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer shadow-sm transition-all"
              >
                Disable Feature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

