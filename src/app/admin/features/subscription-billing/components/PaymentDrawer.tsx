/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  X,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
} from "lucide-react";
import { Payment } from "../types/payment.types";

interface PaymentDrawerProps {
  payment: Payment;
  onClose: () => void;
  onRetry: (id: string) => void;
  onRefund: (id: string) => void;
}

const statusConfig: Record<
  string,
  { class: string; icon: React.ElementType; label: string }
> = {
  Success: {
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    label: "Success",
  },
  Failed: {
    class: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
    label: "Failed",
  },
  Pending: {
    class: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
    label: "Pending",
  },
  Refunded: {
    class: "bg-blue-50 text-blue-700 border-blue-200",
    icon: RotateCw,
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

export function PaymentDrawer({
  payment,
  onClose,
  onRetry,
  onRefund,
}: PaymentDrawerProps) {
  const cfg = statusConfig[payment.status] || statusConfig.Pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Payment Details
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
          {payment.failureReason && (
            <span className="text-[10px] ml-auto opacity-75">
              {payment.failureReason}
            </span>
          )}
        </div>

        {/* Amount hero */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-900">
            ${payment.amount.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">{payment.currency}</p>
        </div>

        {/* Organization */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {payment.organizationName}
              </p>
              <p className="text-[11px] text-gray-400">
                Invoice {payment.invoiceNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-0.5">
          <InfoRow
            label="Transaction ID"
            value={
              <span className="font-mono text-[10px]">
                {payment.transactionId}
              </span>
            }
          />
          <InfoRow label="Payment Date" value={payment.paymentDate} />
          <InfoRow label="Method" value={payment.method} />
          {payment.cardLast4 && (
            <InfoRow label="Card" value={`•••• ${payment.cardLast4}`} />
          )}
          <InfoRow label="Invoice" value={payment.invoiceNumber} />
          {payment.failureReason && (
            <InfoRow
              label="Failure Reason"
              value={
                <span className="text-rose-600 font-semibold">
                  {payment.failureReason}
                </span>
              }
            />
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        {payment.status === "Failed" && (
          <button
            onClick={() => onRetry(payment.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Retry Payment
          </button>
        )}
        {payment.status === "Success" && (
          <button
            onClick={() => onRefund(payment.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
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

export default PaymentDrawer;
