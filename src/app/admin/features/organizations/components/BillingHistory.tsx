import React from "react";
import { Organization } from "../../../types";
import { db } from "../../../mockData";
import { Receipt, CreditCard, ExternalLink } from "lucide-react";

export function BillingHistory({ org }: { org: Organization }) {
  const subscriptions = db.subscriptions.get().filter(s => s.organizationId === org.id);
  const currentSub = subscriptions[0]; // Assuming first is current

  // Generate fake invoice history for visual purposes
  const invoices = [
    { id: "INV-2026-001", date: "2026-06-01", amount: org.mrr, status: "Paid" },
    { id: "INV-2026-002", date: "2026-05-01", amount: org.mrr, status: "Paid" },
    { id: "INV-2026-003", date: "2026-04-01", amount: org.mrr, status: "Paid" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Billing & Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">Financial records and plan details for {org.name}.</p>
        </div>
        {currentSub && (
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm">
            Upgrade Plan
          </button>
        )}
      </div>

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

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden mt-8">
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
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
