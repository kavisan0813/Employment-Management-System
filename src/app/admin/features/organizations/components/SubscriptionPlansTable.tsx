import React, { useState } from "react";
import { Check, Star, MoreVertical, Calendar, Package, X, ArrowUp, ArrowDown } from "lucide-react";
import { useOrganizations } from "../hooks/useOrganizations";
import { OrganizationService } from "../services/organization.service";
import { PlanService } from "../../subscription-billing/services/plan.service";

interface SubscriptionRow {
  subId: string;
  orgId: string;
  orgName: string;
  plan: string;
  start: string;
  expiry: string;
  status: string;
}

export function SubscriptionPlansTable() {
  const hook = useOrganizations();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activePlans = PlanService.getAll().filter(p => p.status === "Active");
  
  const plans = activePlans.map(p => ({
    name: p.name,
    employees: p.maxUsers === 99999 ? "Unlimited Employees" : `${p.maxUsers} Employees`,
    features: p.features.filter(f => f.included).map(f => f.name),
    isPopular: p.tier === "Growth",
    tier: p.tier
  }));

  const subscriptions = OrganizationService.getSubscriptions();

  const tableData: SubscriptionRow[] = subscriptions.map(sub => {
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
    if (selectedSubscription?.orgId === orgId) {
      setSelectedSubscription({ ...selectedSubscription, plan: newPlan });
    }
  };

  // ==================== FIXED EXTEND FUNCTION ====================
  const handleExtend = (orgId: string, months: number) => {
    hook.actions.extendSub(orgId, months); // Call your original service

    if (selectedSubscription && selectedSubscription.orgId === orgId) {
      const currentExpiry = new Date(selectedSubscription.expiry);
      currentExpiry.setMonth(currentExpiry.getMonth() + months);
      
      const newExpiry = currentExpiry.toISOString().split('T')[0]; // YYYY-MM-DD format

      setSelectedSubscription({
        ...selectedSubscription,
        expiry: newExpiry,
        status: "Active"
      });
    }
  };

  const openSubscriptionModal = (row: SubscriptionRow) => {
    setSelectedSubscription(row);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleConfirm = () => {
    alert("Subscription changes confirmed successfully!");
    closeModal();
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

          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
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
                    <tr 
                      key={row.subId} 
                      onClick={() => openSubscriptionModal(row)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
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
                      <td className="px-6 py-4 text-right relative" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => openSubscriptionModal(row)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ====================== CENTERED MODAL ====================== */}
      {isModalOpen && selectedSubscription && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Subscription Details</h2>
                <p className="text-gray-500 mt-1">{selectedSubscription.orgName}</p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Organization</p>
                  <p className="font-semibold text-lg">{selectedSubscription.orgName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Current Plan</p>
                  <p className="font-semibold text-lg text-indigo-600">{selectedSubscription.plan}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Start Date</p>
                  <p className="font-medium">{selectedSubscription.start}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Expiry Date</p>
                  <p className="font-medium text-emerald-600">{selectedSubscription.expiry}</p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Status</p>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
                  selectedSubscription.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {selectedSubscription.status}
                </span>
              </div>

              {/* Manage Actions */}
              <div className="pt-6 border-t">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">Manage Subscription</p>
                
                <div className="space-y-6">
                  {/* Upgrade / Downgrade */}
                  {(() => {
                    const sortedPlans = [...activePlans].sort((a, b) => a.monthlyPrice - b.monthlyPrice);
                    const currentIndex = sortedPlans.findIndex(p => p.name === selectedSubscription.plan);
                    const nextPlan = currentIndex >= 0 && currentIndex < sortedPlans.length - 1 ? sortedPlans[currentIndex + 1] : null;
                    const prevPlan = currentIndex > 0 ? sortedPlans[currentIndex - 1] : null;

                    return (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-3">CHANGE PLAN</p>
                        <div className="flex flex-col gap-2">
                          {nextPlan && (
                            <button 
                              onClick={() => handleUpgrade(selectedSubscription.orgId, nextPlan.name)}
                              className="flex items-center justify-between w-full px-5 py-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-all text-left group"
                            >
                              <div className="flex items-center gap-3">
                                <ArrowUp className="w-5 h-5 text-indigo-600" />
                                <div>
                                  <p className="font-semibold">Upgrade to {nextPlan.name}</p>
                                  <p className="text-xs text-gray-500">Next tier</p>
                                </div>
                              </div>
                              <span className="text-indigo-600 text-sm font-medium">→</span>
                            </button>
                          )}
                          {prevPlan && (
                            <button 
                              onClick={() => handleUpgrade(selectedSubscription.orgId, prevPlan.name)}
                              className="flex items-center justify-between w-full px-5 py-4 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all text-left group"
                            >
                              <div className="flex items-center gap-3">
                                <ArrowDown className="w-5 h-5 text-rose-600" />
                                <div>
                                  <p className="font-semibold">Downgrade to {prevPlan.name}</p>
                                  <p className="text-xs text-gray-500">Previous tier</p>
                                </div>
                              </div>
                              <span className="text-rose-600 text-sm font-medium">→</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Extend Subscription - Now Working */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-3">EXTEND SUBSCRIPTION</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => handleExtend(selectedSubscription.orgId, 1)}
                        className="px-4 py-4 bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-2xl transition-all text-center"
                      >
                        <div className="text-lg font-semibold">+1</div>
                        <div className="text-xs text-gray-500">Month</div>
                      </button>
                      <button 
                        onClick={() => handleExtend(selectedSubscription.orgId, 6)}
                        className="px-4 py-4 bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-2xl transition-all text-center"
                      >
                        <div className="text-lg font-semibold">+6</div>
                        <div className="text-xs text-gray-500">Months</div>
                      </button>
                      <button 
                        onClick={() => handleExtend(selectedSubscription.orgId, 12)}
                        className="px-4 py-4 bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-2xl transition-all text-center"
                      >
                        <div className="text-lg font-semibold">+12</div>
                        <div className="text-xs text-gray-500">Months</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirm}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors"
              >
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}