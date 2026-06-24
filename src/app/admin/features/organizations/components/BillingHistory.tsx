import React, { useState } from "react";
import { Organization } from "../../../types";
import { db } from "../../../mockData";
import { Receipt, CreditCard, ExternalLink, X, CheckCircle2 } from "lucide-react";
import { PLAN_PRICING } from "../types/organization.types";

export function BillingHistory({ org, hook }: { org: Organization, hook?: any }) {
  const subscriptions = db.subscriptions.get().filter(s => s.organizationId === org.id);
  const currentSub = subscriptions[0]; // Assuming first is current

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>(currentSub?.plan || "Starter");

  // Generate fake invoice history for visual purposes
  const invoices = [
    { id: "INV-2026-001", date: "2026-06-01", amount: org.mrr, status: "Paid" },
    { id: "INV-2026-002", date: "2026-05-01", amount: org.mrr, status: "Paid" },
    { id: "INV-2026-003", date: "2026-04-01", amount: org.mrr, status: "Paid" },
  ];

  const handleDownload = (inv: any) => {
    const content = `INVOICE RECEIPT\n\nOrganization: ${org.name}\nInvoice ID: ${inv.id}\nDate: ${inv.date}\nAmount: $${inv.amount.toFixed(2)}\nStatus: ${inv.status}\n\nThank you for your business!`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpgradeConfirm = () => {
    if (hook?.actions?.updatePlan) {
      hook.actions.updatePlan(org.id, selectedPlan as any);
    }
    setIsUpgradeModalOpen(false);
  };

  return (
    <div className="bg-slate-50/50 rounded-2xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden flex flex-col font-medium animate-in fade-in zoom-in-95 duration-200">
      {/* Navigation Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            Billing & Subscriptions
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-semibold">
            Financial records and plan details for {org.name}.
          </p>
        </div>
        {currentSub && (
          <button onClick={() => setIsUpgradeModalOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer">
            Upgrade Plan
          </button>
        )}
      </div>

      <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        <div className="max-w-4xl space-y-6">

      {currentSub ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Subscription</p>
              <h2 className="text-xl font-bold text-gray-900">{currentSub.plan} Plan</h2>
              <p className="text-sm text-gray-500 mt-0.5">Billed {currentSub.billingCycle} • ${currentSub.amount}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500 mb-1">Next billing date</p>
            <p className="text-sm font-bold text-gray-900">{currentSub.renewalDate || "Not scheduled"}</p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
          No active subscription found for this organization.
        </div>
      )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-500" /> Recent Invoices
          </h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Invoice ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-gray-900">{inv.id}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">${inv.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDownload(inv)} className="text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Upgrade Subscription</h2>
                <p className="text-xs text-gray-500 mt-1">Select a new plan for {org.name}.</p>
              </div>
              <button onClick={() => setIsUpgradeModalOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {["Starter", "Professional", "Enterprise"].map((plan) => (
                <div 
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                    selectedPlan === plan ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-gray-900">{plan}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Change to the {plan} plan.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">${PLAN_PRICING[plan] || 0} / mo</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'
                    }`}>
                      {selectedPlan === plan && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setIsUpgradeModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-xl text-sm transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleUpgradeConfirm} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-md">
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
