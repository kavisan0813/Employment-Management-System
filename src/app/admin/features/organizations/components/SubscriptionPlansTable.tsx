import React, { useState } from "react";
import { Check, Star, MoreVertical, ShieldAlert, Calendar, Package } from "lucide-react";
import { useOrganizations } from "../hooks/useOrganizations";
import { OrganizationService } from "../services/organization.service";
import { PlanService } from "../../subscription-billing/services/plan.service";

export function SubscriptionPlansTable() {
  const hook = useOrganizations();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const activePlans = PlanService.getAll().filter(p => p.status === "Active");
  
  const plans = activePlans.map(p => ({
    name: p.name,
    employees: p.maxUsers === 99999 ? "Unlimited Employees" : `${p.maxUsers} Employees`,
    features: p.features.filter(f => f.included).map(f => f.name),
    isPopular: p.tier === "Growth",
    tier: p.tier
  }));

  const subscriptions = OrganizationService.getSubscriptions();

  // Mapping subs to organizations
  const tableData = subscriptions.map(sub => {
    const org = hook.orgs.find(o => o.id === sub.organizationId);

    return {
      subId: sub.id,
      orgId: sub.organizationId,
      orgName: org?.name || sub.organization,
      plan: sub.plan,
      start: sub.startDate,
      expiry: sub.renewalDate || "N/A",
      status: sub.status
    };
  });

  const handleUpgrade = (orgId: string, newPlan: string) => {
    hook.actions.updatePlan(orgId, newPlan as any);
    setOpenMenuId(null);
  };

  const handleExtend = (orgId: string, months: number) => {
    hook.actions.extendSub(orgId, months);
    setOpenMenuId(null);
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Subscription Plans
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Manage feature sets, pricing tiers, and monitor organization subscriptions.
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-12">
      
      {/* Plan Master Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">Available Plans</h2>
          <p className="text-xs text-gray-500 mt-1">Features and pricing tiers available to tenants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div key={plan.name} className={`relative bg-white rounded-3xl p-8 border ${plan.isPopular ? 'border-indigo-500 shadow-xl' : 'border-gray-200 shadow-sm'}`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-white" /> POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name} Plan</h3>
              <p className="text-sm font-semibold text-indigo-600 mb-6">{plan.employees}</p>
              
              <div className="space-y-4">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Table Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">Active Subscriptions</h2>
          <p className="text-xs text-gray-500 mt-1">Overview of organization subscriptions and lifecycle management.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-visible">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableData.map(row => (
                  <tr key={row.subId} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900">{row.orgName}</td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">{row.plan}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{row.start}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{row.expiry}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === row.subId ? null : row.subId)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openMenuId === row.subId && (
                        <>
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-8 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            
                            {/* Upgrade / Downgrade Logic */}
                            {(() => {
                              // Find current plan index in sorted activePlans
                              const sortedPlans = [...activePlans].sort((a, b) => a.monthlyPrice - b.monthlyPrice);
                              const currentIndex = sortedPlans.findIndex(p => p.name === row.plan || p.tier === row.plan);
                              const nextPlan = currentIndex >= 0 && currentIndex < sortedPlans.length - 1 ? sortedPlans[currentIndex + 1] : null;
                              const prevPlan = currentIndex > 0 ? sortedPlans[currentIndex - 1] : null;

                              return (
                                <>
                                  {nextPlan && (
                                    <div className="px-3 py-1.5">
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-1">Upgrade Plan</span>
                                      <button onClick={() => handleUpgrade(row.orgId, nextPlan.name)} className="w-full text-left px-3 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer">
                                        {row.plan} → {nextPlan.name}
                                      </button>
                                    </div>
                                  )}
                                  {prevPlan && nextPlan && <div className="my-1 border-t border-gray-100" />}
                                  {prevPlan && (
                                    <div className="px-3 py-1.5">
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-1">Downgrade Plan</span>
                                      <button onClick={() => handleUpgrade(row.orgId, prevPlan.name)} className="w-full text-left px-3 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 hover:text-rose-600 rounded-lg transition-colors cursor-pointer">
                                        {row.plan} → {prevPlan.name}
                                      </button>
                                    </div>
                                  )}
                                </>
                              );
                            })()}

                            <div className="my-1 border-t border-gray-100" />
                            
                            {/* Extend Subscription Logic */}
                            <div className="px-3 py-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-1">Extend Subscription</span>
                              <button onClick={() => handleExtend(row.orgId, 1)} className="w-full text-left px-3 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                                <Calendar className="w-4 h-4 text-gray-400" /> +1 Month
                              </button>
                              <button onClick={() => handleExtend(row.orgId, 6)} className="w-full text-left px-3 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                                <Calendar className="w-4 h-4 text-gray-400" /> +6 Months
                              </button>
                              <button onClick={() => handleExtend(row.orgId, 12)} className="w-full text-left px-3 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                                <Calendar className="w-4 h-4 text-gray-400" /> +1 Year
                              </button>
                            </div>

                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
