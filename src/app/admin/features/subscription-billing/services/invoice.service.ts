/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Invoice, InvoiceStatus, InvoiceStats } from "../types/invoice.types";
import { db } from "../../../../admin/mockData";

const SEED_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-0001",
    subscriptionId: "sub-1",
    organizationId: "org-1",
    organizationName: "Acme Enterprise",
    status: "Paid",
    amount: 54000,
    tax: 5400,
    totalAmount: 59400,
    currency: "USD",
    lineItems: [
      { description: "Enterprise Plan - Annual", quantity: 1, unitPrice: 54000, total: 54000 },
    ],
    issuedDate: "2026-01-15",
    dueDate: "2026-02-15",
    paidDate: "2026-01-20",
    paymentMethod: "Credit Card •••• 4242",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-0002",
    subscriptionId: "sub-2",
    organizationId: "org-2",
    organizationName: "Apex Global",
    status: "Paid",
    amount: 1200,
    tax: 120,
    totalAmount: 1320,
    currency: "EUR",
    lineItems: [
      { description: "Growth Plan - Monthly", quantity: 1, unitPrice: 1200, total: 1200 },
    ],
    issuedDate: "2026-06-10",
    dueDate: "2026-07-10",
    paidDate: "2026-06-12",
    paymentMethod: "Credit Card •••• 9876",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-0003",
    subscriptionId: "sub-4",
    organizationId: "org-4",
    organizationName: "Nova Media Ltd",
    status: "Overdue",
    amount: 850,
    tax: 85,
    totalAmount: 935,
    currency: "GBP",
    lineItems: [
      { description: "Growth Plan - Monthly", quantity: 1, unitPrice: 850, total: 850 },
    ],
    issuedDate: "2026-05-01",
    dueDate: "2026-06-01",
    paidDate: null,
    paymentMethod: null,
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-0004",
    subscriptionId: "sub-6",
    organizationId: "org-7",
    organizationName: "Cyberdyne Systems",
    status: "Paid",
    amount: 4500,
    tax: 450,
    totalAmount: 4950,
    currency: "USD",
    lineItems: [
      { description: "Enterprise Plan - Monthly", quantity: 1, unitPrice: 4500, total: 4500 },
    ],
    issuedDate: "2026-06-01",
    dueDate: "2026-07-01",
    paidDate: "2026-06-03",
    paymentMethod: "Credit Card •••• 8888",
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2026-0005",
    subscriptionId: "sub-7",
    organizationId: "org-9",
    organizationName: "Wayne Enterprises",
    status: "Pending",
    amount: 480000,
    tax: 48000,
    totalAmount: 528000,
    currency: "USD",
    lineItems: [
      { description: "Enterprise Plan - Annual", quantity: 1, unitPrice: 480000, total: 480000 },
    ],
    issuedDate: "2026-09-01",
    dueDate: "2026-10-01",
    paidDate: null,
    paymentMethod: null,
  },
  {
    id: "inv-6",
    invoiceNumber: "INV-2026-0006",
    subscriptionId: "sub-8",
    organizationId: "org-10",
    organizationName: "Umbrella Biotech",
    status: "Overdue",
    amount: 3500,
    tax: 350,
    totalAmount: 3850,
    currency: "USD",
    lineItems: [
      { description: "Enterprise Plan - Monthly", quantity: 1, unitPrice: 3500, total: 3500 },
    ],
    issuedDate: "2026-05-15",
    dueDate: "2026-06-15",
    paidDate: null,
    paymentMethod: null,
  },
];

function getStore(): Invoice[] {
  try {
    const item = localStorage.getItem("ems_billing_invoices");
    return item ? JSON.parse(item) : SEED_INVOICES;
  } catch {
    return SEED_INVOICES;
  }
}

function saveStore(invoices: Invoice[]) {
  localStorage.setItem("ems_billing_invoices", JSON.stringify(invoices));
}

export const InvoiceService = {
  getAll(): Invoice[] {
    return getStore();
  },

  getById(id: string): Invoice | undefined {
    return getStore().find((inv) => inv.id === id);
  },

  getByOrganization(orgId: string): Invoice[] {
    return getStore().filter((inv) => inv.organizationId === orgId);
  },

  getByStatus(status: InvoiceStatus): Invoice[] {
    return getStore().filter((inv) => inv.status === status);
  },

  getStats(): InvoiceStats {
    const invoices = getStore();
    return {
      totalInvoiced: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPaid: invoices.filter((i) => i.status === "Paid").reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalOverdue: invoices.filter((i) => i.status === "Overdue").reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPending: invoices.filter((i) => i.status === "Pending").reduce((sum, inv) => sum + inv.totalAmount, 0),
    };
  },

  markAsPaid(id: string, method: string): void {
    const invoices = getStore().map((inv) =>
      inv.id === id
        ? { ...inv, status: "Paid" as const, paidDate: new Date().toISOString().slice(0, 10), paymentMethod: method }
        : inv
    );
    saveStore(invoices);
  },

  markAsOverdue(id: string): void {
    const invoices = getStore().map((inv) =>
      inv.id === id ? { ...inv, status: "Overdue" as const } : inv
    );
    saveStore(invoices);
  },

  issueRefund(id: string): void {
    const invoices = getStore().map((inv) =>
      inv.id === id ? { ...inv, status: "Refunded" as const } : inv
    );
    saveStore(invoices);
  },

  generateInvoice(orgId: string, subId: string, amount: number, description: string): Invoice {
    const invoices = getStore();
    const orgs = db.organizations.get();
    const org = orgs.find((o) => o.id === orgId);
    const tax = Math.round(amount * 0.1);
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, "0")}`,
      subscriptionId: subId,
      organizationId: orgId,
      organizationName: org?.name || "Unknown",
      status: "Pending",
      amount,
      tax,
      totalAmount: amount + tax,
      currency: "USD",
      lineItems: [{ description, quantity: 1, unitPrice: amount, total: amount }],
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      paidDate: null,
      paymentMethod: null,
    };
    saveStore([newInvoice, ...invoices]);
    return newInvoice;
  },
};
