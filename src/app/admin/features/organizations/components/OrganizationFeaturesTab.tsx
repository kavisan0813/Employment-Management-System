import { useState } from "react";
import { Organization } from "../../../types";
import {
  FEATURE_REGISTRY,
  planMeetsRequirement,
  type SubscriptionPlan,
} from "../../../../shared/feature-engine/featureRegistry";
import { notifyFeatureStateChange } from "../../../../shared/feature-engine/featureEvents";
import {
  ToggleLeft,
  Lock,
  CheckCircle2,
  XCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "../../../../shared/permission-engine/PermissionContext";
import { P } from "../../../../shared/permission-engine/permissions";
import { PermissionGate } from "../../../../shared/permission-engine/PermissionGate";

export function OrganizationFeaturesTab({
  org,
  hook,
}: {
  org: Organization;
  hook?: {
    actions: {
      updateOrg: (id: string, updates: Partial<Organization>) => void;
    };
  };
}) {
  const { hasPermissionKey } = usePermissions();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const orgPlan = (org.plan || "Starter") as SubscriptionPlan;
  const currentOverrides = org.featureOverrides || {};

  const handleToggleFeature = (featureKey: string, currentEnabled: boolean) => {
    // Handler-level authorization guard
    if (!hasPermissionKey(P.MANAGE_ACCOUNT_MANAGE)) {
      toast.error("Access Denied: You do not have permission to modify organization features.");
      return;
    }

    const def = FEATURE_REGISTRY[featureKey as keyof typeof FEATURE_REGISTRY];
    if (!def) return;

    // Strict Enforcement Check: Cannot enable if plan requirement is not met
    if (!planMeetsRequirement(orgPlan, def.minimumPlan)) {
      toast.error(
        `Cannot enable "${def.name}". Subscription plan "${orgPlan}" does not meet minimum required plan "${def.minimumPlan}".`,
      );
      return;
    }

    const nextOverrides = {
      ...currentOverrides,
      [featureKey]: !currentEnabled,
    };

    if (hook?.actions?.updateOrg) {
      hook.actions.updateOrg(org.id, { featureOverrides: nextOverrides });
      notifyFeatureStateChange();
      toast.success(
        `Feature "${def.name}" ${!currentEnabled ? "enabled" : "disabled"} for ${org.name}.`,
      );
    }
  };

  const featureList = Object.values(FEATURE_REGISTRY);

  const filteredFeatures = featureList.filter((feat) => {
    const matchesSearch =
      feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || feat.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ToggleLeft className="w-5 h-5 text-indigo-600" />
            Tenant Feature Configuration & Overrides
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure feature availability for <strong className="text-gray-900">{org.name}</strong> ({org.plan} Plan).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Plan: {org.plan}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search features by name or key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs w-full focus:outline-none text-gray-800"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-indigo-500 cursor-pointer w-full sm:w-auto"
        >
          <option value="ALL">All Categories</option>
          <option value="Core">Core</option>
          <option value="Beta">Beta</option>
          <option value="Experimental">Experimental</option>
        </select>
      </div>

      {/* Feature Grid */}
      <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredFeatures.map((feat) => {
          const meetsPlan = planMeetsRequirement(orgPlan, feat.minimumPlan);
          const overrideVal = currentOverrides[feat.key];
          const isEnabled = meetsPlan && (overrideVal !== undefined ? overrideVal : feat.defaultEnabled);

          return (
            <div
              key={feat.key}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                !meetsPlan
                  ? "bg-gray-50/60 border-gray-200 opacity-75"
                  : isEnabled
                    ? "bg-white border-indigo-200 shadow-xs hover:shadow-md"
                    : "bg-white border-gray-200 opacity-85"
              }`}
            >
              <div>
                {/* Header Badge & Action */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                    {feat.category} • Req: {feat.minimumPlan}
                  </span>

                  {!meetsPlan ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3" />
                      NOT AVAILABLE BY PLAN
                    </span>
                  ) : isEnabled ? (
                    <PermissionGate
                      requires={P.MANAGE_ACCOUNT_MANAGE}
                      fallback={
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ENABLED
                        </span>
                      }
                    >
                      <button
                        onClick={() => handleToggleFeature(feat.key, true)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ENABLED
                      </button>
                    </PermissionGate>
                  ) : (
                    <PermissionGate
                      requires={P.MANAGE_ACCOUNT_MANAGE}
                      fallback={
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-300 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          DISABLED
                        </span>
                      }
                    >
                      <button
                        onClick={() => handleToggleFeature(feat.key, false)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        DISABLED
                      </button>
                    </PermissionGate>
                  )}
                </div>

                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  {feat.name}
                </h3>
                <code className="text-[11px] text-gray-400 font-mono block mt-0.5">
                  {feat.key}
                </code>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-3">
                  {feat.description}
                </p>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-gray-400">
                <span>Default: {feat.defaultEnabled ? "ON" : "OFF"}</span>
                <span className="font-semibold">
                  {!meetsPlan
                    ? `Upgrade to ${feat.minimumPlan} to unlock`
                    : overrideVal !== undefined
                      ? "Custom Org Override"
                      : "Subscription Default"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
