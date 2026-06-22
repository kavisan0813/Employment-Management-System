/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Cancelled" | "Refunded";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  subscriptionId: string;
  organizationId: string;
  organizationName: string;
  status: InvoiceStatus;
  amount: number;
  tax: number;
  totalAmount: number;
  currency: string;
  lineItems: InvoiceLineItem[];
  issuedDate: string;
  dueDate: string;
  paidDate: string | null;
  paymentMethod: string | null;
}

export interface InvoiceStats {
  totalInvoiced: number;
  totalPaid: number;
  totalOverdue: number;
  totalPending: number;
}
