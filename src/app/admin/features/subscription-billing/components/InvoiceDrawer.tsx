/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  X,
  FileText,
  Download,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { Invoice } from "../types/invoice.types";

interface InvoiceDrawerProps {
  invoice: Invoice;
  onClose: () => void;
  onMarkPaid: (id: string, method: string) => void;
  onRefund: (id: string) => void;
}

const statusConfig: Record<
  string,
  { class: string; icon: React.ElementType; label: string }
> = {
  Paid: {
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    label: "Paid",
  },
  Pending: {
    class: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    label: "Pending",
  },
  Overdue: {
    class: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertTriangle,
    label: "Overdue",
  },
  Cancelled: {
    class: "bg-gray-100 text-gray-600 border-gray-200",
    icon: Ban,
    label: "Cancelled",
  },
  Refunded: {
    class: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Ban,
    label: "Refunded",
  },
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-xs font-medium text-gray-900">{value}</span>
    </div>
  );
}

export function InvoiceDrawer({
  invoice,
  onClose,
  onMarkPaid,
  onRefund,
}: InvoiceDrawerProps) {
  const [paymentMethod, setPaymentMethod] = React.useState(
    "Credit Card •••• 4242",
  );
  const [showPayForm, setShowPayForm] = React.useState(false);
  const cfg = statusConfig[invoice.status] || statusConfig.Pending;
  const StatusIcon = cfg.icon;

  const handleDownload = () => {
    const data = `Invoice: ${invoice.invoiceNumber}\nOrganization: ${invoice.organizationName}\nTotal Amount: $${invoice.totalAmount}\nStatus: ${invoice.status}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoice.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Invoice {invoice.invoiceNumber}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md bg-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Status banner */}
        <div
          className={`mx-5 mt-5 flex items-center gap-2.5 px-4 py-3 rounded-lg border ${cfg.class}`}
        >
          <StatusIcon className="w-4 h-4" />
          <span className="text-xs font-semibold">{cfg.label}</span>
          {invoice.paidDate && (
            <span className="text-[10px] ml-auto opacity-75">
              Paid {invoice.paidDate}
            </span>
          )}
        </div>

        {/* Organization */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {invoice.organizationName}
              </p>
              <p className="text-[11px] text-gray-400 font-mono">
                {invoice.organizationId}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-0.5">
          <InfoRow label="Invoice Number" value={invoice.invoiceNumber} />
          <InfoRow label="Issued Date" value={invoice.issuedDate} />
          <InfoRow label="Due Date" value={invoice.dueDate} />
          <InfoRow label="Currency" value={invoice.currency} />
          {invoice.paymentMethod && (
            <InfoRow label="Payment Method" value={invoice.paymentMethod} />
          )}
        </div>

        {/* Line items */}
        <div className="px-5 py-4 border-t border-gray-100">
          <h4 className="text-[10px] uppercase font-semibold tracking-wide text-gray-400 mb-3">
            Line Items
          </h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] uppercase text-gray-400 font-semibold">
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-right">Price</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-3 py-2 text-gray-700">
                      {item.description}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      ${item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">
                      ${item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax</span>
              <span>${invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-200">
              <span>Total</span>
              <span>${invoice.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Mark as paid form */}
        {(invoice.status === "Pending" || invoice.status === "Overdue") && (
          <div className="px-5 py-4 border-t border-gray-100">
            {!showPayForm ? (
              <button
                onClick={() => setShowPayForm(true)}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark as Paid
              </button>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold tracking-wide text-gray-400">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none"
                    placeholder="e.g. Credit Card •••• 4242"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPayForm(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onMarkPaid(invoice.id, paymentMethod)}
                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button onClick={handleDownload} className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Download className="w-3.5 h-3.5" />
          Download PDF
        </button>
        {invoice.status === "Paid" && (
          <button
            onClick={() => onRefund(invoice.id)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Issue Refund
          </button>
        )}
        <button
          onClick={onClose}
          className="ml-auto px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Close
        </button>
      </div>
      </div>
    </div>
  );
}

export default InvoiceDrawer;
