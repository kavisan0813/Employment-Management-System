/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { db, pushAuditLog } from "../../mockData";
import { FeatureFlag, Organization } from "../../types";
import { 
  ToggleLeft, Search, Plus, ChevronDown, Trash2, Eye, X, 
  Settings, CheckSquare, Square, Copy, Archive
} from "lucide-react";

const CURRENT_ADMIN_EMAIL = "admin@ems.io";

export default function FeatureManagementView({ onNavigate = () => {} }: { onNavigate?: (view: string, targetId?: string) => void }) {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Drawer states
  const [drawerFlag, setDrawerFlag] = useState<FeatureFlag | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formKey, setFormKey] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<FeatureFlag["category"]>("Beta");
  const [formDefaultState, setFormDefaultState] = useState(true);

  // Drawer Form parameters
  const [rolloutPctValue, setRolloutPctValue] = useState(100);
  const [enabledPlans, setEnabledPlans] = useState<("Starter" | "Growth" | "Enterprise")[]>([]);
  const [overrideOrgId, setOverrideOrgId] = useState("");

  const refreshData = () => {
    setFlags(db.featureFlags.get());
    setOrgs(db.organizations.get());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter Matching Logic
  const filteredFlags = flags.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || f.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || f.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const hasActiveFilters = categoryFilter !== "ALL" || statusFilter !== "ALL" || !!searchQuery;

  // Handle direct inline row toggle
  const toggleFlagActiveState = (flag: FeatureFlag) => {
    const nextState = !flag.defaultState;
    const currentFlags = db.featureFlags.get();
    const updated = currentFlags.map(f => {
      if (f.id === flag.id) {
        return { ...f, defaultState: nextState, updatedAt: new Date().toISOString() };
      }
      return f;
    });
    db.featureFlags.save(updated);

    pushAuditLog(
      "feature.toggle",
      "Admin Action",
      CURRENT_ADMIN_EMAIL,
      "platform_admin",
      null,
      "Active",
      { feature_key: flag.key, parameter_state: String(nextState) }
    );

    refreshData();
  };

  // Create flag pipeline execution
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKey || !formName) return;

    const keySlug = formKey.toLowerCase().replace(/[^a-z0-9_]/g, "");
    const duplicate = flags.find(f => f.key === keySlug);
    if (duplicate) {
      alert(`Flag key '${keySlug}' is already configured.`);
      return;
    }

    const newFlag: FeatureFlag = {
      id: `flag-${Date.now()}`,
      key: keySlug,
      name: formName,
      description: formDescription,
      category: formCategory,
      status: "Active",
      defaultState: formDefaultState,
      rolloutPct: 100,
      enabledPlans: ["Enterprise", "Growth", "Starter"],
      enabledOrgIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.featureFlags.save([newFlag, ...db.featureFlags.get()]);
    pushAuditLog("feature.create", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { key: keySlug, default_state: String(formDefaultState), category: formCategory });
    setIsCreateOpen(false);
    refreshData();
  };

  // Open Drawer configuration panel configuration mapping
  const handleConfigureDrawer = (flag: FeatureFlag) => {
    setDrawerFlag(flag);
    setRolloutPctValue(flag.rolloutPct);
    setEnabledPlans(flag.enabledPlans);
    setOverrideOrgId("");
  };

  const saveDrawerConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawerFlag) return;

    const updated = db.featureFlags.get().map(f => {
      if (f.id === drawerFlag.id) {
        return { ...f, rolloutPct: rolloutPctValue, enabledPlans: enabledPlans, updatedAt: new Date().toISOString() };
      }
      return f;
    });
    db.featureFlags.save(updated);

    pushAuditLog("feature.configure", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { feature_key: drawerFlag.key, rollout_pct: `${rolloutPctValue}%`, plans_assigned: enabledPlans.join(",") });
    setDrawerFlag(null);
    refreshData();
  };

  const handlePlanToggle = (plan: "Starter" | "Growth" | "Enterprise") => {
    setEnabledPlans(prev => prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]);
  };

  const handleAddOverride = () => {
    if (!drawerFlag || !overrideOrgId) return;

    if (drawerFlag.enabledOrgIds.includes(overrideOrgId)) {
      alert("Override already configured for this organization.");
      return;
    }

    db.featureFlags.save(db.featureFlags.get().map(f => 
      f.id === drawerFlag.id ? { ...f, enabledOrgIds: [...f.enabledOrgIds, overrideOrgId] } : f
    ));

    pushAuditLog("feature.override_added", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { feature_key: drawerFlag.key, target_org_id: overrideOrgId });
    setDrawerFlag({ ...drawerFlag, enabledOrgIds: [...drawerFlag.enabledOrgIds, overrideOrgId] });
    setOverrideOrgId("");
    refreshData();
  };

  const removeOverride = (orgId: string) => {
    if (!drawerFlag) return;
    db.featureFlags.save(db.featureFlags.get().map(f => 
      f.id === drawerFlag.id ? { ...f, enabledOrgIds: f.enabledOrgIds.filter(id => id !== orgId) } : f
    ));

    setDrawerFlag({ ...drawerFlag, enabledOrgIds: drawerFlag.enabledOrgIds.filter(id => id !== orgId) });
    refreshData();
  };

  const archiveFlagElement = (flag: FeatureFlag) => {
    if (!confirm(`Are you sure you want to deactivate and archive '${flag.key}'?`)) return;
    db.featureFlags.save(db.featureFlags.get().map(f => 
      f.id === flag.id ? { ...f, status: "Inactive" as const, category: "Deprecated" as const, updatedAt: new Date().toISOString() } : f
    ));

    pushAuditLog("feature.archived", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { key: flag.key });
    refreshData();
  };

  // Core requirement duplication operator logic handler
  const handleDuplicateFlag = (flag: FeatureFlag, e: React.MouseEvent) => {
    e.stopPropagation();
    const clonedFlag: FeatureFlag = {
      ...flag,
      id: `flag-${Date.now()}`,
      key: `${flag.key}_clone_${Date.now().toString().slice(-4)}`,
      name: `${flag.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.featureFlags.save([clonedFlag, ...db.featureFlags.get()]);
    pushAuditLog("feature.duplicate", "Admin Action", CURRENT_ADMIN_EMAIL, "platform_admin", null, "Active", { base_key: flag.key, cloned_key: clonedFlag.key });
    refreshData();
  };

  return (
    <div className="space-y-5 relative">
      
      {/* Module Title Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2">
            <ToggleLeft className="w-5 h-5 text-indigo-600" />
            Feature Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Console matrix routing rules that control which platform capabilities are live across plan tiers.</p>
        </div>
        <button
          onClick={() => { setFormKey(""); setFormName(""); setFormDescription(""); setIsCreateOpen(true); }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> New Feature Flag
        </button>
      </div>

      {/* Filtering Control Row Container */}
      <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by flag name or unique slug key string parameters…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <FilterSelect label="Category" value={categoryFilter} onChange={setCategoryFilter} options={[
              ["ALL", "All categories"], ["Core", "Core Engine"], ["Beta", "Beta / Sandbox"], ["Experimental", "Experimental"], ["Deprecated", "Deprecated"]
            ]} />
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[
              ["ALL", "All statuses"], ["Active", "Active"], ["Inactive", "Archived"]
            ]} />

            {hasActiveFilters && (
              <button
                onClick={() => { setCategoryFilter("ALL"); setStatusFilter("ALL"); setSearchQuery(""); }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Core Ledger Table Grid Frame Layout */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">Feature Name & Explanation</th>
                <th className="px-4 py-3">Slug Key</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Default State</th>
                <th className="px-4 py-3">Rollout Pct</th>
                <th className="px-4 py-3">Applies To</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center w-72">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFlags.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">No feature flags configured into this layout pipeline bounds index yet.</td>
                </tr>
              ) : (
                filteredFlags.map((flag) => (
                  <tr key={flag.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{flag.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 max-w-xs truncate" title={flag.description}>{flag.description}</p>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-gray-500 bg-gray-50/30">{flag.key}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        flag.category === "Core" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                        flag.category === "Beta" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-purple-50 text-purple-700 border-purple-100"
                      }`}>{flag.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFlagActiveState(flag)}
                        disabled={flag.status === "Inactive"}
                        className={`relative inline-flex items-center h-5 rounded-full w-9 cursor-pointer transition-colors outline-none ${
                          flag.defaultState ? "bg-indigo-600" : "bg-gray-200"
                        } ${flag.status === "Inactive" ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <span className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${flag.defaultState ? "translate-x-5" : "translate-x-1"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full" style={{ width: `${flag.rolloutPct}%` }} />
                        </div>
                        <span className="font-mono text-gray-800 font-bold">{flag.rolloutPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-600">
                      <div>{flag.enabledPlans.join(", ")}</div>
                      {flag.enabledOrgIds.length > 0 && <span className="text-[10px] text-indigo-600 block font-semibold">+{flag.enabledOrgIds.length} forced overrides</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${flag.status === "Active" ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-rose-50 text-rose-700"}`}>{flag.status}</span>
                    </td>
                    {/* Aligned Static Width Action Grid Column Block (No Hover States) */}
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-1.5 bg-gray-50/80 p-1 rounded-lg border border-gray-100 max-w-[270px] mx-auto shadow-2xs">
                        <button
                          onClick={() => handleConfigureDrawer(flag)}
                          disabled={flag.status === "Inactive"}
                          className="w-14 py-1 text-center bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 rounded-md font-semibold cursor-pointer transition-all text-[11px] disabled:opacity-40"
                        >
                          Config
                        </button>
                        <button
                          onClick={(e) => handleDuplicateFlag(flag, e)}
                          className="w-14 py-1 text-center bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 rounded-md font-semibold cursor-pointer transition-all text-[11px]"
                        >
                          Clone
                        </button>
                        <button
                          onClick={() => onNavigate("Organizations")}
                          className="w-14 py-1 text-center bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 rounded-md font-semibold cursor-pointer transition-all text-[11px]"
                        >
                          Affects
                        </button>
                        <button
                          onClick={() => archiveFlagElement(flag)}
                          disabled={flag.status === "Inactive"}
                          className="w-14 py-1 text-center bg-white border border-gray-200 text-rose-600 hover:text-rose-700 hover:border-rose-200 rounded-md font-bold cursor-pointer transition-all text-[11px] disabled:opacity-40"
                        >
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODULE FLAG MODAL */}
      {isCreateOpen && (
        <Modal onClose={() => setIsCreateOpen(false)}>
          <ModalHeader icon={ToggleLeft} title="Initialize Feature Toggle" onClose={() => setIsCreateOpen(false)} />
          <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
            <Field label="Distinct unique slug identification key *" required>
              <input type="text" required placeholder="e.g. ai_timesheets_parse" value={formKey} onChange={(e) => setFormKey(e.target.value)} className={`${inputClass} font-mono`} />
            </Field>
            <Field label="Human-readable flag display name *" required>
              <input type="text" required placeholder="e.g. AI Timesheets Extraction Parser" value={formName} onChange={(e) => setFormName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Detailed explanation logic path description">
              <textarea placeholder="Provide engineering architectural scope metrics details..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Flag categorization bucket">
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as any)} className={inputClass}>
                  <option value="Beta">Beta / Sandbox Segment</option>
                  <option value="Core">Core System Engine</option>
                  <option value="Experimental">Experimental Lab Bound</option>
                </select>
              </Field>
              <div className="flex flex-col justify-end pb-1.5 pl-1">
                <label className="inline-flex items-center gap-2 font-medium text-gray-800 cursor-pointer select-none">
                  <input type="checkbox" checked={formDefaultState} onChange={(e) => setFormDefaultState(e.target.checked)} className="rounded border-gray-300 accent-indigo-600" /> Enabled by default
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-3.5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm cursor-pointer">Initialize flag</button>
            </div>
          </form>
        </Modal>
      )}

      {/* PROGRESSIVE ROLLOUT PARAMETERS CONFIGURATION DRAWER */}
      {drawerFlag && (
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Settings className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm">Rollout Context &bull; {drawerFlag.key}</h3>
            </div>
            <button onClick={() => setDrawerFlag(null)} className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md bg-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>

          <form onSubmit={saveDrawerConfig} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-gray-700">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Progressive Rollout Ratio</label>
              <p className="text-gray-400 text-[11px] leading-relaxed">Define the fractional sample of organizations matching the selected tiered cohorts that will resolve evaluation triggers to true.</p>
              <div className="flex items-center gap-4 pt-1">
                <input type="range" min="0" max="100" step="5" value={rolloutPctValue} onChange={(e) => setRolloutPctValue(Number(e.target.value))} className="flex-1 accent-indigo-600 cursor-pointer" />
                <span className="font-mono text-base font-bold text-gray-900 w-10 text-right">{rolloutPctValue}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Cohort Package Tiers</label>
              <div className="space-y-1.5">
                {(["Starter", "Growth", "Enterprise"] as const).map(plan => {
                  const isChecked = enabledPlans.includes(plan);
                  return (
                    <button
                      type="button"
                      key={plan}
                      onClick={() => handlePlanToggle(plan)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 flex items-center gap-3 hover:bg-gray-50 text-left font-medium"
                    >
                      {isChecked ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-gray-300" />}
                      <span>{plan} Subscriptions</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Forced Tenant Overrides</label>
              <p className="text-gray-400 text-[11px] leading-relaxed">Explicitly configure standalone organization overrides to force execute runtime branches completely bypass tier locks metrics.</p>
              <div className="flex gap-2 pt-1">
                <select value={overrideOrgId} onChange={(e) => setOverrideOrgId(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs outline-none">
                  <option value="">Select individual client workspace...</option>
                  {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
                <button type="button" onClick={handleAddOverride} className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs cursor-pointer">Add</button>
              </div>

              {drawerFlag.enabledOrgIds.length > 0 && (
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden bg-gray-50/50 text-[11px] font-medium">
                  {drawerFlag.enabledOrgIds.map(orgId => {
                    const matchedOrg = orgs.find(o => o.id === orgId);
                    return (
                      <div key={orgId} className="p-2 flex items-center justify-between">
                        <span>{matchedOrg ? matchedOrg.name : `Workspace Node ID: ${orgId}`}</span>
                        <button type="button" onClick={() => removeOverride(orgId)} className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer">Revoke</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-150">
              <button type="button" onClick={() => setDrawerFlag(null)} className="px-3 py-1.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 text-xs cursor-pointer">Cancel</button>
              <button type="submit" className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg cursor-pointer">Save layout configurations</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

// ---- Reusable Structural Presentation Presentational Helpers ----

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-bold tracking-wide text-gray-400">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// Reusable standard modal overlays
function Modal({ children, onClose, maxWidth = "max-w-md" }: { children: React.ReactNode; onClose: () => void; maxWidth?: string }) {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl w-full ${maxWidth}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ icon: Icon, title, onClose }: { icon: React.ComponentType<{ className?: string }>; title: string; onClose: () => void }) {
  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Icon className="w-4 h-4 text-indigo-600" />
        {title}
      </h3>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-4 h-4" /></button>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
      <span className="text-[10px] uppercase font-bold text-gray-400">{label}</span>
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-gray-800 text-xs py-0.5 pr-5 focus:outline-none font-medium appearance-none cursor-pointer z-10"
        >
          {options.map(([val, lbl]) => (
            <option key={val} value={val}>{lbl}</option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 pointer-events-none z-0" />
      </div>
    </div>
  );
}