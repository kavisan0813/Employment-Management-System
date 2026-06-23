/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PaymentStatus = "Success" | "Failed" | "Pending" | "Refunded";
export type PaymentMethod = "Credit Card" | "Bank Transfer" | "PayPal" | "Wire Transfer";

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  organizationId: string;
  organizationName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  cardLast4: string | null;
  transactionId: string;
  paymentDate: string;
  failureReason: string | null;
}

export interface PaymentStats {
  totalCollected: number;
  totalFailed: number;
  totalPending: number;
  totalRefunded: number;
  successRate: number;
}
