/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Payment, PaymentStats, PaymentStatus } from "../types/payment.types";

const SEED_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    invoiceId: "inv-1",
    invoiceNumber: "INV-2026-0001",
    organizationId: "org-1",
    organizationName: "Acme Enterprise",
    amount: 59400,
    currency: "USD",
    status: "Success",
    method: "Credit Card",
    cardLast4: "4242",
    transactionId: "txn_3kP9vXyZ1a2b",
    paymentDate: "2026-01-20",
    failureReason: null,
  },
  {
    id: "pay-2",
    invoiceId: "inv-2",
    invoiceNumber: "INV-2026-0002",
    organizationId: "org-2",
    organizationName: "Apex Global",
    amount: 1320,
    currency: "EUR",
    status: "Success",
    method: "Credit Card",
    cardLast4: "9876",
    transactionId: "txn_8rT2wQmN4c5d",
    paymentDate: "2026-06-12",
    failureReason: null,
  },
  {
    id: "pay-3",
    invoiceId: "inv-3",
    invoiceNumber: "INV-2026-0003",
    organizationId: "org-4",
    organizationName: "Nova Media Ltd",
    amount: 935,
    currency: "GBP",
    status: "Failed",
    method: "Credit Card",
    cardLast4: "1111",
    transactionId: "txn_f5Gj7kLm8n9p",
    paymentDate: "2026-06-02",
    failureReason: "Insufficient funds",
  },
  {
    id: "pay-4",
    invoiceId: "inv-4",
    invoiceNumber: "INV-2026-0004",
    organizationId: "org-7",
    organizationName: "Cyberdyne Systems",
    amount: 4950,
    currency: "USD",
    status: "Success",
    method: "Credit Card",
    cardLast4: "8888",
    transactionId: "txn_q1Rt3sUv5w6x",
    paymentDate: "2026-06-03",
    failureReason: null,
  },
  {
    id: "pay-5",
    invoiceId: "inv-6",
    invoiceNumber: "INV-2026-0006",
    organizationId: "org-10",
    organizationName: "Umbrella Biotech",
    amount: 3850,
    currency: "USD",
    status: "Failed",
    method: "Bank Transfer",
    cardLast4: null,
    transactionId: "txn_y7Zh9aBC1d2e",
    paymentDate: "2026-06-16",
    failureReason: "Account frozen",
  },
  {
    id: "pay-6",
    invoiceId: "inv-1",
    invoiceNumber: "INV-2026-0001",
    organizationId: "org-9",
    organizationName: "Wayne Enterprises",
    amount: 528000,
    currency: "USD",
    status: "Pending",
    method: "Wire Transfer",
    cardLast4: null,
    transactionId: "txn_f3Gh5iJk7l8m",
    paymentDate: "2026-06-20",
    failureReason: null,
  },
];

function getStore(): Payment[] {
  try {
    const item = localStorage.getItem("ems_billing_payments");
    return item ? JSON.parse(item) : SEED_PAYMENTS;
  } catch {
    return SEED_PAYMENTS;
  }
}

function saveStore(payments: Payment[]) {
  localStorage.setItem("ems_billing_payments", JSON.stringify(payments));
}

export const PaymentService = {
  getAll(): Payment[] {
    return getStore();
  },

  getById(id: string): Payment | undefined {
    return getStore().find((p) => p.id === id);
  },

  getByOrganization(orgId: string): Payment[] {
    return getStore().filter((p) => p.organizationId === orgId);
  },

  getByStatus(status: PaymentStatus): Payment[] {
    return getStore().filter((p) => p.status === status);
  },

  getStats(): PaymentStats {
    const payments = getStore();
    const success = payments.filter((p) => p.status === "Success");
    const failed = payments.filter((p) => p.status === "Failed");
    const pending = payments.filter((p) => p.status === "Pending");
    const refunded = payments.filter((p) => p.status === "Refunded");

    return {
      totalCollected: success.reduce((sum, p) => sum + p.amount, 0),
      totalFailed: failed.reduce((sum, p) => sum + p.amount, 0),
      totalPending: pending.reduce((sum, p) => sum + p.amount, 0),
      totalRefunded: refunded.reduce((sum, p) => sum + p.amount, 0),
      successRate: payments.length > 0 ? (success.length / payments.length) * 100 : 0,
    };
  },

  retryPayment(id: string): void {
    const payments = getStore().map((p) =>
      p.id === id
        ? { ...p, status: "Pending" as const, failureReason: null, paymentDate: new Date().toISOString().slice(0, 10) }
        : p
    );
    saveStore(payments);
  },

  issueRefund(id: string): void {
    const payments = getStore().map((p) =>
      p.id === id ? { ...p, status: "Refunded" as const } : p
    );
    saveStore(payments);
  },

  recordPayment(data: Omit<Payment, "id" | "transactionId">): Payment {
    const payments = getStore();
    const newPayment: Payment = {
      ...data,
      id: `pay-${Date.now()}`,
      transactionId: `txn_${Math.random().toString(36).slice(2, 14)}`,
    };
    saveStore([newPayment, ...payments]);
    return newPayment;
  },
};
